"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import SimpleHeader from "../components/SimpleHeader";
// import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase";
import QrScanner from "qr-scanner";

export default function CheckinPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [verifying, setVerifying] = useState(false);
  const [notif, setNotif] = useState<null | { type: "success" | "error" | "info" | "warning"; message: string }>(null);
  const [showModal, setShowModal] = useState(false);

  // Event management states (hardcoded single event)
  interface TicketData {
    id: string;
    code: string;
    used: boolean;
    used_at: string | null;
    created_at: string;
    orderItem: OrderItem;
  }
  
  interface OrderItem {
    id: string;
    order_id: string;
    ticket_id: string;
    quantity: number;
    price: string;
    order: {
      id: string;
      status: string;
      created_at: string;
      user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
      };
    };
    ticket: {
      id: string;
      name: string;
      price: string;
      description: string;
    };
    codes: Array<{
      id: string;
      code: string;
      used: boolean;
      used_at: string | null;
      created_at: string;
    }>;
  }

  interface CheckinLog {
    id: string;
    checkin_time: string;
    verified_by: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    ticket: {
      name: string;
    };
    event: {
      title: string;
    };
    order_id: string;
    notes?: string;
  }

  const [selectedEventId] = useState<string>("cmoi4vq3m02jzo912nj53v59l");
  const [ticketMap, setTicketMap] = useState<Map<string, TicketData>>(new Map());
  const [lastTicketData, setLastTicketData] = useState<TicketData | null>(null);
  const [lastCheckinInfo, setLastCheckinInfo] = useState<{ verifiedBy?: string; checkinTime?: string } | null>(null);
  const [nowTime, setNowTime] = useState<string>("");
  const [ticketsReady, setTicketsReady] = useState<boolean>(false);

  const API_BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL, []);

  // QR scanner states
  const [isScanning, setIsScanning] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const lastScannedCodeRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);

  // Redirect if not logged in (follow ticket/page.tsx pattern)
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login?redirectTo=/checkin");
    }
  }, [user, loading, router]);

  // Verify with backend and enforce non-USER role
  useEffect(() => {
    const checkBackendAuth = async () => {
      if (!user) return; // handled by redirect effect
      if (!API_BASE_URL) {
        setAuthError("Thiếu cấu hình API. Vui lòng thiết lập NEXT_PUBLIC_API_BASE_URL.");
        setCheckingAuth(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (!accessToken) {
          router.replace("/auth/login?redirectTo=/checkin");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          window.alert("Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!");
          await signOut();
          router.replace("/auth/login?redirectTo=/checkin");
          return;
        }

        const body = (await res.json()) as unknown;
        // Accept flexible shapes: { role }, { data: { role } }, { user: { role } }, { roles: string[] }
        const obj = (typeof body === "object" && body !== null) ? (body as Record<string, unknown>) : {};
        const directRole = typeof obj.role === "string" ? obj.role : undefined;
        const dataRole = (typeof obj.data === "object" && obj.data !== null && typeof (obj.data as Record<string, unknown>).role === "string")
          ? (obj.data as Record<string, unknown>).role as string
          : undefined;
        const userRole = (typeof obj.user === "object" && obj.user !== null && typeof (obj.user as Record<string, unknown>).role === "string")
          ? (obj.user as Record<string, unknown>).role as string
          : undefined;
        const rolesArr = Array.isArray((obj as Record<string, unknown>).roles) ? (obj as Record<string, unknown>).roles as unknown[] : undefined;
        const arrayRole = rolesArr && typeof rolesArr[0] === "string" ? (rolesArr[0] as string) : undefined;
        const extractedRole: string | undefined = directRole || dataRole || userRole || arrayRole;

        if (!extractedRole || String(extractedRole).toUpperCase() === "USER") {
          window.alert("Bạn không có quyền truy cập trang check-in.");
          router.replace("/OCX5");
          return;
        }

        setAuthError(null);
      } catch {
        window.alert("Không thể xác thực tài khoản với hệ thống backend! Vui lòng đăng nhập lại.");
        await signOut();
        router.replace("/auth/login?redirectTo=/checkin");
      } finally {
        setCheckingAuth(false);
      }
    };

    if (user) {
      setCheckingAuth(true);
      checkBackendAuth();
    }
  }, [user, signOut, router, API_BASE_URL]);

  // Removed events fetching (hardcoded event)

  // Fetch ticket data for the hardcoded event
  useEffect(() => {
    const fetchTicketData = async () => {
      if (!selectedEventId || !API_BASE_URL) return;
      
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (!accessToken) return;

        // Fetch ticket items for the event
        const res = await fetch(`${API_BASE_URL}/orders/event/${selectedEventId}/items`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          
          // Create ticket map for O(1) lookup
          const newTicketMap = new Map<string, TicketData>();
          data.items?.forEach((item: OrderItem) => {
            item.codes?.forEach((code) => {
              newTicketMap.set(code.code, {
                id: code.id,
                code: code.code,
                used: code.used,
                used_at: code.used_at,
                created_at: code.created_at,
                orderItem: item
              });
            });
          });
          
          setTicketMap(newTicketMap);
          setTicketsReady(true);
          // No event stats UI; skip stats aggregation
        }
      } catch {
        // Handle error silently for now
      }
    };

    fetchTicketData();
  }, [selectedEventId, API_BASE_URL]);

  // Check camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoExists = devices.some((d) => d.kind === "videoinput");
        setHasCamera(videoExists);
      } catch {
        setHasCamera(false);
      }
    };
    checkCamera();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, []);

  // Live clock
  useEffect(() => {
    const update = () => setNowTime(new Date().toLocaleString("vi-VN", { hour12: false }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  // Note: We don't stop/start the scanner to avoid performance issues
  // Instead, we just block processing in handleQRCodeDetected

  const handleQRCodeDetected = (text: string) => {
    // Don't process if modal is showing or verifying
    if (showModal || verifying) return;
    
    const now = Date.now();
    const isDup = lastScannedCodeRef.current === text && now - lastScanTimeRef.current < 1500;
    if (!text || isDup) return;
    lastScannedCodeRef.current = text;
    lastScanTimeRef.current = now;
    setScannedCode(text);
    // auto verify
    handleVerify(text);
    if (navigator?.vibrate) navigator.vibrate(50);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);
      setVideoReady(false);

      // Ensure previous instances are cleaned
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }

      // Wait a tick to ensure video is mounted
      await new Promise((r) => setTimeout(r, 50));
      if (!videoRef.current) {
        throw new Error("Camera interface not ready. Please try again.");
      }

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          if (typeof result?.data === "string") handleQRCodeDetected(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment",
          maxScansPerSecond: 8,
          returnDetailedScanResult: true,
        }
      );

      await qrScannerRef.current.start();
      setVideoReady(true);
    } catch (e) {
      let msg = "Không thể khởi động camera.";
      if (e && typeof e === "object") {
        const err = e as { name?: string; message?: string };
        if (err.name === "NotAllowedError") msg = "Truy cập camera bị từ chối. Hãy cho phép quyền camera.";
        else if (err.name === "NotFoundError") msg = "Không tìm thấy thiết bị camera.";
        else if (err.name === "NotReadableError") msg = "Camera đang được dùng bởi ứng dụng khác.";
        else if (err.message) msg = err.message;
      }
      setCameraError(msg);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    try {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        // Reload to clear frame
        try { videoRef.current.load?.(); } catch {}
      }
    } finally {
      setIsScanning(false);
      setVideoReady(false);
      setCameraError(null);
      lastScannedCodeRef.current = "";
      lastScanTimeRef.current = 0;
    }
  };

  const handleVerify = async (rawCode?: string) => {
    const codeToVerify = (rawCode ?? scannedCode).trim();
    if (!codeToVerify || !API_BASE_URL || !selectedEventId) return;
    
    // Block if modal is already showing
    if (showModal) return;
    
    setVerifying(true);
    setNotif(null);
    
    try {
      // First, check if ticket exists in our local map
      let ticketData = ticketMap.get(codeToVerify);
      let actualCode = codeToVerify;
      
      // If not found in map, try to extract prefix and search again
      if (!ticketData) {
        const prefix = codeToVerify.split('_')[0];
        if (prefix && prefix !== codeToVerify) {
          ticketData = ticketMap.get(prefix);
          actualCode = prefix;
        }
      }
      
      if (!ticketData) {
        setLastTicketData(null);
        setNotif({ type: "error", message: "Mã vé không hợp lệ hoặc không tìm thấy. Liên hệ bàn thông tin để hỗ trợ chi tiết." });
        setShowModal(true);
        return;
      }

      // Check if ticket is already used
      if (ticketData.used) {
        setLastTicketData(ticketData);
        
        // Try to get check-in log from API
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;
          
          if (accessToken) {
            // Get check-in logs for this event
            const logRes = await fetch(`${API_BASE_URL}/checkin/logs?eventId=${selectedEventId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });
            
            if (logRes.ok) {
              const logs = await logRes.json() as CheckinLog[];
              // Find the log for this specific order
              const ticketLog = logs.find((log: CheckinLog) => 
                log.order_id === ticketData.orderItem.order_id
              );
              
              if (ticketLog) {
                setLastCheckinInfo({
                  verifiedBy: ticketLog.verified_by,
                  checkinTime: ticketLog.checkin_time
                });
              } else {
                setLastCheckinInfo({
                  verifiedBy: "system",
                  checkinTime: ticketData.used_at || undefined
                });
              }
            } else {
              setLastCheckinInfo({
                verifiedBy: "system",
                checkinTime: ticketData.used_at || undefined
              });
            }
          } else {
            setLastCheckinInfo({
              verifiedBy: "system",
              checkinTime: ticketData.used_at || undefined
            });
          }
        } catch {
          setLastCheckinInfo({
            verifiedBy: "system",
            checkinTime: ticketData.used_at || undefined
          });
        }
        
        setNotif({ type: "warning", message: "Vé đã được check-in trước đó." });
        setShowModal(true);
        return;
      }

      // Call API to verify and check-in (only for unused tickets)
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        router.replace("/auth/login?redirectTo=/checkin");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/checkin/verify-qr`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode: actualCode,
          checkedBy: user?.email || "system",
        }),
      });

      const body = await res.json().catch(() => ({}));
      
      // Debug log
      console.log("API Response:", { status: res.status, body, success: body?.success });
      
      if (!res.ok) {
        const message =
          body?.message ||
          (res.status === 404
            ? "Mã vé không hợp lệ hoặc không tìm thấy."
            : "Xác thực thất bại.");
        setNotif({ type: "error", message: message + " Liên hệ bàn thông tin để hỗ trợ chi tiết." });
        setShowModal(true);
        return;
      }

      const success = !!body?.success;
      const msg = body?.message || (success ? "Check-in thành công" : "Xác thực hoàn tất");
      setLastTicketData(ticketData);
      
      // Store check-in info from API response
      setLastCheckinInfo({
        verifiedBy: body?.data?.verifiedBy || user?.email || "system",
        checkinTime: body?.data?.checkinTime || new Date().toISOString()
      });
      
      setNotif({ type: success ? "success" : "info", message: msg });
      setShowModal(true);
      
      // Update local ticket map if successful
      if (success) {
        const updatedTicketMap = new Map(ticketMap);
        const updatedTicket = { ...ticketData, used: true, used_at: new Date().toISOString() };
        updatedTicketMap.set(actualCode, updatedTicket);
        setTicketMap(updatedTicketMap);
      }
    } catch {
      setLastTicketData(null);
      setLastCheckinInfo(null);
      setNotif({ type: "error", message: "Có lỗi xảy ra khi xác thực vé. Liên hệ bàn thông tin để hỗ trợ chi tiết." });
      setShowModal(true);
    } finally {
      setVerifying(false);
    }
  };

  // Avoid full-screen black load; only block when not logged in
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Đang chuyển hướng đăng nhập...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen relative">
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/hero_backround_ss3_alt1.svg)',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.8,
          }}
        />
        <div className="relative z-10">
          <SimpleHeader lang={lang} setLang={setLang} />
          <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 pt-24 sm:pt-28 md:pt-32">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-500 mb-4">{authError}</p>
                </div>
              </div>
            </div>
          </main>
          {/* Footer removed for check-in page */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hero_backround_ss3_alt1.svg)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }}
      />
      <div className="relative z-10">
        <SimpleHeader lang={lang} setLang={setLang} />
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 pt-24 sm:pt-28 md:pt-32">
          <div className="grid grid-cols-1 gap-6 place-items-center w-full">
            <div className="space-y-6 flex flex-col h-full w-full items-center">
              <div className="bg-zinc-900/30 rounded-xl p-5 sm:p-6 shadow-lg backdrop-blur-sm max-w-md sm:max-w-xl w-full mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Check-in</h2>
                {/* Professional Status Header */}
                <div className="mb-4 bg-white/5 border border-white/10 rounded-lg p-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className={`flex items-center justify-center sm:justify-start gap-2 px-2 py-1 rounded-md ${ticketsReady ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                      <span className={`inline-block w-2 h-2 rounded-full ${ticketsReady ? "bg-green-400" : "bg-yellow-400"}`} />
                      <span className={`${ticketsReady ? "text-green-300" : "text-yellow-300"}`}>
                        {ticketsReady ? "Sẵn sàng quét" : "Đang tải dữ liệu vé..."}
                      </span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 px-2 py-1 rounded-md border border-white/10 bg-white/0 text-white/80 truncate">
                      <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v7m0-7a7 7 0 100-14 7 7 0 000 14z" /></svg>
                      <span className="truncate">{user?.email || "system"}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 px-2 py-1 rounded-md border border-white/10 bg-white/0 text-white/80 truncate">
                      <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22a10 10 0 110-20 10 10 0 010 20z" /></svg>
                      <span className="truncate">{nowTime}</span>
                    </div>
                  </div>
                </div>
                {(loading || checkingAuth) && (
                  <div className="mb-6 bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-3 py-2">
                    Đang kiểm tra phiên đăng nhập...
                  </div>
                )}

                <div className="space-y-4">
                  {/* QR Camera Section */}
                  <div className="mt-2">
                    <div className="flex items-center gap-3 mb-3 justify-center">
                      {!isScanning ? (
                        <button
                          onClick={startCamera}
                          disabled={!hasCamera}
                          className="px-4 py-2 rounded-lg bg-green-600/80 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                          Bật camera
                        </button>
                      ) : (
                        <button
                          onClick={stopCamera}
                          className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white w-full sm:w-auto"
                        >
                          Tắt camera
                        </button>
                      )}
                      {!hasCamera && (
                        <span className="text-sm text-red-300">Thiết bị không có camera.</span>
                      )}
                    </div>

                    {cameraError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-300 mb-3">
                        <div className="flex items-center justify-between">
                          <span>{cameraError}</span>
                          <button
                            onClick={() => {
                              setCameraError(null);
                              startCamera();
                            }}
                            className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30"
                          >
                            Thử lại
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
                      <div className="relative w-full aspect-square bg-black/80 rounded-lg overflow-hidden border border-white/10">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ transform: "scaleX(-1)", display: isScanning ? "block" : "none" }}
                        />
                        {isScanning && !videoReady && (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center">
                              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                              <p className="text-sm">Đang khởi động camera...</p>
                            </div>
                          </div>
                        )}
                        {isScanning && videoReady && (
                          <>
                            <div className={`absolute inset-0 border-2 rounded-lg pointer-events-none ${showModal || verifying ? "border-yellow-500/60" : "border-green-500/60"}`}></div>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2">
                              <div className={`flex items-center gap-2 text-white px-2 py-1 rounded-full text-xs ${showModal || verifying ? "bg-yellow-600" : "bg-green-600"}`}>
                                <div className={`w-1.5 h-1.5 bg-white rounded-full ${showModal || verifying ? "" : "animate-pulse"}`}></div>
                                {verifying ? "Đang xác thực..." : showModal ? "Tạm dừng (đang xử lý)" : "Đang quét..."}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                      {/* Inline verifying message to use verifying state */}
                      {verifying && (
                        <div className="mt-3 bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-3 py-2">
                          Đang xác thực...
                        </div>
                      )}
                    </div>

                  {/* Removed inline notifications - now using modal */}
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* Footer removed for check-in page */}
      </div>

      {/* Modal Popup */}
      {showModal && notif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-zinc-900 rounded-2xl p-8 max-w-lg w-full mx-auto shadow-2xl border border-white/10">
            {/* Header with Icon */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                notif.type === "success" ? "bg-green-500/20 border-2 border-green-500/30" :
                notif.type === "error" ? "bg-red-500/20 border-2 border-red-500/30" :
                notif.type === "warning" ? "bg-yellow-500/20 border-2 border-yellow-500/30" :
                "bg-blue-500/20 border-2 border-blue-500/30"
              }`}>
                {notif.type === "success" && (
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {notif.type === "error" && (
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {notif.type === "warning" && (
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
                  </svg>
                )}
                {notif.type === "info" && (
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className={`text-2xl font-bold ${
                notif.type === "success" ? "text-green-400" :
                notif.type === "error" ? "text-red-400" :
                notif.type === "warning" ? "text-yellow-400" :
                "text-blue-400"
              }`}>
                {notif.type === "success" ? "Thành công" : notif.type === "error" ? "Lỗi" : notif.type === "warning" ? "Cảnh báo" : "Thông báo"}
              </h3>
            </div>

            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-white/90 text-lg leading-relaxed">
                {notif.message}
              </p>
            </div>

            {/* Ticket Info: consistent format for all modal types */}
            {lastTicketData && (
              <div className={`mb-8 rounded-lg p-4 text-sm ${
                notif.type === "warning" ? "bg-yellow-500/10 border border-yellow-500/20" :
                notif.type === "error" ? "bg-red-500/10 border border-red-500/20" :
                notif.type === "success" ? "bg-green-500/10 border border-green-500/20" :
                "bg-blue-500/10 border border-blue-500/20"
              }`}>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between"><span className="text-zinc-400">Loại vé:</span><span className="text-white font-medium truncate">{lastTicketData.orderItem?.ticket?.name || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Giá vé:</span><span className="text-white font-medium">{Number(lastTicketData.orderItem?.ticket?.price || lastTicketData.orderItem?.price || 0).toLocaleString()} ₫</span></div>
                  {lastTicketData.used && lastTicketData.used_at && (
                    <>
                      <div className="flex justify-between"><span className="text-zinc-400">Đã check-in lúc:</span><span className="text-white font-medium">{new Date(lastTicketData.used_at).toLocaleString("vi-VN", { hour12: false })}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-400">Check-in cách đây:</span><span className="text-white font-medium">{Math.floor((Date.now() - new Date(lastTicketData.used_at).getTime()) / (1000 * 60))} phút</span></div>
                      <div className="flex justify-between"><span className="text-zinc-400">Check bởi:</span><span className="text-white font-medium truncate">{lastCheckinInfo?.verifiedBy || "system"}</span></div>
                    </>
                  )}
                  <div className="flex justify-between"><span className="text-zinc-400">Khách hàng:</span><span className="text-white font-medium truncate">{lastTicketData.orderItem?.order?.user?.email || "—"}</span></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNotif(null);
                }}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                  notif.type === "success" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : notif.type === "error"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



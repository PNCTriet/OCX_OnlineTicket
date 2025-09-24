"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import SimpleHeader from "../components/SimpleHeader";
import Footer from "../components/Footer";
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
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<
    | null
    | {
        success: boolean;
        message?: string;
        data?: unknown;
      }
  >(null);
  const [notif, setNotif] = useState<null | { type: "success" | "error" | "info"; message: string }>(null);

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
          router.replace("/");
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

  const handleQRCodeDetected = (text: string) => {
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
    if (!codeToVerify || !API_BASE_URL) return;
    setVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);
    try {
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
          qrCode: codeToVerify,
          checkedBy: user?.email || "system",
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          body?.message ||
          (res.status === 404
            ? "Mã vé không hợp lệ hoặc không tìm thấy."
            : "Xác thực thất bại.");
        setVerifyError(message);
        setVerifyResult({ success: false, message });
        setNotif({ type: "error", message });
        return;
      }

      const success = !!body?.success;
      const msg = body?.message || (success ? "Check-in thành công" : "Xác thực hoàn tất");
      setVerifyResult({ success, message: msg, data: body?.data ?? body });
      setNotif({ type: success ? "success" : "info", message: msg });
    } catch {
      setVerifyError("Có lỗi xảy ra khi xác thực vé. Vui lòng thử lại.");
      setNotif({ type: "error", message: "Có lỗi xảy ra khi xác thực vé." });
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
          <Footer />
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
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 pt-24 sm:pt-28 md:pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
              <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-4">Check-in</h2>
                {(loading || checkingAuth) && (
                  <div className="mb-6 bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-3 py-2">
                    Đang kiểm tra phiên đăng nhập...
                  </div>
                )}

                <div className="space-y-4">
                  {/* Removed manual input and verify button for streamlined flow */}

                  {/* QR Camera Section */}
                  <div className="mt-2">
                    <div className="flex items-center gap-3 mb-3">
                      {!isScanning ? (
                        <button
                          onClick={startCamera}
                          disabled={!hasCamera}
                          className="px-4 py-2 rounded-lg bg-green-600/80 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Bật camera
                        </button>
                      ) : (
                        <button
                          onClick={stopCamera}
                          className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white"
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

                    <div className="relative mx-auto w-full max-w-md">
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
                            <div className="absolute inset-0 border-2 border-green-500/60 rounded-lg pointer-events-none"></div>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2">
                              <div className="flex items-center gap-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                Đang quét...
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

                  {verifyError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                      {verifyError}
                    </div>
                  )}

                  {verifyResult && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">
                          {verifyResult.success ? "Xác thực thành công" : "Xác thực thất bại"}
                        </div>
                        {verifyResult.message && (
                          <div className="text-sm text-white/70">{verifyResult.message}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {notif && (
                    <div
                      className={
                        notif.type === "success"
                          ? "bg-green-500/10 border border-green-500/20 text-green-300 rounded-lg p-3"
                          : notif.type === "error"
                          ? "bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg p-3"
                          : "bg-white/5 border border-white/10 text-white/80 rounded-lg p-3"
                      }
                    >
                      {notif.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}



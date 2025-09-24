"use client";
import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/apiConfig";
import {
  IconQrcode,
  IconSearch,
  IconCheck,
  IconX,
  IconUser,
  IconTicket,
  IconCalendar,
  IconCamera,
  IconCameraOff,
} from "@tabler/icons-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import QrScanner from "qr-scanner";

// --- Types ---
interface TicketCode {
  id: string;
  code: string;
  used: boolean;
  used_at: string | null;
  created_at: string;
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
  codes: TicketCode[];
}

interface EventTicketData {
  event_id: string;
  event_name: string;
  total_items: number;
  items: OrderItem[];
}

interface Event {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

// Toast Notification Component
function Toast({
  open,
  message,
  type,
  onClose,
}: {
  open: boolean;
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}) {
  if (!open) return null;
  
  const getToastStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "warning":
        return "bg-yellow-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${getToastStyle()}`}
    >
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white font-bold"
      >
        ×
      </button>
    </div>
  );
}

export default function CheckinPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [ticketData, setTicketData] = useState<EventTicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Checkin states
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [foundTicket, setFoundTicket] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkinLogs, setCheckinLogs] = useState<any[]>([]);
  const [showCheckinLogs, setShowCheckinLogs] = useState(false);
  const [checkinStats, setCheckinStats] = useState<any>(null);

  // Camera states
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const lastScannedCodeRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);
  const ticketMapRef = useRef<Map<string, any>>(new Map());

  // Check if user has permission to access this page
  const isAuthorized =
    user?.role && ["SUPERADMIN", "OWNER_ORGANIZER"].includes(user.role);

  // Toast state
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
  }>({ open: false, message: "", type: "success" });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);

  function showToast(message: string, type: "success" | "error" | "warning") {
    setToast({ open: true, message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(
      () => setToast((t) => ({ ...t, open: false })),
      3000
    );
  }

  // Check camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoDevice);
      } catch (error) {
        console.error('Error checking camera:', error);
        setHasCamera(false);
      }
    };

    checkCamera();
  }, []);

  // Ensure video element is ready
  useEffect(() => {
    if (videoRef.current) {
      console.log('Video element is ready');
    }
  }, [isScanning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
      if (toastTimeout.current) {
        clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  // Create ticket map for O(1) lookup
  useEffect(() => {
    if (ticketData) {
      const ticketMap = new Map();
      ticketData.items.forEach(item => {
        item.codes.forEach(code => {
          ticketMap.set(code.code.toLowerCase(), { ...code, orderItem: item });
        });
      });
      ticketMapRef.current = ticketMap;
      console.log(`Created ticket map with ${ticketMap.size} codes`);
    }
  }, [ticketData]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token =
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || "Error fetching events");
        showToast(err.message || "Error fetching events", "error");
      }
    };

    fetchEvents();
  }, []);

  // Fetch ticket codes by event
  const fetchTicketCodes = async (eventId: string) => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token");

      const res = await fetch(`${API_BASE_URL}/orders/event/${eventId}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch ticket codes");

      const data = await res.json();
      setTicketData(data);
    } catch (err: any) {
      const errorMessage = err.message || "Error fetching ticket codes";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle event selection
  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    if (eventId) {
      fetchTicketCodes(eventId);
      fetchCheckinStats(eventId);
    } else {
      setTicketData(null);
      setCheckinStats(null);
    }
  };

  // Start camera for QR scanning
  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);
      
      // Wait for video element to be available
      let attempts = 0;
      while (!videoRef.current && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!videoRef.current) {
        console.error('Video element not found after waiting');
        throw new Error('Camera interface not ready. Please refresh the page and try again.');
      }
      
      console.log('Video element found, initializing QR scanner...');
      
      // Check if QR scanner is already initialized
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
      
      // Initialize QR scanner
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          handleQRCodeDetected(result.data);
        },
        {
          onDecodeError: (error) => {
            // Silently handle decode errors - they're expected when no QR code is present
            if (error && typeof error === 'object' && 'name' in error && error.name !== 'NotFoundException') {
              console.log('QR decode error:', error.message || 'Unknown error');
            }
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Prefer back camera
          maxScansPerSecond: 10, // Increase scanning frequency for better responsiveness
          returnDetailedScanResult: true, // Get more detailed results
        }
      );
      
      // Start scanning
      await qrScannerRef.current.start();
      setVideoReady(true);
      console.log('QR Scanner started successfully');
      
    } catch (error: any) {
      console.error('Camera error:', error);
      let errorMessage = 'Unable to access camera. Please check permissions.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera device found.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.message.includes('No MultiFormat Readers')) {
        errorMessage = 'QR scanning not supported on this device.';
      } else if (error.message.includes('Video element not available')) {
        errorMessage = 'Camera interface not ready. Please try again.';
      }
      
      setCameraError(errorMessage);
      showToast(errorMessage, 'error');
      setIsScanning(false);
    }
  };


  // Handle QR code detection with debouncing
  const handleQRCodeDetected = (scannedText: string) => {
    const now = Date.now();
    const timeSinceLastScan = now - lastScanTimeRef.current;
    const isSameCode = lastScannedCodeRef.current === scannedText;
    
    // Debounce: ignore same code within 2 seconds
    if (isSameCode && timeSinceLastScan < 2000) {
      console.log('Ignoring duplicate scan within 2 seconds');
      return;
    }
    
    // Validate scanned text
    if (!scannedText || scannedText.trim().length === 0) {
      console.log('Invalid QR code: empty text');
      return;
    }
    
    // Update refs
    lastScannedCodeRef.current = scannedText;
    lastScanTimeRef.current = now;
    
    // Set scanned code and search
    setScannedCode(scannedText);
    searchTicketCode(scannedText);
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log('Stopping camera and cleaning up...');
    
    // Stop QR scanner
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    
    // Reset video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
    
    // Reset all states
    setIsScanning(false);
    setScannedCode("");
    setVideoReady(false);
    setFoundTicket(null);
    setShowSuccessModal(false);
    setCameraError(null);
    lastScannedCodeRef.current = "";
    lastScanTimeRef.current = 0;
    
    console.log('Camera stopped and cleaned up');
  };


  // Search for ticket code using O(1) Map lookup
  const searchTicketCode = (code: string) => {
    if (!ticketMapRef.current || ticketMapRef.current.size === 0) {
      showToast('No ticket data available', 'error');
      return;
    }

    const foundCode = ticketMapRef.current.get(code.toLowerCase());

    if (foundCode) {
      setFoundTicket(foundCode);
      setShowSuccessModal(true);
      
      // Show different toast messages based on ticket status
      if (foundCode.used) {
        showToast('Ticket found but already checked in', 'warning');
      } else {
        showToast('Ticket found!', 'success');
      }
    } else {
      showToast('Ticket not found', 'error');
    }
  };

  // Validate checkin conditions
  const validateCheckin = (orderItem: any, scannedCode: string) => {
    // Check if ticket is already used
    const foundCode = orderItem.codes.find((code: any) => code.code === scannedCode);
    if (foundCode && foundCode.used) {
      showToast('This ticket has already been checked in', 'error');
      return false;
    }

    return true;
  };

  // Perform actual checkin via API
  const performCheckin = async (ticketCode: string, orderItem: any) => {
    // Validate before proceeding
    if (!validateCheckin(orderItem, ticketCode)) {
      return false;
    }

    setIsCheckingIn(true);
    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) {
        showToast('Authentication required', 'error');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/checkin/verify-qr`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qrCode: ticketCode,
          checkedBy: user?.email || 'system'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Check-in successful!', 'success');
        
        // Update local ticket map to reflect checkin status
        if (ticketMapRef.current.has(ticketCode.toLowerCase())) {
          const updatedCode = { ...ticketMapRef.current.get(ticketCode.toLowerCase()) };
          updatedCode.used = true;
          updatedCode.used_at = new Date().toISOString();
          ticketMapRef.current.set(ticketCode.toLowerCase(), updatedCode);
        }
        
        // Refresh ticket data to get updated status
        if (selectedEventId) {
          await fetchTicketCodes(selectedEventId);
          await fetchCheckinStats(selectedEventId);
        }
        
        return true;
      } else {
        // Handle specific error cases
        let errorMessage = result.message || 'Check-in failed';
        
        if (response.status === 400) {
          if (result.message?.includes('already been checked in')) {
            errorMessage = 'This ticket has already been checked in';
          }
        } else if (response.status === 404) {
          errorMessage = 'Ticket not found or invalid QR code';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to check-in tickets';
        }
        
        showToast(errorMessage, 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Checkin error:', error);
      showToast('Check-in failed: ' + (error.message || 'Unknown error'), 'error');
      return false;
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Handle manual search
  const handleManualSearch = () => {
    if (searchTerm.trim()) {
      searchTicketCode(searchTerm.trim());
    }
  };

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setFoundTicket(null);
    setScannedCode("");
  };

  // Fetch checkin logs
  const fetchCheckinLogs = async (eventId: string) => {
    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/checkin/logs?eventId=${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch checkin logs");

      const data = await res.json();
      setCheckinLogs(data);
    } catch (err: any) {
      console.error('Error fetching checkin logs:', err);
      showToast(err.message || "Error fetching checkin logs", "error");
    }
  };

  // Fetch checkin stats
  const fetchCheckinStats = async (eventId: string) => {
    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/checkin/stats/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch checkin stats");

      const data = await res.json();
      setCheckinStats(data);
    } catch (err: any) {
      console.error('Error fetching checkin stats:', err);
      showToast(err.message || "Error fetching checkin stats", "error");
    }
  };

  return (
    <DashboardLayout>
      <div className="px-2 mx-auto w-full max-w-7xl">
        {!isAuthorized ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <IconQrcode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Access Denied</p>
            <p className="text-sm mt-2">
              You don't have permission to access this page. Only super admin
              and owner organizer can access checkin.
            </p>
          </div>
        ) : (
          <>
            <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <IconQrcode className="w-7 h-7 text-green-500" /> Event Checkin
            </h1>

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-6">
              {/* Event Selection */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="space-y-3">
                  {/* Event Selector */}
                  <div className="w-full">
                    <select
                      value={selectedEventId}
                      onChange={(e) => handleEventChange(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">
                        Select event for checkin
                      </option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manual Search */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter ticket code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                        className="w-full pl-9 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <button
                      onClick={handleManualSearch}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <IconSearch className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Check-in Logs Button */}
                  {selectedEventId && (
                    <button
                      onClick={() => {
                        fetchCheckinLogs(selectedEventId);
                        setShowCheckinLogs(true);
                      }}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <IconTicket className="w-4 h-4 inline mr-2" />
                      View Check-in Logs
                    </button>
                  )}
                </div>
              </div>

              {/* Camera Section */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <h3 className="text-base font-medium text-gray-800 dark:text-white/90 mb-3">
                    QR Code Scanner
                  </h3>
                  
                  {!selectedEventId ? (
                    <div className="py-6 text-gray-500 dark:text-gray-400">
                      <IconCalendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-base font-medium">Select an event first</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Camera Controls */}
                      <div className="flex justify-center gap-3">
                        {!isScanning ? (
                          <button
                            onClick={startCamera}
                            disabled={!hasCamera}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                          >
                            <IconCamera className="w-4 h-4" />
                            Start Camera
                          </button>
                        ) : (
                          <button
                            onClick={stopCamera}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <IconCameraOff className="w-4 h-4" />
                            Stop Camera
                          </button>
                        )}
                      </div>

                      {/* Camera Error */}
                      {cameraError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <IconX className="w-5 h-5 text-red-600" />
                            <p className="text-sm font-medium text-red-800 dark:text-red-400">
                              Camera Error
                            </p>
                          </div>
                          <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                            {cameraError}
                          </p>
                          <button
                            onClick={() => {
                              setCameraError(null);
                              startCamera();
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <IconCamera className="w-4 h-4" />
                            Retry Camera
                          </button>
                        </div>
                      )}


                      {/* Camera Preview */}
                      <div className="relative mx-auto w-full max-w-md">
                        <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            style={{ 
                              transform: 'scaleX(-1)',
                              backgroundColor: '#000',
                              display: isScanning ? 'block' : 'none'
                            }}
                            onLoadStart={() => console.log('Video load started')}
                            onLoadedData={() => console.log('Video data loaded')}
                            onCanPlay={() => console.log('Video can play')}
                            onPlaying={() => console.log('Video is playing')}
                            onError={(e) => console.error('Video error:', e)}
                          />
                            {/* Loading indicator */}
                            {isScanning && !videoReady && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white pointer-events-none">
                                <div className="text-center">
                                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                                  <p className="text-sm">Starting camera...</p>
                                </div>
                              </div>
                            )}
                            
                            {/* QR Scanning Overlay */}
                            {isScanning && videoReady && (
                              <>
                                <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-28 h-28 border-2 border-white rounded-lg">
                                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                                  <div className="flex items-center gap-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                    Scanning...
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                      {/* Scanned Code Display */}
                      {scannedCode && (
                        <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <IconCheck className="w-5 h-5 text-green-600" />
                            <p className="text-sm font-medium text-green-800 dark:text-green-400">
                              QR Code Detected Successfully!
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Scanned Content:
                              </label>
                              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                                <p className="font-mono text-lg font-semibold text-gray-800 dark:text-white break-all">
                                  {scannedCode}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(scannedCode);
                                  showToast('Code copied to clipboard!', 'success');
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              >
                                <IconCheck className="w-4 h-4" />
                                Copy Code
                              </button>
                              <button
                                onClick={() => {
                                  setScannedCode("");
                                  setFoundTicket(null);
                                  setShowSuccessModal(false);
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                              >
                                <IconX className="w-4 h-4" />
                                Clear
                              </button>
                              <button
                                onClick={() => {
                                  setScannedCode("");
                                  setFoundTicket(null);
                                  setShowSuccessModal(false);
                                  showToast('Ready to scan next QR code', 'success');
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                <IconQrcode className="w-4 h-4" />
                                Scan Another
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* No QR Code Detected Message */}
                      {isScanning && !scannedCode && videoReady && (
                        <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <IconQrcode className="w-4 h-4 text-blue-600" />
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                              Waiting for QR Code...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Event Info */}
              {ticketData && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                  <div className="text-center">
                    <h4 className="text-base font-medium text-gray-800 dark:text-white/90 mb-3">
                      {ticketData.event_name}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {ticketData.total_items}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Total
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {ticketData.items.flatMap(item => item.codes).filter(code => code.used).length}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Checked In
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {ticketData.items.flatMap(item => item.codes).filter(code => !code.used).length}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Remaining
                        </div>
                      </div>
                    </div>
                    {checkinStats && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-xs text-green-800 dark:text-green-400">
                          Check-in Rate: <span className="font-semibold">{checkinStats.checkinRate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && foundTicket && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                  <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                      <IconCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                      Checkin Successful!
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Ticket verified and checked in
                    </p>

                    {/* Ticket Information */}
                    <div className="space-y-4 text-left">
                      {/* Ticket Code */}
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                          Ticket Code
                        </label>
                        <div className="bg-white dark:bg-gray-900 p-2 rounded border">
                          <p className="font-mono text-sm font-semibold text-gray-800 dark:text-white break-all">
                            {foundTicket.code}
                          </p>
                        </div>
                      </div>

                      {/* User Information */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                          User Information
                        </label>
                        <div className="flex items-center gap-3">
                          {foundTicket.orderItem.order.user.avatar_url ? (
                            <Image
                              src={foundTicket.orderItem.order.user.avatar_url}
                              alt="avatar"
                              width={40}
                              height={40}
                              className="rounded-full object-cover bg-gray-200"
                            />
                          ) : (
                            <IconUser className="w-10 h-10 text-gray-400" />
                          )}
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              {foundTicket.orderItem.order.user.first_name}{" "}
                              {foundTicket.orderItem.order.user.last_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {foundTicket.orderItem.order.user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Information */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                          Ticket Information
                        </label>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Ticket Type:
                            </span>
                            <span className="text-sm font-medium">
                              {foundTicket.orderItem.ticket.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Price:
                            </span>
                            <span className="text-sm font-medium">
                              {Number(foundTicket.orderItem.ticket.price).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Order ID:
                            </span>
                            <span className="text-sm font-mono text-xs">
                              {foundTicket.orderItem.order.id.substring(0, 12)}...
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Status:
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              {foundTicket.used ? 'Already Used' : 'Valid'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3">
                      {!foundTicket.used ? (
                        <button
                          onClick={async () => {
                            const success = await performCheckin(foundTicket.code, foundTicket.orderItem);
                            if (success) {
                              closeSuccessModal();
                            }
                          }}
                          disabled={isCheckingIn}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isCheckingIn ? (
                            <>
                              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full inline mr-2"></div>
                              Checking in...
                            </>
                          ) : (
                            <>
                              <IconCheck className="w-5 h-5 inline mr-2" />
                              Check-in Ticket
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-center">
                          <IconCheck className="w-5 h-5 inline mr-2" />
                          Already Checked-in
                        </div>
                      )}
                      
                      <button
                        onClick={closeSuccessModal}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Check-in Logs Modal */}
            {showCheckinLogs && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="w-full max-w-4xl rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Check-in Logs
                      </h3>
                      <button
                        onClick={() => setShowCheckinLogs(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <IconX className="w-6 h-6" />
                      </button>
                    </div>

                    {checkinLogs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <IconTicket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No check-ins yet</p>
                        <p className="text-sm mt-2">
                          Check-in logs will appear here once tickets are checked in
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {checkinLogs.map((log: any) => (
                          <div key={log.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                  <IconCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800 dark:text-white">
                                    {log.user?.first_name} {log.user?.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {log.user?.email}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-800 dark:text-white">
                                  {new Date(log.checkin_time).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  by {log.verified_by}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Ticket:</span>
                                <span className="ml-2 font-medium">{log.ticket?.name}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Event:</span>
                                <span className="ml-2 font-medium">{log.event?.title}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Order:</span>
                                <span className="ml-2 font-mono text-xs">{log.order_id?.substring(0, 8)}...</span>
                              </div>
                            </div>
                            {log.notes && (
                              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Notes:</span>
                                <span className="ml-2">{log.notes}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Toast Notification */}
            <Toast
              open={toast.open}
              message={toast.message}
              type={toast.type}
              onClose={() => setToast((t) => ({ ...t, open: false }))}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

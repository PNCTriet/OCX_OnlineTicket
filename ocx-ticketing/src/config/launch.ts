// Launch configuration
export const LAUNCH_CONFIG = {
  /** Thời điểm mở bán / mở site (đã qua → isSiteLaunched() = true). */
  LAUNCH_TIME: "2026-05-01T00:00:00+07:00",

  EVENT_INFO: {
    name: "Ớt Cay Xè Hà Nội",
    description: "OCX indie show | Sự kiện âm nhạc India",
    date: "08/2026 · 15:00",
    location: "Thủ Đô Hà Nội",
    organizer: "Ớt Cay Xè Organization",
  },
  
  // Brand information
  BRAND: {
    name: "Ớt Cay Xè",
    description: "Hệ thống đặt vé trực tuyến",
    color: "#c53e00"
  }
};

// Helper function to check if site is launched
export function isSiteLaunched(): boolean {
  const now = new Date();
  const launchDate = new Date(LAUNCH_CONFIG.LAUNCH_TIME);
  return now >= launchDate;
}

// Helper function to get time until launch
export function getTimeUntilLaunch() {
  const now = new Date();
  const launchDate = new Date(LAUNCH_CONFIG.LAUNCH_TIME);
  const difference = launchDate.getTime() - now.getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
} 
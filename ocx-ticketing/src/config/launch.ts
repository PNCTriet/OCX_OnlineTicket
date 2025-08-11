// Launch configuration
export const LAUNCH_CONFIG = {
  // Set your launch date here (ISO string with timezone)
  LAUNCH_TIME: '2025-08-01T19:00:00+07:00',
  
  // Event information
  EVENT_INFO: {
    name: "Ớt Cay Xè mùa 4",
    description: "Sự kiện âm nhạc indie đỉnh VKL",
    date: "27/09/2025 - 15:00",
    location: "Capital Theatre - 212 Lý Chính Thắng, Phường 9, Quận 3, Hồ Chí Minh",
    organizer: "Ớt Cay Xè Organization"
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
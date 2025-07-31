// Launch configuration
export const LAUNCH_CONFIG = {
  // Set your launch date here
  LAUNCH_DATE: new Date('2025-08-01T02:40:00'),
  
  // Event information
  EVENT_INFO: {
    name: "Ớt Cay Xè mùa 4",
    description: "Sự kiện âm nhạc indie đỉnh VKL",
    date: "27/09/2025 - 15:00",
    location: "Nơi nào đó tại TP.HCM",
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
  return new Date() >= LAUNCH_CONFIG.LAUNCH_DATE;
}

// Helper function to get time until launch
export function getTimeUntilLaunch() {
  const now = new Date();
  const launchDate = LAUNCH_CONFIG.LAUNCH_DATE;
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
"use client";
import { useEffect, useState, useCallback } from "react";

type CountdownTimerProps = {
  seconds: number;
  onExpire: () => void;
};

export default function CountdownTimer({ seconds, onExpire }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(seconds);

  const handleExpire = useCallback(() => {
    onExpire();
  }, [onExpire]);

  useEffect(() => {
    setCountdown(seconds);
  }, [seconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleExpire]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm text-white text-center">
      <p className="text-xl font-bold">Thời gian giữ vé còn lại: {formatTime(countdown)}</p>
    </div>
  );
} 
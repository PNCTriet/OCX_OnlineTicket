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
      setCountdown((prev) => {
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

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border border-[#FBBF24]/25 bg-[#FBBF24]/10 p-5 text-center backdrop-blur-sm">
      <p className="text-[15px] font-medium tracking-tight text-[#FAFAFA]">
        Thời gian giữ vé còn lại:{" "}
        <span className="font-mono tabular-nums text-[#FBBF24]">{formatTime(countdown)}</span>
      </p>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";

export default function CountdownCard({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [time, setTime] = useState(seconds);
  useEffect(() => {
    if (time <= 0) { onExpire(); return; }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, onExpire]);
  const min = Math.floor(time / 60).toString().padStart(2, "0");
  const sec = (time % 60).toString().padStart(2, "0");
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col items-center w-full max-w-xs mx-auto">
      <div className="font-bold text-white mb-2">Time Left</div>
      <div className="text-3xl font-mono text-yellow-400">{min}:{sec}</div>
      {time <= 0 && <div className="text-red-500 mt-2">Time expired. Please select seats again.</div>}
    </div>
  );
} 
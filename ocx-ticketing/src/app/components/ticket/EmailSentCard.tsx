"use client";
export default function EmailSentCard({ email }: { email: string }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-8 flex flex-col items-center gap-4 w-full max-w-md mx-auto mt-8">
      <div className="text-3xl text-green-400">✔</div>
      <div className="text-white font-bold text-lg">E-ticket sent!</div>
      <div className="text-white/80 text-center">Your ticket has been sent to <span className="text-yellow-400 font-semibold">{email}</span>.<br/>Please check your inbox.</div>
    </div>
  );
} 
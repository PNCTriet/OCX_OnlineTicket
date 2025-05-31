"use client";

type UserInfo = { name: string; email: string; phone: string };
export default function UserInfoFormCard({ info, setInfo }: { info: UserInfo; setInfo: (v: UserInfo) => void }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="font-bold text-white mb-2">Recipient Information</div>
      <input
        className="bg-zinc-800 rounded px-3 py-2 text-white placeholder:text-zinc-400 outline-none focus:ring-2 ring-purple-400"
        placeholder="Full Name"
        value={info.name}
        onChange={e => setInfo({ ...info, name: e.target.value })}
      />
      <input
        className="bg-zinc-800 rounded px-3 py-2 text-white placeholder:text-zinc-400 outline-none focus:ring-2 ring-purple-400"
        placeholder="Email"
        value={info.email}
        onChange={e => setInfo({ ...info, email: e.target.value })}
      />
      <input
        className="bg-zinc-800 rounded px-3 py-2 text-white placeholder:text-zinc-400 outline-none focus:ring-2 ring-purple-400"
        placeholder="Phone Number"
        value={info.phone}
        onChange={e => setInfo({ ...info, phone: e.target.value })}
      />
    </div>
  );
} 
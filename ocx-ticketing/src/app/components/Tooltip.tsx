import { useMemo } from "react";

const Tooltip = ({ showTooltip, lang }: { showTooltip: boolean; lang: "vi" | "en" }) => {
  const messagesVi = [
    "Đi đi em do dự hồi hết vé, cay lắm đó 🔥",
    "Nhanh lên không là hết sạch vé luôn đó 😱",
    "Ai nhanh thì còn, ai chậm thì tiếc 🤧",
    "Chốt lẹ kẻo sold-out đó nha 👀",
    "Giữ chỗ đi, không là khỏi coi show đó 😤",
  ];

  const messagesEn = [
    "Hurry up, the tickets are running out! 🔥",
    "Move fast or miss out 😱",
    "You snooze, you lose! ⏰",
    "Secure your seat before it's gone 👀",
    "Don't wait—tickets won't last long 😤",
  ];

  const randomMessage = useMemo(() => {
    const msgs = lang === "vi" ? messagesVi : messagesEn;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }, [lang]);

  return (
    showTooltip && (
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap animate-bounce">
        {randomMessage}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/90 rotate-45"></div>
      </div>
    )
  );
};

export default Tooltip; 
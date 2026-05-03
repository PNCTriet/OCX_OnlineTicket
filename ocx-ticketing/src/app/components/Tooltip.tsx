import { useMemo } from "react";

const messagesVi = [
  "Chốt vé sớm — không chờ đợi.",
  "Đi hết mình, ít nhất còn kỷ niệm.",
  "Không phải bây giờ thì khi nào?",
  "Đã vào trang rồi — còn chờ gì nữa?",
  "Nhanh tay kẻo lỡ slot.",
];

const messagesEn = [
  "Book now — hesitation costs seats.",
  "Go all in; even on a budget you keep the memory.",
  "If not now, when?",
  "You made it here — complete checkout.",
  "Act fast before tickets close.",
];  

const Tooltip = ({ showTooltip, lang }: { showTooltip: boolean; lang: "vi" | "en" }) => {
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
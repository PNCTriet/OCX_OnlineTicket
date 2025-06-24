import { useMemo } from "react";

const messagesVi = [
  "Mua đi em, do dự, idol nghỉ hưu mất 😗",
  "Đại đại đi, nghèo mà có kỷ niệm",
  "Không bây giờ thì bao giờ?",
  "Vô tới đây rồi sao còn chưa mua vé 😗",
  "Nhanh tay thì còn chậm tay thì tiếc",
];

const messagesEn = [
  "Buy it, hesitant one, or your idol will retire 😗",
  "Go big, even if you're poor, at least you'll have memories",
  "If not now, then when?",
  "You're already here, why haven't you paid yet? 😗",
  "Act fast, or you'll regret it",
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
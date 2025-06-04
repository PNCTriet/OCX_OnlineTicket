"use client";
import { useState } from "react";

const FAQS = [
  {
    q: { vi: "Sự kiện diễn ra ở đâu?", en: "Where is the event?" },
    a: { vi: "Tại Nhà thi đấu Phú Thọ, Q.11, TP.HCM.", en: "At Phu Tho Stadium, District 11, HCMC." },
  },
  {
    q: { vi: "Có giới hạn độ tuổi không?", en: "Is there an age limit?" },
    a: { vi: "Không giới hạn độ tuổi.", en: "No age limit." },
  },
  {
    q: { vi: "Có hoàn vé không?", en: "Can I get a refund?" },
    a: { vi: "Vé đã mua không hoàn lại.", en: "Tickets are non-refundable." },
  },
];

export default function FAQSection({ lang }: { lang: "vi" | "en" }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-16 bg-black">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-8 text-center" style={{ fontFamily: 'BDStreetSignSans' }}>
          {lang === "vi" ? "Câu hỏi thường gặp" : "FAQ"}
        </h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-white/10 rounded-lg overflow-hidden bg-black">
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-white focus:outline-none"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q[lang]}
                <span>{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-gray-300 animate-fade-in">
                  {f.a[lang]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
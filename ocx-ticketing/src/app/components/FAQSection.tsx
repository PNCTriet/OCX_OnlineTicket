"use client";
import { useState } from "react";

const FAQS = [
    {
      "q": { "vi": "Sự kiện diễn ra ở đâu?", "en": "Where is the event?" },
      "a": { "vi": "Tại TP. Hồ Chí Minh (địa điểm cụ thể sẽ được công bố sớm).", "en": "In Ho Chi Minh City (exact venue to be announced soon)." }
    },
    {
      "q": { "vi": "Sự kiện dành cho độ tuổi nào?", "en": "What is the age requirement?" },
      "a": { "vi": "Phù hợp với mọi độ tuổi, đặc biệt là các bạn trẻ từ 18–24.", "en": "Suitable for all ages, especially young people aged 18–24." }
    },
    {
      "q": { "vi": "Vé đã mua có được hoàn lại không?", "en": "Can I get a refund?" },
      "a": { "vi": "Rất tiếc, vé đã mua sẽ không được hoàn lại.", "en": "Unfortunately, tickets are non-refundable." }
    },
    {
      "q": { "vi": "Tôi có thể mua vé ở đâu?", "en": "Where can I buy tickets?" },
      "a": { "vi": "Bạn có thể mua vé trên website chính thức otcayxe.com .", "en": "You can buy tickets via the official website or the event's social media channels." }
    },
    {
      "q": { "vi": "Có các loại vé nào?", "en": "What ticket types are available?" },
      "a": { "vi": "Sự kiện duy nhất 1 loại vé Standard.", "en": "Available only ticket types Standard." }
    },
    {
      "q": { "vi": "Có giới hạn số lượng vé không?", "en": "Is there a ticket limit?" },
      "a": { "vi": "Có. Tổng số vé giới hạn cho 2.500 khán giả, vui lòng mua sớm để giữ chỗ.", "en": "Yes. Tickets are limited to 2,500 attendees, please buy early to secure your spot." }
    },
    {
      "q": { "vi": "Tôi có cần in vé không?", "en": "Do I need to print my ticket?" },
      "a": { "vi": "Không cần. Bạn chỉ cần mang mã QR được gửi qua email để check-in tại cổng.", "en": "No need. Just bring the QR code sent to your email for check-in at the gate." }
    }
];

export default function FAQSection({ lang }: { lang: "vi" | "en" }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section 
      id="faq" 
      className="py-16 relative"
      style={{
        backgroundImage: 'url(/images/hero_backround_ss3_alt2.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'BDStreetSignSans' }}>
          {lang === "vi" ? "FAQs" : "FAQs"}
        </h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-white/20 rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm">
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-white hover:bg-white/5 transition-colors focus:outline-none"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q[lang]}
                <span className="text-xl">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-white/80 animate-fade-in">
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
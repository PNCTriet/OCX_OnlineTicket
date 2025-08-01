"use client";
import { useState } from "react";

const FAQS = [
    {
      "q": { "vi": "Tôi có thể mua bao nhiêu vé trong một lần? Mua nhiều có được giảm giá không?", "en": "How many tickets can I buy in one order? Do I get a discount for buying multiple tickets?" },
      "a": { "vi": "Bạn có thể mua tối đa 10 vé trong một đơn hàng. Giá vé giữ nguyên khi mua nhiều vé.", "en": "You can purchase up to 10 tickets in one order. Ticket prices remain the same when buying multiple tickets." }
    },
    {
      "q": { "vi": "Sau khi thanh toán, tôi nhận vé bằng cách nào?", "en": "How do I receive my tickets after payment?" },
      "a": { "vi": "Vé điện tử sẽ được gửi qua email trong 48 giờ sau khi thanh toán thành công. Hãy kiểm tra cả hộp thư quảng cáo/spam.", "en": "E-tickets will be sent via email within 48 hours after successful payment. Please check both your inbox and spam/junk folders." }
    },
    {
      "q": { "vi": "Tôi không nhận được email vé, phải làm sao?", "en": "I didn't receive the ticket email, what should I do?" },
      "a": { "vi": "Hãy kiểm tra kỹ các hộp thư, nếu vẫn không thấy, bạn có thể liên hệ chúng tôi qua FANPAGE/HOTLINE để được hỗ trợ.", "en": "Please check all your email folders carefully. If you still don't see it, you can contact us via FANPAGE/HOTLINE for support." }
    },
    {
      "q": { "vi": "Vé đã mua có được hoàn hoặc đổi không?", "en": "Can I get a refund or exchange for purchased tickets?" },
      "a": { "vi": "Rất tiếc, vé đã mua không thể hoàn tiền hoặc đổi trả trừ khi sự kiện bị hủy do lý do bất khả kháng.", "en": "Unfortunately, purchased tickets cannot be refunded or exchanged unless the event is cancelled due to force majeure circumstances." }
    },
    {
      "q": { "vi": "Tôi có thể chuyển nhượng vé cho người khác không?", "en": "Can I transfer my tickets to someone else?" },
      "a": { "vi": "Có. Vé có thể được chuyển nhượng. Tuy nhiên, BTC sẽ không chịu trách nhiệm cho các tình huống bị scam vé từ người mua chuyển nhượng.", "en": "Yes. Tickets can be transferred. However, the organizers will not be responsible for any ticket scams from third-party transfers." }
    },
    {
      "q": { "vi": "Có giới hạn độ tuổi tham gia không?", "en": "Is there an age limit for participation?" },
      "a": { "vi": "Sự kiện phù hợp với người từ 16 tuổi trở lên. Người dưới 16 tuổi cần có người giám hộ đi kèm.", "en": "The event is suitable for people aged 16 and above. Those under 16 need to be accompanied by a guardian." }
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
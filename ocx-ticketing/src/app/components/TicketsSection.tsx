const TICKETS = [
  {
    name: { vi: "VIP", en: "VIP" },
    price: "1.200.000₫",
    priceEn: "$50",
    benefits: { vi: ["Khu vực riêng", "Quà tặng đặc biệt", "Gặp gỡ nghệ sĩ"], en: ["Private area", "Special gift", "Meet & greet"] },
    status: "available",
  },
  {
    name: { vi: "Regular", en: "Regular" },
    price: "500.000₫",
    priceEn: "$20",
    benefits: { vi: ["Vào cổng sự kiện", "Khu vực chung"], en: ["Event entry", "General area"] },
    status: "soldout",
  },
];

export default function TicketsSection({ lang }: { lang: "vi" | "en" }) {
  return (
    <section id="tickets" className="py-16 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-8 text-center">
          {lang === "vi" ? "Các loại vé" : "Ticket Types"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {TICKETS.map((t, i) => (
            <div key={i} className="rounded-xl border border-red-200 dark:border-red-800 p-6 flex flex-col gap-3 shadow bg-[#fff8f2] dark:bg-[#1a1a1a]">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-black dark:text-white">{t.name[lang]}</div>
                <div className="text-lg font-semibold text-red-600">{lang === "vi" ? t.price : t.priceEn}</div>
              </div>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-200">
                {t.benefits[lang].map((b: string, j: number) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-300 text-gray-500"}`}>
                  {t.status === "available"
                    ? lang === "vi" ? "Còn vé" : "Available"
                    : "Sold Out"}
                </span>
                <button
                  disabled={t.status !== "available"}
                  className={`ml-auto px-5 py-2 rounded-full font-semibold text-white ${t.status === "available" ? "bg-red-600 hover:bg-black" : "bg-gray-400 cursor-not-allowed"} transition-colors`}
                  onClick={() => { if (t.status === "available") window.location.href = "/ticket"; }}
                >
                  {lang === "vi" ? "Mua vé" : "Buy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
"use client";
import Image from "next/image";

const TICKETS = [
  {
    name: { vi: "STANDARD", en: "STANDARD" },
    price: "500.000₫",
    priceEn: "$20",
    benefits: { 
      vi: [
        "Vào cổng sự kiện",
        "Khu vực chung",
        "Quà tặng đặc biệt",
        "Gặp gỡ nghệ sĩ"
      ], 
      en: [
        "Event entry",
        "General area",
        "Special gift",
        "Meet & greet"
      ] 
    },
    status: "available",
  },
];

export default function TicketsSection({ lang }: { lang: "vi" | "en" }) {
  return (
    <section 
      id="tickets" 
      className="py-16 relative"
      style={{
        backgroundImage: 'url(/images/hero_backround_ss3_alt1.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'BDStreetSignSans' }}>
          {lang === "vi" ? "LOẠI VÉ" : "Ticket Types"}
        </h2>
        <div className="grid grid-cols-1 gap-8">
          <div 
            className="group perspective cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => window.location.href = "/ticket"}
          >
            <div className="relative w-full h-[400px] transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
              {/* Front of ticket */}
              <div className="absolute w-full h-full backface-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/ticket_front_alt1.png"
                    alt="Ticket Front"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              
              {/* Back of ticket */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/ticket_back_alt1.png"
                    alt="Ticket Back"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
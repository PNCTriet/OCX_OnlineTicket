"use client";

import HorizonBridge from "@/app/components/ocx5/HorizonBridge";
import StarsBackground from "@/app/components/ocx5/StarsBackground";
import Link from "next/link";
import { useState } from "react";
import OCX5Footer from "@/app/components/ocx5/OCX5Footer";
import { FAQS } from "@/app/components/FAQSection";

interface OCX5CTASectionProps {
  debugLayout: boolean;
}

export default function OCX5CTASection({
  debugLayout,
}: OCX5CTASectionProps) {
  const debugBorderClass = debugLayout ? "border-2 border-red-500" : "";
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="cta"
      className={`relative overflow-hidden ${debugBorderClass}`}
      style={{
        background:
          "linear-gradient(to bottom,rgb(0, 0, 0) 0%,rgb(39, 28, 28) 25%, #2c090b 50%, #9a1a15 75%, #d43922 100%)",
      }}
    >
      <StarsBackground />

      {/* Marker Badge - only visible in debug mode */}
      {debugLayout && (
        <div className="absolute top-4 left-4 z-50 bg-pink-500/80 text-white px-3 py-1 rounded text-xs font-bold">
          SECTION 5: CTA
        </div>
      )}

      <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 items-start">
          {/* CTA block */}
          {/* <div className="bg-black/25 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-white">
              Get Your Tickets
            </h2>
            <p className="mt-4 text-white/80 text-base leading-relaxed">
              Choose your seat on the interactive seatmap and checkout securely.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/ticketocx5"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#d43922] rounded-full font-bold overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-[0_0_15px_rgba(212,57,34,0.35)] hover:shadow-[0_0_28px_rgba(212,57,34,0.55)]"
              >
                <span className="relative z-10 uppercase tracking-[0.18em]">
                  Go to Seatmap
                </span>
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-white/20 skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-[120%]" />
              </Link>
              <Link
                href="/ticketocx5"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold border border-white/25 text-white/90 hover:text-white hover:border-white/45 transition-colors"
              >
                View Ticket Types
              </Link>
            </div>
          </div> */}

          {/* FAQ block (from FAQSection concept) */}
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
            <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest text-white">
              FAQs
            </h3>
            <div className="mt-6 space-y-3">
              {FAQS.map((f, i) => (
                <div
                  key={i}
                  className="border border-white/15 rounded-xl overflow-hidden bg-black/25"
                >
                  <button
                    type="button"
                    className="w-full flex justify-between items-center gap-4 px-4 py-4 text-left font-semibold text-white/95 hover:bg-white/5 transition-colors focus:outline-none"
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <span className="text-sm sm:text-base">{f.q.vi}</span>
                    <span className="text-xl shrink-0">{open === i ? "−" : "+"}</span>
                  </button>
                  {open === i && (
                    <div className="px-4 pb-4 text-white/80 text-sm leading-relaxed">
                      {f.a.vi}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Horizon (visual) then professional footer */}
      <div className="relative">
        <HorizonBridge
          baseName="imgi_62_horizons_bridge"
          imageAlt="Magical Bridge Horizon"
          parallaxSpeed={0}
          position="flow"
          imageClassName="block h-auto w-full max-w-none transform origin-bottom md:scale-110"
        />
        <OCX5Footer />
      </div>
    </section>
  );
}



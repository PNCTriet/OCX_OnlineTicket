"use client";

import { useRef } from "react";
import FloatingLightningElements from "@/app/components/ocx5/FloatingLightningElements";

export default function OCX5Footer() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <footer className="relative w-full overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-7xl px-4 py-14 flex items-center justify-center"
      >
        {/* Lightning around center */}
        <FloatingLightningElements
          containerRef={containerRef}
          count={7}
          wrapperClassName="z-10 opacity-70"
          wrapperStyle={{ filter: "brightness(1.05)" }}
        />
        <FloatingLightningElements
          containerRef={containerRef}
          count={5}
          wrapperClassName="z-30 opacity-90"
          wrapperStyle={{
            filter: "brightness(1.25) drop-shadow(0 0 12px rgba(255,190,120,0.25))",
          }}
        />

        {/* Center text (no rounded frame, no underline) */}
        <div className="relative z-20 text-center">
          <div className="absolute inset-x-0 -top-8 -bottom-8 blur-2xl bg-[#d43922]/10" />
          <div
            className="relative text-white/80 font-semibold leading-tight"
            style={{
              fontFamily: "WizardWorldSimplified, fantasy, serif",
              textShadow: "0 12px 40px rgba(0,0,0,0.95)",
              letterSpacing: "0.06em",
            }}
          >
            <div className="text-sm">Powered by</div>
            <a
              href="https://ticket.howlstudio.tech"
              target="_blank"
              rel="noreferrer"
              className="howlTicket block mt-1 text-white hover:text-white/90 transition-colors"
              style={{ letterSpacing: "0.12em" }}
            >
              howlsticket
            </a>
          </div>
        </div>

        {/* Local lightning text effect (scoped) */}
        <style jsx>{`
          .howlTicket {
            position: relative;
            display: inline-block;
            text-shadow: 0 0 0 rgba(255, 255, 255, 0);
            animation: howlFlicker 5.4s infinite;
            will-change: filter, text-shadow, opacity;
          }

          /* thin "strike" sweep across the word */
          .howlTicket::after {
            content: "";
            position: absolute;
            inset: -2px -10px;
            background: linear-gradient(
              110deg,
              transparent 0%,
              rgba(255, 255, 255, 0.0) 35%,
              rgba(255, 236, 200, 0.55) 48%,
              rgba(255, 255, 255, 0.0) 62%,
              transparent 100%
            );
            transform: translateX(-140%) skewX(-18deg);
            opacity: 0;
            pointer-events: none;
            mix-blend-mode: screen;
            animation: howlStrike 5.4s infinite;
          }

          @keyframes howlFlicker {
            0% {
              filter: brightness(1);
              text-shadow: 0 0 0 rgba(255, 255, 255, 0);
              opacity: 0.9;
            }
            3% {
              filter: brightness(1.25);
              text-shadow: 0 0 18px rgba(255, 255, 255, 0.35),
                0 0 44px rgba(255, 190, 120, 0.28);
              opacity: 1;
            }
            4% {
              filter: brightness(1);
              text-shadow: 0 0 0 rgba(255, 255, 255, 0);
              opacity: 0.9;
            }
            6% {
              filter: brightness(1.45);
              text-shadow: 0 0 22px rgba(255, 255, 255, 0.45),
                0 0 60px rgba(255, 190, 120, 0.35);
              opacity: 1;
            }
            7% {
              filter: brightness(1.05);
              text-shadow: 0 0 6px rgba(255, 255, 255, 0.15);
              opacity: 0.95;
            }
            45% {
              filter: brightness(1);
              text-shadow: 0 0 0 rgba(255, 255, 255, 0);
              opacity: 0.9;
            }
            47% {
              filter: brightness(1.6);
              text-shadow: 0 0 26px rgba(255, 255, 255, 0.55),
                0 0 70px rgba(255, 190, 120, 0.4);
              opacity: 1;
            }
            48% {
              filter: brightness(1.05);
              text-shadow: 0 0 8px rgba(255, 255, 255, 0.18);
              opacity: 0.95;
            }
            86% {
              filter: brightness(1);
              text-shadow: 0 0 0 rgba(255, 255, 255, 0);
              opacity: 0.9;
            }
            88% {
              filter: brightness(1.4);
              text-shadow: 0 0 20px rgba(255, 255, 255, 0.4),
                0 0 54px rgba(255, 190, 120, 0.32);
              opacity: 1;
            }
            100% {
              filter: brightness(1);
              text-shadow: 0 0 0 rgba(255, 255, 255, 0);
              opacity: 0.9;
            }
          }

          @keyframes howlStrike {
            0% {
              opacity: 0;
              transform: translateX(-140%) skewX(-18deg);
            }
            2% {
              opacity: 0;
            }
            3% {
              opacity: 0.75;
              transform: translateX(140%) skewX(-18deg);
            }
            4% {
              opacity: 0;
            }
            46% {
              opacity: 0;
              transform: translateX(-140%) skewX(-18deg);
            }
            47% {
              opacity: 0.8;
              transform: translateX(140%) skewX(-18deg);
            }
            48% {
              opacity: 0;
            }
            88% {
              opacity: 0;
              transform: translateX(-140%) skewX(-18deg);
            }
            89% {
              opacity: 0.7;
              transform: translateX(140%) skewX(-18deg);
            }
            90% {
              opacity: 0;
            }
            100% {
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </footer>
  );
}


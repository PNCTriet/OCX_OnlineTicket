"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function HomeClient() {
  const snitchRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!snitchRef.current || !pathRef.current) return;

    gsap.to(snitchRef.current, {
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        autoRotate: true,
        start: 0,
        end: 1,
      },
      ease: "power1.out",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: () => document.body.scrollHeight - window.innerHeight,
        scrub: 1.5,
      },
    });

    gsap.to(snitchRef.current, {
      scale: 1.3,
      repeat: -1,
      yoyo: true,
      duration: 0.6,
    });
  }, []);

  const shuffleCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("card")) return;

    gsap.to(target, {
      x: 400,
      rotation: 20,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        target.parentElement?.appendChild(target);
        gsap.set(target, { x: 0, rotation: 0, opacity: 1 });
      },
    });
  };

  const toggleFAQ = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const p = (e.target as HTMLElement).nextElementSibling as HTMLElement;
    const open = p.style.display === "block";
    gsap.to(p, {
      height: open ? 0 : "auto",
      opacity: open ? 0 : 1,
      duration: 0.3,
      onStart: () => {
        p.style.display = "block";
      },
    });
  };

  return (
    <div className="relative text-white font-sans overflow-x-hidden">
      {/* Background Image Container - Full image, scrollable, no crop */}
      <div className="relative w-full z-0 pointer-events-none">
        <img
          src="/images/ocx5_backround_alt3.png"
          alt="Background"
          className="w-full h-auto block"
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>
      
      {/* Snitch Flight */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <svg
          width="600"
          height="3200"
          viewBox="0 0 600 3200"
          className="absolute left-1/2 -translate-x-1/2 opacity-30"
        >
          <path
            ref={pathRef}
            d="M300 0 C100 300, 500 600, 300 900
               C120 1200, 520 1500, 300 1800
               C80 2100, 520 2400, 300 2700
               C200 2900, 350 3100, 300 3200"
            fill="none"
            stroke="#d6b25e"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <div
          ref={snitchRef}
          className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-600 shadow-[0_0_20px_#d6b25e,0_0_60px_#d6b25e]"
        ></div>
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-30 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="text-yellow-400 font-bold text-xl">WIZARD NIGHT</div>
          <nav className="space-x-6 text-white/80">
            <a href="#hero" className="hover:text-yellow-400">Hero</a>
            <a href="#houses" className="hover:text-yellow-400">Houses</a>
            <a href="#lineup" className="hover:text-yellow-400">Lineup</a>
            <a href="#tickets" className="hover:text-yellow-400">Tickets</a>
            <a href="#faq" className="hover:text-yellow-400">Q&A</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative h-screen flex flex-col justify-center items-center text-center z-10">
        <h1 className="text-5xl mb-6">Enter The Wizarding Night</h1>
        <button className="px-8 py-3 border border-yellow-500 rounded-full hover:bg-yellow-600 hover:text-black transition">Unlock Your Fate</button>
      </section>

      {/* HOUSES */}
      <section id="houses" className="relative py-36 max-w-6xl mx-auto text-center z-10">
        <h2 className="text-4xl text-yellow-500 mb-16">Choose Your House</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"].map(h => (
            <div key={h} className="p-12 bg-white/5 rounded-xl">{h}</div>
          ))}
        </div>
      </section>

      {/* LINEUP */}
      <section id="lineup" className="relative py-36 max-w-6xl mx-auto text-center z-10">
        <h2 className="text-4xl text-yellow-500 mb-16">Artist Lineup</h2>
        <div className="lineup relative h-96" onClick={shuffleCard}>
          {["Artist A", "Artist B", "Artist C"].map(a => (
            <div key={a} className="card absolute w-56 h-72 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-white/20 flex items-center justify-center shadow-2xl cursor-pointer">{a}</div>
          ))}
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="relative py-36 max-w-6xl mx-auto text-center z-10">
        <h2 className="text-4xl text-yellow-500 mb-16">Tickets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {["Gryffindor Pass","Slytherin Pass","Ravenclaw Pass","Hufflepuff Pass"].map(t => (
            <div key={t} className="ticket p-10 bg-white/5 rounded-xl border border-white/20 hover:shadow-[0_0_40px_rgba(214,178,94,0.25)] transition">{t}</div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-36 max-w-3xl mx-auto text-center z-10">
        <h2 className="text-4xl text-yellow-500 mb-16">Q & A</h2>
        <div className="faq-item">
          <h4 className="cursor-pointer mb-4" onClick={toggleFAQ}>⟶ Khi nào cổng mở?</h4>
          <p className="text-gray-300">Cổng sẽ mở khi màn đêm buông xuống.</p>
        </div>
      </section>
    </div>
  );
}

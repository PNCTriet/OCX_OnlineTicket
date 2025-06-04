"use client";
import Image from "next/image";


export default function HeroSection() {
  return (
    <section id="about" className="min-h-[80vh] flex flex-col items-center justify-center text-center gap-6 pt-24 pb-12 relative" style={{
      backgroundImage: 'url(/images/hero_backround_ss3_alt1.svg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="relative flex flex-col items-center justify-center text-center px-4">
        <Image 
          src="/images/hero_logo_ss3_alt1.svg" 
          alt="Hero Logo" 
          width={4000} 
          height={4000} 
          className="w-[50vw] mx-auto transition-transform duration-300 hover:scale-105"
          priority
        />
        {/* <a href="#tickets" className="mt-6 inline-block bg-red-600 text-white px-8 py-2 rounded-full text-lg font-semibold shadow hover:bg-black transition-colors">
          {TEXT[lang].cta}
        </a> */}
      </div>
    </section>
  );
} 
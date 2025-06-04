"use client";
import Image from "next/image";


export default function HeroSection() {
  return (
    <section
  id="about"
  className="aspect-[16/9] w-full mt-[45px] sm:mt-[64px] md:mt-[80px] flex flex-col items-center justify-center text-center relative pb-0"
  style={{
    backgroundImage: 'url(/images/hero_backround_ss3_alt1.svg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>

      <div className="relative flex flex-col items-center justify-center text-center px-4">
        <Image 
          src="/images/hero_logo_ss3_alt1.svg" 
          alt="Hero Logo" 
          width={4000} 
          height={4000} 
          className="w-[50vw] mx-auto transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>
    </section>
  );
} 

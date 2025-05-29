const TEXT = {
  vi: {
    title: "OCX MÙA 3 – Đốt cháy đam mê cùng Indie",
    desc: "Sự kiện âm nhạc Indie lớn nhất TP.HCM, nơi hội tụ đam mê và cá tính Gen Z.",
    cta: "Mua vé ngay",
  },
  en: {
    title: "OCX SEASON 3 – Ignite Your Indie Passion",
    desc: "The biggest Indie music event in HCMC, where Gen Z's passion and style unite.",
    cta: "Buy Tickets Now",
  },
};

export default function HeroSection({ lang }: { lang: "vi" | "en" }) {
  return (
    <section id="about" className="min-h-[80vh] flex flex-col items-center justify-center text-center gap-6 pt-24 pb-12">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-black dark:text-white mb-2">
        {TEXT[lang].title}
      </h1>
      <p className="text-lg sm:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
        {TEXT[lang].desc}
      </p>
      <a href="#tickets" className="mt-6 inline-block bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-black transition-colors">
        {TEXT[lang].cta}
      </a>
    </section>
  );
} 
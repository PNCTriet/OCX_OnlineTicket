import Image from "next/image";

const ARTISTS = [
  {
    name: { vi: "Nghệ sĩ A", en: "Artist A" },
    desc: { vi: "Indie Rock", en: "Indie Rock" },
    img: "https://picsum.photos/seed/a/300/300",
  },
  {
    name: { vi: "Nghệ sĩ B", en: "Artist B" },
    desc: { vi: "Indie Pop", en: "Indie Pop" },
    img: "https://picsum.photos/seed/b/300/300",
  },
  {
    name: { vi: "Nghệ sĩ C", en: "Artist C" },
    desc: { vi: "Folk", en: "Folk" },
    img: "https://picsum.photos/seed/c/300/300",
  },
  {
    name: { vi: "Nghệ sĩ D", en: "Artist D" },
    desc: { vi: "Alternative", en: "Alternative" },
    img: "https://picsum.photos/seed/d/300/300",
  },
];

export default function LineupSection({ lang }: { lang: "vi" | "en" }) {
  return (
    <section id="lineup" className="py-16 bg-[#fff8f2] dark:bg-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-8 text-center">
          {lang === "vi" ? "Line-up Nghệ Sĩ" : "Artist Line-up"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {ARTISTS.map((a, i) => (
            <div key={i} className="flex flex-col items-center bg-white dark:bg-black rounded-xl shadow p-4">
              <Image src={a.img} alt={a.name[lang]} width={112} height={112} className="rounded-full object-cover mb-3 border-4 border-red-600" />
              <div className="font-semibold text-lg text-black dark:text-white">{a.name[lang]}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{a.desc[lang]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
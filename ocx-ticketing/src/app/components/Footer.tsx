const TEXT = {
  vi: {
    copyright: "© 2025 Ớt Cay Xè",
    email: "Liên hệ: ocx@event.vn",
  },
  en: {
    copyright: "© 2025 Ot Cay Xe",
    email: "Contact: ocx@event.vn",
  },
};

export default function Footer({ lang }: { lang: "vi" | "en" }) {
  return (
    <footer className="w-full py-8 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 mt-12">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 font-bold text-lg text-red-600">
          <span role="img" aria-label="ớt">🌶️</span> Ớt Cay Xè
        </div>
        <div className="text-gray-700 dark:text-gray-200 text-sm">
          {TEXT[lang].copyright}
        </div>
        <div className="flex flex-col items-end gap-1 text-gray-700 dark:text-gray-200 text-sm">
          <div>{TEXT[lang].email}</div>
          <div className="flex gap-2">
            <a href="#" className="hover:text-red-600">Facebook</a>
            <a href="#" className="hover:text-red-600">Instagram</a>
            <a href="#" className="hover:text-red-600">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 
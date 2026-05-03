type FooterProps = {
  className?: string;
};

/**
 * Footer tối giản — Geist Sans + Geist Mono, scale giống Ticketing Platform (.t-label / mono).
 */
export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={[
        "mt-auto w-full border-t border-[#262626] bg-[#0F0F0F] px-6 py-10 font-sans antialiased",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center text-center">
        <p className="t-label text-[#A1A1A1]">Powered by</p>
        <a
          href="https://ticket.howlstudio.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block font-mono text-sm font-medium tracking-[-0.1px] text-[#FAFAFA] transition-colors hover:text-[#A1A1A1]"
        >
          howlsticket
        </a>
      </div>
    </footer>
  );
}

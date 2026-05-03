import type { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div
      className={[
        "flex min-h-screen flex-col bg-[#0A0A0A] text-[#FAFAFA] antialiased [font-variant-numeric:tabular-nums]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

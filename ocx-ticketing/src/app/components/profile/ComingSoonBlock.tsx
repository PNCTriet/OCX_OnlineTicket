"use client";

export interface ComingSoonBlockProps {
  title: string;
  description?: string;
  className?: string;
}

export default function ComingSoonBlock({
  title,
  description = "Tính năng đang được phát triển.",
  className = "",
}: ComingSoonBlockProps) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-black/20 px-6 py-8 text-center opacity-80 ${className}`}
      title={description}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 mb-4">
        <span aria-hidden>🔜</span>
        <span>Coming Soon</span>
      </div>
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-white/50 max-w-xs mx-auto">{description}</p>
      )}
    </div>
  );
}

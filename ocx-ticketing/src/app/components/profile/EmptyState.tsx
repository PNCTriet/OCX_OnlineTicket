"use client";

import Link from "next/link";

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional CTA e.g. "Explore events" */
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  iconLabel?: string;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  iconLabel = "📭",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-white/10 bg-black/30 px-6 py-10 text-center ${className}`}
    >
      <span className="text-4xl mb-3 opacity-80" aria-hidden>
        {iconLabel}
      </span>
      <h3 className="text-lg font-semibold text-white/95">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-white/60 max-w-xs">{description}</p>
      )}
      {(ctaLabel && (ctaHref || onCtaClick)) && (
        <div className="mt-4">
          {ctaHref ? (
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white border border-white/50 hover:bg-white/10 transition-colors"
            >
              {ctaLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white border border-white/50 hover:bg-white/10 transition-colors"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { OnyxIcon } from "@/components/ui/OnyxIcon";

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional CTA e.g. "Explore events" */
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  /** Lucide, mặc định Inbox */
  icon?: LucideIcon;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  icon: Icon = Inbox,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-[#262626] bg-[#0F0F0F] px-6 py-10 text-center ${className}`}
    >
      <OnyxIcon icon={Icon} size={40} className="mb-3 text-[#737373]" />
      <h3 className="text-lg font-semibold text-[#FAFAFA]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-xs text-sm text-[#A1A1A1]">{description}</p>
      )}
      {(ctaLabel && (ctaHref || onCtaClick)) && (
        <div className="mt-4">
          {ctaHref ? (
            <Link
              href={ctaHref}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FF6B1A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e55f15]"
            >
              {ctaLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FF6B1A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e55f15]"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

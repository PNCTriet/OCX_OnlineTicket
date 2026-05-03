"use client";

import type { EventInfo } from "@/app/types/ticket";
import Image from "next/image";
import Link from "next/link";

type TicketDetailProps = {
  event: EventInfo;
  showBackButton?: boolean;
  /** Ẩn dải thumbnail phía trên (vd. checkout chỉ cần avatar + meta). */
  hideThumbnailBanner?: boolean;
};

/**
 * V2 event summary block. Props match `app/components/ticket/EventInfoCard`.
 * SEO (`<title>`, OG) stays on the route `page.tsx` / `layout.tsx` — not here.
 */
export default function TicketDetail({
  event,
  showBackButton = false,
  hideThumbnailBanner = false,
}: TicketDetailProps) {
  const avatarSrc =
    event.avatar || event.thumbnail || "/images/placeholder.png";
  const showThumbBanner = Boolean(event.thumbnail) && !hideThumbnailBanner;

  return (
    <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-[#262626] bg-[#141414]">
      {showThumbBanner && (
        <div className="flex w-full shrink-0 justify-center border-b border-[#262626] px-4 py-4">
          <div className="relative h-[100px] w-full max-w-[280px] rounded-lg bg-[#0A0A0A] sm:h-[120px] sm:max-w-[320px]">
            <Image
              src={
                event.thumbnail || event.avatar || "/images/placeholder.png"
              }
              alt={event.name}
              fill
              className="object-contain object-center"
              sizes="(max-width: 640px) 280px, 320px"
              priority
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-[auto,1fr] items-center gap-4 p-6">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-[#262626]">
          <Image
            src={avatarSrc}
            alt={`${event.name} avatar`}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold leading-tight text-[#FAFAFA]">
              {event.name}
            </h2>
            {showBackButton && (
              <Link
                href="/ticket"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#212121] px-3 py-2 text-sm font-medium text-[#FAFAFA] ring-1 ring-[#262626] transition-colors hover:bg-[#262626]"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Mua thêm
              </Link>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[15px] text-[#FAFAFA]">
            <span className="inline-flex items-center gap-1">
              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {event.time}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {event.date}
            </span>
          </div>
          <p className="text-sm text-[#A1A1A1]">{event.location}</p>
        </div>
      </div>
    </div>
  );
}

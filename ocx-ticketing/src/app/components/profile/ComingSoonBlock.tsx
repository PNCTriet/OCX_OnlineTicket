"use client";

import { Rocket } from "lucide-react";
import { OnyxIcon } from "@/components/ui/OnyxIcon";

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
      className={`rounded-xl border border-[#262626] bg-[#141414] px-6 py-8 text-center ${className}`}
      title={description}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#212121] px-3 py-1.5 text-xs font-medium text-[#A1A1A1]">
        <OnyxIcon icon={Rocket} size={14} className="text-[#737373]" />
        <span>Coming soon</span>
      </div>
      <h3 className="text-lg font-semibold text-[#FAFAFA]">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-xs text-sm text-[#A1A1A1]">{description}</p>
      )}
    </div>
  );
}

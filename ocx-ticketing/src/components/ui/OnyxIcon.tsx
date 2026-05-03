import type { LucideIcon } from "lucide-react";

/** Icon đồng bộ dark UI: stroke trắng, dùng chung toàn app */
export const onyxIconStrokeClass = "text-[#FAFAFA]";

export type OnyxIconProps = {
  icon: LucideIcon;
  /** pixels — mặc định 20 */
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function OnyxIcon({
  icon: Icon,
  size = 20,
  strokeWidth = 1.75,
  className = "",
}: OnyxIconProps) {
  return (
    <Icon
      className={[onyxIconStrokeClass, "shrink-0", className].filter(Boolean).join(" ")}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden
    />
  );
}

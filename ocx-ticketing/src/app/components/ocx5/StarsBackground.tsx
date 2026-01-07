"use client";

import Image from "next/image";

export default function StarsBackground() {
  return (
    <div
      // Absolute để nằm trên background của section (parent cần position: relative)
      className="absolute inset-0 w-full h-full pointer-events-none z-15 opacity-70"
      aria-hidden="true"
    >
      <Image
        src="/images/ocx5_images/desktop/imgi_54_stars.png"
        alt="Stars Background"
        fill
        className="object-cover object-center"
        quality={90}
        priority={false}
        sizes="100vw"
        style={{
          mixBlendMode: "screen",
          filter: "brightness(1.1) contrast(1.05)",
        }}
      />
    </div>
  );
}

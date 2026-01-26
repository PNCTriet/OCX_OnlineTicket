"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface HeroSectionOCX5Props {
  /**
   * Bật/tắt tương tác với logo (mouse/touch tracking)
   * @default true
   */
  enableInteraction?: boolean;
}

/**
 * Interactive 3D Hero Logo Component using GSAP
 *
 * Features:
 * - 3D tilt effect based on mouse or touch movement
 * - Elastic spring back animation
 * - Brightness/glow on hover
 * - Works on desktop and touch devices
 * - GPU-accelerated transforms
 * - Auto-play idle animation on mount
 * - Interactive across entire hero section
 */
export default function HeroSectionOCX5({
  enableInteraction = true,
}: HeroSectionOCX5Props = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const hasUserInteracted = useRef(false);

  // Use a single object to store current transform values
  const transformState = useRef({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
  });

  // GSAP tweens
  const tweenRefs = useRef<gsap.core.Tween[]>([]);
  const idleAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const isMobileDevice = useRef(false);

  // Helper function to apply transforms
  const applyTransform = () => {
    if (logoRef.current) {
      const t = transformState.current;
      logoRef.current.style.transform = `
        perspective(1000px)
        rotateX(${t.rotateX}deg)
        rotateY(${t.rotateY}deg)
        translateX(${t.translateX}px)
        translateY(${t.translateY}px)
      `;
    }
  };

  // Helper function to start idle animation
  const startIdleAnimation = () => {
    if (!logoRef.current) return;
    
    // Kill existing idle animation
    idleAnimationRef.current?.kill();
    
    // Reset transform state to center
    transformState.current = {
      rotateX: 0,
      rotateY: 0,
      translateX: 0,
      translateY: 0,
    };
    applyTransform();

    // Start new idle animation
    idleAnimationRef.current = gsap.timeline({ repeat: -1, yoyo: true });
    idleAnimationRef.current
      .to(transformState.current, {
        rotateX: 5,
        rotateY: -5,
        translateX: 8,
        translateY: -8,
        duration: 3,
        ease: "sine.inOut",
        onUpdate: applyTransform,
      })
      .to(transformState.current, {
        rotateX: -5,
        rotateY: 5,
        translateX: -8,
        translateY: 8,
        duration: 3,
        ease: "sine.inOut",
        onUpdate: applyTransform,
      });
  };

  useEffect(() => {
    // Chỉ bật orientation interaction nếu enableInteraction = true
    if (!enableInteraction) return;

    // mobile orientation tilt interaction
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!logoRef.current) return;
  
      const beta = event.beta || 0;   // up-down tilt (-180 to 180)
      const gamma = event.gamma || 0; // left-right tilt (-90 to 90)
  
      // normalize & clamp
      const maxTilt = 20;
  
      const rotateX = Math.max(Math.min(beta / 3, maxTilt), -maxTilt);
      const rotateY = Math.max(Math.min(gamma / 3, maxTilt), -maxTilt);
  
      logoRef.current.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    };
  
    // iOS permission gate
    const enableOrientation = async () => {
      try {
        // @ts-ignore
        if (typeof DeviceOrientationEvent?.requestPermission === "function") {
          // @ts-ignore
          const res = await DeviceOrientationEvent.requestPermission();
          if (res !== "granted") return;
        }
        window.addEventListener("deviceorientation", handleOrientation);
      } catch {
        // silently ignore
      }
    };
  
    enableOrientation();
  
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [enableInteraction]);
  

  // Detect mobile device and start idle animation
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect mobile device
    const checkMobile = () => {
      // NOTE:
      // - `'ontouchstart' in window` is true on some desktop browsers/devices (Trackpad, emulation),
      //   which incorrectly disables hover interaction. Use media queries instead.
      const uaMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const smallScreen = window.innerWidth <= 768;
      const canHover =
        typeof window.matchMedia === "function"
          ? window.matchMedia("(hover: hover)").matches
          : true;
      const finePointer =
        typeof window.matchMedia === "function"
          ? window.matchMedia("(pointer: fine)").matches
          : true;
      const desktopLike = canHover && finePointer && !smallScreen;

      const isMobile = uaMobile || !desktopLike;
      isMobileDevice.current = isMobile;
      return isMobile;
    };

    const mobile = checkMobile();

    // Trên mobile: chỉ chạy idle animation, không cần tương tác
    // Trên desktop: chạy idle animation khi mount
    if (!logoRef.current) return;

    if (mobile || !hasUserInteracted.current) {
      startIdleAnimation();
    }

    // Listen for resize to update mobile detection
    const handleResize = () => {
      checkMobile();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      idleAnimationRef.current?.kill();
    };
  }, []);

  // Interactive mouse/touch tracking - hoạt động trên toàn bộ section hero
  useEffect(() => {
    // Chỉ bật mouse/touch interaction nếu enableInteraction = true
    if (!enableInteraction) return;
    
    // Trên mobile: không cần mouse/touch interaction, chỉ chạy idle animation
    if (isMobileDevice.current) return;

    const handlePointerMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      if (!containerRef.current || !logoRef.current) return;

      // Dừng idle animation khi người dùng tương tác
      if (!hasUserInteracted.current) {
        hasUserInteracted.current = true;
        idleAnimationRef.current?.kill();
        idleAnimationRef.current = null;
      }

      const rect = containerRef.current.getBoundingClientRect();

      let clientX: number, clientY: number;

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normalizedX = (clientX - centerX) / rect.width;
      const normalizedY = (clientY - centerY) / rect.height;

      // Target transforms
      const targetRotateX = normalizedY * 30; // -15 ~ +15 deg
      const targetRotateY = normalizedX * -30; // -15 ~ +15 deg
      const targetTranslateX = normalizedX * 40; // -20 ~ +20 px
      const targetTranslateY = normalizedY * 40; // -20 ~ +20 px

      // Kill previous tweens
      tweenRefs.current.forEach(t => t.kill());
      tweenRefs.current = [];

      // Animate transforms with spring-like ease
      tweenRefs.current.push(
        gsap.to(transformState.current, {
          rotateX: targetRotateX,
          rotateY: targetRotateY,
          translateX: targetTranslateX,
          translateY: targetTranslateY,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: applyTransform,
        })
      );
    };

    const handlePointerLeave = () => {
      // Kill previous tweens
      tweenRefs.current.forEach(t => t.kill());
      tweenRefs.current = [];

      // Reset flag để cho phép idle animation chạy lại
      hasUserInteracted.current = false;

      // Animate back to center with elastic spring
      tweenRefs.current.push(
        gsap.to(transformState.current, {
          rotateX: 0,
          rotateY: 0,
          translateX: 0,
          translateY: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          onUpdate: applyTransform,
          onComplete: () => {
            // Sau khi trả về vị trí ban đầu, chạy lại idle animation
            startIdleAnimation();
          },
        })
      );

      setIsHovering(false);
    };

    const handlePointerEnter = () => {
      setIsHovering(true);
    };

    const container = containerRef.current;
    if (!container) return;

    // Attach listeners to entire container (full hero section) - không chỉ logo
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("touchmove", handlePointerMove, { passive: true });
    container.addEventListener("touchend", handlePointerLeave);

    // Also listen on window for better coverage
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("touchmove", handlePointerMove);
      container.removeEventListener("touchend", handlePointerLeave);
      
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);

      tweenRefs.current.forEach(t => t.kill());
      idleAnimationRef.current?.kill();
    };
  }, [enableInteraction]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Interactive 3D Logo */}
      <div
        ref={logoRef}
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <Image
          src="/images/ocx5_images/elements/ocx_logo_ss5_horizon_alt3.png"
          alt="OCX Hero Logo"
          width={4500}
          height={4500}
          className="w-full max-w-[80vw] md:max-w-[60vw] h-auto transition-all duration-300"
          style={{
            filter: isHovering
              ? "brightness(1.1) drop-shadow(0 0 30px rgba(255,255,255,0.3))"
              : "brightness(1)",
            willChange: "transform, filter",
          }}
          priority
        />
      </div>
    </div>
  );
}

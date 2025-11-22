"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ModalPosition = "top" | "bottom" | "left" | "right" | null;

export default function FpvScrollTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<ModalPosition>(null);
  
  const topModalRef = useRef<HTMLDivElement>(null);
  const bottomModalRef = useRef<HTMLDivElement>(null);
  const leftModalRef = useRef<HTMLDivElement>(null);
  const rightModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let scrollTrigger: ScrollTrigger | null = null;
    const triggers: ScrollTrigger[] = [];

    const handleLoadedMetadata = () => {
      // Video scrub với smoothness tốt hơn
      scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Tăng từ true lên 1 để mượt hơn
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
        },
      });

      // Checkpoint 1: Top modal (25% scroll)
      const topTrigger = ScrollTrigger.create({
        trigger: container,
        start: "25% top",
        end: "30% top",
        onEnter: () => setActiveModal("top"),
        onLeave: () => setActiveModal(null),
        onEnterBack: () => setActiveModal("top"),
        onLeaveBack: () => setActiveModal(null),
      });

      // Checkpoint 2: Right modal (50% scroll)
      const rightTrigger = ScrollTrigger.create({
        trigger: container,
        start: "50% top",
        end: "55% top",
        onEnter: () => setActiveModal("right"),
        onLeave: () => setActiveModal(null),
        onEnterBack: () => setActiveModal("right"),
        onLeaveBack: () => setActiveModal(null),
      });

      // Checkpoint 3: Bottom modal (75% scroll)
      const bottomTrigger = ScrollTrigger.create({
        trigger: container,
        start: "75% top",
        end: "80% top",
        onEnter: () => setActiveModal("bottom"),
        onLeave: () => setActiveModal(null),
        onEnterBack: () => setActiveModal("bottom"),
        onLeaveBack: () => setActiveModal(null),
      });

      // Checkpoint 4: Left modal (90% scroll)
      const leftTrigger = ScrollTrigger.create({
        trigger: container,
        start: "90% top",
        end: "95% top",
        onEnter: () => setActiveModal("left"),
        onLeave: () => setActiveModal(null),
        onEnterBack: () => setActiveModal("left"),
        onLeaveBack: () => setActiveModal(null),
      });

      triggers.push(topTrigger, rightTrigger, bottomTrigger, leftTrigger);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // If metadata is already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    // Cleanup
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  // Animate modals when active
  useEffect(() => {
    const modals = {
      top: topModalRef.current,
      bottom: bottomModalRef.current,
      left: leftModalRef.current,
      right: rightModalRef.current,
    };

    Object.entries(modals).forEach(([position, modal]) => {
      if (!modal) return;

      if (activeModal === position) {
        gsap.fromTo(
          modal,
          {
            opacity: 0,
            y: position === "top" ? -100 : position === "bottom" ? 100 : 0,
            x: position === "left" ? -100 : position === "right" ? 100 : 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          }
        );
      } else {
        gsap.to(modal, {
          opacity: 0,
          y: position === "top" ? -50 : position === "bottom" ? 50 : 0,
          x: position === "left" ? -50 : position === "right" ? 50 : 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    });
  }, [activeModal]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "300vh" }}>
      <div className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          preload="metadata"
          muted
          playsInline
        >
          <source src="/fpv-test.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Top Modal */}
      <div
        ref={topModalRef}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl px-8 py-6 max-w-md">
          <h3 className="text-white text-xl font-bold mb-2">Checkpoint 1</h3>
          <p className="text-white/80 text-sm">Modal từ phía trên</p>
        </div>
      </div>

      {/* Right Modal */}
      <div
        ref={rightModalRef}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl px-8 py-6 max-w-md">
          <h3 className="text-white text-xl font-bold mb-2">Checkpoint 2</h3>
          <p className="text-white/80 text-sm">Modal từ phía phải</p>
        </div>
      </div>

      {/* Bottom Modal */}
      <div
        ref={bottomModalRef}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl px-8 py-6 max-w-md">
          <h3 className="text-white text-xl font-bold mb-2">Checkpoint 3</h3>
          <p className="text-white/80 text-sm">Modal từ phía dưới</p>
        </div>
      </div>

      {/* Left Modal */}
      <div
        ref={leftModalRef}
        className="fixed left-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl px-8 py-6 max-w-md">
          <h3 className="text-white text-xl font-bold mb-2">Checkpoint 4</h3>
          <p className="text-white/80 text-sm">Modal từ phía trái</p>
        </div>
      </div>
    </div>
  );
}


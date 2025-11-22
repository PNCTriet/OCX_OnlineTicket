"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lineup artists data
const ARTISTS = [
  {
    main: "/images/lineup_main_ss4_artist1_dehours_alt1.png",
    sub: "/images/lineup_sub_ss4_artist1_dehours_alt1.png",
    name: "Artist 1",
    video: "/videos/fpv-drone.mp4", // Placeholder - bạn có thể thay bằng video riêng cho mỗi artist
  },
  {
    main: "/images/lineup_main_ss4_artist2_lybuc_alt1.png",
    sub: "/images/lineup_sub_ss4_artist2_lybuc_alt1.png",
    name: "Artist 2",
    video: "/videos/fpv-drone.mp4",
  },
  {
    main: "/images/lineup_main_ss4_artist3_minhdinh_alt1.png",
    sub: "/images/lineup_sub_ss4_artist3_minhdinh_alt1.png",
    name: "Artist 3",
    video: "/videos/fpv-drone.mp4",
  },
  {
    main: "/images/lineup_main_ss4_artist4_alt1.png",
    sub: "/images/lineup_sub_ss4_artist4_alt1.png",
    name: "Artist 4",
    video: "/videos/fpv-drone.mp4",
  },
  {
    main: "/images/lineup_main_ss4_artist5_alt1.png",
    sub: "/images/lineup_sub_ss4_artist5_alt1.png",
    name: "Artist 5",
    video: "/videos/fpv-drone.mp4",
  },
];

export default function FpvScrollTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mapModalRef = useRef<HTMLDivElement>(null);
  const lineupModalRef = useRef<HTMLDivElement>(null);
  
  const [showMapModal, setShowMapModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [currentLineupIndex, setCurrentLineupIndex] = useState(2); // Start at middle card
  const [hoveredArtistIndex, setHoveredArtistIndex] = useState<number | null>(null);
  const artistVideoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const modalAnimations = useRef<Record<string, gsap.core.Tween>>({});
  const lineupCardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const heroSection = heroSectionRef.current;
    const logo = logoRef.current;
    
    if (!video || !heroSection) return;

    // Set video to start at frame 0 immediately
    const setVideoStart = () => {
      video.currentTime = 0;
      video.style.opacity = "1";
    };

    // Set initial state cho logo
    if (logo) {
      gsap.set(logo, { opacity: 1, scale: 1, x: 0, y: 0 });
    }

    if (video.readyState >= 1) {
      setVideoStart();
    } else {
      video.addEventListener("loadeddata", setVideoStart, { once: true });
    }

    let scrollTrigger: ScrollTrigger | null = null;
    const triggers: ScrollTrigger[] = [];

    const handleLoadedMetadata = () => {
      // Hero section với logo fadeout ngay khi scroll
      if (heroSection && logo) {
        const heroTrigger = ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "top+=100 top",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(logo, {
              opacity: 0,
              scale: 0.7,
              duration: 0.5,
              ease: "power2.out",
            });
          },
          onLeaveBack: () => {
            gsap.to(logo, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          },
        });
        triggers.push(heroTrigger);
      }

      // Video scrub với smoothness tốt hơn
      scrollTrigger = ScrollTrigger.create({
        trigger: heroSection,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          if (video.duration && !isNaN(video.duration)) {
            const targetTime = self.progress * video.duration;
            if (Math.abs(video.currentTime - targetTime) > 0.1) {
              video.currentTime = targetTime;
            }
          }
        },
      });

      // Checkpoint 1: Map Modal (40% scroll)
      const mapTrigger = ScrollTrigger.create({
        trigger: heroSection,
        start: "40% top",
        end: "50% top",
        toggleActions: "play none none reverse",
        onEnter: () => {
          setShowLineupModal(false); // Ẩn lineup modal trước
          setShowMapModal(true);
        },
        onLeave: () => setShowMapModal(false),
        onEnterBack: () => {
          setShowLineupModal(false); // Ẩn lineup modal trước
          setShowMapModal(true);
        },
        onLeaveBack: () => setShowMapModal(false),
      });
      triggers.push(mapTrigger);

      // Checkpoint 2: Lineup Modal (70% scroll)
      const lineupTrigger = ScrollTrigger.create({
        trigger: heroSection,
        start: "70% top",
        end: "80% top",
        toggleActions: "play none none reverse",
        onEnter: () => {
          setShowMapModal(false); // Ẩn map modal trước
          setShowLineupModal(true);
        },
        onLeave: () => setShowLineupModal(false),
        onEnterBack: () => {
          setShowMapModal(false); // Ẩn map modal trước
          setShowLineupModal(true);
        },
        onLeaveBack: () => setShowLineupModal(false),
      });
      triggers.push(lineupTrigger);

    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    // Cleanup
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", setVideoStart);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  // Animate modals fadein/fadeout
  useEffect(() => {
    const mapModal = mapModalRef.current;
    const lineupModal = lineupModalRef.current;

    // Map Modal Animation
    if (mapModal) {
      const existingAnim = modalAnimations.current['map'];
      if (existingAnim) {
        existingAnim.kill();
        delete modalAnimations.current['map'];
      }

      if (showMapModal) {
        const anim = gsap.fromTo(
          mapModal,
          { opacity: 0, scale: 0.9, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
        modalAnimations.current['map'] = anim;
      } else {
        const anim = gsap.to(mapModal, {
          opacity: 0,
          scale: 0.9,
          y: 50,
          duration: 0.5,
          ease: "power2.in",
        });
        modalAnimations.current['map'] = anim;
      }
    }

    // Lineup Modal Animation
    if (lineupModal) {
      const existingAnim = modalAnimations.current['lineup'];
      if (existingAnim) {
        existingAnim.kill();
        delete modalAnimations.current['lineup'];
      }

      if (showLineupModal) {
        const anim = gsap.fromTo(
          lineupModal,
          { opacity: 0, scale: 0.9, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
        modalAnimations.current['lineup'] = anim;
      } else {
        const anim = gsap.to(lineupModal, {
          opacity: 0,
          scale: 0.9,
          y: 50,
          duration: 0.5,
          ease: "power2.in",
        });
        modalAnimations.current['lineup'] = anim;
      }
    }
  }, [showMapModal, showLineupModal]);

  // Animate lineup cards khi modal xuất hiện và khi thay đổi index
  useEffect(() => {
    if (!lineupModalRef.current || !showLineupModal || !lineupCardsContainerRef.current) return;

    const container = lineupCardsContainerRef.current;
    const cards = container.querySelectorAll('.lineup-card');
    
    // Reset container position
    gsap.set(container, { x: 0 });
    
    // Animate khi modal xuất hiện lần đầu
    if (cards.length > 0) {
      cards.forEach((card, index) => {
        const isCenter = index === currentLineupIndex;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            scale: 0.8,
            y: 50,
          },
          {
            opacity: isCenter ? 1 : 0.7,
            scale: isCenter ? 1.25 : 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.05,
            ease: "power2.out",
          }
        );
      });

      // Center the middle card
      const centerCard = cards[currentLineupIndex] as HTMLElement;
      if (centerCard) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = centerCard.getBoundingClientRect();
        const offset = containerRect.left + containerRect.width / 2 - (cardRect.left + cardRect.width / 2);
        gsap.set(container, { x: offset });
      }
    }
  }, [showLineupModal, currentLineupIndex]);

  // Animate khi thay đổi center card
  useEffect(() => {
    if (!lineupModalRef.current || !showLineupModal || !lineupCardsContainerRef.current) return;

    const container = lineupCardsContainerRef.current;
    const cards = container.querySelectorAll('.lineup-card');
    
    if (cards.length === 0) return;
    
    // Animate scale và opacity của cards
    cards.forEach((card, index) => {
      const isCenter = index === currentLineupIndex;
      gsap.to(card, {
        scale: isCenter ? 1.25 : 1,
        opacity: isCenter ? 1 : 0.7,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    // Center the new center card với animation slide ngang
    setTimeout(() => {
      const centerCard = cards[currentLineupIndex] as HTMLElement;
      if (centerCard && container) {
        const parentContainer = container.parentElement;
        if (parentContainer) {
          // Lấy vị trí hiện tại của container
          const currentX = gsap.getProperty(container, "x") as number || 0;
          
          // Tính toán vị trí của center card
          const cardRect = centerCard.getBoundingClientRect();
          const parentRect = parentContainer.getBoundingClientRect();
          
          // Vị trí center của card so với parent
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const parentCenterX = parentRect.left + parentRect.width / 2;
          
          // Offset cần thiết để center card ở giữa parent
          const offset = currentX + (parentCenterX - cardCenterX);
          
          gsap.to(container, {
            x: offset,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }
    }, 100);
  }, [currentLineupIndex, showLineupModal]);

  // Handle video play/pause khi hover thay đổi
  useEffect(() => {
    ARTISTS.forEach((_, index) => {
      const video = artistVideoRefs.current[index];
      if (video) {
        if (hoveredArtistIndex === index) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [hoveredArtistIndex]);

  // Handle video hover
  const handleArtistHover = (index: number) => {
    setHoveredArtistIndex(index);
    const video = artistVideoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch((error) => {
        console.log('Video play error:', error);
      });
    }
  };

  const handleArtistLeave = (index: number) => {
    const video = artistVideoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setHoveredArtistIndex(null);
  };

  const handleLineupNavigation = (direction: "left" | "right") => {
    setCurrentLineupIndex((prev) => {
      return direction === "left" 
        ? (prev > 0 ? prev - 1 : ARTISTS.length - 1)
        : (prev < ARTISTS.length - 1 ? prev + 1 : 0);
    });
  };

  return (
    <>
      {/* Hero Section - Logo chỉ fadeout khi scroll */}
      <div 
        ref={heroSectionRef} 
        className="relative w-full flex items-center justify-center bg-black overflow-hidden"
        style={{ height: '500vh' }}
      >
        {/* Video background - fixed position */}
        <div className="fixed inset-0 z-0">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            preload="metadata"
            muted
            playsInline
            style={{ opacity: 1 }}
          >
            <source src="/fpv-test.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        {/* Logo - fixed ở giữa màn hình, chỉ fadeout khi scroll */}
        <div 
          ref={logoRef}
          className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ fontFamily: 'BDStreetSignSans' }}
        >
          <Image 
            src="/images/hero_logo_ss3_alt1.svg" 
            alt="OTCayXe Logo" 
            width={4500} 
            height={4500} 
            className="w-[90vw] sm:w-[70vw] md:w-[55vw] lg:w-[45vw] max-w-3xl mx-auto"
            priority
          />
        </div>
      </div>

      {/* Checkpoint 1: Map Modal Popup */}
      {showMapModal && (
        <div 
          ref={mapModalRef}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="max-w-5xl mx-auto px-4 w-full pointer-events-auto">
            <div className="bg-zinc-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white">SƠ ĐỒ CHỖ NGỒI</h2>
              </div>
              <div className="relative w-full aspect-square max-w-2xl mx-auto">
                <Image
                  src="/images/seatmap.png"
                  alt="Sơ đồ chỗ ngồi"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkpoint 2: Lineup Modal Popup */}
      {showLineupModal && (
        <div 
          ref={lineupModalRef}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="max-w-7xl mx-auto px-4 w-full pointer-events-auto">
            <div className="bg-zinc-800/90 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: 'BDStreetSignSans' }}>
                NGHỆ SĨ
              </h2>
              
              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4 mb-8 z-50 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLineupNavigation("left");
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLineupNavigation("right");
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Lineup Cards */}
              <div className="relative w-full overflow-hidden pb-8 min-h-[500px]">
                <div 
                  ref={lineupCardsContainerRef}
                  className="flex items-center justify-center gap-4"
                  style={{ willChange: 'transform' }}
                >
                  {ARTISTS.map((artist, index) => {
                    const isCenter = index === currentLineupIndex;
                    const isHovered = hoveredArtistIndex === index;
                    const cardWidth = isCenter ? 300 : 200;
                    const cardHeight = (cardWidth * 5) / 3; // Tỉ lệ 3:5
                    
                    return (
                      <div
                        key={index}
                        className={`lineup-card relative flex-shrink-0 ${
                          isCenter ? 'z-10' : 'z-0'
                        }`}
                        style={{
                          width: `${cardWidth}px`,
                          height: `${cardHeight}px`,
                        }}
                        onMouseEnter={() => handleArtistHover(index)}
                        onMouseLeave={() => handleArtistLeave(index)}
                      >
                        <div className="relative w-full h-full rounded-xl cursor-pointer shadow-2xl bg-black/20" style={{ overflow: 'hidden' }}>
                          {/* Static Image */}
                          <div className={`absolute inset-0 transition-opacity duration-300 ${
                            isHovered ? 'opacity-0' : 'opacity-100'
                          }`} style={{ width: '100%', height: '100%' }}>
                            <Image
                              src={artist.main}
                              alt={artist.name}
                              width={cardWidth}
                              height={cardHeight}
                              className="object-contain"
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              sizes="(max-width: 300px) 100vw, 300px"
                            />
                          </div>
                          
                          {/* Video on Hover */}
                          <div className={`absolute inset-0 transition-opacity duration-300 ${
                            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                          }`} style={{ width: '100%', height: '100%' }}>
                            <video
                              ref={(el) => {
                                if (el) {
                                  artistVideoRefs.current[index] = el;
                                }
                              }}
                              className="w-full h-full"
                              style={{ objectFit: 'contain' }}
                              muted
                              playsInline
                              loop
                              preload="auto"
                            >
                              <source src={artist.video} type="video/mp4" />
                            </video>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

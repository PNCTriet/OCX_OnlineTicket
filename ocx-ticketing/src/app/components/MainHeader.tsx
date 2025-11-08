"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

// const MENU = [
//   { label: { vi: "TỔNG QUAN", en: "ABOUT" }, href: "#about" },
//   { label: { vi: "NGHỆ SĨ", en: "LINE-UP" }, href: "#lineup" },
//   { label: { vi: "MUA VÉ", en: "TICKETS" }, href: "#tickets" },
//   { label: { vi: "FAQS", en: "FAQS" }, href: "#faq" },
// ];

export default function MainHeader({ lang, setLang }: { lang: "vi" | "en"; setLang: (lang: "vi" | "en") => void }) {
  const [isVisible] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(0);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const { user, signOut } = useAuth();

  // Disable scroll on mount
  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Cleanup: restore scroll on unmount
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Track mouse position globally for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      // Redirect to home page after sign out
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Full screen glow effect following mouse cursor - 60% intensity (x3), smaller size, below content */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-500 z-10"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `
            radial-gradient(circle 400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(245, 101, 57, 0.18) 0%, rgba(245, 101, 57, 0.108) 20%, rgba(245, 101, 57, 0.06) 40%, transparent 65%),
            radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, rgba(245, 101, 57, 0.132) 0%, rgba(245, 101, 57, 0.072) 30%, rgba(245, 101, 57, 0.036) 55%, transparent 75%),
            radial-gradient(circle 900px at ${mousePosition.x}% ${mousePosition.y}%, rgba(245, 101, 57, 0.09) 0%, rgba(245, 101, 57, 0.048) 40%, rgba(245, 101, 57, 0.024) 65%, transparent 85%)
          `,
          filter: 'blur(10px)',
        }}
      />
      
      {/* Soft center glow - Full screen - 60% intensity (x3), smaller size, below content */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-400 z-10"
        style={{
          opacity: isHovering ? 0.6 : 0,
          background: `radial-gradient(circle 300px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 140, 80, 0.21) 0%, rgba(245, 101, 57, 0.12) 25%, rgba(245, 101, 57, 0.06) 45%, transparent 70%)`,
          mixBlendMode: 'screen',
          filter: 'blur(100px)',
        }}
      />
      
      <header 
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-12 transition-all duration-500 relative ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ 
          fontFamily: 'BDStreetSignSans',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
      
      {/* MOBILE: 3-column flex, DESKTOP: flex as before */}
      <div className="flex items-center justify-between md:justify-normal md:flex-row w-full relative z-10">
        {/* Hamburger - left on mobile, hidden on desktop */}
        {/* <div className="flex-1 flex md:hidden">
          <button
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div> */}
        <div className="flex-1 flex md:hidden"></div>
        {/* Logo - centered on mobile, left on desktop */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600 relative group/logo">
            <Image
              src="/images/client_logo_ss4.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover transition-all duration-300 hover:scale-110 relative z-10"
              style={{
                filter: 'drop-shadow(0 0 0px rgba(245, 101, 57, 0))',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 45px rgba(245, 101, 57, 1)) drop-shadow(0 0 60px rgba(245, 101, 57, 0.6))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(245, 101, 57, 0))';
              }}
            />
          </Link>
        </div>
        {/* Language toggle and User menu - right on mobile, right on desktop */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <button
            aria-label="Chuyển ngôn ngữ"
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="rounded-full p-2 transition-all duration-300 hover:scale-110 relative group/lang"
            style={{
              textShadow: '0 0 0px rgba(245, 101, 57, 0)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = '0 0 60px rgba(245, 101, 57, 1), 0 0 90px rgba(245, 101, 57, 0.8), 0 0 120px rgba(245, 101, 57, 0.6)';
              e.currentTarget.style.color = '#F56539';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = '0 0 0px rgba(245, 101, 57, 0)';
              e.currentTarget.style.color = '';
            }}
          >
            {lang === "vi" ? "VI" : "EN"}
          </button>
          
          {/* User Menu - only show if user is logged in */}
          {user && (
            <div className="relative z-[70]">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/10 transition-all duration-300 relative"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-all duration-300">
                  <span className="text-black text-sm font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <svg 
                  className={`w-4 h-4 text-white transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // TODO: Implement profile page
                      alert('Tính năng Profile sẽ sớm ra mắt!');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Soon</span>
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Desktop Menu - centered on desktop only */}
        {/* <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-25 text-2xl font-medium">
          {MENU.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-transform duration-300 hover:scale-110"
            >
              {item.label[lang]}
            </a>
          ))}
        </nav> */}
      </div>
      {/* Mobile Dropdown Menu - left aligned */}
      {/* <div className={`absolute top-full left-0 w-full bg-[#c53e00] md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <nav className="flex flex-col items-start py-4">
          {MENU.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="w-full text-left px-4 py-3 text-xl font-medium hover:bg-[#b33800] transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label[lang]}
            </a>
          ))}
          
          {/* Mobile User Menu Items */}
          {/* {user && (
            <>
              <div className="w-full px-4 py-2 border-t border-white/20 mt-2">
                <div className="text-sm text-white/80 mb-2">
                  {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  alert('Tính năng Profile sẽ sớm ra mắt!');
                }}
                className="w-full text-left px-4 py-3 text-xl font-medium hover:bg-[#b33800] transition-colors duration-300 flex items-center justify-between"
              >
                <span>Profile</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Soon</span>
              </button>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-xl font-medium hover:bg-[#b33800] transition-colors duration-300"
              >
                Đăng xuất
              </button>
            </>
          )} */}
        {/* </nav>
      </div> */}
      
      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-[60]" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
    </>
  );
} 
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function SimpleHeader({ lang, setLang }: { lang: "vi" | "en"; setLang: (lang: "vi" | "en") => void }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

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
    <header className="fixed top-0 left-0 w-full z-50 bg-[#c53e00] px-4 sm:px-12 transition-transform duration-300" style={{ fontFamily: 'BDStreetSignSans' }}>
      <div className="flex items-center justify-between w-full">
        {/* Logo - left */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
            <Image
              src="/images/client_logo_ss4.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </Link>
        </div>
        
        {/* Language toggle and User menu - right */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Chuyển ngôn ngữ"
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="rounded-full p-2 transition-transform duration-300 hover:scale-110 text-white"
          >
            {lang === "vi" ? "VI" : "EN"}
          </button>
          
          {/* User Menu - only show if user is logged in */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-[#b33800] transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#c53e00] text-sm font-bold">
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
      </div>
      
      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
} 
"use client";

import React, { ReactNode, useState } from "react";
import { cn } from "../../../lib/utils";

interface BrowserMockupProps {
  children: ReactNode;
  url?: string;
  className?: string;
  height?: string;
  isMobile?: boolean;
}

export function BrowserMockup({ 
  children, 
  url = "ssgoi.dev/demo",
  className,
  height = "600px",
  isMobile = false
}: BrowserMockupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isMobile) {
    return (
      <div className={cn("relative mx-auto my-8", className)}>
        <div className="relative max-w-sm mx-auto">
          {/* Mobile Frame */}
          <div className="relative overflow-hidden rounded-[3rem] border-8 border-white/10 bg-black shadow-2xl">
            {/* Notch */}
            <div className="absolute left-1/2 top-4 h-6 w-24 -translate-x-1/2 rounded-full bg-black z-10" />
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-between px-6 text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1v0a1 1 0 011 1v0a1 1 0 01-1 1v0a1 1 0 01-1-1v0z" clipRule="evenodd" />
                </svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="aspect-[9/19.5] pt-12">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative mx-auto my-8", className)}>
      {/* Desktop Browser Frame */}
      <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Browser Header */}
        <div className="flex items-center justify-between bg-gray-900 px-4 py-3 border-b border-gray-800">
          {/* Traffic Lights (macOS style) */}
          <div className="flex items-center gap-2">
            <button 
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              aria-label="Close"
            />
            <button 
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
              aria-label="Minimize"
            />
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
              aria-label="Expand"
            />
          </div>

          {/* URL Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1.5">
              {/* Lock Icon */}
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-gray-300 text-sm flex-1 truncate">{url}</span>
              {/* Refresh Icon */}
              <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>

          {/* Browser Controls */}
          <div className="flex items-center gap-3">
            {/* Extension Icon */}
            <svg className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            {/* Profile Icon */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
            {/* Menu Icon */}
            <svg className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </div>
        </div>

        {/* Browser Content */}
        <div 
          className={cn(
            "bg-white overflow-hidden transition-all duration-300",
            isExpanded ? "h-screen" : ""
          )}
          style={{ height: isExpanded ? "calc(100vh - 100px)" : height }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Responsive Browser Mockup that switches between desktop and mobile
export function ResponsiveBrowserMockup({ 
  children, 
  url = "ssgoi.dev/demo",
  className,
  desktopHeight = "600px",
}: Omit<BrowserMockupProps, 'isMobile'>) {
  const [isMobileView, setIsMobileView] = useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Toggle Button */}
      <div className="flex justify-center mb-4 gap-2">
        <button
          onClick={() => setIsMobileView(false)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            !isMobileView 
              ? "bg-orange-500 text-white shadow-lg" 
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          )}
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Desktop
        </button>
        <button
          onClick={() => setIsMobileView(true)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            isMobileView 
              ? "bg-orange-500 text-white shadow-lg" 
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          )}
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Mobile
        </button>
      </div>

      {/* Mockup */}
      <BrowserMockup 
        url={url}
        className={className}
        height={desktopHeight}
        isMobile={isMobileView}
      >
        {children}
      </BrowserMockup>
    </div>
  );
}
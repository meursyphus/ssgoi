"use client";

import { Ssgoi, type SsgoiConfig } from "@meursyphus/ssgoi-react";
import Link from "next/link";
import { fade } from "./transitions";

const ssgoiConfig: SsgoiConfig = {
  transitions: [],
  defaultTransition: {
    in: async (element) => {
      return {
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
          element.style.transform = `translateY(${(1 - progress) * 20}px) scale(${0.98 + progress * 0.02})`;
        },
      };
    },
    out: async (element) => {
      element.style.position = "absolute";
      element.style.width = "100%";
      element.style.top = "0";
      element.style.left = "0";
      element.style.margin = "0";
      element.style.padding = "0";
      element.style.boxSizing = "border-box";
      return {
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
          element.style.transform = `translateY(${(1 - progress) * -20}px) scale(${0.98 + progress * 0.02})`;
        },
      };
    },
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0e27;
          color: #ffffff;
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .demo-container {
          min-height: 100vh;
          padding: 40px 20px;
          position: relative;
          background: 
            radial-gradient(ellipse at top left, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
        }
        
        .demo-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px);
          background-size: 100px 100px;
          pointer-events: none;
          z-index: 1;
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto 60px;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 10;
        }
        
        .nav-wrapper {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 8px;
          display: flex;
          gap: 4px;
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .nav-link {
          position: relative;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .nav-link:hover {
          color: rgba(255, 255, 255, 0.95);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-link.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(99, 102, 241, 0.4));
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
        }
        
        .content-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 5;
        }
        
        .content-container {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          position: relative;
          min-height: 600px;
          overflow: hidden;
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .content-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.3) 20%, 
            rgba(255, 255, 255, 0.3) 80%, 
            transparent);
        }
        
        .page-content {
          padding: 60px;
          min-height: 600px;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .page-content {
            padding: 40px 30px;
          }
        }
      `}</style>
      
      <div className="demo-container">
        <nav className="nav-container">
          <div className="nav-wrapper">
            <Link href="/demo" className="nav-link">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <Link href="/demo/about" className="nav-link">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              About
            </Link>
            <Link href="/demo/contact" className="nav-link">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact
            </Link>
          </div>
        </nav>
        
        <div className="content-wrapper">
          <div className="content-container">
            <Ssgoi config={ssgoiConfig}>{children}</Ssgoi>
          </div>
        </div>
      </div>
    </>
  );
}
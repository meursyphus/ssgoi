"use client";

import { SsgoiTransition } from "@meursyphus/ssgoi-react";
import Link from "next/link";

export default function DemoHomePage() {
  return (
    <>
      <style jsx>{`
        .hero-section {
          min-height: 600px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 60px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.2));
          border: 1px solid rgba(124, 58, 237, 0.3);
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 14px;
          color: #c7d2fe;
          margin-bottom: 24px;
          font-weight: 500;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .hero-badge-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        
        .hero-title {
          font-size: 72px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        
        .hero-subtitle {
          font-size: 20px;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 600px;
          margin-bottom: 48px;
          font-weight: 400;
        }
        
        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .hero-button {
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-button-primary {
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          color: white;
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 10px 15px -3px rgba(124, 58, 237, 0.4);
        }
        
        .hero-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.2) inset,
            0 20px 25px -5px rgba(124, 58, 237, 0.5);
        }
        
        .hero-button-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .hero-button-primary:hover::before {
          left: 100%;
        }
        
        .hero-button-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .hero-button-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 80px;
          padding: 0 20px;
        }
        
        .feature-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-4px);
        }
        
        .feature-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          padding: 12px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.2));
          border-radius: 12px;
          color: #a78bfa;
        }
        
        .feature-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }
        
        .feature-description {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
        }
        
        .decoration-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          pointer-events: none;
        }
        
        .orb-1 {
          width: 400px;
          height: 400px;
          background: #7c3aed;
          top: -200px;
          right: -100px;
        }
        
        .orb-2 {
          width: 300px;
          height: 300px;
          background: #3b82f6;
          bottom: -150px;
          left: -50px;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 48px;
          }
          
          .hero-subtitle {
            font-size: 18px;
          }
          
          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <SsgoiTransition id="/demo">
        <div className="page-content">
          <div className="hero-section">
            <div className="decoration-orb orb-1" />
            <div className="decoration-orb orb-2" />
            
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span>SSGOI v2.0 - Now with React Support</span>
            </div>
            
            <h1 className="hero-title">
              Seamless Spring
              <br />
              Transitions
            </h1>
            
            <p className="hero-subtitle">
              Experience butter-smooth animations that remember their state. 
              No more jarring stops or restarts - just natural, fluid motion 
              that feels alive.
            </p>
            
            <div className="hero-buttons">
              <Link href="/demo/about" className="hero-button hero-button-primary">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Explore Features
              </Link>
              <a 
                href="https://github.com/meursyphus/ssgoi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero-button hero-button-secondary"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
            
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="feature-title">Lightning Fast</h3>
                <p className="feature-description">Optimized performance with minimal overhead</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <h3 className="feature-title">State Memory</h3>
                <p className="feature-description">Animations that remember where they were</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="feature-title">Easy to Use</h3>
                <p className="feature-description">Simple API with powerful results</p>
              </div>
            </div>
          </div>
        </div>
      </SsgoiTransition>
    </>
  );
}
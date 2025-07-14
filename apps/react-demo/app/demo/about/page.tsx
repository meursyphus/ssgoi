"use client";

import { SsgoiTransition } from "@meursyphus/ssgoi-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <style jsx>{`
        .about-container {
          padding: 60px;
          min-height: 600px;
        }
        
        .about-header {
          text-align: center;
          margin-bottom: 80px;
        }
        
        .about-badge {
          display: inline-block;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
          text-transform: uppercase;
        }
        
        .about-title {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.2;
          background: linear-gradient(135deg, #ffffff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 24px;
        }
        
        .about-subtitle {
          font-size: 20px;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .team-section {
          margin-top: 80px;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }
        
        .team-member {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 32px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .team-member::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #7c3aed, #3b82f6, #10b981);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        
        .team-member:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-4px);
        }
        
        .team-member:hover::before {
          transform: translateX(0);
        }
        
        .team-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: 700;
          color: white;
          position: relative;
        }
        
        .team-avatar::after {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(15px);
          z-index: -1;
        }
        
        .team-name {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        
        .team-role {
          font-size: 14px;
          color: #a78bfa;
          margin-bottom: 16px;
          font-weight: 500;
        }
        
        .team-bio {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }
        
        .values-section {
          margin-top: 100px;
          text-align: center;
        }
        
        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 48px;
        }
        
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        
        .value-card {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.1));
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 16px;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }
        
        .value-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          transform: rotate(45deg);
          pointer-events: none;
        }
        
        .value-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
        }
        
        .value-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 12px;
        }
        
        .value-description {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
        }
        
        .cta-section {
          margin-top: 100px;
          text-align: center;
          padding: 60px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(99, 102, 241, 0.1));
          border-radius: 24px;
          border: 1px solid rgba(124, 58, 237, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .cta-section::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
          filter: blur(60px);
        }
        
        .cta-title {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          position: relative;
        }
        
        .cta-description {
          font-size: 18px;
          color: #cbd5e1;
          margin-bottom: 32px;
          position: relative;
        }
        
        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(124, 58, 237, 0.4);
        }
        
        @media (max-width: 768px) {
          .about-container {
            padding: 40px 20px;
          }
          
          .about-title {
            font-size: 40px;
          }
          
          .team-grid, .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <SsgoiTransition id="/demo/about">
        <div className="about-container">
          <div className="about-header">
            <span className="about-badge">About SSGOI</span>
            <h1 className="about-title">
              Redefining Web
              <br />
              Animations
            </h1>
            <p className="about-subtitle">
              We believe animations should feel natural, not mechanical. 
              SSGOI brings physics-based spring animations that remember their state, 
              creating experiences that feel alive and responsive.
            </p>
          </div>
          
          <div className="team-section">
            <h2 className="section-title">Meet Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="team-avatar">MS</div>
                <h3 className="team-name">Meursyphus</h3>
                <p className="team-role">Creator & Lead Developer</p>
                <p className="team-bio">
                  Passionate about creating smooth, intuitive user experiences. 
                  Believes that every pixel should have purpose and every animation should tell a story.
                </p>
              </div>
              
              <div className="team-member">
                <div className="team-avatar">AK</div>
                <h3 className="team-name">Alex Kim</h3>
                <p className="team-role">Core Contributor</p>
                <p className="team-bio">
                  Full-stack developer with a keen eye for performance optimization. 
                  Makes sure SSGOI runs blazing fast on every platform.
                </p>
              </div>
              
              <div className="team-member">
                <div className="team-avatar">SC</div>
                <h3 className="team-name">Sarah Chen</h3>
                <p className="team-role">Design Lead</p>
                <p className="team-bio">
                  UX designer who bridges the gap between beautiful design and smooth implementation. 
                  Champions accessibility in animations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="values-section">
            <h2 className="section-title">Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h3 className="value-title">Performance First</h3>
                <p className="value-description">
                  Every animation is optimized to run at 60fps. 
                  We obsess over performance so you don't have to.
                </p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">🎯</div>
                <h3 className="value-title">Developer Experience</h3>
                <p className="value-description">
                  Simple, intuitive APIs that make complex animations easy. 
                  Great documentation that gets you started in minutes.
                </p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">🌟</div>
                <h3 className="value-title">Innovation</h3>
                <p className="value-description">
                  Pushing the boundaries of what's possible with web animations. 
                  Always exploring new ways to delight users.
                </p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3 className="value-title">Open Source</h3>
                <p className="value-description">
                  Built by the community, for the community. 
                  We believe great tools should be accessible to everyone.
                </p>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <h2 className="cta-title">Ready to Transform Your Animations?</h2>
            <p className="cta-description">
              Join thousands of developers creating beautiful, performant animations with SSGOI.
            </p>
            <Link href="/demo/contact" className="cta-button">
              Get Started Today
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </SsgoiTransition>
    </>
  );
}
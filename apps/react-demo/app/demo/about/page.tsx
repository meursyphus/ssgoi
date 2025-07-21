"use client";

import { SsgoiTransition } from "@ssgoi/react";
import Link from "next/link";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <SsgoiTransition id="/demo/about">
      <div className={styles.aboutContainer}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutBadge}>About SSGOI</span>
          <h1 className={styles.aboutTitle}>
            Redefining Web
            <br />
            Animations
          </h1>
          <p className={styles.aboutSubtitle}>
            We believe animations should feel natural, not mechanical. 
            SSGOI brings physics-based spring animations that remember their state, 
            creating experiences that feel alive and responsive.
          </p>
        </div>
        
        <div className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.teamAvatar}>MS</div>
              <h3 className={styles.teamName}>Meursyphus</h3>
              <p className={styles.teamRole}>Creator & Lead Developer</p>
              <p className={styles.teamBio}>
                Passionate about creating smooth, intuitive user experiences. 
                Believes that every pixel should have purpose and every animation should tell a story.
              </p>
            </div>
            
            <div className={styles.teamMember}>
              <div className={styles.teamAvatar}>AK</div>
              <h3 className={styles.teamName}>Alex Kim</h3>
              <p className={styles.teamRole}>Core Contributor</p>
              <p className={styles.teamBio}>
                Full-stack developer with a keen eye for performance optimization. 
                Makes sure SSGOI runs blazing fast on every platform.
              </p>
            </div>
            
            <div className={styles.teamMember}>
              <div className={styles.teamAvatar}>SC</div>
              <h3 className={styles.teamName}>Sarah Chen</h3>
              <p className={styles.teamRole}>Design Lead</p>
              <p className={styles.teamBio}>
                UX designer who bridges the gap between beautiful design and smooth implementation. 
                Champions accessibility in animations.
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.valuesSection}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>⚡</div>
              <h3 className={styles.valueTitle}>Performance First</h3>
              <p className={styles.valueDescription}>
                Every animation is optimized to run at 60fps. 
                We obsess over performance so you don't have to.
              </p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🎯</div>
              <h3 className={styles.valueTitle}>Developer Experience</h3>
              <p className={styles.valueDescription}>
                Simple, intuitive APIs that make complex animations easy. 
                Great documentation that gets you started in minutes.
              </p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌟</div>
              <h3 className={styles.valueTitle}>Innovation</h3>
              <p className={styles.valueDescription}>
                Pushing the boundaries of what's possible with web animations. 
                Always exploring new ways to delight users.
              </p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3 className={styles.valueTitle}>Open Source</h3>
              <p className={styles.valueDescription}>
                Built by the community, for the community. 
                We believe great tools should be accessible to everyone.
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Animations?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of developers creating beautiful, performant animations with SSGOI.
          </p>
          <Link href="/demo/contact" className={styles.ctaButton}>
            Get Started Today
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </SsgoiTransition>
  );
}
"use client";

import { Ssgoi, type SsgoiConfig } from "@meursyphus/ssgoi-react";
import Link from "next/link";
import { fade, hero } from "./transitions";
import styles from "./layout.module.css";
import "./globals.css";

const ssgoiConfig: SsgoiConfig = {
  transitions: [
    // Use hero transition between products list and detail pages
    { from: "/demo/products", to: "/demo/products/*", transition: hero() },
    { from: "/demo/products/*", to: "/demo/products", transition: hero() }
  ],
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
      return {
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
          element.style.transform = `translateY(${(1 - progress) * -20}px) scale(${0.98 + progress * 0.02})`;
        },
        prepare: (element) => {
          element.style.position = "absolute";
          element.style.width = "100%";
          element.style.top = "0";
          element.style.left = "0";
          element.style.margin = "0";
          element.style.padding = "0";
          element.style.boxSizing = "border-box";
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
    <div className={styles.demoContainer}>
      <nav className={styles.navContainer}>
        <div className={styles.navWrapper}>
          <Link href="/demo" className={styles.navLink}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
          <Link href="/demo/about" className={styles.navLink}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            About
          </Link>
          <Link href="/demo/contact" className={styles.navLink}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Contact
          </Link>
          <Link href="/demo/products" className={styles.navLink}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            Products
          </Link>
        </div>
      </nav>

      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          <Ssgoi config={ssgoiConfig}>{children}</Ssgoi>
        </div>
      </div>
    </div>
  );
}

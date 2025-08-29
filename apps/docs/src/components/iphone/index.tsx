'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './iphone.module.css';

interface IPhoneProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  color?: 'natural' | 'blue' | 'white' | 'black';
}

export default function IPhone({ 
  children, 
  className = '', 
  scale = 1,
  color = 'natural'
}: IPhoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;
      
      container.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateY * 0.1}deg)
        scale3d(${scale * 1.05}, ${scale * 1.05}, ${scale * 1.05})
      `;
    };

    const handleMouseLeave = () => {
      container.style.transform = `
        perspective(1200px)
        rotateX(0deg)
        rotateY(0deg)
        rotateZ(0deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered, scale]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div 
        ref={containerRef}
        className={`${styles.iphone} ${styles[`iphone--${color}`]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: `perspective(1200px) scale3d(${scale}, ${scale}, ${scale})`
        }}
      >
        {/* Titanium Frame */}
        <div className={styles.frame}>
          {/* Dynamic Island */}
          <div className={styles.dynamicIsland}>
            <div className={styles.camera}></div>
          </div>
          
          {/* Screen */}
          <div className={styles.screen}>
            {children}
          </div>
          
          {/* Side buttons with metallic effect */}
          <div className={styles.powerButton}>
            <div className={styles.buttonInner}></div>
          </div>
          <div className={styles.volumeUpButton}>
            <div className={styles.buttonInner}></div>
          </div>
          <div className={styles.volumeDownButton}>
            <div className={styles.buttonInner}></div>
          </div>
          <div className={styles.actionButton}>
            <div className={styles.buttonInner}></div>
          </div>
          
          {/* Metallic edge highlight */}
          <div className={styles.edgeHighlight}></div>
        </div>
        
        {/* Multiple shine layers for depth */}
        <div className={styles.shineLayer1}></div>
        <div className={styles.shineLayer2}></div>
        <div className={styles.reflectionGradient}></div>
      </div>
    </div>
  );
}
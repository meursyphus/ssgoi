'use client';

import React from 'react';
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
  return (
    <div className={`${styles.container} ${className}`}>
      <div 
        className={`${styles.iphone} ${styles[`iphone--${color}`]}`}
        style={{
          transform: `
            perspective(1400px)
            rotateX(-5deg)
            rotateY(-20deg)
            scale3d(${scale}, ${scale}, ${scale})
          `
        }}
      >
        {/* Left Side Frame */}
        <div className={styles.leftSide}>
          <div className={styles.actionButton}>
            <div className={styles.buttonInner}></div>
          </div>
          <div className={styles.volumeUpButton}>
            <div className={styles.buttonInner}></div>
          </div>
          <div className={styles.volumeDownButton}>
            <div className={styles.buttonInner}></div>
          </div>
        </div>
        
        {/* Right Side Frame */}
        <div className={styles.rightSide}>
          <div className={styles.powerButton}>
            <div className={styles.buttonInner}></div>
          </div>
        </div>
        
        {/* Bottom Frame */}
        <div className={styles.bottomSide}>
          <div className={styles.chargingPort}></div>
          <div className={styles.speakerGrillLeft}></div>
          <div className={styles.speakerGrillRight}></div>
        </div>
        
        {/* Main Frame */}
        <div className={styles.frame}>
          {/* Dynamic Island */}
          <div className={styles.dynamicIsland}>
            <div className={styles.camera}></div>
          </div>
          
          {/* Screen */}
          <div className={styles.screen}>
            {children}
          </div>
          
          {/* Frame edges and highlights */}
          <div className={styles.frameEdge}></div>
          <div className={styles.innerBevel}></div>
        </div>
        
        {/* Metallic shine effect */}
        <div className={styles.metallicShine}></div>
      </div>
    </div>
  );
}
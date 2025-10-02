"use client";

import React from "react";

interface IPhone2DProps {
  children: React.ReactNode;
  color?: "natural" | "blue" | "white" | "black";
}

/**
 * Simple 2D iPhone mockup component
 *
 * TODO: Replace with IPhone3D once the HTML component DPR layout issue is fixed
 * The 3D version has a bug where layout starting positions differ in low DPR environments
 */
function IPhone2D({ children }: IPhone2DProps) {
  // iPhone-like dimensions with proper aspect ratio

  return (
    <div className="flex items-center justify-center w-full h-full">
      {/* iPhone frame */}
      <div
        className={`relative w-full max-w-[350px] aspect-[9/19.5] bg-gray-900 rounded-[48px] p-3 shadow-2xl`}
      >
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-3xl z-10" />

        {/* Screen */}
        <div className="relative w-full h-full bg-black rounded-[40px] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export default IPhone2D;

/* ============================================================================
 * 3D iPhone Component (Currently Disabled)
 * ============================================================================
 * TODO: Re-enable when DPR layout issue is fixed
 * Issue: HTML component has incorrect layout starting positions in low DPR environments
 * ============================================================================

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  Box,
  Cylinder,
  Environment,
  PresentationControls,
  Float,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

interface IPhone3DProps {
  children: React.ReactNode;
  color?: "natural" | "blue" | "white" | "black";
}

function IPhoneModel({
  children,
  color = "natural",
}: {
  children: React.ReactNode;
  color: string;
}) {
  const meshRef = useRef<THREE.Group>(null);

  // Color mappings for titanium finishes
  const colors = {
    natural: {
      frame: "#c0c0c0", // Silver metallic
      frameMetallic: 0.95,
      frameRoughness: 0.15,
    },
    blue: {
      frame: "#2a3b4e",
      frameMetallic: 1,
      frameRoughness: 0.3,
    },
    white: {
      frame: "#e8e8e8",
      frameMetallic: 0.9,
      frameRoughness: 0.2,
    },
    black: {
      frame: "#1a1b1d",
      frameMetallic: 1,
      frameRoughness: 0.2,
    },
  };

  const currentColor = colors[color as keyof typeof colors];

  // iPhone 15 Pro actual dimensions (in Three.js units)
  const phoneWidth = 2.4;
  const phoneHeight = 5.2;
  const phoneDepth = 0.28;
  const screenInset = 0.08; // Bezel size
  const scale = 0.65; // Overall scale

  return (
    <group ref={meshRef} position={[0, 0, 0]} scale={[scale, scale, scale]}>
      {/* Main body/frame - thinner design *\/}
      <RoundedBox
        args={[phoneWidth, phoneHeight, phoneDepth]}
        radius={0.35}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={currentColor.frame}
          metalness={currentColor.frameMetallic}
          roughness={currentColor.frameRoughness}
          envMapIntensity={1.5} // Enhanced reflection
        />
      </RoundedBox>

      {/* Screen bezel (slightly inset) *\/}
      <RoundedBox
        args={[phoneWidth - 0.06, phoneHeight - 0.06, phoneDepth + 0.01]}
        radius={0.32}
        smoothness={4}
        position={[0, 0, 0.005]}
      >
        <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.8} />
      </RoundedBox>

      {/* Screen - render texture approach *\/}
      <group position={[0, 0, phoneDepth / 2 - 0.01]}>
        {/* Screen plane with rounded corners *\/}
        <RoundedBox
          args={[
            phoneWidth - screenInset * 2,
            phoneHeight - screenInset * 2,
            0.01,
          ]}
          radius={0.28}
          smoothness={4}
        >
          <meshBasicMaterial color="#000000" />
        </RoundedBox>

        {/* HTML overlay positioned exactly on screen *\/}
        <Html
          transform
          occlude
          distanceFactor={2.5}
          position={[0, 0, 0.02]}
          style={{
            width: `${(phoneWidth - screenInset * 2) * 150}px`,
            height: `${(phoneHeight - screenInset * 2) * 150}px`,
            overflow: "hidden",
            borderRadius: "20px",
          }}
          center
        >
          {children}
        </Html>
      </group>

      {/* Dynamic Island *\/}
      <RoundedBox
        args={[0.8, 0.22, 0.05]}
        radius={0.1}
        smoothness={4}
        position={[0, 2.35, 0.15]} // Adjusted for thinner frame
      >
        <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.8} />
      </RoundedBox>

      {/* Camera lens *\/}
      <Cylinder
        args={[0.04, 0.04, 0.02, 32]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 2.35, 0.16]} // Adjusted for thinner frame
      >
        <meshStandardMaterial color="#1a1a2a" metalness={1} roughness={0.2} />
      </Cylinder>

      {/* Power button (right side) *\/}
      <Box args={[0.015, 0.6, 0.12]} position={[1.21, 0.8, 0]}>
        {" "}
        {/* Thinner button *\/}
        <meshStandardMaterial
          color="#b8b8b8" // Silver color
          metalness={0.95}
          roughness={0.2}
        />
      </Box>

      {/* Volume up button (left side) *\/}
      <Box args={[0.015, 0.4, 0.12]} position={[-1.21, 1.2, 0]}>
        {" "}
        {/* Thinner button *\/}
        <meshStandardMaterial
          color="#b8b8b8" // Silver color
          metalness={0.95}
          roughness={0.2}
        />
      </Box>

      {/* Volume down button (left side) *\/}
      <Box args={[0.015, 0.4, 0.12]} position={[-1.21, 0.6, 0]}>
        {" "}
        {/* Thinner button *\/}
        <meshStandardMaterial
          color="#b8b8b8" // Silver color
          metalness={0.95}
          roughness={0.2}
        />
      </Box>

      {/* Action button (left side) *\/}
      <Box args={[0.02, 0.3, 0.15]} position={[-1.21, 1.8, 0]}>
        <meshStandardMaterial color="#ff9500" metalness={0.9} roughness={0.3} />
      </Box>

      {/* Bottom speaker grills *\/}
      <group position={[0, -2.6, 0]}>
        {/* Left speaker *\/}
        {Array.from({ length: 6 }).map((_, i) => (
          <Cylinder
            key={`left-${i}`}
            args={[0.015, 0.015, 0.1, 6]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[-0.3 - i * 0.04, 0, 0]}
          >
            <meshStandardMaterial color="#0a0a0a" />
          </Cylinder>
        ))}

        {/* Charging port *\/}
        <RoundedBox args={[0.22, 0.02, 0.1]} radius={0.01} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0a0a0a" />
        </RoundedBox>

        {/* Right speaker *\/}
        {Array.from({ length: 6 }).map((_, i) => (
          <Cylinder
            key={`right-${i}`}
            args={[0.015, 0.015, 0.1, 6]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0.3 + i * 0.04, 0, 0]}
          >
            <meshStandardMaterial color="#0a0a0a" />
          </Cylinder>
        ))}
      </group>

      {/* Camera bump (back) *\/}
      <group position={[-0.55, 1.8, -0.2]}>
        <RoundedBox args={[0.9, 0.9, 0.15]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color={currentColor.frame}
            metalness={currentColor.frameMetallic}
            roughness={currentColor.frameRoughness}
          />
        </RoundedBox>

        {/* Three camera lenses *\/}
        <Cylinder
          args={[0.18, 0.18, 0.08, 32]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[-0.2, 0.2, 0.08]}
        >
          <meshStandardMaterial color="#1a1a1a" metalness={1} roughness={0.1} />
        </Cylinder>
        <Cylinder
          args={[0.18, 0.18, 0.08, 32]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0.2, 0.2, 0.08]}
        >
          <meshStandardMaterial color="#1a1a1a" metalness={1} roughness={0.1} />
        </Cylinder>
        <Cylinder
          args={[0.22, 0.22, 0.08, 32]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -0.2, 0.08]}
        >
          <meshStandardMaterial color="#1a1a1a" metalness={1} roughness={0.1} />
        </Cylinder>

        {/* LiDAR scanner *\/}
        <Cylinder
          args={[0.06, 0.06, 0.05, 32]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0.35, -0.1, 0.08]}
        >
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.8}
            roughness={0.3}
          />
        </Cylinder>
      </group>
    </group>
  );
}

export default function IPhone3D({
  children,
  color = "natural",
}: IPhone3DProps) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "600px" }}>
      <Canvas
        camera={{ position: [2.8, 1.2, 4], fov: 42 }} // Adjusted camera for better view
        style={{ background: "transparent" }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <PresentationControls
            global
            rotation={[-0.4, 0.9, 0.1]}
            polar={[-0.4, 0.2]}
            azimuth={[-1, 0.75]}
            snap={false} // Disable snap to prevent stuck state
            enabled={true} // Ensure controls are enabled
            cursor={true} // Show cursor feedback
          >
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.15}>
              <IPhoneModel color={color}>{children}</IPhoneModel>
            </Float>
          </PresentationControls>

          {/* Lighting *\/}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <directionalLight position={[0, 5, 5]} intensity={0.5} castShadow />

          {/* Environment for realistic reflections *\/}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

 * ============================================================================ */

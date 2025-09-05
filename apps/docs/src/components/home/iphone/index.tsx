"use client";

import React, { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, createPortal, useThree } from "@react-three/fiber";
import {
  RoundedBox,
  Box,
  Cylinder,
  MeshReflectorMaterial,
  Environment,
  PresentationControls,
  Float,
  Html,
  useFBO,
  Plane,
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
  const { viewport } = useThree();
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });

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

  // Calculate responsive dimensions based on viewport
  useEffect(() => {
    // Calculate screen dimensions based on viewport size
    const aspectRatio = window.innerHeight / window.innerWidth;
    const baseFactor = Math.min(viewport.width, viewport.height) * 100;
    
    setScreenDimensions({
      width: (phoneWidth - screenInset * 2) * baseFactor * (aspectRatio > 1 ? 1.2 : 1),
      height: (phoneHeight - screenInset * 2) * baseFactor * (aspectRatio > 1 ? 1.2 : 1),
    });
  }, [viewport, phoneWidth, phoneHeight, screenInset]);

  return (
    <group ref={meshRef} position={[0, 0, 0]} scale={[scale, scale, scale]}>
      {/* Main body/frame - thinner design */}
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

      {/* Screen bezel (slightly inset) */}
      <RoundedBox
        args={[phoneWidth - 0.06, phoneHeight - 0.06, phoneDepth + 0.01]}
        radius={0.32}
        smoothness={4}
        position={[0, 0, 0.005]}
      >
        <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.8} />
      </RoundedBox>

      {/* Screen - render texture approach */}
      <group position={[0, 0, phoneDepth / 2 - 0.01]}>
        {/* Screen plane with rounded corners */}
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

        {/* HTML overlay positioned exactly on screen */}
        <Html
          transform
          occlude
          distanceFactor={Math.min(viewport.width / 4, 2.5)}
          position={[0, 0, 0.02]}
          style={{
            width: `${screenDimensions.width}px`,
            height: `${screenDimensions.height}px`,
            overflow: "hidden",
            borderRadius: "20px",
            transform: "translate3d(0, 0, 0)", // Force GPU acceleration
            backfaceVisibility: "hidden", // Prevent flickering
          }}
          center
        >
          {children}
        </Html>
      </group>

      {/* Dynamic Island */}
      <RoundedBox
        args={[0.8, 0.22, 0.05]}
        radius={0.1}
        smoothness={4}
        position={[0, 2.35, 0.15]} // Adjusted for thinner frame
      >
        <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.8} />
      </RoundedBox>

      {/* Camera lens */}
      <Cylinder
        args={[0.04, 0.04, 0.02, 32]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 2.35, 0.16]} // Adjusted for thinner frame
      >
        <meshStandardMaterial color="#1a1a2a" metalness={1} roughness={0.2} />
      </Cylinder>

      {/* Power button (right side) */}
      <Box args={[0.015, 0.6, 0.12]} position={[1.21, 0.8, 0]}>
        {" "}
        {/* Thinner button */}
        <meshStandardMaterial
          color="#b8b8b8" // Silver color
          metalness={0.95}
          roughness={0.2}
        />
      </Box>

      {/* Volume up button (left side) */}
      <Box args={[0.015, 0.4, 0.12]} position={[-1.21, 1.2, 0]}>
        {" "}
        {/* Thinner button */}
        <meshStandardMaterial
          color="#b8b8b8" // Silver color
          metalness={0.95}
          roughness={0.2}
        />
      </Box>

      {/* Volume down button (left side) */}
      <Box args={[0.015, 0.4, 0.12]} position={[-1.21, 0.6, 0]}>
        {" "}
        {/* Thinner button */}
        <meshStandardMaterial
          color="#b8b8b8" // Silver color
          metalness={0.95}
          roughness={0.2}
        />
      </Box>

      {/* Action button (left side) */}
      <Box args={[0.02, 0.3, 0.15]} position={[-1.21, 1.8, 0]}>
        <meshStandardMaterial color="#ff9500" metalness={0.9} roughness={0.3} />
      </Box>

      {/* Bottom speaker grills */}
      <group position={[0, -2.6, 0]}>
        {/* Left speaker */}
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

        {/* Charging port */}
        <RoundedBox args={[0.22, 0.02, 0.1]} radius={0.01} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0a0a0a" />
        </RoundedBox>

        {/* Right speaker */}
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

      {/* Camera bump (back) */}
      <group position={[-0.55, 1.8, -0.2]}>
        <RoundedBox args={[0.9, 0.9, 0.15]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color={currentColor.frame}
            metalness={currentColor.frameMetallic}
            roughness={currentColor.frameRoughness}
          />
        </RoundedBox>

        {/* Three camera lenses */}
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

        {/* LiDAR scanner */}
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
  const [cameraSettings, setCameraSettings] = useState({
    position: [2.8, 1.2, 4] as [number, number, number],
    fov: 42,
  });

  useEffect(() => {
    // Adjust camera settings based on window size
    const updateCamera = () => {
      const aspectRatio = window.innerHeight / window.innerWidth;
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      
      if (isMobile) {
        setCameraSettings({
          position: [2.5, 1.0, 3.5],
          fov: 45,
        });
      } else if (isTablet) {
        setCameraSettings({
          position: [2.6, 1.1, 3.8],
          fov: 43,
        });
      } else if (aspectRatio > 1.2) {
        // Portrait-oriented displays
        setCameraSettings({
          position: [2.8, 1.2, 4.5],
          fov: 40,
        });
      } else {
        // Default for landscape displays
        setCameraSettings({
          position: [2.8, 1.2, 4],
          fov: 42,
        });
      }
    };

    updateCamera();
    window.addEventListener('resize', updateCamera);
    return () => window.removeEventListener('resize', updateCamera);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "600px" }}>
      <Canvas
        camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
        style={{ background: "transparent" }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <PresentationControls
            global
            rotation={[-0.3, 0.5, 0.1]}
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

          {/* Lighting */}
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

          {/* Environment for realistic reflections */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

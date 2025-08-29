'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  RoundedBox, 
  Box, 
  Cylinder,
  MeshReflectorMaterial,
  Environment,
  PresentationControls,
  Float,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

interface IPhone3DProps {
  children: React.ReactNode;
  color?: 'natural' | 'blue' | 'white' | 'black';
}

function IPhoneModel({ children, color = 'natural' }: { children: React.ReactNode; color: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Color mappings for titanium finishes
  const colors = {
    natural: {
      frame: '#9e9891',
      frameMetallic: 1,
      frameRoughness: 0.3,
    },
    blue: {
      frame: '#2a3b4e',
      frameMetallic: 1,
      frameRoughness: 0.3,
    },
    white: {
      frame: '#d8d6d4',
      frameMetallic: 0.9,
      frameRoughness: 0.4,
    },
    black: {
      frame: '#1a1b1d',
      frameMetallic: 1,
      frameRoughness: 0.2,
    },
  };

  const currentColor = colors[color as keyof typeof colors];
  
  // Scale down all dimensions
  const scale = 0.8;

  return (
    <group ref={meshRef} position={[0, 0, 0]} scale={[scale, scale, scale]}>
      {/* Main body/frame */}
      <RoundedBox
        args={[2.4, 5.2, 0.35]}
        radius={0.35}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={currentColor.frame}
          metalness={currentColor.frameMetallic}
          roughness={currentColor.frameRoughness}
        />
      </RoundedBox>

      {/* Screen bezel (slightly inset) */}
      <RoundedBox
        args={[2.25, 5.05, 0.36]}
        radius={0.32}
        smoothness={4}
        position={[0, 0, 0.01]}
      >
        <meshStandardMaterial 
          color="#000000"
          metalness={0.8}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Screen */}
      <Box args={[2.15, 4.95, 0.02]} position={[0, 0, 0.19]}>
        <meshBasicMaterial color="#000000" />
        <Html
          transform
          distanceFactor={1.5}
          position={[0, 0, 0.01]}
          style={{
            width: '345px',
            height: '792px',
            borderRadius: '48px',
            overflow: 'hidden',
            background: '#000',
            transform: 'scale(1)'
          }}
        >
          <div style={{ width: '100%', height: '100%', transform: 'scale(0.93)' }}>
            {children}
          </div>
        </Html>
      </Box>

      {/* Dynamic Island */}
      <RoundedBox
        args={[0.8, 0.22, 0.05]}
        radius={0.1}
        smoothness={4}
        position={[0, 2.35, 0.19]}
      >
        <meshStandardMaterial 
          color="#000000"
          metalness={0.5}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Camera lens */}
      <Cylinder
        args={[0.04, 0.04, 0.02, 32]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 2.35, 0.2]}
      >
        <meshStandardMaterial
          color="#1a1a2a"
          metalness={1}
          roughness={0.2}
        />
      </Cylinder>

      {/* Power button (right side) */}
      <Box args={[0.02, 0.6, 0.15]} position={[1.21, 0.8, 0]}>
        <meshStandardMaterial
          color="#6a6c6e"
          metalness={1}
          roughness={0.4}
        />
      </Box>

      {/* Volume up button (left side) */}
      <Box args={[0.02, 0.4, 0.15]} position={[-1.21, 1.2, 0]}>
        <meshStandardMaterial
          color="#6a6c6e"
          metalness={1}
          roughness={0.4}
        />
      </Box>

      {/* Volume down button (left side) */}
      <Box args={[0.02, 0.4, 0.15]} position={[-1.21, 0.6, 0]}>
        <meshStandardMaterial
          color="#6a6c6e"
          metalness={1}
          roughness={0.4}
        />
      </Box>

      {/* Action button (left side) */}
      <Box args={[0.02, 0.3, 0.15]} position={[-1.21, 1.8, 0]}>
        <meshStandardMaterial
          color="#ff9500"
          metalness={0.9}
          roughness={0.3}
        />
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
        <RoundedBox
          args={[0.22, 0.02, 0.1]}
          radius={0.01}
          position={[0, 0, 0]}
        >
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
        <RoundedBox
          args={[0.9, 0.9, 0.15]}
          radius={0.15}
          smoothness={4}
        >
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
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={1}
            roughness={0.1}
          />
        </Cylinder>
        <Cylinder
          args={[0.18, 0.18, 0.08, 32]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0.2, 0.2, 0.08]}
        >
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={1}
            roughness={0.1}
          />
        </Cylinder>
        <Cylinder
          args={[0.22, 0.22, 0.08, 32]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -0.2, 0.08]}
        >
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={1}
            roughness={0.1}
          />
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

export default function IPhone3D({ children, color = 'natural' }: IPhone3DProps) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '600px' }}>
      <Canvas
        camera={{ position: [3, 1.5, 4.5], fov: 40 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PresentationControls
            global
            rotation={[0.13, -0.5, 0]}
            polar={[-0.4, 0.2]}
            azimuth={[-1, 0.75]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <Float
              speed={1.5}
              rotationIntensity={0.3}
              floatIntensity={0.15}
            >
              <IPhoneModel color={color}>
                {children}
              </IPhoneModel>
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
          <directionalLight
            position={[0, 5, 5]}
            intensity={0.5}
            castShadow
          />
          
          {/* Environment for realistic reflections */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
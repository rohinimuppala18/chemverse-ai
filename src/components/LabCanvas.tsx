import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Conical Flask Component
const ErlenmeyerFlask: React.FC<{ 
  position: [number, number, number]; 
  color: string; 
  scale?: number; 
  rotationY?: number 
}> = ({ position, color, scale = 1, rotationY = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.5 + position[0]) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]} rotation={[0, rotationY, 0]}>
      {/* Conical body base */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.32, 0.6, 16]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          transmission={0.9} 
          roughness={0.1}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>
      
      {/* Liquid inside the flask base */}
      <mesh position={[0, -0.08, 0]}>
        <coneGeometry args={[0.28, 0.42, 16]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.3} 
          transparent 
          opacity={0.7} 
        />
      </mesh>
      
      {/* Flask Neck */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.32, 16]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          transmission={0.9} 
          roughness={0.1}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// Holographic Floating HUD panel
const HolographicHUD: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({ position, rotationY = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.2) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Outer Glow frame */}
      <mesh>
        <planeGeometry args={[0.9, 0.55]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.25} />
      </mesh>
      
      {/* Core glass panel transparency */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.85, 0.5]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* Hologram Tech Indicators */}
      <mesh position={[-0.26, 0.14, 0.01]}>
        <ringGeometry args={[0.04, 0.05, 16]} />
        <meshBasicMaterial color="#ff0055" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.26, 0.14, 0.01]}>
        <circleGeometry args={[0.02, 8]} />
        <meshBasicMaterial color="#ff0055" transparent opacity={0.4} />
      </mesh>

      {/* Telemetry Bar graphs */}
      <mesh position={[0.1, 0.1, 0.01]}>
        <planeGeometry args={[0.35, 0.03]} />
        <meshBasicMaterial color="#39ff14" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.05, 0.02, 0.01]}>
        <planeGeometry args={[0.25, 0.03]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.12, -0.06, 0.01]}>
        <planeGeometry args={[0.39, 0.03]} />
        <meshBasicMaterial color="#b026ff" transparent opacity={0.7} />
      </mesh>

      {/* Grid Pattern Dot indicators */}
      <mesh position={[-0.26, -0.1, 0.01]}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.18, -0.1, 0.01]}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// Beaker Reaction logic wrapper
const ReactionBeaker: React.FC<{ 
  reaction: 'none' | 'acid_base' | 'sodium_water' | 'copper_acid';
  mixTrigger: number;
}> = ({ reaction, mixTrigger }) => {
  const liquidRef = useRef<THREE.Mesh>(null);
  const particleGroupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (reaction !== 'none') {
      setProgress(0);
    }
  }, [mixTrigger, reaction]);

  useFrame(({ clock }) => {
    if (reaction === 'none') {
      if (liquidRef.current) {
        const mat = liquidRef.current.material as THREE.MeshStandardMaterial;
        mat.color.setHex(0x1e3a8a);
        liquidRef.current.scale.y = 1.0;
      }
      return;
    }

    if (progress < 1) {
      setProgress((prev) => Math.min(prev + 0.008, 1));
    }

    const t = clock.getElapsedTime();
    
    if (liquidRef.current) {
      const mat = liquidRef.current.material as THREE.MeshStandardMaterial;
      const wave = Math.sin(t * 6) * 0.015;
      liquidRef.current.scale.y = 1.1 + wave;

      if (reaction === 'acid_base') {
        const startColor = new THREE.Color('#ff0055'); // Magenta
        const endColor = new THREE.Color('#39ff14'); // Green
        mat.color.copy(startColor).lerp(endColor, progress);
      } else if (reaction === 'sodium_water') {
        const startColor = new THREE.Color('#1e40af'); // Blue
        const endColor = new THREE.Color('#b026ff'); // Purple
        mat.color.copy(startColor).lerp(endColor, progress);
      } else if (reaction === 'copper_acid') {
        const startColor = new THREE.Color('#1e3a8a');
        const endColor = new THREE.Color('#00f0ff'); // Cyan
        mat.color.copy(startColor).lerp(endColor, progress);
      }
    }

    if (particleGroupRef.current) {
      const children = particleGroupRef.current.children;
      children.forEach((mesh, idx) => {
        const p = mesh as THREE.Mesh;
        
        if (reaction === 'acid_base') {
          p.position.y += 0.012;
          p.position.x += Math.sin(t * 3 + idx) * 0.004;
          if (p.position.y > 0.6) {
            p.position.y = -0.55;
            p.position.x = (Math.random() - 0.5) * 0.5;
            p.position.z = (Math.random() - 0.5) * 0.5;
          }
          p.scale.setScalar(0.035 * (1.1 - p.position.y));
        } else if (reaction === 'sodium_water') {
          p.position.y = 0.52 + Math.sin(t * 18 + idx) * 0.08;
          p.position.x = Math.sin(idx * 4.7) * 0.35 * (1.2 - progress);
          p.position.z = Math.cos(idx * 4.7) * 0.35 * (1.2 - progress);
          p.scale.setScalar(0.06 * Math.random());
        } else if (reaction === 'copper_acid') {
          p.position.y += 0.008;
          p.position.x += Math.cos(t * 2 + idx) * 0.002;
          if (p.position.y > 0.6) {
            p.position.y = -0.55;
            p.position.x = (Math.random() - 0.5) * 0.55;
            p.position.z = (Math.random() - 0.5) * 0.55;
          }
          p.scale.setScalar(0.045);
        }
      });
    }
  });

  const particleData = Array.from({ length: 40 }).map(() => ({
    pos: [
      (Math.random() - 0.5) * 0.65,
      (Math.random() - 0.5) * 1.1,
      (Math.random() - 0.5) * 0.65,
    ] as [number, number, number],
  }));

  return (
    <group>
      {/* 3D Glass Beaker Container */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 2.0, 32, 1, true]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          roughness={0.05}
          metalness={0.1}
          transmission={0.95} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Beaker base metallic glow */}
      <mesh position={[0, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.83, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.4} transparent />
      </mesh>

      {/* Beaker lip ring */}
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.83, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.2} transparent />
      </mesh>
      
      {/* Liquid Geometry */}
      <mesh ref={liquidRef} position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 1.1, 32]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          roughness={0.15} 
          metalness={0.4} 
          transparent 
          opacity={0.65} 
        />
      </mesh>

      {/* Bubbles / Sparklers Group */}
      <group ref={particleGroupRef}>
        {reaction !== 'none' && particleData.map((data, idx) => (
          <mesh key={idx} position={data.pos}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial 
              color={
                reaction === 'sodium_water' 
                  ? '#ffaa00'
                  : reaction === 'acid_base'
                    ? '#ffffff'
                    : '#39ff14'
              } 
              transparent 
              opacity={0.8} 
            />
          </mesh>
        ))}
      </group>

      {/* Solid Sodium chunk */}
      {reaction === 'sodium_water' && progress < 0.9 && (
        <mesh position={[0, 0.55, 0]} rotation={[progress * 5, progress * 2, 0]}>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.4} metalness={0.7} />
        </mesh>
      )}

      {/* Reaction Light Glow */}
      {reaction !== 'none' && (
        <pointLight 
          position={[0, 0.4, 0]} 
          intensity={reaction === 'sodium_water' ? 3 * (1.1 - progress) : 1.2} 
          color={
            reaction === 'sodium_water' 
              ? '#ff9900'
              : reaction === 'acid_base' 
                ? '#39ff14' 
                : '#00f0ff'
          } 
        />
      )}
    </group>
  );
};

// Lab Environment components (Pedestal, Support Rails, Grid table, Injector nozzles)
const LabEnvironment: React.FC = () => {
  return (
    <group>
      {/* 3D Circular Pedestal (Beaker stand) */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.3, 32]} />
        <meshStandardMaterial color="#0f111a" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0, -1.04, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.02, 32]} />
        <meshStandardMaterial color="#0b0c10" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Neon border glow around pedestal */}
      <mesh position={[0, -1.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.42, 1.48, 64]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.6} transparent />
      </mesh>

      {/* Support posts on the sides */}
      <mesh position={[-1.2, -0.1, -0.8]}>
        <cylinderGeometry args={[0.04, 0.04, 2.0, 8]} />
        <meshStandardMaterial color="#374151" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[1.2, -0.1, -0.8]}>
        <cylinderGeometry args={[0.04, 0.04, 2.0, 8]} />
        <meshStandardMaterial color="#374151" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Top Injector Ring / Laser nozzle above beaker */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 0.25, 32]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Injector Ring Neon Indicator */}
      <mesh position={[0, 1.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.69, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.8} transparent />
      </mesh>

      {/* Grid Floor */}
      <gridHelper args={[16, 16, '#00f0ff', '#1f2937']} position={[0, -1.35, 0]} />

      {/* Background laboratory containment walls (laser boundary cages) */}
      <mesh position={[0, 1.0, -4.5]}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial color="#1f2937" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh position={[-4.5, 1.0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial color="#1f2937" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh position={[4.5, 1.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial color="#1f2937" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
};

interface LabCanvasProps {
  reaction: 'none' | 'acid_base' | 'sodium_water' | 'copper_acid';
  mixTrigger: number;
}

export const LabCanvas: React.FC<LabCanvasProps> = ({ reaction, mixTrigger }) => {
  return (
    <div className="w-full h-full min-h-[400px] border border-cyan-500/20 rounded-2xl glass-panel relative overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.1)]">
      <div className="absolute top-4 left-4 z-10 font-orbitron text-xs text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/20 backdrop-blur-sm pointer-events-none">
        REACTOR CHAMBER: ACTIVE
      </div>
      {reaction !== 'none' && (
        <div className="absolute top-4 right-4 z-10 font-orbitron text-xs text-pink-500 bg-pink-950/40 px-3 py-1.5 rounded-lg border border-pink-500/20 backdrop-blur-sm pointer-events-none animate-pulse">
          REACTION ACTIVE: {reaction.toUpperCase().replace('_', ' ')}
        </div>
      )}

      <Canvas camera={{ position: [0, 0.6, 3.4], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={0.55} />
        
        {/* Main Overhead light source */}
        <pointLight position={[0, 5, 0]} intensity={1.8} distance={15} decay={1.5} />
        
        {/* Cyberpunk accent lights */}
        <pointLight position={[-4, 2, -2]} intensity={1.0} color="#00f0ff" />
        <pointLight position={[4, 2, -2]} intensity={0.8} color="#b026ff" />
        <pointLight position={[0, -2, 2]} intensity={0.4} color="#ff0055" />
        
        <Stars radius={120} depth={50} count={350} factor={3} saturation={0.5} fade speed={1} />
        
        {/* 3D Lab Scene Elements */}
        <LabEnvironment />

        {/* Side Flasks (Decoration) */}
        <ErlenmeyerFlask position={[-1.1, -1.03, 0.4]} color="#ff0055" scale={0.7} rotationY={Math.PI / 4} />
        <ErlenmeyerFlask position={[1.1, -1.03, 0.4]} color="#39ff14" scale={0.75} rotationY={-Math.PI / 6} />

        {/* Holographic panels (Decoration) */}
        <HolographicHUD position={[-1.3, 0.2, 0.2]} rotationY={Math.PI / 5} />
        <HolographicHUD position={[1.3, 0.2, 0.2]} rotationY={-Math.PI / 5} />

        {/* Central Beaker */}
        <ReactionBeaker reaction={reaction} mixTrigger={mixTrigger} />
        
        <OrbitControls 
          enableZoom={true} 
          maxDistance={5.5} 
          minDistance={1.6} 
          maxPolarAngle={Math.PI / 2 + 0.1} // Prevent looking directly under the grid table
        />
      </Canvas>
    </div>
  );
};

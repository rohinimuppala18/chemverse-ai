import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Electron: React.FC<{ 
  radius: number; 
  speed: number; 
  angleOffset?: number; 
  color: string; 
  tilt?: [number, number, number] 
}> = ({ radius, speed, angleOffset = 0, color, tilt = [0, 0, 0] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + angleOffset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
    }
  });

  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* Orbit path ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color={color} opacity={0.15} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const AtomNucleus: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      groupRef.current.rotation.x = clock.getElapsedTime() * 0.25;
    }
  });

  // Nucleus is made of clusters of pink and cyan spheres representing protons/neutrons
  const positions: [number, number, number][] = [
    [0, 0, 0],
    [0.25, 0.1, 0.1],
    [-0.25, -0.1, -0.1],
    [0.1, -0.25, 0.2],
    [-0.1, 0.25, -0.2],
    [0.2, -0.2, -0.15],
    [-0.2, 0.2, 0.15],
  ];

  return (
    <group ref={groupRef}>
      {positions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial 
            color={idx % 2 === 0 ? '#00f0ff' : '#ff0055'} 
            emissive={idx % 2 === 0 ? '#00c0ff' : '#ff0033'}
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export const OrbitingAtom: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[350px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0055" />
        
        <Stars radius={100} depth={50} count={1200} factor={4} saturation={0.5} fade speed={1} />
        
        <AtomNucleus />
        
        {/* Electron shell systems */}
        <Electron radius={2.2} speed={1.8} color="#00f0ff" tilt={[0.4, 0.2, 0.1]} />
        <Electron radius={2.8} speed={1.3} angleOffset={Math.PI / 3} color="#ff0055" tilt={[-0.4, 0.5, -0.2]} />
        <Electron radius={3.4} speed={0.9} angleOffset={Math.PI * (2 / 3)} color="#b026ff" tilt={[0.2, -0.6, 0.4]} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

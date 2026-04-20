import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

// Simple particle component
function Particles() {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  const positions = [];
  const colors = [];
  
  for (let i = 0; i < 1000; i++) {
    positions.push(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    colors.push(
      Math.random(),
      Math.random() * 0.5 + 0.5,
      1
    );
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={new Float32Array(positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={new Float32Array(colors)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors />
    </points>
  );
}

// Simple floating cube
function FloatingCube() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={[2, 1, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
    </Float>
  );
}

// Simple floating sphere
function FloatingSphere() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh position={[-2, -1, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.3} />
      </mesh>
    </Float>
  );
}

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <Particles />
        <FloatingCube />
        <FloatingSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;

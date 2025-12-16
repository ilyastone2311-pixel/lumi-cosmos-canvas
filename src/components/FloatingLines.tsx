import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface LineWaveProps {
  position: [number, number, number];
  rotation: number;
  lineCount: number;
  lineDistance: number;
  colors: string[];
  animationSpeed: number;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  bendRadius: number;
  bendStrength: number;
}

const LineWave = ({
  position,
  rotation,
  lineCount,
  lineDistance,
  colors,
  animationSpeed,
  mousePos,
  bendRadius,
  bendStrength,
}: LineWaveProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<(THREE.Line | null)[]>([]);
  const time = useRef(0);

  const linesData = useMemo(() => {
    const result: { points: THREE.Vector3[]; color: THREE.Color }[] = [];
    
    for (let i = 0; i < lineCount; i++) {
      const points: THREE.Vector3[] = [];
      const segments = 100;
      
      for (let j = 0; j <= segments; j++) {
        const x = (j / segments) * 20 - 10;
        const y = i * lineDistance - (lineCount * lineDistance) / 2;
        points.push(new THREE.Vector3(x, y, 0));
      }
      
      const colorIndex = i % colors.length;
      const color = new THREE.Color(colors[colorIndex]);
      
      result.push({ points, color });
    }
    
    return result;
  }, [lineCount, lineDistance, colors]);

  useFrame((_, delta) => {
    time.current += delta * animationSpeed;
    
    linesRef.current.forEach((line, lineIndex) => {
      if (!line) return;
      
      const positions = line.geometry.attributes.position;
      const array = positions.array as Float32Array;
      
      for (let i = 0; i <= 100; i++) {
        const x = array[i * 3];
        const baseY = lineIndex * lineDistance - (lineCount * lineDistance) / 2;
        
        // Wave animation
        const wave = Math.sin(x * 0.3 + time.current + lineIndex * 0.5) * 0.5;
        const wave2 = Math.sin(x * 0.5 + time.current * 1.3 + lineIndex * 0.3) * 0.3;
        
        // Mouse interaction
        const dx = x - mousePos.current.x * 10;
        const dy = baseY - mousePos.current.y * 5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const bendEffect = dist < bendRadius ? (1 - dist / bendRadius) * bendStrength * 0.1 : 0;
        
        array[i * 3 + 1] = baseY + wave + wave2 + bendEffect;
      }
      
      positions.needsUpdate = true;
    });
    
    if (groupRef.current) {
      groupRef.current.rotation.z = rotation * (Math.PI / 180);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {linesData.map((lineData, index) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(lineData.points);
        return (
          <primitive
            key={index}
            object={new THREE.Line(
              geometry,
              new THREE.LineBasicMaterial({
                color: lineData.color,
                transparent: true,
                opacity: 0.6,
              })
            )}
            ref={(el: THREE.Line | null) => {
              linesRef.current[index] = el;
            }}
          />
        );
      })}
    </group>
  );
};

const Scene = ({
  colors,
  animationSpeed,
  bendRadius,
  bendStrength,
  enabledWaves,
}: {
  colors: string[];
  animationSpeed: number;
  bendRadius: number;
  bendStrength: number;
  enabledWaves: ('top' | 'middle' | 'bottom')[];
}) => {
  const mousePos = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: (e.clientX / size.width) * 2 - 1,
        y: -(e.clientY / size.height) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  useFrame(() => {
    // Smooth mouse following
    mousePos.current.x += (targetMouse.current.x - mousePos.current.x) * 0.05;
    mousePos.current.y += (targetMouse.current.y - mousePos.current.y) * 0.05;
  });

  return (
    <>
      {enabledWaves.includes('top') && (
        <LineWave
          position={[0, 3, 0]}
          rotation={15}
          lineCount={6}
          lineDistance={0.8}
          colors={colors}
          animationSpeed={animationSpeed}
          mousePos={mousePos}
          bendRadius={bendRadius}
          bendStrength={bendStrength}
        />
      )}
      {enabledWaves.includes('middle') && (
        <LineWave
          position={[0, 0, 0]}
          rotation={0}
          lineCount={8}
          lineDistance={0.6}
          colors={colors}
          animationSpeed={animationSpeed}
          mousePos={mousePos}
          bendRadius={bendRadius}
          bendStrength={bendStrength}
        />
      )}
      {enabledWaves.includes('bottom') && (
        <LineWave
          position={[2, -3, 0]}
          rotation={-10}
          lineCount={6}
          lineDistance={0.7}
          colors={colors}
          animationSpeed={animationSpeed}
          mousePos={mousePos}
          bendRadius={bendRadius}
          bendStrength={bendStrength}
        />
      )}
    </>
  );
};

interface FloatingLinesProps {
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  bendRadius?: number;
  bendStrength?: number;
  enabledWaves?: ('top' | 'middle' | 'bottom')[];
  opacity?: number;
}

const FloatingLines = ({
  className = '',
  colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'],
  animationSpeed = 0.8,
  bendRadius = 10,
  bendStrength = -5,
  enabledWaves = ['top', 'middle', 'bottom'],
  opacity = 0.4,
}: FloatingLinesProps) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ opacity, zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene
          colors={colors}
          animationSpeed={animationSpeed}
          bendRadius={bendRadius}
          bendStrength={bendStrength}
          enabledWaves={enabledWaves}
        />
      </Canvas>
    </div>
  );
};

export default FloatingLines;

import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// ─── Shared materials (created ONCE at module level, never recreated) ─
const rubber       = new THREE.MeshStandardMaterial({ color: '#242424', roughness: 0.88, metalness: 0.08 });
const treadDark    = new THREE.MeshStandardMaterial({ color: '#101010', roughness: 1 });
const glowRed      = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#cc0000', emissiveIntensity: 0.7 });
const chromeAlloy  = new THREE.MeshStandardMaterial({ color: '#d8d8d8', metalness: 0.95, roughness: 0.08 });
const gunmetal     = new THREE.MeshStandardMaterial({ color: '#2a2a2a', metalness: 0.9, roughness: 0.2 });
const bronze       = new THREE.MeshStandardMaterial({ color: '#c9903a', metalness: 0.85, roughness: 0.25 });
const silver       = new THREE.MeshStandardMaterial({ color: '#b0b0b0', metalness: 0.9, roughness: 0.2 });
const orangeAccent = new THREE.MeshStandardMaterial({ color: '#f97316', emissive: '#994400', emissiveIntensity: 0.4 });

// ─── Low-poly geometry helpers ────────────────────────────────────────
//  Increased segments for premium roundness without lagging
const SEG_TORUS_TUBE = 48;
const SEG_TORUS_RAD  = 128;
const SEG_CYL        = 64;
const SEG_CIRCLE     = 32;

// ─────────────────────────────────────────────────────────────────────
// HIGHWAY TYRE — chrome 5-spoke alloy, drilled rotor, red caliper
// ─────────────────────────────────────────────────────────────────────
function HighwayTyre() {
  return (
    <group>
      {/* Main rubber ring */}
      <mesh material={rubber}>
        <torusGeometry args={[1.1, 0.21, SEG_TORUS_TUBE, SEG_TORUS_RAD]} />
      </mesh>

      {/* 2 grooves (not 4) */}
      {[0.07, -0.07].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} material={treadDark}>
          <torusGeometry args={[1.12, 0.009, 8, SEG_TORUS_RAD]} />
        </mesh>
      ))}

      {/* Angled tread blocks — highly detailed V-pattern */}
      <Instances limit={120}>
        <boxGeometry args={[0.035, 0.065, 0.09]} />
        <meshStandardMaterial color="#191919" roughness={0.9} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          return <Instance key={`L${i}`} position={[Math.cos(a)*1.13, Math.sin(a)*1.13, 0.07]} rotation={[0, -0.42, a+Math.PI/2]} />;
        })}
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          return <Instance key={`R${i}`} position={[Math.cos(a)*1.13, Math.sin(a)*1.13, -0.07]} rotation={[0, 0.42, a+Math.PI/2]} />;
        })}
      </Instances>

      {/* Chrome barrel */}
      <mesh rotation={[Math.PI/2, 0, 0]} material={chromeAlloy}>
        <cylinderGeometry args={[0.89, 0.89, 0.32, SEG_CYL]} />
      </mesh>

      {/* 5 spokes */}
      <Instances limit={5}>
        <boxGeometry args={[0.08, 0.80, 0.07]} />
        <meshStandardMaterial color="#d8d8d8" metalness={0.95} roughness={0.06} />
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return <Instance key={i} position={[Math.cos(a)*0.41, Math.sin(a)*0.41, 0.05]} rotation={[0, 0, a]} />;
        })}
      </Instances>

      {/* Center hub + logo disc */}
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, SEG_CIRCLE]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <circleGeometry args={[0.09, SEG_CIRCLE]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Brake disc (simplified) */}
      <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, -0.15]} material={silver}>
        <cylinderGeometry args={[0.77, 0.77, 0.022, SEG_CYL]} />
      </mesh>

      {/* Red caliper */}
      <mesh position={[0.66, 0, -0.13]} material={glowRed}>
        <boxGeometry args={[0.17, 0.40, 0.1]} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ALL-TERRAIN — gunmetal 6-spoke, orange lug nuts, white sidewall
// ─────────────────────────────────────────────────────────────────────
function AllTerrainTyre() {
  return (
    <group>
      <mesh material={rubber}>
        <torusGeometry args={[1.08, 0.35, SEG_TORUS_TUBE, SEG_TORUS_RAD]} />
      </mesh>

      {/* Shoulder blocks — massive aggressive detail */}
      <Instances limit={240}>
        <boxGeometry args={[0.12, 0.09, 0.40]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
        {Array.from({ length: 120 }, (_, i) => {
          const a = (i / 120) * Math.PI * 2;
          return <Instance key={`L${i}`} position={[Math.cos(a)*1.14, Math.sin(a)*1.14, 0.14]} rotation={[0, 0.1, a+Math.PI/2]} />;
        })}
        {Array.from({ length: 120 }, (_, i) => {
          const a = (i / 120) * Math.PI * 2 + 0.026;
          return <Instance key={`R${i}`} position={[Math.cos(a)*1.14, Math.sin(a)*1.14, -0.14]} rotation={[0, -0.1, a+Math.PI/2]} />;
        })}
      </Instances>

      {/* Center zig-zag — dense pattern */}
      <Instances limit={120}>
        <boxGeometry args={[0.09, 0.09, 0.18]} />
        <meshStandardMaterial color="#141414" roughness={1} />
        {Array.from({ length: 120 }, (_, i) => {
          const a = (i / 120) * Math.PI * 2;
          const side = i % 2 === 0 ? 0.04 : -0.04;
          return <Instance key={i} position={[Math.cos(a)*1.15, Math.sin(a)*1.15, side]} rotation={[0, i%2===0?-0.35:0.35, a+Math.PI/2]} />;
        })}
      </Instances>

      {/* Water channels */}
      {[0.09, -0.09].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} material={treadDark}>
          <torusGeometry args={[1.12, 0.013, 8, SEG_TORUS_RAD]} />
        </mesh>
      ))}

      {/* White sidewall ring */}
      <mesh position={[0, 0, 0.33]}>
        <torusGeometry args={[0.97, 0.011, 8, SEG_TORUS_RAD]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.9} />
      </mesh>

      {/* Gunmetal rim barrel */}
      <mesh rotation={[Math.PI/2, 0, 0]} material={gunmetal}>
        <cylinderGeometry args={[0.74, 0.74, 0.40, SEG_CYL]} />
      </mesh>

      {/* 6 spokes */}
      <Instances limit={6}>
        <boxGeometry args={[0.055, 0.68, 0.065]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.88} roughness={0.25} />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return <Instance key={i} position={[Math.cos(a)*0.34, Math.sin(a)*0.34, 0.05]} rotation={[0, 0, a]} />;
        })}
      </Instances>

      {/* Orange lug nuts */}
      <Instances limit={6}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 8]} />
        <meshStandardMaterial color="#f97316" />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return <Instance key={i} position={[Math.cos(a)*0.53, Math.sin(a)*0.53, 0.07]} rotation={[Math.PI/2, 0, 0]} />;
        })}
      </Instances>

      {/* Red accent ring */}
      <mesh>
        <torusGeometry args={[0.75, 0.018, 12, SEG_TORUS_RAD]} />
        <meshStandardMaterial color="#ef4444" emissive="#aa0000" emissiveIntensity={0.5} />
      </mesh>

      {/* Hub */}
      <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.2, 0.2, 0.055, SEG_CIRCLE]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <circleGeometry args={[0.1, SEG_CIRCLE]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MUD-TERRAIN — bronze beadlock, orange glow voids, massive lugs
// ─────────────────────────────────────────────────────────────────────
function MudTerrainTyre() {
  return (
    <group>
      <mesh material={rubber}>
        <torusGeometry args={[1.0, 0.47, SEG_TORUS_TUBE, SEG_TORUS_RAD]} />
      </mesh>

      {/* Outer lugs — huge overlapping grip */}
      <Instances limit={160}>
        <boxGeometry args={[0.18, 0.17, 0.40]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
        {Array.from({ length: 80 }, (_, i) => {
          const a = (i / 80) * Math.PI * 2;
          return <Instance key={`L${i}`} position={[Math.cos(a)*1.1, Math.sin(a)*1.1, 0.24]} rotation={[0.35, 0, a+Math.PI/2]} />;
        })}
        {Array.from({ length: 80 }, (_, i) => {
          const a = (i / 80) * Math.PI * 2 + 0.039;
          return <Instance key={`R${i}`} position={[Math.cos(a)*1.1, Math.sin(a)*1.1, -0.24]} rotation={[-0.35, 0, a+Math.PI/2]} />;
        })}
      </Instances>

      {/* Inner mud hooks */}
      <Instances limit={80}>
        <boxGeometry args={[0.16, 0.16, 0.20]} />
        <meshStandardMaterial color="#141414" roughness={1} />
        {Array.from({ length: 80 }, (_, i) => {
          const a = (i / 80) * Math.PI * 2;
          const side = i % 2 === 0 ? 0.05 : -0.05;
          return <Instance key={i} position={[Math.cos(a)*1.13, Math.sin(a)*1.13, side]} rotation={[i%2===0?0.2:-0.2, i%2===0?0.2:-0.2, a+Math.PI/2]} />;
        })}
      </Instances>

      {/* Orange mud-glow emissive ring in void */}
      <mesh material={orangeAccent}>
        <torusGeometry args={[1.04, 0.022, 8, SEG_TORUS_RAD]} />
      </mesh>

      {/* Steel barrel */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.46, SEG_CYL]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.7} roughness={0.65} />
      </mesh>

      {/* Bronze beadlock ring */}
      <mesh material={bronze}>
        <torusGeometry args={[0.60, 0.052, 16, SEG_TORUS_RAD]} />
      </mesh>

      {/* Beadlock bolts — fully detailed 24 bolts */}
      <Instances limit={24}>
        <cylinderGeometry args={[0.02, 0.02, 0.045, 12]} />
        <meshStandardMaterial color="#999" metalness={0.9} roughness={0.25} />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <Instance key={i} position={[Math.cos(a)*0.60, Math.sin(a)*0.60, 0.07]} rotation={[Math.PI/2, 0, 0]} />;
        })}
      </Instances>

      {/* 6-spoke flat face */}
      <Instances limit={6}>
        <boxGeometry args={[0.07, 0.46, 0.04]} />
        <meshStandardMaterial color="#181818" metalness={0.7} roughness={0.5} />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return <Instance key={i} position={[Math.cos(a)*0.28, Math.sin(a)*0.28, 0.04]} rotation={[0, 0, a]} />;
        })}
      </Instances>

      {/* Bronze hub */}
      <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.045]} material={bronze}>
        <cylinderGeometry args={[0.24, 0.24, 0.06, SEG_CIRCLE]} />
      </mesh>
      <mesh position={[0, 0, 0.076]}>
        <circleGeometry args={[0.14, SEG_CIRCLE]} />
        <meshBasicMaterial color="#c9903a" />
      </mesh>
    </group>
  );
}

// ─── Smooth lerp rotation — no Float wrapper overhead ─────────────────
function TyreModel({ hovered, treadType }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * (hovered ? 0.9 : 0.22);
    groupRef.current.position.y = Math.sin(Date.now() * 0.0007) * 0.05;
  });

  return (
    <group ref={groupRef} rotation={[0.22, -0.75, 0]}>
      {treadType === 'highway' ? <HighwayTyre />
        : treadType === 'mud' ? <MudTerrainTyre />
        : <AllTerrainTyre />}
    </group>
  );
}

// ─── Minimal scene — no expensive ContactShadows on hero ─────────────
function TyreScene({ hovered, treadType, showShadow }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 5, 5]} intensity={3.0} color="#ffffff" />
      <directionalLight position={[-4, -2, -4]} intensity={1.5} color="#ef4444" />
      <spotLight position={[0, 5, -4]} angle={0.7} penumbra={0.6} intensity={5} color="#ffffff" />
      <Environment preset="studio" />
      <TyreModel hovered={hovered} treadType={treadType} />
      {/* Only render shadow on the interactive showcase, not the hero */}
      {showShadow && (
        <ContactShadows position={[0, -1.65, 0]} opacity={0.4} scale={6} blur={3} frames={1} />
      )}
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────
export default function Tyre3D({ hovered = false, className = '', treadType = 'all_terrain', showShadow = false }) {
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: 420 }}>
      <Canvas
        camera={{ position: [0, 0, 2.7], fov: 45 }}
        dpr={1}
        frameloop="always"
        performance={{ min: 0.5 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <TyreScene hovered={hovered} treadType={treadType} showShadow={showShadow} />
        </Suspense>
      </Canvas>
    </div>
  );
}

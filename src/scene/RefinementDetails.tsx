import { Curve, Cushion } from "./DesignPrimitives";
import { Block } from "./Block";
import type { Vec3 } from "../types/studio";
/** Original lightweight fittings. Dimensions are conceptual, not product specifications. */
export function ZonePendant({ dimensions: [w, h, d] }: { dimensions: Vec3 }) {
  const oval: Vec3[] = Array.from({ length: 49 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    return [Math.cos(a) * (w / 2 - 0.025), 0.04, Math.sin(a) * (d / 2 - 0.025)];
  });
  return (
    <>
      <Curve points={oval} radius={0.023} />
      <Curve
        points={oval.map(([x, y, z]) => [x, y - 0.022, z])}
        radius={0.012}
        glow
      />
      {[-1, 1].map((n) => (
        <Block
          key={n}
          size={[0.008, h - 0.04, 0.008]}
          position={[0, h / 2, n * d * 0.27]}
          color="#a78e6c"
        />
      ))}
      <Block
        size={[0.12, 0.03, d * 0.6]}
        position={[0, h - 0.015, 0]}
        color="#b79b70"
      />
      <pointLight
        position={[0, 0.02, 0]}
        color="#ffe6c5"
        intensity={6}
        distance={4}
        decay={2}
      />
    </>
  );
}
export function WorkStool() {
  return (
    <>
      <Cushion
        size={[0.46, 0.12, 0.46]}
        position={[0, 0.44, 0]}
        color="#c8b3a0"
      />
      <Block
        size={[0.045, 0.31, 0.045]}
        position={[0, 0.24, 0]}
        color="#b79b70"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <Block
            size={[0.035, 0.035, 0.23]}
            position={[0, 0.065, 0.105]}
            color="#b79b70"
          />
          <mesh position={[0, 0.035, 0.2]}>
            <sphereGeometry args={[0.035, 10, 8]} />
            <meshStandardMaterial color="#76645b" />
          </mesh>
        </group>
      ))}
    </>
  );
}
export function WallSconce() {
  return (
    <>
      <Block
        size={[0.08, 0.42, 0.035]}
        position={[0, 0.21, -0.06]}
        color="#b79b70"
      />
      <mesh position={[0, 0.21, 0.02]}>
        <capsuleGeometry args={[0.055, 0.24, 4, 12]} />
        <meshStandardMaterial
          color="#fff1d9"
          emissive="#ffdcaa"
          emissiveIntensity={0.65}
        />
      </mesh>
      <pointLight
        position={[0, 0.25, 0.12]}
        color="#ffe4bb"
        intensity={1.2}
        distance={1.4}
        decay={2}
      />
    </>
  );
}

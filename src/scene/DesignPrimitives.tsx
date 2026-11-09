import { useSurfaceGrain } from "./SurfaceMaterials";
import { useMemo } from "react";
import { CatmullRomCurve3, Vector2, Vector3, Shape } from "three";
import type { Vec3 } from "../types/studio";

export const finishes = {
  champagne: "#ad926a",
  ivory: "#eee5d7",
  stone: "#cdbda6",
  glow: "#ffe0a5",
};

/** Tubos y formas propios: no se incorporan imágenes ni modelos de referencia. */
export function Curve({
  points,
  radius = 0.015,
  glow = false,
  color = finishes.champagne,
}: {
  points: Vec3[];
  radius?: number;
  glow?: boolean;
  color?: string;
}) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
    [points],
  );
  return (
    <mesh castShadow={!glow}>
      <tubeGeometry args={[curve, 56, radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        metalness={glow ? 0 : 0.7}
        roughness={0.32}
        emissive={glow ? finishes.glow : "#000000"}
        emissiveIntensity={glow ? 0.8 : 0}
        toneMapped={!glow}
      />
    </mesh>
  );
}

export function Cushion({
  position,
  size,
  color,
}: {
  position: Vec3;
  size: Vec3;
  color: string;
}) {
  const grain = useSurfaceGrain();
  return (
    <mesh position={position} scale={size} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 40, 24]} />
      <meshStandardMaterial
        color={color}
        roughness={0.93}
        bumpMap={grain}
        bumpScale={0.009}
      />
    </mesh>
  );
}

export function TubChair({
  width,
  height,
  depth,
  color,
  elevated = false,
}: {
  width: number;
  height: number;
  depth: number;
  color: string;
  elevated?: boolean;
}) {
  const seat = elevated ? 0.59 : 0.46;
  return (
    <>
      <mesh position={[0, 0.035, 0]} castShadow>
        <cylinderGeometry args={[width * 0.35, width * 0.4, 0.06, 48]} />
        <meshStandardMaterial
          color={finishes.champagne}
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, seat / 2, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, seat - 0.06, 24]} />
        <meshStandardMaterial
          color={finishes.champagne}
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
      <Cushion
        size={[width, 0.23, depth * 0.84]}
        position={[0, seat, 0]}
        color={color}
      />
      <Cushion
        size={[width * 0.98, (height - seat) * 1.65, depth * 0.34]}
        position={[0, seat + (height - seat) * 0.36, -depth * 0.29]}
        color={color}
      />
      {[-1, 1].map((x) => (
        <Cushion
          key={x}
          size={[width * 0.2, 0.31, depth * 0.7]}
          position={[x * width * 0.42, seat + 0.12, -depth * 0.02]}
          color={color}
        />
      ))}
    </>
  );
}

export function RibbedPedestal({
  position,
  radius,
  height,
  color,
}: {
  position: Vec3;
  radius: number;
  height: number;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 64]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i * Math.PI) / 18;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height / 2,
              Math.sin(angle) * radius,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.012, 0.012, height - 0.06, 6]} />
            <meshStandardMaterial color={color} roughness={0.75} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.028, 0]}>
        <cylinderGeometry args={[radius + 0.009, radius + 0.009, 0.04, 64]} />
        <meshStandardMaterial
          color={finishes.champagne}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

export function Basin() {
  const profile = useMemo(
    () =>
      [
        [0.17, 0],
        [0.23, 0.025],
        [0.3, 0.19],
        [0.3, 0.22],
        [0.27, 0.22],
        [0.24, 0.08],
        [0, 0.06],
      ].map(([x, y]) => new Vector2(x, y)),
    [],
  );
  return (
    <mesh castShadow receiveShadow>
      <latheGeometry args={[profile, 64]} />
      <meshStandardMaterial color="#e7d8bf" roughness={0.48} />
    </mesh>
  );
}

export function ArchedPanel({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color: string;
}) {
  const shape = useMemo(() => {
    const s = new Shape();
    s.moveTo(-width / 2, 0);
    s.lineTo(width / 2, 0);
    s.lineTo(width / 2, height - width / 2);
    s.absarc(0, height - width / 2, width / 2, 0, Math.PI, false);
    s.lineTo(-width / 2, 0);
    return s;
  }, [width, height]);
  return (
    <mesh castShadow receiveShadow>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: 0.04,
            bevelEnabled: true,
            bevelSize: 0.025,
            bevelThickness: 0.015,
            bevelSegments: 3,
            steps: 1,
          },
        ]}
      />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}

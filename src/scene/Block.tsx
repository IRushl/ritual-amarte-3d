import { useSurfaceGrain } from "./SurfaceMaterials";
import { RoundedBox } from "@react-three/drei";
import type { Vec3 } from "../types/studio";
export function Block({
  size,
  position = [0, 0, 0],
  color,
  radius = 0.04,
}: {
  size: Vec3;
  position?: Vec3;
  color: string;
  radius?: number;
}) {
  const grain = useSurfaceGrain();
  return (
    <RoundedBox
      args={size}
      position={position}
      radius={Math.min(radius, ...size.map((v) => v / 3))}
      smoothness={4}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={color === "#927670" ? 0.42 : 0.68}
        bumpMap={grain}
        bumpScale={0.004}
      />
    </RoundedBox>
  );
}

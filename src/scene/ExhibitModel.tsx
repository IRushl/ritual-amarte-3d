import { ArchedPanel, Curve } from "./DesignPrimitives";
import { Block } from "./Block";
export function ExhibitModel({
  w,
  h,
  d,
  color,
}: {
  w: number;
  h: number;
  d: number;
  color: string;
}) {
  return (
    <>
      <ArchedPanel width={w} height={h} color={color} />
      {[0.18, 0.55, 0.92, 1.29].map((y, row) => (
        <group key={y}>
          <Block
            size={[w * 0.94, 0.035, d]}
            position={[0, y, d / 2]}
            color="#dfcfb6"
          />
          <Curve
            glow
            radius={0.007}
            points={[
              [-w * 0.42, y - 0.025, d * 0.6],
              [0, y - 0.025, d * 0.6],
              [w * 0.42, y - 0.025, d * 0.6],
            ]}
          />
          {Array.from({ length: 8 }, (_, i) => (
            <group
              key={i}
              position={[-w * 0.38 + (i * w * 0.76) / 7, y + 0.07, d * 0.5]}
            >
              <mesh castShadow>
                <boxGeometry args={[0.05, 0.1, 0.045]} />
                <meshStandardMaterial
                  color={
                    ["#b78d7e", "#dfc4b4", "#9d7267", "#c6b39e"][(i + row) % 4]
                  }
                />
              </mesh>
              <mesh position={[0, 0.075, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />
                <meshStandardMaterial color="#4c4540" />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </>
  );
}

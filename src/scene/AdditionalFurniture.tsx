import { AnimatedScreen } from "./AnimatedScreen";
import { ZonePendant, WorkStool, WallSconce } from "./RefinementDetails";
import { Curve, Basin, Cushion } from "./DesignPrimitives";
import { Block } from "./Block";
import type { Furniture } from "../types/studio";
export function AdditionalFurniture({
  item,
  paused = false,
}: {
  item: Furniture;
  paused?: boolean;
}) {
  const [w, h, d] = item.dimensiones,
    c = item.material.color;
  if (item.id.startsWith("taburete-pedicure-")) return <WorkStool />;
  if (item.id.startsWith("aplique-")) return <WallSconce />;
  if (item.categoria === "pantalla")
    return <AnimatedScreen item={item} paused={paused} />;
  if (item.categoria === "arte")
    return (
      <>
        <Block
          size={[w, h, d]}
          position={[0, h / 2, 0]}
          color="#b79b70"
          radius={0.01}
        />
        <mesh position={[0, h / 2, d / 2 + 0.001]}>
          <planeGeometry args={[w - 0.04, h - 0.04]} />
          <meshStandardMaterial color="#f0e6d9" roughness={0.9} />
        </mesh>
        <mesh
          position={[-w * 0.12, h * 0.59, d / 2 + 0.004]}
          scale={[0.8, 1.3, 1]}
        >
          <circleGeometry args={[w * 0.3, 48]} />
          <meshStandardMaterial color="#d7b7ba" />
        </mesh>
        <mesh position={[w * 0.12, h * 0.37, d / 2 + 0.007]}>
          <circleGeometry args={[w * 0.22, 48]} />
          <meshStandardMaterial color="#baa18c" />
        </mesh>
        <Curve
          color="#9e805a"
          radius={0.006}
          points={[
            [-w * 0.3, h * 0.2, d / 2 + 0.015],
            [0, h * 0.65, d / 2 + 0.015],
            [w * 0.25, h * 0.8, d / 2 + 0.015],
          ]}
        />
      </>
    );
  if (item.categoria === "espejo")
    return (
      <>
        <Block
          size={[w, h, d]}
          position={[0, h / 2, 0]}
          color="#b79b70"
          radius={0.025}
        />
        <mesh position={[0, h / 2, d / 2 + 0.002]}>
          <planeGeometry args={[w - 0.05, h - 0.05]} />
          <meshStandardMaterial
            color="#cbd8d8"
            metalness={0.3}
            roughness={0.25}
          />
        </mesh>
      </>
    );
  if (item.categoria === "maquillaje")
    return (
      <>
        <Block size={[w, 0.08, d]} position={[0, 0.82, 0]} color="#e7d9c6" />
        {[-1, 1].map((n) => (
          <Block
            key={n}
            size={[0.24, 0.78, d * 0.9]}
            position={[n * (w / 2 - 0.12), 0.39, 0]}
            color={c}
          />
        ))}
        <Block
          size={[w * 0.78, h - 0.95, 0.07]}
          position={[0, (h + 0.95) / 2, -d / 2 + 0.04]}
          color="#b79b70"
          radius={0.03}
        />
        <mesh position={[0, (h + 0.95) / 2, -d / 2 + 0.078]}>
          <planeGeometry args={[w * 0.72, h - 1.02]} />
          <meshStandardMaterial
            color="#c3d1d0"
            metalness={0.3}
            roughness={0.25}
          />
        </mesh>
        {[-1, 1].map((n) => (
          <Block
            key={n}
            size={[0.028, h - 1.02, 0.025]}
            position={[n * w * 0.4, (h + 0.95) / 2, -d / 2 + 0.09]}
            color="#fff0ca"
          />
        ))}
        <Block
          size={[0.23, 0.12, 0.15]}
          position={[w * 0.27, 0.92, 0]}
          color="#ac8878"
        />
      </>
    );
  if (item.espacioId === "espera" && item.categoria === "asiento")
    return (
      <>
        <Block
          size={[w * 0.92, 0.15, d * 0.85]}
          position={[0, 0.09, 0]}
          color="#b79b70"
          radius={0.06}
        />
        <Cushion size={[w, 0.34, d]} position={[0, 0.34, 0]} color={c} />
        <Cushion
          size={[w, h * 0.65, d * 0.28]}
          position={[0, h * 0.67, d * 0.35]}
          color={c}
        />
        {[-1, 1].map((n) => (
          <Cushion
            key={n}
            size={[w * 0.13, 0.43, d * 0.9]}
            position={[n * w * 0.43, 0.52, 0]}
            color={c}
          />
        ))}
        {[-1, 1].map((n) => (
          <Cushion
            key={n}
            size={[0.36, 0.32, 0.14]}
            position={[n * w * 0.27, 0.65, d * 0.15]}
            color="#cbb69d"
          />
        ))}
      </>
    );
  if (item.espacioId === "maquillaje" && item.categoria === "asiento")
    return (
      <>
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <Block
              key={x + "," + z}
              size={[0.035, 0.66, 0.035]}
              position={[x * w * 0.38, 0.33, z * d * 0.35]}
              color="#b79b70"
            />
          )),
        )}
        <Cushion size={[w, 0.14, d]} position={[0, 0.68, 0]} color={c} />
        <Cushion
          size={[w, 0.35, 0.12]}
          position={[0, 0.88, d * 0.4]}
          color={c}
        />
        <Block
          size={[w * 0.8, 0.025, 0.025]}
          position={[0, 0.3, -d * 0.35]}
          color="#b79b70"
        />
      </>
    );
  if (item.categoria === "sanitario")
    return (
      <>
        <mesh
          position={[0, h * 0.25, d * 0.05]}
          scale={[w, h * 0.5, d * 0.75]}
          castShadow
        >
          <sphereGeometry args={[0.5, 32, 20]} />
          <meshStandardMaterial color={c} roughness={0.25} />
        </mesh>
        <Block
          size={[w * 0.85, h * 0.7, d * 0.25]}
          position={[0, h * 0.65, -d * 0.35]}
          color={c}
        />
        <mesh
          position={[0, h * 0.5, d * 0.15]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1, d / w, 1]}
        >
          <torusGeometry args={[w * 0.31, w * 0.065, 12, 48]} />
          <meshStandardMaterial color={c} />
        </mesh>
      </>
    );
  if (item.categoria === "lavabo")
    return (
      <>
        <Block
          size={[w * 0.85, h * 0.72, d * 0.8]}
          position={[0, h * 0.36, 0]}
          color="#d7c5a7"
        />
        <group position={[0, h * 0.72, 0]}>
          <Basin />
        </group>
        <Curve
          points={[
            [w * 0.35, h * 0.7, -d * 0.2],
            [w * 0.35, h, -d * 0.2],
            [w * 0.12, h, -d * 0.1],
          ]}
          radius={0.015}
        />
      </>
    );
  if (item.categoria === "auxiliar")
    return (
      <>
        <Block
          size={[w, 0.07, d]}
          position={[0, h - 0.035, 0]}
          color={c}
          radius={0.03}
        />
        <mesh position={[0, (h - 0.07) / 2, 0]} castShadow>
          <cylinderGeometry
            args={[Math.min(w, d) * 0.24, Math.min(w, d) * 0.32, h - 0.07, 40]}
          />
          <meshStandardMaterial color="#cbb38e" />
        </mesh>
      </>
    );
  if (item.categoria === "decoracion")
    return (
      <>
        <mesh position={[0, h * 0.16, 0]} castShadow>
          <cylinderGeometry args={[w * 0.32, w * 0.26, h * 0.32, 32]} />
          <meshStandardMaterial color="#cabb9f" />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 2.4) * w * 0.2,
              h * (0.45 + (i % 4) * 0.12),
              Math.cos(i * 2.4) * d * 0.2,
            ]}
            scale={[w * 0.42, h * 0.32, d * 0.14]}
            rotation={[0.3, i, 0.3 * Math.sin(i)]}
            castShadow
          >
            <sphereGeometry args={[0.5, 14, 12]} />
            <meshStandardMaterial
              color={i % 2 ? "#8b997c" : "#6e8164"}
              roughness={0.9}
            />
          </mesh>
        ))}
      </>
    );
  if (item.categoria === "iluminacion")
    return <ZonePendant dimensions={item.dimensiones} />;
  return null;
}

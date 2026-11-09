import type { Architecture } from "../types/studio";
import { Curve } from "./DesignPrimitives";

/** Revestimiento decorativo del maestro. No duplica muebles o huecos. */
export function ArchitecturalDetails({
  model,
  ceiling,
}: {
  model: Architecture;
  ceiling: boolean;
}) {
  return (
    <group>
      {ceiling && (
        <Curve
          glow
          points={Array.from({ length: 65 }, (_, i) => {
            const angle = (i * Math.PI) / 32,
              c = Math.cos(angle),
              sn = Math.sin(angle);
            return [
              (model.local.ancho / 2 - 0.35) *
                Math.sign(c) *
                Math.abs(c) ** 0.28,
              model.local.alto - 0.12,
              (model.local.fondo / 2 - 0.35) *
                Math.sign(sn) *
                Math.abs(sn) ** 0.28,
            ] as [number, number, number];
          })}
          radius={0.018}
        />
      )}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={i}
          position={[
            -model.local.ancho / 2 + ((i + 1) * model.local.ancho) / 8,
            0.004,
            0,
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.008, model.local.fondo]} />
          <meshStandardMaterial color="#d1c5b2" />
        </mesh>
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          position={[
            0,
            0.004,
            -model.local.fondo / 2 + ((i + 1) * model.local.fondo) / 6,
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[model.local.ancho, 0.008]} />
          <meshStandardMaterial color="#d1c5b2" />
        </mesh>
      ))}
    </group>
  );
}

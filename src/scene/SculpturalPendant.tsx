import { useMemo, useEffect } from "react";
import { Shape, Path, ExtrudeGeometry } from "three";
import { Block } from "./Block";
import { Curve } from "./DesignPrimitives";
function Band({ diffuser = false }: { diffuser?: boolean }) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.absellipse(0, 0, 0.92, 0.43, 0, Math.PI * 2, false, 0);
    const hole = new Path();
    hole.absellipse(0, 0, 0.8, 0.31, 0, Math.PI * 2, true, 0);
    shape.holes.push(hole);
    return new ExtrudeGeometry(shape, {
      depth: diffuser ? 0.015 : 0.065,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.006,
      curveSegments: 48,
    });
  }, [diffuser]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      geometry={geometry}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow={!diffuser}
    >
      <meshStandardMaterial
        color={diffuser ? "#faf7f2" : "#b7a17d"}
        metalness={diffuser ? 0 : 0.65}
        roughness={diffuser ? 0.5 : 0.38}
        emissive={diffuser ? "#ffe2b6" : "#000000"}
        emissiveIntensity={diffuser ? 0.65 : 0}
      />
    </mesh>
  );
}
export function SculpturalPendant() {
  return (
    <>
      <Block
        size={[0.55, 0.05, 0.22]}
        position={[0, 0.72, 0]}
        color="#b7a17d"
      />
      {[0, 1].map((i) => (
        <group
          key={i}
          position={[i ? 0.12 : -0.12, i ? 0.25 : 0.14, 0]}
          rotation={[i ? 0.2 : -0.17, i ? 0.48 : -0.35, i ? 0.12 : -0.12]}
        >
          <Band />
          <group position={[0, -0.075, 0]}>
            <Band diffuser />
          </group>
        </group>
      ))}
      {[-1, 0, 1].map((n) => (
        <Curve
          key={n}
          radius={0.004}
          color="#927670"
          points={[
            [n * 0.22, 0.7, 0],
            [n * 0.55, 0.4, n * 0.12],
            [n * 0.6, 0.22, n * 0.13],
          ]}
        />
      ))}
      <pointLight
        position={[0, -0.08, 0]}
        intensity={1.5}
        distance={5}
        decay={2}
        color="#ffe6c6"
      />
    </>
  );
}

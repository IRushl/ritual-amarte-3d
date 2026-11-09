import { useLayoutEffect, useRef, useMemo, useEffect } from "react";
import {
  InstancedMesh,
  Object3D,
  BufferGeometry,
  Float32BufferAttribute,
  DoubleSide,
} from "three";
import type { Architecture, Vec3 } from "../types/studio";
import { openingFrame } from "../architecture/geometry";
import { Block } from "./Block";
import { FacadeBrand } from "./FacadeBrand";
import { useSurfaceGrain } from "./SurfaceMaterials";
function Planter({
  position,
  dimensions: [w, h, d],
}: {
  position: Vec3;
  dimensions: Vec3;
}) {
  const leaves = useRef<InstancedMesh>(null);
  const leaf = useMemo(() => {
    const geometry = new BufferGeometry(),
      positions: number[] = [],
      indices: number[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16,
        width = 0.17 * Math.pow(Math.sin(Math.PI * t), 0.8);
      positions.push(
        -width,
        t,
        0.12 * Math.sin(Math.PI * t),
        width,
        t,
        0.12 * Math.sin(Math.PI * t),
      );
      if (i < 16) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => leaf.dispose(), [leaf]);
  useLayoutEffect(() => {
    const node = new Object3D();
    for (let i = 0; i < 14; i++) {
      const angle = i * 2.4,
        level = i % 4;
      node.position.set(
        Math.cos(angle) * w * 0.08,
        h * (0.36 + level * 0.1),
        Math.sin(angle) * d * 0.08,
      );
      node.rotation.set(0.23, angle, (i % 2 ? 1 : -1) * 0.28);
      node.scale.set(w * 1.4, h * 0.34, d);
      node.updateMatrix();
      leaves.current!.setMatrixAt(i, node.matrix);
    }
    leaves.current!.instanceMatrix.needsUpdate = true;
  }, [w, h, d, leaf]);
  return (
    <group position={position}>
      <mesh position={[0, h * 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w * 0.47, w * 0.34, h * 0.36, 32]} />
        <meshStandardMaterial color="#d9cdbb" roughness={0.72} />
      </mesh>
      <mesh position={[0, h * 0.36, 0]}>
        <cylinderGeometry args={[w * 0.42, w * 0.42, 0.025, 24]} />
        <meshStandardMaterial color="#5b4e38" roughness={1} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[(i - 1) * 0.065, h * 0.6, 0]}
          rotation={[0.06 * i, 0, (i - 1) * 0.12]}
        >
          <cylinderGeometry args={[0.01, 0.015, h * 0.7, 8]} />
          <meshStandardMaterial color="#66734c" />
        </mesh>
      ))}
      <instancedMesh ref={leaves} args={[leaf, undefined, 14]} castShadow>
        <meshStandardMaterial
          color="#617c48"
          roughness={0.62}
          side={DoubleSide}
        />
      </instancedMesh>
    </group>
  );
}
/** One facade attached to the master wall. No substitute interior or photo backdrop. */
export function Facade({
  model,
  visible,
  signage,
  onSelect,
}: {
  model: Architecture;
  visible: boolean;
  signage: boolean;
  onSelect: (id: string) => void;
}) {
  const wall = model.muros.find((w) => w.id === model.fachada.muroId)!;
  const { ancho: w, fondo: d } = model.local,
    facade = model.fachada;
  const h = facade.alturaTotal ?? model.local.alto,
    base = h - facade.altoFriso;
  const z = d / 2 + wall.espesor + facade.profundidad / 2;
  const grain = useSurfaceGrain();
  const paving = facade.pavimento!;
  return (
    <group visible={visible}>
      <mesh
        position={[0, base + facade.altoFriso / 2, z]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect(wall.id);
        }}
      >
        <boxGeometry args={[w + 0.3, facade.altoFriso, facade.profundidad]} />
        <meshStandardMaterial
          color="#e6d9c7"
          roughness={0.78}
          bumpMap={grain}
          bumpScale={0.012}
        />
      </mesh>
      {[base + 0.025, h - 0.025].map((y) => (
        <Block
          key={y}
          size={[w + 0.34, 0.035, facade.profundidad + 0.035]}
          position={[0, y, z]}
          color="#b79b71"
          radius={0.008}
        />
      ))}
      <mesh
        position={[0, base - 0.018, z + 0.055]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[w, 0.055]} />
        <meshBasicMaterial color="#ffe0ae" toneMapped={false} />
      </mesh>
      {signage && (
        <group
          position={[
            0,
            base + facade.altoFriso / 2,
            z + facade.profundidad / 2 + 0.005,
          ]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect("s-fachada");
          }}
        >
          <FacadeBrand />
        </group>
      )}
      {[-1, 1].map((n) => (
        <group key={n}>
          <mesh
            position={[n * (w / 2 - 0.12), base / 2, z - 0.015]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.48, base, 0.16]} />
            <meshStandardMaterial
              color="#ddcfba"
              roughness={0.8}
              bumpMap={grain}
              bumpScale={0.012}
            />
          </mesh>
          <Block
            size={[0.09, 0.28, 0.12]}
            position={[n * (w / 2 - 0.12), 1.98, z + 0.11]}
            color="#685846"
            radius={0.015}
          />
          <pointLight
            position={[n * (w / 2 - 0.12), 2.03, z + 0.25]}
            color="#ffd9a0"
            intensity={1.5}
            distance={2}
            decay={2}
          />
          {[-1, 1].map((t) => (
            <mesh
              key={t}
              position={[n * (w / 2 - 0.12), 1.98 + t * 0.146, z + 0.11]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.043, 16]} />
              <meshBasicMaterial color="#ffe3ac" toneMapped={false} side={2} />
            </mesh>
          ))}
        </group>
      ))}
      {model.huecos
        .filter((o) => o.muroId === wall.id)
        .map((o) => {
          const frame = openingFrame(wall, o);
          return (
            <group
              key={o.id}
              position={[frame.start[0], o.antepecho, frame.start[1]]}
              rotation={[0, frame.yaw, 0]}
            >
              {[0, o.ancho].map((x) => (
                <Block
                  key={x}
                  size={[0.045, o.alto, 0.065]}
                  position={[x, o.alto / 2, 0.03]}
                  color="#77614a"
                  radius={0.006}
                />
              ))}
              {[0, o.alto].map((y) => (
                <Block
                  key={y}
                  size={[o.ancho + 0.045, 0.045, 0.065]}
                  position={[o.ancho / 2, y, 0.03]}
                  color="#77614a"
                  radius={0.006}
                />
              ))}
              {o.tipo === "ventana" &&
                [1 / 3, 2 / 3].map((r) => (
                  <Block
                    key={r}
                    size={[0.025, o.alto, 0.045]}
                    position={[o.ancho * r, o.alto / 2, 0.03]}
                    color="#8d7759"
                    radius={0.004}
                  />
                ))}
            </group>
          );
        })}
      <mesh
        position={[0, -paving.espesor / 2, d / 2 + paving.profundidad / 2]}
        receiveShadow
      >
        <boxGeometry args={[w + 0.5, paving.espesor, paving.profundidad]} />
        <meshStandardMaterial
          color={paving.color}
          roughness={0.8}
          bumpMap={grain}
          bumpScale={0.018}
        />
      </mesh>
      {Array.from({ length: Math.ceil(w / 0.65) }, (_, i) => (
        <Block
          key={i}
          size={[0.008, 0.002, paving.profundidad]}
          position={[-w / 2 + i * 0.65, 0.001, d / 2 + paving.profundidad / 2]}
          color="#928a7c"
          radius={0}
        />
      ))}
      {[0.6, 1.2].map((offset) => (
        <Block
          key={offset}
          size={[w + 0.5, 0.002, 0.008]}
          position={[0, 0.001, d / 2 + offset]}
          color="#928a7c"
          radius={0}
        />
      ))}
      {facade.maceteros?.map((p) => (
        <Planter key={p.id} position={p.posicion} dimensions={p.dimensiones} />
      ))}
      <pointLight
        position={[0, base + 0.1, z + 0.4]}
        intensity={4}
        color="#ffe0ad"
        distance={8}
        decay={2}
      />
    </group>
  );
}


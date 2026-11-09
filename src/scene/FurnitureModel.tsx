import { useState } from "react";
import { FitArtwork } from "./FitArtwork";
import { ExhibitModel } from "./ExhibitModel";
import { AdditionalFurniture } from "./AdditionalFurniture";
import { InteriorBrand } from "./InteriorBrand";
import { RoundedBox, useCursor } from "@react-three/drei";
import type { Furniture } from "../types/studio";
import {
  Basin,
  Curve,
  Cushion,
  finishes,
  RibbedPedestal,
  TubChair,
} from "./DesignPrimitives";

import { Block } from "./Block";
export { Block } from "./Block";

function ManicureTable({
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
      <RoundedBox
        args={[w, 0.09, d]}
        position={[0, h - 0.045, 0]}
        radius={0.044}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={0.28} />
      </RoundedBox>
      <RibbedPedestal
        position={[-w * 0.32, 0, 0]}
        radius={0.23}
        height={h - 0.09}
        color="#d1bea2"
      />
      <Curve
        points={[
          [w * 0.36, 0.04, -d * 0.3],
          [w * 0.36, h - 0.15, -d * 0.3],
          [w * 0.36, h - 0.09, 0],
          [w * 0.36, h - 0.15, d * 0.3],
          [w * 0.36, 0.04, d * 0.3],
        ]}
        radius={0.018}
      />
      <Cushion
        size={[0.46, 0.09, 0.23]}
        position={[0, h + 0.045, 0.04]}
        color="#cebaa6"
      />
      <Block
        size={[0.28, 0.12, 0.2]}
        position={[0.49, h + 0.06, -0.1]}
        color="#eee8df"
        radius={0.055}
      />
      <Curve
        points={[
          [-0.6, h, -0.22],
          [-0.6, h + 0.3, -0.22],
          [-0.42, h + 0.44, -0.18],
          [-0.15, h + 0.38, -0.16],
        ]}
        radius={0.012}
      />
      <mesh position={[-0.15, h + 0.37, -0.16]} rotation={[0, 0, -0.25]}>
        <coneGeometry args={[0.07, 0.09, 32, 1, true]} />
        <meshStandardMaterial
          color={finishes.champagne}
          metalness={0.7}
          roughness={0.3}
          side={2}
        />
      </mesh>
    </>
  );
}

export function FurnitureModel({
  item,
  selected,
  onSelect,
  brandName,
  paused,
}: {
  item: Furniture;
  selected: boolean;
  onSelect: (id: string) => void;
  brandName?: string;
  paused?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const [w, fullHeight, d] = item.dimensiones;
  const h =
    item.categoria === "recepcion"
      ? fullHeight * 0.74
      : item.categoria === "mesa"
        ? fullHeight * 0.64
        : fullHeight;
  const color = item.material.color;
  return (
    <group
      position={item.posicion}
      rotation={item.rotacion}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <FitArtwork dimensions={item.dimensiones}>
        {item.id.startsWith("taburete-pedicure-") ||
        [
          "pantalla",
          "arte",
          "espejo",
          "maquillaje",
          "sanitario",
          "lavabo",
          "auxiliar",
          "iluminacion",
          "decoracion",
        ].includes(item.categoria) ||
        ((item.espacioId === "espera" || item.espacioId === "maquillaje") &&
          item.categoria === "asiento") ? (
          <AdditionalFurniture item={item} paused={paused} />
        ) : item.categoria === "asiento" ? (
          <group rotation={[0, Math.PI, 0]}>
            <TubChair width={w} height={h} depth={d} color={color} />
          </group>
        ) : item.categoria === "exhibicion" ? (
          <ExhibitModel w={w} h={h} d={d} color={color} />
        ) : item.categoria === "asepsia" ? (
          <>
            <Block
              size={[w, h * 0.78, d]}
              position={[0, h * 0.39, 0]}
              color={color}
            />
            <group position={[0, h * 0.78, 0]}>
              <Basin />
            </group>
          </>
        ) : item.categoria === "mesa" ? (
          <ManicureTable w={w} h={h} d={d} color={color} />
        ) : item.categoria === "pedicure" ? (
          <>
            <RoundedBox
              args={[w + 0.18, 0.16, d + 0.18]}
              position={[0, 0.08, 0.08]}
              radius={0.07}
              smoothness={5}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#d1bfa4" roughness={0.6} />
            </RoundedBox>
            <Curve
              glow
              points={[
                [-w / 2, 0.04, d / 2 + 0.16],
                [0, 0.04, d / 2 + 0.16],
                [w / 2, 0.04, d / 2 + 0.16],
              ]}
              radius={0.012}
            />
            <group position={[0, 0, -0.2]}>
              <TubChair
                width={w}
                height={h}
                depth={d * 0.58}
                color={color}
                elevated
              />
            </group>
            <group position={[0, 0.17, 0.61]}>
              <Basin />
            </group>
            <Curve
              points={[
                [0.4, 0.16, 0.62],
                [0.4, 0.55, 0.62],
                [0.33, 0.6, 0.62],
                [0.24, 0.55, 0.62],
              ]}
              radius={0.017}
            />
            <Cushion
              size={[0.38, 0.08, 0.13]}
              position={[0, 0.42, 0.32]}
              color="#bba287"
            />
          </>
        ) : item.categoria === "recepcion" ? (
          <>
            <RoundedBox
              args={[w, h, d]}
              position={[0, h / 2, 0]}
              radius={0.19}
              smoothness={8}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={color} roughness={0.55} />
            </RoundedBox>
            <RoundedBox
              args={[w + 0.04, 0.065, d + 0.04]}
              position={[0, h, 0]}
              radius={0.032}
              smoothness={6}
              castShadow
            >
              <meshStandardMaterial color="#efe6d7" roughness={0.27} />
            </RoundedBox>
            {brandName && (
              <group position={[0, h * 0.57, d / 2 + 0.017]}>
                <InteriorBrand width={w * 0.76} />
              </group>
            )}
            {Array.from({ length: 27 }, (_, i) => (
              <Block
                key={i}
                size={[0.012, h - 0.22, 0.015]}
                position={[
                  -w / 2 + 0.19 + (i * (w - 0.38)) / 26,
                  h / 2,
                  d / 2 + 0.003,
                ]}
                color="#c3ad8b"
                radius={0.005}
              />
            ))}
            <Curve
              glow
              points={[
                [-w / 2 + 0.2, 0.09, d / 2 + 0.01],
                [0, 0.09, d / 2 + 0.01],
                [w / 2 - 0.2, 0.09, d / 2 + 0.01],
              ]}
              radius={0.01}
            />
            <Block
              size={[0.26, 0.018, 0.18]}
              position={[0.35, h + 0.025, 0]}
              color="#b6a48b"
            />
            <Block
              size={[0.035, 0.14, 0.035]}
              position={[0.35, h + 0.09, -0.035]}
              color="#b6a48b"
            />
            <Block
              size={[0.38, 0.25, 0.025]}
              position={[0.35, h + 0.25, -0.05]}
              color="#887c6a"
            />
            <mesh position={[-0.5, h + 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.09, 0.23, 32]} />
              <meshStandardMaterial
                color={finishes.champagne}
                metalness={0.65}
                roughness={0.3}
              />
            </mesh>
            {[-0.04, 0.03, 0.07].map((x, i) => (
              <Curve
                key={i}
                points={[
                  [-0.5, h + 0.2, 0],
                  [-0.5 + x, h + 0.4, 0.03],
                  [-0.5 + x * 2, h + 0.45 + i * 0.03, 0.02],
                ]}
                radius={0.007}
                color="#9d9b7a"
              />
            ))}
          </>
        ) : (
          <>
            <Block
              size={[w, h, d]}
              position={[0, h / 2, 0]}
              color={color}
              radius={0.06}
            />
            <Block
              size={[w + 0.03, 0.045, d + 0.03]}
              position={[0, h, 0]}
              color="#e8dcc8"
            />
            {[-1, 1].map((n) => (
              <group key={n}>
                <Block
                  size={[w * 0.48, h * 0.86, 0.025]}
                  position={[n * w * 0.245, h * 0.49, d / 2 + 0.006]}
                  color={color}
                  radius={0.012}
                />
                <Block
                  size={[0.018, 0.15, 0.025]}
                  position={[n * 0.035, h * 0.55, d / 2 + 0.03]}
                  color="#927670"
                  radius={0.005}
                />
              </group>
            ))}
            <Block
              size={[w * 0.9, 0.07, d * 0.9]}
              position={[0, 0.035, 0]}
              color="#493b3c"
            />
            {[0.3, 0.65, 0.97].map((y) => (
              <Block
                key={y}
                size={[0.015, 0.012, d - 0.1]}
                position={[w / 2 + 0.005, y, 0]}
                color="#b39a78"
              />
            ))}
          </>
        )}
      </FitArtwork>
      {(selected || hovered) && (
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[Math.max(w, d) * 0.64, Math.max(w, d) * 0.64 + 0.028, 64]}
          />
          <meshBasicMaterial
            color={selected ? "#8a653d" : "#baa483"}
            transparent
            opacity={0.95}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

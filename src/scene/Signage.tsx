import { InteriorBrand } from "./InteriorBrand";
import { SafetyFace } from "./SafetyFace";
import { useEffect, useMemo } from "react";
import { CanvasTexture, DoubleSide, SRGBColorSpace } from "three";
import type { Architecture } from "../types/studio";
/** Texto generado con tipografía del sistema; sin fuentes remotas ni logos de referencia. */
export function SurfaceText({
  text,
  width,
  height,
  color = "#6a5540",
  serif = false,
}: {
  text: string;
  width: number;
  height: number;
  color?: string;
  serif?: boolean;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = Math.max(128, Math.round((1024 * height) / width));
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let size = canvas.height * 0.72;
      ctx.font = `${size}px ${serif ? "Georgia" : "Arial"}`;
      size *= Math.min(1, 940 / Math.max(1, ctx.measureText(text).width));
      ctx.font = `${size}px ${serif ? "Georgia" : "Arial"}`;
      ctx.fillText(text, 512, canvas.height / 2, 940);
    }
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, [text, serif, width, height]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 0, 0.016]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        color={color}
        side={DoubleSide}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}
export function Signage({
  model,
  showFacade,
  selected,
  onSelect,
}: {
  model: Architecture;
  showFacade: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {model.senales
        .filter((s) => !["s-fachada", "s-descriptor"].includes(s.id))
        .filter(
          (sign) =>
            showFacade || sign.posicion[2] < model.local.fondo / 2 - 0.2,
        )
        .map((sign) => (
          <group
            key={sign.id}
            position={sign.posicion}
            rotation={sign.rotacion}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(sign.id);
            }}
          >
            {sign.tipo !== "marca" && (
              <mesh position={[0, 0, -0.012]}>
                <boxGeometry args={sign.dimensiones} />
                <meshStandardMaterial
                  color={selected === sign.id ? "#d7c19c" : "#f5efe4"}
                  roughness={0.7}
                />
              </mesh>
            )}
            {sign.tipo === "seguridad" ? (
              <SafetyFace sign={sign} model={model} />
            ) : sign.id === "s-marca" ? (
              <InteriorBrand width={sign.dimensiones[0]} wall />
            ) : (
              <SurfaceText
                text={sign.texto}
                width={sign.dimensiones[0]}
                height={sign.dimensiones[1]}
                serif={sign.tipo === "marca"}
                color="#493b3c"
              />
            )}
          </group>
        ))}
    </>
  );
}

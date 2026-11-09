import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  Frustum,
  Matrix4,
  Mesh,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { Furniture } from "../types/studio";
import { Block } from "./Block";
/** Local original graphics; 12 fps only when on-screen, facing camera and document visible. */
export function AnimatedScreen({
  item,
  paused = false,
}: {
  item: Furniture;
  paused?: boolean;
}) {
  const screen = useRef<Mesh>(null);
  const { camera, invalidate, gl } = useThree();
  const [w, totalHeight, d] = item.dimensiones;
  const data = item.pantalla!;
  const h = data.altoCarcasa ?? totalHeight;
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 432;
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.generateMipmaps = false;
    return texture;
  }, []);
  useEffect(() => {
    const ctx = (texture.image as HTMLCanvasElement).getContext("2d")!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const matrix = new Matrix4(),
      frustum = new Frustum(),
      position = new Vector3(),
      normal = new Vector3(),
      toward = new Vector3();
    const draw = (time: number) => {
      ctx.fillStyle = data.contenido === "marca" ? "#eadbd2" : "#493b3c";
      ctx.fillRect(0, 0, 768, 432);
      for (let i = 0; i < 5; i++) {
        const x = 384 + Math.sin(time * 0.18 + i * 1.5) * 280,
          y = 216 + Math.cos(time * 0.13 + i) * 140;
        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          80 + i * 8,
          150,
          Math.sin(time * 0.1 + i) * 0.5,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = ["#d7b7ba", "#d3c2b4", "#bca69b", "#927670", "#faf7f2"][
          i
        ];
        ctx.globalAlpha = data.contenido === "marca" ? 0.17 : 0.62;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = "center";
      ctx.fillStyle = data.contenido === "marca" ? "#493b3c" : "#faf7f2";
      ctx.font = "54px Georgia";
      ctx.fillText(
        data.contenido === "marca" ? "Ritual Amarte" : "El color de tu calma",
        384,
        205,
      );
      const messages = [
        "UN MOMENTO PARA TI",
        "CUIDADO EN CADA DETALLE",
        "TU RITUAL DE BIENESTAR",
      ];
      const cycle = time / 8,
        phase = cycle % 1;
      ctx.globalAlpha = motion.matches
        ? 1
        : Math.min(1, phase * 5, (1 - phase) * 5) + 0.05;
      ctx.font = "19px Arial";
      ctx.fillText(
        data.contenido === "marca"
          ? messages[Math.floor(cycle) % 3]
          : "BELLEZA · CALMA · COLOR",
        384,
        270,
      );
      ctx.globalAlpha = 1;
      texture.needsUpdate = true;
      invalidate();
    };
    let inViewport = true;
    const observer = new IntersectionObserver((entries) => {
      inViewport = entries[0]?.isIntersecting ?? false;
    });
    observer.observe(gl.domElement);
    let elapsed = 1,
      last = performance.now();
    draw(elapsed);
    const tick = () => {
      const now = performance.now(),
        dt = (now - last) / 1000;
      last = now;
      if (
        paused ||
        !inViewport ||
        document.hidden ||
        motion.matches ||
        !screen.current
      )
        return;
      camera.updateMatrixWorld();
      screen.current.updateWorldMatrix(true, false);
      frustum.setFromProjectionMatrix(
        matrix.multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      );
      screen.current.getWorldPosition(position);
      normal.set(0, 0, 1).transformDirection(screen.current.matrixWorld);
      toward.copy(camera.position).sub(position);
      if (!frustum.intersectsObject(screen.current) || normal.dot(toward) <= 0)
        return;
      elapsed += Math.min(dt, 0.2);
      draw(elapsed);
    };
    const timer = window.setInterval(tick, 1000 / 12);
    const still = () => draw(elapsed);
    motion.addEventListener("change", still);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      motion.removeEventListener("change", still);
    };
  }, [camera, data.contenido, invalidate, texture, gl, paused]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group>
      {data.montaje === "suspendido" && (
        <>
          <Block
            size={[0.045, totalHeight - h, d * 0.5]}
            position={[0, (totalHeight + h) / 2, 0]}
            color="#927670"
          />
          <Block
            size={[0.22, 0.025, d]}
            position={[0, totalHeight - 0.0125, 0]}
            color="#927670"
          />
        </>
      )}
      <group>
        <Block
          size={[w * 0.4, h * 0.45, d * 0.28]}
          position={[0, h / 2, -d * 0.36]}
          color="#493b3c"
          radius={0.012}
        />
        <Block
          size={[w, h, d * 0.6]}
          position={[0, h / 2, d * 0.1]}
          color="#282525"
          radius={0.018}
        />
        <mesh ref={screen} position={[0, h / 2, d * 0.41]}>
          <planeGeometry args={[data.ancho, data.alto]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[w * 0.42, 0.012, d * 0.42]}>
          <sphereGeometry args={[0.003, 8, 6]} />
          <meshBasicMaterial color="#b7d4b2" />
        </mesh>
      </group>
    </group>
  );
}

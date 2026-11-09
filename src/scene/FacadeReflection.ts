import { useEffect, useMemo } from "react";
import { CubeTexture, SRGBColorSpace } from "three";
/** Small local environment for exterior glass only. Approximate sky/pavement, no fabricated building. */
export function useFacadeReflection() {
  const map = useMemo(() => {
    const faces = Array.from({ length: 6 }, (_, i) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createLinearGradient(0, 0, 0, 64);
      gradient.addColorStop(0, i === 3 ? "#b3a38b" : "#faf2e6");
      gradient.addColorStop(0.5, "#c8c9c1");
      gradient.addColorStop(1, "#a99b85");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return canvas;
    });
    const texture = new CubeTexture(faces);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);
  useEffect(() => () => map.dispose(), [map]);
  return map;
}

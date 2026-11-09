import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace, TextureLoader } from "three";
import { facadeBrandAssets, type BrandAsset } from "../data/facadeBrand";
/** Raster-derived application, NOT reconstructed typography or a vector tracing. */
function useBrandInk(asset: BrandAsset) {
  const original = useLoader(TextureLoader, asset.src);
  const maps = useMemo(() => {
    const [x, y, w, h] = asset.crop;
    const face = document.createElement("canvas");
    face.width = w;
    face.height = h;
    const ctx = face.getContext("2d")!;
    ctx.drawImage(original.image, x, y, w, h, 0, 0, w, h);
    if (asset.background === "paper") {
      const pixels = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const r = pixels.data[i],
          g = pixels.data[i + 1],
          b = pixels.data[i + 2];
        // Presentation mask only: the supplied file has paper and baked lighting, no alpha.
        // Dark brown strokes survive; pale gold highlights may be softened. Clean artwork bypasses this.
        const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const a = Math.max(0, Math.min(1, (216 - light) / 35));
        pixels.data[i + 3] = Math.round(a * a * (3 - 2 * a) * 255);
      }
      ctx.putImageData(pixels, 0, 0);
    }
    const halo = document.createElement("canvas");
    halo.width = w + 48;
    halo.height = h + 48;
    const hc = halo.getContext("2d")!;
    hc.shadowColor = "#ffd79c";
    hc.shadowBlur = 14;
    hc.drawImage(face, 24, 24);
    hc.globalCompositeOperation = "source-in";
    hc.fillStyle = "#ffd79c";
    hc.fillRect(0, 0, halo.width, halo.height);
    const ink = new CanvasTexture(face),
      glow = new CanvasTexture(halo);
    ink.colorSpace = glow.colorSpace = SRGBColorSpace;
    ink.anisotropy = 4;
    return { ink, glow };
  }, [original, asset]);
  useEffect(
    () => () => {
      maps.ink.dispose();
      maps.glow.dispose();
    },
    [maps],
  );
  return maps;
}
export function OriginalMark({ asset, width }: { asset: BrandAsset; width: number }) {
  const { ink, glow } = useBrandInk(asset),
    h = (width * asset.crop[3]) / asset.crop[2];
  return (
    <>
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry
          args={[
            width * (1 + 48 / asset.crop[2]),
            h * (1 + 48 / asset.crop[3]),
          ]}
        />
        <meshBasicMaterial
          map={glow}
          transparent
          opacity={0.55}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {[0.012, 0.024, 0.036].map((z, i) => (
        <mesh key={z} position={[0, 0, z]} castShadow>
          <planeGeometry args={[width, h]} />
          <meshStandardMaterial
            map={ink}
            transparent
            alphaTest={0.12}
            color={i === 2 ? "#ffffff" : "#99784f"}
            metalness={0.28}
            roughness={0.44}
            emissive="#957040"
            emissiveIntensity={0.12}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}
export function FacadeBrand() {
  return (
    <group>
      <group position={[-3.05, 0, 0]}>
        <OriginalMark asset={facadeBrandAssets.monogram} width={0.88} />
      </group>
      <mesh position={[-2.28, 0, 0.025]}>
        <boxGeometry args={[0.012, 0.88, 0.025]} />
        <meshStandardMaterial
          color="#bc9763"
          metalness={0.72}
          roughness={0.34}
          emissive="#b58642"
          emissiveIntensity={0.15}
        />
      </mesh>
      <group position={[0.65, 0.17, 0]}>
        <OriginalMark asset={facadeBrandAssets.wordmark} width={5.25} />
      </group>
      <group position={[0.65, -0.31, 0]}>
        <OriginalMark asset={facadeBrandAssets.descriptor} width={3.5} />
      </group>
    </group>
  );
}

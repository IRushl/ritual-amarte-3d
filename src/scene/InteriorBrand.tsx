import { facadeBrandAssets } from "../data/facadeBrand";
import { OriginalMark } from "./FacadeBrand";

/** Approved original artwork, stacked as on the supplied brand board.
 * Shallow raster application: no replacement fonts, no new lights or backing panel.
 */
export function InteriorBrand({ width, wall = false }: { width: number; wall?: boolean }) {
  const monogramWidth = wall ? 0.22 : width * 0.32;
  return (
    <group>
      <group position={[0, wall ? 0.32 : 0.22, 0]}>
        <OriginalMark asset={facadeBrandAssets.monogram} width={monogramWidth} />
      </group>
      <group position={[0, wall ? 0.08 : -0.13, 0]}>
        <OriginalMark asset={facadeBrandAssets.wordmark} width={width} />
      </group>
      <group position={[0, wall ? -0.15 : -0.25, 0]}>
        <OriginalMark asset={facadeBrandAssets.descriptor} width={width * 0.72} />
      </group>
    </group>
  );
}

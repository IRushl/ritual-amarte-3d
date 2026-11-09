/** Original supplied board, 1448×1086 RGB (no alpha). Never substitute system type. */
export interface BrandAsset {
  src: string;
  crop: [number, number, number, number];
  background: "paper" | "transparent";
}
const original = import.meta.env.BASE_URL + "brand/ritual-amarte-original.png";
export const facadeBrandAssets: Record<
  "monogram" | "wordmark" | "descriptor",
  BrandAsset
> = {
  monogram: { src: original, crop: [925, 125, 335, 340], background: "paper" },
  wordmark: { src: original, crop: [832, 573, 552, 72], background: "paper" },
  descriptor: { src: original, crop: [890, 690, 420, 23], background: "paper" },
};
// For clean artwork: change src, crop to its full pixel bounds and background to transparent.

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import {
  DataTexture,
  RedFormat,
  RepeatWrapping,
  UnsignedByteType,
} from "three";
const SurfaceContext = createContext<DataTexture | null>(null);
export const useSurfaceGrain = () => useContext(SurfaceContext);
export function SurfaceMaterials({ children }: { children: ReactNode }) {
  const texture = useMemo(() => {
    const n = 128,
      data = new Uint8Array(n * n);
    let seed = 17;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[i] = 150 + (seed % 75);
    }
    const t = new DataTexture(data, n, n, RedFormat, UnsignedByteType);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(5, 5);
    t.needsUpdate = true;
    return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <SurfaceContext.Provider value={texture}>
      {children}
    </SurfaceContext.Provider>
  );
}

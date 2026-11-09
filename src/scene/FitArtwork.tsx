import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import { Box3, Group, Matrix4, Mesh, Vector3 } from "three";
import type { Vec3 } from "../types/studio";

/** Ajusta la envolvente artística a las medidas del maestro sin alterar sus mallas originales. */
export function FitArtwork({
  dimensions,
  children,
}: {
  dimensions: Vec3;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null),
    invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.scale.set(1, 1, 1);
    root.position.set(0, 0, 0);
    root.updateWorldMatrix(true, true);
    const inverse = new Matrix4().copy(root.matrixWorld).invert(),
      bounds = new Box3();
    root.traverse((object) => {
      if (object instanceof Mesh) {
        object.geometry.computeBoundingBox();
        const box = object.geometry.boundingBox?.clone();
        if (box)
          bounds.union(
            box.applyMatrix4(
              new Matrix4().multiplyMatrices(inverse, object.matrixWorld),
            ),
          );
      }
    });
    if (bounds.isEmpty()) return;
    const size = bounds.getSize(new Vector3()),
      center = bounds.getCenter(new Vector3());
    root.scale.set(
      dimensions[0] / size.x,
      dimensions[1] / size.y,
      dimensions[2] / size.z,
    );
    root.position.set(
      -center.x * root.scale.x,
      -bounds.min.y * root.scale.y,
      -center.z * root.scale.z,
    );
    root.updateWorldMatrix(true, true);
    invalidate();
  }, [dimensions, invalidate]);
  return <group ref={ref}>{children}</group>;
}

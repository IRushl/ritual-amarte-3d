import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { Architecture, ViewVisibility } from "../types/studio";
import { sceneLabels, type LabelProjection } from "../architecture/labels";

/** Proyecta al DOM principal: no crea raíces React dentro de la escena. */
export function LabelProjectionBridge({
  model,
  visibility,
  onProject,
}: {
  model: Architecture;
  visibility: ViewVisibility;
  onProject: (labels: LabelProjection[]) => void;
}) {
  const labels = useMemo(
      () => sceneLabels(model, visibility),
      [model, visibility],
    ),
    invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate(2);
  }, [labels, invalidate]);
  useFrame(({ camera, size }) => {
    camera.updateMatrixWorld();
    onProject(
      labels.map((label) => {
        const v = new Vector3(...label.position).project(camera);
        return {
          id: label.id,
          left: (v.x * 0.5 + 0.5) * size.width,
          top: (-v.y * 0.5 + 0.5) * size.height,
          visible:
            v.z > -1 && v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1,
        };
      }),
    );
  });
  return null;
}

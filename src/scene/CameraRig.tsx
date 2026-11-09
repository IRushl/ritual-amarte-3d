import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PerspectiveCamera, Vector3 } from "three";
import type { Architecture, CameraView } from "../types/studio";
import { cameraPresetsFor } from "../data/studio";

export interface CameraCommand {
  dx: number;
  dz: number;
  serial: number;
}
export function CameraRig({
  model,
  view,
  reset,
  zoom,
  pan,
}: {
  model: Architecture;
  view: CameraView;
  reset: number;
  zoom: number;
  pan: CameraCommand;
}) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, invalidate, size } = useThree();
  const presets = useMemo(() => cameraPresetsFor(model), [model]);
  const target = useRef({
    position: new Vector3(),
    look: new Vector3(),
    zoom: 1,
    fov: 42,
    active: false,
  });
  const previousCamera = useRef(camera);
  const lastPan = useRef(0);
  useEffect(() => {
    if (size.width < 20 || size.height < 20) return;
    const preset = presets[view],
      position = new Vector3(...preset.posicion),
      look = new Vector3(...preset.objetivo);
    if (view === "aerea") {
      const radius =
        Math.hypot(model.local.ancho, model.local.fondo, model.local.alto) / 2;
      const distance =
        (radius / Math.sin((42 * Math.PI) / 360)) *
        Math.max(1, size.height / size.width) *
        1.07;
      position.sub(look).normalize().multiplyScalar(distance).add(look);
    }
    if (view === "fachada" || view === "fachada-perspectiva") {
      const aspect = size.width / size.height;
      const tan = Math.tan((38 * Math.PI) / 360);
      const fit =
        Math.max(
          (model.local.ancho + 0.8) / (2 * tan * aspect),
          ((model.fachada.alturaTotal ?? model.local.alto) + 0.7) / (2 * tan),
        ) * 1.1;
      const distance = fit * (view === "fachada-perspectiva" ? 1.12 : 1);
      position.sub(look).normalize().multiplyScalar(distance).add(look);
    }
    target.current = {
      position,
      look,
      zoom:
        view === "planta"
          ? Math.min(
              size.width / (model.local.ancho + 1.4),
              size.height / (model.local.fondo + 1.4),
            )
          : 1,
      active: true,
      fov:
        view === "pedicure"
          ? 70
          : view === "interior" || view === "hacia-entrada"
            ? 78
            : view === "fachada" || view === "fachada-perspectiva"
              ? 38
              : 42,
    };
    if (
      previousCamera.current !== camera ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      camera.position.copy(position);
      controls.current?.target.copy(look);
      camera.zoom = target.current.zoom;
      if (camera instanceof PerspectiveCamera) camera.fov = target.current.fov;
      camera.updateProjectionMatrix();
    }
    previousCamera.current = camera;
    invalidate();
  }, [
    camera,
    presets,
    view,
    reset,
    size.width,
    size.height,
    model.local.ancho,
    model.local.fondo,
    model.local.alto,
    invalidate,
  ]);
  useEffect(() => {
    if (size.width < 20 || size.height < 20) return;
    target.current.zoom =
      (view === "planta"
        ? Math.min(
            size.width / (model.local.ancho + 1.4),
            size.height / (model.local.fondo + 1.4),
          )
        : 1) * zoom;
    target.current.active = true;
    invalidate();
  }, [
    camera,
    zoom,
    view,
    reset,
    size.width,
    size.height,
    model.local.ancho,
    model.local.fondo,
    invalidate,
  ]);
  useEffect(() => {
    if (!pan.serial || pan.serial === lastPan.current) return;
    lastPan.current = pan.serial;
    const shift = new Vector3(pan.dx, 0, pan.dz);
    target.current.position.copy(camera.position).add(shift);
    target.current.look
      .copy(controls.current?.target ?? new Vector3())
      .add(shift);
    target.current.zoom = camera.zoom;
    target.current.active = true;
    invalidate();
  }, [pan, camera, invalidate]);
  useFrame((_, delta) => {
    const tween = target.current;
    if (!tween.active || !controls.current) return;
    const a = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 1
      : 1 - Math.exp(-delta * 9);
    camera.position.lerp(tween.position, a);
    controls.current.target.lerp(tween.look, a);
    camera.zoom += (tween.zoom - camera.zoom) * a;
    if (camera instanceof PerspectiveCamera)
      camera.fov += (tween.fov - camera.fov) * a;
    camera.updateProjectionMatrix();
    controls.current.update();
    if (
      camera.position.distanceTo(tween.position) < 0.001 &&
      controls.current.target.distanceTo(tween.look) < 0.001 &&
      Math.abs(camera.zoom - tween.zoom) < 0.001 &&
      (!(camera instanceof PerspectiveCamera) ||
        Math.abs(camera.fov - tween.fov) < 0.001)
    ) {
      camera.position.copy(tween.position);
      controls.current.target.copy(tween.look);
      camera.zoom = tween.zoom;
      if (camera instanceof PerspectiveCamera) camera.fov = tween.fov;
      camera.updateProjectionMatrix();
      tween.active = false;
    }
    invalidate();
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      enablePan
      enableZoom
      enableRotate={view !== "planta"}
      minDistance={0.5}
      maxDistance={60}
      minZoom={8}
      maxZoom={220}
      maxPolarAngle={Math.PI / 2 - 0.02}
      onStart={() => {
        target.current.active = false;
      }}
    />
  );
}

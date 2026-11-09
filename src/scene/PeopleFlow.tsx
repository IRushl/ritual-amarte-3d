import { MeshStandardMaterial } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Group, InstancedMesh, Object3D, SphereGeometry } from "three";
import type { Architecture, Vec3 } from "../types/studio";
import {
  peopleFor,
  walkingPose,
  type PersonPlacement,
} from "../architecture/people";

/** CPU-only pose graph. All body parts share one instanced draw call. */
function makeFigure(person: PersonPlacement) {
  const root = new Group(),
    upper = new Group(),
    leftLeg = new Group(),
    rightLeg = new Group(),
    arm = new Group();
  const parts: { node: Object3D; color: Color }[] = [];
  const cloth = person.role === "profesional" ? "#a8aa96" : "#c9a9a6",
    skin = person.role === "profesional" ? "#b88970" : "#d6ad91",
    hip = person.seated ? 0.57 : 0.89;
  const part = (parent: Object3D, pos: Vec3, size: Vec3, color: string) => {
    const node = new Object3D();
    node.position.set(...pos);
    node.scale.set(...size);
    parent.add(node);
    parts.push({ node, color: new Color(color) });
  };
  root.position.set(...person.position);
  root.rotation.y = person.yaw;
  part(root, [0, hip, 0], [0.17, 0.12, 0.13], cloth);
  upper.position.y = hip;
  root.add(upper);
  part(upper, [0, 0.26, 0], [0.19, 0.29, 0.125], cloth);
  part(upper, [0, 0.56, 0], [0.06, 0.09, 0.06], skin);
  part(upper, [0, 0.71, 0], [0.105, 0.14, 0.1], skin);
  part(upper, [0, 0.77, -0.035], [0.11, 0.1, 0.095], "#51413c");
  if (person.role === "profesional")
    part(upper, [0, 0.78, -0.12], [0.065, 0.065, 0.06], "#51413c");
  for (const side of [-1, 1]) {
    const a = side === 1 ? arm : new Group();
    a.position.set(side * 0.21, 0.38, 0);
    a.rotation.set(person.seated ? -0.45 : 0, 0, side * 0.06);
    upper.add(a);
    part(a, [0, -0.14, 0], [0.065, 0.19, 0.065], cloth);
    part(a, [0, -0.38, person.seated ? 0.09 : 0], [0.047, 0.13, 0.047], skin);
    part(a, [0, -0.51, person.seated ? 0.12 : 0], [0.045, 0.055, 0.035], skin);
    const leg = side === 1 ? leftLeg : rightLeg;
    leg.position.set(side * 0.09, hip - 0.03, 0);
    root.add(leg);
    if (person.seated) {
      part(leg, [0, -0.025, 0.18], [0.075, 0.075, 0.23], cloth);
      part(
        leg,
        [0, person.id === "asistente-spa" ? -0.2 : -0.27, 0.35],
        [0.06, person.id === "asistente-spa" ? 0.17 : 0.24, 0.065],
        cloth,
      );
      part(
        leg,
        [0, person.id === "asistente-spa" ? -0.35 : -0.49, 0.41],
        [0.065, 0.045, 0.115],
        "#76645b",
      );
    } else {
      part(leg, [0, -0.24, 0], [0.075, 0.25, 0.075], cloth);
      part(leg, [0, -0.63, 0], [0.055, 0.21, 0.055], cloth);
      part(leg, [0, -0.82, 0.055], [0.065, 0.045, 0.12], "#76645b");
    }
  }
  return { person, root, upper, leftLeg, rightLeg, arm, parts };
}
export function PeopleFlow({
  model,
  paused,
}: {
  model: Architecture;
  paused: boolean;
}) {
  const { gl, invalidate } = useThree(),
    [running, setRunning] = useState(false),
    mesh = useRef<InstancedMesh>(null),
    time = useRef(0);
  const figures = useMemo(() => peopleFor(model).map(makeFigure), [model]);
  const parts = useMemo(() => figures.flatMap((f) => f.parts), [figures]);
  const geometry = useMemo(() => new SphereGeometry(1, 12, 8), []);
  const material = useMemo(
    () => new MeshStandardMaterial({ color: "white", roughness: 0.86 }),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  useEffect(() => {
    parts.forEach((part, i) => mesh.current?.setColorAt(i, part.color));
    if (mesh.current?.instanceColor)
      mesh.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [parts, invalidate]);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    if (running) time.current += Math.min(delta, 0.075);
    const t = time.current;
    for (const f of figures) {
      if (f.person.walking) {
        const pose = walkingPose(t, model, f.person.id);
        f.root.position.set(...pose.position);
        f.root.rotation.y = pose.yaw;
        f.leftLeg.rotation.x = Math.sin(t * 3.6) * 0.25 * pose.stride;
        f.rightLeg.rotation.x = -Math.sin(t * 3.6) * 0.25 * pose.stride;
      }
      f.upper.rotation.x =
        f.person.id === "asistente-spa" ? 0.18 + Math.sin(t * 0.8) * 0.025 : 0;
      f.upper.rotation.z = Math.sin(t * 0.65 + f.person.id.length) * 0.012;
      f.arm.rotation.x =
        (f.person.id === "asistente-spa"
          ? -0.75
          : f.person.seated
            ? -0.45
            : 0) +
        Math.sin(t * 0.9) * 0.045;
      f.root.updateMatrixWorld(true);
    }
    parts.forEach((part, i) =>
      mesh.current!.setMatrixAt(i, part.node.matrixWorld),
    );
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const update = () => {
      setRunning(!paused && !document.hidden && !motion.matches && visible);
      invalidate();
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      update();
    });
    observer.observe(gl.domElement);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
    };
  }, [gl, invalidate, paused]);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => invalidate(), 1000 / 30);
    return () => clearInterval(timer);
  }, [running, invalidate]);
  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, parts.length]}
      frustumCulled={false}
      raycast={() => {}}
      dispose={null}
    />
  );
}

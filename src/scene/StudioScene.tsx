import { useFacadeReflection } from "./FacadeReflection";
import { PeopleFlow } from "./PeopleFlow";
import { SurfaceMaterials } from "./SurfaceMaterials";
import { Facade } from "./Facade";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { Group, Plane, Vector3, type CubeTexture } from "three";
import { Signage } from "./Signage";
import { LabelProjectionBridge } from "./LabelProjection";
import type { LabelProjection } from "../architecture/labels";
import type {
  Architecture,
  CameraView,
  Wall,
  ViewVisibility,
} from "../types/studio";
import { wallSegments, openingFrame } from "../architecture/geometry";
import { Block, FurnitureModel } from "./FurnitureModel";
import { ArchitecturalDetails } from "./ArchitecturalDetails";
import { CameraRig, type CameraCommand } from "./CameraRig";

export interface SceneProps {
  model: Architecture;
  view: CameraView;
  reset: number;
  zoom: number;
  pan: CameraCommand;
  selected: string | null;
  onSelect: (id: string | null) => void;
  visibility: ViewVisibility;
  onReady: () => void;
  onContextLost: () => void;
  onProject: (labels: LabelProjection[]) => void;
}
function WallGroup({
  model,
  wall,
  cutaway,
  reflection,
  selected,
  onSelect,
}: {
  model: Architecture;
  wall: Wall;
  cutaway: boolean;
  reflection: CubeTexture;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const group = useRef<Group>(null);
  const clip =
    wall.grupo === "interior" && cutaway
      ? [new Plane(new Vector3(0, -1, 0), 1.1)]
      : [];
  useFrame(({ camera }) => {
    if (!group.current) return;
    const outward =
      wall.grupo === "sur"
        ? camera.position.z > 0
        : wall.grupo === "norte"
          ? camera.position.z < 0
          : wall.grupo === "este"
            ? camera.position.x > 0
            : wall.grupo === "oeste"
              ? camera.position.x < 0
              : true;
    group.current.visible = wall.grupo === "interior" || !cutaway || !outward;
  });
  return (
    <group ref={group}>
      {wallSegments(wall, model.huecos).map((s) => (
        <mesh
          key={s.id}
          position={s.posicion}
          rotation={[0, s.yaw, 0]}
          castShadow
          receiveShadow
          onClick={(e) => {
            if (clip.length && e.point.y > 1.1) return;
            e.stopPropagation();
            onSelect(wall.id);
          }}
        >
          <boxGeometry args={s.dimensiones} />
          <meshStandardMaterial
            color={
              selected === wall.id
                ? "#c7ad86"
                : model.materiales.find((m) => m.id === wall.materialId)!.color
            }
            roughness={0.8}
            clippingPlanes={clip}
            clipShadows
          />
        </mesh>
      ))}
      {model.huecos
        .filter((o) => o.muroId === wall.id)
        .map((o) => {
          const frame = openingFrame(wall, o);
          return (
            <group
              key={o.id}
              position={[frame.start[0], o.antepecho, frame.start[1]]}
              rotation={[0, frame.yaw, 0]}
              onClick={(e) => {
                if (clip.length && e.point.y > 1.1) return;
                e.stopPropagation();
                onSelect(o.id);
              }}
            >
              {o.tipo === "puerta" ? (
                <group rotation={[0, (-o.giro * Math.PI) / 2, 0]}>
                  <mesh position={[o.ancho / 2, o.alto / 2, 0]} castShadow>
                    <boxGeometry args={[o.ancho, o.alto, 0.035]} />
                    <meshStandardMaterial
                      color={
                        selected === o.id
                          ? "#bc9e77"
                          : o.id === "p-acceso"
                            ? "#d9e4e1"
                            : "#d4c3a9"
                      }
                      transparent={o.id === "p-acceso"}
                      opacity={o.id === "p-acceso" ? 0.09 : 1}
                      roughness={o.id === "p-acceso" ? 0.08 : 0.55}
                      envMap={o.id === "p-acceso" ? reflection : undefined}
                      envMapIntensity={0.4}
                      depthWrite={o.id !== "p-acceso"}
                      clippingPlanes={clip}
                      clipShadows
                    />
                  </mesh>
                  {o.id === "p-acceso" && (
                    <>
                      {[0, o.ancho].map((x) => (
                        <Block
                          key={x}
                          size={[0.045, o.alto, 0.045]}
                          position={[x, o.alto / 2, 0]}
                          color="#927670"
                        />
                      ))}
                      {[0, o.alto].map((y) => (
                        <Block
                          key={y}
                          size={[o.ancho, 0.045, 0.045]}
                          position={[o.ancho / 2, y, 0]}
                          color="#927670"
                        />
                      ))}
                      <Block
                        size={[0.025, 0.45, 0.065]}
                        position={[o.ancho - 0.12, 1.15, 0]}
                        color="#b7a17d"
                      />
                    </>
                  )}
                </group>
              ) : (
                <>
                  <mesh position={[o.ancho / 2, o.alto / 2, 0]}>
                    <boxGeometry args={[o.ancho, o.alto, 0.025]} />
                    <meshStandardMaterial
                      color={selected === o.id ? "#b48e5c" : "#f4eee2"}
                      transparent
                      opacity={0.11}
                      envMap={reflection}
                      envMapIntensity={0.4}
                      metalness={0.12}
                      depthWrite={false}
                      roughness={0.07}
                    />
                  </mesh>
                  {[0, o.alto].map((y) => (
                    <Block
                      key={y}
                      size={[o.ancho, 0.045, 0.045]}
                      position={[o.ancho / 2, y, 0]}
                      color="#bda889"
                    />
                  ))}
                </>
              )}
            </group>
          );
        })}
    </group>
  );
}
function Lifecycle({
  onReady,
  onContextLost,
}: Pick<SceneProps, "onReady" | "onContextLost">) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    onReady();
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onReady, onContextLost]);
  return null;
}
export default function StudioScene(props: SceneProps) {
  const { model, view, selected, onSelect, visibility } = props,
    { ancho: w, fondo: d, alto: h } = model.local;
  const reflection = useFacadeReflection();
  const mat = (id: string) => model.materiales.find((m) => m.id === id)!;
  return (
    <SurfaceMaterials>
      {view === "planta" ? (
        <OrthographicCamera
          makeDefault
          position={[0, 15, 0.001]}
          near={0.1}
          far={150}
        />
      ) : (
        <PerspectiveCamera
          makeDefault
          position={[8, 8, 8]}
          fov={42}
          near={0.05}
          far={150}
        />
      )}
      <CameraRig
        model={model}
        view={view}
        reset={props.reset}
        zoom={props.zoom}
        pan={props.pan}
      />
      <Lifecycle onReady={props.onReady} onContextLost={props.onContextLost} />
      <LabelProjectionBridge
        model={model}
        visibility={visibility}
        onProject={props.onProject}
      />
      {visibility.people && (
        <PeopleFlow model={model} paused={!!visibility.peoplePaused} />
      )}
      <ambientLight intensity={0.45} color="#fff3e1" />
      <hemisphereLight args={["#fff8ef", "#b9aa96", 0.9]} />
      <directionalLight
        position={[w * 0.5, 8, d * 0.8]}
        intensity={1.65}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-normalBias={0.04}
      />
      <Block
        size={[w + 0.32, 0.22, d + 0.32]}
        position={[0, -0.12, 0]}
        color="#b49c7f"
      />
      <Block
        size={[w, 0.04, d]}
        position={[0, -0.02, 0]}
        color={mat(model.acabados.pisoMaterialId).color}
      />
      {model.muros.map((wall) => (
        <WallGroup
          key={wall.id}
          model={model}
          wall={wall}
          reflection={reflection}
          cutaway={
            visibility.cutaway &&
            ![
              "fachada",
              "fachada-perspectiva",
              "acceso-cerca",
              "hacia-entrada",
            ].includes(view)
          }
          selected={selected}
          onSelect={onSelect}
        />
      ))}
      <Facade
        model={model}
        signage={visibility.signage}
        onSelect={onSelect}
        visible={
          !visibility.cutaway ||
          [
            "fachada",
            "fachada-perspectiva",
            "acceso-cerca",
            "hacia-entrada",
          ].includes(view)
        }
      />
      {visibility.roof && (
        <mesh
          position={[0, h + 0.05, 0]}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <boxGeometry args={[w + 0.3, 0.1, d + 0.3]} />
          <meshStandardMaterial
            color={mat(model.acabados.techoMaterialId).color}
          />
        </mesh>
      )}
      {view !== "planta" && (
        <ArchitecturalDetails model={model} ceiling={visibility.roof} />
      )}
      {model.espacios.map((s) => (
        <group key={s.id}>
          {(visibility.zones || selected === s.id) && (
            <mesh
              position={[s.centro[0], 0.009, s.centro[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(s.id);
              }}
            >
              <planeGeometry args={[s.dimensiones[0], s.dimensiones[2]]} />
              <meshBasicMaterial
                color={s.color}
                transparent
                opacity={selected === s.id ? 0.5 : s.reserva ? 0.28 : 0.16}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      ))}
      {visibility.signage && (
        <Signage
          model={model}
          showFacade={
            !visibility.cutaway ||
            [
              "fachada",
              "fachada-perspectiva",
              "acceso-cerca",
              "hacia-entrada",
            ].includes(view)
          }
          selected={selected}
          onSelect={onSelect}
        />
      )}
      {visibility.furniture &&
        model.mobiliario.map((item) => (
          <FurnitureModel
            paused={visibility.animationPaused}
            key={item.id}
            item={item}
            selected={selected === item.id}
            onSelect={onSelect}
            brandName={model.marca.nombre}
          />
        ))}
      {(visibility.technical || visibility.electrical) &&
        model.puntosTecnicos
          .filter((t) =>
            t.tipo === "energia" ? visibility.electrical : visibility.technical,
          )
          .map((t) => (
            <group key={t.id} position={t.posicion}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(t.id);
                }}
              >
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial
                  color={
                    selected === t.id
                      ? "#c99c5b"
                      : t.tipo === "energia"
                        ? "#c8a35d"
                        : "#7d9a97"
                  }
                />
              </mesh>
            </group>
          ))}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.235, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.13} />
      </mesh>
    </SurfaceMaterials>
  );
}

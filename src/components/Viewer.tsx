import { ACESFilmicToneMapping } from "three";
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useState,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import type { Architecture, CameraView, ViewVisibility } from "../types/studio";
import type { CameraCommand } from "../scene/CameraRig";
import { Icon } from "./Icon";
import { sceneLabels, type LabelProjection } from "../architecture/labels";
const StudioScene = lazy(() => import("../scene/StudioScene"));
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="viewer-message" role="alert">
        <Icon name="info" />
        <h3>No pudimos iniciar la escena</h3>
        <p>
          Comprueba la aceleración gráfica de tu navegador. El inventario sigue
          disponible.
        </p>
        <button onClick={() => window.location.reload()}>
          Volver a intentar
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function Viewer({
  model,
  selected,
  onSelect,
  visibility,
}: {
  model: Architecture;
  selected: string | null;
  onSelect: (id: string | null) => void;
  visibility: ViewVisibility;
}) {
  const [view, setView] = useState<CameraView>("aerea");
  const [reset, setReset] = useState(0),
    [zoom, setZoom] = useState(1),
    [ready, setReady] = useState(false),
    [lost, setLost] = useState(false);
  const [pan, setPan] = useState<CameraCommand>({ dx: 0, dz: 0, serial: 0 });
  const onReady = useCallback(() => setReady(true), []),
    onLost = useCallback(() => setLost(true), []);
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const labels = useMemo(
    () => sceneLabels(model, visibility),
    [model, visibility],
  );
  const onProject = useCallback((items: LabelProjection[]) => {
    const occupied: {
      left: number;
      top: number;
      width: number;
      height: number;
    }[] = [];
    for (const item of items) {
      const el = labelRefs.current[item.id];
      if (el) {
        const width = el.offsetWidth,
          height = el.offsetHeight,
          parent = el.parentElement!;
        const x = Math.max(
          width / 2 + 8,
          Math.min(parent.clientWidth - width / 2 - 8, item.left),
        );
        let y = item.top,
          visible = false;
        if (item.visible)
          for (const offset of [0, -1, 1, -2, 2, -3, 3, -4, 4]) {
            const candidate = item.top + offset * (height + 6);
            if (
              candidate - height / 2 < 105 ||
              candidate + height / 2 > parent.clientHeight - 72
            )
              continue;
            const box = {
              left: x - width / 2,
              top: candidate - height / 2,
              width: width + 4,
              height: height + 4,
            };
            if (
              occupied.some(
                (b) =>
                  box.left < b.left + b.width &&
                  box.left + box.width > b.left &&
                  box.top < b.top + b.height &&
                  box.top + box.height > b.top,
              )
            )
              continue;
            occupied.push(box);
            y = candidate;
            visible = true;
            break;
          }
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.visibility = visible ? "visible" : "hidden";
        el.style.opacity = visible ? "1" : "0";
        el.style.pointerEvents = visible ? "auto" : "none";
        el.tabIndex = visible ? 0 : -1;
      }
    }
  }, []);
  const changeView = (next: CameraView) => {
    setView(next);
    setZoom(1);
    setReset((n) => n + 1);
  };
  const shift = (dx: number, dz: number) =>
    setPan((p) => ({ dx, dz, serial: p.serial + 1 }));
  return (
    <section
      className="viewport"
      aria-label="Visualizador arquitectónico 3D"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        const moves: Record<string, [number, number]> = {
          ArrowLeft: [-0.25, 0],
          ArrowRight: [0.25, 0],
          ArrowUp: [0, -0.25],
          ArrowDown: [0, 0.25],
        };
        if (moves[e.key]) {
          e.preventDefault();
          shift(...moves[e.key]);
        }
      }}
    >
      <div className="scene-caption">
        <span className="live-dot" /> ESTUDIO ESPACIAL{" "}
        <span className="caption-divider">/</span> V0.2-R8
      </div>
      <div className="view-tabs" aria-label="Vistas de cámara">
        {(
          [
            { id: "aerea", label: "Aérea", icon: "cube" },
            { id: "interior", label: "Interior", icon: "eye" },
            { id: "planta", label: "Superior", icon: "grid" },
            { id: "fachada", label: "Fachada", icon: "eye" },
          ] as const
        ).map((v) => (
          <button
            key={v.id}
            aria-pressed={
              view === v.id ||
              (v.id === "interior" && view === "pedicure") ||
              (v.id === "fachada" &&
                [
                  "fachada-perspectiva",
                  "acceso-cerca",
                  "hacia-entrada",
                ].includes(view))
            }
            className={
              view === v.id ||
              (v.id === "interior" && view === "pedicure") ||
              (v.id === "fachada" &&
                [
                  "fachada-perspectiva",
                  "acceso-cerca",
                  "hacia-entrada",
                ].includes(view))
                ? "active"
                : ""
            }
            onClick={() => changeView(v.id)}
          >
            <Icon name={v.icon} size={16} />
            {v.label}
          </button>
        ))}
      </div>
      {[
        "fachada",
        "fachada-perspectiva",
        "acceso-cerca",
        "hacia-entrada",
      ].includes(view) && (
        <label className="facade-views">
          Recorrido de fachada
          <select
            aria-label="Recorrido de fachada"
            value={view}
            onChange={(e) => changeView(e.target.value as CameraView)}
          >
            <option value="fachada">Frontal exterior</option>
            <option value="fachada-perspectiva">Perspectiva exterior</option>
            <option value="acceso-cerca">Acceso cercano</option>
            <option value="hacia-entrada">Interior hacia entrada</option>
          </select>
        </label>
      )}
      {(view === "interior" || view === "pedicure") && (
        <label className="facade-views">
          Punto de observación
          <select
            aria-label="Punto de observación"
            value={view}
            onChange={(e) => changeView(e.target.value as CameraView)}
          >
            <option value="interior">Interior general</option>
            <option value="pedicure">Desde pedicure · pantallas</option>
          </select>
        </label>
      )}
      <SceneBoundary>
        <Suspense
          fallback={
            <div className="viewer-message" role="status">
              <span className="spinner" />
              Preparando el espacio…
            </div>
          }
        >
          {!ready && (
            <div className="canvas-loading" role="status">
              Iniciando WebGL…
            </div>
          )}
          {lost ? (
            <div className="viewer-message" role="alert">
              <h3>Se interrumpió la conexión gráfica</h3>
              <p>El plano 2D continúa disponible.</p>
              <button onClick={() => window.location.reload()}>
                Recargar escena
              </button>
            </div>
          ) : (
            <Canvas
              shadows
              dpr={[1, 1.75]}
              frameloop="demand"
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl }) => {
                gl.localClippingEnabled = true;
                gl.toneMapping = ACESFilmicToneMapping;
                gl.toneMappingExposure = 1;
              }}
              onPointerMissed={() => onSelect(null)}
              fallback={
                <span>
                  Escena 3D que requiere WebGL. El plano está disponible en la
                  pestaña Plano 2D.
                </span>
              }
            >
              <StudioScene
                model={model}
                view={view}
                reset={reset}
                zoom={zoom}
                pan={pan}
                selected={selected}
                onSelect={onSelect}
                visibility={visibility}
                onReady={onReady}
                onContextLost={onLost}
                onProject={onProject}
              />
            </Canvas>
          )}
        </Suspense>
      </SceneBoundary>
      <div className="projected-labels">
        {labels.map((label) => (
          <button
            key={label.id}
            title={label.text + " · " + label.id}
            ref={(el) => {
              labelRefs.current[label.id] = el;
            }}
            className={`scene-label ${label.technical ? "technical-label" : ""} ${selected === label.id ? "active" : ""}`}
            style={{ opacity: 0 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onSelect(label.id)}
          >
            {label.text}
          </button>
        ))}
      </div>
      <div className="scene-controls">
        <button
          aria-label="Acercar"
          onClick={() => setZoom((z) => Math.min(2.4, z + 0.2))}
        >
          <Icon name="plus" size={18} />
        </button>
        <button
          aria-label="Alejar"
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
        >
          <Icon name="minus" size={18} />
        </button>
        <span />
        <button
          aria-label="Encuadrar todo"
          onClick={() => {
            setZoom(1);
            setReset((n) => n + 1);
          }}
        >
          <Icon name="reset" size={18} />
        </button>
      </div>
      <div className="pan-controls" aria-label="Desplazamiento de cámara">
        <button aria-label="Desplazar izquierda" onClick={() => shift(-0.3, 0)}>
          ←
        </button>
        <button aria-label="Desplazar atrás" onClick={() => shift(0, -0.3)}>
          ↑
        </button>
        <button aria-label="Desplazar adelante" onClick={() => shift(0, 0.3)}>
          ↓
        </button>
        <button aria-label="Desplazar derecha" onClick={() => shift(0.3, 0)}>
          →
        </button>
      </div>
      <div className="viewer-bottom">
        <span>
          <Icon name="mouse" size={15} />
          Arrastra para orbitar
        </span>
        <span>
          <Icon name="move" size={15} />
          Clic derecho para desplazar
        </span>
        <span>Rueda para zoom</span>
      </div>
      <div className="concept-note">
        Metros hipotéticos · X derecha / Y arriba / Z hacia el acceso
      </div>
    </section>
  );
}

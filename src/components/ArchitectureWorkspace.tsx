import { technicalFurnitureIds } from "../architecture/labels";
import { peopleFor } from "../architecture/people";
import { useEffect, useRef, useState } from "react";
import type { Architecture, ViewVisibility } from "../types/studio";
import { Viewer } from "./Viewer";
import { FloorPlan } from "./FloorPlan";
import { ObjectInspector } from "./ObjectInspector";
import {
  validateArchitecture,
  cabinetOpeningConflicts,
} from "../architecture/geometry";
import { createArchitecture } from "../data/studio";
import { Icon } from "./Icon";
import { defaultPlanLayers } from "../plan/renderPlan";
import { FurnitureSheet } from "./FurnitureSheet";
import { electricalSummary } from "../architecture/budget";

export type WorkspaceMode = "3d" | "2d";
export function ArchitectureWorkspace({
  model,
  selected,
  onSelect,
  mode,
  onMode,
  onConfigure,
  drawingRequest,
}: {
  drawingRequest?: { id: string; serial: number } | null;
  model: Architecture;
  selected: string | null;
  onSelect: (id: string | null) => void;
  mode: WorkspaceMode;
  onMode: (mode: WorkspaceMode) => void;
  onConfigure: (width: number, depth: number) => void;
}) {
  const [expanded, setExpanded] = useState(false),
    [width, setWidth] = useState(String(model.local.ancho)),
    [depth, setDepth] = useState(String(model.local.fondo)),
    [error, setError] = useState("");
  const [visibility, setVisibility] = useState<ViewVisibility>({
    people: false,
    peoplePaused: false,
    animationPaused: false,
    zones: false,
    electrical: false,
    signage: true,
    labels: false,
    roof: false,
    cutaway: true,
    technical: false,
    furniture: true,
  });
  const [planLayers, setPlanLayers] = useState(defaultPlanLayers);
  const root = useRef<HTMLElement>(null);
  const [showDrawing, setShowDrawing] = useState(false);
  const [drawingActivation, setDrawingActivation] = useState(0);
  useEffect(() => {
    if (drawingRequest) {
      setShowDrawing(true);
      setDrawingActivation((n) => n + 1);
    }
  }, [drawingRequest]);
  const drawingItem = model.mobiliario.find((f) => f.id === selected);
  const doorConflicts = cabinetOpeningConflicts(model);
  const electric = electricalSummary(model);
  useEffect(() => {
    setWidth(String(model.local.ancho));
    setDepth(String(model.local.fondo));
  }, [model.local.ancho, model.local.fondo]);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key === "Tab" && root.current) {
        const buttons = Array.from(
          root.current.querySelectorAll<HTMLElement>(
            'button,input,summary,[tabindex="0"]',
          ),
        ).filter((e) => e.getClientRects().length > 0);
        const first = buttons[0],
          last = buttons.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          last?.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
          first?.focus();
          event.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
    };
  }, [expanded]);
  const apply = (w: number, d: number) => {
    try {
      const errors = validateArchitecture(createArchitecture(w, d));
      if (errors.length) throw new Error(errors.join(" "));
      onConfigure(w, d);
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo configurar el escenario.",
      );
    }
  };
  return (
    <section
      ref={root}
      className={`architecture-workspace ${expanded ? "is-expanded" : ""}`}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded ? true : undefined}
      aria-label="Gemelo digital conceptual"
    >
      <div className="architecture-toolbar">
        <div className="mode-tabs" aria-label="Representación del modelo">
          <button
            aria-pressed={mode === "3d"}
            className={mode === "3d" ? "active" : ""}
            onClick={() => onMode("3d")}
          >
            <Icon name="cube" size={16} />
            Espacio 3D
          </button>
          <button
            aria-pressed={mode === "2d"}
            className={mode === "2d" ? "active" : ""}
            onClick={() => onMode("2d")}
          >
            <Icon name="grid" size={16} />
            Plano 2D
          </button>
        </div>
        <span className="model-metrics">
          {model.local.ancho.toFixed(2)} × {model.local.fondo.toFixed(2)} m{" "}
          <span>
            · {(model.local.ancho * model.local.fondo).toFixed(1)} m²
            hipotéticos
          </span>
        </span>
        <button
          className="subtle-button"
          aria-pressed={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Reducir vista ↙" : "Expandir vista ↗"}
        </button>
      </div>
      <details className="scenario-panel">
        <summary>Escenario configurable · Medidas hipotéticas</summary>
        <p>
          Escenario amplio de 12 × 8 m para estudiar tres manicure, tres
          maquillaje y dos pedicure; alternativa 10 × 8 m. No equivale a
          inmueble, capacidad o apertura aprobados.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply(Number(width), Number(depth));
          }}
        >
          <label>
            Ancho (m)
            <input
              type="number"
              step="0.1"
              min="10"
              max="16"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              required
            />
          </label>
          <label>
            Fondo (m)
            <input
              type="number"
              step="0.1"
              min="8"
              max="14"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              required
            />
          </label>
          <button className="subtle-button" type="submit">
            Aplicar medidas
          </button>
          <button
            className="subtle-button"
            type="button"
            onClick={() => apply(12, 8)}
          >
            Estudio 12 × 8
          </button>
          <button
            className="subtle-button"
            type="button"
            onClick={() => apply(10, 8)}
          >
            Alternativa 10 × 8
          </button>
        </form>
        {error && <p role="alert">{error}</p>}
        <ul>
          {model.limites.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
        <p>
          Altura {model.local.alto.toFixed(2)} m · Muros{" "}
          {model.local.espesorMuro.toFixed(2)} m. Medidas generales interiores;
          no corresponden a un predio.
        </p>
      </details>
      <div className="assumption-banner">
        <Icon name="info" size={16} />
        <span>
          Escenario hipotético amplio · 3 manicure / 2 pedicure / 2 maquillaje.
          Baño y áreas técnicas esquemáticas; sin cumplimiento comprobado.
        </span>
      </div>
      {mode === "3d" && (
        <div className="visibility-options" aria-label="Visibilidad del modelo">
          {(
            [
              { key: "people", label: "Mostrar personas" },
              { key: "peoplePaused", label: "Pausar personas" },
              { key: "animationPaused", label: "Pausar pantallas" },
              { key: "zones", label: "Zonas" },
              { key: "labels", label: "Etiquetas" },
              { key: "furniture", label: "Mobiliario 3D" },
              { key: "technical", label: "Etiquetas técnicas y redes" },
              { key: "electrical", label: `Eléctricos (${electric.points})` },
              { key: "signage", label: "Señalización" },
              { key: "cutaway", label: "Corte visual de muros" },
              { key: "roof", label: "Mostrar techo" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={visibility[key]}
                onChange={(e) =>
                  setVisibility((v) => ({ ...v, [key]: e.target.checked }))
                }
              />
              {label}
            </label>
          ))}
        </div>
      )}
      {mode === "3d" && visibility.people && (
        <p className="plan-help">
          Flujo ilustrativo · {peopleFor(model).length} figuras: 5 clientas y 4
          profesionales. Espera, recepción, manicure, pedicure, maquillaje,
          entrada/salida y apoyo técnico. No representa aforo ni plantilla aprobados.
        </p>
      )}
      {mode === "3d" && visibility.technical && (
        <details className="technical-index" open>
          <summary>Directorio técnico · nombres completos</summary>
          <div>
            {model.espacios
              .filter((z) =>
                ["almacen", "asepsia", "aseo", "tecnico", "sanitario"].includes(
                  z.id,
                ),
              )
              .map((z) => (
                <button key={z.id} onClick={() => onSelect(z.id)}>
                  {z.nombre}
                  <small>Zona · {z.id}</small>
                </button>
              ))}
            {model.mobiliario
              .filter((f) => technicalFurnitureIds.includes(f.id))
              .map((f) => (
                <button key={f.id} onClick={() => onSelect(f.id)}>
                  {f.nombre}
                  <small>{f.id}</small>
                </button>
              ))}
            {model.puntosTecnicos
              .filter((p) => p.tipo !== "energia")
              .map((p) => (
                <button key={p.id} onClick={() => onSelect(p.id)}>
                  {p.nombre}
                  <small>{p.id}</small>
                </button>
              ))}
          </div>
        </details>
      )}
      <p className="electric-summary">
        {electric.outlets} tomas previstas · {electric.light} puntos de luz ·{" "}
        {electric.reserve} reserva · {electric.dependent} elementos con
        conexión. Validar con diseño eléctrico real.
      </p>
      {doorConflicts.length > 0 && (
        <p className="plan-help" role="status">
          Revisar apertura de armarios en este escenario:{" "}
          {doorConflicts.join("; ")}. La alternativa compacta necesita
          redistribuir el apoyo posterior.
        </p>
      )}
      <div className="workspace-grid">
        <div className="scene-column">
          {mode === "3d" ? (
            <Viewer
              model={model}
              selected={selected}
              onSelect={onSelect}
              visibility={visibility}
            />
          ) : (
            <FloorPlan
              model={model}
              selected={selected}
              onSelect={onSelect}
              layers={planLayers}
              onLayers={setPlanLayers}
            />
          )}
          <div className="scene-footnote">
            <Icon name="info" size={15} />
            <span>
              Única fuente de datos · Metros · Origen al centro del piso · No es
              un plano constructivo.
            </span>
          </div>
        </div>
        <ObjectInspector
          model={model}
          selected={selected}
          onSelect={onSelect}
          onOpenDrawing={() => {
            setShowDrawing(true);
            setDrawingActivation((n) => n + 1);
          }}
        />
      </div>
      {showDrawing && drawingItem && (
        <FurnitureSheet
          activation={drawingActivation}
          item={drawingItem}
          zoneName={
            model.espacios.find((z) => z.id === drawingItem.espacioId)?.nombre
          }
          onClose={() => {
            setShowDrawing(false);
            root.current
              ?.querySelector<HTMLButtonElement>(".drawing-button")
              ?.focus();
          }}
        />
      )}
    </section>
  );
}

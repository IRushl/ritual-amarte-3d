import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Architecture } from "../types/studio";
import { exportPlanSvg, renderPlan, type PlanLayers } from "../plan/renderPlan";

export function FloorPlan({
  model,
  selected,
  onSelect,
  layers,
  onLayers,
}: {
  model: Architecture;
  selected: string | null;
  onSelect: (id: string | null) => void;
  layers: PlanLayers;
  onLayers: (layers: PlanLayers) => void;
}) {
  const [message, setMessage] = useState("");
  const [scale, setScale] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const keyboardSelection = useRef<string | null>(null);
  const markup = useMemo(
    () => renderPlan(model, layers, selected),
    [model, layers, selected],
  );
  useLayoutEffect(() => {
    if (!keyboardSelection.current) return;
    const selectedElement = Array.from(
      scrollRef.current?.querySelectorAll<SVGElement>("[data-entity-id]") ?? [],
    ).find(
      (element) =>
        element.getAttribute("data-entity-id") === keyboardSelection.current,
    );
    selectedElement?.focus({ preventScroll: true });
    keyboardSelection.current = null;
  }, [markup]);
  const activate = (target: EventTarget | null) => {
    const element =
      target instanceof Element ? target.closest("[data-entity-id]") : null;
    if (element) onSelect(element.getAttribute("data-entity-id"));
  };
  const download = () => {
    try {
      const blob = new Blob([exportPlanSvg(model, layers)], {
          type: "image/svg+xml;charset=utf-8",
        }),
        url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ritual-amarte-planta-${model.local.ancho}x${model.local.fondo}-r4.svg`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("SVG generado con cotas, nombres de zonas e identificadores.");
    } catch {
      setMessage("No se pudo exportar el plano. Vuelve a intentarlo.");
    }
  };
  return (
    <section className="floor-plan" aria-label="Plano 2D sincronizado">
      <div className="plan-toolbar">
        <div className="layer-options">
          {(
            [
              { key: "furniture", label: "Mobiliario" },
              { key: "dimensions", label: "Cotas" },
              { key: "zones", label: "Nombres de zonas" },
              { key: "ids", label: "Identificadores" },
              { key: "technical", label: "Apoyo técnico" },
              { key: "electrical", label: "Eléctricos" },
              { key: "signage", label: "Señalización" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={(e) =>
                  onLayers({ ...layers, [key]: e.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <button className="subtle-button" onClick={download}>
          Exportar SVG ↓
        </button>
      </div>
      <div className="plan-zoom">
        <button
          onClick={() => setScale((n) => Math.max(0.75, n - 0.25))}
          disabled={scale <= 0.75}
          aria-label="Reducir lámina"
        >
          −
        </button>
        <span>{Math.round(scale * 100)} %</span>
        <button
          onClick={() => setScale((n) => Math.min(2, n + 0.25))}
          disabled={scale >= 2}
          aria-label="Ampliar lámina"
        >
          +
        </button>
        <button onClick={() => setScale(1)}>Restablecer</button>
      </div>
      <div
        style={{ "--sheet-width": `${1440 * scale}px` } as React.CSSProperties}
        ref={scrollRef}
        className="plan-scroll"
        onClick={(e) => activate(e.target)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const id =
              e.target instanceof Element
                ? e.target
                    .closest("[data-entity-id]")
                    ?.getAttribute("data-entity-id")
                : null;
            keyboardSelection.current = id !== selected ? (id ?? null) : null;
            activate(e.target);
          }
        }}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <div className="plan-help">
        Pulsa un objeto para inspeccionarlo. En móvil, desliza el plano
        horizontalmente. La selección se conserva al volver a 3D.
      </div>
      {!layers.furniture && (
        <p className="plan-help" role="status">
          Geometría de mobiliario oculta. El cuadro de mobiliario sigue
          disponible para consulta.
        </p>
      )}
      <p className="export-status" role="status">
        {message}
      </p>
    </section>
  );
}

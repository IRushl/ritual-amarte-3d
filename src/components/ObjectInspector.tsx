import type { Architecture } from "../types/studio";
import { inspectEntity } from "../architecture/inspection";
import { Icon } from "./Icon";
import { acquisitionLabels, lineSubtotal, money } from "../architecture/budget";
const evidenceLabels = {
  "hecho-documentado": "Hecho documentado",
  "decision-preliminar": "Decisión preliminar",
  "supuesto-diseno": "Supuesto de diseño",
  "pendiente-verificacion": "Pendiente de verificación",
};
export function ObjectInspector({
  model,
  selected,
  onSelect,
  onOpenDrawing,
}: {
  model: Architecture;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onOpenDrawing: () => void;
}) {
  const item = inspectEntity(model, selected);
  const furniture = model.mobiliario.find((f) => f.id === selected);
  return (
    <aside
      className="inspector architecture-inspector"
      aria-label="Información del espacio"
    >
      <div className="inspector-heading">
        <span className="eyebrow">EL ESTUDIO, EN DETALLE</span>
        <Icon name="layers" size={18} />
      </div>
      {item ? (
        <div className="selected-details" aria-live="polite">
          <span className="object-tag">
            {evidenceLabels[item.evidencia.tipo]}
          </span>
          <h2>{item.nombre}</h2>
          <p>{item.notas}</p>
          {furniture && (
            <button
              className="subtle-button drawing-button"
              onClick={onOpenDrawing}
            >
              Ver plano técnico ↗
            </button>
          )}
          <dl>
            {[
              ["Identificador", item.id],
              ["Zona", item.zona],
              [
                "Dimensiones locales · ancho / alto / fondo",
                item.dimensiones.every((d) => d > 0)
                  ? item.dimensiones.map((d) => d.toFixed(2)).join(" × ") + " m"
                  : "Punto sin volumen",
              ],
              [
                "Posición · X / Y / Z",
                item.posicion.map((d) => d.toFixed(2)).join(" / ") + " m",
              ],
              [
                "Orientación Y",
                ((item.rotacion * 180) / Math.PI).toFixed(0) + "°",
              ],
              ["Material provisional", item.material],
              ...(furniture
                ? [
                    ["Cantidad", String(furniture.cantidad)],
                    [
                      "Adquisición",
                      acquisitionLabels[furniture.tipoAdquisicion],
                    ],
                    ["Uso sanitario", furniture.usoSanitario ?? "No asignado"],
                    ["Unitario COP", money(furniture.costoUnitario)],
                    ["Subtotal COP", money(lineSubtotal(furniture))],
                    [
                      "Conexión eléctrica",
                      furniture.requiereElectricidad
                        ? "Prevista; validar diseño eléctrico"
                        : "No prevista en esta ficha",
                    ],
                  ]
                : []),
              ["Estado de verificación", item.estado],
              ["Trazabilidad", item.evidencia.fuente],
            ].map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <button className="text-button" onClick={() => onSelect(null)}>
            Cerrar selección ×
          </button>
        </div>
      ) : (
        <>
          <h2>
            Un mismo espacio.
            <br />
            <em>Dos maneras de verlo.</em>
          </h2>
          <p className="inspector-intro">
            Selecciona en 2D o 3D. La ficha y el identificador se mantienen al
            cambiar de vista.
          </p>
          {selected && (
            <p role="status">El objeto ya no existe en este escenario.</p>
          )}
          <div className="space-list architecture-space-list">
            {model.espacios.map((space, i) => (
              <button
                key={space.id}
                className="space-item"
                onClick={() => onSelect(space.id)}
              >
                <span
                  className="space-number"
                  style={{
                    backgroundColor: space.color + "20",
                    color: space.color,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{space.nombre}</strong>
                  <small>
                    {space.reserva
                      ? "Reserva por verificar"
                      : `${space.dimensiones[0].toFixed(2)} × ${space.dimensiones[2].toFixed(2)} m`}
                  </small>
                </span>
                <Icon name="arrow" size={14} />
              </button>
            ))}
          </div>
        </>
      )}
      <div className="selection-help">
        <Icon name="info" size={18} />
        <span>
          Geometría hipotética. Sin costos, medidas reales ni cumplimiento
          certificados.
        </span>
      </div>
    </aside>
  );
}

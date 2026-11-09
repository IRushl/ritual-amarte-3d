import { useState } from "react";
import type { Architecture } from "../types/studio";
import { acquisitionLabels, money } from "../architecture/budget";
import {
  projectBudget,
  projectBudgetSummary,
  budgetCategories,
  budgetSubtotal,
} from "../architecture/projectBudget";
export function Budget({
  model,
  onInspect,
}: {
  model: Architecture;
  onInspect: (id: string) => void;
}) {
  const [filter, setFilter] = useState("all"),
    allItems = projectBudget(model),
    summary = projectBudgetSummary(allItems);
  const items = allItems.filter(
    (f) => filter === "all" || f.categoria === filter,
  );
  return (
    <section className="budget-panel">
      <div className="budget-summary">
        <div>
          <span>PARTIDAS DEL PROYECTO</span>
          <strong>{summary.lines}</strong>
          <small>
            {summary.quantitiesPending} partidas con cantidad por definir
          </small>
        </div>
        <div>
          <span>PENDIENTES DE COTIZACIÓN</span>
          <strong>{summary.pending}</strong>
          <small>No se han incorporado precios</small>
        </div>
        <div>
          <span>TOTAL COTIZADO</span>
          <strong>{money(summary.known)}</strong>
          <small>
            {summary.complete ? "Datos completos" : "Presupuesto incompleto"}
          </small>
        </div>
      </div>
      <p className="assumption-banner">
        Estructura preliminar, sin cotizaciones reales. Los importes
        desconocidos no se convierten en cero. No incluye todavía obra,
        arriendo, honorarios, impuestos, transporte ni contingencias.
      </p>
      <div className="section-title">
        <h2>Presupuesto para desarrollar</h2>
        <label className="budget-filter">
          Categoría{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todas</option>
            {budgetCategories.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="budget-scroll">
        <table>
          <thead>
            <tr>
              <th>Elemento / código</th>
              <th>Categoría</th>
              <th>Adquisición</th>
              <th>Cant.</th>
              <th>Unitario COP</th>
              <th>Subtotal COP</th>
              <th>Verificación</th>
              <th>Ficha</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f) => (
              <tr key={f.id}>
                <td>
                  <strong>{f.nombre}</strong>
                  <small>{f.id}</small>
                  <details>
                    <summary>Alcance y notas</summary>
                    <p>{f.notas}</p>
                  </details>
                </td>
                <td>{f.categoria}</td>
                <td>
                  {
                    acquisitionLabels[
                      f.origen as keyof typeof acquisitionLabels
                    ]
                  }
                </td>
                <td>
                  {f.cantidad === null
                    ? "Por definir"
                    : `${f.cantidad} ${f.unidad}`}
                </td>
                <td>{money(f.costoUnitario)}</td>
                <td>{money(budgetSubtotal(f))}</td>
                <td>{f.estadoVerificacion}</td>
                <td>
                  {f.elementoId ? (
                    <button
                      className="subtle-button"
                      onClick={() => onInspect(f.elementoId!)}
                    >
                      Ver elemento
                    </button>
                  ) : (
                    <span>Sin geometría</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <p role="status">No hay elementos en esta categoría.</p>
      )}
      <p className="plan-help">
        Compra/fabricación son propuestas, no órdenes de adquisición. Las fichas
        individuales muestran dimensiones de envolvente y materiales por
        verificar.
      </p>
    </section>
  );
}

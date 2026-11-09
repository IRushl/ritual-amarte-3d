import { test } from "node:test";
import assert from "node:assert/strict";
import { createArchitecture } from "../src/data/studio";
import {
  budgetSummary,
  lineSubtotal,
  electricalSummary,
} from "../src/architecture/budget";
import { renderFurnitureSheet } from "../src/plan/renderFurniture";
import { defaultPlanLayers, renderPlan } from "../src/plan/renderPlan";
import { inspectEntity } from "../src/architecture/inspection";

test("Programa ampliado mantiene recepción, espera, 3 manicure, 2 pedicure y baño con puerta y dotación", () => {
  const m = createArchitecture();
  assert.equal(m.local.ancho, 12);
  assert.equal(m.local.fondo, 8);
  assert.equal(
    m.estaciones.filter((s) => s.espacioId === "manicure").length,
    3,
  );
  assert.equal(
    m.estaciones.filter((s) => s.espacioId === "pedicure").length,
    2,
  );
  for (const id of [
    "recepcion",
    "espera",
    "almacen",
    "asepsia",
    "aseo",
    "sanitario",
    "circulacion",
    "acceso",
  ])
    assert.ok(m.espacios.some((s) => s.id === id));
  assert.ok(m.huecos.some((o) => o.id === "p-reserva" && o.tipo === "puerta"));
  assert.ok(m.mobiliario.some((f) => f.categoria === "sanitario"));
});
test("Costos faltantes no se convierten en cero; presupuesto conocido se distingue del completo", () => {
  const m = createArchitecture();
  assert.equal(lineSubtotal({ cantidad: 3, costoUnitario: null }), null);
  assert.equal(budgetSummary(m.mobiliario).known, null);
  assert.equal(budgetSummary(m.mobiliario).complete, false);
  const synthetic = [
    { ...m.mobiliario[0], cantidad: 2, costoUnitario: 7 },
    m.mobiliario[1],
  ];
  assert.equal(budgetSummary(synthetic).known, 14);
  assert.equal(budgetSummary(synthetic).complete, false);
  assert.equal(lineSubtotal({ cantidad: 1, costoUnitario: 0 }), 0);
});
test("Fichas prioritarias usan mismas dimensiones y código con tres proyecciones y estado por cotizar", () => {
  const m = createArchitecture();
  for (const id of [
    "recepcion-01",
    "mesa-01",
    "esmaltes-01",
    "pedicure-01",
    "espera-01",
    "maquillaje-01",
  ]) {
    const f = m.mobiliario.find((f) => f.id === id)!;
    const svg = renderFurnitureSheet(f);
    for (const label of [
      "SUPERIOR",
      "FRONTAL",
      "LATERAL",
      f.id,
      "Por cotizar",
      "No es un plano de taller",
    ])
      assert.ok(svg.includes(label));
    for (const dim of f.dimensiones)
      assert.ok(svg.includes(dim.toFixed(2) + " m"));
    assert.ok(!svg.includes("NaN"));
    assert.ok(!svg.includes("undefined"));
  }
});
test("Eléctricos separan tomas, luz y reserva y vinculan todos los consumidores", () => {
  const m = createArchitecture(),
    summary = electricalSummary(m);
  assert.equal(summary.points, 17);
  assert.equal(summary.outlets, 12);
  assert.equal(summary.light, 4);
  assert.equal(summary.reserve, 1);
  for (const f of m.mobiliario.filter((f) => f.requiereElectricidad))
    assert.ok(
      m.puntosTecnicos.some(
        (p) => p.tipo === "energia" && p.elementosIds.includes(f.id),
      ),
      f.id,
    );
  assert.ok(
    !renderPlan(m, { ...defaultPlanLayers, electrical: false }).includes(
      'data-entity-id="e-mani-01"',
    ),
  );
  assert.ok(
    renderPlan(m, { ...defaultPlanLayers, electrical: true }).includes(
      'data-entity-id="e-mani-01"',
    ),
  );
});
test("Señales y branding propios son inspeccionables y no afirman habilitación", () => {
  const m = createArchitecture();
  assert.equal(m.marca.nombre, "Ritual Amarte");
  for (const s of m.senales) {
    assert.equal(inspectEntity(m, s.id)?.id, s.id);
    assert.notEqual(s.evidencia.tipo, "hecho-documentado");
  }
  assert.ok(m.senales.some((s) => s.texto === "BAÑO"));
  assert.ok(
    m.senales.some(
      (s) => s.tipo === "seguridad" && s.notas.includes("conceptual"),
    ),
  );
});

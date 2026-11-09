import { test } from "node:test";
import assert from "node:assert/strict";
import { createArchitecture } from "../src/data/studio";
import {
  projectBudget,
  budgetCategories,
  budgetSubtotal,
  projectBudgetSummary,
} from "../src/architecture/projectBudget";
import {
  renderPlan,
  exportPlanSvg,
  defaultPlanLayers,
} from "../src/plan/renderPlan";

test("R3: bienvenida frontal, spa posterior, maquillaje mural y apoyos sin recintos fragmentados", () => {
  const m = createArchitecture();
  assert.equal(
    m.estaciones.filter((s) => s.espacioId === "maquillaje").length,
    2,
  );
  assert.equal(
    m.mobiliario.filter((f) => f.categoria === "maquillaje").length,
    2,
  );
  assert.ok(
    m.mobiliario.find((f) => f.id === "recepcion-01")!.posicion[2] > 2.5,
  );
  assert.ok(
    m.mobiliario
      .filter((f) => f.categoria === "pedicure")
      .every((f) => f.posicion[2] < -2),
  );
  assert.ok(m.mobiliario.find((f) => f.id === "espera-01")!.dimensiones[0] > 2);
  assert.ok(m.mobiliario.find((f) => f.id === "espejo-bano")!.posicion[1] > 1);
  assert.equal(m.muros.filter((w) => w.grupo === "interior").length, 2);
  for (const id of ["asepsia-01", "poceta-01", "apoyo-01", "almacen-01"])
    assert.ok(m.mobiliario.some((f) => f.id === id));
});
test("Presupuesto extendido: cantidades desconocidas, categorías y enlaces sin doble inventario", () => {
  const m = createArchitecture(),
    items = projectBudget(m);
  assert.equal(new Set(items.map((i) => i.id)).size, items.length);
  for (const c of budgetCategories)
    assert.ok(
      items.some((i) => i.categoria === c),
      c,
    );
  for (const f of m.mobiliario)
    assert.equal(items.filter((i) => i.elementoId === f.id).length, 1);
  assert.ok(items.some((i) => i.cantidad === null));
  assert.ok(items.every((i) => i.costoUnitario === null));
  assert.equal(projectBudgetSummary(items).known, null);
  assert.equal(
    budgetSubtotal({ ...items[0], cantidad: null, costoUnitario: 100 }),
    null,
  );
  assert.equal(
    budgetSubtotal({ ...items[0], cantidad: 2, costoUnitario: 100 }),
    200,
  );
});
test("Lámina general conserva cuadro, notas, códigos y cotas en exportación", () => {
  const m = createArchitecture(),
    svg = exportPlanSvg(m, defaultPlanLayers);
  for (const text of [
    "A-01",
    "CUADRO DE MOBILIARIO",
    "NOTAS DE DISEÑO",
    "maquillaje-01",
    "NO ES PLANO CONSTRUCTIVO",
    "12.00 m",
  ])
    assert.ok(svg.includes(text));
  assert.ok(!renderPlan(m).includes("BlackForge"));
  m.mobiliario[0].nombre = "<script>no</script>";
  assert.ok(!renderPlan(m).includes("<script>"));
});

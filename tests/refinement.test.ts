import { test } from "node:test";
import assert from "node:assert/strict";
import { createArchitecture } from "../src/data/studio";
import { floorConflicts, footprint } from "../src/architecture/geometry";
import { projectBudget } from "../src/architecture/projectBudget";

test("R3 conserva arquitectura y servicios base, retira solo tercer maquillaje", () => {
  const m = createArchitecture();
  assert.equal(m.huecos.filter((h) => h.tipo === "ventana").length, 2);
  assert.equal(m.muros.length, 6);
  assert.equal(
    m.estaciones.filter((s) => s.espacioId === "manicure").length,
    3,
  );
  assert.equal(
    m.estaciones.filter((s) => s.espacioId === "pedicure").length,
    2,
  );
  assert.equal(
    m.estaciones.filter((s) => s.espacioId === "maquillaje").length,
    2,
  );
  assert.ok(
    !m.mobiliario.some(
      (f) => f.id === "maquillaje-03" || f.id === "silla-maquillaje-03",
    ),
  );
  assert.ok(
    !m.puntosTecnicos.some((p) => p.elementosIds.includes("maquillaje-03")),
  );
  assert.ok(!("panel" in m.acabados));
  assert.deepEqual(
    m.mobiliario.find((f) => f.id === "mesa-01")!.posicion,
    [-3.65, 0, -1.3],
  );
  assert.deepEqual(
    m.mobiliario.find((f) => f.id === "pedicure-01")!.posicion,
    [-0.6, 0, -2.6],
  );
  assert.ok(m.huecos.some((h) => h.id === "p-reserva"));
});
test("Recepción girada, dos sofás y dos pantallas suspendidas conectadas sin solapes", () => {
  const m = createArchitecture(),
    desk = m.mobiliario.find((f) => f.id === "recepcion-01")!;
  assert.equal(desk.rotacion[1], -Math.PI / 2);
  assert.ok(m.mobiliario.some((f) => f.id === "silla-recepcion"));
  assert.equal(
    m.mobiliario.filter(
      (f) => f.espacioId === "espera" && f.categoria === "asiento",
    ).length,
    2,
  );
  const screens = m.mobiliario.filter((f) => f.categoria === "pantalla");
  assert.equal(screens.length, 2);
  for (const f of screens) {
    assert.ok(f.posicion[1] > 1.5);
    assert.ok(
      f.espacioId === "pedicure" && f.pantalla?.montaje === "suspendido",
    );
    assert.ok(m.puntosTecnicos.some((p) => p.elementosIds.includes(f.id)));
    assert.equal(
      projectBudget(m).filter((p) => p.elementoId === f.id).length,
      1,
    );
  }
  assert.deepEqual(floorConflicts(m), []);
  // A rotated counter and its diagonal chair are disjoint even though their AABBs intersect.
  const chair = m.mobiliario.find((f) => f.id === "silla-recepcion")!;
  assert.equal(footprint(desk).length, 4);
  chair.posicion = [...desk.posicion];
  assert.ok(floorConflicts(m).includes("recepcion-01 / silla-recepcion"));
});

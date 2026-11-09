import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createArchitecture, cameraPresetsFor } from "../src/data/studio";
import { floorConflicts } from "../src/architecture/geometry";
import { exportPlanSvg, defaultPlanLayers } from "../src/plan/renderPlan";
import type { Architecture } from "../src/types/studio";
const before = JSON.parse(
  fs.readFileSync(
    new URL("./fixtures/r3-layout.json", import.meta.url),
    "utf8",
  ),
) as Architecture;
test("R4 conserva huecos, muros, zonas y geometría de todos los muebles no intervenidos", () => {
  const m = JSON.parse(
    fs.readFileSync(
      new URL("./fixtures/r4-layout.json", import.meta.url),
      "utf8",
    ),
  ) as Architecture;
  assert.deepEqual(m.local, before.local);
  assert.deepEqual(m.huecos, before.huecos);
  assert.deepEqual(m.muros, before.muros);
  assert.deepEqual(m.espacios, before.espacios);
  const changed = [
    "recepcion-01",
    "silla-recepcion",
    "pantalla-01",
    "pantalla-02",
    "lampara-central",
  ];
  assert.equal(m.mobiliario.length, before.mobiliario.length);
  for (const f of m.mobiliario.filter((f) => !changed.includes(f.id))) {
    const old = before.mobiliario.find((o) => o.id === f.id)!;
    assert.deepEqual(
      [f.posicion, f.rotacion, f.dimensiones],
      [old.posicion, old.rotacion, old.dimensiones],
    );
  }
  assert.deepEqual(floorConflicts(m), []);
});
test("Pantallas 16:9, vínculos eléctricos y giro adicional de recepción", () => {
  const m = createArchitecture(),
    desk = m.mobiliario.find((f) => f.id === "recepcion-01")!,
    old = before.mobiliario.find((f) => f.id === desk.id)!;
  assert.equal(desk.rotacion[1] - old.rotacion[1], -Math.PI / 4);
  for (const tv of m.mobiliario.filter((f) => f.pantalla)) {
    assert.equal(tv.pantalla!.ancho / tv.pantalla!.alto, 16 / 9);
    assert.ok(
      Math.abs(
        Math.hypot(tv.pantalla!.ancho, tv.pantalla!.alto) / 0.0254 - 55,
      ) < 0.1,
    );
    assert.ok(m.puntosTecnicos.some((p) => p.elementosIds.includes(tv.id)));
  }
  const chair = m.mobiliario.find((f) => f.id === "silla-recepcion")!;
  assert.ok(chair.posicion[0] > desk.posicion[0]);
});
test("Fachada comparte muro y acceso existente; encuadres exteriores físicamente fuera", () => {
  const m = createArchitecture(),
    v = cameraPresetsFor(m);
  assert.ok(m.muros.some((w) => w.id === m.fachada.muroId));
  assert.equal(m.evacuacion.salidaId, "p-acceso");
  for (const key of ["fachada", "fachada-perspectiva", "acceso-cerca"] as const)
    assert.ok(v[key].posicion[2] > m.local.fondo / 2);
  assert.ok(v["hacia-entrada"].posicion[2] < m.local.fondo / 2);
  const svg = exportPlanSvg(m, { ...defaultPlanLayers, signage: true });
  assert.ok(svg.includes("s-extintor"));
  assert.ok(svg.includes("s-botiquin"));
  assert.ok(svg.includes("polyline"));
});

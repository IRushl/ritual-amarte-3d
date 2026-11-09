import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createArchitecture } from "../src/data/studio";
import {
  floorConflicts,
  cabinetOpeningConflicts,
  validateArchitecture,
} from "../src/architecture/geometry";
import { renderFurnitureSheet } from "../src/plan/renderFurniture";
import { exportPlanSvg, defaultPlanLayers } from "../src/plan/renderPlan";
import type { Architecture } from "../src/types/studio";
const before = JSON.parse(
  fs.readFileSync(
    new URL("./fixtures/r4-layout.json", import.meta.url),
    "utf8",
  ),
) as Architecture;
test("R5 conserva todos los elementos protegidos de R4", () => {
  const m = JSON.parse(
    fs.readFileSync(
      new URL("./fixtures/r7-layout.json", import.meta.url),
      "utf8",
    ),
  ) as Architecture;
  for (const k of [
    "local",
    "muros",
    "fachada",
    "senales",
    "evacuacion",
    "acabados",
  ] as const)
    if (k !== "senales")
      assert.deepEqual(JSON.parse(JSON.stringify(m[k])), before[k]);
  assert.deepEqual(
    m.estaciones.map(({ enlaces, ...s }) => ({
      ...s,
      mobiliarioIds: s.mobiliarioIds.filter(
        (id) => !id.startsWith("taburete-pedicure-"),
      ),
    })),
    before.estaciones.map(({ enlaces, ...s }) => s),
  );
  const changed = [
    "almacen-01",
    "almacen-02",
    "apoyo-01",
    "asepsia-01",
    "poceta-01",
    "pantalla-01",
    "pantalla-02",
    "lampara-central",
  ];
  for (const f of before.mobiliario.filter(
    (f) => !changed.includes(f.id) && f.id !== "arte-01",
  )) {
    const n = m.mobiliario.find((n) => n.id === f.id)!;
    assert.ok(n, f.id);
    assert.deepEqual(
      [n.posicion, n.rotacion, n.dimensiones],
      [f.posicion, f.rotacion, f.dimensiones],
      f.id,
    );
  }
  assert.deepEqual(
    m.huecos,
    before.huecos.filter((o) => o.id !== "v-lateral"),
  );
  assert.ok(!m.mobiliario.some((f) => f.id === "arte-01"));
});
test("Armarios sin solapes ni interferencia de apertura en ambos escenarios R6", () => {
  const m = createArchitecture();
  assert.deepEqual(validateArchitecture(m), []);
  assert.deepEqual(floorConflicts(m), []);
  assert.deepEqual(cabinetOpeningConflicts(m), []);
  assert.deepEqual(cabinetOpeningConflicts(createArchitecture(10, 8)), []);
  const cabinet = m.mobiliario.find((f) => f.id === "almacen-02")!;
  assert.equal(cabinet.rotacion[1], 0);
});
test("R5 cuatro funciones hidráulicas independientes y apoyo limpio sin residuos", () => {
  const m = createArchitecture();
  for (const [id, usage] of [
    ["asepsia-01", "instrumental"],
    ["poceta-01", "aseo"],
    ["lavabo-01", "manos-clientas"],
    ["lavamanos-personal", "manos-personal"],
  ]) {
    const f = m.mobiliario.find((f) => f.id === id)!;
    assert.equal(f.usoSanitario, usage);
    for (const tipo of ["agua", "desague"]) {
      const p = m.puntosTecnicos.find(
        (p) => p.tipo === tipo && p.elementosIds.includes(id),
      )!;
      assert.ok(p, id + tipo);
      assert.equal(p.posicion[0], f.posicion[0]);
      assert.equal(p.posicion[2], f.posicion[2]);
    }
  }
  assert.equal(
    m.mobiliario.find((f) => f.id === "apoyo-01")!.usoSanitario,
    "apoyo-limpio",
  );
  assert.ok(
    !m.puntosTecnicos.some(
      (p) => p.tipo === "residuos" && p.elementosIds.includes("apoyo-01"),
    ),
  );
});
test("R5 pantallas enfrentan ambos sillones y mantienen relación 16:9", () => {
  const m = createArchitecture(),
    tvs = m.mobiliario.filter((f) => f.pantalla);
  assert.equal(tvs.length, 2);
  for (const tv of tvs) {
    assert.equal(tv.pantalla!.ancho / tv.pantalla!.alto, 16 / 9);
    assert.equal(tv.posicion[1] + tv.dimensiones[1], m.local.alto);
    for (const chair of m.mobiliario.filter(
      (f) => f.categoria === "pedicure",
    )) {
      const dx = chair.posicion[0] - tv.posicion[0],
        dz = chair.posicion[2] - tv.posicion[2];
      assert.ok(
        dx * Math.sin(tv.rotacion[1]) + dz * Math.cos(tv.rotacion[1]) > 0,
      );
      assert.ok(Math.atan2(Math.abs(dx), Math.abs(dz)) < Math.PI / 3);
    }
  }
});
test("R5 todas las láminas son autocontenidas, acotadas y sin detalles ficticios", () => {
  const m = createArchitecture();
  for (const f of m.mobiliario) {
    const svg = renderFurnitureSheet(f);
    for (const n of f.dimensiones) assert.ok(svg.includes(n.toFixed(2) + " m"));
    for (const text of [
      "SUPERIOR",
      "FRONTAL",
      "LATERAL",
      "ISOMETRÍA",
      "Despiece pendiente de desarrollo",
      "Sin escala",
      "R5",
    ])
      assert.ok(svg.includes(text));
    assert.ok(!/NaN|undefined|foreignObject|<image/.test(svg));
  }
  const svg = exportPlanSvg(m, defaultPlanLayers);
  assert.ok(!/NaN|undefined/.test(svg));
  assert.ok(!svg.includes("v-lateral"));
  assert.ok(svg.includes("lavamanos-personal"));
  const malicious = {
    ...m.mobiliario[0],
    nombre: "<script>malicioso</script>",
  };
  assert.ok(!renderFurnitureSheet(malicious).includes("<script>"));
});

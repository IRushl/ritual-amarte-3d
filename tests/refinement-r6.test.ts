import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createArchitecture } from "../src/data/studio";
import { peopleFor } from "../src/architecture/people";
import { sceneLabels, technicalFurnitureIds } from "../src/architecture/labels";
import {
  floorConflicts,
  cabinetOpeningConflicts,
} from "../src/architecture/geometry";
import type { Architecture, ViewVisibility } from "../src/types/studio";
const prior = JSON.parse(
  fs.readFileSync(
    new URL("./fixtures/r5-layout.json", import.meta.url),
    "utf8",
  ),
) as Architecture;
const normalize = (v: unknown) => JSON.parse(JSON.stringify(v));
test("R6 preserva arquitectura, distribución, materiales, conexiones y mobiliario salvo giro autorizado", () => {
  const m = JSON.parse(
    fs.readFileSync(
      new URL("./fixtures/r6-layout.json", import.meta.url),
      "utf8",
    ),
  ) as Architecture;
  for (const key of [
    "local",
    "muros",
    "huecos",
    "espacios",
    "fachada",
    "evacuacion",
    "materiales",
    "acabados",
    "puntosTecnicos",
  ] as const)
    assert.deepEqual(normalize(m[key]), prior[key], key);
  for (const f of m.mobiliario) {
    const old = prior.mobiliario.find((o) => o.id === f.id)!;
    assert.deepEqual(f.dimensiones, old.dimensiones);
    assert.deepEqual(f.posicion, old.posicion);
    if (f.id !== "almacen-02") assert.deepEqual(f.rotacion, old.rotacion);
    assert.equal(f.costoUnitario, old.costoUnitario);
  }
  for (const s of m.senales.filter(
    (s) => !["s-asepsia", "s-tecnico"].includes(s.id),
  ))
    assert.deepEqual(
      normalize(s),
      prior.senales.find((o) => o.id === s.id),
    );
});
test("Armarios uniformes y barridos libres en 12x8 y 10x8", () => {
  for (const width of [12, 10]) {
    const m = createArchitecture(width, 8);
    assert.deepEqual(floorConflicts(m), []);
    assert.deepEqual(cabinetOpeningConflicts(m), []);
    assert.equal(
      m.mobiliario.find((f) => f.id === "almacen-02")!.rotacion[1],
      m.mobiliario.find((f) => f.id === "almacen-01")!.rotacion[1],
    );
  }
});
test("Nueve personas, roles moderados y asientos anclados a los muebles existentes", () => {
  const m = createArchitecture(),
    p = peopleFor(m);
  assert.equal(p.length, 9);
  assert.equal(p.filter((p) => p.role === "profesional").length, 4);
  assert.equal(p.filter((p) => p.walking).length, 2);
  for (const a of p.filter((a) => a.seated)) {
    assert.ok(m.mobiliario.some((f) => f.id === a.hostId));
    assert.ok(a.activity.length > 5);
  }
});
test("Etiquetas técnicas completas y únicas con nombres legibles", () => {
  const m = createArchitecture(),
    v = { technical: true, labels: true, electrical: true } as ViewVisibility;
  const l = sceneLabels(m, v);
  assert.equal(l.length, new Set(l.map((x) => x.id)).size);
  for (const id of technicalFurnitureIds) {
    const label = l.find((l) => l.id === id)!;
    assert.ok(label);
    assert.equal(label.text, m.mobiliario.find((f) => f.id === id)!.nombre);
  }
  for (const z of ["tecnico", "asepsia", "aseo", "sanitario", "almacen"])
    assert.ok(l.some((l) => l.id === z));
  for (const p of m.puntosTecnicos)
    assert.ok(l.find((l) => l.id === p.id)!.text.includes(p.nombre));
});

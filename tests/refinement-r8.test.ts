import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { createArchitecture, cameraPresetsFor } from "../src/data/studio";
import { projectBudget } from "../src/architecture/projectBudget";
import { peopleFor, walkingPose } from "../src/architecture/people";
import {
  openingFrame,
  validateArchitecture,
  wallSegments,
} from "../src/architecture/geometry";
import { renderFurnitureSheet } from "../src/plan/renderFurniture";
import { exportPlanSvg, defaultPlanLayers } from "../src/plan/renderPlan";
import type { Architecture } from "../src/types/studio";
const old = JSON.parse(
  fs.readFileSync(
    new URL("./fixtures/r7-layout.json", import.meta.url),
    "utf8",
  ),
) as Architecture;
const normalize = (o: unknown) =>
  JSON.parse(
    JSON.stringify(o, (key, value) =>
      key === "versionIds" ? undefined : value,
    ),
  );
test("R8 conserva íntegros interior, mobiliario, estaciones, redes, personas y presupuesto R7", () => {
  const m = createArchitecture();
  for (const key of [
    "local",
    "muros",
    "espacios",
    "mobiliario",
    "estaciones",
    "puntosTecnicos",
    "evacuacion",
    "materiales",
    "acabados",
  ] as const)
    assert.deepEqual(normalize(m[key]), normalize(old[key]), key);
  assert.deepEqual(projectBudget(m), projectBudget(old));
  assert.deepEqual(peopleFor(m), peopleFor(old));
  for (const id of ["recorrido", "apoyo"])
    for (const t of [0, 10, 25, 60, 120])
      assert.deepEqual(walkingPose(t, m, id), walkingPose(t, old, id));
  for (const s of m.senales.filter(
    (s) => !["s-fachada", "s-descriptor"].includes(s.id),
  ))
    assert.deepEqual(
      normalize(s.id === "s-marca" ? { ...s, posicion: undefined, dimensiones: undefined } : s),
      normalize(s.id === "s-marca" ? { ...old.senales.find((o) => o.id === s.id), posicion: undefined, dimensiones: undefined } : old.senales.find((o) => o.id === s.id)),
    );
  for (const f of m.mobiliario)
    assert.equal(
      renderFurnitureSheet(f),
      renderFurnitureSheet(old.mobiliario.find((o) => o.id === f.id)!),
    );
  const camera = cameraPresetsFor(m),
    previous = cameraPresetsFor(old);
  for (const view of [
    "interior",
    "aerea",
    "planta",
    "pedicure",
    "hacia-entrada",
  ] as const)
    assert.deepEqual(camera[view], previous[view]);
});
test("Vitrina comparte huecos con planta, acceso intacto y maceteros apoyados fuera del recorrido", () => {
  for (const width of [10, 12, 16])
    for (const depth of [8, 14]) {
      const m = createArchitecture(width, depth),
        wall = m.muros.find((w) => w.id === m.fachada.muroId)!;
      assert.deepEqual(validateArchitecture(m), []);
      const door = m.huecos.find((o) => o.id === "p-acceso")!,
        frame = openingFrame(wall, door);
      assert.ok(Math.abs(frame.start[0] + 0.7) < 1e-9);
      assert.equal(door.ancho, 1.4);
      assert.equal(door.alto, 2.5);
      assert.equal(door.antepecho, 0);
      const windows = m.huecos.filter(
        (o) => o.tipo === "ventana" && o.muroId === wall.id,
      );
      assert.equal(windows.length, 2);
      for (const win of windows) {
        assert.equal(win.antepecho, 0);
        assert.equal(win.alto, door.alto);
        assert.ok(win.ancho > 3.8);
      }
      assert.ok(
        Math.abs(m.fachada.alturaTotal! - m.fachada.altoFriso - door.alto) <
          1e-9,
      );
      for (const plant of m.fachada.maceteros!) {
        assert.equal(plant.posicion[1], 0);
        assert.ok(plant.posicion[2] - plant.dimensiones[2] / 2 > depth / 2);
        assert.ok(
          plant.posicion[2] + plant.dimensiones[2] / 2 <
            depth / 2 + m.fachada.pavimento!.profundidad,
        );
        assert.ok(
          Math.abs(plant.posicion[0]) - plant.dimensiones[0] / 2 >
            door.ancho / 2 + 0.3,
        );
      }
      // No opaque segment in either window, at eye height; same wall solids feed both views.
      for (const win of windows) {
        const center = openingFrame(wall, win).start[0] + win.ancho / 2;
        assert.ok(
          !wallSegments(wall, m.huecos).some(
            (s) =>
              Math.abs(s.posicion[0] - center) < s.dimensiones[0] / 2 &&
              Math.abs(s.posicion[1] - 1.5) < s.dimensiones[1] / 2,
          ),
        );
      }
      const svg = exportPlanSvg(m, { ...defaultPlanLayers, signage: true });
      assert.ok(svg.includes("NAIL STUDIO EXPERIENCE"));
      assert.ok(svg.includes("macetero-exterior-oeste"));
      assert.ok(svg.includes("p-acceso"));
    }
  assert.deepEqual(
    createArchitecture().huecos.find((o) => o.id === "p-acceso"),
    old.huecos.find((o) => o.id === "p-acceso"),
  );
  assert.deepEqual(
    createArchitecture().huecos.find((o) => o.id === "p-reserva"),
    old.huecos.find((o) => o.id === "p-reserva"),
  );
});
test("Fuente de marca original conservada byte por byte, sin reemplazo tipográfico", () => {
  const b = fs.readFileSync(
    new URL("../public/brand/ritual-amarte-original.png", import.meta.url),
  );
  assert.equal(
    crypto.createHash("sha256").update(b).digest("hex"),
    "75c56d35b00cb6f3a6fd38f9e8e8d7224eb18e5ef34bd5c1f044d11adcf15207",
  );
  assert.equal(b.readUInt32BE(16), 1448);
  assert.equal(b.readUInt32BE(20), 1086);
  assert.equal(b[25], 2);
});

test("Branding interior: marca centrada sobre Pedicure y separada del rótulo", () => {
  for (const width of [10,12,16]) for (const depth of [8,14]) {
    const model = createArchitecture(width,depth);
    const mark = model.senales.find(s => s.id === "s-marca")!;
    const zone = model.senales.find(s => s.id === "s-pedi")!;
    assert.equal(mark.posicion[0], zone.posicion[0]);
    assert.ok(mark.posicion[1] - mark.dimensiones[1]/2 > zone.posicion[1] + zone.dimensiones[1]/2 + 0.1);
    assert.ok(mark.posicion[1] + mark.dimensiones[1]/2 < model.local.alto);
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createArchitecture } from "../src/data/studio";
import { peopleFor, walkingPose } from "../src/architecture/people";
import {
  floorConflicts,
  validateArchitecture,
  wallSegments,
} from "../src/architecture/geometry";
import { exportPlanSvg, defaultPlanLayers } from "../src/plan/renderPlan";
import type { Architecture } from "../src/types/studio";
const prior = JSON.parse(
  fs.readFileSync(
    new URL("./fixtures/r6-layout.json", import.meta.url),
    "utf8",
  ),
) as Architecture;
const json = (v: unknown) =>
  JSON.parse(
    JSON.stringify(v).replaceAll("ritual-refinado-r7", "ritual-refinado-r6"),
  );
test("R7 conserva layout R6 completo salvo sustitución de luminaria", () => {
  const m = JSON.parse(
    fs.readFileSync(
      new URL("./fixtures/r7-layout.json", import.meta.url),
      "utf8",
    ),
  ) as Architecture;
  assert.deepEqual(
    json(
      m.estaciones.map((s) => ({
        ...s,
        mobiliarioIds: s.mobiliarioIds.filter(
          (id) => !id.startsWith("taburete-pedicure-"),
        ),
      })),
    ),
    prior.estaciones,
  );
  for (const k of [
    "local",
    "muros",
    "huecos",
    "espacios",
    "senales",
    "fachada",
    "evacuacion",
    "materiales",
    "acabados",
  ] as const)
    assert.deepEqual(json(m[k]), prior[k], k);
  for (const old of prior.mobiliario.filter(
    (f) => f.id !== "lampara-central",
  )) {
    const f = m.mobiliario.find((f) => f.id === old.id)!;
    assert.ok(f, old.id);
    for (const k of [
      "posicion",
      "rotacion",
      "dimensiones",
      "material",
      "cantidad",
      "costoUnitario",
    ] as const)
      assert.deepEqual(json(f[k]), old[k], old.id + " " + k);
  }
  assert.ok(!m.mobiliario.some((f) => f.id === "lampara-central"));
  for (const old of prior.puntosTecnicos.filter(
    (p) => p.id !== "e-luz-central",
  ))
    assert.deepEqual(json(m.puntosTecnicos.find((p) => p.id === old.id)), old);
});
test("Dos suspensiones, dos taburetes y decoración sincronizados sin precios inventados", () => {
  for (const width of [10, 12, 16])
    for (const depth of [8, 14]) {
      const m = createArchitecture(width, depth);
      assert.deepEqual(validateArchitecture(m), []);
      assert.deepEqual(floorConflicts(m), []);
      assert.equal(
        m.mobiliario.filter((f) => f.id.startsWith("luminaria-")).length,
        2,
      );
      const svg = exportPlanSvg(m, defaultPlanLayers);
      for (const f of m.mobiliario.filter(
        (f) => !prior.mobiliario.some((p) => p.id === f.id),
      )) {
        assert.equal(f.costoUnitario, null);
        assert.ok(svg.includes(f.id));
      }
      for (const n of ["01", "02"]) {
        const f = m.mobiliario.find((f) => f.id === "taburete-pedicure-" + n)!;
        assert.equal(f.dimensiones[1], 0.5);
      }
    }
  const p = peopleFor(createArchitecture()).find(
    (p) => p.id === "asistente-spa",
  )!;
  assert.ok(p.seated);
  assert.equal(p.hostId, "taburete-pedicure-02");
});
test("Flujos continuos: muebles, muros, vano de entrada y separación entre personas", () => {
  for (const width of [10, 12, 16])
    for (const depth of [8, 14]) {
      const m = createArchitecture(width, depth),
        people = peopleFor(m);
      const solids = [
        ...m.mobiliario
          .filter((f) => f.posicion[1] < 1.8)
          .map((f) => ({
            id: f.id,
            posicion: f.posicion,
            dimensiones: f.dimensiones,
            yaw: f.rotacion[1],
          })),
        ...m.muros
          .flatMap((w) => wallSegments(w, m.huecos))
          .filter((s) => s.posicion[1] - s.dimensiones[1] / 2 < 1.8),
      ];
      const moving = people.filter((p) => p.walking);
      for (let t = 0; t < 240; t += 0.1) {
        const poses = moving.map((p) => walkingPose(t, m, p.id));
        for (let k = 0; k < moving.length; k++) {
          const pose = poses[k],
            [x, , z] = pose.position;
          const next = walkingPose(t + 0.1, m, moving[k].id);
          assert.ok(
            Math.hypot(x - next.position[0], z - next.position[2]) < 0.08,
            "continuidad",
          );
          assert.ok(
            Math.abs(
              Math.atan2(
                Math.sin(pose.yaw - next.yaw),
                Math.cos(pose.yaw - next.yaw),
              ),
            ) < 0.95,
            "giro",
          );
          for (const f of solids) {
            const dx = x - f.posicion[0],
              dz = z - f.posicion[2],
              c = Math.cos(f.yaw),
              s = Math.sin(f.yaw);
            const lx = dx * c - dz * s,
              lz = dx * s + dz * c;
            // Circular body proxy, radius .25 m. Not an accessibility/ergonomic certification.
            const distance = Math.hypot(
              Math.max(0, Math.abs(lx) - f.dimensiones[0] / 2),
              Math.max(0, Math.abs(lz) - f.dimensiones[2] / 2),
            );
            assert.ok(
              distance >= 0.25,
              `${width}x${depth} ${moving[k].id} t=${t.toFixed(1)} ${f.id} distancia=${distance}`,
            );
          }
          for (const p of people.filter((p) => !p.walking))
            assert.ok(
              Math.hypot(x - p.position[0], z - p.position[2]) > 0.5,
              p.id,
            );
        }
        assert.ok(
          Math.hypot(
            poses[0].position[0] - poses[1].position[0],
            poses[0].position[2] - poses[1].position[2],
          ) > 0.5,
        );
      }
    }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { createArchitecture, cameraPresetsFor } from "../src/data/studio";
import {
  footprint,
  validateArchitecture,
  wallLength,
  wallSegments,
  openingFrame,
  floorConflicts,
} from "../src/architecture/geometry";
import { inspectEntity } from "../src/architecture/inspection";
import {
  defaultPlanLayers,
  exportPlanSvg,
  renderPlan,
} from "../src/plan/renderPlan";

for (const [w, d] of [
  [12, 8],
  [10, 8],
  [14, 10],
  [12.4, 8.6],
])
  test(`Escenario ${w} × ${d}: enlaces y envolventes válidos`, () => {
    const model = createArchitecture(w, d);
    assert.deepEqual(validateArchitecture(model), []);
    for (const f of model.mobiliario) {
      assert.equal(f.costoUnitario, null);
      assert.notEqual(f.estadoVerificacion, "verificado");
      assert.ok(f.enlaces.versionIds.includes(model.id));
      assert.ok(
        footprint(f).every(
          ([x, z]) =>
            Math.abs(x) <= w / 2 + 0.001 && Math.abs(z) <= d / 2 + 0.001,
        ),
      );
    }
    for (const id of ["asepsia", "aseo", "sanitario"])
      assert.ok(model.espacios.find((s) => s.id === id)?.reserva);
    assert.equal(model.estaciones.length, 7);
  });
test("La rotación X/Z coincide con la convención yaw Three y no infla la huella", () => {
  const model = createArchitecture();
  const f = model.mobiliario.find((f) => f.id === "esmaltes-01")!;
  const corners = footprint(f),
    xs = corners.map((c) => c[0]),
    zs = corners.map((c) => c[1]);
  assert.ok(
    Math.abs(Math.max(...xs) - Math.min(...xs) - f.dimensiones[2]) < 1e-9,
  );
  assert.ok(
    Math.abs(Math.max(...zs) - Math.min(...zs) - f.dimensiones[0]) < 1e-9,
  );
});
test("La segmentación conserva el volumen del muro menos todos sus huecos", () => {
  const model = createArchitecture();
  for (const wall of model.muros) {
    const total = wallLength(wall) * wall.altura * wall.espesor;
    const voids = model.huecos
      .filter((o) => o.muroId === wall.id)
      .reduce((v, o) => v + o.ancho * o.alto * wall.espesor, 0);
    const volume = wallSegments(wall, model.huecos).reduce(
      (v, s) => v + s.dimensiones.reduce((a, b) => a * b, 1),
      0,
    );
    assert.ok(Math.abs(volume - (total - voids)) < 1e-8, wall.id);
  }
});
test("Puertas fuera de muro, superpuestas y referencias rotas se rechazan", () => {
  const model = createArchitecture();
  model.huecos[0].offset = 100;
  assert.ok(validateArchitecture(model).some((e) => e.includes("p-acceso")));
  model.mobiliario[0].espacioId = "desconocido" as never;
  assert.ok(
    validateArchitecture(model).some((e) => e.includes("Zona desconocida")),
  );
});
test("Configuraciones inválidas no generan geometría NaN", () => {
  for (const [w, d] of [
    [NaN, 5],
    [6, Infinity],
    [0, 5],
    [6, 4],
    [11, 5],
  ])
    assert.throws(() => createArchitecture(w, d));
});
test("La selección por ID sigue siendo válida entre representaciones y escenarios", () => {
  for (const model of [createArchitecture(), createArchitecture(10, 8)])
    for (const e of [
      ...model.mobiliario,
      ...model.espacios,
      ...model.muros,
      ...model.huecos,
      ...model.puntosTecnicos,
      ...model.estaciones,
    ]) {
      const inspected = inspectEntity(model, e.id);
      assert.equal(inspected?.id, e.id);
      assert.ok(inspected?.evidencia);
      assert.ok(inspected?.posicion.every(Number.isFinite));
    }
  assert.equal(inspectEntity(createArchitecture(), "objeto-eliminado"), null);
});
test("El SVG exportado conserva cotas, nombres e IDs aun con las capas ocultas", () => {
  const model = createArchitecture(10, 8);
  const svg = exportPlanSvg(model, {
    ...defaultPlanLayers,
    dimensions: false,
    zones: false,
    ids: false,
  });
  assert.ok(svg.startsWith("<?xml"));
  assert.ok(svg.includes("10.00 m · interior conceptual"));
  assert.ok(svg.includes("Cotas parciales"));
  assert.ok(svg.includes("Baño conceptual"));
  assert.ok(svg.includes("mesa-01"));
  assert.ok(svg.includes("Escala gráfica"));
  assert.ok(!svg.includes("NaN"));
  assert.ok(!svg.includes("undefined"));
  const hidden = renderPlan(model, {
    ...defaultPlanLayers,
    furniture: false,
    dimensions: false,
    zones: false,
  });
  assert.equal(
    (hidden.match(/data-entity-id="mesa-01"/g) ?? []).length,
    1,
    "La tabla permanece consultable aunque se oculte la geometría",
  );
  assert.ok(!hidden.includes('class="dimension"'));
});
test("Las entidades se escapan como texto en el SVG", () => {
  const model = createArchitecture();
  model.mobiliario[0].nombre = '<script>alert("x")</script>';
  const svg = renderPlan(model);
  assert.ok(!svg.includes("<script>"));
  assert.ok(svg.includes("&lt;script&gt;"));
});
test("Escala y transformación SVG usan la posición y orientación originales", () => {
  const model = createArchitecture(),
    f = model.mobiliario.find((f) => f.id === "esmaltes-01")!;
  const svg = renderPlan(model);
  assert.ok(
    svg.includes(
      `translate(${f.posicion[0]} ${f.posicion[2]}) rotate(${(-f.rotacion[1] * 180) / Math.PI})`,
    ),
  );
  const enlarged = createArchitecture(10, 8);
  assert.notDeepEqual(
    enlarged.mobiliario[0].posicion,
    model.mobiliario[0].posicion,
  );
  assert.deepEqual(
    enlarged.mobiliario[0].dimensiones,
    model.mobiliario[0].dimensiones,
  );
});
test("Ocho encuadres distintos y objetivo superior sin singularidad", () => {
  const views = cameraPresetsFor(createArchitecture());
  assert.equal(
    new Set(Object.values(views).map((p) => p.posicion.join())).size,
    8,
  );
  assert.notEqual(views.planta.posicion[2], 0);
});

test("Perímetro cierra esquinas sin desplazar puerta ni cotas interiores", () => {
  const model = createArchitecture(),
    north = model.muros.find((w) => w.grupo === "norte"),
    south = model.muros.find((w) => w.grupo === "sur");
  assert.ok(north && south);
  assert.equal(
    wallLength(north),
    model.local.ancho + 2 * model.local.espesorMuro,
  );
  const door = model.huecos.find((o) => o.id === "p-acceso");
  assert.ok(door);
  const frame = openingFrame(south, door);
  assert.ok(Math.abs(frame.start[0] - -0.7) < 1e-9);
  assert.ok(renderPlan(model).includes("5.30 m"));
});

for (const [w, d] of [
  [12, 8],
  [10, 8],
  [16, 14],
])
  test("Layout sin solapes entre envolventes de piso " + w + "x" + d, () => {
    assert.deepEqual(floorConflicts(createArchitecture(w, d)), []);
  });

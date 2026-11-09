import type {
  Architecture,
  Furniture,
  Opening,
  Vec2,
  Vec3,
  Wall,
} from "../types/studio";

export const wallLength = (w: Wall) =>
  Math.hypot(w.hasta[0] - w.desde[0], w.hasta[1] - w.desde[1]);
export function wallFrame(w: Wall) {
  const length = wallLength(w),
    u: Vec2 = [
      (w.hasta[0] - w.desde[0]) / length,
      (w.hasta[1] - w.desde[1]) / length,
    ];
  const shift: Vec2 =
    w.grupo === "norte"
      ? [0, -w.espesor / 2]
      : w.grupo === "sur"
        ? [0, w.espesor / 2]
        : w.grupo === "oeste"
          ? [-w.espesor / 2, 0]
          : w.grupo === "este"
            ? [w.espesor / 2, 0]
            : [0, 0];
  const start: Vec2 = [w.desde[0] + shift[0], w.desde[1] + shift[1]];
  return { length, u, start, yaw: -Math.atan2(u[1], u[0]) };
}
export function openingFrame(w: Wall, o: Opening) {
  const { u, start, yaw } = wallFrame(w);
  return {
    start: [start[0] + u[0] * o.offset, start[1] + u[1] * o.offset] as Vec2,
    u,
    yaw,
  };
}
export interface WallSegment {
  id: string;
  wallId: string;
  posicion: Vec3;
  dimensiones: Vec3;
  yaw: number;
  materialId: string;
}
/** Mismos sólidos de muro para SVG y WebGL, incluidos dinteles y antepechos. */
export function wallSegments(w: Wall, openings: Opening[]): WallSegment[] {
  const { length, u, start, yaw } = wallFrame(w);
  const result: WallSegment[] = [];
  const add = (
    a: number,
    b: number,
    base: number,
    height: number,
    key: string,
  ) => {
    if (b - a < 0.00001 || height < 0.00001) return;
    result.push({
      id: `${w.id}-${key}`,
      wallId: w.id,
      posicion: [
        start[0] + (u[0] * (a + b)) / 2,
        base + height / 2,
        start[1] + (u[1] * (a + b)) / 2,
      ],
      dimensiones: [b - a, height, w.espesor],
      yaw,
      materialId: w.materialId,
    });
  };
  let cursor = 0;
  for (const o of openings
    .filter((o) => o.muroId === w.id)
    .sort((a, b) => a.offset - b.offset)) {
    add(cursor, o.offset, 0, w.altura, `tramo-${cursor}`);
    add(o.offset, o.offset + o.ancho, 0, o.antepecho, `antepecho-${o.id}`);
    add(
      o.offset,
      o.offset + o.ancho,
      o.antepecho + o.alto,
      w.altura - o.antepecho - o.alto,
      `dintel-${o.id}`,
    );
    cursor = o.offset + o.ancho;
  }
  add(cursor, length, 0, w.altura, `tramo-${cursor}`);
  return result;
}
/** Convención común: yaw positivo Three gira X hacia −Z. En SVG el ángulo es −yaw. */
export function footprint(
  f: Pick<Furniture, "posicion" | "dimensiones" | "rotacion">,
): Vec2[] {
  const [w, , d] = f.dimensiones,
    c = Math.cos(f.rotacion[1]),
    s = Math.sin(f.rotacion[1]);
  return (
    [
      [-w / 2, -d / 2],
      [w / 2, -d / 2],
      [w / 2, d / 2],
      [-w / 2, d / 2],
    ] as Vec2[]
  ).map(([x, z]) => [
    f.posicion[0] + c * x + s * z,
    f.posicion[2] - s * x + c * z,
  ]);
}
export function validateArchitecture(model: Architecture): string[] {
  const errors: string[] = [];
  const entities = [
    ...model.muros,
    ...model.huecos,
    ...model.espacios,
    ...model.mobiliario,
    ...model.estaciones,
    ...model.puntosTecnicos,
    ...model.senales,
  ];
  if (new Set(entities.map((e) => e.id)).size !== entities.length)
    errors.push("Identificadores duplicados.");
  for (const f of model.mobiliario) {
    if (!f.dimensiones.every((d) => Number.isFinite(d) && d > 0))
      errors.push(`Dimensiones inválidas: ${f.id}`);
    if (!model.espacios.some((s) => s.id === f.espacioId))
      errors.push(`Zona desconocida: ${f.id}`);
    if (!model.materiales.some((m) => m.id === f.materialId))
      errors.push(`Material desconocido: ${f.id}`);
    if (
      footprint(f).some(
        ([x, z]) =>
          Math.abs(x) > model.local.ancho / 2 + 0.001 ||
          Math.abs(z) > model.local.fondo / 2 + 0.001,
      )
    )
      errors.push(`Objeto fuera del perímetro: ${f.id}`);
  }
  for (const wall of model.muros) {
    const cuts = model.huecos
      .filter((o) => o.muroId === wall.id)
      .sort((a, b) => a.offset - b.offset);
    let end = 0;
    for (const o of cuts) {
      if (
        o.offset < end ||
        o.ancho <= 0 ||
        o.offset + o.ancho > wallLength(wall) ||
        o.antepecho < 0 ||
        o.alto <= 0 ||
        o.alto + o.antepecho > wall.altura
      )
        errors.push(`Hueco inválido: ${o.id}`);
      end = o.offset + o.ancho;
    }
  }
  for (const o of model.huecos)
    if (!model.muros.some((w) => w.id === o.muroId))
      errors.push(`Muro desconocido: ${o.id}`);
  for (const s of model.estaciones)
    if (
      s.mobiliarioIds.some((id) => !model.mobiliario.some((f) => f.id === id))
    )
      errors.push(`Estación incompleta: ${s.id}`);
  for (const point of model.puntosTecnicos) {
    if (!model.espacios.some((s) => s.id === point.espacioId))
      errors.push(`Zona técnica desconocida: ${point.id}`);
    if (
      point.elementosIds.some(
        (id) => !model.mobiliario.some((f) => f.id === id),
      )
    )
      errors.push(`Conexión desconocida: ${point.id}`);
  }
  return errors;
}

/** Comprobación de envolventes a nivel de piso. No valida ergonomía ni giros de puertas. */
export function floorConflicts(model: Architecture): string[] {
  const objects = model.mobiliario.filter(
    (f) => f.posicion[1] < 0.2 && f.categoria !== "iluminacion",
  );
  // Separating-axis test on oriented footprints: AABBs falsely overlap a diagonal desk and its chair.
  const overlap = (a: Vec2[], b: Vec2[]) => {
    for (const polygon of [a, b])
      for (let k = 0; k < polygon.length; k++) {
        const start = polygon[k],
          end = polygon[(k + 1) % polygon.length];
        const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
        if (length < 1e-9) continue;
        const axis: Vec2 = [
          -(end[1] - start[1]) / length,
          (end[0] - start[0]) / length,
        ];
        const project = (pts: Vec2[]) =>
          pts.map((p) => p[0] * axis[0] + p[1] * axis[1]);
        const ap = project(a),
          bp = project(b);
        if (
          Math.min(Math.max(...ap), Math.max(...bp)) -
            Math.max(Math.min(...ap), Math.min(...bp)) <=
          0.005
        )
          return false;
      }
    return true;
  };
  const conflicts: string[] = [];
  for (let i = 0; i < objects.length; i++)
    for (let j = i + 1; j < objects.length; j++) {
      if (overlap(footprint(objects[i]), footprint(objects[j])))
        conflicts.push(`${objects[i].id} / ${objects[j].id}`);
    }
  return conflicts;
}

/** Conservative swept rectangle for two proposed hinged doors, not ergonomic certification. */
export function cabinetOpeningConflicts(model: Architecture): string[] {
  return model.mobiliario
    .filter((f) => f.apertura)
    .flatMap((f) => {
      const leaf = f.dimensiones[0] / f.apertura!.hojas;
      const forward = (f.dimensiones[2] + leaf) / 2;
      const sweep: Furniture = {
        ...f,
        dimensiones: [f.dimensiones[0], f.dimensiones[1], leaf],
        posicion: [
          f.posicion[0] + Math.sin(f.rotacion[1]) * forward,
          0,
          f.posicion[2] + Math.cos(f.rotacion[1]) * forward,
        ],
      };
      return floorConflicts({
        ...model,
        mobiliario: model.mobiliario.map((o) => (o.id === f.id ? sweep : o)),
      }).filter((c) => c.split(" / ").includes(f.id));
    });
}

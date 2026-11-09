import type { Architecture, Evidence, Vec3 } from "../types/studio";
import { openingFrame, wallFrame, wallLength } from "./geometry";
export interface Inspection {
  id: string;
  nombre: string;
  dimensiones: Vec3;
  posicion: Vec3;
  rotacion: number;
  zona: string;
  material: string;
  estado: string;
  notas: string;
  evidencia: Evidence;
}
export function inspectEntity(
  model: Architecture,
  id: string | null,
): Inspection | null {
  if (!id) return null;
  const f = model.mobiliario.find((e) => e.id === id);
  if (f)
    return {
      ...f,
      zona:
        model.espacios.find((s) => s.id === f.espacioId)?.nombre ?? "Sin zona",
      material: f.material.nombre,
      rotacion: f.rotacion[1],
      estado: f.estadoVerificacion,
    };
  const w = model.muros.find((e) => e.id === id);
  if (w) {
    const frame = wallFrame(w);
    return {
      id,
      nombre: w.nombre,
      dimensiones: [wallLength(w), w.altura, w.espesor],
      posicion: [
        frame.start[0] + (frame.u[0] * frame.length) / 2,
        w.altura / 2,
        frame.start[1] + (frame.u[1] * frame.length) / 2,
      ],
      rotacion: frame.yaw,
      zona: "Arquitectura",
      material: model.materiales.find((m) => m.id === w.materialId)!.nombre,
      estado: "conceptual",
      notas:
        "Espesor, posición y resistencia por comprobar. No es plano de obra.",
      evidencia: w.evidencia,
    };
  }
  const o = model.huecos.find((e) => e.id === id);
  if (o) {
    const wall = model.muros.find((w) => w.id === o.muroId)!;
    const frame = openingFrame(wall, o);
    return {
      id,
      nombre: o.nombre,
      dimensiones: [o.ancho, o.alto, wall.espesor],
      posicion: [
        frame.start[0] + (frame.u[0] * o.ancho) / 2,
        o.antepecho,
        frame.start[1] + (frame.u[1] * o.ancho) / 2,
      ],
      rotacion: frame.yaw,
      zona: wall.nombre,
      material:
        o.tipo === "puerta"
          ? "Carpintería provisional"
          : "Vidrio y marco provisional",
      estado: "por verificar",
      notas: `Antepecho ${o.antepecho.toFixed(2)} m. Ancho libre y giro no validados.`,
      evidencia: o.evidencia,
    };
  }
  const station = model.estaciones.find((e) => e.id === id);
  const s = model.espacios.find((e) => e.id === (station?.espacioId ?? id));
  if (s)
    return {
      id,
      nombre: station?.nombre ?? s.nombre,
      dimensiones: s.dimensiones,
      posicion: s.centro,
      rotacion: 0,
      zona: s.nombre,
      material: "Zonificación conceptual",
      estado: s.reserva ? "reserva por verificar" : "conceptual",
      notas: s.descripcion,
      evidencia: station?.evidencia ?? s.evidencia,
    };
  const t = model.puntosTecnicos.find((e) => e.id === id);
  if (t)
    return {
      id,
      nombre: t.nombre,
      dimensiones: [0, 0, 0],
      posicion: t.posicion,
      rotacion: 0,
      zona: model.espacios.find((s) => s.id === t.espacioId)!.nombre,
      material: "Punto previsto sin instalación",
      estado: "por verificar",
      notas:
        t.notas +
        " Elementos previstos: " +
        t.elementosIds
          .map((id) => model.mobiliario.find((f) => f.id === id)?.nombre ?? id)
          .join(", "),
      evidencia: t.evidencia,
    };
  const sign = model.senales.find((s) => s.id === id);
  if (sign)
    return {
      id,
      nombre: sign.nombre,
      dimensiones: sign.dimensiones,
      posicion: sign.posicion,
      rotacion: sign.rotacion[1],
      zona: model.espacios.find((s) => s.id === sign.espacioId)!.nombre,
      material: "Señalética e identidad provisional",
      estado: "por verificar",
      notas: sign.notas,
      evidencia: sign.evidencia,
    };
  return null;
}

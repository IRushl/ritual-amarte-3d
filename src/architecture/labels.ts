import type { Architecture, Vec3, ViewVisibility } from "../types/studio";
export const technicalFurnitureIds = [
  "almacen-01",
  "almacen-02",
  "apoyo-01",
  "asepsia-01",
  "lavamanos-personal",
  "poceta-01",
  "lavabo-01",
  "wc-01",
];
export interface SceneLabel {
  id: string;
  text: string;
  position: Vec3;
  technical: boolean;
}
export interface LabelProjection {
  id: string;
  left: number;
  top: number;
  visible: boolean;
}
export function sceneLabels(
  model: Architecture,
  visibility: ViewVisibility,
): SceneLabel[] {
  return [
    ...(visibility.labels
      ? model.espacios.map((s) => ({
          id: s.id,
          text: s.nombre + (s.reserva ? " · reserva" : ""),
          position: [
            s.centro[0],
            0.06,
            s.centro[2] - s.dimensiones[2] / 2 + 0.13,
          ] as Vec3,
          technical: false,
        }))
      : []),
    ...(visibility.technical
      ? model.mobiliario
          .filter((f) => technicalFurnitureIds.includes(f.id))
          .map((f) => ({
            id: f.id,
            text: f.nombre,
            position: [
              f.posicion[0],
              f.posicion[1] + f.dimensiones[1] + 0.14,
              f.posicion[2],
            ] as Vec3,
            technical: true,
          }))
      : []),
    ...model.puntosTecnicos
      .filter((t) =>
        t.tipo === "energia" ? visibility.electrical : visibility.technical,
      )
      .map((t) => ({
        id: t.id,
        text: t.nombre + " · " + t.id,
        position: [t.posicion[0], t.posicion[1] + 0.12, t.posicion[2]] as Vec3,
        technical: true,
      })),
  ];
}

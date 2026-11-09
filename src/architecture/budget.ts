import type { Architecture, Furniture } from "../types/studio";
export const categoryLabels: Record<Furniture["categoria"], string> = {
  pantalla: "Pantallas",
  arte: "Arte mural",
  maquillaje: "Maquillaje",
  espejo: "Espejos",
  recepcion: "Recepción",
  mesa: "Manicure",
  asiento: "Asientos",
  pedicure: "Pedicure",
  almacenamiento: "Almacenamiento",
  exhibicion: "Exhibición",
  asepsia: "Apoyo técnico",
  auxiliar: "Espera",
  sanitario: "Baño",
  lavabo: "Lavamanos / aseo",
  iluminacion: "Iluminación",
  decoracion: "Ambientación",
};
export const acquisitionLabels: Record<Furniture["tipoAdquisicion"], string> = {
  "por-definir": "Por definir",
  compra: "Compra propuesta",
  fabricacion: "Fabricación propuesta",
  existente: "Existente por verificar",
};
export const money = (value: number | null) =>
  value === null
    ? "Por cotizar"
    : new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(value);
export function lineSubtotal(
  item: Pick<Furniture, "cantidad" | "costoUnitario">,
): number | null {
  return item.costoUnitario === null
    ? null
    : item.cantidad * item.costoUnitario;
}
export function budgetSummary(items: Furniture[]) {
  const known = items.filter((item) => item.costoUnitario !== null);
  return {
    lines: items.length,
    units: items.reduce((n, i) => n + i.cantidad, 0),
    pending: items.length - known.length,
    known: known.length
      ? known.reduce((n, i) => n + lineSubtotal(i)!, 0)
      : null,
    complete: known.length === items.length && items.length > 0,
  };
}
export function electricalSummary(model: Architecture) {
  const points = model.puntosTecnicos.filter((p) => p.tipo === "energia");
  return {
    points: points.reduce((n, p) => n + p.cantidad, 0),
    outlets: points
      .filter((p) => p.subtipoElectrico === "toma")
      .reduce((n, p) => n + p.cantidad, 0),
    light: points
      .filter((p) => p.subtipoElectrico === "luz")
      .reduce((n, p) => n + p.cantidad, 0),
    reserve: points
      .filter((p) => p.subtipoElectrico === "reserva")
      .reduce((n, p) => n + p.cantidad, 0),
    dependent: model.mobiliario.filter((f) => f.requiereElectricidad).length,
  };
}

import type { Architecture, Furniture, Verification } from "../types/studio";

export const budgetCategories = [
  "Mobiliario",
  "Carpintería",
  "Iluminación",
  "Decoración",
  "Espejos",
  "Sillería",
  "Pedicure",
  "Maquillaje",
  "Bioseguridad",
  "Señalización",
  "Baño",
  "Herramientas manicure",
  "Herramientas pedicure",
  "Herramientas maquillaje",
  "Insumos",
  "Apoyo técnico",
  "Branding",
  "Instalación eléctrica",
  "Accesorios",
  "Almacenamiento",
] as const;
export type BudgetCategory = (typeof budgetCategories)[number];
export interface BudgetItem {
  id: string;
  elementoId?: string;
  categoria: BudgetCategory;
  nombre: string;
  cantidad: number | null;
  unidad: string;
  costoUnitario: number | null;
  estadoVerificacion: Verification;
  notas: string;
  origen: string;
}
function furnitureCategory(f: Furniture): BudgetCategory {
  if (f.categoria === "arte") return "Decoración";
  if (f.categoria === "pantalla") return "Accesorios";
  if (f.categoria === "espejo") return "Espejos";
  if (f.espacioId === "maquillaje" && f.categoria !== "asiento")
    return "Maquillaje";
  if (f.categoria === "asiento") return "Sillería";
  if (f.categoria === "pedicure") return "Pedicure";
  if (f.espacioId === "sanitario") return "Baño";
  if (f.categoria === "iluminacion") return "Iluminación";
  if (f.categoria === "decoracion") return "Decoración";
  if (f.espacioId === "almacen") return "Almacenamiento";
  if (["asepsia", "aseo", "tecnico"].includes(f.espacioId))
    return "Apoyo técnico";
  if (f.tipoAdquisicion === "fabricacion") return "Carpintería";
  return "Mobiliario";
}
/** No quotes are seeded. Allowances have unknown quantities until a specification exists. */
export function projectBudget(model: Architecture): BudgetItem[] {
  const rows: BudgetItem[] = model.mobiliario.map((f) => ({
    id: f.enlaces.presupuestoId ?? f.id,
    elementoId: f.id,
    categoria: furnitureCategory(f),
    nombre: f.nombre,
    cantidad: f.cantidad,
    unidad: "ud.",
    costoUnitario: f.costoUnitario,
    estadoVerificacion: f.estadoVerificacion,
    notas: f.notas,
    origen: f.tipoAdquisicion,
  }));
  const allowances: [BudgetCategory, string, string][] = [
    [
      "Iluminación",
      "Iluminación general, de tarea y fachada",
      "Definir cálculo y alcance. La luminaria central y luces integradas en tocadores/exhibidor ya están en sus conjuntos; evitar doble conteo.",
    ],
    [
      "Bioseguridad",
      "Equipamiento para procesamiento de instrumental",
      "Definir método, equipos y compatibilidad según evaluación técnica; sin esterilizador o certificación supuestos.",
    ],
    [
      "Bioseguridad",
      "Recipientes y segregación de residuos",
      "Clasificación, ruta y cantidades por verificar; armario de apoyo cotizado por separado.",
    ],
    [
      "Herramientas manicure",
      "Instrumental de manicure",
      "Definir lista, juegos, rotación y vida útil según protocolo y agenda.",
    ],
    [
      "Herramientas pedicure",
      "Instrumental de pedicure",
      "Definir lista por servicio y procedimientos de limpieza.",
    ],
    [
      "Herramientas maquillaje",
      "Brochas y aplicadores de maquillaje",
      "Servicio ampliado por solicitud; definir uso individual, limpieza y consumibles.",
    ],
    [
      "Insumos",
      "Productos y consumibles de apertura",
      "Marcas, compatibilidad, consumo y stock por definir. No usar capacidad espacial como demanda.",
    ],
    [
      "Instalación eléctrica",
      "Cableado, circuitos, protecciones e instalación",
      "Alcance y metrado pendientes de diseño eléctrico real. Puntos conceptuales se enumeran por separado.",
    ],
    [
      "Accesorios",
      "Organizadores y accesorios de operación",
      "Desglosar antes de cotizar; excluir accesorios ya incluidos en cada conjunto de mobiliario.",
    ],
  ];
  allowances.push([
    "Carpintería",
    "Frente comercial: revestimiento y marcos",
    "Metrado, herrajes, anclajes, vidrio y permisos por definir; rótulos e iluminación separados. No representa obra aprobada.",
  ]);
  allowances.forEach(([categoria, nombre, notas], i) =>
    rows.push({
      id: `partida-${i + 1}`,
      categoria,
      nombre,
      cantidad: null,
      unidad: "por definir",
      costoUnitario: null,
      estadoVerificacion: "por-verificar",
      notas,
      origen: "por-definir",
    }),
  );
  model.senales.forEach((s) =>
    rows.push({
      id: `pres-${s.id}`,
      elementoId: s.id,
      categoria: s.tipo === "marca" ? "Branding" : "Señalización",
      nombre: s.nombre,
      cantidad: 1,
      unidad: "ud.",
      costoUnitario: null,
      estadoVerificacion: "conceptual",
      notas:
        s.notas +
        (s.tipo === "marca"
          ? " Coordinar aplicaciones de marca como sistema, sin duplicar mostrador."
          : " Señal individual propuesta; evaluación de riesgo y formato pendiente."),
      origen: "fabricacion",
    }),
  );
  model.puntosTecnicos
    .filter((p) => p.tipo === "energia")
    .forEach((p) =>
      rows.push({
        id: `pres-${p.id}`,
        elementoId: p.id,
        categoria: "Instalación eléctrica",
        nombre: p.nombre,
        cantidad: p.cantidad,
        unidad: "punto",
        costoUnitario: null,
        estadoVerificacion: "por-verificar",
        notas:
          "Previsión de conexión; no incluye circuitos, potencia o protección verificados. " +
          p.notas,
        origen: "por-definir",
      }),
    );
  return rows;
}
export function budgetSubtotal(item: BudgetItem): number | null {
  return item.cantidad === null || item.costoUnitario === null
    ? null
    : item.cantidad * item.costoUnitario;
}
export function projectBudgetSummary(items: BudgetItem[]) {
  const known = items
    .map(budgetSubtotal)
    .filter((n): n is number => n !== null);
  return {
    lines: items.length,
    pending: items.length - known.length,
    quantitiesPending: items.filter((i) => i.cantidad === null).length,
    known: known.length ? known.reduce((a, b) => a + b, 0) : null,
    complete: known.length === items.length && items.length > 0,
  };
}

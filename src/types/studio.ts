export type Vec3 = [number, number, number];
export type Verification = "conceptual" | "por-verificar" | "verificado";
export type SpaceId =
  | "recepcion"
  | "espera"
  | "tecnico"
  | "manicure"
  | "maquillaje"
  | "pedicure"
  | "exhibicion"
  | "almacen"
  | "asepsia"
  | "aseo"
  | "sanitario"
  | "circulacion"
  | "acceso";
export type Category =
  | "pantalla"
  | "arte"
  | "recepcion"
  | "mesa"
  | "asiento"
  | "maquillaje"
  | "espejo"
  | "pedicure"
  | "almacenamiento"
  | "exhibicion"
  | "asepsia"
  | "auxiliar"
  | "sanitario"
  | "lavabo"
  | "iluminacion"
  | "decoracion";
export interface Furniture {
  usoSanitario?:
    | "manos-personal"
    | "manos-clientas"
    | "instrumental"
    | "aseo"
    | "apoyo-limpio";
  apertura?: { hojas: number; frenteLocal: "+Z"; estado: "conceptual" };
  documentacion?: {
    revision: string;
    componentes?: FurniturePart[];
    herrajes?: string[];
    montaje?: string[];
    proveedor?: {
      nombre: string;
      fuente: string;
      dimensiones: Vec3;
      precio: number | null;
      instalacion?: string;
    };
  };
  pantalla?: {
    montaje?: "mural" | "suspendido";
    altoCarcasa?: number;
    diagonal: number;
    ancho: number;
    alto: number;
    contenido: "marca" | "ambiente";
  };
  requiereElectricidad: boolean;
  materialId: string;
  evidencia: Evidence;
  estacionId?: string;
  enlaces: FutureLinks;
  id: string;
  nombre: string;
  categoria: Category;
  espacioId: SpaceId;
  posicion: Vec3;
  rotacion: Vec3;
  dimensiones: Vec3;
  material: { nombre: string; color: string; estado: Verification };
  cantidad: number;
  tipoAdquisicion: "por-definir" | "compra" | "fabricacion" | "existente";
  costoUnitario: number | null;
  moneda: "COP";
  estadoVerificacion: Verification;
  notas: string;
}
export interface Space {
  reserva: boolean;
  evidencia: Evidence;
  id: SpaceId;
  nombre: string;
  descripcion: string;
  color: string;
  centro: Vec3;
  dimensiones: Vec3;
  estadoVerificacion: Verification;
}
export type CameraView =
  | "aerea"
  | "interior"
  | "planta"
  | "fachada"
  | "fachada-perspectiva"
  | "acceso-cerca"
  | "hacia-entrada"
  | "pedicure";

export type Vec2 = [number, number];
export interface Evidence {
  tipo:
    | "hecho-documentado"
    | "decision-preliminar"
    | "supuesto-diseno"
    | "pendiente-verificacion";
  fuente: string;
}
export interface FutureLinks {
  inventarioId?: string;
  presupuestoId?: string;
  planoMuebleId?: string;
  versionIds: string[];
}
export interface Material {
  id: string;
  nombre: string;
  color: string;
  estado: Verification;
  evidencia: Evidence;
  roughness: number;
}
export interface Wall {
  corteAutomatico?: boolean;
  id: string;
  nombre: string;
  desde: Vec2;
  hasta: Vec2;
  espesor: number;
  altura: number;
  materialId: string;
  grupo: "norte" | "sur" | "este" | "oeste" | "interior";
  evidencia: Evidence;
}
export interface Opening {
  id: string;
  nombre: string;
  muroId: string;
  tipo: "puerta" | "ventana";
  offset: number;
  ancho: number;
  alto: number;
  antepecho: number;
  giro: 1 | -1;
  evidencia: Evidence;
}
export interface TechnicalPoint {
  cantidad: number;
  elementosIds: string[];
  subtipoElectrico?: "toma" | "luz" | "reserva";
  id: string;
  nombre: string;
  tipo: "agua" | "desague" | "energia" | "extraccion" | "residuos";
  posicion: Vec3;
  espacioId: SpaceId;
  evidencia: Evidence;
  notas: string;
}
export interface Sign {
  pictograma?:
    | "salida"
    | "ruta"
    | "extintor"
    | "botiquin"
    | "restringido"
    | "plano";
  id: string;
  nombre: string;
  texto: string;
  espacioId: SpaceId;
  posicion: Vec3;
  rotacion: Vec3;
  dimensiones: Vec3;
  tipo: "orientacion" | "seguridad" | "marca";
  evidencia: Evidence;
  notas: string;
}
export interface Station {
  id: string;
  nombre: string;
  espacioId: SpaceId;
  mobiliarioIds: string[];
  evidencia: Evidence;
  enlaces: FutureLinks;
}
export interface Architecture {
  id: string;
  revision: string;
  unidades: "m";
  local: {
    ancho: number;
    fondo: number;
    alto: number;
    espesorMuro: number;
    evidencia: Evidence;
  };
  materiales: Material[];
  muros: Wall[];
  huecos: Opening[];
  espacios: Space[];
  mobiliario: Furniture[];
  estaciones: Station[];
  puntosTecnicos: TechnicalPoint[];
  senales: Sign[];
  fachada: {
    muroId: string;
    profundidad: number;
    altoFriso: number;
    alturaTotal?: number;
    pavimento?: { profundidad: number; espesor: number; color: string };
    maceteros?: { id: string; posicion: Vec3; dimensiones: Vec3 }[];
    evidencia: Evidence;
  };
  evacuacion: { salidaId: string; recorrido: Vec2[]; evidencia: Evidence };
  marca: { nombre: string; estado: string };
  acabados: {
    pisoMaterialId: string;
    techoMaterialId: string;
  };
  limites: string[];
}
export interface FurniturePart {
  id: string;
  nombre: string;
  posicion: Vec3;
  dimensiones: Vec3;
  materialId: string;
  cantidad: number;
  evidencia: Evidence;
}
export interface ViewVisibility {
  people?: boolean;
  peoplePaused?: boolean;
  animationPaused: boolean;
  zones: boolean;
  labels: boolean;
  roof: boolean;
  cutaway: boolean;
  technical: boolean;
  furniture: boolean;
  electrical: boolean;
  signage: boolean;
}

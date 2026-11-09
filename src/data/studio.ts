import type {
  Architecture,
  CameraView,
  Evidence,
  Furniture,
  Material,
  Space,
  SpaceId,
  Vec3,
  Wall,
  TechnicalPoint,
} from "../types/studio";

const hypothesis: Evidence = {
  tipo: "supuesto-diseno",
  fuente:
    "Rediseño V0.2-R3 solicitado por la usuaria; sin inmueble seleccionado",
};
const pending: Evidence = {
  tipo: "pendiente-verificacion",
  fuente:
    "Maestro V1.7 caps. 19–20; diseño técnico, visita y cotizaciones pendientes",
};
const preliminary: Evidence = {
  tipo: "decision-preliminar",
  fuente:
    "Maestro V1.7 caps. 16–18 y 22; dirección de experiencia, no capacidad aprobada",
};
const links = (id: string) => ({
  inventarioId: id,
  presupuestoId: `pres-${id}`,
  planoMuebleId: `ficha-${id}`,
  versionIds: ["ritual-refinado-r7", "ritual-refinado-r8"],
});

/** Metros. Centro del piso interior. X derecha, Y arriba, Z hacia el acceso. */
export function createArchitecture(ancho = 12, fondo = 8): Architecture {
  if (
    !Number.isFinite(ancho) ||
    !Number.isFinite(fondo) ||
    ancho < 10 ||
    ancho > 16 ||
    fondo < 8 ||
    fondo > 14
  )
    throw new Error(
      "El rediseño admite ancho 10–16 m y fondo 8–14 m. Son límites del prototipo, no normativos.",
    );
  const sx = ancho / 12,
    sz = fondo / 8,
    alto = 3.4,
    espesor = 0.15;
  const p = (x: number, y: number, z: number): Vec3 => [x * sx, y, z * sz];
  const materials: Material[] = [
    {
      id: "piedra",
      nombre: "Superficie clara no porosa · por validar",
      color: "#eee7dc",
      roughness: 0.32,
      estado: "por-verificar",
      evidencia: pending,
    },
    {
      id: "madera",
      nombre: "Madera clara sellada · propuesta",
      color: "#d7c3a5",
      roughness: 0.6,
      estado: "por-verificar",
      evidencia: preliminary,
    },
    {
      id: "tapizado",
      nombre: "Tapizado crema lavable · por ensayar",
      color: "#e6dccb",
      roughness: 0.93,
      estado: "por-verificar",
      evidencia: pending,
    },
    {
      id: "muro",
      nombre: "Acabado marfil cálido · provisional",
      color: "#eee8df",
      roughness: 0.8,
      estado: "por-verificar",
      evidencia: pending,
    },
    {
      id: "piso",
      nombre: "Piso crema de gran formato · por validar",
      color: "#e9e1d3",
      roughness: 0.4,
      estado: "por-verificar",
      evidencia: pending,
    },
    {
      id: "champana",
      nombre: "Metal champaña satinado · propuesta",
      color: "#b79b70",
      roughness: 0.35,
      estado: "por-verificar",
      evidencia: hypothesis,
    },
    {
      id: "ceramica",
      nombre: "Cerámica sanitaria clara · provisional",
      color: "#f4eee4",
      roughness: 0.25,
      estado: "por-verificar",
      evidencia: pending,
    },
  ];
  materials.push({
    id: "nude",
    nombre: "Tapizado nude / rosa polvo · propuesta",
    color: "#d7b7ba",
    roughness: 0.92,
    estado: "por-verificar",
    evidencia: preliminary,
  });
  const zone = (
    id: SpaceId,
    nombre: string,
    x: number,
    z: number,
    w: number,
    d: number,
    color: string,
    descripcion: string,
    reserva = false,
  ): Space => ({
    id,
    nombre,
    centro: p(x, 0, z),
    dimensiones: [w * sx, alto, d * sz],
    color,
    descripcion,
    reserva,
    estadoVerificacion: "conceptual",
    evidencia: reserva ? pending : hypothesis,
  });
  const espacios: Space[] = [
    zone(
      "recepcion",
      "Recepción / bienvenida",
      1.65,
      2.9,
      2.4,
      2.2,
      "#ba9d7b",
      "Mostrador junto al acceso con espacio posterior de operación; marca visible desde el frente.",
    ),
    zone(
      "espera",
      "Lounge de espera",
      4.25,
      2.45,
      3.1,
      3.1,
      "#b9ad97",
      "Dos sofás en L y mesa central amplia; se aprovecha el tercer tocador retirado.",
    ),
    zone(
      "manicure",
      "Manicure · 3 estaciones",
      -3.65,
      0.5,
      4.3,
      5.4,
      "#bca794",
      "Tres estaciones alineadas, próximas a esmaltes y apoyo; holguras operativas por comprobar.",
    ),
    zone(
      "pedicure",
      "Pedicure · 2 estaciones",
      0.35,
      -2.55,
      3.8,
      2.9,
      "#9da58e",
      "Frente spa posterior orientado al salón, apartado de la bienvenida.",
    ),
    zone(
      "maquillaje",
      "Maquillaje · 2 puestos",
      4.9,
      -0.45,
      2.2,
      2.7,
      "#c4a8a3",
      "Franja mural de tocadores iluminados. Ampliación solicitada; portafolio, personal e higiene por validar.",
    ),
    zone(
      "exhibicion",
      "Esmaltes",
      -5.75,
      0.5,
      0.4,
      2.4,
      "#c5ab80",
      "Exhibición mural integrada a manicure, no área adicional.",
    ),
    zone(
      "almacen",
      "Almacenamiento",
      -4.6,
      -3.5,
      2.4,
      1,
      "#a99c84",
      "Armarios cerrados en apoyo posterior, sin recinto independiente.",
      true,
    ),
    zone(
      "asepsia",
      "Asepsia / manos personal",
      -2.3,
      -3.5,
      1.9,
      1,
      "#99aa9e",
      "Mesón compacto. Separación limpio/usado y equipamiento requieren proyecto técnico.",
      true,
    ),
    zone(
      "aseo",
      "Aseo · uso exclusivo",
      -5.65,
      -2.55,
      0.7,
      0.7,
      "#a5a7a2",
      "Poceta y útiles segregados previstos en apoyo; se elimina el recinto, no la necesidad.",
      true,
    ),
    zone(
      "tecnico",
      "Residuos · reserva",
      -2.65,
      -2.9,
      0.5,
      0.5,
      "#aba298",
      "Resguardo cerrado pendiente de clasificación y compatibilidad sanitaria.",
      true,
    ),
    zone(
      "sanitario",
      "Baño conceptual",
      4.5,
      -2.9,
      3,
      2.2,
      "#b7a6af",
      "Puerta, sanitario, lavamanos y espejo. Redes y accesibilidad sin verificar.",
      true,
    ),
    zone(
      "circulacion",
      "Eje de distribución",
      0,
      1.2,
      1.5,
      5.6,
      "#c1b391",
      "Eje central y conexión transversal a los servicios. No acredita accesibilidad.",
    ),
    zone(
      "acceso",
      "Acceso principal",
      0,
      3.6,
      1.6,
      0.8,
      "#c5b59b",
      "Entrada y bienvenida inmediata; evacuación por validar.",
    ),
  ];
  const make = (
    id: string,
    nombre: string,
    categoria: Furniture["categoria"],
    espacioId: SpaceId,
    pos: Vec3,
    dims: Vec3,
    matId: string,
    notas: string,
    options: {
      yaw?: number;
      station?: string;
      acquisition?: Furniture["tipoAdquisicion"];
      electric?: boolean;
    } = {},
  ): Furniture => {
    const mat = materials.find((m) => m.id === matId)!;
    return {
      id,
      nombre,
      categoria,
      espacioId,
      posicion: p(...pos),
      dimensiones: dims,
      rotacion: [0, options.yaw ?? 0, 0],
      materialId: matId,
      material: { nombre: mat.nombre, color: mat.color, estado: mat.estado },
      cantidad: 1,
      tipoAdquisicion: options.acquisition ?? "compra",
      requiereElectricidad: options.electric ?? false,
      costoUnitario: null,
      moneda: "COP",
      estadoVerificacion: "conceptual",
      notas,
      evidencia: hypothesis,
      estacionId: options.station,
      enlaces: links(id),
    };
  };
  const mobiliario: Furniture[] = [
    make(
      "recepcion-01",
      "Mostrador curvo de recepción",
      "recepcion",
      "recepcion",
      [1.65, 0, 2.95],
      [1.65, 1.45, 0.7],
      "piedra",
      "Fabricación propuesta; envolvente incluye terminal y accesorios. Marca de trabajo pendiente de validación.",
      { yaw: -Math.PI / 2, acquisition: "fabricacion", electric: true },
    ),
    make(
      "espera-01",
      "Sofá curvo lounge",
      "asiento",
      "espera",
      [4.4, 0, 3.35],
      [2.25, 0.9, 0.95],
      "tapizado",
      "Asiento boutique de compra propuesta. Comodidad y tapizado por verificar.",
      { yaw: 0 },
    ),
    make(
      "mesa-espera-01",
      "Mesa auxiliar de espera",
      "auxiliar",
      "espera",
      [3.85, 0, 2.2],
      [1.1, 0.4, 0.8],
      "piedra",
      "Apoyo de espera sin alimentos ni bebidas en puestos de procedimiento.",
      { acquisition: "compra" },
    ),
    make(
      "esmaltes-01",
      "Mueble de esmaltes",
      "exhibicion",
      "exhibicion",
      [-5.75, 0, 0.5],
      [2.2, 2.25, 0.3],
      "madera",
      "Exhibición genérica retroiluminada. Sin marcas de productos ni cantidades de inventario confirmadas.",
      { yaw: Math.PI / 2, acquisition: "fabricacion", electric: true },
    ),
    make(
      "almacen-01",
      "Almacenamiento de insumos",
      "almacenamiento",
      "almacen",
      [-5.15, 0, -3.55],
      [1.15, 1.9, 0.65],
      "madera",
      "Insumos protegidos. Separación y acabados por verificar.",
      { acquisition: "fabricacion" },
    ),
    make(
      "almacen-02",
      "Armario de toallas y herramientas",
      "almacenamiento",
      "almacen",
      [-5.35, 0, -2.45],
      [0.75, 1.8, 0.55],
      "madera",
      "Compartimentos independientes propuestos. Sin certificación de almacenamiento.",
      { acquisition: "fabricacion" },
    ),
    make(
      "asepsia-01",
      "Mesón técnico de asepsia",
      "asepsia",
      "asepsia",
      [-3.45, 0, -3.55],
      [1.45, 1.15, 0.65],
      "piedra",
      "Reserva operativa visible; no representa cumplimiento sanitario ni equipo de esterilización aprobado.",
      { acquisition: "fabricacion", electric: true },
    ),
    make(
      "poceta-01",
      "Poceta de aseo prevista",
      "lavabo",
      "aseo",
      [-2.2, 0, -3.5],
      [0.55, 0.9, 0.6],
      "ceramica",
      "Punto independiente para útiles de aseo. Material, drenaje y procedimiento por validar.",
    ),
    make(
      "apoyo-01",
      "Mueble de apoyo técnico",
      "almacenamiento",
      "tecnico",
      [-4.25, 0, -2.45],
      [1, 0.9, 0.55],
      "madera",
      "Resguardo y segregación pendientes; no clasificar residuos solo por esta representación.",
      { acquisition: "fabricacion" },
    ),
    make(
      "wc-01",
      "Sanitario previsto",
      "sanitario",
      "sanitario",
      [4.1, 0, -3.25],
      [0.65, 0.8, 0.95],
      "ceramica",
      "Modelo esquemático. Altura, transferencia, accesibilidad y acometidas no verificadas.",
    ),
    make(
      "lavabo-01",
      "Lavamanos del baño",
      "lavabo",
      "sanitario",
      [5.35, 0, -3.55],
      [0.65, 0.95, 0.5],
      "ceramica",
      "Volumen conceptual; espejo y grifería forman parte de la propuesta.",
    ),
  ];
  mobiliario.push(
    make(
      "planta-01",
      "Jardinera de acceso",
      "decoracion",
      "manicure",
      [-5.5, 0, 3.5],
      [0.7, 1.8, 0.65],
      "madera",
      "Decoración propuesta; revisar mantenimiento y limpieza.",
    ),
    make(
      "planta-02",
      "Jardinera de spa",
      "decoracion",
      "pedicure",
      [2.5, 0, -3.45],
      [0.5, 1.6, 0.45],
      "madera",
      "Propuesta vegetal, no implica condiciones sanitarias verificadas.",
    ),
  );
  mobiliario.push(
    make(
      "espera-02",
      "Sofá lateral lounge",
      "asiento",
      "espera",
      [5.35, 0, 1.75],
      [1.7, 0.9, 0.95],
      "nude",
      "Sofá adicional tras retirar tercer tocador; holguras y tejido por verificar.",
      { yaw: Math.PI / 2 },
    ),
    make(
      "silla-recepcion",
      "Silla de recepción",
      "asiento",
      "recepcion",
      [2.6, 0, 2.95],
      [0.58, 0.9, 0.58],
      "tapizado",
      "Asiento de quien atiende, detrás del mostrador orientado al acceso.",
      { yaw: Math.PI / 2 },
    ),
    make(
      "pantalla-01",
      "Pantalla ambiente · 55 pulgadas",
      "pantalla",
      "manicure",
      [-5.91, 1.65, 2.9],
      [1.26, 0.73, 0.1],
      "champana",
      "TV de aproximadamente 55 pulgadas sobre muro oeste, visible desde espera y atención. Animación abstracta propia; soporte por verificar.",
      { yaw: Math.PI / 2, electric: true },
    ),
    make(
      "pantalla-02",
      "Pantalla de marca · 55 pulgadas",
      "pantalla",
      "espera",
      [-1.425, 1.6, 3.93],
      [1.26, 0.73, 0.1],
      "champana",
      "TV de aproximadamente 55 pulgadas en paño ciego frontal izquierdo, orientada hacia espera/pedicure. Soporte y conexiones pendientes.",
      { yaw: Math.PI, electric: true },
    ),
  );
  const estaciones: Architecture["estaciones"] = [];
  for (const [i, z] of [-1.3, 0.5, 2.3].entries()) {
    const n = String(i + 1).padStart(2, "0"),
      station = i === 0 ? "est-manicure" : `est-manicure-${n}`;
    const ids = [`mesa-${n}`, `silla-cliente-${n}`, `silla-profesional-${n}`];
    mobiliario.push(
      make(
        ids[0],
        `Mesa de manicure ${n}`,
        "mesa",
        "manicure",
        [-3.65, 0, z],
        [1.6, 1.25, 0.75],
        "piedra",
        "Envolvente incluye luz de tarea; tablero aproximado a 0.80 m. Ergonomía y aspiración por estudiar.",
        {
          yaw: Math.PI / 2,
          station,
          acquisition: "fabricacion",
          electric: true,
        },
      ),
    );
    mobiliario.push(
      make(
        ids[1],
        `Silla de cliente ${n}`,
        "asiento",
        "manicure",
        [-2.65, 0, z],
        [0.7, 0.95, 0.7],
        "tapizado",
        "Compra propuesta. Revisar postura y separación en operación.",
        { yaw: Math.PI / 2, station },
      ),
    );
    mobiliario.push(
      make(
        ids[2],
        `Silla de profesional ${n}`,
        "asiento",
        "manicure",
        [-4.65, 0, z],
        [0.62, 0.9, 0.62],
        "tapizado",
        "Debe permitir ajuste ergonómico. No es referencia comercial cotizada.",
        { yaw: -Math.PI / 2, station },
      ),
    );
    estaciones.push({
      id: station,
      nombre: `Manicure ${n}`,
      espacioId: "manicure",
      mobiliarioIds: ids,
      evidencia: hypothesis,
      enlaces: links(station),
    });
  }
  for (const [i, x] of [-0.6, 1.3].entries()) {
    const n = String(i + 1).padStart(2, "0"),
      id = `pedicure-${n}`,
      station = i === 0 ? "est-pedicure" : `est-pedicure-${n}`;
    mobiliario.push(
      make(
        id,
        `Estación spa de pedicure ${n}`,
        "pedicure",
        "pedicure",
        [x, 0, -2.6],
        [1.4, 1.4, 2.15],
        "tapizado",
        "Sillón, recipiente y plataforma de estudio. Acceso, agua, drenaje y limpieza pendientes.",
        { yaw: 0, station, electric: true },
      ),
    );
    estaciones.push({
      id: station,
      nombre: `Pedicure ${n}`,
      espacioId: "pedicure",
      mobiliarioIds: [id],
      evidencia: hypothesis,
      enlaces: links(station),
    });
  }
  mobiliario.push(
    make(
      "espejo-bano",
      "Espejo del baño",
      "espejo",
      "sanitario",
      [5.35, 1.15, -3.88],
      [0.65, 0.9, 0.06],
      "champana",
      "Espejo conceptual sobre lavamanos; fijación pendiente.",
    ),
  );
  for (const [i, z] of [-1.15, 0.25].entries()) {
    const n = String(i + 1).padStart(2, "0"),
      id = `maquillaje-${n}`,
      station = `est-maquillaje-${n}`;
    mobiliario.push(
      make(
        id,
        `Tocador de maquillaje ${n}`,
        "maquillaje",
        "maquillaje",
        [5.55, 0, z],
        [1.15, 2.1, 0.65],
        "madera",
        "Incluye espejo y luz de tarea conceptual. Nuevo servicio solicitado, no portafolio aprobado.",
        {
          yaw: -Math.PI / 2,
          station,
          acquisition: "fabricacion",
          electric: true,
        },
      ),
    );
    mobiliario.push(
      make(
        `silla-maquillaje-${n}`,
        `Silla alta de maquillaje ${n}`,
        "asiento",
        "maquillaje",
        [4.45, 0, z],
        [0.6, 1.05, 0.6],
        "tapizado",
        "Silla específica con reposapiés; postura por validar.",
        { yaw: -Math.PI / 2, station },
      ),
    );
    estaciones.push({
      id: station,
      nombre: `Maquillaje ${n}`,
      espacioId: "maquillaje",
      mobiliarioIds: [id, `silla-maquillaje-${n}`],
      evidencia: hypothesis,
      enlaces: links(station),
    });
  }
  const wall = (
    id: string,
    nombre: string,
    from: [number, number],
    to: [number, number],
    grupo: Wall["grupo"],
    extra: Partial<Wall> = {},
  ): Wall => ({
    id,
    nombre,
    desde: [from[0] * sx, from[1] * sz],
    hasta: [to[0] * sx, to[1] * sz],
    grupo,
    altura: alto,
    espesor,
    materialId: "muro",
    evidencia: hypothesis,
    ...extra,
  });
  const muros: Wall[] = [
    {
      ...wall("m-norte", "Muro posterior", [-6, -4], [6, -4], "norte"),
      desde: [-ancho / 2 - espesor, -fondo / 2],
      hasta: [ancho / 2 + espesor, -fondo / 2],
    },
    {
      ...wall("m-sur", "Fachada de acceso", [-6, 4], [6, 4], "sur"),
      desde: [-ancho / 2 - espesor, fondo / 2],
      hasta: [ancho / 2 + espesor, fondo / 2],
    },
    wall("m-oeste", "Lateral de manicure", [-6, -4], [-6, 4], "oeste"),
    wall("m-este", "Lateral de pedicure", [6, -4], [6, 4], "este"),
    wall("m-reserva", "Frente de baño", [3, -1.8], [6, -1.8], "interior"),
    wall("m-particion-4", "División del baño", [3, -4], [3, -1.8], "interior"),
  ];
  const huecos: Architecture["huecos"] = [
    {
      id: "p-acceso",
      nombre: "Puerta principal",
      muroId: "m-sur",
      tipo: "puerta",
      offset: ancho / 2 + espesor - 0.7,
      ancho: 1.4,
      alto: 2.5,
      antepecho: 0,
      giro: -1,
      evidencia: hypothesis,
    },
    {
      id: "p-reserva",
      nombre: "Puerta del baño",
      muroId: "m-reserva",
      tipo: "puerta",
      offset: 0.25 * sx,
      ancho: 0.9,
      alto: 2.15,
      antepecho: 0,
      giro: -1,
      evidencia: pending,
    },
    {
      id: "v-frente-oeste",
      nombre: "Ventanal de fachada izquierdo",
      muroId: "m-sur",
      tipo: "ventana",
      offset: espesor + 0.36,
      ancho: ancho / 2 - 1.115,
      alto: 2.5,
      antepecho: 0,
      giro: 1,
      evidencia: hypothesis,
    },
    {
      id: "v-frente-este",
      nombre: "Ventanal de fachada derecho",
      muroId: "m-sur",
      tipo: "ventana",
      offset: ancho / 2 + espesor + 0.755,
      ancho: ancho / 2 - 1.115,
      alto: 2.5,
      antepecho: 0,
      giro: 1,
      evidencia: hypothesis,
    },
  ];
  const puntosTecnicos: TechnicalPoint[] = [];
  const tech = (
    id: string,
    nombre: string,
    tipo: TechnicalPoint["tipo"],
    pos: Vec3,
    espacioId: SpaceId,
    elementosIds: string[] = [],
    subtipoElectrico: TechnicalPoint["subtipoElectrico"] = "toma",
  ) =>
    puntosTecnicos.push({
      id,
      nombre,
      tipo,
      posicion: p(...pos),
      espacioId,
      cantidad: 1,
      elementosIds,
      subtipoElectrico: tipo === "energia" ? subtipoElectrico : undefined,
      evidencia: pending,
      notas:
        "Ubicación preliminar; validar redes, capacidad, protecciones y exposición con diseño técnico real.",
    });
  for (const [i, z] of [-1.3, 0.5, 2.3].entries()) {
    const n = String(i + 1).padStart(2, "0");
    tech(
      `e-mani-${n}`,
      `Toma manicure ${n}`,
      "energia",
      [-4.9, 0.4, z],
      "manicure",
      [`mesa-${n}`],
    );
    tech(
      `t-extraccion-${n}`,
      `Extracción manicure ${n}`,
      "extraccion",
      [-3.65, 0.9, z],
      "manicure",
      [`mesa-${n}`],
    );
  }
  for (const [i, x] of [-0.6, 1.3].entries()) {
    const n = String(i + 1).padStart(2, "0");
    tech(
      `e-pedi-${n}`,
      `Conexión pedicure ${n}`,
      "energia",
      [x, 0.4, -3.8],
      "pedicure",
      [`pedicure-${n}`],
    );
    tech(
      `t-pedi-${n}`,
      `Desagüe pedicure ${n}`,
      "desague",
      [x, 0.05, -2.0],
      "pedicure",
      [`pedicure-${n}`],
    );
  }
  tech(
    "e-recepcion",
    "Toma de recepción",
    "energia",
    [1.65, 0.4, 2.95],
    "recepcion",
    ["recepcion-01"],
  );
  tech(
    "e-esmaltes",
    "Luz de exhibición",
    "energia",
    [-5.7, 2.1, 0.5],
    "exhibicion",
    ["esmaltes-01"],
  );
  tech(
    "e-asepsia",
    "Toma de apoyo operativo",
    "energia",
    [-3.45, 1.2, -3.8],
    "asepsia",
    ["asepsia-01"],
  );
  tech(
    "e-tecnico",
    "Reserva eléctrica técnica",
    "energia",
    [-4.25, 1.2, -3.8],
    "tecnico",
    [],
    "reserva",
  );

  tech("t-agua", "Agua de asepsia", "agua", [-3.45, 1.0, -3.8], "asepsia", [
    "asepsia-01",
  ]);
  tech("t-aseo", "Agua de aseo", "agua", [-2.2, 1, -3.8], "aseo", [
    "poceta-01",
  ]);
  tech("t-bano", "Agua de baño", "agua", [5.35, 0.9, -3.8], "sanitario", [
    "lavabo-01",
  ]);
  tech(
    "t-residuos",
    "Resguardo por clasificar",
    "residuos",
    [-4.25, 0.4, -2.45],
    "tecnico",
    ["apoyo-01"],
  );
  for (const [i, z] of [-1.15, 0.25].entries()) {
    const n = String(i + 1).padStart(2, "0");
    tech(
      `e-maquillaje-${n}`,
      `Toma tocador ${n}`,
      "energia",
      [5.85, 1.1, z],
      "maquillaje",
      [`maquillaje-${n}`],
    );
  }
  tech(
    "e-pantalla-01",
    "Toma pantalla manicure",
    "energia",
    [-5.85, 2, 2.9],
    "manicure",
    ["pantalla-01"],
  );
  tech(
    "e-pantalla-02",
    "Toma pantalla lounge",
    "energia",
    [-1.425, 1.95, 3.97],
    "espera",
    ["pantalla-02"],
  );
  const sign = (
    id: string,
    texto: string,
    space: SpaceId,
    pos: Vec3,
    dims: Vec3 = [1, 0.25, 0.025],
    tipo: Architecture["senales"][number]["tipo"] = "orientacion",
    yaw = 0,
  ) => ({
    id,
    nombre: `Señal ${texto}`,
    texto,
    espacioId: space,
    posicion: p(...pos),
    rotacion: [0, yaw, 0] as Vec3,
    dimensiones: dims,
    tipo,
    pictograma: id === "s-salida" ? ("salida" as const) : undefined,
    evidencia: tipo === "marca" ? preliminary : pending,
    notas:
      tipo === "seguridad"
        ? "Señal conceptual: ubicación, formato y exigibilidad por verificar."
        : "Propuesta de orientación e identidad; no es señalética aprobada.",
  });
  const byId = (id: string) => mobiliario.find((f) => f.id === id)!;
  const towels = byId("almacen-02");
  towels.posicion = [
    -ancho / 2 + (ancho < 12 ? 0.4 : 0.5),
    0,
    -fondo / 2 + 0.425,
  ];
  towels.rotacion = [0, 0, 0];
  towels.evidencia = {
    tipo: "supuesto-diseno",
    fuente:
      "R6: uniformar apertura con armario de insumos; verificación operativa pendiente.",
  };
  towels.apertura = { hojas: 2, frenteLocal: "+Z", estado: "conceptual" };
  towels.notas =
    "R6: puertas hacia +Z, uniformes con el armario de insumos. Solo toallas y herramientas limpias. Giro conceptual; ergonomía y herrajes por validar.";
  const stock = byId("almacen-01");
  stock.posicion = [ancho < 12 ? -3.6 : -4 * sx, 0, -fondo / 2 + 0.35];
  stock.apertura = { hojas: 2, frenteLocal: "+Z", estado: "conceptual" };
  const support = byId("apoyo-01");
  support.posicion = [-ancho / 2 + 0.29, 0, -1.3 * sz];
  support.rotacion = [0, Math.PI / 2, 0];
  support.espacioId = "manicure";
  support.usoSanitario = "apoyo-limpio";
  support.nombre = "Apoyo limpio de manicure";
  support.notas =
    "Muro izquierdo junto al extremo posterior del exhibidor. Solo material limpio; prohibido procesar instrumental usado o almacenar residuos. Puertas correderas propuestas, sistema por definir.";
  const asepsia = byId("asepsia-01");
  asepsia.posicion = [ancho < 12 ? -2.3 : -2.65 * sx, 0, -fondo / 2 + 0.35];
  asepsia.dimensiones[0] = 1.1;
  asepsia.usoSanitario = "instrumental";
  asepsia.notas =
    "Mesón exclusivo de procesamiento de instrumental. Se reduce envolvente a 1.10 m para separar lavado de manos. Flujo usado/limpio, salpicaduras y equipos por validar; no sustituye lavamanos personal.";
  const mop = byId("poceta-01");
  mop.posicion = [-ancho / 2 + 0.32, 0, -2.55 * sz];
  mop.rotacion = [0, Math.PI / 2, 0];
  mop.usoSanitario = "aseo";
  mop.notas =
    "Poceta exclusiva de útiles de aseo en reserva lateral posterior. Agua, sifón y desagüe propios previstos. Cerramiento/independencia física por resolver, no se declara cumplimiento.";
  const hands = make(
    "lavamanos-personal",
    "Lavamanos exclusivo del personal",
    "lavabo",
    "asepsia",
    [0, 0, 0],
    [0.5, 0.95, 0.45],
    "ceramica",
    "Higiene de manos del personal, separada del instrumental y aseo. Abastecimiento, desagüe, protección contra salpicaduras y acceso por verificar.",
  );
  hands.posicion = [ancho < 12 ? -1.5 : -1.65 * sx, 0, -fondo / 2 + 0.25];
  hands.usoSanitario = "manos-personal";
  mobiliario.push(hands);
  byId("lavabo-01").usoSanitario = "manos-clientas";
  byId("lavabo-01").notas =
    "Lavamanos de clientas en baño existente; función prevista sin agregar otro punto en atención. Disponibilidad, accesibilidad y dotación sanitaria por verificar.";
  for (const [i, id] of ["pantalla-01", "pantalla-02"].entries()) {
    const tv = byId(id);
    tv.posicion = [[-0.6, 1.3][i] * sx, 2.1, -0.65 * sz];
    tv.rotacion = [0, Math.PI, 0];
    tv.dimensiones = [1.26, alto - 2.1, 0.12];
    tv.espacioId = "pedicure";
    tv.nombre = i
      ? "Pantalla de marca · pedicure"
      : "Pantalla ambiente · pedicure";
    tv.pantalla = {
      diagonal: 55,
      ancho: 1.218,
      alto: (1.218 * 9) / 16,
      contenido: i ? "marca" : "ambiente",
      montaje: "suspendido",
      altoCarcasa: 0.73,
    };
    tv.notas =
      "TV 55 pulgadas enfrentada a sillones, suspendida del techo conceptual. Borde inferior 2.10 m, ángulo visual y fijación estructural por validar; sin apoyo en suelo. La envolvente incluye soporte.";
    const point = puntosTecnicos.find((p) => p.elementosIds.includes(id))!;
    point.posicion = [tv.posicion[0], alto - 0.05, tv.posicion[2]];
    point.espacioId = "pedicure";
    point.nombre = "Conexión suspendida TV pedicure " + (i + 1);
  }
  const hydraulic = [
    ["t-agua", "asepsia-01"],
    ["t-aseo", "poceta-01"],
    ["t-bano", "lavabo-01"],
  ] as const;
  for (const [id, furnitureId] of hydraulic) {
    const point = puntosTecnicos.find((p) => p.id === id)!,
      f = byId(furnitureId);
    point.posicion = [f.posicion[0], 0.6, f.posicion[2]];
  }
  const waterItems = [
    "asepsia-01",
    "poceta-01",
    "lavabo-01",
    "lavamanos-personal",
  ];
  puntosTecnicos.push({
    id: "t-manos-personal",
    nombre: "Agua exclusiva lavado de manos personal",
    tipo: "agua",
    posicion: [hands.posicion[0], 0.6, hands.posicion[2]],
    espacioId: "asepsia",
    cantidad: 1,
    elementosIds: [hands.id],
    evidencia: pending,
    notas: "Red prevista; capacidad y potabilidad por verificar.",
  });
  for (const id of waterItems) {
    const f = byId(id);
    puntosTecnicos.push({
      id: "d-" + id,
      nombre: "Desagüe · " + f.nombre,
      tipo: "desague",
      posicion: [f.posicion[0], 0.12, f.posicion[2]],
      espacioId: f.espacioId,
      cantidad: 1,
      elementosIds: [id],
      evidencia: pending,
      notas:
        "Sifón y conducción independientes previstos; trazado, pendientes y conexión por diseñar.",
    });
  }
  const residue = puntosTecnicos.find((p) => p.id === "t-residuos")!;
  residue.posicion = [asepsia.posicion[0], 0.3, asepsia.posicion[2] + 0.5];
  residue.elementosIds = [];
  residue.notas =
    "Reserva para residuos del proceso; recipiente y segregación por definir. No vincular con apoyo limpio de manicure.";
  for (const id of ["e-asepsia", "e-apoyo"]) {
    const point = puntosTecnicos.find((p) => p.id === id);
    if (point?.elementosIds[0]) {
      const f = byId(point.elementosIds[0]);
      point.posicion = [f.posicion[0], 1.1, f.posicion[2]];
      point.espacioId = f.espacioId;
    }
  }
  for (const f of mobiliario) {
    f.documentacion = { revision: "R5" };
    if (
      [
        "almacen-01",
        "almacen-02",
        "apoyo-01",
        "asepsia-01",
        "poceta-01",
        "lavamanos-personal",
        "pantalla-01",
        "pantalla-02",
      ].includes(f.id)
    )
      f.evidencia = {
        tipo: "supuesto-diseno",
        fuente:
          f.id === "almacen-02"
            ? "Solicitud R6: apertura uniforme con armario de insumos; ergonomía pendiente."
            : "Solicitud R5; ubicación, redes y fabricación pendientes de validación.",
      };
  }
  // R7: additions derive from the approved stations; existing furniture stays untouched.
  for (const [zone, x, z, length] of [
    ["manicure", -3.65, 0.5, 4.6],
    ["maquillaje", 5.1, -0.45, 2.5],
  ] as const) {
    const id = "luminaria-" + zone;
    mobiliario.push(
      make(
        id,
        "Suspensión oval · " + zone,
        "iluminacion",
        zone,
        [x, 2.65, z],
        [0.62, 0.65, length],
        "champana",
        "R7: aro oval de luz cálida. Cotas hipotéticas; fijación, potencia y cálculo lumínico pendientes.",
        { acquisition: "compra", electric: true },
      ),
    );
    tech(
      "e-" + id,
      "Luz de " + zone,
      "energia",
      [x, 3.3, z],
      zone,
      [id],
      "luz",
    );
  }
  for (const n of ["01", "02"]) {
    const host = mobiliario.find((f) => f.id === "pedicure-" + n)!;
    const stool = make(
      "taburete-pedicure-" + n,
      "Taburete de trabajo pedicure " + n,
      "asiento",
      "pedicure",
      [0, 0, 0],
      [0.46, 0.5, 0.46],
      "tapizado",
      "R7: asiento bajo de trabajo. Altura y alcance por validar con profesionales; no certifica ergonomía.",
    );
    stool.posicion = [host.posicion[0] + 0.5, 0, host.posicion[2] + 1.42];
    stool.rotacion = [0, Math.PI, 0];
    mobiliario.push(stool);
    estaciones
      .find((s) => s.mobiliarioIds.includes(host.id))!
      .mobiliarioIds.push(stool.id);
  }
  for (const [id, x] of [
    ["aplique-pedi-01", -0.95],
    ["aplique-pedi-02", 1.8],
  ] as const) {
    mobiliario.push(
      make(
        id,
        "Aplique cálido de pedicure",
        "iluminacion",
        "pedicure",
        [x, 2.25, -3.86],
        [0.18, 0.42, 0.16],
        "champana",
        "R7: luz ornamental suave; especificación eléctrica y montaje pendientes.",
        { acquisition: "compra", electric: true },
      ),
    );
    tech(
      "e-" + id,
      "Alimentación " + id,
      "energia",
      [x, 2.45, -3.9],
      "pedicure",
      [id],
      "luz",
    );
  }
  const art = make(
    "arte-lounge",
    "Composición mural · pausa",
    "arte",
    "espera",
    [5.94, 1.35, 2.25],
    [1.1, 1.25, 0.055],
    "muro",
    "R7: composición abstracta original en rosa polvo y arena; marco champaña. Sin activo de terceros.",
  );
  art.rotacion = [0, -Math.PI / 2, 0];
  mobiliario.push(art);
  for (const f of mobiliario.filter((f) => !f.documentacion)) {
    f.documentacion = { revision: "R7" };
    f.evidencia = {
      tipo: "supuesto-diseno",
      fuente:
        "Solicitud V0.2-R7; dimensiones, montaje y ergonomía pendientes de verificación.",
    };
  }
  for (const point of puntosTecnicos.filter(
    (p) => p.id.startsWith("e-luminaria-") || p.id.startsWith("e-aplique-"),
  ))
    point.evidencia = {
      tipo: "pendiente-verificacion",
      fuente:
        "Solicitud R7; alimentación, potencia y diseño eléctrico por verificar.",
    };
  const architecture: Architecture = {
    id: "ritual-refinado-r8",
    revision: "0.2.8",
    unidades: "m",
    local: { ancho, fondo, alto, espesorMuro: espesor, evidencia: hypothesis },
    marca: {
      nombre: "Ritual Amarte",
      estado: "Nombre de trabajo pendiente de validación marcaria",
    },
    materiales: materials,
    muros,
    huecos,
    espacios,
    mobiliario,
    estaciones,
    puntosTecnicos,
    fachada: {
      muroId: "m-sur",
      profundidad: 0.18,
      altoFriso: 1.15,
      alturaTotal: 3.65,
      pavimento: { profundidad: 1.8, espesor: 0.12, color: "#aaa399" },
      maceteros: [-1, 1].map((n) => ({
        id: "macetero-exterior-" + (n < 0 ? "oeste" : "este"),
        posicion: [n * (ancho / 2 - 0.38), 0, fondo / 2 + 0.85] as Vec3,
        dimensiones: [0.6, 1.65, 0.6] as Vec3,
      })),
      evidencia: hypothesis,
    },
    evacuacion: {
      salidaId: "p-acceso",
      recorrido: [
        [0, -1.3 * sz],
        [0, 1.5 * sz],
        [0, fondo / 2],
      ],
      evidencia: pending,
    },
    senales: [
      {
        ...sign(
          "s-extintor",
          "EXTINTOR",
          "acceso",
          [-1.425, 2.65, 3.96],
          [0.7, 0.28, 0.025],
          "seguridad",
          Math.PI,
        ),
        pictograma: "extintor",
      },
      {
        ...sign(
          "s-botiquin",
          "BOTIQUÍN",
          "tecnico",
          [-4.8, 2.95, -3.96],
          [0.85, 0.3, 0.025],
          "seguridad",
        ),
        pictograma: "botiquin",
      },
      {
        ...sign(
          "s-restringido",
          "SOLO PERSONAL",
          "tecnico",
          [-3.45, 2.95, -3.96],
          [1.5, 0.3, 0.025],
          "seguridad",
        ),
        pictograma: "restringido",
      },
      {
        ...sign(
          "s-ruta",
          "SALIDA ←",
          "manicure",
          [-5.96, 2.75, 2.85],
          [1.2, 0.3, 0.025],
          "seguridad",
          Math.PI / 2,
        ),
        pictograma: "ruta",
      },
      {
        ...sign(
          "s-plano",
          "EVACUACIÓN · PROPUESTA",
          "acceso",
          [-1.425, 1.08, 3.96],
          [0.65, 0.6, 0.025],
          "seguridad",
          Math.PI,
        ),
        pictograma: "plano",
      },
      sign(
        "s-fachada",
        "Ritual Amarte",
        "acceso",
        [0, 3.19, 4.32],
        [3.5, 0.3, 0.025],
        "marca",
      ),
      sign(
        "s-descriptor",
        "ESTUDIO DE UÑAS",
        "acceso",
        [0, 2.96, 4.32],
        [2.2, 0.12, 0.025],
        "marca",
      ),
      sign(
        "s-maquillaje",
        "MAQUILLAJE",
        "maquillaje",
        [5.89, 2.65, -0.45],
        [1.5, 0.22, 0.025],
        "orientacion",
        -Math.PI / 2,
      ),
      sign(
        "s-marca",
        "Ritual Amarte",
        "recepcion",
        [1.35, 2.85, -3.96],
        [2.4, 0.42, 0.025],
        "marca",
      ),
      sign(
        "s-recepcion",
        "RECEPCIÓN",
        "recepcion",
        [1.28, 1.01, 2.95],
        [1.1, 0.16, 0.025],
        "orientacion",
        -Math.PI / 2,
      ),
      sign(
        "s-man",
        "MANICURE",
        "manicure",
        [-5.89, 2.6, 0.5],
        [1.8, 0.3, 0.025],
        "orientacion",
        Math.PI / 2,
      ),
      sign(
        "s-pedi",
        "PEDICURE",
        "pedicure",
        [0.35, 2.13, -3.89],
        [1.5, 0.22, 0.025],
      ),
      sign("s-wc", "BAÑO", "sanitario", [3.65, 2.4, -1.7], [0.65, 0.22, 0.025]),
      sign(
        "s-asepsia",
        "ASEPSIA · INSTRUMENTAL",
        "asepsia",
        [-2.65, 2.4, -3.87],
        [1.6, 0.22, 0.025],
      ),
      sign(
        "s-tecnico",
        "ALMACENAMIENTO LIMPIO",
        "almacen",
        [-4.7, 2.4, -3.87],
        [1.7, 0.22, 0.025],
      ),
      sign(
        "s-acceso",
        "ACCESO",
        "acceso",
        [0, 2.64, 3.96],
        [1.1, 0.22, 0.025],
        "orientacion",
        Math.PI,
      ),
      sign(
        "s-salida",
        "SALIDA",
        "acceso",
        [0, 3.02, 3.96],
        [1.25, 0.3, 0.025],
        "seguridad",
        Math.PI,
      ),
    ],
    acabados: {
      pisoMaterialId: "piso",
      techoMaterialId: "muro",
    },
    limites: [
      "Escenario de 96 m² de referencia (12 × 8), editable: no corresponde a un inmueble ni es decisión comercial aprobada.",
      "Tres manicure, dos pedicure y dos maquillaje son hipótesis espaciales, no capacidad de atención o plantilla confirmadas por el maestro.",
      "Servicios técnicos, baño, holguras, puertas y circulación requieren revisión; no se declara cumplimiento sanitario o accesibilidad.",
      "La franja de apoyo se identifica y equipa esquemáticamente; circuitos limpio/usado y resguardo de residuos siguen pendientes.",
      "Tomas y señalización son preliminares; no sustituyen diseños eléctrico, lumínico, sanitario ni de evacuación.",
      "Fabricación/compra son decisiones propuestas; importes desconocidos permanecen por cotizar.",
    ],
  };
  for (const opening of architecture.huecos.filter(
    (o) => o.tipo === "ventana" && o.muroId === "m-sur",
  ))
    opening.evidencia = {
      tipo: "supuesto-diseno",
      fuente:
        "Solicitud R8: vitrina de piso a dintel; verificar estructura y vidrio en inmueble real.",
    };
  const main = architecture.senales.find((s) => s.id === "s-fachada")!;
  main.posicion = [0, 3.075, fondo / 2 + 0.335];
  main.dimensiones = [7.2, 1, 0.05];
  const descriptor = architecture.senales.find((s) => s.id === "s-descriptor")!;
  descriptor.texto = "NAIL STUDIO EXPERIENCE";
  descriptor.posicion = [0.65, 2.765, fondo / 2 + 0.335];
  descriptor.dimensiones = [3.5, 0.192, 0.025];
  // Stable budget names/notes remain untouched; only the exterior application is revised.
  architecture.fachada.evidencia = {
    tipo: "supuesto-diseno",
    fuente:
      "Solicitud V0.2-R8 y referencias aportadas; fachada conceptual, no proyecto estructural.",
  };
  // Approved interior branding adjustment: align the mark above the existing zone sign.
  const interiorMark = architecture.senales.find((s) => s.id === "s-marca")!;
  const pedicureSign = architecture.senales.find((s) => s.id === "s-pedi")!;
  interiorMark.posicion[0] = pedicureSign.posicion[0];
  interiorMark.posicion[1] = 2.85;
  interiorMark.dimensiones = [2.4, 0.86, 0.05];
  return architecture;
}
export function cameraPresetsFor(
  model: Architecture,
): Record<CameraView, { posicion: Vec3; objetivo: Vec3 }> {
  const { ancho: w, fondo: d } = model.local;
  return {
    fachada: {
      posicion: [w * 0.025, 2.55, d / 2 + w * 1.25],
      objetivo: [0, 1.65, d / 2],
    },
    "fachada-perspectiva": {
      posicion: [w * 0.55, 3.0, d / 2 + w * 1.12],
      objetivo: [0, 1.65, d / 2],
    },
    "acceso-cerca": {
      posicion: [0, 1.7, d / 2 + 4.5],
      objetivo: [0, 1.5, d / 2],
    },
    "hacia-entrada": { posicion: [0, 1.7, 0.2], objetivo: [0, 1.7, d / 2] },
    pedicure: {
      posicion: [(-0.6 * w) / 12, 1.25, (-2.95 * d) / 8],
      objetivo: [(0.35 * w) / 12, 2.4, (-0.65 * d) / 8],
    },
    aerea: {
      posicion: [w * 0.65, w * 0.95, d * 1.35],
      objetivo: [0, 0.5, 0.15],
    },
    interior: {
      posicion: [0.35, 3.0, d / 2 + 3.0],
      objetivo: [0, 1.0, -d * 0.15],
    },
    planta: { posicion: [0, Math.max(w, d) * 2, 0.001], objetivo: [0, 0, 0] },
  };
}
export const defaultArchitecture = createArchitecture();
export const room = defaultArchitecture.local,
  spaces = defaultArchitecture.espacios,
  furniture = defaultArchitecture.mobiliario,
  cameraPresets = cameraPresetsFor(defaultArchitecture);

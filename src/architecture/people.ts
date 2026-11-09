import type { Architecture, Vec3 } from "../types/studio";
export interface PersonPlacement {
  id: string;
  role: "clienta" | "profesional";
  activity: string;
  position: Vec3;
  yaw: number;
  seated: boolean;
  hostId?: string;
  walking?: boolean;
}
/** Illustrative occupancy only. Seats derive from existing furniture; never affect inventory. */
export function peopleFor(model: Architecture): PersonPlacement[] {
  const seat = (
    id: string,
    hostId: string,
    role: PersonPlacement["role"],
    activity: string,
    extraYaw = Math.PI,
    dy = 0,
    dz = 0,
  ): PersonPlacement => {
    const f = model.mobiliario.find((f) => f.id === hostId)!;
    return {
      id,
      hostId,
      role,
      activity,
      position: [f.posicion[0], dy, f.posicion[2] + dz],
      yaw: f.rotacion[1] + extraYaw,
      seated: true,
    };
  };

  return [
    seat("espera", "espera-01", "clienta", "Espera tranquila"),
    seat("recepcion", "silla-recepcion", "profesional", "Recepción"),
    seat(
      "manicurista",
      "silla-profesional-02",
      "profesional",
      "Atención de manicure",
    ),
    seat("manicure", "silla-cliente-02", "clienta", "Servicio de manicure"),
    seat(
      "pedicure",
      "pedicure-02",
      "clienta",
      "Servicio de pedicure",
      0,
      0.2,
      -0.35,
    ),
    seat(
      "maquillaje",
      "silla-maquillaje-02",
      "clienta",
      "Puesto de maquillaje",
      Math.PI,
      0.14,
    ),
    seat(
      "asistente-spa",
      "taburete-pedicure-02",
      "profesional",
      "Pedicure: trabajo sentado",
      0,
    ),
    {
      id: "apoyo",
      role: "profesional",
      activity: "Preparación y apoyo a manicure",
      position: [0, 0, 0],
      yaw: 0,
      seated: false,
      walking: true,
    },
    {
      id: "recorrido",
      role: "clienta",
      activity: "Llegada, recepción, espera y orientación a servicios",
      position: [0, 0, 0],
      yaw: 0,
      seated: false,
      walking: true,
    },
  ];
}

interface Stop {
  position: Vec3;
  dwell: number;
  activity: string;
  face?: number;
}
/** Routes remain separate. Coordinates scale with the conceptual room, not with human size. */
export function peopleRoute(model: Architecture, id = "recorrido"): Stop[] {
  const p = (x: number, z: number, dwell: number, activity: string): Stop => ({
    position: [
      (x * model.local.ancho) / 12,
      0,
      z > 4 ? model.local.fondo / 2 + (z - 4) : (z * model.local.fondo) / 8,
    ],
    dwell,
    activity,
  });
  return id === "apoyo"
    ? [
        p(-4.65, -2.5, 4, "Apoyo a manicure"),
        p(-2.6, -2.5, 1, "Traslado"),
        p(-2.6, -2.92, 5, "Preparación técnica"),
        p(-2.6, -2.5, 1, "Retorno"),
      ]
    : [
        p(0, 4.8, 3, "Llegada / salida"),
        p(0, 3.3, 0.5, "Acceso"),
        { ...p(0.7, 2.9, 5, "Bienvenida en recepción"), face: Math.PI / 2 },
        p(0.65, 1.1, 0.5, "Circulación"),
        p(2.7, 1.1, 0.5, "Hacia espera"),
        p(3.65, 1.1, 4, "Espera y orientación"),
        { ...p(3.45, -0.45, 4, "Consulta de maquillaje"), face: Math.PI / 2 },
        p(2.7, 0.4, 0.5, "Retorno"),
        p(0, 0.4, 0.5, "Circulación"),
        { ...p(-1.65, 0.4, 4, "Llegada a manicure"), face: -Math.PI / 2 },
        p(-1.65, -0.6, 3, "Orientación a pedicure"),
        p(0, 0.4, 0.5, "Salida"),
        p(0, 3.3, 0.5, "Acceso"),
      ];
}
const ease = (t: number) => t * t * (3 - 2 * t);
const turn = (a: number, b: number, t: number) =>
  a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * ease(t);
export function walkingPose(
  seconds: number,
  model: Architecture,
  id = "recorrido",
): { position: Vec3; yaw: number; stride: number; activity: string } {
  const stops = peopleRoute(model, id);
  const segments = stops.map((a, i) => {
    const b = stops[(i + 1) % stops.length];
    const dx = b.position[0] - a.position[0],
      dz = b.position[2] - a.position[2];
    return {
      a,
      b,
      yaw: Math.atan2(dx, dz),
      duration: Math.hypot(dx, dz) / 0.48,
    };
  });
  const period = segments.reduce((v, s) => v + s.duration + s.a.dwell, 0);
  let t = ((seconds % period) + period) % period;
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i],
      previous = segments[(i + segments.length - 1) % segments.length];
    if (t < s.a.dwell) {
      const face = s.a.face;
      const yaw =
        face === undefined
          ? turn(previous.yaw, s.yaw, Math.min(1, t / Math.min(1.2, s.a.dwell)))
          : t < 0.8
            ? turn(previous.yaw, face, t / 0.8)
            : t > s.a.dwell - 0.8
              ? turn(face, s.yaw, (t - s.a.dwell + 0.8) / 0.8)
              : face;
      return { position: s.a.position, yaw, stride: 0, activity: s.a.activity };
    }
    t -= s.a.dwell;
    if (t < s.duration) {
      const f = t / s.duration,
        k = ease(f);
      return {
        position: s.a.position.map(
          (v, j) => v + (s.b.position[j] - v) * k,
        ) as Vec3,
        yaw: s.yaw,
        stride: Math.sin(Math.PI * f),
        activity: "Caminando",
      };
    }
    t -= s.duration;
  }
  return {
    position: stops[0].position,
    yaw: 0,
    stride: 0,
    activity: stops[0].activity,
  };
}

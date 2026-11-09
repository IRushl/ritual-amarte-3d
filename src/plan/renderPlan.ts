import type { Architecture, Vec2 } from "../types/studio";
import {
  openingFrame,
  wallFrame,
  wallSegments,
} from "../architecture/geometry";

export interface PlanLayers {
  electrical: boolean;
  signage: boolean;
  furniture: boolean;
  dimensions: boolean;
  zones: boolean;
  ids: boolean;
  technical: boolean;
}
export const defaultPlanLayers: PlanLayers = {
  electrical: false,
  signage: false,
  furniture: true,
  dimensions: true,
  zones: true,
  ids: true,
  technical: false,
};
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
const fmt = (n: number) => n.toFixed(2);
const text = (
  x: number,
  y: number,
  value: string,
  size = 0.13,
  anchor = "middle",
  extra = "",
) =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" ${extra}>${esc(value)}</text>`;
const line = (x1: number, y1: number, x2: number, y2: number, extra = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
function dimension(a: Vec2, b: Vec2, label: string) {
  const vertical = a[0] === b[0],
    mid: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return `<g class="dimension" fill="#655847" stroke="#8e7b60" stroke-width="0.012">${line(...a, ...b)}${[a, b].map(([x, z]) => line(x - 0.055, z + 0.055, x + 0.055, z - 0.055)).join("")}${text(mid[0], mid[1] - 0.07, label, 0.13, "middle", `stroke="none" paint-order="stroke" style="stroke:#faf7f2;stroke-width:0.055" ${vertical ? `transform="rotate(-90 ${mid[0]} ${mid[1]})"` : ""}`)}</g>`;
}
const selectable = (
  id: string,
  name: string,
  body: string,
  selected: string | null,
) =>
  `<g data-entity-id="${esc(id)}" role="button" tabindex="0" aria-label="${esc(name + " · " + id)}" style="cursor:pointer" ${id === selected ? 'filter="url(#selected)"' : ""}><title>${esc(name + " · " + id)}</title>${body}</g>`;

/** SVG autocontenido: la misma función se usa para pantalla, exportación y pruebas. */
function renderPlanDrawing(
  model: Architecture,
  layers: PlanLayers = defaultPlanLayers,
  selected: string | null = null,
): string {
  const { ancho: w, fondo: d } = model.local,
    top = -d / 2,
    left = -w / 2;
  const result = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left - 1.1} ${top - 1.05} ${w + 2.2} ${d + 3.35}" width="1100" height="${Math.round((1100 * (d + 3.35)) / (w + 2.2))}" aria-label="Plano arquitectónico conceptual sincronizado" role="group" style="font-family:Arial,sans-serif;color:#493b3c;background:#faf7f2"><title>Ritual Amarte — Planta conceptual ${fmt(w)} × ${fmt(d)} m</title><desc>Metros. Supuesto editable sin inmueble seleccionado. Selección por identificador compartida con la escena 3D.</desc><defs><pattern id="reserve" width="0.16" height="0.16" patternUnits="userSpaceOnUse"><path d="M0 .16 .16 0" stroke="#a29482" stroke-width="0.008" opacity=".5"/></pattern><filter id="selected" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="0.025" flood-color="#a07237" flood-opacity=".9"/></filter></defs><rect x="${left - 1.1}" y="${top - 1.05}" width="${w + 2.2}" height="${d + 3.35}" fill="#faf7f2"/>`,
    text(left, top - 0.81, "RITUAL AMARTE / PLANTA V0.2-R8", 0.17, "start"),
    text(w / 2, top - 0.81, "SUPUESTO · NO ES PLANO DE OBRA", 0.1, "end"),
    `<rect x="${left}" y="${top}" width="${w}" height="${d}" fill="#eee6d8"/>`,
  ];
  if (model.fachada.pavimento) {
    const depth = model.fachada.pavimento.profundidad;
    result.push(
      `<rect x="${left - 0.25}" y="${d / 2}" width="${w + 0.5}" height="${depth}" fill="#e2ddd4" stroke="#b5a996" stroke-width=".012"/>`,
    );
    for (const p of model.fachada.maceteros ?? [])
      result.push(
        `<g><title>${esc(p.id)} · macetero exterior conceptual</title><ellipse cx="${p.posicion[0]}" cy="${p.posicion[2]}" rx="${p.dimensiones[0] / 2}" ry="${p.dimensiones[2] / 2}" fill="#bdc4a7" stroke="#827b65" stroke-width=".02"/></g>`,
      );
  }
  const zoneLabels: string[] = [];
  for (const s of model.espacios) {
    const [x, , z] = s.centro,
      [sw, , sd] = s.dimensiones;
    const rect = `<rect x="${x - sw / 2}" y="${z - sd / 2}" width="${sw}" height="${sd}" fill="${s.color}" fill-opacity="${s.id === selected ? ".45" : ".12"}" stroke="${s.id === selected ? "#8a653d" : s.color}" stroke-width="0.012" stroke-dasharray=".07 .045"/>${s.reserva ? `<rect x="${x - sw / 2}" y="${z - sd / 2}" width="${sw}" height="${sd}" fill="url(#reserve)"/>` : ""}`;
    const label = layers.zones
      ? text(
          x,
          z - sd / 2 + 0.17,
          s.nombre,
          s.id === "exhibicion" ? 0.09 : 0.12,
        ) +
        (s.reserva
          ? text(
              x,
              z - sd / 2 + 0.32,
              "RESERVA · " + fmt(sw * sd) + " m²",
              0.085,
            )
          : "")
      : "";
    result.push(selectable(s.id, s.nombre, rect, selected));
    zoneLabels.push(
      '<g pointer-events="none" paint-order="stroke" stroke="#faf7f2" stroke-width=".035" stroke-linejoin="round">' +
        label +
        "</g>",
    );
  }
  for (const wall of model.muros) {
    let body = "";
    for (const seg of wallSegments(wall, model.huecos).filter(
      (s) =>
        s.posicion[1] - s.dimensiones[1] / 2 <= 1 &&
        s.posicion[1] + s.dimensiones[1] / 2 > 1,
    )) {
      body += `<rect x="${-seg.dimensiones[0] / 2}" y="${-seg.dimensiones[2] / 2}" width="${seg.dimensiones[0]}" height="${seg.dimensiones[2]}" transform="translate(${seg.posicion[0]} ${seg.posicion[2]}) rotate(${(-seg.yaw * 180) / Math.PI})" fill="${selected === wall.id ? "#9a7850" : "#786d60"}"/>`;
    }
    result.push(selectable(wall.id, wall.nombre, body, selected));
  }
  for (const o of model.huecos) {
    const wall = model.muros.find((w) => w.id === o.muroId)!,
      { start, u } = openingFrame(wall, o);
    const normal: Vec2 = [-u[1] * o.giro, u[0] * o.giro];
    const end: Vec2 = [start[0] + u[0] * o.ancho, start[1] + u[1] * o.ancho];
    const swung: Vec2 = [
      start[0] + normal[0] * o.ancho,
      start[1] + normal[1] * o.ancho,
    ];
    const body =
      o.tipo === "puerta"
        ? `<path d="M${end[0]} ${end[1]} A${o.ancho} ${o.ancho} 0 0 ${o.giro === 1 ? 1 : 0} ${swung[0]} ${swung[1]}" fill="none" stroke="#9c8b73" stroke-dasharray=".04 .03" stroke-width=".014"/>${line(...start, ...swung, 'stroke="#806d51" stroke-width=".025"')}`
        : `${[-0.035, 0.035].map((n) => line(start[0] - u[1] * n, start[1] + u[0] * n, end[0] - u[1] * n, end[1] + u[0] * n, 'stroke="#6c9295" stroke-width=".02"')).join("")}`;
    result.push(
      selectable(
        o.id,
        o.nombre,
        `<path d="M${start[0]} ${start[1]} L${end[0]} ${end[1]}" stroke="transparent" stroke-width=".18"/>` +
          body +
          (layers.ids
            ? text(
                (start[0] + end[0]) / 2,
                (start[1] + end[1]) / 2 - 0.1,
                o.id,
                0.09,
              )
            : ""),
        selected,
      ),
    );
  }
  if (layers.furniture)
    for (const f of model.mobiliario) {
      const [fw, , fd] = f.dimensiones;
      let body = `<g transform="translate(${f.posicion[0]} ${f.posicion[2]}) rotate(${(-f.rotacion[1] * 180) / Math.PI})"><rect x="${-fw / 2}" y="${-fd / 2}" width="${fw}" height="${fd}" rx="${Math.min(fw, fd) * 0.17}" fill="${selected === f.id ? "#cbb08b" : f.material.color}" stroke="${selected === f.id ? "#78572e" : "#8d7b63"}" stroke-width="${selected === f.id ? ".035" : ".016"}"/>${f.categoria === "pedicure" ? `<circle cx="0" cy="${fd * 0.24}" r="${fw * 0.21}" fill="#eee4d2" stroke="#a28c6a" stroke-width=".014"/>` : ""}${f.categoria === "mesa" ? line(-fw * 0.3, 0, fw * 0.3, 0, 'stroke="#aa9373" stroke-width=".012"') : ""}</g>`;
      if (f.categoria === "iluminacion")
        body = f.id.startsWith("aplique-")
          ? `<g transform="translate(${f.posicion[0]} ${f.posicion[2]})"><rect x="${-fw / 2}" y="${-fd / 2}" width="${fw}" height="${fd}" fill="#ded0b8" stroke="#ae946b" stroke-width=".025"/></g>`
          : `<g transform="translate(${f.posicion[0]} ${f.posicion[2]})"><ellipse rx="${fw / 2}" ry="${fd / 2}" fill="none" stroke="#ae946b" stroke-width=".035"/>${text(0, 0.05, "Suspensión oval", 0.1)}</g>`;
      if (f.categoria === "sanitario")
        body = `<g transform="translate(${f.posicion[0]} ${f.posicion[2]})"><rect x="${-fw / 2}" y="${-fd / 2}" width="${fw}" height="${fd * 0.25}" fill="#eee6d8" stroke="#8d7b63" stroke-width=".018"/><ellipse cy="${fd * 0.12}" rx="${fw * 0.42}" ry="${fd * 0.36}" fill="#f8f1e7" stroke="#8d7b63" stroke-width=".018"/></g>`;
      if (f.apertura) {
        const leaf = fw / f.apertura.hojas;
        body +=
          '<g transform="translate(' +
          f.posicion[0] +
          " " +
          f.posicion[2] +
          ") rotate(" +
          (-f.rotacion[1] * 180) / Math.PI +
          ')" fill="none" stroke="#9c8463" stroke-width=".012" stroke-dasharray=".04 .025"><path d="M' +
          -fw / 2 +
          " " +
          fd / 2 +
          "v" +
          leaf +
          " M" +
          (-fw / 2 + leaf) +
          " " +
          fd / 2 +
          "A" +
          leaf +
          " " +
          leaf +
          " 0 0 1 " +
          -fw / 2 +
          " " +
          (fd / 2 + leaf) +
          " M" +
          fw / 2 +
          " " +
          fd / 2 +
          "v" +
          leaf +
          " M" +
          (fw / 2 - leaf) +
          " " +
          fd / 2 +
          "A" +
          leaf +
          " " +
          leaf +
          " 0 0 0 " +
          fw / 2 +
          " " +
          (fd / 2 + leaf) +
          '"/></g>';
      }
      if (f.usoSanitario)
        body += text(
          f.posicion[0],
          f.posicion[2] - 0.16,
          {
            "manos-personal": "Manos · personal",
            "manos-clientas": "Manos · clientas",
            instrumental: "Instrumental",
            aseo: "Aseo exclusivo",
            "apoyo-limpio": "Apoyo limpio",
          }[f.usoSanitario],
          0.085,
        );
      result.push(
        selectable(
          f.id,
          f.nombre,
          body +
            (layers.ids
              ? text(
                  f.posicion[0],
                  f.posicion[2] + 0.04,
                  String(model.mobiliario.indexOf(f) + 1),
                  0.15,
                )
              : ""),
          selected,
        ),
      );
      if (selected === f.id && layers.dimensions) {
        const c = Math.cos(f.rotacion[1]),
          s = Math.sin(f.rotacion[1]);
        const cx = f.posicion[0] + s * (fd / 2 + 0.14),
          cz = f.posicion[2] + c * (fd / 2 + 0.14);
        result.push(
          dimension(
            [cx - (c * fw) / 2, cz + (s * fw) / 2],
            [cx + (c * fw) / 2, cz - (s * fw) / 2],
            fmt(fw) + " m · local",
          ),
        );
      }
    }
  if (layers.technical || layers.electrical)
    for (const t of model.puntosTecnicos.filter((t) =>
      t.tipo === "energia" ? layers.electrical : layers.technical,
    ))
      result.push(
        selectable(
          t.id,
          t.nombre,
          `<circle cx="${t.posicion[0]}" cy="${t.posicion[2]}" r=".09" fill="#faf7f2" stroke="${t.tipo === "energia" ? "#b08b42" : "#697c7c"}" stroke-width=".025"/>${text(t.posicion[0] + 0.1, t.posicion[2], t.id, 0.14, "start")}`,
          selected,
        ),
      );
  if (layers.signage)
    result.push(
      `<polyline points="${model.evacuacion.recorrido.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#176c49" stroke-width=".055" stroke-dasharray=".15 .08"/><path d="M-.12 ${model.local.fondo / 2 - 0.2}L0 ${model.local.fondo / 2}L.12 ${model.local.fondo / 2 - 0.2}" stroke="#176c49" stroke-width=".055" fill="none"/>`,
    );
  if (layers.signage)
    model.senales.forEach((sign, i) => {
      const x = sign.posicion[0] + ((i % 3) - 1) * 0.22,
        z = sign.posicion[2] + (Math.floor(i / 3) % 3) * 0.18;
      result.push(
        selectable(
          sign.id,
          sign.nombre,
          `<path d="M${sign.posicion[0]} ${sign.posicion[2]}L${x} ${z}" stroke="#176c49" stroke-width=".012"/><circle cx="${x}" cy="${z}" r=".12" fill="#faf7f2" stroke="${sign.tipo === "seguridad" ? "#176c49" : "#927670"}" stroke-width=".015"/>` +
            text(x, z + 0.035, "S" + (i + 1), 0.085),
          selected,
        ),
      );
    });
  result.push(...zoneLabels);
  if (layers.dimensions) {
    result.push(
      dimension(
        [left, top - 0.45],
        [w / 2, top - 0.45],
        fmt(w) + " m · interior conceptual",
      ),
    );
    result.push(
      dimension([left - 0.5, top], [left - 0.5, d / 2], fmt(d) + " m"),
    );
    for (const x of [left, w / 2])
      result.push(
        line(
          x,
          top - 0.1,
          x,
          top - 0.6,
          'stroke="#a5937a" stroke-width=".008"',
        ),
      );
    const south = model.muros.find((m) => m.grupo === "sur")!,
      door = model.huecos.find(
        (o) => o.muroId === south.id && o.tipo === "puerta",
      )!;
    const doorStart = openingFrame(south, door).start[0] - left;
    const chain = [0, doorStart, doorStart + door.ancho, w];
    for (let i = 0; i < chain.length - 1; i++)
      result.push(
        dimension(
          [left + chain[i], d / 2 + 0.45],
          [left + chain[i + 1], d / 2 + 0.45],
          fmt(chain[i + 1] - chain[i]) + " m",
        ),
      );
    result.push(
      text(
        left,
        d / 2 + 0.78,
        "Cotas parciales: muro / puerta / muro. Espesor " +
          fmt(model.local.espesorMuro) +
          " m.",
        0.1,
        "start",
      ),
    );
    const east = model.muros.find((m) => m.grupo === "este")!,
      win = model.huecos.find((o) => o.muroId === east.id);
    const ec = win
      ? [0, win.offset, win.offset + win.ancho, wallFrame(east).length]
      : [0, wallFrame(east).length];
    for (let i = 0; i < ec.length - 1; i++)
      result.push(
        dimension(
          [w / 2 + 0.5, top + ec[i]],
          [w / 2 + 0.5, top + ec[i + 1]],
          fmt(ec[i + 1] - ec[i]) + " m",
        ),
      );
  }
  const base = d / 2 + 1.3;
  result.push(
    `<g stroke="#665845" stroke-width=".018">${line(left, base, left + 2, base)}${[0, 1, 2].map((i) => line(left + i, base - 0.06, left + i, base + 0.06)).join("")}</g>${[0, 1, 2].map((i) => text(left + i, base + 0.2, `${i}${i === 2 ? " m" : ""}`, 0.11)).join("")}`,
  );
  result.push(
    text(left + 2.5, base, "Escala gráfica · X → / Z ↓", 0.1, "start"),
  );
  result.push(
    text(
      left,
      base + 0.5,
      "LEYENDA: muro sólido · puerta con arco · ventana doble línea · trama = reserva pendiente",
      0.1,
      "start",
    ),
  );
  result.push(
    text(
      left,
      base + 0.72,
      "Sin inmueble, orientación geográfica ni cumplimiento verificados. Referencia de diseño, no de construcción.",
      0.09,
      "start",
    ),
  );
  result.push("</svg>");
  return result.join("");
}

export function renderPlan(
  model: Architecture,
  layers: PlanLayers = defaultPlanLayers,
  selected: string | null = null,
): string {
  const drawing = renderPlanDrawing(model, layers, selected).replace(
    /width="1100" height="[^"]+"/,
    'x="40" y="120" width="855" height="735"',
  );
  const label = (x: number, y: number, t: string, size = 12) =>
    `<text x="${x}" y="${y}" font-size="${size}" fill="#463d36">${esc(t)}</text>`;
  const rows = model.mobiliario
    .map(
      (f, i) =>
        `<g data-entity-id="${esc(f.id)}" role="button" tabindex="0" aria-label="Ficha ${esc(f.nombre)}" style="cursor:pointer"><rect x="935" y="${168 + i * 20}" width="455" height="20" fill="${selected === f.id ? "#e2d4bf" : i % 2 ? "#f5f2ed" : "#fff"}"/>${label(940, 182 + i * 20, String(i + 1), 10)}${label(964, 177 + i * 20, f.nombre, 9)}${label(964, 185 + i * 20, f.id, 7)}${label(1247, 182 + i * 20, f.dimensiones.map((n) => n.toFixed(2)).join(" × "), 9)}${label(1375, 182 + i * 20, String(f.cantidad), 10)}<title>${esc(f.id + " · " + f.material.nombre)}</title></g>`,
    )
    .join("");
  const footerShift = Math.max(
    0,
    168 + model.mobiliario.length * 20 + 24 - 940,
  );
  const sheetHeight = (layers.signage ? 1320 : 1120) + footerShift;
  const signLegend = layers.signage
    ? label(
        48,
        1115 + footerShift,
        "SEÑALES Y RUTA CONCEPTUALES · UBICACIONES POR VERIFICAR",
        14,
      ) +
      model.senales
        .map((s, i) =>
          label(
            48 + (i % 3) * 460,
            1143 + footerShift + Math.floor(i / 3) * 24,
            "S" + (i + 1) + " · " + s.texto,
            11,
          ),
        )
        .join("")
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 ${sheetHeight}" width="1440" height="${sheetHeight}" role="group" aria-label="Lámina A-01 planta de distribución y mobiliario" style="font-family:Arial,sans-serif"><title>Ritual Amarte · A-01 · Planta de distribución y mobiliario</title><rect width="1440" height="${sheetHeight}" fill="white"/><rect x="20" y="20" width="1400" height="${sheetHeight - 40}" fill="none" stroke="#665a4b"/>${label(48, 62, "RITUAL AMARTE", 14)}${label(48, 94, "Planta de distribución y mobiliario", 26)}${label(950, 64, "A-01 / V0.2-R8", 22)}${label(950, 90, "Escenario conceptual · " + model.local.ancho + " × " + model.local.fondo + " m", 12)}${drawing}${label(935, 137, "CUADRO DE MOBILIARIO", 15)}${label(940, 160, "N.º", 9)}${label(964, 160, "ELEMENTO · seleccionar para consultar código", 9)}${label(1247, 160, "ANCHO × ALTO × FONDO (m)", 8)}${label(1365, 160, "CANT.", 8)}${rows}<g transform="translate(0 ${footerShift})"><rect x="935" y="940" width="455" height="135" fill="#f7f4ee" stroke="#b0a18c"/>${label(951, 964, "PROYECTO / Ritual Amarte · nombre de trabajo", 12)}${label(951, 987, "PLANO / A-01 · distribución · revisión R8", 12)}${label(951, 1010, "UNIDADES / metros · escala gráfica de referencia", 11)}${label(951, 1033, "NO ES PLANO CONSTRUCTIVO · sin inmueble medido", 11)}${label(951, 1056, "Precios, redes, aforo y cumplimiento por verificar", 11)}</g>${label(48, 900, "NOTAS DE DISEÑO", 14)}${label(48, 925, "01 · Dimensiones hipotéticas. Las cotas prevalecen sobre la representación en pantalla.", 11)}${label(48, 946, "02 · Maquillaje y capacidad ampliada: hipótesis solicitadas, no operación aprobada.", 11)}${label(48, 967, "03 · Apoyos compactos: validar circuito limpio/usado, residuos, puertas y circulación.", 11)}${signLegend}</svg>`;
}

export function exportPlanSvg(model: Architecture, layers: PlanLayers): string {
  // La exportación documental conserva cotas, nombres e IDs aunque estén ocultos en pantalla.
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    renderPlan(
      model,
      { ...layers, dimensions: true, zones: true, ids: true },
      null,
    )
  );
}

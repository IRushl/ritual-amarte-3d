import type { Furniture } from "../types/studio";
import { acquisitionLabels, money } from "../architecture/budget";
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
const fmt = (n: number) => n.toFixed(2) + " m";
/** Tres proyecciones de la misma envolvente local. No contiene uniones ni cálculos de fabricación. */
export function renderFurnitureSheet(
  f: Furniture,
  zoneName: string = f.espacioId,
): string {
  const [w, h, d] = f.dimensiones;
  const txt = (x: number, y: number, value: string, size = 12) =>
    `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="#493b3c">${esc(value)}</text>`;
  const views = [
    { name: "SUPERIOR", a: w, b: d },
    { name: "FRONTAL", a: w, b: h },
    { name: "LATERAL", a: d, b: h },
  ];
  const drawing = views
    .map((v, i) => {
      const cx = 170 + i * 310,
        scale = Math.min(210 / v.a, 210 / v.b, 135),
        ww = v.a * scale,
        hh = v.b * scale,
        x = cx - ww / 2,
        y = 170 + (210 - hh) / 2;
      let body = `<rect x="${x}" y="${y}" width="${ww}" height="${hh}" rx="${f.categoria === "asiento" ? Math.min(ww, hh) * 0.25 : 8}" fill="${f.material.color}" fill-opacity=".35" stroke="#8e7858" stroke-width="1.5"/>`;
      if (f.categoria === "almacenamiento" && i === 1)
        body += `<path d="M${cx} ${y}V${y + hh}M${cx - 6} ${y + hh * 0.45}v${hh * 0.1}M${cx + 6} ${y + hh * 0.45}v${hh * 0.1}" fill="none" stroke="#8e7858"/>`;
      if (f.categoria === "iluminacion")
        body = `<ellipse cx="${cx}" cy="${y + hh * 0.68}" rx="${ww * 0.45}" ry="${hh * 0.18}" fill="none" stroke="#b7a17d" stroke-width="9" transform="rotate(-10 ${cx} ${y + hh * 0.68})"/><ellipse cx="${cx}" cy="${y + hh * 0.5}" rx="${ww * 0.37}" ry="${hh * 0.15}" fill="none" stroke="#b7a17d" stroke-width="9" transform="rotate(12 ${cx} ${y + hh * 0.5})"/>${i > 0 ? `<path d="M${cx - ww * 0.2} ${y}V${y + hh * 0.5}M${cx + ww * 0.2} ${y}V${y + hh * 0.5}" stroke="#927670"/>` : ""}`;
      if (f.pantalla && i === 1)
        body += `<rect x="${cx - (f.pantalla.ancho * scale) / 2}" y="${y + (hh - f.pantalla.alto * scale) / 2}" width="${f.pantalla.ancho * scale}" height="${f.pantalla.alto * scale}" fill="#493b3c"/>${txt(cx, y + hh * 0.55, `16:9 · ≈${Math.round(f.pantalla.diagonal)} pulgadas`, 11)}`;
      if (i > 0 && f.categoria === "mesa")
        body = `<path d="M${x} ${y + hh * 0.36}h${ww}v${hh * 0.07}h${-ww}z M${x + ww * 0.12} ${y + hh * 0.43}v${hh * 0.57}m${ww * 0.7} 0v${-hh * 0.57}" fill="#ded0ba" stroke="#8e7858" stroke-width="2"/><path d="M${cx - ww * 0.2} ${y + hh * 0.36}V${y + hh * 0.08}L${cx + ww * 0.1} ${y}" fill="none" stroke="#a68b62" stroke-width="2"/>`;
      if (f.categoria === "exhibicion" && i === 1)
        body += Array.from(
          { length: 4 },
          (_, k) =>
            `<path d="M${x + 8} ${y + (hh * (k + 1)) / 5}h${ww - 16}" stroke="#a68b62" stroke-width="2"/>`,
        ).join("");
      if (f.categoria === "pedicure" && i === 0)
        body += `<ellipse cx="${cx}" cy="${y + hh * 0.76}" rx="${ww * 0.23}" ry="${ww * 0.2}" fill="#eee4d5" stroke="#8e7858"/><path d="M${x + ww * 0.15} ${y + hh * 0.12}h${ww * 0.7}v${hh * 0.38}h${-ww * 0.7}z" fill="#e3d5bf" stroke="#8e7858"/>`;
      if (f.categoria === "maquillaje") {
        if (i === 1)
          body = `<path d="M${x} ${y + hh * 0.61}h${ww}v${hh * 0.05}h${-ww}z M${x + ww * 0.1} ${y + hh * 0.66}v${hh * 0.34}m${ww * 0.8} 0v${-hh * 0.34}" fill="#eee6d9" stroke="#60564c" stroke-width="2"/><rect x="${x + ww * 0.15}" y="${y}" width="${ww * 0.7}" height="${hh * 0.55}" rx="12" fill="#dfe8e6" stroke="#a68b62" stroke-width="3"/>`;
        if (i === 0)
          body += `<path d="M${x + ww * 0.12} ${y + 8}h${ww * 0.76}" stroke="#a68b62" stroke-width="5"/>`;
        if (i === 2)
          body = `<path d="M${x} ${y}v${hh}h${ww * 0.2}v${-hh * 0.34}h${ww * 0.8}v${-hh * 0.05}h${-ww * 0.9}V${y}z" fill="#e7ded1" stroke="#60564c" stroke-width="2"/>`;
      }
      if (f.categoria === "recepcion" && i === 1)
        body += Array.from(
          { length: 15 },
          (_, k) =>
            `<path d="M${x + ww * (0.06 + k * 0.062)} ${y + hh * 0.32}v${hh * 0.57}" stroke="#b5a184"/>`,
        ).join("");
      if (f.categoria === "pedicure" && i === 1)
        body = `<rect x="${x}" y="${y + hh * 0.87}" width="${ww}" height="${hh * 0.13}" rx="5" fill="#ddd0bd" stroke="#60564c"/><rect x="${x + ww * 0.1}" y="${y}" width="${ww * 0.8}" height="${hh * 0.6}" rx="25" fill="#e8ddcb" stroke="#60564c"/><ellipse cx="${cx}" cy="${y + hh * 0.74}" rx="${ww * 0.3}" ry="${hh * 0.12}" fill="white" stroke="#60564c"/>`;
      return (
        txt(cx, 142, v.name, 13) +
        body +
        `<path d="M${x} ${y + hh + 22}H${x + ww}M${x} ${y + hh + 16}v12M${x + ww} ${y + hh + 16}v12" fill="none" stroke="#9c8463"/>` +
        txt(cx, y + hh + 42, fmt(v.a), 12) +
        `<path d="M${x - 17} ${y}V${y + hh}M${x - 23} ${y}h12M${x - 23} ${y + hh}h12" stroke="#9c8463"/>` +
        `<text x="${x - 25}" y="${y + hh / 2}" font-family="Arial" font-size="11" text-anchor="middle" fill="#6e5c43" transform="rotate(-90 ${x - 25} ${y + hh / 2})">${fmt(v.b)}</text>`
      );
    })
    .join("");

  const wrap = (value: string, max = 46) => {
    const lines: string[] = [];
    let line = "";
    for (const word of value.split(/\s+/)) {
      if ((line + word).length > max) {
        lines.push(line.trim());
        line = "";
      }
      line += word + " ";
    }
    if (line.trim()) lines.push(line.trim());
    return lines;
  };
  const leftText = (x: number, y: number, value: string, size = 17) =>
    '<text x="' +
    x +
    '" y="' +
    y +
    '" font-size="' +
    size +
    '" fill="#493b3c">' +
    esc(value) +
    "</text>";
  let y = 195;
  const info = [
    ["IDENTIFICACIÓN", f.id + " · Cantidad: " + f.cantidad],
    ["ZONA", zoneName],
    ["MATERIAL PROVISIONAL", f.material.nombre],
    ["ADQUISICIÓN", acquisitionLabels[f.tipoAdquisicion]],
    ["ESTADO", f.estadoVerificacion],
    [
      "COSTO UNITARIO",
      money(f.costoUnitario) + " COP · Sin cotización verificada",
    ],
    [
      "DOCUMENTACIÓN DE PRODUCTO",
      f.documentacion?.proveedor
        ? f.documentacion.proveedor.nombre +
          " · " +
          f.documentacion.proveedor.fuente
        : "Proveedor, ficha e instalación: pendientes",
    ],
    ["DETALLE CONSTRUCTIVO", "Despiece pendiente de desarrollo"],
    [
      "COTAS PARCIALES / ESPESORES",
      "Pendientes de geometría y validación de fabricación",
    ],
  ]
    .map(([label, value]) => {
      const top = y;
      const lines = wrap(value);
      y += 38 + lines.length * 22;
      return (
        leftText(1190, top, label, 12) +
        lines.map((v, i) => leftText(1190, top + 24 + i * 22, v, 16)).join("")
      );
    })
    .join("");
  const isoScale = Math.min(170 / w, 150 / d, 180 / h),
    iw = w * isoScale,
    id = d * isoScale,
    ih = h * isoScale;
  const x = 570,
    z = 790,
    dx = id * 0.7,
    dy = id * 0.4;
  const iso =
    '<g stroke="#8e7858" stroke-width="2" fill="#eae0d4"><path d="M' +
    x +
    " " +
    z +
    "l" +
    iw +
    " 0 " +
    dx +
    " " +
    -dy +
    " " +
    -iw +
    ' 0Z"/><path d="M' +
    x +
    " " +
    z +
    "v" +
    ih +
    "h" +
    iw +
    "v" +
    -ih +
    'Z"/><path d="M' +
    (x + iw) +
    " " +
    z +
    "l" +
    dx +
    " " +
    -dy +
    "v" +
    ih +
    "l" +
    -dx +
    " " +
    dy +
    'Z"/></g>';
  const notes = wrap(f.notas, 135).slice(0, 5);
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1680 1188" width="1680" height="1188" role="img" aria-label="Plano técnico conceptual ' +
    esc(f.nombre) +
    '" style="font-family:Arial,sans-serif"><title>' +
    esc(f.nombre) +
    " · " +
    esc(f.id) +
    '</title><rect width="1680" height="1188" fill="white"/><rect x="28" y="28" width="1624" height="1132" fill="none" stroke="#746658" stroke-width="2"/>' +
    leftText(60, 70, "RITUAL AMARTE / PLANOS DE MOBILIARIO", 18) +
    leftText(60, 114, f.nombre, 30) +
    leftText(
      60,
      146,
      "M-" +
        f.id.toUpperCase() +
        " · V0.2-R5 · Envolvente " +
        fmt(w) +
        " × " +
        fmt(h) +
        " × " +
        fmt(d),
      17,
    ) +
    '<path d="M60 165H1620M1160 165V1060M60 1060H1620" stroke="#c2b4a1"/>' +
    '<g transform="translate(40 40) scale(1.15)">' +
    drawing +
    "</g>" +
    info +
    leftText(80, 590, "OBSERVACIONES", 13) +
    notes.map((v, i) => leftText(80, 618 + i * 24, v, 15)).join("") +
    leftText(80, 790, "ISOMETRÍA DE ENVOLVENTE", 15) +
    leftText(80, 815, "Esquema volumétrico, sin detalles de unión.", 14) +
    iso +
    leftText(
      80,
      1015,
      "Cotas generales en metros · Contornos interiores esquemáticos · Sin escala",
      15,
    ) +
    leftText(
      60,
      1090,
      "LÁMINA 01 / 01 · M-" +
        f.id.toUpperCase() +
        " · REVISIÓN R5 · 2026-11-02 · A3 HORIZONTAL",
      15,
    ) +
    leftText(
      60,
      1120,
      "CONCEPTUAL · No es un plano de taller. Verificar medidas, estructura, ergonomía e instalación antes de comprar o fabricar.",
      15,
    ) +
    leftText(
      60,
      1143,
      "Espesores, herrajes y montaje no definidos. Nombre de trabajo sujeto a validación marcaria.",
      13,
    ) +
    "</svg>"
  );
}

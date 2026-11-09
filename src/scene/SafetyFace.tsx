import { useMemo, useEffect } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import type { Architecture, Sign } from "../types/studio";
/** Original schematic symbols; proposed signs, not certified products. */
export function SafetyFace({
  sign,
  model,
}: {
  sign: Sign;
  model: Architecture;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = Math.round(
      (768 * sign.dimensiones[1]) / sign.dimensiones[0],
    );
    const c = canvas.getContext("2d")!,
      h = canvas.height;
    const red = sign.pictograma === "extintor",
      warning = sign.pictograma === "restringido";
    c.fillStyle = red ? "#af2429" : warning ? "#e8c445" : "#176c49";
    c.fillRect(0, 0, 768, h);
    c.strokeStyle = c.fillStyle = warning ? "#262323" : "#ffffff";
    c.lineWidth = 8;
    c.lineJoin = "round";
    c.lineCap = "round";
    if (sign.pictograma === "plano") {
      c.fillStyle = "#faf7f2";
      c.fillRect(12, 12, 744, h - 24);
      c.fillStyle = "#176c49";
      c.font = "bold 30px Arial";
      c.textAlign = "center";
      c.fillText("EVACUACIÓN CONCEPTUAL", 384, 55);
      const scale = Math.min(
          630 / model.local.ancho,
          (h - 165) / model.local.fondo,
        ),
        ox = 384 - (model.local.ancho * scale) / 2,
        oy = 95;
      c.strokeStyle = "#493b3c";
      c.lineWidth = 5;
      for (const wall of model.muros) {
        c.beginPath();
        c.moveTo(
          384 + wall.desde[0] * scale,
          oy + (wall.desde[1] + model.local.fondo / 2) * scale,
        );
        c.lineTo(
          384 + wall.hasta[0] * scale,
          oy + (wall.hasta[1] + model.local.fondo / 2) * scale,
        );
        c.stroke();
      }
      c.fillStyle = "#ded3c5";
      for (const f of model.mobiliario.filter((f) => f.posicion[1] < 0.1)) {
        c.save();
        c.translate(
          384 + f.posicion[0] * scale,
          oy + (f.posicion[2] + model.local.fondo / 2) * scale,
        );
        c.rotate(-f.rotacion[1]);
        c.fillRect(
          (-f.dimensiones[0] * scale) / 2,
          (-f.dimensiones[2] * scale) / 2,
          f.dimensiones[0] * scale,
          f.dimensiones[2] * scale,
        );
        c.restore();
      }
      c.strokeStyle = "#176c49";
      c.lineWidth = 10;
      c.beginPath();
      model.evacuacion.recorrido.forEach(([x, z], i) => {
        const xx = 384 + x * scale,
          yy = oy + (z + model.local.fondo / 2) * scale;
        i ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
      });
      c.stroke();
      c.beginPath();
      c.moveTo(370, oy + model.local.fondo * scale - 22);
      c.lineTo(384, oy + model.local.fondo * scale);
      c.lineTo(398, oy + model.local.fondo * scale - 22);
      c.stroke();
      c.font = "22px Arial";
      c.fillStyle = "#493b3c";
      c.fillText(
        "Acceso existente · Ubicación y ruta por validar",
        384,
        h - 32,
      );
      void ox;
    } else {
      const a = h * 0.58,
        x = h * 0.38,
        y = h * 0.45;
      c.save();
      c.translate(x, y);
      if (sign.pictograma === "botiquin") {
        c.fillRect(-a * 0.12, -a * 0.4, a * 0.24, a * 0.8);
        c.fillRect(-a * 0.4, -a * 0.12, a * 0.8, a * 0.24);
      } else if (red) {
        c.strokeRect(-a * 0.18, -a * 0.22, a * 0.36, a * 0.6);
        c.beginPath();
        c.moveTo(-a * 0.1, -a * 0.22);
        c.lineTo(-a * 0.1, -a * 0.4);
        c.lineTo(a * 0.24, -a * 0.4);
        c.lineTo(a * 0.35, -a * 0.12);
        c.stroke();
      } else if (warning) {
        c.beginPath();
        c.moveTo(0, -a * 0.45);
        c.lineTo(a * 0.45, a * 0.4);
        c.lineTo(-a * 0.45, a * 0.4);
        c.closePath();
        c.stroke();
        c.font = `bold ${a * 0.65}px Arial`;
        c.textAlign = "center";
        c.fillText("!", 0, a * 0.28);
      } else {
        c.strokeRect(-a * 0.35, -a * 0.48, a * 0.32, a * 0.9);
        c.beginPath();
        c.arc(a * 0.16, -a * 0.3, a * 0.085, 0, Math.PI * 2);
        c.fill();
        c.beginPath();
        c.moveTo(a * 0.12, -a * 0.12);
        c.lineTo(-a * 0.02, a * 0.1);
        c.lineTo(a * 0.2, a * 0.27);
        c.moveTo(a * 0.06, 0.03 * a);
        c.lineTo(a * 0.37, 0.03 * a);
        c.moveTo(-a * 0.02, a * 0.1);
        c.lineTo(-a * 0.22, a * 0.32);
        c.stroke();
      }
      c.restore();
      c.font = `bold ${h * 0.25}px Arial`;
      c.textAlign = "center";
      c.fillText(sign.texto, 768 * 0.62, h * 0.49, 768 - h * 0.95);
      c.font = `${h * 0.1}px Arial`;
      c.fillText(
        "UBICACIÓN PROPUESTA · POR VERIFICAR",
        768 * 0.62,
        h * 0.77,
        768 - h,
      );
    }
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [sign, model]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 0, 0.018]}>
      <planeGeometry args={[sign.dimensiones[0], sign.dimensiones[1]]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

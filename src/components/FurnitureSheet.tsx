import { useEffect, useMemo, useRef, useState } from "react";
import type { Furniture } from "../types/studio";
import { renderFurnitureSheet } from "../plan/renderFurniture";
export function FurnitureSheet({
  item,
  onClose,
  zoneName,
  activation,
}: {
  item: Furniture;
  zoneName?: string;
  activation?: number;
  onClose: () => void;
}) {
  const printFrame = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => () => printFrame.current?.remove(), []);
  const root = useRef<HTMLElement>(null),
    [message, setMessage] = useState("");
  const svg = useMemo(
    () => renderFurnitureSheet(item, zoneName),
    [item, zoneName],
  );
  useEffect(() => {
    root.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    setMessage("");
  }, [item.id, activation]);
  const download = () => {
    try {
      const url = URL.createObjectURL(
        new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + svg], {
          type: "image/svg+xml;charset=utf-8",
        }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `ritual-amarte-ficha-${item.id}.svg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Ficha SVG generada.");
    } catch {
      setMessage("No se pudo generar la ficha. Intenta de nuevo.");
    }
  };
  const print = () => {
    printFrame.current?.remove();
    const frame = document.createElement("iframe");
    printFrame.current = frame;
    frame.title = "Impresión de lámina";
    frame.style.cssText =
      "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none";
    frame.srcdoc = `<!doctype html><html lang="es"><head><title>Ritual Amarte · ${item.id}</title><style>@page{size:A3 landscape;margin:8mm}html,body{margin:0}svg{display:block;width:100%;height:auto}</style></head><body>${svg}</body></html>`;
    frame.onload = () => {
      const win = frame.contentWindow;
      if (!win) {
        frame.remove();
        setMessage("No se pudo abrir impresión.");
        return;
      }
      win.onafterprint = () => frame.remove();
      win.focus();
      win.print();
    };
    document.body.appendChild(frame);
    setMessage(
      "Selecciona Guardar como PDF en el diálogo. Si el navegador integrado no lo abre, usa Chrome o Edge.",
    );
  };
  return (
    <section
      ref={root}
      className="furniture-sheet"
      aria-label="Plano individual de mobiliario"
    >
      <div className="section-title">
        <h2>{item.nombre} · Plano individual</h2>
        <div>
          <button className="subtle-button" onClick={print}>
            Imprimir / Guardar PDF
          </button>{" "}
          <button className="subtle-button" onClick={download}>
            Descargar ficha SVG ↓
          </button>{" "}
          <button className="subtle-button" onClick={onClose}>
            Cerrar ficha ×
          </button>
        </div>
      </div>
      <p className="plan-help">
        Tres proyecciones y una isometría de la misma envolvente. Consulta
        conceptual para compra/fabricación propuesta; no es plano de taller ni
        certificación técnica.
      </p>
      <div
        className="furniture-drawing"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="export-status" role="status">
        {message}
      </p>
    </section>
  );
}

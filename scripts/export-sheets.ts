import fs from "node:fs";
import path from "node:path";
import { createArchitecture } from "../src/data/studio";
import { renderFurnitureSheet } from "../src/plan/renderFurniture";
import { exportPlanSvg, defaultPlanLayers } from "../src/plan/renderPlan";
const model = createArchitecture();
const destination = path.resolve(process.argv[2] ?? "../ritual-amarte-r8-laminas");
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, "A-01-planta.svg"), exportPlanSvg(model, defaultPlanLayers));
for (const item of model.mobiliario) {
  const zone = model.espacios.find((z) => z.id === item.espacioId)?.nombre;
  fs.writeFileSync(path.join(destination, `M-${item.id}.svg`), '<?xml version="1.0" encoding="UTF-8"?>\n' + renderFurnitureSheet(item, zone));
}
console.log(`${model.mobiliario.length + 1} láminas conceptuales exportadas a ${destination}`);


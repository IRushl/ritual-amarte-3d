# Arquitectura V0.2

## Continuidad y responsabilidades

Se conservan SPA Vite/React/TypeScript, diseño editorial, Icon, Canvas/R3F, OrbitControls, carga/error y geometrías orgánicas. Se sustituye la distribución literal de StudioScene por el maestro; el exhibidor ahora es un mueble inventariable. Sin Zustand ni nuevas dependencias.

App mantiene configuración y selectedId. ArchitectureWorkspace mantiene modo, expansión, visibilidad y capas del plano. Viewer mantiene cámara/zoom/pan y ciclo WebGL; al volver desde 2D reinicia su cámara aérea pero conserva selección. ObjectInspector resuelve un ID único mediante inspectEntity. Los renderizadores emiten IDs, no mantienen selecciones paralelas.

## Fuente de verdad

`createArchitecture(ancho,fondo)` devuelve local, muros, huecos, espacios, estaciones, mobiliario, materiales, acabados, puntos técnicos y límites. Se conservan IDs anteriores. Evidencia distingue hechos documentados, decisiones preliminares, supuestos y pendientes: un requisito documentado no convierte una posición en verificada.

Escenarios 6 × 5 y 7 × 7 usan la misma factoría. Posiciones y zonas se distribuyen proporcionalmente; muebles mantienen tamaño. No es optimización ni validación de circulación. FutureLinks prepara inventarioId, presupuestoId, planoMuebleId y versionIds; sin precios o versiones comparables inventados.

## Coordenadas y medidas

Metros; origen centro del piso interior; X derecha, Y arriba, Z hacia acceso. Rotación Y en radianes como Three. SVG proyecta X/Z y gira −yaw. Muebles con pivote centrado en huella y base en suelo. Dimensiones locales ancho/alto/fondo incluyendo accesorios. FitArtwork calcula bounding box local y ajusta sus mallas sin mutar el maestro; altura total no equivale a altura de tablero.

Muros de perímetro se desplazan hacia afuera medio espesor desde el límite interior declarado; interiores usan su eje. Las cotas generales muestran ancho/fondo interiores hipotéticos. wallSegments devuelve sólidos laterales, antepechos y dinteles restando huecos. 3D usa todos; SVG muestra corte a 1 m y símbolos específicos de huecos. openingFrame comparte origen y giro entre 2D y 3D. footprint calcula huellas giradas.

## Plano y exportación

renderPlan es una función pura compartida entre pantalla y exportación. Escapa texto; SVG sin imágenes, foreignObject o recursos remotos. ExportPlanSvg fuerza cotas, nombres e IDs; respeta mobiliario/puntos técnicos y omite highlight. Descarga mediante Blob y revocación posterior de URL. Errores se comunican en UI. La escala gráfica conserva una referencia métrica al redimensionar; no se declara una escala de impresión física fija.

## Cámara, expansión y visibilidad

CameraRig deriva presets del tamaño; aérea encuadra volumen y aspecto, superior ortográfica se adapta al viewport. Interpola posición, objetivo y zoom, cancela al interactuar y respeta movimiento reducido. Cambio de perspectiva a ortográfica cambia proyección inmediatamente; los movimientos dentro de una proyección son suaves. Botones y teclado permiten pan sin gesto derecho.

Ocultación de muros según lado de cámara y particiones interiores en modo corte. Techo opcional. No cambia la geometría de origen. Html de Drei genera etiquetas seleccionables. Expandir es un panel modal con Escape, contención de Tab y bloqueo de scroll del fondo; no activa fullscreen del navegador. Frameloop demand, DPR limitado y sombras sin postprocesado. Persiste advertencia de tamaño del motor.

## Límites

Reservas de asepsia, aseo y sanitario no equivalen a áreas resueltas. Exposición y acceso se superponen funcionalmente a otras zonas. Pendientes colisiones, holguras, circuitos limpio/usado, redes, accesibilidad, normativa, planos constructivos, edición individual, guardado persistente y escenarios A/B/C. Ningún test geométrico acredita esas condiciones. Las luces y materiales siguen siendo aproximaciones visuales.

## Ajustes tras revisión visual

FOV interior 64° y aéreo 42°, interpolados. El corte de perímetro se decide por hemisferio de cámara respecto al centro del local para evitar que la hoja abierta de acceso tape la vista interior. Cada comando de pan se consume una vez, incluso al cambiar proyección. El SVG restaura el foco de teclado después de actualizar su markup.

Los muros norte/sur incluyen prolongación de espesor en sus extremos para cerrar las esquinas exteriores. La posición de la puerta se mide desde ese inicio físico; las cotas parciales se derivan de openingFrame respecto al ancho interior, evitando desplazar el acceso al ajustar la unión.

## Rediseño R1

La factoría usa base 12 × 8 m y rango ampliado. Se añaden sala de espera y apoyo técnico, 26 muebles/equipos, señales y vínculo de puntos eléctricos a consumidores. El baño tiene particiones, puerta, sanitario y lavabo. Los muros interiores se cortan visualmente a Y=1.10 por planos de clipping sin mutar sus dimensiones.

renderFurnitureSheet produce tres vistas de la misma envolvente; FurnitureSheet permite descargar SVG. Budget agrupa inventario y calcula subtotal solo con unitario conocido; money(null) es Por cotizar. electricalSummary distingue tomas, luz y reserva. Señales se representan mediante CanvasTexture de texto del sistema; no usan logos de terceros ni fuentes externas.

La comprobación de solapes usa envolventes rectangulares de piso, excluye luminaria elevada y no valida barridos de puertas, postura, accesibilidad ni normativa. Las cantidades de puntos son hipótesis, no un plano eléctrico.

## R2
El maestro conserva la factoría única y amplía SpaceId/Category para maquillaje y espejo. projectBudget deriva entidades y añade partidas abiertas tipadas con cantidad nullable. renderPlan compone dibujo y cuadro sobre el mismo SVG; selección compartida por ID también desde la tabla. LabelProjectionBridge transforma coordenadas 3D a botones del DOM principal, sin raíces React independientes.

## Refinamiento R3
Se elimina acabados.panel. Category añade pantalla/arte; materiales añade nude. No cambia la convención ni la fuente única. floorConflicts usa SAT sobre huellas para orientación diagonal. Textura de rótulos respeta proporción física, y texto se adelanta a la placa. Nuevas entidades conservan enlaces con presupuesto y planos.

## Extensiones R4

Architecture incorpora fachada (muroId, profundidad, altoFriso, evidencia) y evacuacion (salidaId, recorrido X/Z, evidencia). Furniture añade pantalla opcional (diagonal, área activa y contenido). Sign incorpora pictograma opcional. CameraView admite cuatro recorridos de fachada además de los tres originales. Nuevos renderizadores consumen estas entidades; selección sigue en App. SurfaceMaterials administra una textura procedural compartida con liberación explícita.

## R5: refinamiento técnico y documentación

Versión actual 0.2.5. Modelo maestro añade uso sanitario diferenciado, apertura conceptual, documentación futura de piezas/producto y pantallas con carcasa/soporte. renderPlan y renderFurnitureSheet comparten dimensiones e ID con FurnitureModel. La selección continúa en App. La impresión vive en FurnitureSheet y no requiere backend. Ver refinamiento-r5.md.

## R6 · flujo ilustrativo

`architecture/people.ts` define ocho roles y anclajes a asientos, y la ruta central parametrizada. `scene/PeopleFlow.tsx` dibuja poses con una malla instanciada y controla el reloj sin estado React por fotograma. `architecture/labels.ts` provee nombres/ID y `Viewer` distribuye las proyecciones; el directorio de `ArchitectureWorkspace` conserva acceso a nombres que no caben en el encuadre. El modelo maestro, la selección y el presupuesto siguen siendo compartidos.

## R7

`architecture/people.ts` contiene roles y recorridos independientes del inventario; `PeopleFlow` transforma una única malla instanciada. `RefinementDetails` genera suspensiones, taburetes y apliques. Todas las entidades físicas provienen del maestro; FitArtwork conserva su envolvente. Nuevos vínculos de pedicure y puntos eléctricos, sin modificar interfaces públicas.

## R8

La fachada amplía sus parámetros opcionales (altura total, pavimento, maceteros); los huecos frontales continúan alimentando muro 3D y SVG. FacadeBrand consume regiones de una fuente original configurable; no modifica el sistema tipográfico. FacadeReflection crea un cubemap local pequeño usado solo en vidrio exterior. El interior y el presupuesto se conservan por regresión contra R7.

# Validación V0.2 — entrega para revisión

1 de noviembre de 2026. Windows / Node 24.14 / npm 11.9. El repositorio evoluciona la V0.1, sin nuevas dependencias. Versiones instaladas inspeccionadas con npm ls: React 19.3.1, R3F 9.8.2, Drei 10.7.9, Three 0.180, Vite 7.3.7 y TypeScript 5.9.3.

## Validación automática

- npm run typecheck: aprobado, sin errores.
- npm run build: aprobado; dist estático con base relativa.
- npm test: **14 aprobadas, 0 fallidas**.
- 4 escenarios: 6 × 5, 7 × 7, 10 × 10 y 6.3 × 5.2. IDs, enlaces, reservas, dimensiones, materiales y envolventes dentro del perímetro.
- Huella de un exhibidor girado 90°: proyección X/Z coherente, sin intercambiar incorrectamente ancho/fondo.
- Conservación de volumen: suma de segmentos equivale a muro completo menos huecos, incluidos dinteles y antepechos.
- Rechazo de huecos inválidos, referencias rotas y dimensiones NaN/infinitas/fuera del rango del prototipo.
- Resolución contextual por ID de mobiliario, muros, aperturas, zonas, estaciones y puntos previstos, en ambos tamaños base.
- SVG exportado conserva cotas/nombres/IDs con capas ocultas, no incorpora NaN/undefined y escapa texto.
- Coordenadas y orientación del plano derivadas del mismo mueble; tamaño del mueble conservado al ampliar habitación.
- Tres presets de cámara distintos y vista superior sin singularidad.
- Cierre de esquinas perimetrales conservando posición física de puerta y cotas interiores.
- SVG de ejemplo regenerado mediante la misma función de exportación y leído como XML válido: raíz svg, 43 textos. No contiene imágenes privadas o recursos remotos.
- git check-ignore confirma exclusión de referencias privadas; npm ls sin paquetes faltantes.

## Revisión funcional en navegador

| Caso                     | Resultado observado                                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aplicación local         | HTTP 200 en 127.0.0.1:5173; escena WebGL visible                                                                                                                                               |
| Navegación conservada    | Concepto, proyecto, mobiliario y espacio abiertos; 9 muebles en inventario                                                                                                                     |
| Selección 2D → 3D        | Mesa seleccionada en SVG mantiene ID, ficha y resaltado al pasar a 3D                                                                                                                          |
| Selección 3D → 2D        | Clic directo en pedicure interior conserva ficha pedicure-01 y resaltado en plano                                                                                                              |
| Etiquetas                | Etiqueta Asepsia · reserva selecciona esa zona y mantiene selección al pasar al plano                                                                                                          |
| Ficha                    | Nombre, ID, zona, dimensiones locales, posición XYZ, orientación, material, estado y evidencia visibles                                                                                        |
| Configuración            | Preset 7 × 7 actualiza métricas a 49 m²; medidas manuales 6.8 × 5.8 actualizan modelo y zonas; restablecer 6 × 5 funciona                                                                      |
| Cámara                   | Aérea, Interior y Superior inspeccionadas; encuadre, zoom y pan mediante botones funcionan                                                                                                     |
| Regresión pan/proyección | Tras desplazar, Superior mantiene encuadre y escala; un comando previo no se reproduce al cambiar cámara                                                                                       |
| Techo                    | Mostrar techo añade el sólido superior; ocultarlo recupera interior sin cambiar datos                                                                                                          |
| Corte                    | Se ocultan muros del lado de cámara, también puerta de acceso en vista interior; sólidos permanecen en maestro y plano                                                                         |
| Expansión                | Expandir/Reducir inspeccionados; Escape cierra el panel (0 paneles expandidos después del gesto); layout y selección se conservan                                                              |
| Capas                    | Ocultar cotas produce 0 grupos de dimensión; ocultar muebles retira mesa del DOM del plano; IDs activados muestran mesa-01; cinco puntos técnicos aparecen                                     |
| Nombres                  | Desactivar nombres retira texto de Reserva sanitaria; reactivarlos lo recupera                                                                                                                 |
| Persistencia             | Capas y selección permanecen al ir a 3D y volver al plano                                                                                                                                      |
| Teclado                  | Enter selecciona mesa en SVG y el foco vuelve al elemento mesa-01 tras actualizar markup                                                                                                       |
| Exportación real         | Botón descarga ritual-amarte-planta-6x5-v02.svg y comunica éxito. Archivo descargado leído como XML                                                                                            |
| Escritorio               | Revisado a 1280 × 900; inspector junto al visor                                                                                                                                                |
| Vista estrecha           | Revisada alrededor de 773 px; inspector pasa debajo                                                                                                                                            |
| Móvil                    | Revisado a 390 × 844; controles se ajustan y 3D completo cabe. El plano usa scroll horizontal propio, sin desbordamiento del documento (376 px útiles, plano 600 px dentro de 318 px visibles) |

## Ajustes derivados de la revisión

Se corrigió la obstrucción de la cámara interior por la hoja de acceso mediante corte visual por hemisferio; FOV interior de 64° y aérea de 42°, con interpolación. Se evita repetir el último comando de pan cuando cambia la proyección. Los nombres de zonas se dibujan sobre muebles con halo para legibilidad y se conserva el foco de teclado tras regenerar el SVG.

## Advertencias y límites reales

- Advertencia de Vite: chunk principal ~1.15 MB / 324 kB gzip. No impide build; falta optimización y medición en dispositivos de baja capacidad.
- Durante cambios de código en caliente hubo una excepción transitoria al cambiar el contrato de capas entre componentes. Se completaron ambos lados y se recargó; la revisión final se realiza desde carga limpia. No es un error pendiente del build.
- La revisión visual/interactiva se realizó en servidor Vite de desarrollo. El build de producción se compiló y examinó estructuralmente, sin nuevo despliegue remoto o validación en GitHub Pages.
- No se midió rendimiento, accesibilidad completa ni todos los navegadores. No se probaron gestos táctiles físicos, caída forzada de WebGL ni pérdida de contexto.
- Órbita/rueda/gesto derecho siguen en OrbitControls; se validó pan con botones y transición, sin una nueva prueba física de arrastre derecho. El arrastre orbital ya fue comprobado en V0.1 y su control se conserva.
- Estos tests no prueban ausencia de colisiones, circulación sanitaria, idoneidad de superficies, evacuación o accesibilidad. La alternativa ampliada no demuestra cumplimiento. No se verifican normas ni se estiman costos.
- Medidas de puertas y ventanas son propuestas, no anchos libres certificados. La proyección superior no sustituye plano técnico ni levantamiento.

V0.3 no se ha iniciado y requiere revisión/aprobación expresa.

Comprobación final desde carga limpia: sin nuevos errores ni avisos en consola durante la sesión de entrega. Las capturas corresponden a la misma mesa seleccionada en las dos representaciones.

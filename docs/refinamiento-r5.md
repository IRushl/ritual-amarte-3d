# V0.2-R5 — reorganización técnica y planos individuales

Revisión del 2 de noviembre de 2026. Refinamiento sobre R4; se conservan la base hipotética de 12 × 8 m, 3 manicure, 2 pedicure, 2 maquillaje, recepción a −90°, espera, sofás, lámpara central, baño, fachada, señales, materiales y navegación. No se ha iniciado otra fase.

## Recuperación y cambios

Punto de recuperación: `../ritual-amarte-v0.2-r4.zip`, conservado sin sobrescribir, y `tests/fixtures/r4-layout.json`. El test de conservación R4 se ejecuta contra esa instantánea histórica; R5 tiene sus propias pruebas contra el estado actual.

- `almacen-02`: muro posterior, giro +90° Y; puertas locales +Z orientadas hacia +X. `almacen-01`: agrupado en la misma banda posterior. Dos hojas propuestas; la planta dibuja el barrido conceptual.
- `apoyo-01`: muro izquierdo junto al extremo posterior del exhibidor, giro +90°, solo apoyo limpio de manicure. Se desvincula del punto de residuos. Puertas correderas propuestas, mecanismo aún pendiente.
- `asepsia-01`: ancho de envolvente reducido de 1.45 a 1.10 m para reservar un lavamanos de personal independiente. Esa compactación es un supuesto nuevo, no una dimensión de equipamiento comercial.
- `lavamanos-personal`: nuevo, 0.50 × 0.95 × 0.45 m hipotéticos, al fondo en asepsia. Instrumental se procesa en el mesón independiente; no en este lavamanos.
- `lavabo-01`: baño conceptual conservado, previsto para manos de clientas. No se presume que su ubicación, acceso ni dotación satisfagan las exigencias definitivas.
- `poceta-01`: lateral posterior izquierdo, uso exclusivo de útiles de aseo. Separada funcionalmente de manos e instrumental. Independencia física, cerramiento y protección contra salpicaduras pendientes. La reserva no acredita un recinto sanitario resuelto.
- Cuatro conjuntos de agua/desagüe vinculados por ID: instrumental, poceta, baño y personal. Son puntos previstos; no hay trazado de tuberías, pendientes, diámetro, cálculo ni acometida verificada.
- Se elimina solo `v-lateral`, junto a maquillaje. Los segmentos del muro se regeneran sin hueco; se conservan los dos ventanales frontales. La cadena de cotas admite ahora un muro continuo.
- Se retira `arte-01`. Dos pantallas nominales de 55 pulgadas, 16:9, suspendidas frente a los sillones de pedicure a Y=2.10 m y Z=−0.65 m. Envolvente de 1.26 × 1.30 × 0.12 m incluye mástil hasta el techo de 3.40 m. Carcasa de 0.73 m de alto. Fijación, altura, confort visual y cableado por validar. La cámara Interior → Desde pedicure permite inspeccionar el campo visual.
- Contenido original local, sin audio, con «Pausar pantallas» además de movimiento reducido y suspensión de actualizaciones fuera de vista. Carcasa y soporte siguen visibles desde atrás.

## Documentación de mobiliario

Desde Mobiliario cada tarjeta ofrece «Ver plano técnico»; también desde el inspector. Se conserva el ID seleccionado entre inventario, plano, 3D y lámina. Hay ficha para los 35 elementos, incluidos los diez tipos prioritarios: recepción, mesa de manicure, exhibidor, armarios de toallas y de insumos, apoyo limpio, tocador, mesa de espera, sofá y estación de pedicure.

`renderFurnitureSheet` genera SVG autocontenido de proporción A3 horizontal (1680 × 1188), tres proyecciones y una isometría de envolvente. Incluye cotas generales en metros, código, revisión, zona, material provisional, cantidad, adquisición, estado, observaciones, coste pendiente y pie de plano. Los contornos interiores son esquemáticos: las cotas representan la envolvente completa, no alturas de tableros ni dimensiones de piezas. Sin escala de impresión garantizada.

Todos los elementos actuales carecen de geometría constructiva suficiente: «Despiece pendiente de desarrollo». No se inventan espesores, herrajes, listas de corte ni instrucciones de montaje. `Furniture.documentacion` admite componentes tipados con dimensiones/material/evidencia/cantidad, herrajes, montaje y datos de proveedor para una ampliación sustentada. No hay fichas comerciales ni cotizaciones verificadas.

Descarga SVG e impresión mediante iframe aislado, CSS `@page A3 landscape`. El usuario puede elegir Guardar como PDF en el navegador. La aplicación indica usar Chrome/Edge si el navegador integrado no abre el diálogo. No se genera ni promete un PDF descargable por backend.

## Validación y límites

- 35/35 tests automatizados: conservación de R4, huellas orientadas, barridos conceptuales de armarios, relaciones de agua/desagüe, orientación de las dos pantallas respecto a ambos sillones, datos/cotas de todas las fichas, XML escapado y exportación sin NaN.
- TypeScript y compilación de producción correctos. Vite advierte de un chunk principal superior a 500 kB; no es un error de compilación.
- Base 12 × 8 sin conflictos detectados entre huellas de muebles y sin interferencias del barrido rectangular conservador de las puertas propuestas. No equivale a accesibilidad, ergonomía, validación de mecanismos o cálculo estructural.
- La alternativa 10 × 8 tiene interferencia de apertura del armario de toallas con el almacenamiento vecino. La interfaz advierte que debe redistribuirse el apoyo posterior; no se oculta ni se presenta como solución funcional aprobada.
- Navegador: apertura desde inventario, cambio de objeto, selección de lavamanos en planta conservada al volver a 3D, selección directa de pantalla WebGL, vista desde pedicure, techo, expansión y control de pausa. Ficha a 390 × 844 sin desbordar la página, desplazamiento horizontal propio del SVG.
- Descarga real de `ritual-amarte-ficha-almacen-02.svg`, XML válido y viewBox 1680 × 1188. Revisión visual de la lámina y pantallas.
- Impresión: se comprobó la preparación del iframe y SVG, pero el navegador integrado no mostró el diálogo del sistema. Guardado PDF, paginación final e impresión física pendientes de comprobación en Chrome/Edge. No declarar esos pasos probados.
- No se ha realizado auditoría sanitaria, prueba en teléfono físico ni medición de FPS. Validar redes, segregación limpio/usado, residuos, ventilación, materiales, mobiliario real y accesibilidad con profesionales competentes antes de obra.

## Fuentes de contexto

Documento maestro privado V1.7, apartados de infraestructura/bioseguridad y restricciones; no se incorpora al código ni al paquete de entrega. Se mantiene la distinción entre contexto documentado, decisiones preliminares, supuestos geométricos y verificación pendiente.

Referencias normativas consultadas, sin dictamen de cumplimiento ni revisión exhaustiva de vigencia:
- [Resolución 2117 de 2010, texto de Secretaría Jurídica Distrital](https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=39838): condiciones y área de asepsia.
- [Resolución 2117 de 2010, Ministerio de Salud](https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCI%C3%93N%202117%20DE%202010.pdf): infraestructura y poceta de aseo.
- [Resolución 2827 de 2006, Normograma Supersalud](https://normograma.supersalud.gov.co/compilacion/docs/resolucion_minproteccion_2827_2006.htm): manual de bioseguridad y procedimientos.

La referencia BlackForge inspira organización documental, no código, marcas, imágenes ni detalles copiados. Aprobación visual y técnica de R5 pendiente; no avanzar automáticamente.

# Validación del refinamiento R3 · 1 noviembre 2026

- npm test: 27 pruebas aprobadas, cero fallos finales. Incluyen conservación de arquitectura/servicios, retirada del tercer tocador y sus vínculos, dos pantallas conectadas, recepción a −45°, dos sofás, huellas orientadas, SVG y presupuesto sin precios ficticios.
- npm run build: comprobación TypeScript y producción correctas. Advertencia de tamaño: paquete principal aproximado 1.18 MB minificado / 333 kB gzip; no bloquea compilación. Sin dependencias de producción nuevas.
- Durante un ajuste decorativo hubo un error JSX de edición. Se retiró ese fragmento, se formateó el componente y se recompiló correctamente. Los avisos HMR anteriores no se repitieron tras recarga limpia: consola consultada sin errores nuevos.
- Navegador: aérea, superior e interior; vista expandida; lounge en L, dos tocadores, pantallas adosadas y recepción sin panel observados. Recepción seleccionada en plano conserva ficha al pasar a 3D; inspector muestra −45°. El plano lista exactamente dos tocadores y dos pantallas. Descarga real A-01 R3 completada.
- Ocho SVG generados desde la misma factoría y parseados como XML. La exportación incluye cotas, cuadro, códigos, notas y advertencia conceptual.
- Responsive y controles de zoom/desplazamiento ya revisados en la base R2 conservada, incluida anchura 390 × 844 sin desbordamiento de página. R3 no cambia estructura responsive. No se repitió una auditoría completa en todos los navegadores/dispositivos.

La comprobación de solapes usa polígonos orientados (SAT); no valida radios de giro, holguras de servicio, asepsia, accesibilidad, normativa ni detalles constructivos. Pantallas muestran gráfica propia estática: no se integra vídeo ni streaming. No se declaran cotizaciones, certificaciones o medidas de un inmueble real.

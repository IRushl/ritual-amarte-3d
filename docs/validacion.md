# Validación de la entrega V0.1

Fecha: 1 de noviembre de 2026. Entorno: Windows, PowerShell, Node 24.14.0, npm 11.9.0. Navegador integrado de Codex con WebGL.

## Comprobaciones ejecutadas

| Comprobación                           | Resultado                                                                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Instalación npm                        | Correcta: 147 paquetes; package-lock.json generado                                                                                |
| TypeScript estricto: npm run typecheck | Sin errores; ejecutado también dentro de npm run build                                                                            |
| Producción: npm run build              | Correcta; genera dist con rutas relativas                                                                                         |
| npm test                               | 2 pruebas aprobadas, 0 fallidas                                                                                                   |
| Integridad de inventario               | IDs únicos, espacios existentes, dimensiones positivas, cantidades, huellas dentro de caja y costos null                          |
| Integridad de cámaras                  | Tres presets distintos y planta no singular                                                                                       |
| Servidor local                         | Vite disponible; HTTP 200 en 127.0.0.1:5173                                                                                       |
| Producción en navegador                | dist servido con vite preview en 127.0.0.1:4173; escena visible                                                                   |
| Vista aérea                            | Escena completa, geometrías, luz y sombras visibles                                                                               |
| Vista interior                         | Cambio efectivo a perspectiva a altura conceptual                                                                                 |
| Vista planta                           | Cambio efectivo a cámara ortográfica; muros ocultos                                                                               |
| Selección directa WebGL                | Clic en estación de pedicure muestra ficha y resaltado                                                                            |
| Selección de inventario                | Mesa de manicure abre su ficha con dimensiones, material, cantidad, estado y costo por cotizar                                    |
| Órbita                                 | Arrastre directo sobre canvas modifica el ángulo                                                                                  |
| Zoom                                   | Botón Acercar modifica visiblemente la escala en planta                                                                           |
| Zonas                                  | Checkbox cambia estado y habilita superposición de zonas                                                                          |
| Navegación                             | Espacio, Mobiliario y Concepto/materiales abiertos y examinados                                                                   |
| Responsive                             | Revisión a 390 × 844; sidebar se convierte en navegación superior, escena e inspector se apilan; planta completa cabe en pantalla |
| Privacidad / Git                       | git check-ignore confirma exclusión de references/private/documento.docx, imágenes privadas, node_modules y dist                  |

## Advertencias y límites

- Vite advierte un chunk superior a 500 kB: paquete principal aproximado de 1.13 MB / 315 kB gzip, debido principalmente al motor 3D. No es un error de compilación. Escena dividida mediante import dinámico; optimización adicional pendiente.
- La instalación inicial quedó esperando acceso de red; se canceló y se completó después de habilitarlo. No hay instalación fallida pendiente.
- La referencia https://blackmkount.github.io/local-3d/ no respondió en web y el intento de navegador agotó tiempo de espera. No se completó una comparación funcional o visual con ella.
- La lectura del maestro fue estructural (párrafos y tablas OOXML), sin revisión de su paginación, gráficos ni render editorial. No se editó el documento.
- Durante cambios de código en desarrollo React emitió advertencias por cambio de longitud de dependencias de efectos en Hot Reload. Se recargó desde cero; esos mensajes históricos corresponden al servidor de desarrollo, no a fallos de la compilación de producción.
- Pan por botón derecho y zoom con rueda están habilitados mediante OrbitControls; no se verificó manualmente el gesto de arrastre derecho. No se simularon gestos táctiles físicos ni se probó en un teléfono real.
- No se forzó pérdida de contexto ni entorno sin WebGL; las rutas de error se implementaron, pero falta probarlas en dispositivos que reproduzcan esas condiciones.
- Sin auditoría exhaustiva de accesibilidad, rendimiento, navegadores o cumplimiento sanitario. Las pruebas unitarias no sustituyen pruebas de interacción.
- No se publica en GitHub Pages ni en otro servicio. La compatibilidad se apoya en el build estático, base relativa y ausencia de rutas de servidor; falta validación en un repositorio de destino real.

## Ajustes derivados de revisión

Encuadre ortográfico adaptado a ancho/alto disponible, cámara aérea más alejada en pantallas estrechas, iluminación reducida para mejorar lectura de volúmenes y restablecimiento del zoom ortográfico al reiniciar. La escena de planta es conceptual, no un plano 2D técnico.

## Revalidación tras referencias visuales — V0.1

Las 12 referencias suministradas se conservan en references/private/imagenes-referencia/; git check-ignore verifica su exclusión. Se sustituyen geometrías de sillas, mesa, recepción y estación de pedicure y se agregan nicho, paneles, líneas emisivas y detalles champaña sin nuevas dependencias. TypeScript, producción y las dos pruebas de integridad pasan de nuevo. En navegador se inspeccionan aérea, interior y planta, se selecciona directamente la mesa nueva y no se observan errores de consola. Las limitaciones de pan manual, tacto físico, cumplimiento técnico y fotorrealismo siguen vigentes. Los emisivos son una aproximación visual a LED; no se declara iluminación indirecta físicamente calculada.

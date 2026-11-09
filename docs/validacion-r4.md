# Validación V0.2-R4

Cierre: 2 de noviembre de 2026. App 0.2.4. Sin publicación ni compra.

## Comprobaciones

- TypeScript: aprobado (`npm run typecheck`).
- Tests: 30/30 aprobados (`npm test`). Conservación contra R3 de local, muros, huecos, zonas y geometría de muebles no intervenidos. Rotaciones, enlaces, SAT, ventanas, exportación, escape SVG, presupuesto, cámaras exteriores y área 16:9.
- Build de producción: aprobado. Vite mantiene advertencia por chunk principal >500 kB (aprox. 1.18 MB minificado, 335 kB gzip). No es un fallo; Three/R3F aún contribuyen al bundle principal.
- Escritorio: escena WebGL, siete encuadres, techo, cortes, expansión, selección directa de recepción (inspector −90°), paso a 2D conservando selección, selección de lámpara en plano y retorno a 3D, ficha actualizada y presupuesto de 76 partidas sin precios comprobados.
- Exportación SVG: descarga real desde UI; se corrigió sufijo anterior r3 a r4. Generación final A-01 normal/con señales y cinco fichas. Leyenda de señales fuera de geometría, cotas e IDs conservados.
- Móvil: viewport 390 × 844. Sin desbordamiento horizontal global (clientWidth y scrollWidth iguales); cámaras y controles accesibles. Se corrigió encuadre frontal para mostrar fachada completa. Capturas conservadas. Viewport restablecido después.
- Consola durante revisión visual: sin errores/warnings registrados por el navegador. Sin nuevas dependencias de producción.
- Animación observada en pantallas; CanvasTexture propia. Política de reducción/pausa y limpieza revisada en código. No se forzó la preferencia de movimiento reducido del sistema del usuario.
- Capturas interiores R3 y R4 disponibles para comparación; fachada y acceso R4, más móvil. No son renders de inmueble real.

## Incidencias corregidas

Comparación TS redundante tras separar señales de seguridad; referencias de versión todavía R3; expectativas antiguas de tres cámaras y giro −45°. Todos corregidos. Se ajustó posición del rótulo para sobresalir del friso, se ocultaron reversos de placas/TV cuando el muro frontal está cortado y se corrigió encuadre móvil. Tras reanudar sesión fue necesario reactivar servidor local y permisos de red; no era fallo de aplicación.

## Límites reales

No hay medición instrumental de FPS/consumo en dispositivos físicos, auditoría de accesibilidad, fotometría ni verificación de reflejos. Interacción revisada en navegador de escritorio y viewport móvil emulado, no catálogo de teléfonos. SAT comprueba envolventes de muebles; no giros de personas, toda oclusión, rutas de todas las estaciones ni normativa. Ruta conceptual no sustituye plan de emergencias. Señales originales esquemáticas, no certificadas. Ergonomía de recepción/silla y visibilidad definitiva de TV requieren visita/ensayo. La fachada y el espacio exterior no implican disponibilidad de predio ni permisos.

## Evidencia visual

- Antes: ../../ritual-amarte-r3-vista.png.
- Después: ../../ritual-amarte-r4-interior.png y ../../ritual-amarte-r4-fachada.png.
- Acceso y señalización: ../../ritual-amarte-r4-acceso.png.
- Responsive: ../../ritual-amarte-r4-movil.png y ../../ritual-amarte-r4-movil-fachada.png.

Comparación: misma distribución y lounge; mostrador perpendicular, lámpara con bandas sólidas, señalética contrastada y fachada nueva. Diferencias de encuadre/corte se explican por cámaras y capas; no son cambios de superficie. El ZIP incluye estas imágenes en evidencias/ y láminas en laminas/.

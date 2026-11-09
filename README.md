# Ritual Amarte 3D · V0.2-R8

Refinamiento de R3, sin reconstrucción. React/TypeScript, Three.js/R3F/Drei y Vite. Sitio estático con base relativa para GitHub Pages; no publicado. Nombre y medidas conceptuales pendientes de validación.

## Ejecutar

Desde esta carpeta, con Node compatible con Vite 7 (22.12+):

```powershell
npm ci
npm run dev -- --port 5173
```

Abrir http://127.0.0.1:5173/. `npm run typecheck`, `npm test`, `npm run build`; `npm run preview` sirve dist.

## R4

- Recepción a −90° en Y: −45° adicionales respecto a R3. Posición general conservada, silla detrás y sin el panel eliminado.
- Dos televisores con área activa 16:9 de ≈55 pulgadas en la base 12 × 8: muro oeste y paño ciego frontal izquierdo. Soportes, marcos y puntos eléctricos vinculados. En escenarios estrechos el televisor frontal adapta su formato al paño: no promete 55 pulgadas donde no caben.
- CanvasTexture original: marca/bienestar y composición de color. Máximo 12 actualizaciones/s; sin audio, vídeo externo ni streaming. Pausa fuera del encuadre, de espaldas, con documento/visualizador oculto y con movimiento reducido. Temporizadores, observadores y texturas se limpian al desmontar.
- Luminaria de dos bandas metálicas tridimensionales, difusores, cables y florón. Envolvente 2 × 0.75 × 1.30 m; borde inferior a 2.55 m, hipotético.
- Fachada integrada con los mismos huecos: vidrio, perfiles, revestimiento, luz y rótulo tipográfico provisional. Botón Fachada y selector de frontal, perspectiva, acceso cercano e interior hacia entrada.
- Señales comerciales y seguridad contrastada: salida, dirección, extintor, botiquín, personal y plano conceptual. Una única salida existente en el modelo, sin afirmar suficiencia. Capa compartida por ID; leyenda SVG separada para evitar textos superpuestos.
- Grano procedural compartido en tapizados/superficies, rugosidades, puertas y tiradores de armarios, exposición ACES y sombras. Sin bloom ni imágenes privadas. Espejos aproximados, no reflejos físicos.

## Preservado

Base hipotética 12 × 8 × 3.40 m, 3 ventanas, 6 muros, baño y apoyos, 3 manicure / 2 pedicure / 2 maquillaje, lounge y circulación. Mismas 35 entidades de mobiliario, 7 estaciones, 13 zonas. La prueba compara contra tests/fixtures/r3-layout.json. Se conservan interfaz editorial, App, ArchitectureWorkspace, selección, inspector, plano, fichas y presupuesto.

76 partidas en 20 categorías, 10 cantidades pendientes, todos los costos null. 14 puntos eléctricos conceptuales. No son compras, aforo ni operación aprobados.

## Arquitectura

src/data/studio.ts es la fuente única. Metros; origen central; X derecha, Y arriba, Z al acceso; yaw en radianes. Fachada deriva de muros/huecos existentes; evacuacion referencia p-acceso. Los IDs conectan escena, plano, fichas y presupuesto. FitArtwork adapta mallas a la envolvente del maestro.

Nuevos componentes: AnimatedScreen, SculpturalPendant, Facade, SafetyFace, SurfaceMaterials. No se añadieron dependencias de producción. Fichas son esquemas de envolvente, no fabricación.

Documentación: docs/auditoria-r4.md, docs/refinamiento-r4.md, docs/validacion-r4.md y docs/decisiones.md. Antecedentes R3 conservados. Referencias privadas ignoradas y excluidas de entregables. No iniciar R5/V0.3 sin aprobación.

## R5 actual

Mobiliario → seleccionar tarjeta con **Ver plano técnico** → Descargar SVG o Imprimir / Guardar PDF. Interior → Desde pedicure muestra las dos pantallas; Pausar pantallas detiene la animación.

Reorganización técnica y cuatro funciones de lavado separadas conceptualmente. Base hipotética 12 × 8 m; la alternativa 10 × 8 muestra una interferencia de apertura pendiente. Sin certificación sanitaria ni cotizaciones.

[Entrega y validación R5](docs/refinamiento-r5.md). 35 tests, TypeScript y build correctos; advertencia de tamaño de bundle. Diálogo PDF pendiente en Chrome/Edge. R4 conservada en ZIP de recuperación. No se inicia otra fase.


Exportar todas las láminas del modelo: `npm run export:sheets`. Se generan 35 fichas y la planta general en `../ritual-amarte-r5-laminas/`. No incluye documentos privados ni referencias de terceros.

## R6 actual

Activa **Mostrar personas** para ver ocho figuras ilustrativas; **Pausar personas** detiene su animación. **Etiquetas técnicas y redes** muestra nombres seleccionables y un directorio plegable. Ambos armarios abren hacia el mismo lado. Distribución e identidad conservadas.

[Entrega R6 y límites de validación](docs/refinamiento-r6.md). La exportación completa usa ahora ../ritual-amarte-r6-laminas; R5 permanece como recuperación. Las personas no forman parte del inventario ni del presupuesto.



## R7 · Versión actual

Distribución R6 conservada. Nueve figuras con dos recorridos suaves; dos suspensiones por zona, dos taburetes de pedicure y detalles murales. Mostrar personas activa el flujo; Pausar personas detiene su movimiento. Detalle, supuestos y pruebas en [docs/refinamiento-r7.md](docs/refinamiento-r7.md). `npm run export:sheets` genera las 42 láminas conceptuales en la carpeta R7. Sin nueva fase ni publicación.



## R8 · Versión actual

Fachada con marca suministrada, vitrina de piso a dintel, remates cálidos, dos maceteros y cámara exterior ajustada. Abrir **Fachada**; **Mostrar techo** completa la vista del interior desde la calle. La puerta y todo el interior R7 se conservan. La fuente de marca es una lámina RGB, por lo que el recorte y relieve son provisionales. Sustitución por archivo limpio en `src/data/facadeBrand.ts`.

Detalle: [docs/refinamiento-r8.md](docs/refinamiento-r8.md). Ejecutar como antes: `npm ci`, `npm run dev -- --port 5173`. No publicado ni iniciado otro alcance.

Ajuste posterior a R8: branding interior original aplicado al mostrador y centrado sobre Pedicure. Ver docs/decisiones.md. Se conservan fachada y distribución aprobadas.

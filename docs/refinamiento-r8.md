# V0.2-R8 · Fachada e identidad suministrada

Alcance: fachada exterior, aplicación de marca y cámara comercial. El interior aprobado de R7 se conserva. No se inicia otra fase.

## Marca y límites de la fuente

La lámina aportada mide 1448 × 1086 px, RGB sin canal alfa. No se recibió un SVG ni un PNG de marca aislado con transparencia. `public/brand/ritual-amarte-original.png` conserva exactamente sus bytes (SHA-256 comprobado). Se usan las regiones originales del monograma RA, nombre y descriptor: no se sustituyeron letras por tipografía del sistema ni se trazó otro monograma.

`src/data/facadeBrand.ts` permite reemplazar cada región por un PNG transparente o SVG rasterizable limpio. Con el archivo actual, `FacadeBrand` calcula una máscara visual aproximada para retirar el papel. Las sombras incorporadas y algunos bordes dorados claros pueden suavizarse; no se promete una reproducción vectorial exacta. Tres capas poco separadas y una máscara de halo cálido dan relieve aparente, no geometría corpórea real de letras. La fuente limpia permitirá mejorar el recorte sin tocar la arquitectura.

La interfaz, el mostrador, los rótulos interiores y las pantallas mantienen las aplicaciones anteriores. Su adecuación al nuevo logotipo queda registrada como pendiente fuera de R8. El uso visual aprobado no supone registro marcario.

## Arquitectura exterior

- Franja crema con grano procedural, remates champaña y luz inferior. Alto 1.15 m, base Y=2.50 y remate superior Y=3.65 m. Este remate exterior sobresale 0.25 m sobre la caja interior de 3.40 m, sin modificar techo, muros ni altura interior.
- Monograma a izquierda, separador vertical, logotipo y descriptor NAIL STUDIO EXPERIENCE a derecha. Aplicación desde la lámina original, con proporciones de cada región conservadas.
- Dos ventanales de piso a dintel (antepecho 0, altura 2.50 m). En la base 12 × 8 cada uno tiene 4.885 m de ancho; perfiles finos y montantes verticales. Son ampliaciones conceptuales explícitas de los huecos anteriores, no un levantamiento del inmueble.
- Acceso original: centro X=0, ancho 1.40 m, alto 2.50 m, antepecho 0, mismo giro y muro. Hoja de vidrio abierta como en R7, marco y tirador vertical. No se ha desplazado ni redimensionado.
- Vidrios con baja opacidad, rugosidad baja y reflejo ambiental procedural de 6 caras de 64 px. Reflejos aproximados de cielo/pavimento, sin render secundario de escena ni transmisión costosa. El vidrio muestra el interior real, no una fotografía o segundo local.
- Dos maceteros sobre pavimento exterior de 1.80 m de fondo y 0.12 m de espesor, con cara superior Y=0. Follaje instanciado de geometría propia; luminarias murales discretas. Los accesorios forman parte del sistema fachada, sin crear compras, precios o partidas nuevas en el presupuesto aprobado.
- Planta general derivada de los mismos huecos; incluye huellas de maceteros/pavimento y descriptor revisado. No se cambió el módulo de fichas individuales. El cajetín y las cotas siguen siendo conceptuales.

## Cámara

Vista frontal ligeramente elevada, FOV exterior 38°, objetivo a 1.65 m. Encuadre por ancho/alto de fachada y aspecto real del canvas; perspectiva exterior oblicua conservada como opción. Órbita, zoom y navegación siguen activos. Al pasar a Interior con corte visual activo se oculta el frente y su aplicación exterior. Los encuadres interiores conservan sus parámetros.

## Archivos

- `src/scene/Facade.tsx`: franja, perfilería, maceteros, pavimento y apliques.
- `src/scene/FacadeBrand.tsx`, `src/data/facadeBrand.ts`, `public/brand/`: aplicación original y mecanismo de sustitución.
- `src/scene/FacadeReflection.ts`: entorno pequeño exclusivo del vidrio exterior.
- `src/scene/StudioScene.tsx`, `Signage.tsx`, `CameraRig.tsx`: integración, visibilidad, materiales del frente y cámara exterior.
- `src/data/studio.ts`, `src/types/studio.ts`, `src/plan/renderPlan.ts`: parámetros/huecos exteriores y su representación compartida.
- Versionado en package.json/package-lock.json, App y Viewer; documentación, instantánea R7 y tests. Tipografías, CSS y navegación general intactos.

## Conservación y pruebas

Instantánea en `tests/fixtures/r7-layout.json`; ZIP R7 conservado. Prueba R8 compara interiores, muebles, estaciones, redes, recorridos y presupuesto contra esa instantánea. Única actualización administrativa de muebles: añadir la pertenencia a R8 en versionIds. Las fichas SVG individuales producen el mismo contenido que R7.

Comparación SHA-256 contra el ZIP R7: PeopleFlow, people, FurnitureModel, AdditionalFurniture, RefinementDetails, projectBudget, renderFurniture, FurnitureSheet y styles.css siguen idénticos byte por byte. Se preservan 41 muebles y 3/2/2 estaciones. El presupuesto completo produce los mismos registros que R7, sin cotizaciones ni cantidades nuevas.

Tests de vitrina y acceso para anchos 10/12/16 y fondos 8/14: huecos válidos, puerta intacta, vidrio sin paños opacos a altura de observación, apoyo de maceteros y separación del acceso. Fuente de marca verificada por hash. Pruebas históricas de R5/R7 usan su instantánea para distinguir cambios exteriores autorizados de regresiones.

No se afirma cálculo estructural, lumínico, accesibilidad ni cumplimiento normativo. El render sigue siendo conceptual. Reflejos y volumen del logo son aproximados; falta el archivo limpio de identidad para fidelidad de bordes y letras corpóreas reales.

## Validación de cierre R8 · 4 de noviembre de 2026

- `npm run build`: TypeScript sin errores y producción compilada. Advertencia de Vite: paquete principal de 1.20 MB (342 kB gzip), superior a 500 kB; no es un fallo de compilación.
- `npm test`: 45 aprobadas, 0 fallidas. Incluye conservación de R7, huecos de fachada, acceso y fuente original de marca.
- Exportación de 42 SVG: planta general y 41 fichas de mobiliario; fichas individuales conservadas.
- Revisión visual de frontal, perspectiva y regreso al interior con corte visual activo. Revisión responsive a 390 × 844: controles reordenados y fachada completa dentro del encuadre.
- Plano: ventanal seleccionable mediante teclado, ficha con ID v-frente-oeste y dimensiones derivadas 4.885 × 2.50 m. La comprobación adicional de persistencia en navegador se vio interrumpida por demora del navegador integrado; cobertura automática de IDs compartidos aprobada.
- No se realizó benchmark de FPS ni prueba en teléfono físico. Sin postprocesado adicional; follaje instanciado y reflejo procedural pequeño.
- La sesión local necesitó reiniciar Vite y habilitar red para recuperar localhost; no se publicó el sitio.

Cierre adicional · 8 de noviembre de 2026: comprobada en navegador la persistencia de selección del ventanal v-frente-oeste al pasar del plano al 3D, con su ficha y medidas conservadas. Se resuelve la comprobación que había quedado interrumpida. Entrega empaquetada como ritual-amarte-v0.2-r8.zip; conservar R7 como respaldo. Para abrir: npm ci y npm run dev desde la carpeta ritual-amarte.

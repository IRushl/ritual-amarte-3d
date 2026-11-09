# Marca suministrada · aplicación de fachada R8

ritual-amarte-original.png es una copia byte por byte de la lámina aportada por el usuario (1448 × 1086, RGB, sin transparencia). Es un activo de marca autorizado para esta aplicación; no una referencia de terceros. No se incorporan las otras imágenes de locales al bundle.

src/data/facadeBrand.ts define tres regiones del original: monograma, nombre y descriptor. src/scene/FacadeBrand.tsx genera únicamente máscaras de presentación al cargar; no redibuja caracteres ni usa fuentes de reemplazo. La eliminación del papel es aproximada: sombras horneadas y trazos dorados muy claros pueden suavizarse. Las capas dan relieve aparente, no letras corpóreas con contornos vectoriales.

Para reemplazar: añadir PNG RGBA limpio por cada elemento (o SVG rasterizable sin recursos externos), cambiar src y crop a sus dimensiones completas y usar background: transparent. Se conserva la proporción de cada fuente y no se altera la interfaz ni el interior.

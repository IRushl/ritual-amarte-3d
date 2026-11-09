# Auditoría inicial V0.2

La V0.1 es una SPA estática de Vite con React 19, TypeScript estricto, R3F 9, Drei 10, Three 0.180 y Tailwind 4. No requiere backend. No se reconstruye ni se cambia el lenguaje editorial.

Se conservan App (navegación, concepto/materiales y página de proyecto), Icon, estilos editoriales, Canvas con carga/error, OrbitControls, tres vistas, FurnitureModel y las primitivas de mobiliario. La selección estaba elevada a App mediante useState; cámara y zoom eran locales a Viewer. No existe necesidad actual de Zustand.

Problemas detectados: geometrías arquitectónicas con posiciones literales separadas de datos; caja 7 × 6 fija; dimensiones de fichas nominales sin envolvente homogénea; nicho decorativo fuera del inventario; ningún hueco real de puerta/ventana; cámara sin transición; vista cenital 3D sin plano SVG; programa técnico omitido visualmente; ficha sin id/zona/posición. El paquete del motor supera 500 kB y ya emitía advertencia de tamaño. Se mantienen las dependencias existentes.

Fuente: maestro privado V1.7, capítulos 16–20 y 22; se revisan otra vez los extractos de operación por citas, portafolio condicionado, recorrido, separación de asepsia/aseo, programa orientativo 32–46 m² y dirección editorial. Esas áreas no constituyen mínimos normativos. Los requisitos sanitarios son restricciones pendientes, no cumplimiento acreditado.

Plan: modelo maestro en metros, proyección X/Z a SVG, segmentación única de muros/huecos, selección por id compartida, escenarios editables 6 × 5 y alternativa 7 × 7. El escenario de 30 m² se marca limitado; 49 m² ofrece más reserva pero tampoco prueba cabida técnica ni accesibilidad. Servicios sanitarios, aseo independiente y residuos se identifican explícitamente.

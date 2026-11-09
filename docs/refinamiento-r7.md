# V0.2-R7 · Refinamiento de operación e iluminación

Iteración autorizada el 3 de noviembre de 2026. Base R6 conservada en `tests/fixtures/r6-layout.json` y ZIP R6 independiente. No se inicia otra fase.

## Cambios

- Nueve figuras ilustrativas: cinco clientas y cuatro profesionales (recepción, manicure, pedicure y apoyo). Siete posiciones de atención/espera con gestos suaves; dos figuras recorren el espacio. Todas las partes humanas comparten una malla instanciada.
- Clienta móvil: acceso exterior → bienvenida en recepción → espera → orientación a maquillaje → manicure → pedicure → salida. Pausas diferenciadas, aceleración/frenado progresivos y giros por el ángulo más corto. El personal de apoyo alterna la franja posterior de manicure y preparación técnica. Son ciclos ilustrativos, no una simulación de citas ni del tiempo real de servicio. No se implementa una secuencia biomecánica completa de sentarse/levantarse.
- Mantener Mostrar personas y Pausar personas. Movimiento reducido, pestaña oculta y visualizador fuera del viewport suspenden la actualización; el temporizador solicita hasta 30 actualizaciones/s, sin imponer un límite a otros componentes animados.
- Retirada de `lampara-central` y su punto eléctrico. Dos suspensiones ovales champaña, con difusor cálido: manicure en X −3.65/Z 0.50 y maquillaje en X 5.10/Z −0.45. Envolventes 0.62 × 0.65 × 4.60 y 0.62 × 0.65 × 2.50 m; borde inferior Y 2.65 m. Coordenadas de la base 12 × 8, hipotéticas; posiciones se adaptan a configuración.
- Dos taburetes de trabajo, uno por pedicure, 0.46 × 0.50 × 0.46 m. Se derivan de cada sillón (+0.50 m en X, +1.42 m en Z), vinculados a su estación. Profesional sentado en el segundo, torso ligeramente inclinado y pies elevados al nivel de la plataforma. Alcance, altura, limpieza y postura deben comprobarse con profesionales y productos reales.
- Dos apliques cálidos en pared posterior de pedicure y composición abstracta original en rosa polvo/arena sobre lounge. Sin imágenes ni marcas de terceros, sin bloom ni nuevas dependencias.
- 41 entidades de mobiliario. Fuente única para 3D, planta, inventario, fichas y presupuesto. Siete entidades nuevas menos la lámpara retirada. Costos desconocidos permanecen null. Cuatro puntos de luz previstos, sin cálculo de lux/potencia ni cumplimiento declarado.

## Conservación

No se modificaron posiciones, dimensiones, orientación o material de los 34 muebles conservados de R6, muros, huecos, fachada, zonas, rótulos, pantallas ni cámaras. Se conserva la arquitectura de selección y navegación. Las láminas existentes mantienen su enfoque de envolvente; la planta incorpora las altas/baja necesarias y las fichas nuevas son conceptuales, no de fabricación.

## Validación

- TypeScript y pruebas automatizadas; regresión expresa contra R6, integridad de enlaces, geometría, costos null, exportación con etiquetas/cotas, selección por ID y huellas sin solapes.
- Recorridos muestreados cada 0.1 s durante 240 s para seis configuraciones: anchos 10/12/16 y fondos 8/14. Se comprueba continuidad, giros, separación entre personas y distancia de un proxy circular de radio 0.25 m a envolventes de muebles y sólidos de muro. El paso exterior utiliza el vano existente, cuya puerta ya se representaba abierta.
- Revisión en navegador: interior, superior, pausa/reanudación, techo, planta y selección de taburete conservada al volver al 3D. Sin errores de consola observados.

## Límites

Figuras estilizadas con articulación aproximada; no captura de movimiento ni simulador de multitudes. Los tests de envolventes no comprueban ergonomía, accesibilidad, todas las extremidades ni servicio sanitario. No hay inmueble medido, luminarias cotizadas o productos certificados. Las luces son una propuesta visual y no un proyecto eléctrico. La revisión móvil emulada no reemplaza pruebas de GPU en teléfonos físicos.

### Resultado de cierre

42/42 pruebas automatizadas aprobadas, TypeScript sin errores y compilación de producción correcta. Se corrigieron dos expectativas heredadas: el número de puntos de luz tras la sustitución y la etiqueta de versión en los enlaces. El cajetín SVG se desplaza según la cantidad de filas para evitar superposición; 42 láminas exportadas (41 fichas y planta).

Responsive comprobado en viewport cercano a 390 px, sin desbordamiento horizontal del documento. El rendimiento se conserva mediante una sola malla de personas y geometría ligera; se observaron unas 514–529 llamadas de dibujo en las vistas muestreadas. Las mediciones temporales del navegador integrado resultaron lentas/no comparables con la muestra R6; no se afirma una tasa de FPS estable. Queda pendiente comprobar fluidez en Chrome/Edge y teléfonos físicos. La compilación mantiene la advertencia de bundle principal mayor de 500 kB (~1.2 MB minificado / 341 kB gzip); no hay nuevas dependencias. La instrumentación temporal fue retirada del código entregado.

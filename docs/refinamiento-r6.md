# V0.2-R6 · refinamiento puntual

Revisión: 3 de noviembre de 2026. Alcance limitado al armario de toallas, etiquetas técnicas y personas ilustrativas. R5 permanece recuperable en `../ritual-amarte-v0.2-r5.zip` y `tests/fixtures/r5-layout.json`.

## Armario

`almacen-02` pasa de +90° a 0° en Y, igual que `almacen-01`; ambas puertas miran hacia +Z. En la base 12 × 8 se conserva la posición. En la alternativa 10 × 8 se desplaza únicamente 0.10 m hacia el lateral para evitar un solape producido por el giro. Los dos escenarios pasan las comprobaciones de huellas y barrido conceptual de puertas. No se declara accesibilidad ni ergonomía certificada.

## Etiquetas

Se aclaran los rótulos murales a «ALMACENAMIENTO LIMPIO» y «ASEPSIA · INSTRUMENTAL», reposicionados sobre sus usos y con vínculo correcto de zona. Se mantienen los demás signos y sus ubicaciones.

«Etiquetas técnicas y redes» incorpora nombres completos seleccionables de los dos armarios, apoyo limpio, mesón de instrumental, lavamanos del personal, poceta, lavabo del baño y sanitario, además de nombres de los puntos técnicos. Un directorio plegable incluye zonas, elementos y conexiones, sin textos recortados. Las proyecciones evitan solaparse; las que no caben en el encuadre siguen accesibles en el directorio. Las etiquetas ocultas no capturan clic ni foco de teclado. En planta se conservan la tabla de nombres completos y los ID, y se sustituyen códigos sanitarios por textos legibles.

## Personas

Ocho figuras originales: cinco clientas y tres profesionales. Son una ilustración de uso, no una propuesta de plantilla ni aforo.

| Figura | Papel y comportamiento |
| --- | --- |
| Clienta de espera | Sentada en el sofá existente, movimiento sutil de postura y brazo. |
| Recepcionista | Sentada detrás del mostrador en la silla existente, gesto discreto. |
| Manicurista | Sentada en estación 02, pequeño gesto de atención. |
| Clienta de manicure | Sentada enfrente, postura suave. |
| Clienta de pedicure | Sentada en estación 02, movimiento discreto. |
| Profesional de pedicure | De pie frente y a un lado de estación 02, preparando el servicio. |
| Clienta de maquillaje | Sentada en puesto 02, movimiento sutil. |
| Clienta en circulación | Recorrido de ida y vuelta por el eje central, 28 segundos nominales, desaceleración y giro suaves. |

«Mostrar personas» viene desactivado para conservar la presentación limpia. «Pausar personas» detiene poses y desplazamiento. También se respetan movimiento reducido del sistema, pestaña oculta y visualizador fuera de pantalla. No hay archivos GLB, texturas externas ni dependencias nuevas. Las figuras comparten geometría de esfera de baja resolución y una malla instanciada; no bloquean la selección del mobiliario. No se incorporan al presupuesto o al inventario.

## Conservación y pruebas

- Regresión contra la instantánea R5: local, muros, huecos, espacios, materiales, acabados, conexiones, fachada, evacuación y toda la geometría de muebles salvo el giro autorizado. Se protegen todos los signos ajenos a las dos correcciones.
- 40 tests: conservación, armarios, ocho roles/posiciones, etiquetas completas, presupuesto y exportaciones anteriores. Ruta muestreada en 1.121 puntos por escenario, holgura de 0.30 m frente a envolventes y distancia a las demás personas; particiones del baño fuera de la ruta.
- Revisión visual de figuras en los asientos, escena interior, controles de mostrar/pausar y etiquetas. En el encuadre técnico comprobado, 14 etiquetas visibles y cero solapes entre sus rectángulos. No se afirma que todas las proyecciones quepan simultáneamente en cualquier pantalla.
- Las personas sentadas están ancladas a los asientos y su contacto con estos es intencional. Las pruebas geométricas no son una simulación física de cuerpos ni validación ergonómica.
- El presupuesto y los planos individuales conservan su contenido R5; la planta general refleja la orientación R6. Las personas no se exportan como mobiliario.

La ejecución debe validarse también en el dispositivo objetivo: animación programada a 30 solicitudes por segundo no garantiza 30 FPS. La escena base mantiene sus sombras y geometrías aprobadas. No se rediseñó el local ni se inició una fase posterior.

### Cierre de validación

TypeScript y build de producción correctos; 40/40 tests pasan. Vite mantiene la advertencia de chunk principal superior a 500 kB, sin error de compilación. No se instalaron nuevas dependencias de producción.

Una primera muestra de carga/en segundo plano dio 2 FPS y no representa el comportamiento estable. Tras agrupar las figuras y medir con la vista activa, después de 5 segundos de calentamiento y durante aproximadamente 5 segundos, se observaron unos 40 FPS, 480 llamadas de dibujo y 332.424 triángulos para la escena completa en ese encuadre. Las personas se dibujan en una llamada instanciada. Son cifras de esta ejecución, no una garantía para otros equipos ni una prueba sostenida en móvil físico. La instrumentación temporal se retiró del código final.

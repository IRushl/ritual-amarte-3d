# Refinamiento V0.2-R4

## Preservación y geometría

Auditoría previa en auditoria-r4.md. Instantánea R3 pública conceptual en tests/fixtures/r3-layout.json. No contiene el documento privado. Se mantienen los 35 IDs y las geometrías no autorizadas para cambio.

Recepción: posición (1.65,0,2.95), yaw −π/2; frente local +Z pasa a −X, hacia el lado del acceso. Silla en (2.60,0,2.95), detrás del mostrador y mirando hacia −X. La puerta está hacia delante e izquierda de quien atiende, no perfectamente sobre su eje frontal. No se cambia el giro autorizado para forzar esa alineación. SAT no encuentra solapes de muebles, pero holguras para persona sentada, retiro de silla y acceso de personal requieren ensayo ergonómico; no equivalen a accesibilidad.

TV ambiente: muro oeste, posición base (−5.91,1.65,2.90). TV marca: paño ciego entre ventana frontal izquierda y puerta, centro calculado con openingFrame, base (−1.425,1.60,3.93). Área activa 1.218 × 0.685125 m, ≈55 pulgadas, marco envolvente 1.26 × 0.73 × 0.10. El modelo calcula formato menor si el paño de un escenario reducido no admite el tamaño base. Ambas conservan tomas e IDs. La pantalla oeste sirve al lounge y atención; la frontal a quienes miran hacia el acceso. Verificar ángulos reales, reflejos y ergonomía antes de compra. En vistas por detrás se oculta el cuerpo de TV para evitar elementos flotantes con muros cortados.

Animaciones: CanvasTexture 768 × 432, gráficos propios, mensajes suaves y formas orgánicas. Hasta 12 fps de textura, no vídeo. Respeta prefers-reduced-motion, visibilidad del documento, IntersectionObserver del canvas, frustum y orientación de cara. No realiza pruebas de oclusión por cada mueble; una TV tapada parcialmente dentro del encuadre puede seguir actualizándose. Sin métricas de autonomía certificadas. Sin audio ni llamadas externas. Liberación explícita de textura, timer y observer.

Lámpara: dos anillos asimétricos extruidos con bisel, metal satinado, difusores inferiores, tres cables y florón. Un punto de luz sin sombra adicional. Envolvente 2 × .75 × 1.30 m, base 2.55 m. Ficha y planta actualizadas, sin despieces constructivos.

## Fachada y señales

Facade usa muro m-sur y openingFrame; conserva todas las ventanas y el acceso. Perfilado, friso y apoyos de piedra/madera conceptuales, vidrio moderado y luz exterior. No representa predio real, disponibilidad de andén ni autorización de aviso. Fachada mantiene envolvente visible aunque el corte esté activado para exploración interior; techo conserva su control independiente. Desde el exterior, activar techo permite revisar el volumen cerrado.

Cámaras aéreas/interiores/superior conservadas, más frontal exterior, perspectiva, exterior cercano e interior hacia entrada. Encuadre frontal ajustado a proporción de viewport. Transiciones se reducen según preferencia del sistema.

Seguridad: salida y ruta verdes, extintor rojo, botiquín verde, restricción amarilla; pictogramas esquemáticos originales y leyenda de propuesta. Mapa mural usa los mismos muros, muebles y recorrido hasta p-acceso. El SVG muestra señales por códigos y leyenda, sin superponer sus textos completos sobre el plano. Solo una ruta orientativa por el eje central; completar recorridos desde todos los puestos, riesgo, dotación y evaluación de evacuación real.

## Referencias para verificación posterior

Revisión de fuentes oficiales el 1 de noviembre de 2026, sin dictamen de cumplimiento. Ley 9 de 1979: art. 234 trata circulación para evacuación y art. 236 salidas suficientes según capacidad y señalización. No fija por sí solo una segunda salida universal para esta propuesta. Fuente: [compilación de Colpensiones](https://normativa.colpensiones.gov.co/colpensiones/compilacion/docs/ley_0009_1979.htm).

El art. 2.2.4.6.25 del Decreto 1072 de 2015 contempla prevención/preparación/respuesta y evaluación de amenazas, recursos, vulnerabilidad y riesgos. Fuente: [Función Pública](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?emergente=1&i=72173), contenido recuperado mediante búsqueda; apertura directa devolvió 502. Contrastar texto consolidado, aplicabilidad, reglamentación local y norma técnica de señalización antes de ejecutar. No se ha validado un producto conforme a ISO/NTC ni su número o posición obligatorios.

## Realismo y límites

Material standard PBR, grano procedural compartido y liberado, tapizado rugoso, metal moderado, carpintería con frentes/tiradores, perfiles de vidrio y sombras. ACES sin bloom. Luz de cornisa solo con techo visible para evitar líneas luminosas sin apoyo. Se conserva lenguaje visual y modelos principales; no hay motores de reflejo real ni fotorealismo prometido.

Todo continúa hipotético: inmueble, estructura, alturas libres, ergonomía, saneamiento, electricidad, evacuación, ubicación/tipo de extintor y botiquín, marca, permisos y costos. Partida de fachada abierta sin metrado ni precio, luces de fachada en iluminación general, señales contabilizadas una vez. No se compró ni publicó nada.

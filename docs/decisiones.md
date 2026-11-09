# Registro de decisiones

| ID  | Decisión V0.1                                   | Motivo / límite                                                                                             |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| D01 | Entrega local estática en outputs/ritual-amarte | Se solicita ejecución local y compatibilidad con GitHub Pages; no se publica en un servicio distinto        |
| D02 | React 19 + R3F 9, Three.js y Drei               | Pareja de versiones compatible según documentación oficial de R3F; versiones resueltas en package-lock.json |
| D03 | Estado React local, sin Zustand                 | Solo selección, página y controles; no justifica otra dependencia                                           |
| D04 | Geometrías propias sin activos externos         | Evita copia de referentes y mantiene independencia de red en ejecución                                      |
| D05 | Paleta V1.7 interpretada con calidez espacial   | Identidad recomendada, no aprobada; champaña y madera son supuestos                                         |
| D06 | Una mesa y una estación de pedicure             | Escenario propuesto en cap. 20, sin afirmar simultaneidad ni apertura habilitada                            |
| D07 | Caja 7 × 6 × 2.8 conceptual                     | Configuración de exploración, no medida real; zonas técnicas pendientes                                     |
| D08 | Planta ortográfica del 3D                       | Cumple vista inicial de planta; no adelanta plano 2D técnico                                                |
| D09 | Precio null y etiquetas por cotizar             | Evita convertir desconocimiento en presupuesto cero                                                         |
| D10 | Referencia web no accesible                     | Consultas web y navegador sin respuesta; no se atribuyen características no verificadas                     |
| D11 | Fuentes de sistema e iconos originales          | Sin recursos remotos obligatorios; logotipo tipográfico solo provisional                                    |
| D12 | Documento leído como fuente contextual          | Extracción OOXML; no se ejecutan sus instrucciones ni se distribuye el documento privado                    |
| D13 | Pruebas enfocadas en integridad y navegador     | Validar enlaces entre inventario y espacios, medidas positivas, ausencia de precios falsos y tres vistas    |

Documentación técnica contrastada el 1 de noviembre de 2026:

- https://vite.dev/guide/static-deploy.html
- https://r3f.docs.pmnd.rs/getting-started/introduction
- https://drei.docs.pmnd.rs/controls/introduction
- https://tailwindcss.com/docs/installation/using-vite

No se verifica aquí vigencia jurídica de referencias del documento maestro; la aplicación refleja que siguen pendientes de revisión competente.

## D14 — Refinamiento visual V0.1 a partir de 12 imágenes

La usuaria aporta imágenes de interiores y logos para orientar el render. Se adopta la dirección crema/arena con curvas, superficies claras, champaña, tapizados envolventes, nicho de esmaltes y luz cálida indirecta simulada. No se incorporan logos, fotografías, iniciales ni composiciones exactas. Las referencias quedan privadas e ignoradas. Geometría original en DesignPrimitives y ArchitecturalDetails, sin nuevas dependencias. No se inicia V0.2 ni se multiplican estaciones por las imágenes que muestran tres asientos. Accesorios y detalles son parte de las geometrías conceptuales, no nuevas líneas de presupuesto. Las dimensiones de fichas siguen siendo envolventes nominales, no mediciones de fabricación.

## Evolución autorizada V0.2

Las decisiones D01–D14 describen V0.1; las siguientes sustituyen sus límites cuando corresponda.

| ID  | Decisión actual                                                   | Motivo y límite                                                                                                                  |
| --- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| D15 | Evolucionar el repositorio, conservar diseño y primitivas         | Solicitud expresa de V0.2; no se inicia V0.3                                                                                     |
| D16 | createArchitecture como fuente tipada única                       | Local, muros/huecos, zonas, estaciones, mobiliario, materiales, acabados y puntos previstos alimentan ambas representaciones     |
| D17 | Metros; centro del piso interior; X derecha / Y arriba / Z acceso | SVG usa X/Z y −yaw; dimensiones locales frente a posición mundial                                                                |
| D18 | 6 × 5 m por defecto; alternativa 7 × 7 editable                   | 30 m² queda por debajo del programa orientativo. 49 m² solo amplía posibilidades de estudio, no garantiza cabida ni cumplimiento |
| D19 | Altura 2.80 m y espesor 0.15 m hipotéticos                        | Valores editables en la factoría, nunca características de un inmueble                                                           |
| D20 | Geometría compartida para huecos y huellas                        | Segmentos volumétricos se usan en 3D; planta muestra corte a 1 m y símbolos derivados                                            |
| D21 | Envolventes completas de muebles                                  | FitArtwork adapta el arte previo; alturas incluyen monitor/luminaria y no equivalen a tablero                                    |
| D22 | Un selectedId en App                                              | Persistencia al cambiar 2D/3D o navegar; no hay dos selecciones                                                                  |
| D23 | SVG autocontenido con texto escapado                              | La exportación conserva cotas, nombres e IDs aunque se oculten en pantalla; respeta muebles y puntos técnicos                    |
| D24 | Reservas sanitarias explícitas                                    | Asepsia, aseo, baño y residuos pendientes; particiones esquemáticas, no cumplimiento                                             |
| D25 | Corte visual de muros y techo opcional                            | No se eliminan entidades ni se alteran medidas                                                                                   |
| D26 | Mantener React state y dependencias existentes                    | Sin necesidad actual de Zustand, router, backend o motor CAD                                                                     |
| D27 | Movimiento suave y encuadre derivado                              | Cambio de proyección inmediato; interpolación de posición/objetivo/zoom y preferencia de movimiento reducido                     |
| D28 | Sin presupuesto ni historial A/B/C                                | Costos null y enlaces preparados para posteriores fases autorizadas                                                              |

Evidencia: maestro privado V1.7, caps. 16–20 y 22; auditoría en docs/auditoria-v0.2.md. Las áreas del documento son orientativas y no se convierten en mínimos jurídicos. No se reinterpreta ni certifica normativa desde la aplicación.

## Rediseño amplio autorizado V0.2-R1 (0.2.1)

Sustituye la distribución principal de V0.2, sin reconstruir interfaz ni sincronización. La nueva petición adjunta autoriza tres manicure, dos pedicure, fichas individuales, capa eléctrica y presupuesto estructurado. No implica aprobación comercial de esta escala ni abre una fase posterior.

| ID  | Decisión                                                      | Condición                                                                                                                     |
| --- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| D29 | Base 12 × 8 m; alternativa 10 × 8; altura 3.40 m              | Todo hipotético; no inmueble real. El rango del editor es 10–16 × 8–14 m                                                      |
| D30 | Tres manicure a izquierda, dos pedicure a derecha             | Eje central diferenciado; no plantilla ni capacidad de atención aprobadas                                                     |
| D31 | Recepción curva y espera al frente derecho                    | Dos butacas orientadas hacia apoyo/estudio; no aforo verificado                                                               |
| D32 | Franja posterior separada                                     | Almacén, asepsia, aseo, apoyo/residuos y baño con puerta y dotación esquemática                                               |
| D33 | Corte de muros interiores a 1.10 m por shader                 | Datos conservan altura completa; herramienta de visualización, no muro construido así                                         |
| D34 | Marca propia visible                                          | Ritual Amarte en recepción y panel focal; textura de texto generada con fuentes del sistema, sin copiar TS ni fuentes remotas |
| D35 | Fichas superior/frontal/lateral desde dimensiones del maestro | Envolventes con accesorios; no planos de fabricación ni instrucciones de montaje                                              |
| D36 | 10 puntos eléctricos preliminares                             | 8 tomas, 1 punto de luz y 1 reserva; vinculados a 9 elementos. Sin potencias, circuitos o protecciones inventados             |
| D37 | 26 elementos en presupuesto preliminar                        | Unitarios/subtotales null; compra/fabricación propuestas. Ninguna cotización incorporada                                      |
| D38 | Referencia principal aportada como guía privada               | Amplitud, composición, curvas y luminosidad; no copia de marca, código o imágenes                                             |

El maestro V1.7 plantea una apertura acotada por validar. El nuevo escenario es una hipótesis espacial de crecimiento solicitada, no una reescritura de esa decisión operativa. Confirmar demanda, inversión, personal, redes y viabilidad antes de adoptar esta escala.

## Reorganización autorizada V0.2-R2 (0.2.2)

D39. La petición adjunta más reciente autoriza esta revisión, no V0.3. Conserva UI y sincronización. Sustituye D30–D32 en distribución.

D40. Recepción frontal junto al eje de acceso; sofá lounge separado de sillería técnica. Manicure alineada en el lateral izquierdo; dos pedicure al fondo orientados al salón.

D41. Tres tocadores específicos contra el muro derecho con espejo/luz integrados y silla alta. Ampliación solicitada por el usuario, pendiente de validación de servicio, higiene, personal y demanda frente al maestro V1.7.

D42. Se eliminan tres divisiones técnicas, su frente y cuatro puertas; quedan dos muros interiores del baño. Almacén, mesón de asepsia, poceta y resguardo permanecen como elementos diferenciados en franja posterior izquierda. Esta compactación es una hipótesis, no solución sanitaria aprobada.

D43. Espejo del baño como entidad elevada independiente. Espejos de tocadores integrados al conjunto para no duplicar compras. Representación metálica aproximada, sin reflexión real.

D44. A-01 incorpora cuadro y notas sobre el mismo SVG interactivo. Números enlazan a códigos de tabla; exportación conserva cotas/zonas/identificadores. Fichas originales con tres proyecciones y notas; sin copiar láminas BlackForge ni inventar despieces.

D45. 32 muebles y 64 partidas en 20 categorías. Cantidad null en nueve partidas abiertas. Precio null en todas. Las sumas conocidas se distinguen de presupuesto completo. Señales y puntos son partidas vinculadas; consumibles y herramientas carecen de geometría.

D46. Trece puntos eléctricos (11 tomas, luz central y reserva) vinculados a doce conjuntos consumidores. Potencias, circuitos y protecciones requieren diseño real.

D47. Etiquetas 3D proyectadas al DOM principal para evitar desmontajes de raíces independientes al alternar representaciones. No cambian posiciones ni geometría.

## Refinamiento autorizado V0.2-R3 (0.2.3)

D48. Petición de refinamiento, sin rehacer la base. Perímetro, tres ventanas, tres manicure, dos pedicure, baño y circulación conservados.

D49. Se retira únicamente tercer tocador y silla; dos maquillaje permanecen en sus posiciones de R2. El espacio liberado recibe sofá lateral nude; se amplía la mesa central. Dos sofás en L.

D50. Recepción gira −45° hacia la puerta y pasa de Z 3.25 a 2.95 para mantener su envolvente dentro del local. Añade silla detrás. El panel amorfo se elimina de modelo/tipos/render, sin reemplazo volumétrico.

D51. Pantallas finas adosadas a oeste/manicure y este/lounge, evitando ventanas; contenido propio de marca estático. Dos nuevas tomas conceptuales y una toma retirada de maquillaje: 14 puntos totales.

D52. Texto de señalización más grande en su textura, orientación coherente con muro, contraste cacao y desplazamiento local por delante de placa para evitar ocultación. Marca en recepción y muro posterior. Arte geométrico original y tapicería nude/rosa polvo del territorio editorial.

D53. Iluminación menos plana: se reduce luz ambiental y principal conservando luz perimetral y sombras. Sin HDRI, imágenes protegidas ni promesa fotorrealista.

D54. SAT para huellas orientadas: evita falsos positivos de cajas axiales de recepción/silla. No verifica ergonomía ni cumplimiento. Mantener límites técnicos y costes null.

## Refinamiento autorizado V0.2-R4 (0.2.4)

D55. Preservar base R3 con instantánea y prueba de regresión geométrica. Cambios limitados a petición R4; sin R5/V0.3 automática.
D56. Giro adicional de recepción −45°: total −90° en Y. Silla detrás en X positivo. Sin panel posterior. SAT valida ausencia de solapes, no ergonomía.
D57. Pantallas ≈55 pulgadas 16:9 en oeste y paño frontal ciego calculado entre ventana y puerta. Formato adaptable en escenario estrecho, dos conexiones existentes. CanvasTexture local a 12 fps máximo, pausas y limpieza de recursos.
D58. Lámpara extruida de dos bandas, difusores y suspensión. Base 2.55 m y envolvente 2 × .75 × 1.30 hipotéticas; plano/ficha derivados.
D59. Fachada integrada al muro/huecos existentes y cuatro encuadres nuevos. Rótulo tipográfico provisional, sin isotipo aprobado ni permiso supuesto.
D60. Seguridad visual contrastada y original, ubicaciones propuestas. Ruta única esquemática hacia acceso existente; no se deduce suficiencia. Leyenda de señales separada en SVG. Referencias y límites en refinamiento-r4.md.
D61. Grano compartido, PBR/ACES, detalles de carpintería y sombras; modelos principales conservados. Techo sigue siendo ocultable.
D62. Presupuesto extendido conserva null y categorías: fachada como partida abierta, señales nuevas por entidad, iluminación exterior dentro de general; sin precios ni compras.

## Refinamiento autorizado V0.2-R5 (0.2.5)

D63. Recuperación R4 en ZIP independiente e instantánea tests/fixtures/r4-layout.json. Tests históricos contra su revisión; protección específica del estado R5 sin alterar servicios, fachada ni espera.
D64. Agrupar armarios al fondo, toallas +90° y apoyo limpio junto a esmaltes. Barrido conservador de dos hojas propuesto; 12 × 8 sin interferencias detectadas, 10 × 8 con advertencia de redistribución.
D65. Separar cuatro funciones hidráulicas por entidad: manos personal, baño clientas, instrumental y aseo. Mesón de asepsia de 1.10 m para reservar el nuevo lavamanos. Redes y segregación física son pendientes explícitos; no hay cumplimiento declarado.
D66. Retirar solo v-lateral y arte-01. Muro continuo y cotas derivadas; preservar ventanas frontales.
D67. Pantallas 55 pulgadas suspendidas frente a pedicure, carcasa 0.73 m dentro de envolvente con soporte hasta techo; orientación hacia ambos sillones, cámara dedicada y pausa manual. Ergonomía y fijaciones por verificar.
D68. SVG individual original A3 de envolvente para todo el mobiliario. Tres vistas, isometría esquemática, ficha y notas; cotas del maestro. Sin geometría de piezas, despiece pendiente. Tipos preparados para componentes y proveedor, sin datos ficticios.
D69. Exportación SVG e impresión aislada con opción PDF del navegador. Diálogo/PDF final no comprobado en navegador integrado; indicar Chrome/Edge. Sin nueva fase ni rediseño global.

Detalle de cambios, fuentes, pruebas y límites: docs/refinamiento-r5.md.

## Refinamiento autorizado V0.2-R6 (0.2.6)

D70. Uniformar almacen-02 a Y=0°, puertas +Z como almacen-01. Base conserva posición; alternativa 10 × 8 requiere ajuste lateral de 0.10 m para evitar solape. Se comprueban ambas huellas y barridos.
D71. Rótulos de almacenamiento limpio e instrumental separados; nombres completos para elementos/redes y directorio seleccionable. Las proyecciones se distribuyen sin superposición; si no caben, siguen en directorio. Planta conserva sus nombres/ID.
D72. Ocho figuras ilustrativas, cinco clientas y tres profesionales. Posiciones de asientos derivadas de muebles existentes; una ruta central periódica comprobada. Sin propuesta de aforo o plantilla.
D73. Figuras opcionales por defecto, pausa independiente, movimiento reducido, ocultación y viewport. Una malla instanciada con geometría compartida reduce llamadas de dibujo; sin activos externos ni dependencias nuevas.
D74. Regresión R5 protege el diseño aprobado. Documentación de mobiliario y presupuesto conservados. No iniciar otra fase sin revisión. Detalles y límites: refinamiento-r6.md.

## Refinamiento autorizado V0.2-R7 (0.2.7)

D75. Proteger íntegramente geometría R6 salvo retiro de lámpara central; siete nuevas entidades conceptuales vinculadas al mismo maestro. Sin redistribución.
D76. Nueve figuras instanciadas, dos recorridos separados con pausas, aceleración y giros suaves. Mantener controles de pausa y reducción de movimiento. Ilustración operativa, no simulador de citas ni aforo aprobado.
D77. Dos suspensiones ovales sobre manicure/maquillaje y dos apliques posteriores; luz ornamental cálida, sin especificación comercial ni cálculo lumínico.
D78. Taburete bajo por pedicure con profesional sentado en el segundo; comprobar alcance y ergonomía reales antes de compra. Arte mural original sobre lounge.
D79. Plantas y fichas derivadas, costos null, regresión y recorridos muestreados en seis escenarios. Límites y resultados en refinamiento-r7.md. No iniciar otra fase automáticamente.

## Refinamiento autorizado V0.2-R8 (0.2.8)

D80. Alcance exclusivo exterior; instantánea R7 y comparación de presupuesto/fichas/funciones protegidas. VersionIds incorpora R8 sin cambiar datos físicos o de compra.
D81. Marca desde lámina RGB original verificada; recortes y máscara visual provisionales, sin reescritura tipográfica. Falta vector o PNG transparente para contornos exactos y volumen corpóreo real. Mecanismo de sustitución en facadeBrand.ts.
D82. Vitrina frontal de piso a dintel y friso hasta 3.65 m. Puerta de 1.40 × 2.50 m permanece centrada y sin cambios; dos ventanas se amplían desde el maestro. No tocar muros interiores ni mobiliario.
D83. Perfiles bronce/champaña, pavimento, dos maceteros y apliques como componentes exteriores. Reflejo procedural pequeño, sin duplicar el interior ni agregar postprocesado.
D84. Cámara exterior 38° con encuadre según aspecto y dimensiones. Corte visual al volver a Interior. Aplicaciones interiores de marca se registran como pendiente, sin modificarlas.

Detalle y limitaciones en refinamiento-r8.md. Ninguna fase posterior iniciada.

## Ajuste final de branding interior

Aplicado exclusivamente al frente del mostrador y al logo mural sobre Pedicure. InteriorBrand reutiliza los tres recursos originales de la identidad (RA, logotipo, descriptor), sin fuentes sustitutas. El mostrador mantiene geometría y transformación; el logo ocupa el 76% de su ancho. s-marca comparte el eje X de s-pedi y conserva la pared posterior. No se modifican el rótulo Pedicure, fachada, muebles, cámaras, televisores, personas ni luz general.

El componente OriginalMark se exporta para reutilización; el render de fachada conserva sus parámetros. El contenido de TV queda expresamente intacto por restricción del usuario. Relieve superficial mediante capas raster, no letras vectoriales para fabricación. Fuente RGB original con máscara provisional; pequeños trazos claros pueden suavizarse.

Validación: 46 pruebas aprobadas, TypeScript y compilación correctos. Se añade comprobación de alineación, separación vertical y límites del muro en seis dimensiones configurables; la prueba de conservación permite únicamente posición/dimensiones de s-marca. Persiste advertencia de paquete JS superior a 500 kB.

Revisión visual completada: logo mural alineado sobre Pedicure y logo del mostrador comprobado mediante órbita, sin modificar presets de cámara. Las pantallas suspendidas existentes pueden ocultar parte de la pared desde algunos ángulos; se mantienen por restricción explícita. La aplicación permanece en su soporte y sin duplicados.

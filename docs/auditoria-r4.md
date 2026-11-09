# Auditoría previa R4

Base 0.2.3 inspeccionada antes de editar. Se conserva una instantánea conceptual en tests/fixtures/r3-layout.json y el paquete R3 anterior.

Protegidos: perímetro 12 × 8 m hipotético; tres ventanas y dos puertas; seis muros; 3 manicure, 2 pedicure, 2 maquillaje; ambos sofás, mesa de espera, baño y apoyos; selección por ID compartida; UI editorial, plano SVG, fichas y presupuesto sin importes.

Modelo único: src/data/studio.ts. Render: StudioScene/FurnitureModel/AdditionalFurniture; cámaras: CameraRig; plano: renderPlan; fichas: renderFurniture; presupuesto: projectBudget. App conserva selección. Canvas utiliza render bajo demanda.

Cambios permitidos: orientación de recepción y silla; pantallas y sus conexiones; lámpara; fachada derivada de huecos existentes; señales; materiales y detalle geométrico dentro de envolventes. No se agrega el panel eliminado.

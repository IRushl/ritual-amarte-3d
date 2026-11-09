import { useMemo, useState } from "react";
import { Icon, type IconName } from "./components/Icon";
import {
  ArchitectureWorkspace,
  type WorkspaceMode,
} from "./components/ArchitectureWorkspace";
import { createArchitecture } from "./data/studio";
import { Budget } from "./components/Budget";
type Page =
  | "espacio"
  | "plano"
  | "mobiliario"
  | "concepto"
  | "proyecto"
  | "presupuesto";
const pages: { id: Page; label: string; icon: IconName }[] = [
  { id: "espacio", label: "El espacio", icon: "cube" },
  { id: "plano", label: "Plano 2D", icon: "grid" },
  { id: "mobiliario", label: "Mobiliario", icon: "chair" },
  { id: "presupuesto", label: "Presupuesto", icon: "grid" },
  { id: "concepto", label: "Concepto & materiales", icon: "leaf" },
  { id: "proyecto", label: "Sobre el proyecto", icon: "info" },
];
export default function App() {
  const [drawingRequest, setDrawingRequest] = useState<{
    id: string;
    serial: number;
  } | null>(null);
  const [page, setPage] = useState<Page>("espacio");
  const [selected, setSelected] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<[number, number]>([12, 8]);
  const [mode, setMode] = useState<WorkspaceMode>("3d");
  const model = useMemo(() => createArchitecture(...dimensions), [dimensions]);
  const furniture = model.mobiliario;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#espacio"
          onClick={() => {
            setPage("espacio");
            setMode("3d");
          }}
          aria-label="Ritual Amarte, inicio"
        >
          <span className="brand-mark">
            ra<span>✳</span>
          </span>
          <span className="brand-name">
            ritual amarte<span>NAIL STUDIO EXPERIENCE</span>
          </span>
        </a>
        <div className="sidebar-section-label">EXPLORAR EL ESTUDIO</div>
        <nav aria-label="Navegación principal">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPage(p.id);
                if (p.id === "plano") setMode("2d");
                else if (p.id === "espacio") setMode("3d");
              }}
              className={`nav-item ${page === p.id ? "selected" : ""}`}
              aria-current={page === p.id ? "page" : undefined}
            >
              <Icon name={p.icon} size={19} />
              {p.label}
              {page === p.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-story">
          <span className="story-arch">✳</span>
          <p>
            Un espacio para
            <br />
            <em>volver a ti.</em>
          </p>
          <span>CUIDADO · CALMA · DETALLE</span>
        </div>
        <div className="sidebar-footer">
          <span className="version-dot" /> Prototipo conceptual <b>V0.2-R8</b>
          <small>Tunja, Boyacá · Colombia</small>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <span>
            RITUAL AMARTE <span className="breadcrumb">/</span>{" "}
            <span className="topbar-sub">Exploración del estudio</span>
          </span>
          <span className="phase">
            <span className="live-dot" />
            En desarrollo · V0.2-R8
          </span>
        </header>
        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">DISEÑADO PARA EL CUIDADO</div>
              <h1>
                {page === "espacio"
                  ? "Imagina el espacio."
                  : page === "plano"
                    ? "El espacio, a escala."
                    : page === "mobiliario"
                      ? "Cada detalle, con intención."
                      : page === "presupuesto"
                        ? "El valor de cada detalle."
                        : page === "concepto"
                          ? "La calma toma forma."
                          : "Un proyecto que crece."}
              </h1>
              <p>
                {page === "espacio"
                  ? "Un modelo conceptual para explorar cómo se organiza el cuidado."
                  : page === "plano"
                    ? "Una planta vinculada al 3D, con cotas en metros y selección compartida."
                    : page === "mobiliario"
                      ? "Inventario conceptual conectado a los objetos del estudio."
                      : page === "presupuesto"
                        ? "Cantidades, adquisición propuesta y subtotales pendientes de cotización."
                        : page === "concepto"
                          ? "Una dirección visual cálida, serena y contemporánea, por validar."
                          : "Decisiones claras para construir, paso a paso, Ritual Amarte."}
              </p>
            </div>
            <span className="outline-badge">ESTUDIO CONCEPTUAL</span>
          </div>
          {page === "espacio" || page === "plano" || page === "mobiliario" ? (
            <>
              <ArchitectureWorkspace
                drawingRequest={drawingRequest}
                model={model}
                selected={selected}
                onSelect={setSelected}
                mode={mode}
                onMode={setMode}
                onConfigure={(w, d) => setDimensions([w, d])}
              />
              {page === "mobiliario" ? (
                <section
                  className="inventory"
                  aria-label="Inventario conceptual"
                >
                  <div className="section-title">
                    <h2>Mobiliario conceptual</h2>
                    <span>{furniture.length} elementos · Sin cotizaciones</span>
                  </div>
                  <div className="inventory-grid">
                    {furniture.map((f) => (
                      <button
                        key={f.id}
                        className={
                          selected === f.id
                            ? "inventory-item active"
                            : "inventory-item"
                        }
                        onClick={() => {
                          setSelected(f.id);
                          setDrawingRequest({ id: f.id, serial: Date.now() });
                        }}
                      >
                        <Icon name="chair" />
                        <span>
                          <strong>{f.nombre}</strong>
                          <small>{f.id} · Ver plano técnico</small>
                        </span>
                        <Icon name="arrow" size={17} />
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="summary-row">
                  <div>
                    <span className="summary-icon">
                      <Icon name="cube" />
                    </span>
                    <span>
                      <strong>{model.espacios.length} zonas y reservas</strong>
                      <small>3 manicure · 2 pedicure · 2 maquillaje</small>
                    </span>
                  </div>
                  <div>
                    <span className="summary-icon">
                      <Icon name="chair" />
                    </span>
                    <span>
                      <strong>{furniture.length} elementos conceptuales</strong>
                      <small>Mobiliario provisional y seleccionable</small>
                    </span>
                  </div>
                  <div>
                    <span className="summary-icon">
                      <Icon name="leaf" />
                    </span>
                    <span>
                      <strong>Elegancia cálida</strong>
                      <small>Materiales y acabados por validar</small>
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : page === "concepto" ? (
            <section className="editorial-panel">
              <div className="concept-hero">
                <span>01 / DIRECCIÓN CREATIVA</span>
                <h2>
                  Menos ruido.
                  <br />
                  <em>Más cuidado.</em>
                </h2>
                <p>
                  Una interpretación de «Editorial serena», la exploración
                  recomendada en el documento V1.7. La identidad y el nombre
                  siguen pendientes de aprobación.
                </p>
              </div>
              <div className="concept-body">
                <h2>Una paleta para respirar</h2>
                <p>
                  Tokens preliminares del capítulo 22. El dorado champaña y la
                  madera clara son propuestas espaciales de esta V0.2-R8.
                </p>
                <div className="swatches">
                  {[
                    ["Marfil", "#FAF7F2"],
                    ["Rosa polvo", "#D7B7BA"],
                    ["Arena", "#D3C2B4"],
                    ["Taupe", "#BCA69B"],
                    ["Tinta cacao", "#493B3C"],
                  ].map(([name, color]) => (
                    <div key={name}>
                      <span style={{ background: color }} />
                      <strong>{name}</strong>
                      <small>{color}</small>
                    </div>
                  ))}
                </div>
                <div className="material-schedule">
                  {model.materiales.map((m) => (
                    <div key={m.id}>
                      <span style={{ background: m.color }} />
                      <strong>{m.nombre}</strong>
                      <small>
                        {m.estado} ·{" "}
                        {
                          model.mobiliario.filter((f) => f.materialId === m.id)
                            .length
                        }{" "}
                        elementos de inventario
                      </small>
                    </div>
                  ))}
                </div>
                <h3>Materialidad con intención</h3>
                <p>
                  Superficies no porosas, tapizados sanitizables y madera
                  sellada son hipótesis de material. Cada acabado necesita
                  pruebas de resistencia, limpieza y compatibilidad antes de
                  compra.
                </p>
                <h3>La experiencia antes que el ornamento</h3>
                <p>
                  Información y reserva → bienvenida y asesoría → servicio →
                  recomendaciones y pago → seguimiento. La comodidad, la
                  puntualidad y la higiene visible orientan el recorrido.
                </p>
              </div>
            </section>
          ) : page === "presupuesto" ? (
            <Budget
              model={model}
              onInspect={(id) => {
                setSelected(id);
                setPage("mobiliario");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ) : (
            <section className="project-panels">
              <article>
                <span className="eyebrow">FUENTE DE NEGOCIO · V1.7</span>
                <h2>Lo que orienta el proyecto</h2>
                <p>
                  Estudio especializado en cuidado y belleza de uñas en Tunja.
                  Calidad técnica, atención personalizada, higiene, claridad y
                  tranquilidad.
                </p>
                <p>
                  El segmento de 25 a 40 años es una hipótesis inicial. La
                  investigación exploratoria reúne 27 respuestas y no representa
                  a toda la ciudad.
                </p>
                <p>
                  La apertura por citas, atendida inicialmente por la fundadora,
                  es un escenario de formulación. Portafolio, capacidades,
                  precios y demanda requieren validación.
                </p>
              </article>
              <article>
                <span className="eyebrow">VERSIÓN ACTUAL</span>
                <h2>V0.2-R8 · Conectar</h2>
                <ul>
                  <li>Escena 3D, órbita, desplazamiento y zoom.</li>
                  <li>Vistas interior, aérea y superior; plano SVG acotado.</li>
                  <li>Modelo parametrizado y selección compartida 2D / 3D.</li>
                  <li>Datos tipados sin costos inventados.</li>
                </ul>
                <h3>Por resolver</h3>
                <p>
                  Local, medidas, asepsia, aseo independiente, baño,
                  almacenamiento técnico, accesibilidad y circulación de
                  residuos. Esta escena no acredita cumplimiento sanitario.
                </p>
              </article>
              <article className="future-panel">
                <span className="eyebrow">V0.3 · PENDIENTE DE APROBACIÓN</span>
                <h2>V0.3 · Revisar y validar</h2>
                <p>
                  Validar el inmueble, circulación, áreas técnicas, ergonomía y
                  redes con profesionales competentes. Ampliar materiales y
                  cotizaciones verificadas después de revisar este rediseño.
                </p>
              </article>
            </section>
          )}
          <footer className="page-footer">
            <span>
              RITUAL AMARTE <span>·</span> Un espacio para cuidarte.
            </span>
            <span>Nombre de trabajo · Validación marcaria pendiente</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

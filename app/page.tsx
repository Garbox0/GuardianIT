import LeadForm from "@/components/LeadForm";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

const problems = [
  {
    number: "01",
    title: "El backup parece funcionar",
    body: "Hasta que necesitás recuperar algo. Revisamos que exista, esté actualizado y pueda verificarse."
  },
  {
    number: "02",
    title: "Todo depende de una sola persona",
    body: "Documentamos equipos, accesos y servicios críticos para que el negocio no quede a oscuras."
  },
  {
    number: "03",
    title: "La tecnología interrumpe el trabajo",
    body: "Atendemos problemas de red, Windows, impresoras y cuentas con un alcance claro."
  },
  {
    number: "04",
    title: "Se repiten tareas manuales",
    body: "Automatizamos pasos concretos cuando el ahorro de tiempo justifica la inversión."
  }
];

const services = [
  {
    eyebrow: "Para empezar",
    title: "Diagnóstico Guardián",
    price: "Desde ARS 90.000",
    description:
      "Un relevamiento breve para saber qué está bien, qué puede fallar y qué conviene resolver primero.",
    features: [
      "Visita o sesión de hasta 2 horas",
      "Revisión de red, equipos y backups",
      "Diagnóstico automatizado de equipos Windows",
      "5 prioridades explicadas sin tecnicismos",
      "Informe HTML y evidencia técnica"
    ],
    cta: "Pedir diagnóstico"
  },
  {
    eyebrow: "Trabajo puntual",
    title: "Puesta en orden",
    price: "Presupuesto cerrado",
    description:
      "Corregimos los problemas detectados sin obligarte a contratar un abono.",
    features: [
      "Backups y recuperación",
      "Red, Wi-Fi e impresoras",
      "Usuarios, accesos y MFA",
      "Actualizaciones y documentación",
      "Alcance aprobado antes de comenzar"
    ],
    cta: "Consultar alcance"
  },
  {
    eyebrow: "Continuidad mensual",
    title: "Abono Guardián",
    price: "Desde ARS 140.000 / mes",
    description:
      "Seguimiento preventivo para oficinas que no cuentan con un responsable de sistemas.",
    features: [
      "Hasta 5 computadoras",
      "3 horas de soporte remoto",
      "Control de backups y restauración acordada",
      "Monitoreo de servicios acordados",
      "Panel privado e informe mensual"
    ],
    cta: "Evaluar mi empresa"
  }
];

const deliverables = [
  {
    title: "Diagnóstico con evidencia",
    body: "Revisamos almacenamiento, actualizaciones, antivirus, firewall, cifrado, administradores y backup sin modificar el equipo.",
    proof: "Informe HTML + evidencia JSON"
  },
  {
    title: "Monitoreo continuo",
    body: "Controlamos los servicios acordados y conservamos historial para distinguir una falla real de una impresión.",
    proof: "Panel privado + disponibilidad"
  },
  {
    title: "Backup verificable",
    body: "Registramos antigüedad, destino y resultado. La copia se considera confiable recién después de una restauración.",
    proof: "Registro de prueba de recuperación"
  },
  {
    title: "Seguimiento mensual",
    body: "Resumimos incidentes, acciones realizadas y hasta tres prioridades para el mes siguiente.",
    proof: "Informe corto para decidir"
  }
];

const steps = [
  ["Conversamos", "Entendemos qué necesita seguir funcionando y qué problema te preocupa hoy."],
  ["Revisamos", "Hacemos un diagnóstico acotado, autorizado y sin modificar nada sin permiso."],
  ["Priorizamos", "Recibís un informe corto con impacto, urgencia y una recomendación concreta."],
  ["Resolvemos", "Elegís qué corregir y si necesitás acompañamiento mensual."]
];

const faqs = [
  {
    question: "¿Puedo empezar sin una reunión de venta?",
    answer:
      "Sí. Cuando la reserva online está disponible, podés contratar el diagnóstico desde esta página. Si no, enviás la consulta por WhatsApp y recibís alcance y precio por escrito antes de pagar."
  },
  {
    question: "¿Esto es un servicio de ciberseguridad?",
    answer:
      "Incluye controles básicos de accesos, backups y configuración, pero no es una prueba de penetración ni promete impedir todos los incidentes."
  },
  {
    question: "¿Tengo que contratar un abono?",
    answer:
      "No. El diagnóstico y la puesta en orden pueden contratarse como trabajos independientes."
  },
  {
    question: "¿Trabajan con cualquier cantidad de equipos?",
    answer:
      "La propuesta inicial está pensada para oficinas de 5 a 20 computadoras. Los alcances mayores se evalúan por separado."
  },
  {
    question: "¿El soporte es ilimitado?",
    answer:
      "No. Cada propuesta indica horas, horarios, tiempos de respuesta y tareas incluidas para evitar sorpresas."
  },
  {
    question: "¿Pueden acceder sin autorización?",
    answer:
      "No. Cada acceso remoto o revisión se coordina y requiere autorización. No solicitamos contraseñas personales."
  },
  {
    question: "¿Qué se instala en mis equipos?",
    answer:
      "El diagnóstico inicial puede ejecutarse en modo de solo lectura y genera un informe local. El monitoreo permanente se instala únicamente si el alcance lo requiere y queda documentado."
  }
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    description: site.description,
    areaServed: site.area,
    telephone: site.whatsappDisplay,
    priceRange: "$$",
    serviceType: [
      "Soporte informático",
      "Continuidad operativa",
      "Automatización de procesos"
    ]
  };

  return (
    <>
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Guardián PyME, inicio">
          <Logo />
          <span>Guardián <strong>PyME</strong></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#entregables">Qué recibís</a>
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Cómo trabajamos</a>
        </nav>
        <a
          className="button button-small"
          href={site.purchaseUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={site.purchaseLabel}
        >
          Consultar
        </a>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">ZONA NORTE Y CABA · SOPORTE REMOTO EN ARGENTINA</p>
            <h1>
              Que un problema técnico no decida cuándo <em>frena tu negocio.</em>
            </h1>
            <p className="hero-lead">
              Detectamos qué puede detener tu operación y te entregamos
              prioridades concretas, sin obligarte a contratar un abono.
            </p>
            <div className="hero-actions">
              <a
                className="button"
                href={site.purchaseUrl}
                target="_blank"
                rel="noreferrer"
              >
                {site.purchaseLabel}
              </a>
              <a className="text-link" href="#servicios">
                Ver diagnóstico y precio <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="hero-proof" aria-label="Características del servicio">
              <span>Pago único</span>
              <span>Sin abono obligatorio</span>
              <span>Acceso con autorización</span>
            </div>
          </div>

          <div className="signal-card" aria-label="Ejemplo de diagnóstico">
            <div className="signal-top">
              <span className="live-dot" />
              <span>REVISIÓN PREVENTIVA</span>
              <span className="signal-time">HOY</span>
            </div>
            <div className="signal-score">
              <span>Estado operativo</span>
              <strong>3 prioridades</strong>
            </div>
            <div className="signal-list">
              <div>
                <span className="status warning">!</span>
                <p><strong>Backup sin verificar</strong><small>Revisión prioritaria</small></p>
              </div>
              <div>
                <span className="status ok">✓</span>
                <p><strong>Conectividad estable</strong><small>Sin cambios relevantes</small></p>
              </div>
              <div>
                <span className="status info">i</span>
                <p><strong>Accesos administrativos</strong><small>Recomendación disponible</small></p>
              </div>
            </div>
            <p className="signal-note">
              Un informe útil prioriza decisiones. No llena páginas con
              tecnicismos.
            </p>
          </div>
        </section>

        <section className="problem-section section">
          <div className="section-heading">
            <p className="eyebrow">PROBLEMAS COTIDIANOS</p>
            <h2>No necesitás más tecnología. Necesitás que la actual funcione.</h2>
          </div>
          <div className="problem-grid">
            {problems.map((problem) => (
              <article key={problem.number} className="problem-card">
                <span>{problem.number}</span>
                <h3>{problem.title}</h3>
                <p>{problem.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="outcomes-section section" id="entregables">
          <div className="section-heading">
            <p className="eyebrow">QUÉ RECIBÍS</p>
            <h2>Controles que terminan en una decisión.</h2>
            <p>
              No vendemos una caja ni un tablero decorativo. Cada función deja
              una evidencia comprensible y un próximo paso.
            </p>
          </div>
          <div className="outcome-grid">
            {deliverables.map((deliverable, index) => (
              <article className="outcome-card" key={deliverable.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{deliverable.title}</h3>
                <p>{deliverable.body}</p>
                <strong>{deliverable.proof}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="services-section section" id="servicios">
          <div className="section-heading centered">
            <p className="eyebrow">UNA ENTRADA SIMPLE</p>
            <h2>Empezá por el problema que ya tenés.</h2>
            <p>
              Cada etapa se contrata por separado. Primero revisamos; después
              decidís.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article
                key={service.title}
                className={`service-card ${index === 0 ? "featured" : ""}`}
              >
                {index === 0 && <span className="recommended">RECOMENDADO</span>}
                <p className="card-eyebrow">{service.eyebrow}</p>
                <h3>{service.title}</h3>
                <p className="price">{service.price}</p>
                <p className="service-description">{service.description}</p>
                <ul>
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {index === 0 && (
                  <p className="service-note">
                    Pago único. No inicia una suscripción ni un abono mensual.
                  </p>
                )}
                <a
                  className={index === 0 ? "button service-cta" : "card-link"}
                  href={index === 0 ? site.purchaseUrl : "#contacto"}
                  {...(index === 0
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {index === 0 ? site.purchaseLabel : service.cta}
                  {index !== 0 && <span aria-hidden="true"> →</span>}
                </a>
                {index === 0 && site.bookingLink && (
                  <a
                    className="booking-link"
                    href={site.bookingLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ¿Ya pagaste? Reservá tu turno
                  </a>
                )}
              </article>
            ))}
          </div>
          <p className="price-note">
            Valores orientativos a julio de 2026. El precio final se confirma
            por escrito según zona, cantidad de equipos y alcance.
          </p>
        </section>

        <section className="automation-section section">
          <div>
            <p className="eyebrow">AUTOMATIZACIÓN CON SENTIDO</p>
            <h2>Menos copiar, pegar y perseguir planillas.</h2>
            <p>
              Si una tarea administrativa se repite todas las semanas,
              evaluamos si puede simplificarse con las herramientas que tu
              empresa ya utiliza.
            </p>
          </div>
          <div className="automation-list">
            <div><span>01</span>Archivos recibidos por correo ordenados automáticamente</div>
            <div><span>02</span>Reportes creados desde planillas o exportaciones</div>
            <div><span>03</span>Recordatorios y seguimientos sin control manual</div>
          </div>
        </section>

        <section className="process-section section" id="proceso">
          <div className="section-heading">
            <p className="eyebrow">CÓMO TRABAJAMOS</p>
            <h2>Cuatro pasos, sin venderte humo.</h2>
          </div>
          <ol className="process-list">
            {steps.map(([title, description], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="fit-section section">
          <div className="fit-card fit-yes">
            <p className="eyebrow">ES PARA TU EMPRESA SI...</p>
            <ul>
              <li>Tienen entre 5 y 20 computadoras</li>
              <li>Dependen de internet, archivos y sistemas</li>
              <li>No cuentan con un responsable IT</li>
              <li>Quieren prevenir antes de improvisar</li>
            </ul>
          </div>
          <div className="fit-card">
            <p className="eyebrow">NO ES LA OPCIÓN SI...</p>
            <ul>
              <li>Buscás soporte ilimitado al menor precio</li>
              <li>Necesitás atención humana 24 × 7</li>
              <li>Querés una auditoría ofensiva o pentesting</li>
              <li>No podés autorizar formalmente los accesos</li>
            </ul>
          </div>
        </section>

        <section className="faq-section section" id="preguntas">
          <div className="section-heading">
            <p className="eyebrow">PREGUNTAS FRECUENTES</p>
            <h2>Todo claro antes de empezar.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="contact-section section" id="contacto">
          <div className="contact-copy">
            <p className="eyebrow">PRIMER PASO</p>
            <h2>Contame qué está frenando tu trabajo.</h2>
            <p>
              Completá cuatro datos. Prepararemos un mensaje para conversar por
              WhatsApp sin que tengas que explicar todo de nuevo.
            </p>
            <div className="availability">
              <span>Zona</span>
              <strong>{site.area}</strong>
              <span>Disponibilidad</span>
              <strong>{site.availability}</strong>
              <span>WhatsApp</span>
              <strong>
                <a href={site.whatsappUrl} target="_blank" rel="noreferrer">
                  {site.whatsappDisplay}
                </a>
              </strong>
            </div>
          </div>
          <LeadForm whatsappNumber={site.whatsappNumber} />
        </section>
      </main>

      <footer>
        <div className="brand footer-brand">
          <Logo />
          <span>Guardián <strong>PyME</strong></span>
        </div>
        <p>
          Soporte informático y automatización práctica para pequeñas empresas.
        </p>
        <p className="footer-note">
          El diagnóstico es limitado al alcance autorizado y no garantiza la
          ausencia de fallas o incidentes.
        </p>
        <span>© {new Date().getFullYear()} Guardián PyME</span>
      </footer>

      <a
        className="mobile-cta"
        href={site.purchaseUrl}
        target="_blank"
        rel="noreferrer"
      >
        {site.purchaseLabel}
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}

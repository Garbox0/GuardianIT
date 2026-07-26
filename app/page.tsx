import LeadForm from "@/components/LeadForm";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

const problems = [
  {
    number: "01",
    title: "El backup dice “completado”, pero nadie intentó abrirlo",
    body: "Miramos la fecha, el destino y si realmente se puede recuperar un archivo. Una copia que nunca se probó todavía es una duda."
  },
  {
    number: "02",
    title: "La clave del router la tiene el técnico que vino hace tres años",
    body: "Dejamos anotado qué equipos hay, quién administra cada cosa y qué servicio no puede faltar."
  },
  {
    number: "03",
    title: "El Wi-Fi se corta justo cuando hay que facturar",
    body: "Revisamos red, Windows, impresoras y cuentas para encontrar el problema real, no sumar otro parche."
  },
  {
    number: "04",
    title: "Cada viernes alguien arma el mismo Excel a mano",
    body: "Si una tarea se repite, vemos si conviene resolverla con las herramientas que ya usan."
  }
];

const services = [
  {
    eyebrow: "Para empezar",
    title: "Diagnóstico Guardián",
    price: "ARS 90.000 · pago único",
    description:
      "Hasta dos horas para revisar cinco equipos o servicios y salir con un orden claro de qué atender primero.",
    features: [
      "Nos conectamos con vos presente",
      "Revisamos hasta 5 equipos o servicios",
      "Chequeamos backup, antivirus y eventos",
      "Revisamos red, accesos y dominio",
      "Marcamos hasta 5 prioridades",
      "Te llevás un informe que se entiende"
    ],
    cta: "Pedir diagnóstico"
  },
  {
    eyebrow: "Trabajo puntual",
    title: "Puesta en orden",
    price: "Presupuesto cerrado",
    description:
      "Si encontramos algo, te decimos qué haríamos, cuánto cuesta y qué puede interrumpirse. Vos decidís.",
    features: [
      "Probamos recuperación de backups",
      "Ordenamos red, Wi-Fi e impresoras",
      "Separamos usuarios y accesos",
      "Programamos actualizaciones y reinicios",
      "No tocamos nada sin tu aprobación"
    ],
    cta: "Consultar alcance"
  },
  {
    eyebrow: "Continuidad mensual",
    title: "Abono Guardián",
    price: "Desde ARS 140.000 / mes",
    description:
      "Para no enterarte de una caída por el mensaje de un cliente o cuando ya nadie puede trabajar.",
    features: [
      "Hasta 5 computadoras y 5 controles",
      "3 horas mensuales de soporte remoto",
      "Revisión del backup acordado",
      "Avisos por web, dominio, certificado o IP acordada",
      "Registro simple de lo que pasó",
      "Acciones autorizadas cuando correspondan"
    ],
    cta: "Evaluar mi empresa"
  }
];

const deliverables = [
  {
    title: "Un informe que se puede leer",
    body: "En vez de volcarte veinte controles técnicos, explicamos qué encontramos, por qué importa y qué haríamos primero.",
    proof: "Resumen claro + evidencia técnica"
  },
  {
    title: "Un aviso cuando algo deja de responder",
    body: "Controlamos la web y los servicios acordados. Antes de alarmarte, comprobamos que la falla sea real.",
    proof: "Aviso + horario + registro"
  },
  {
    title: "Una prueba de que el backup abre",
    body: "Anotamos dónde está la copia y qué antigüedad tiene. Si el alcance lo permite, recuperamos una muestra sin tocar los originales.",
    proof: "Fecha + destino + prueba acordada"
  },
  {
    title: "Un resumen de lo que pasó en el mes",
    body: "Te contamos qué se cayó, qué se hizo y qué conviene mirar después. Sin mandarte capturas de un tablero técnico.",
    proof: "Informe para guardar y compartir"
  }
];

const steps = [
  ["Nos contás qué pasa", "No hace falta que sepas el nombre técnico. Alcanza con explicar qué se corta, qué demora o qué genera dudas."],
  ["Lo miramos juntos", "La primera revisión es remota, con vos presente y sin cambiar configuraciones por nuestra cuenta."],
  ["Te damos un orden", "Recibís pocos puntos, cada uno con una explicación y un próximo paso posible."],
  ["Vos decidís", "Podés cerrar ahí, pedir un presupuesto para corregirlo o evaluar el acompañamiento mensual."]
];

const faqs = [
  {
    question: "¿Los ARS 90.000 son por mes?",
    answer:
      "No. Es un único pago por el Diagnóstico Guardián remoto de hasta cinco equipos. El abono mensual es otro servicio opcional y sólo se ofrece si después necesitás seguimiento continuo."
  },
  {
    question: "¿Puedo empezar sin una reunión de venta?",
    answer:
      "Sí. Cuando la reserva online está disponible, podés contratar el diagnóstico desde esta página. Si no, enviás la consulta por WhatsApp y recibís alcance y precio por escrito antes de pagar."
  },
  {
    question: "¿Esto es un servicio de ciberseguridad?",
    answer:
      "Incluye antivirus, firewall, eventos de Windows, accesos y configuración pública del dominio. La revisión web observa algunos indicadores relacionados con OWASP, pero no es una auditoría completa del Top 10 ni una prueba de penetración."
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
    question: "¿Qué hacen si el monitoreo detecta una falla?",
    answer:
      "Primero la validamos, te avisamos y dejamos registro. Nuestros propios componentes pueden recuperarse automáticamente. En tus sistemas sólo ejecutamos acciones previamente autorizadas; cualquier otro cambio requiere tu aprobación y puede consumir horas del abono o cotizarse por separado."
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
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        alternateName: "Guardián IT"
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        alternateName: "Guardián IT",
        url: site.url,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/logo-512.png`,
          width: 512,
          height: 512
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.whatsappDisplay,
          contactType: "customer service",
          availableLanguage: "Spanish"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#service`,
        name: site.name,
        url: site.url,
        image: `${site.url}/og-image.png`,
        description: site.description,
        areaServed: site.area,
        telephone: site.whatsappDisplay,
        priceRange: "$$",
        serviceType: [
          "Soporte informático",
          "Continuidad operativa",
          "Automatización de procesos"
        ]
      }
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
          {site.paymentLink ? "Comprar" : "Consultar"}
        </a>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">ZONA NORTE Y CABA · SOPORTE REMOTO EN ARGENTINA</p>
            <h1>
              Que una PC, el Wi-Fi o un backup dudoso no te <em>pare la oficina.</em>
            </h1>
            <p className="hero-lead">
              Revisamos hasta cinco equipos, encontramos lo que hoy está flojo
              y te decimos qué resolver primero. El diagnóstico cuesta ARS
              90.000, una sola vez.
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
              <span>Hablás con quien hace la revisión</span>
              <span>ARS 90.000 finales</span>
              <span>Sin abono obligatorio</span>
            </div>
          </div>

          <div className="signal-card" aria-label="Ejemplo de diagnóstico">
            <div className="signal-top">
              <span className="live-dot" />
              <span>EJEMPLO DE REVISIÓN</span>
              <span className="signal-time">HOY</span>
            </div>
            <div className="signal-score">
              <span>Qué haríamos primero</span>
              <strong>3 cosas</strong>
            </div>
            <div className="signal-list">
              <div>
                <span className="status warning">!</span>
                <p><strong>Probar el backup</strong><small>Nadie recuperó un archivo todavía</small></p>
              </div>
              <div>
                <span className="status ok">✓</span>
                <p><strong>Wi-Fi estable</strong><small>No hace falta tocarlo</small></p>
              </div>
              <div>
                <span className="status info">i</span>
                <p><strong>Separar una cuenta</strong><small>Se usa como administrador todos los días</small></p>
              </div>
            </div>
            <p className="signal-note">
              Te llevás esto: qué pasa, por qué importa y cuál sería el
              siguiente paso.
            </p>
          </div>
        </section>

        <section className="problem-section section">
          <div className="section-heading">
            <p className="eyebrow">COSAS QUE PASAN EN UNA OFICINA</p>
            <h2>Problemas chicos, hasta que frenan a todos.</h2>
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
            <p className="eyebrow">QUÉ TE LLEVÁS</p>
            <h2>Algo más útil que una lista de luces verdes y rojas.</h2>
            <p>
              Cada revisión termina en una explicación que podés guardar,
              compartir y usar para decidir.
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
          <div className="sample-report">
            <div>
              <strong>Antes de pagar, mirá un informe.</strong>
              <span>
                Es ficticio, pero muestra exactamente el tipo de explicación que entregamos.
              </span>
            </div>
            <a className="button button-outline" href="/informe-ejemplo.html">
              Ver informe de ejemplo <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="fit-section section" id="respuesta">
          <div className="fit-card fit-yes">
            <p className="eyebrow">ANTE UNA ALERTA</p>
            <h2>Detectamos, validamos y dejamos registro.</h2>
            <ul>
              <li>Confirmamos si la falla es real</li>
              <li>Te avisamos por el canal acordado</li>
              <li>Nuestra infraestructura intenta recuperarse sola</li>
              <li>Documentamos causa, acción y resultado</li>
            </ul>
          </div>
          <div className="fit-card">
            <p className="eyebrow">SÓLO CON TU AUTORIZACIÓN</p>
            <h2>No hacemos cambios a ciegas.</h2>
            <ul>
              <li>Reiniciar servicios o equipos de tu empresa</li>
              <li>Cambiar usuarios, permisos, firewall o DNS</li>
              <li>Restaurar, mover o eliminar información</li>
              <li>Instalar software o aplicar correcciones</li>
            </ul>
            <p>
              Las acciones preautorizadas se ejecutan con límites y
              verificación. Lo demás se confirma y cotiza antes de actuar.
            </p>
          </div>
        </section>

        <section className="services-section section" id="servicios">
          <div className="section-heading centered">
            <p className="eyebrow">SIN CONTRATOS DE ENTRADA</p>
            <h2>Podés empezar por una sola revisión.</h2>
            <p>
              Si después querés corregir algo o tener seguimiento mensual, lo
              vemos por separado.
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
                    Pago único, sin suscripción. Después de pagar, enviá el
                    número de operación. Verificamos la acreditación y te
                    habilitamos la agenda.
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
                {index === 0 && site.paymentLink && (
                  <a
                    className="booking-link"
                    href={site.paymentConfirmationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ¿Ya pagaste? Validar pago por WhatsApp
                  </a>
                )}
              </article>
            ))}
          </div>
          <p className="price-note">
            Diagnóstico remoto: ARS 90.000 finales por hasta cinco equipos.
            Visitas, alcances mayores y otros servicios se cotizan aparte.
          </p>
        </section>

        <section className="automation-section section">
          <div>
            <p className="eyebrow">TAREAS QUE SE REPITEN</p>
            <h2>Si todos los viernes alguien arma el mismo Excel, hay tiempo para recuperar.</h2>
            <p>
              No hace falta comprar una plataforma enorme. Primero miramos el
              paso manual y vemos si vale la pena simplificarlo.
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
            <p className="eyebrow">CÓMO ES LA REVISIÓN</p>
            <h2>Sin una reunión eterna ni acceso a escondidas.</h2>
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
            <h2>Contanos qué se está trabando.</h2>
            <p>
              No hace falta que conozcas el término técnico. Completá cuatro
              datos y WhatsApp se abre con el mensaje preparado.
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
          Una mano técnica para oficinas que no tienen un área de sistemas.
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

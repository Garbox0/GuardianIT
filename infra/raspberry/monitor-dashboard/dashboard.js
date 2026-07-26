const INFRASTRUCTURE_GROUP = "Infraestructura";

const escapeHtml = (value) => String(value ?? "").replace(
  /[&<>"']/g,
  (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
);

const latest = (endpoint) => endpoint.results?.at(-1);
const durationMs = (result) => Math.round((result?.duration || 0) / 1_000_000);
const initials = (name) => name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

function relativeTime(timestamp, now = Date.now()) {
  if (!timestamp) return "sin datos";
  const seconds = Math.max(0, Math.round((now - new Date(timestamp).getTime()) / 1000));
  if (seconds < 60) return `hace ${seconds} s`;
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} h`;
  return `hace ${Math.floor(seconds / 86400)} d`;
}

function endpointModel(endpoint) {
  const result = latest(endpoint);
  const recent = (endpoint.results || []).slice(-50);
  const successes = recent.filter((entry) => entry.success).length;
  return {
    ...endpoint,
    currentSuccess: result?.success === true,
    hostname: result?.hostname || "servicio interno",
    latency: durationMs(result),
    lastTimestamp: result?.timestamp,
    availability: recent.length ? (successes / recent.length) * 100 : null,
    recent
  };
}

export function buildDashboardModel(endpoints) {
  if (!Array.isArray(endpoints)) throw new TypeError("La respuesta de monitoreo debe ser una lista");
  const groups = new Map();
  endpoints.map(endpointModel).forEach((endpoint) => {
    const name = endpoint.group || "Sin grupo";
    groups.set(name, [...(groups.get(name) || []), endpoint]);
  });

  const toGroup = ([name, services]) => {
    const failures = services.filter((service) => !service.currentSuccess).length;
    const availabilityValues = services.map((service) => service.availability).filter(Number.isFinite);
    return {
      name,
      services,
      failures,
      availability: availabilityValues.length
        ? availabilityValues.reduce((sum, value) => sum + value, 0) / availabilityValues.length
        : null,
      lastTimestamp: services.map((service) => service.lastTimestamp).filter(Boolean).sort().at(-1)
    };
  };

  const grouped = [...groups.entries()].map(toGroup).sort((a, b) => a.name.localeCompare(b.name));
  const clients = grouped.filter((group) => group.name !== INFRASTRUCTURE_GROUP);
  const platform = grouped.find((group) => group.name === INFRASTRUCTURE_GROUP) || {
    name: INFRASTRUCTURE_GROUP,
    services: [],
    failures: 0
  };
  const failures = grouped.reduce((sum, group) => sum + group.failures, 0);
  const lastTimestamp = grouped.map((group) => group.lastTimestamp).filter(Boolean).sort().at(-1);
  return { clients, platform, failures, serviceCount: endpoints.length, lastTimestamp };
}

function availability(value) {
  if (!Number.isFinite(value)) return "Sin historial";
  return `${value.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% reciente`;
}

function history(results) {
  const entries = results.slice(-20);
  return `${'<i class="none"></i>'.repeat(Math.max(0, 20 - entries.length))}${entries
    .map((result) => `<i class="${result.success ? "" : "fail"}" title="${result.success ? "Correcto" : "Falló"}"></i>`)
    .join("")}`;
}

function serviceCard(service) {
  return `<article class="service">
    <div class="service-top">
      <div><h3>${escapeHtml(service.name)}</h3><p class="host">${escapeHtml(service.hostname)}</p></div>
      <span class="badge ${service.currentSuccess ? "" : "down"}">${service.currentSuccess ? "OPERATIVO" : "REVISAR"}</span>
    </div>
    <strong>${service.latency} ms</strong>
    <small>${availability(service.availability)} · ${relativeTime(service.lastTimestamp)}</small>
    <div class="history" aria-label="Últimas comprobaciones">${history(service.recent)}</div>
  </article>`;
}

function clientCard(group, selected) {
  return `<button class="client ${selected ? "selected" : ""}" type="button" data-group="${escapeHtml(group.name)}" aria-pressed="${selected}">
    <div class="client-head">
      <span class="avatar">${escapeHtml(initials(group.name))}</span>
      <span class="badge ${group.failures ? "down" : ""}">${group.failures ? "REQUIERE ATENCIÓN" : "OPERATIVO"}</span>
    </div>
    <h3>${escapeHtml(group.name)}</h3>
    <p>${group.services.length} ${group.services.length === 1 ? "servicio controlado" : "servicios controlados"}</p>
    <div class="client-stats">
      <span><strong>${availability(group.availability)}</strong>historial visible</span>
      <span><strong>${relativeTime(group.lastTimestamp)}</strong>último control</span>
    </div>
  </button>`;
}

function renderActivity(model) {
  const events = [...model.clients, model.platform]
    .flatMap((group) => group.services.map((service) => ({ group: group.name, service, result: latest(service) })))
    .filter((event) => event.result)
    .sort((a, b) => new Date(b.result.timestamp) - new Date(a.result.timestamp))
    .slice(0, 5);

  document.querySelector("#activity").innerHTML = events.length
    ? events.map((event) => `<li class="${event.result.success ? "" : "fail"}">
        <time>${escapeHtml(relativeTime(event.result.timestamp).toUpperCase())}</time>
        <strong>${escapeHtml(event.group)} · ${escapeHtml(event.service.name)}</strong>
        <p>${event.result.success ? `Respondió correctamente en ${durationMs(event.result)} ms.` : "La última comprobación falló y requiere validación."}</p>
      </li>`).join("")
    : "<li><strong>Sin actividad registrada</strong><p>Los controles aparecerán aquí.</p></li>";
}

function renderPlatform(platform) {
  document.querySelector("#platform-services").innerHTML = platform.services.length
    ? platform.services.map((service) => `<div class="platform-row">
        <strong>${escapeHtml(service.name)}</strong>
        <span>${escapeHtml(service.hostname)} · ${service.latency} ms</span>
        <span class="state ${service.currentSuccess ? "" : "down"}">${service.currentSuccess ? "Operativo" : "Revisar"}</span>
      </div>`).join("")
    : '<div class="empty">No hay controles propios configurados.</div>';
}

let model;
let selectedGroup;

function selectClient(name) {
  selectedGroup = name;
  const group = model.clients.find((client) => client.name === name);
  document.querySelectorAll("[data-group]").forEach((button) => {
    const selected = button.dataset.group === name;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", selected);
  });
  if (!group) {
    document.querySelector("#detail-section").hidden = true;
    return;
  }
  document.querySelector("#detail-title").textContent = group.name;
  document.querySelector("#detail-summary").textContent = group.failures
    ? `${group.failures} ${group.failures === 1 ? "servicio requiere" : "servicios requieren"} validación.`
    : `${group.services.length} ${group.services.length === 1 ? "servicio operativo" : "servicios operativos"}.`;
  document.querySelector("#services").innerHTML = group.services.map(serviceCard).join("");
  document.querySelector("#detail-section").hidden = false;
}

function render(nextModel) {
  model = nextModel;
  selectedGroup = model.clients.some((client) => client.name === selectedGroup)
    ? selectedGroup
    : model.clients[0]?.name;

  document.querySelector("#client-count").textContent = model.clients.length;
  document.querySelector("#service-count").textContent = model.serviceCount;
  document.querySelector("#failure-count").textContent = model.failures;
  document.querySelector("#last-check").textContent = relativeTime(model.lastTimestamp).replace("hace ", "");
  document.querySelector("#refresh-note").textContent = `actualizado ${new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`;

  const overall = document.querySelector("#overall");
  overall.className = `overall ${model.failures ? "down" : ""}`;
  overall.querySelector("strong").textContent = model.failures ? "Hay que revisar" : "Todo operativo";
  overall.querySelector("p").textContent = model.failures
    ? `${model.failures} ${model.failures === 1 ? "control no respondió" : "controles no respondieron"} correctamente.`
    : "No hay fallas activas en los controles configurados.";

  document.querySelector("#clients").innerHTML = model.clients.length
    ? model.clients.map((group) => clientCard(group, group.name === selectedGroup)).join("")
    : '<div class="empty"><strong>Todavía no hay clientes cargados.</strong><br>Al agregar un grupo en Gatus aparecerá aquí automáticamente.</div>';
  document.querySelectorAll("[data-group]").forEach((button) => button.addEventListener("click", () => selectClient(button.dataset.group)));
  selectClient(selectedGroup);
  renderPlatform(model.platform);
  renderActivity(model);
}

async function refresh() {
  const button = document.querySelector("#refresh");
  button.disabled = true;
  try {
    const response = await fetch("/api/statuses", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    render(buildDashboardModel(await response.json()));
    document.querySelector("#error").hidden = true;
  } catch {
    document.querySelector("#error").hidden = false;
  } finally {
    button.disabled = false;
  }
}

if (typeof document !== "undefined") {
  document.querySelector("#refresh").addEventListener("click", refresh);
  refresh();
  setInterval(refresh, 60_000);
}

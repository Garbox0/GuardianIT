const INFRASTRUCTURE_GROUP = "Infraestructura";
const escapeHtml = (value) => String(value ?? "").replace(
  /[&<>"']/g,
  (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
);
const latest = (endpoint) => endpoint.results?.at(-1);
const durationMs = (result) => Math.round((result?.duration || 0) / 1_000_000);

function relativeTime(timestamp, now = Date.now()) {
  if (!timestamp) return "sin datos";
  const seconds = Math.max(0, Math.round((now - new Date(timestamp).getTime()) / 1000));
  if (seconds < 60) return `${seconds} s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h`;
  return `${Math.floor(seconds / 86400)} d`;
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
  const services = endpoints.map(endpointModel);
  const groups = new Map();
  services.forEach((endpoint) => {
    const name = endpoint.group || "Sin grupo";
    groups.set(name, [...(groups.get(name) || []), endpoint]);
  });
  const toGroup = ([name, groupServices]) => {
    const failures = groupServices.filter((service) => !service.currentSuccess).length;
    const values = groupServices.map((service) => service.availability).filter(Number.isFinite);
    return {
      name,
      services: groupServices,
      failures,
      availability: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null
    };
  };
  const grouped = [...groups.entries()].map(toGroup).sort((a, b) => a.name.localeCompare(b.name));
  const clients = grouped.filter((group) => group.name !== INFRASTRUCTURE_GROUP);
  const platform = grouped.find((group) => group.name === INFRASTRUCTURE_GROUP) || { name: INFRASTRUCTURE_GROUP, services: [], failures: 0 };
  return {
    clients,
    platform,
    services,
    serviceCount: services.length,
    failures: services.filter((service) => !service.currentSuccess).length,
    lastTimestamp: services.map((service) => service.lastTimestamp).filter(Boolean).sort().at(-1)
  };
}

const percent = (value) => Number.isFinite(value) ? `${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%` : "N/D";
const bytes = (value) => {
  if (!Number.isFinite(value)) return "N/D";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const power = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** power).toLocaleString("es-AR", { maximumFractionDigits: 1 })} ${units[power]}`;
};
const history = (results) => {
  const entries = results.slice(-16);
  return `${'<i class="none"></i>'.repeat(Math.max(0, 16 - entries.length))}${entries
    .map((result) => `<i class="${result.success ? "" : "fail"}" title="${result.success ? "UP" : "DOWN"}"></i>`)
    .join("")}`;
};

let model;

function populateGroups() {
  const select = document.querySelector("#group-filter");
  const previous = select.value;
  select.innerHTML = '<option value="">Todos</option>' +
    [...model.clients, model.platform].map((group) => `<option value="${escapeHtml(group.name)}">${escapeHtml(group.name)}</option>`).join("");
  select.value = [...select.options].some((option) => option.value === previous) ? previous : "";
}

function filteredServices() {
  const group = document.querySelector("#group-filter").value;
  const status = document.querySelector("#status-filter").value;
  const search = document.querySelector("#search").value.trim().toLocaleLowerCase("es");
  return model.services.filter((service) => {
    if (group && service.group !== group) return false;
    if (status === "up" && !service.currentSuccess) return false;
    if (status === "down" && service.currentSuccess) return false;
    return !search || [service.name, service.group, service.hostname, service.key]
      .some((value) => String(value || "").toLocaleLowerCase("es").includes(search));
  });
}

function endpointRow(service) {
  return `<tr>
    <td><span class="state-cell ${service.currentSuccess ? "" : "down"}">${service.currentSuccess ? "UP" : "DOWN"}</span></td>
    <td>${escapeHtml(service.group)}</td>
    <td><span class="endpoint-name">${escapeHtml(service.name)}</span><code title="${escapeHtml(service.key)}">${escapeHtml(service.key)}</code></td>
    <td><span class="mono">${escapeHtml(service.hostname)}</span></td>
    <td class="mono">${service.latency} ms</td>
    <td class="mono">${percent(service.availability)}</td>
    <td><span class="mono">${relativeTime(service.lastTimestamp)}</span><code>${escapeHtml(new Date(service.lastTimestamp).toLocaleString("es-AR"))}</code></td>
    <td><div class="history" aria-label="Últimas 16 muestras">${history(service.recent)}</div></td>
  </tr>`;
}

function renderEndpointTable() {
  const services = filteredServices();
  document.querySelector("#endpoint-rows").innerHTML = services.length
    ? services.map(endpointRow).join("")
    : '<tr><td colspan="8" class="empty">No hay endpoints para los filtros seleccionados.</td></tr>';
}

function renderGroups() {
  document.querySelector("#clients").innerHTML = [...model.clients, model.platform].map((group) =>
    `<div class="group-row">
      <button type="button" data-group="${escapeHtml(group.name)}"><strong>${escapeHtml(group.name)}</strong></button>
      <span><strong>${group.services.length}</strong><br>endpoints</span>
      <span><strong>${percent(group.availability)}</strong><br>muestras</span>
      <span class="status ${group.failures ? "down" : "up"}">${group.failures ? `${group.failures} DOWN` : "ALL UP"}</span>
    </div>`
  ).join("");
  document.querySelectorAll("[data-group]").forEach((button) => button.addEventListener("click", () => {
    document.querySelector("#group-filter").value = button.dataset.group;
    renderEndpointTable();
    document.querySelector("#endpoints").scrollIntoView();
  }));
}

function renderEvents() {
  const failures = model.services
    .flatMap((service) => service.recent.filter((result) => !result.success).map((result) => ({ service, result })))
    .sort((a, b) => new Date(b.result.timestamp) - new Date(a.result.timestamp))
    .slice(0, 12);
  document.querySelector("#event-count").textContent = `${failures.length} visibles`;
  document.querySelector("#event-list").innerHTML = failures.length
    ? failures.map(({ service, result }) => `<div class="event-row">
        <time>${escapeHtml(new Date(result.timestamp).toLocaleString("es-AR"))}</time>
        <strong>${escapeHtml(service.group)}</strong>
        <span><strong>${escapeHtml(service.name)}</strong><br><code>${escapeHtml(service.hostname)}</code></span>
        <span class="failure">CHECK FAILED</span>
      </div>`).join("")
    : '<div class="event-row"><time>VENTANA ACTUAL</time><strong class="success">SIN FALLAS</strong><span>No se registran resultados fallidos en las muestras cargadas.</span><span class="success">OK</span></div>';
}

function renderModel(nextModel) {
  model = nextModel;
  const up = model.services.length - model.failures;
  const latency = model.services.length
    ? Math.round(model.services.reduce((sum, service) => sum + service.latency, 0) / model.services.length)
    : 0;
  document.querySelector("#endpoint-count").textContent = model.services.length;
  document.querySelector("#client-count").textContent = `${model.clients.length} ${model.clients.length === 1 ? "cliente" : "clientes"} + plataforma`;
  document.querySelector("#up-count").textContent = up;
  document.querySelector("#down-count").textContent = model.failures;
  document.querySelector("#down-count").className = model.failures ? "bad" : "ok";
  document.querySelector("#average-latency").textContent = `${latency} ms`;
  document.querySelector("#endpoint-summary").className = `summary-state ${model.failures ? "down" : "up"}`;
  document.querySelector("#endpoint-summary").textContent = model.failures ? `${model.failures} DOWN` : "ALL SYSTEMS UP";
  populateGroups();
  renderEndpointTable();
  renderGroups();
  renderEvents();
}

function renderSystem(system) {
  document.querySelector("#sidebar-node").textContent = system.hostname;
  document.querySelector("#memory-used").textContent = `${system.memoryUsedPercent}%`;
  document.querySelector("#memory-detail").textContent = `${bytes(system.memoryUsed)} / ${bytes(system.memoryTotal)}`;
  document.querySelector("#load-average").textContent = system.load1.toFixed(2);
  document.querySelector("#uptime").textContent = `uptime ${relativeTime(Date.now() - system.uptimeSeconds * 1000)}`;
  const values = [
    system.hostname,
    `${system.platform} / ${system.arch}`,
    `${system.memoryUsedPercent}% · ${bytes(system.memoryUsed)}`,
    `${system.root.usedPercent}% · ${bytes(system.root.free)} libres`,
    system.hdd ? `${system.hdd.usedPercent}% · ${bytes(system.hdd.free)} libres` : "no montado",
    `${Math.floor(system.uptimeSeconds / 86400)} d ${Math.floor((system.uptimeSeconds % 86400) / 3600)} h`
  ];
  document.querySelectorAll("#node-metrics dd").forEach((element, index) => { element.textContent = values[index]; });
}

async function refresh() {
  const button = document.querySelector("#refresh");
  button.disabled = true;
  try {
    const [statusesResponse, systemResponse] = await Promise.all([
      fetch("/api/statuses", { cache: "no-store" }),
      fetch("/api/system", { cache: "no-store" })
    ]);
    if (!statusesResponse.ok || !systemResponse.ok) throw new Error("monitor unavailable");
    renderModel(buildDashboardModel(await statusesResponse.json()));
    renderSystem(await systemResponse.json());
    document.querySelector("#error").hidden = true;
    document.querySelector("#last-refresh").textContent = `Actualizado ${new Date().toLocaleTimeString("es-AR")}`;
  } catch {
    document.querySelector("#error").hidden = false;
  } finally {
    button.disabled = false;
  }
}

if (typeof document !== "undefined") {
  document.querySelector("#refresh").addEventListener("click", refresh);
  ["#group-filter", "#status-filter"].forEach((selector) => document.querySelector(selector).addEventListener("change", renderEndpointTable));
  document.querySelector("#search").addEventListener("input", renderEndpointTable);
  refresh();
  setInterval(refresh, 60_000);
}

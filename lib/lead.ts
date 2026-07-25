export type Lead = {
  name: string;
  business: string;
  devices: string;
  problem: string;
};

export function buildLeadMessage(lead: Lead) {
  return [
    "Hola, quiero consultar por Guardián PyME.",
    "",
    `Nombre: ${lead.name.trim()}`,
    `Empresa o actividad: ${lead.business.trim()}`,
    `Cantidad aproximada de equipos: ${lead.devices.trim()}`,
    `Problema principal: ${lead.problem.trim()}`
  ].join("\n");
}

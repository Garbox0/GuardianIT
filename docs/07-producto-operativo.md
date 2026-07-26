# Producto operativo — Guardián PyME

## Qué compra el cliente

El cliente no compra una Raspberry ni un panel. Compra cinco resultados:

1. Saber qué equipos, accesos y servicios sostienen su trabajo.
2. Detectar problemas de disponibilidad antes de enterarse por un usuario.
3. Comprobar la antigüedad del backup y realizar restauraciones de prueba.
4. Recibir prioridades con impacto, responsable y próximo paso.
5. Contar con una persona que documenta y da seguimiento.

## Funciones entregables

| Función | Evidencia para el cliente | Beneficio |
|---|---|---|
| Diagnóstico Windows | Informe HTML y JSON | Identifica problemas concretos sin modificar el equipo |
| Postura de dominio y correo | HTTPS, cabeceras, MX, SPF, DMARC y CAA | Detecta configuraciones públicas débiles sin escaneo invasivo |
| Monitoreo | Informe individual e historial | Reduce tiempo hasta detectar una caída |
| Respuesta controlada | Aviso, registro y acción autorizada | Reduce el tiempo de recuperación sin improvisar cambios |
| Control de backup | Fecha, destino y restauración documentada | Evita descubrir una copia inútil durante una emergencia |
| Gestión de incidentes | Registro breve de causa, acción y resultado | Evita repetir diagnósticos |
| Informe mensual | Disponibilidad, incidentes y tres prioridades | Permite decidir en qué invertir |

## Componentes

- `guardian-audit.ps1`: diagnóstico de solo lectura para Windows.
- `guardian-domain-audit.mjs`: revisión pública de dominio, web y correo.
- Gatus: disponibilidad e historial de servicios acordados.
- Tailscale: acceso privado al nodo de monitoreo.
- `guardian-report.mjs`: informe resumido desde el historial.
- `guardian-consolidate.mjs`: consolida varios equipos y limita el resumen a cinco prioridades.
- Plantillas en `docs/`: autorización, diagnóstico, condiciones y seguimiento.

## Lo que no prometemos

- No es un SOC, pentest ni antivirus.
- No garantiza que nunca habrá una interrupción.
- No accede a equipos sin autorización.
- No considera un backup válido hasta probar una restauración.
- No ofrece soporte ilimitado ni 24 × 7 en el plan inicial.

## Criterio de éxito

El servicio aporta valor si reduce interrupciones, baja el tiempo de diagnóstico
o permite recuperar información. Un control que no cambia una decisión se
elimina del alcance.

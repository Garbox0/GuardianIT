# Monitoreo y ciberseguridad

## Qué podemos ofrecer hoy

### Diagnóstico Guardián — incluido en el pago único

| Capa | Herramienta | Controles |
|---|---|---|
| Windows | `guardian-audit.ps1` | Disco, Defender, firmas, protección contra alteraciones, firewall, actualizaciones, BitLocker, administradores, UAC, SMBv1, Secure Boot, invitado, RDP, reinicio pendiente y backup |
| Dominio y correo | `guardian-domain-audit.mjs` | Certificado HTTPS, HSTS, CSP, protección MIME, política de referencia, MX, SPF, DMARC y CAA |
| Evidencia | JSON + HTML | Resultado fechado y portable por equipo y dominio |
| Priorización | `guardian-consolidate.mjs` | Agrupa hallazgos repetidos y propone hasta cinco prioridades |
| Backup | Procedimiento supervisado | Antigüedad, destino y restauración de prueba |

Los scripts son de solo lectura. No instalan agentes, no modifican políticas y
no ejecutan pruebas de explotación.

Auditoría pública de un dominio:

```powershell
npm run audit:domain -- empresa.com "D:\Clientes\CLI-2026-001\03-diagnostico"
```

### Puesta en orden — presupuesto separado

Sólo se ejecutan acciones aprobadas:

- actualizaciones y reinicios programados;
- separación de cuentas administrativas;
- MFA y revisión de accesos;
- desactivación de SMBv1, invitado o RDP innecesario;
- firewall y cifrado;
- configuración y prueba de backup;
- cabeceras web, SPF y DMARC;
- documentación y plan de reversión.

### Abono Guardián — continuidad mensual

La base técnica disponible es:

- Gatus para HTTP, contenido, dominio, certificado e historial;
- panel privado por Tailscale;
- informe de disponibilidad;
- revisión periódica Windows;
- control de backup y restauración acordada;
- hasta tres horas de soporte remoto.

## Herramientas de nuestra infraestructura

| Herramienta | Uso |
|---|---|
| Cloudflare Tunnel | Publicar sin abrir puertos del router |
| Cloudflare WAF, TLS y protección DDoS | Reducir tráfico abusivo y exposición directa |
| Tailscale | Administración privada cifrada |
| Gatus + SQLite | Estado, latencia, certificados, dominio e historial |
| Docker Compose | Aislar Gatus con filesystem de solo lectura |
| systemd | Reinicio, límites y hardening de servicios |
| SSH por clave | Administración sin contraseña |
| `unattended-upgrades` | Parches automáticos de seguridad de la Raspberry |

## Qué no ofrecemos

- SOC o respuesta 24 × 7;
- EDR/MDR administrado;
- SIEM y correlación de eventos;
- pentest, explotación o escaneo ofensivo;
- análisis forense;
- garantía de ausencia de incidentes;
- monitoreo de redes privadas de distintos clientes dentro de un mismo tailnet.

No usar las palabras “SOC”, “pentest”, “monitoreo 24 × 7” o “protección total”
en una propuesta.

## Brecha actual antes de vender monitoreo proactivo

Gatus conserva historial, pero todavía no tiene un proveedor de alertas. Por lo
tanto, el abono no debe prometer aviso proactivo hasta completar:

1. alerta de falla y recuperación a un canal controlado;
2. monitor externo independiente de la Raspberry;
3. prueba documentada apagando temporalmente un endpoint de laboratorio;
4. procedimiento de escalamiento y horarios;
5. separación de información entre clientes.

El primer canal puede ser correo, Telegram, Slack o un webhook, pero sus
credenciales deben quedar fuera del repositorio. El monitor externo es
obligatorio porque una Raspberry no puede avisar que ella misma perdió energía
o conectividad.

## Mejoras futuras con condición de entrada

| Herramienta | Incorporar cuando |
|---|---|
| Microsoft Defender for Business o MDR de tercero | Un cliente compre licencias y acepte monitoreo de endpoints |
| Inventario de red autorizado | El diagnóstico requiera descubrir activos y exista ventana aprobada |
| Wazuh, Fleet/osquery o SIEM | Haya varios clientes, personal para atender alertas y un acuerdo de retención |
| Escáner de vulnerabilidades | Exista autorización escrita, alcance, exclusiones y capacidad para validar falsos positivos |

No desplegar estas plataformas sólo para mostrar tecnología. Cada alerta crea
una obligación operativa y cada dato recolectado aumenta nuestra responsabilidad.

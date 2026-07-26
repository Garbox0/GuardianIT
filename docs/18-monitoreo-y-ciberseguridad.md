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
- mensaje automático adaptado al estado e historial de incidente;
- revisión periódica Windows;
- control de backup y restauración acordada;
- remediación limitada a runbooks aprobados;
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

## Alertas internas

Gatus envía avisos de falla y recuperación mediante ntfy. El tópico se guarda
en `/home/pi/guardian-pyme/.env` únicamente en la Raspberry y no se versiona. La
configuración predeterminada espera tres fallas y dos recuperaciones
consecutivas para evitar avisos por fluctuaciones breves.

Para recibirlos, instalar la aplicación ntfy o abrir `https://ntfy.sh/app` y
suscribirse al tópico privado entregado durante la instalación.

El 26 de julio de 2026 se realizó una falla controlada en un contenedor
descartable. Gatus detectó el fallo y confirmó el envío por ntfy sin interrumpir
el sitio productivo.

## Brecha restante antes de vender monitoreo proactivo

Todavía falta un monitor externo independiente de la Raspberry. Es obligatorio
porque el nodo no puede avisar mediante ntfy si perdió energía o conexión.

Configuración prevista en UptimeRobot:

1. monitor de palabra clave para `https://aerosftp.com`;
2. palabra esperada: `Guardián PyME`;
3. intervalo de cinco minutos;
4. alertas de caída y recuperación al correo del operador;
5. heartbeat separado para la Raspberry cuando el plan y la operación lo
   justifiquen;
6. prueba documentada de falla y recuperación.

No prometer monitoreo proactivo hasta que esta prueba externa esté completa.
El procedimiento operativo está en `docs/19-runbook-alertas.md`.

## Mejoras futuras con condición de entrada

| Herramienta | Incorporar cuando |
|---|---|
| Microsoft Defender for Business o MDR de tercero | Un cliente compre licencias y acepte monitoreo de endpoints |
| Inventario de red autorizado | El diagnóstico requiera descubrir activos y exista ventana aprobada |
| Wazuh, Fleet/osquery o SIEM | Haya varios clientes, personal para atender alertas y un acuerdo de retención |
| Escáner de vulnerabilidades | Exista autorización escrita, alcance, exclusiones y capacidad para validar falsos positivos |

No desplegar estas plataformas sólo para mostrar tecnología. Cada alerta crea
una obligación operativa y cada dato recolectado aumenta nuestra responsabilidad.

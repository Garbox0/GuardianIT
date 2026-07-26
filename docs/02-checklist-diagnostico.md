# Checklist — Diagnóstico Guardián

## Autorización

- [ ] Cliente, responsable y datos de contacto.
- [ ] Alcance autorizado por escrito.
- [ ] Equipos y cuentas incluidos.
- [ ] Horario permitido.
- [ ] Confirmación de que existe backup antes de cambios.

## Contexto

- [ ] ¿Qué no puede dejar de funcionar?
- [ ] ¿Qué problema ocurrió recientemente?
- [ ] ¿Quién brinda soporte actualmente?
- [ ] ¿Cuánto tiempo de interrupción toleran?

## Equipos y red

- [ ] Router y proveedor de internet documentados.
- [ ] Equipos críticos identificados.
- [ ] Estado general de Windows y almacenamiento.
- [ ] Impresoras y recursos compartidos.
- [ ] Wi-Fi de trabajo y de invitados separados, si corresponde.

## Seguridad de Windows y eventos

- [ ] Antivirus instalado e identificado.
- [ ] Protección en tiempo real, firmas y protección contra alteraciones.
- [ ] Firewall activo en los perfiles correspondientes.
- [ ] Actualizaciones, cifrado, administradores locales y accesos remotos.
- [ ] Detecciones recientes del antivirus revisadas sin copiar contenido privado.
- [ ] Resumen de eventos críticos y errores de los últimos siete días.
- [ ] Cantidad de inicios de sesión fallidos, si el registro está disponible.
- [ ] Aclarar que los conteos de eventos no equivalen a un SIEM ni prueban por sí
  solos la existencia de un ataque.

## Backups

- [ ] Origen y destino.
- [ ] Fecha del último backup.
- [ ] Resultado visible de la última ejecución.
- [ ] Copia separada del equipo principal.
- [ ] Última restauración probada.

## Accesos

- [ ] Cuentas administrativas identificadas.
- [ ] MFA en correo y servicios críticos.
- [ ] Excolaboradores sin acceso.
- [ ] No registrar contraseñas en el informe.

## Dominio, web y correo

- [ ] Certificado TLS y redirección de HTTP a HTTPS.
- [ ] HSTS, CSP, protección contra marcos, MIME y política de referidos.
- [ ] Política de permisos del navegador.
- [ ] Registros MX, SPF, DMARC y CAA.
- [ ] Si se menciona OWASP, describirlos como indicadores seleccionados de
  configuración relacionados con OWASP Top 10:2025, no como una evaluación
  completa ni una prueba de penetración.
- [ ] Toda IP pública o puerto a monitorear está expresamente autorizado y
  definido; no realizar barridos.

## Cierre

- [ ] Evidencia mínima y sanitizada.
- [ ] Cinco prioridades como máximo.
- [ ] Separar hallazgo, impacto y recomendación.
- [ ] No modificar nada sin aprobación.
- [ ] Fecha de seguimiento acordada.

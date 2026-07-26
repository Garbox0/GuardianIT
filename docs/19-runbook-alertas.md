# Runbook de alertas

## Objetivo

Detectar una interrupción, confirmar si es real y comunicar una respuesta
honesta. Una alerta no implica automáticamente un incidente de seguridad.

## Canales

- **Gatus + ntfy:** detecta desde la Raspberry problemas de contenido, HTTPS,
  certificado, dominio y conectividad saliente.
- **UptimeRobot:** debe observar el sitio desde Internet y recibir el heartbeat
  de la Raspberry. Es el canal que avisa si el nodo pierde energía o conexión.
- **Panel privado:** conserva el historial en `http://100.80.237.96:8080`.

El tópico de ntfy y la URL del heartbeat son secretos operativos. Se guardan en
`/home/pi/guardian-pyme/.env`, con permisos `600`, y no se envían a clientes.

## Qué hacer cuando llega un aviso

| Alerta | Primera verificación | Acción |
|---|---|---|
| Sitio sin contenido esperado | Abrir `https://aerosftp.com` y revisar Gatus | Confirmar desde otra red; revisar túnel y servidor web |
| HTTPS o certificado | Revisar fecha, DNS y estado de Cloudflare | Corregir antes del vencimiento o escalar al proveedor |
| Dominio próximo a vencer | Confirmar en el registrador | Renovar con autorización del titular |
| Heartbeat ausente | Probar Tailscale y energía/conexión del nodo | Contactar al responsable local si no vuelve |
| Recuperación | Confirmar dos verificaciones sanas | Registrar cierre y duración |

## Comandos de diagnóstico

```bash
ssh pi@192.168.0.179
cd /home/pi/guardian-pyme
docker compose ps
docker compose logs --tail=100 gatus
systemctl status guardian-pyme guardian-site cloudflared
systemctl status guardian-heartbeat.timer
curl -fsS http://100.80.237.96:8080/api/v1/endpoints/statuses
```

## Comunicación con el cliente

Mensaje inicial:

> Detectamos una interrupción en el servicio monitoreado a las HH:MM. Estamos
> verificando si corresponde al sitio, la conexión o el proveedor. Próxima
> actualización estimada: HH:MM.

Mensaje de cierre:

> El servicio volvió a responder a las HH:MM y quedó estable en dos controles
> consecutivos. Duración observada: NN minutos. Causa confirmada o probable:
> ____. Acción recomendada: ____.

No afirmar que hubo un ataque sin evidencia. No prometer atención fuera del
horario y tiempo de respuesta pactados.

## Alta del monitor externo

En UptimeRobot:

1. crear un monitor de palabra clave para `https://aerosftp.com`;
2. usar `Guardián PyME` como texto esperado e intervalo de cinco minutos;
3. activar avisos de caída y recuperación al correo operativo;
4. crear un heartbeat y copiar su URL secreta;
5. guardar la URL en `/home/pi/guardian-pyme/.env`:

   ```text
   GUARDIAN_HEARTBEAT_URL=https://...
   ```

6. instalar y activar el timer:

   ```bash
   sudo cp guardian-heartbeat.service guardian-heartbeat.timer /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now guardian-heartbeat.timer
   sudo systemctl start guardian-heartbeat.service
   sudo systemctl status guardian-heartbeat.timer
   ```

7. pausar la prueba durante una ventana controlada y verificar que lleguen el
   aviso de caída y el de recuperación.

Registrar fecha, operador, alerta recibida y resultado. Recién después de esa
prueba puede venderse el aviso proactivo.

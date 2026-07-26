# Estado instalado

Última verificación: 2026-07-26.

- Nodo: `judicia-scraper`; nombre Tailscale `guardian-monitor`
  (`100.80.237.96`).
- Panel: `https://guardian-monitor.tailfe3e24.ts.net`.
- Contenedor: `guardian-gatus`.
- Tablero maestro: servicio `guardian-monitor-dashboard`, con grupos de cliente,
  resumen operativo y datos obtenidos desde Gatus.
- Imagen ARM64:
  `ghcr.io/twin/gatus@sha256:c5f210d095fa78e6efaa20ffeb14803f2ba4f10615e16a6d12087697149617f0`.
- Persistencia: volumen Docker `guardian-pyme_gatus-data`.
- Chequeos activos: conectividad HTTPS, motor local, contenido del sitio
  comercial, vencimiento del dominio y certificado.
- Alertas internas: ntfy para falla y recuperación, con tópico secreto fuera
  del repositorio. Envío probado con una falla controlada el 2026-07-26.
- Pendiente: monitor externo independiente de la Raspberry.
- Exposición: Tailscale Serve por HTTPS y sólo para el tailnet. El tablero
  escucha en `127.0.0.1:8091` y Gatus en `127.0.0.1:8080`; los puertos directos
  no están disponibles en la IP LAN ni en la IP de Tailscale. Funnel no está
  habilitado.

## Sitio comercial

- URL pública: `https://aerosftp.com`.
- Alias: `https://www.aerosftp.com`.
- Origen: archivos estáticos en `127.0.0.1:8090`.
- Publicación: Cloudflare Tunnel `d71815a9-7a06-42a2-a9ff-9232d516ddb1`.
- Servicios de arranque: `guardian-site.service` y `cloudflared.service`.
- Puertos abiertos en el router: ninguno.
- WAF: bloqueo de scanners comunes y de métodos distintos de
  `GET`, `HEAD` y `OPTIONS`.
- SSH: acceso exclusivo por clave pública para `pi`; contraseña y root
  deshabilitados.
- Actualizaciones de seguridad: automáticas mediante `unattended-upgrades`,
  sin reinicio automático.
- Hardening: exposición `3.0 OK` para el sitio y `3.2 OK` para el túnel según
  `systemd-analyze security`.

OpenHealth fue retirado. No quedan contenedores `current-*` activos y se
conservaron los volúmenes `current_postgres_data` y `current_keycloak_data`.

Respaldo final:

```text
/home/pi/openhealth-bridge/retired-2026-07-25/openhealth-final.dump
SHA256 2f98d06cc7d1a81ac6f5e46025a1fdcafcd4c3057664aab09176a6e84e1af117

/home/pi/openhealth-bridge/retired-2026-07-25/openhealth-compose-config.tgz
SHA256 0bfa61db15fdce78d2cb5de13a8dd65a926359521ecd37e3c3aa29288ac7b201
```

## HDD USB

Revisado nuevamente después de reconectarlo por USB 3:

- Disco: Seagate `ST500LT012-1DG142`, 500 GB.
- Partición: `/dev/sda1`, NTFS, UUID `EE4C95F24C95B635`.
- SMART general y autotest corto: aprobados.
- Indicadores históricos: 16 sectores reasignados, 1 error no corregible y
  173 errores CRC.
- NTFS: `$MFT` y `$MFTMirr` no coinciden.
- Lectura de prueba: correcta y sin errores nuevos del kernel.

El disco está montado en `/mnt/hdd` como NTFS de sólo lectura. Su entrada en
`/etc/fstab` usa `ro,nofail,x-systemd.automount,x-systemd.device-timeout=10s`;
su ausencia no impide el arranque. `smartd` está activo con modo SAT. No debe
utilizarse como respaldo primario hasta reparar NTFS desde Windows y completar
un autotest SMART extendido.

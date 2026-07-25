# Estado instalado

Última verificación: 2026-07-25.

- Nodo: `judicia-scraper` (`100.80.237.96` en Tailscale).
- Panel: `http://100.80.237.96:8080`.
- Contenedor: `guardian-gatus`.
- Imagen ARM64:
  `ghcr.io/twin/gatus@sha256:c5f210d095fa78e6efaa20ffeb14803f2ba4f10615e16a6d12087697149617f0`.
- Persistencia: volumen Docker `guardian-pyme_gatus-data`.
- Chequeos activos: conectividad HTTPS, motor local y sitio comercial privado.
- Exposición: solamente `100.80.237.96:8080`; no escucha en la IP LAN.

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

El disco quedó desmontado y su entrada en `/etc/fstab` se dejó como
`ro,noauto,nofail`. No debe utilizarse como respaldo primario hasta reparar
NTFS desde Windows y completar un autotest SMART extendido.

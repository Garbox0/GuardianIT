# Nodo Guardián PyME

Panel privado y liviano para demostrar monitoreo de disponibilidad. Corre Gatus
en Docker, conserva el historial en SQLite y escucha únicamente en la IP privada
de la Raspberry dentro de la red Tailscale.

## Operación

En la Raspberry:

```bash
cd /home/pi/guardian-pyme
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=100
```

Las alertas internas usan ntfy. El tópico privado se define en `.env`; nunca
debe copiarse al repositorio. La prueba de extremo a extremo y el procedimiento
de respuesta están documentados en `docs/19-runbook-alertas.md`.

El arranque se coordina con `tailscale-online.target` mediante
`guardian-pyme.service`. Así Docker no intenta publicar el puerto antes de que
exista la IP de Tailscale.

El panel queda disponible para equipos autorizados en el tailnet:

```text
http://100.80.237.96:8080
```

El tráfico viaja dentro del túnel cifrado de Tailscale. No se abre ningún puerto
en el router ni se usa Tailscale Funnel. La función Tailscale Serve no estaba
habilitada en el tailnet durante la instalación.

## Verificaciones

```bash
curl -fsS http://100.80.237.96:8080/api/v1/endpoints/statuses
docker inspect guardian-gatus --format '{{.State.Status}}'
docker stats --no-stream guardian-gatus
findmnt /mnt/hdd
sudo smartctl -d sat -H /dev/sda
systemctl status smartmontools
```

## Agregar un cliente

Editar `config/config.yaml` y sumar un endpoint. Ejemplo:

```yaml
  - name: "Web del cliente"
    group: "CLI-2026-001"
    url: "https://cliente.example"
    interval: 1m
    conditions:
      - "[STATUS] == 200"
      - "[RESPONSE_TIME] < 3000"
```

Gatus recarga los cambios del directorio de configuración. Si no lo hiciera:

```bash
docker compose restart gatus
```

No colocar contraseñas ni tokens en el nombre, la URL o las condiciones visibles
del panel. Los chequeos internos deben usar IP privadas y mantener ocultos URL,
host y puerto en la interfaz.

Para un servicio público autorizado puede comprobarse un puerto exacto, sin
recorrer otras direcciones ni puertos:

```yaml
  - name: "Servidor público"
    group: "CLI-2026-001"
    url: "tcp://203.0.113.10:443"
    interval: 1m
    conditions:
      - "[CONNECTED] == true"
    alerts:
      - type: ntfy
        description: "El servicio público acordado no acepta conexiones."
```

## Resguardo del proyecto retirado

OpenHealth se retiró sin borrar sus volúmenes. El respaldo final está en:

```text
/home/pi/openhealth-bridge/retired-2026-07-25/
```

El disco USB está montado en `/mnt/hdd` como NTFS de solo lectura. La opción
`nofail` evita que su ausencia bloquee el arranque. No debe ser la única copia
de ningún cliente.

El bridge USB requiere modo SAT explícito para leer SMART. `smartd.conf` y
`smartmontools.default` corrigen el fallo de autodetección y fijan el intervalo
de revisión en 30 minutos.
El disco informa sectores reasignados aunque el estado general siga aprobado;
por eso se conserva en solo lectura y no se usa como almacenamiento principal.

## Sitio público

La landing se sirve como archivos estáticos en `127.0.0.1:8090` y Cloudflare
Tunnel publica `aerosftp.com` y `www.aerosftp.com`. No se abre ningún puerto en
el router.

```bash
systemctl status guardian-site cloudflared
curl -I http://127.0.0.1:8090/
cloudflared tunnel ingress validate
```

El servicio web usa `/home/pi/guardian-site/public` y
`/home/pi/guardian-site/server.mjs`.

## Monitor externo

Los archivos `guardian-heartbeat.service` y `guardian-heartbeat.timer` quedan
preparados para enviar una señal cada tres minutos a un monitor externo. No
deben activarse hasta guardar una `GUARDIAN_HEARTBEAT_URL` válida en `.env`.

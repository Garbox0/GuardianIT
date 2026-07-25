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
```

## Agregar un cliente

Editar `config/config.yaml` y sumar un endpoint. Ejemplo:

```yaml
  - name: "Web del cliente"
    group: "Cliente"
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

## Resguardo del proyecto retirado

OpenHealth se retiró sin borrar sus volúmenes. El respaldo final está en:

```text
/home/pi/openhealth-bridge/retired-2026-07-25/
```

El disco USB documentado como `/mnt/hdd` no estaba conectado durante el retiro.
Ese directorio pertenece actualmente a la microSD y no debe tratarse como copia
externa.

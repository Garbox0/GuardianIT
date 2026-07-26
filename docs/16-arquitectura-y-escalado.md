# Arquitectura y escalado

## Decisión actual

Mantener una arquitectura pequeña, reproducible y fácil de operar:

- landing estática detrás de Cloudflare Tunnel;
- `cloudflared` y el servidor web gestionados por `systemd`;
- Gatus en Docker Compose, accesible sólo por Tailscale;
- Raspberry sin puertos públicos abiertos.

Docker se usa cuando aísla una herramienta con estado o dependencias. El sitio
estático sigue como servicio nativo porque agregarle un contenedor no mejora su
disponibilidad.

## Capacidad observada

El 25 de julio de 2026 se ejecutó una prueba local contra el origen:

- 500 solicitudes;
- concurrencia 25;
- 0 errores;
- aproximadamente 240 solicitudes por segundo;
- p50 83 ms y p95 208 ms.

Es una comprobación corta y local, no una garantía de capacidad desde Internet.
Sí confirma que el sitio comercial actual está muy lejos de justificar un
orquestador.

## Por qué no Kubernetes ahora

Un clúster de un solo nodo conserva los mismos puntos únicos de falla: Raspberry,
alimentación, enlace a Internet y almacenamiento. Además agrega plano de control,
red interna, actualizaciones y recuperación del clúster.

Reconsiderar K3s o Kubernetes sólo si se cumplen todas estas condiciones:

1. hay al menos tres nodos independientes;
2. existen varios servicios públicos que requieren despliegues coordinados;
3. el tráfico medido o los compromisos de disponibilidad lo justifican;
4. hay tiempo y presupuesto para operar y recuperar el clúster.

## Camino de crecimiento

### Etapa 1 — vender y operar

- mantener la landing estática;
- activar monitoreo externo independiente de la Raspberry;
- configurar alertas;
- hacer backup cifrado fuera del domicilio;
- medir visitas, compras y reservas.

### Etapa 2 — eliminar puntos únicos

- mover la landing a alojamiento estático en el borde o definir una regla de
  caché con purga durante el despliegue;
- ejecutar una segunda réplica de `cloudflared` en otro equipo, alimentación y
  enlace;
- mantener Tailscale para administración privada.

### Etapa 3 — automatizar demanda real

Agregar n8n u otra herramienta sólo cuando exista un flujo repetitivo medido,
por ejemplo pago confirmado, formulario, agenda y seguimiento. Debe permanecer
privada por Tailscale o Cloudflare Access y almacenar secretos fuera del
repositorio.

### Etapa 4 — aplicación multiempresa

Si el servicio evoluciona a un portal con cuentas de clientes:

- base de datos PostgreSQL administrada;
- almacenamiento externo cifrado;
- separación estricta por cliente;
- auditoría y copias verificadas;
- dos o más instancias de aplicación antes de evaluar balanceo avanzado.

## Próximas mejoras por impacto

1. monitoreo externo y alertas;
2. backup externo probado;
3. medición del embudo comercial;
4. segunda réplica del túnel;
5. automatización del seguimiento de ventas.

No instalar Prometheus, Grafana, Traefik, n8n ni Kubernetes sin una necesidad
operativa concreta. Cada herramienta nueva debe reducir una tarea, un riesgo o
un tiempo medible.

# DNS y publicación — aerosftp.com

Cloudflare administra el DNS. Hostinger conserva únicamente el registro del
dominio; no se deben cambiar sus nameservers.

## Arquitectura vigente

`aerosftp.com` y `www.aerosftp.com` son CNAME proxied hacia:

```text
d71815a9-7a06-42a2-a9ff-9232d516ddb1.cfargotunnel.com
```

El túnel termina en la Raspberry y envía ambos hostnames al servidor estático
en `http://127.0.0.1:8090`. No se abre ningún puerto en el router.

No deben existir registros públicos para `api`, `auth` o `centralsalud` hasta
que aparezca una necesidad nueva y documentada.

## Reglas de seguridad

Las reglas vigentes bloquean:

- rutas típicas de scanners;
- métodos distintos de `GET`, `HEAD` y `OPTIONS`.

Ambas reglas deben estar acotadas a `aerosftp.com` y `www.aerosftp.com`.

## Validación

```powershell
Resolve-DnsName aerosftp.com
Resolve-DnsName www.aerosftp.com
curl.exe -I https://aerosftp.com
curl.exe -I https://www.aerosftp.com
curl.exe -I https://aerosftp.com/.env
curl.exe -X POST -I https://aerosftp.com
```

Los dos primeros accesos HTTPS deben responder `200`; el scanner y `POST`
deben responder `403`.

En la Raspberry:

```bash
systemctl is-active guardian-site cloudflared
curl -I http://127.0.0.1:8090
cloudflared tunnel ingress validate
```

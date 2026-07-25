# Migración DNS — aerosftp.com

Cloudflare administra el DNS. Hostinger conserva únicamente el registro del
dominio; no se deben cambiar sus nameservers.

## Eliminar

Eliminar los registros de tipo `Tunnel` que apuntan a `OpenHealth`:

- `aerosftp.com`
- `www.aerosftp.com`
- `api.aerosftp.com`
- `auth.aerosftp.com`
- `centralsalud.aerosftp.com`

## Crear para el dominio raíz

Todos inicialmente como **DNS only**:

| Tipo | Nombre | Contenido |
|---|---|---|
| A | `@` | `162.159.143.30` |
| A | `@` | `172.66.3.26` |
| TXT | `_openai-site-verification` | `openai-site-verification=3C5XG_EZnWBx5js_IM23naXMb7zXM-H0V4ovBdDZ2QU` |
| TXT | `_cf-custom-hostname` | `361ef89f-b6e2-40a0-9ab2-97e3a771c146` |

## Crear para www

Todos inicialmente como **DNS only**:

| Tipo | Nombre | Contenido |
|---|---|---|
| CNAME | `www` | `custom-domains.chatgpt.site` |
| TXT | `_openai-site-verification.www` | `openai-site-verification=ZuUjNQLsiN5PoG7M8B2fMaao0chOyj1OwQETgxQLMs8` |
| TXT | `_cf-custom-hostname.www` | `2ae86a88-b353-4012-b9b2-6f9966e83421` |

No crear registros para `api`, `auth` o `centralsalud` hasta que exista una
necesidad nueva y documentada.

## Reglas de seguridad

Eliminar las reglas específicas de Keycloak, Swagger/OpenAPI y métodos de
OpenHealth. Puede conservarse la regla genérica contra scanners si no bloquea
recursos legítimos de la landing.

## Validación

Después del cambio, verificar:

```powershell
Resolve-DnsName aerosftp.com
Resolve-DnsName www.aerosftp.com
curl.exe -I https://aerosftp.com
curl.exe -I https://www.aerosftp.com
```

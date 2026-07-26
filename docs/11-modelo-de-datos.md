# Modelo de datos operativo

## Estado actual

Guardián PyME no tiene una base de datos de negocio:

- la landing es estática y no almacena formularios;
- WhatsApp y Mercado Pago reciben la consulta o el pago;
- `gatus.db` pertenece a Gatus y conserva únicamente resultados de monitoreo;
- no existen tablas propias, migraciones ni claves foráneas que mantener.

Esto es intencional para el inicio: evita custodiar credenciales, tarjetas y
datos personales sin necesidad.

El 25 de julio de 2026 se verificó el SQLite productivo de Gatus en modo de
solo lectura: `PRAGMA integrity_check` respondió `ok`. Sus tablas de endpoints,
resultados, condiciones, eventos, alertas, disponibilidad y suites tienen las
claves foráneas esperadas, con borrado en cascada de resultados dependientes.
Ese esquema es propiedad de Gatus: no se agregan tablas de clientes ni
migraciones manuales dentro de `gatus.db`.

## Entidades que sí existen en el negocio

Aunque todavía se registren en un expediente, cada dato debe pertenecer a una
de estas entidades:

| Entidad | Identificador | Relación principal |
|---|---|---|
| Cliente | `CLI-AAAA-NNN` | Tiene contactos, activos y trabajos |
| Contacto | `CON-AAAA-NNN` | Pertenece a un cliente |
| Trabajo | `TRA-AAAA-NNN` | Pertenece a un cliente |
| Autorización | `AUT-AAAA-NNN` | Pertenece a un trabajo |
| Activo | `ACT-AAAA-NNN` | Pertenece a un cliente |
| Hallazgo | `HAL-AAAA-NNN` | Pertenece a un trabajo y puede referir a un activo |
| Evidencia | `EVI-AAAA-NNN` | Respalda un hallazgo |
| Acción | `ACC-AAAA-NNN` | Resuelve o acepta un hallazgo |
| Prueba de backup | `BKP-AAAA-NNN` | Pertenece a un trabajo y a un activo |
| Objetivo monitoreado | `MON-AAAA-NNN` | Pertenece a un cliente y a un activo |
| Pago | `PAG-AAAA-NNN` | Pertenece a un trabajo |

`AAAA` es el año y `NNN` un número correlativo. El identificador se conserva
aunque cambie el nombre visible.

## Relaciones

```text
Cliente
├── Contactos
├── Activos
├── Objetivos monitoreados ── Activo
└── Trabajos
    ├── Autorizaciones
    ├── Pagos
    ├── Hallazgos ── Activo
    │   ├── Evidencias
    │   └── Acciones
    └── Pruebas de backup ── Activo
```

Reglas equivalentes a claves foráneas:

- no puede existir un trabajo sin cliente;
- no puede existir un hallazgo sin trabajo;
- una evidencia siempre debe indicar qué hallazgo respalda;
- una acción debe indicar el hallazgo que trata;
- un activo referido debe pertenecer al mismo cliente del trabajo;
- un pago guarda solo identificador externo, importe, moneda y estado;
- nunca se guardan números de tarjeta, contraseñas, tokens o claves de
  recuperación.

## Expediente para los primeros clientes

Crear fuera de este repositorio:

```text
clientes/
└── CLI-2026-001-nombre/
    ├── 00-ficha-y-contactos.md
    ├── 01-autorizacion.pdf
    ├── 02-inventario.md
    ├── 03-diagnostico/
    ├── 04-hallazgos-y-acciones.md
    ├── 05-cambios.md
    ├── 06-entregables/
    └── 07-cierre-y-retencion.md
```

No subir ese directorio a Git ni guardarlo en la carpeta pública del sitio.
La evidencia debe ser mínima, necesaria y con una fecha de eliminación.

## Esquema relacional futuro

Recién conviene implementar una base cuando haya varios clientes activos,
usuarios concurrentes o demasiados registros para operar con expedientes. Las
tablas iniciales serán:

```text
clients
contacts(client_id -> clients.id)
engagements(client_id -> clients.id)
assets(client_id -> clients.id)
authorizations(engagement_id -> engagements.id)
findings(engagement_id -> engagements.id, asset_id -> assets.id nullable)
evidence(findings_id -> findings.id)
actions(finding_id -> findings.id)
backup_tests(engagement_id -> engagements.id, asset_id -> assets.id)
monitoring_targets(client_id -> clients.id, asset_id -> assets.id nullable)
payments(engagement_id -> engagements.id)
```

Las eliminaciones deben ser restrictivas. Un cliente no se borra en cascada:
se cierra, se aplica el plazo de retención y luego se purga mediante un proceso
controlado. El esquema interno de Gatus queda fuera de este modelo y no debe
modificarse.

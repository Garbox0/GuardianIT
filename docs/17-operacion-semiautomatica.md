# Operación semiautomática

## Qué ocurre después del pago

1. Validar la operación en Mercado Pago.
2. Enviar la agenda privada.
3. Confirmar alcance y autorización.
4. Ejecutar el diagnóstico automático en cada Windows autorizado.
5. Consolidar los JSON en un solo informe.
6. Revisar las cinco prioridades y entregar.
7. Cotizar correcciones o continuidad sólo si corresponde.

## Diagnóstico por equipo

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\guardian-audit.ps1 `
  -ClientName "Nombre del cliente" `
  -BackupPath "D:\Backups" `
  -OutputDirectory "D:\Clientes\CLI-2026-001\03-diagnostico"
```

El script releva almacenamiento, antivirus, firewall, actualizaciones, cifrado,
administradores y antigüedad del backup. No corrige ni reinicia.

## Informe consolidado

Después de ejecutar el diagnóstico en hasta cinco equipos, colocar todos los
JSON en la misma carpeta y ejecutar:

```powershell
npm run consolidate -- `
  "D:\Clientes\CLI-2026-001\03-diagnostico" `
  "Nombre del cliente" `
  "D:\Clientes\CLI-2026-001\06-entregables\informe.html"
```

La herramienta:

- agrupa un mismo problema detectado en varios equipos;
- ordena prioridades altas y medias;
- limita el resumen a cinco decisiones;
- conserva toda la evidencia en una tabla;
- genera un HTML responsive e imprimible.

## Intervención que no se elimina

- verificar el pago en la cuenta real;
- entrevistar al responsable;
- obtener autorización;
- decidir si un hallazgo automático tiene impacto comercial;
- probar una restauración sin arriesgar datos;
- aprobar y ejecutar cambios;
- explicar el resultado.

Estas tareas protegen al cliente y a Guardián PyME. Automatizarlas por completo
sería prometer más de lo que la evidencia permite.

## Próxima automatización

Cuando la validación manual genere demoras, implementar:

```text
Mercado Pago webhook
        ↓
operación consultada con credencial privada
        ↓
estado approved
        ↓
creación del expediente + envío de agenda
```

No hace falta un CRM, Kubernetes ni n8n antes de que exista volumen. El primer
salto útil es el webhook de pago; el segundo, una carga privada de los JSON.

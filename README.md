# Guardián PyME

Sitio comercial y kit operativo para vender soporte informático, continuidad
y automatización práctica a pequeñas empresas argentinas.

Para operar con un cliente, empezar por
[`docs/00-primero-leeme.md`](docs/00-primero-leeme.md).

## Configuración local

1. Copiar `.env.example` como `.env.local`.
2. Completar el WhatsApp sin `+`, espacios ni guiones.
3. Completar zona y disponibilidad.
4. Opcional: agregar un Link de Pago y una agenda en línea para habilitar la
   compra y reserva sin intervención.
5. Ejecutar:

```bash
npm install
npm run dev
```

## Verificación

```bash
npm run check
```

## Alcance actual

- Landing responsive con precios y preguntas frecuentes.
- Formulario local que prepara una consulta de WhatsApp sin almacenar datos.
- Diagnóstico Windows de solo lectura con informe HTML y evidencia JSON.
- Panel privado de disponibilidad con historial en la Raspberry.
- Generador de informe resumido desde el monitoreo.
- Plantillas comerciales, autorización y onboarding en `docs/`.

## Herramientas operativas

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\guardian-audit.ps1 `
  -ClientName "Nombre del cliente" `
  -BackupPath "D:\Backups"
```

```bash
npm run report -- http://100.80.237.96:8080 "Nombre del cliente"
```

El producto y sus límites están explicados en
[`docs/07-producto-operativo.md`](docs/07-producto-operativo.md).
El flujo de autoservicio está en
[`docs/10-cobro-y-agenda.md`](docs/10-cobro-y-agenda.md).
La medición y los seguimientos están en
[`docs/15-automatizacion-de-ventas.md`](docs/15-automatizacion-de-ventas.md).

## Antes de publicar

- Configurar datos reales de contacto.
- Confirmar zona y horarios.
- Validar precios, impuestos y condiciones con un profesional local.
- Reemplazar precios orientativos si cambia el alcance.
- Probar el enlace de WhatsApp desde un teléfono.

## Nodo de demostración

La Raspberry ejecuta un panel de monitoreo privado para demostraciones. La
configuración reproducible y el procedimiento operativo están en
[`infra/raspberry`](infra/raspberry/README.md).

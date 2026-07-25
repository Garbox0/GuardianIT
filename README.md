# Guardián PyME

Sitio comercial y kit operativo para vender soporte informático, continuidad
y automatización práctica a pequeñas empresas argentinas.

## Configuración local

1. Copiar `.env.example` como `.env.local`.
2. Completar el WhatsApp sin `+`, espacios ni guiones.
3. Completar zona y disponibilidad.
4. Ejecutar:

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
- Plantillas comerciales y operativas en `docs/`.
- Sin panel, cuentas ni base de datos: se agregan únicamente cuando exista una
  necesidad pagada.

## Antes de publicar

- Configurar datos reales de contacto.
- Confirmar zona y horarios.
- Validar precios, impuestos y condiciones con un profesional local.
- Reemplazar precios orientativos si cambia el alcance.
- Probar el enlace de WhatsApp desde un teléfono.

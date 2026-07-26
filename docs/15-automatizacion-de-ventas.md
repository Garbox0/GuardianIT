# Automatización de ventas

## Embudo activo

```text
Sitio → Mercado Pago → Agenda → Confirmación → Diagnóstico
```

El cliente puede pagar y reservar sin conversación previa. La única validación
manual obligatoria es comprobar que el pago figure acreditado antes de
trabajar.

## Configurar ahora en Google Calendar

Editar la agenda `GuardianIT`:

- duración: 2 horas;
- anticipación mínima: 48 horas;
- separación: 30 minutos;
- máximo: 1 diagnóstico por día;
- comprobar conflictos con el calendario principal;
- solicitar nombre, empresa, localidad, cantidad de equipos y problema
  principal;
- activar verificación de correo si la cuenta lo permite;
- enviar recordatorios 24 horas y 2 horas antes si el plan lo permite.

Descripción sugerida:

> Diagnóstico remoto de hasta cinco equipos. Antes del turno, confirmá que el
> pago esté acreditado, que estará presente una persona autorizada y que podrán
> ingresar las credenciales necesarias. La revisión inicial es de solo lectura;
> cualquier cambio se presupuesta y autoriza por separado.

## Prioridad de implementación

1. **Google Search Console:** verificar `aerosftp.com`, enviar el sitemap y
   solicitar indexación.
2. **Perfil de Empresa de Google:** configurarlo como negocio de área de
   servicio, ocultar el domicilio particular y cargar web, teléfono, horario,
   logo y agenda.
3. **Cloudflare Web Analytics:** activar el beacon para conocer visitantes,
   páginas de entrada y rendimiento sin recopilar datos personales.
4. **Recordatorios de Calendar:** reducir ausencias sin escribir mensajes.
5. **Reseña real:** después de entregar, enviar una sola solicitud con el
   enlace del Perfil de Empresa.

## Métricas semanales

| Etapa | Fuente |
|---|---|
| Visitas | Cloudflare Web Analytics |
| Pagos acreditados | Mercado Pago |
| Turnos reservados | Google Calendar |
| Diagnósticos entregados | Expedientes de cliente |
| Puestas en orden vendidas | Presupuestos aceptados |

Una vez por semana registrar solo los cinco totales. No hace falta un CRM hasta
que el volumen vuelva incómodo este control.

## Cuándo integrar Mercado Pago

Agregar webhook, base de datos y correos transaccionales recién cuando haya
varias compras mensuales y la validación manual del pago provoque errores o
demoras. Antes de ese punto, el tablero de Mercado Pago es la fuente de verdad.

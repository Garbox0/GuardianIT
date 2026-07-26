# Cobro y agenda sin reunión de venta

Enlaces activos:

- Cobro: `https://mpago.la/2MLSJyJ`.
- Agenda: `https://calendar.app.google/uTrUozvBsjPKUQfY9`.
- Disponibilidad: lunes a sábados, de 9:00 a 19:00.

Si un enlace se elimina de la configuración, los botones de compra usan
WhatsApp como alternativa.

## 1. Crear el producto de entrada

En Mercado Pago, crear un Link de Pago reutilizable con un alcance cerrado:

- Nombre: `Diagnóstico Guardián remoto — hasta 5 equipos`.
- Precio inicial: `ARS 90.000`.
- Incluye: sesión de hasta 2 horas, revisión de red, equipos y backups, cinco
  prioridades e informe.
- No incluye: correcciones, soporte ilimitado ni visita presencial.

La visita presencial se cotiza aparte para que distancia y traslado no vuelvan
imprevisible el margen.

## 2. Crear la agenda

En Google Calendar, crear una agenda de citas:

- Duración: 2 horas.
- Anticipación mínima: 48 horas.
- Separación entre turnos: 30 minutos.
- Máximo: 1 diagnóstico por día.
- Preguntas: empresa, cantidad de equipos, localidad y problema principal.

## 3. Activar ambos enlaces

Copiar `.env.example` como `.env.local` y completar:

```dotenv
NEXT_PUBLIC_PAYMENT_LINK=https://link.mercadopago.com.ar/...
NEXT_PUBLIC_BOOKING_LINK=https://calendar.app.google/...
```

Luego ejecutar `npm run check`, exportar y desplegar. El recorrido resultante
es:

1. el cliente lee alcance y precio;
2. paga en Mercado Pago;
3. vuelve al servicio y elige “¿Ya pagaste? Reservá tu turno”;
4. completa los datos de la cita;
5. solo queda confirmar que el pago figure acreditado antes de trabajar.

## Control mínimo

- No comenzar si el pago no aparece acreditado dentro de Mercado Pago.
- No aceptar comprobantes como única evidencia.
- Mantener el alcance exacto en la descripción del Link de Pago.
- Actualizar el precio del sitio y del enlace al mismo tiempo.

# Cobro y agenda sin reunión de venta

Enlaces activos:

- Cobro: `https://mpago.la/2MLSJyJ`.
- Agenda: privada; se entrega después de verificar el pago.
- Disponibilidad: lunes a sábados, de 9:00 a 19:00.

La agenda no debe aparecer en el sitio, el repositorio público ni mensajes
anteriores al pago. Si su URL se expone, hay que desactivar esa agenda y crear
otra: ocultar un enlace ya conocido no revoca el acceso.

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

## 3. Activar el cobro

Copiar `.env.example` como `.env.local` y completar:

```dotenv
NEXT_PUBLIC_PAYMENT_LINK=https://link.mercadopago.com.ar/...
```

Luego ejecutar `npm run check`, exportar y desplegar. El recorrido resultante
es:

1. el cliente lee alcance y precio;
2. paga en Mercado Pago;
3. vuelve al servicio y elige “¿Ya pagaste? Validar pago por WhatsApp”;
4. envía nombre y número de operación;
5. se confirma que el pago figure acreditado en Mercado Pago;
6. recién entonces se envía el enlace privado de agenda.

## Control mínimo

- No comenzar si el pago no aparece acreditado dentro de Mercado Pago.
- No aceptar comprobantes como única evidencia.
- No entregar la agenda por una respuesta automática anterior a la validación.
- Mantener el alcance exacto en la descripción del Link de Pago.
- Actualizar el precio del sitio y del enlace al mismo tiempo.

## Automatización futura

Para eliminar la validación manual hace falta una integración de servidor:

1. Mercado Pago informa el pago mediante webhook;
2. el servidor consulta la operación con credenciales privadas;
3. sólo si el estado es `approved`, envía una invitación o enlace de reserva;
4. registra el identificador para no habilitar dos veces la misma compra.

Esta validación no puede implementarse de forma segura sólo con JavaScript en
la página porque expondría las credenciales de Mercado Pago.

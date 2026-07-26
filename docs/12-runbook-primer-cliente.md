# Runbook — primer cliente

## Resultado esperado

El cliente paga un diagnóstico de alcance cerrado y recibe, dentro del plazo
acordado, un informe comprensible con un máximo de cinco prioridades. Ninguna
corrección queda implícita en el diagnóstico.

## 1. Calificar la consulta

Confirmar por escrito:

- empresa, localidad y responsable;
- cantidad aproximada de equipos;
- problema que motivó la consulta;
- qué sistema no puede dejar de funcionar;
- si busca diagnóstico, reparación urgente o recuperación de datos.

Detener y derivar si hay ransomware activo, posible delito, pérdida de datos
grave, necesidad 24 × 7 o pentesting.

## 2. Confirmar alcance y cobro

Enviar un único resumen:

- hasta cinco equipos o servicios;
- modalidad remota o presencial;
- duración máxima;
- entregable;
- exclusiones;
- precio final, impuestos y condición de pago;
- fecha propuesta.

No reservar definitivamente por un comprobante enviado por mensaje. Confirmar
el pago acreditado en el proveedor.

## 3. Abrir el expediente

Asignar identificadores de cliente y trabajo según el
[modelo de datos](11-modelo-de-datos.md). Crear la carpeta fuera del
repositorio y registrar responsable, contacto, alcance, precio y fecha.

## 4. Obtener autorización

Completar la [autorización](13-autorizacion-diagnostico.md). Debe identificar
equipos, cuentas, horario y persona con autoridad. Si la autorización es
ambigua, no acceder.

## 5. Preparar la sesión

Antes de conectarse o visitar:

- probar las herramientas en un equipo propio;
- llevar cargador, adaptador de red y almacenamiento cifrado si corresponde;
- confirmar que el cliente ingresará sus propias credenciales;
- confirmar que no se reiniciará ni modificará nada;
- abrir el [checklist](02-checklist-diagnostico.md).

## 6. Ejecutar el diagnóstico

1. Entrevistar al responsable durante 10–15 minutos.
2. Identificar activos y servicios críticos.
3. Ejecutar la auditoría de solo lectura en cada Windows autorizado.
4. Revisar red, accesos y backup sin copiar contenido privado.
5. Registrar evidencia mínima con hora y activo.
6. No corregir hallazgos durante el diagnóstico.

Si una prueba puede interrumpir el trabajo, se omite y se documenta.

## 7. Priorizar

Elegir como máximo cinco hallazgos. Para cada uno:

- qué se observó;
- evidencia;
- impacto concreto;
- urgencia;
- recomendación;
- responsable sugerido;
- estado: pendiente, aprobado, resuelto o riesgo aceptado.

No usar miedo ni declarar un backup “correcto” sin restauración de prueba.

## 8. Entregar

Entregar el HTML y el [informe ejecutivo](03-informe-cliente.md). Hacer una
reunión de 20 minutos y explicar:

1. qué está bien;
2. qué requiere atención inmediata;
3. qué puede esperar;
4. qué no fue revisado.

Solicitar confirmación escrita de recepción.

## 9. Ofrecer el siguiente paso

Solo después de entregar:

- presupuesto cerrado para la puesta en orden;
- o abono mensual si existe una necesidad recurrente verificable.

Cada corrección debe tener alcance, reversión, precio, plazo y aprobación
propios.

## 10. Cerrar y retener

- registrar pago, entrega y decisiones;
- eliminar copias temporales;
- acordar fecha de eliminación de evidencia;
- pedir una recomendación si el cliente quedó conforme;
- agendar un seguimiento, sin perseguirlo.

## No hacer

- pedir contraseñas por WhatsApp;
- fotografiar documentos o pantallas sin necesidad;
- conectar dispositivos propios sin permiso;
- reiniciar, actualizar o borrar durante el diagnóstico;
- prometer disponibilidad total;
- guardar datos del cliente en Git, el sitio público o el panel de demo.

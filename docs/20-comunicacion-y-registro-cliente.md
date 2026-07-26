# Comunicación y registro para el cliente

## Qué recibe

El cliente no recibe el tópico ntfy ni acceso al panel técnico compartido.
Recibe tres evidencias:

1. aviso cuando confirmamos una interrupción relevante;
2. registro de cada incidente atendido;
3. informe mensual individual con estado y disponibilidad de los últimos
   treinta días.

## Avisos

Durante el alta se acuerdan un contacto, canal, horario y tiempo objetivo de
respuesta. El aviso puede enviarse por correo y, si el cliente lo pide, también
por WhatsApp.

Mensaje inicial:

> Detectamos una interrupción en [servicio] a las HH:MM. La estamos verificando.
> Próxima actualización estimada: HH:MM.

Mensaje de cierre:

> [Servicio] volvió a responder a las HH:MM y quedó estable. Duración observada:
> NN minutos. Causa confirmada o probable: ____. Próxima acción: ____.

No reenviar al cliente cada alerta técnica ni afirmar que hubo un ataque sin
evidencia.

## Registro de incidente

Guardar fuera del repositorio un archivo
`06-entregables/monitoreo/INC-AAAA-NNN.md`:

```markdown
# INC-AAAA-NNN — Servicio

- Inicio observado:
- Detección:
- Aviso al cliente:
- Recuperación:
- Impacto informado:
- Causa confirmada o probable:
- Acción realizada:
- Evidencia:
- Próxima acción, responsable y fecha:
```

## Informe mensual

Cada cliente debe usar un grupo exclusivo en Gatus, preferentemente su
identificador `CLI-AAAA-NNN`. Generar el informe desde un equipo conectado a
Tailscale:

```powershell
npm run report -- http://100.80.237.96:8080 `
  "Nombre del cliente" `
  "CLI-2026-001" `
  --html > informe-2026-07.html
```

El generador filtra por el grupo exacto y consulta la disponibilidad agregada
de treinta días. El HTML es portable, puede abrirse en el navegador y guardarse
como PDF. Antes de enviarlo, agregar:

- incidentes atendidos y enlaces a sus registros;
- acciones realizadas;
- hasta tres prioridades para el mes siguiente.

Entregarlo por el canal acordado y guardar una copia fechada en el expediente
del cliente. La fecha de eliminación de esos registros debe acordarse y quedar
documentada.

## Cuándo crear un portal

No hace falta para el primer cliente. Incorporar un portal con acceso separado
cuando varios clientes pidan consulta en línea o el envío mensual manual se
vuelva una carga. Nunca publicar el panel compartido de Gatus.

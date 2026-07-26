# Remediación controlada

## Qué hace hoy automáticamente

La infraestructura propia ya se autorrecupera ante fallas de proceso:

- `guardian-site.service` reinicia el sitio público;
- `cloudflared.service` reinicia el túnel;
- Docker mantiene activo el contenedor de Gatus;
- systemd y Docker levantan los componentes después de reiniciar la Raspberry.

Estas acciones sólo afectan servicios administrados por Guardián PyME.

## Qué hacemos con un cliente

El modo predeterminado es detectar, validar, avisar y proponer una acción. No
se reinician equipos, cambian configuraciones ni eliminan archivos del cliente
por una alerta.

Una remediación puede automatizarse únicamente cuando el cliente autoriza por
escrito un runbook cerrado que indique:

- servicio y equipo exactos;
- condición que habilita la acción;
- comando permitido;
- cantidad máxima de intentos y tiempo de espera;
- validación posterior;
- forma de reversión;
- contacto y horario de escalamiento.

Ejemplos razonables:

- reiniciar una única vez un servicio identificado;
- volver a iniciar un agente de backup detenido;
- renovar una conexión controlada;
- conmutar a un enlace o servicio de respaldo ya configurado.

No automatizar:

- reinicios completos de servidores sin ventana acordada;
- cambios de firewall, usuarios, permisos o DNS;
- borrado o restauración de datos;
- instalación de software;
- respuestas ante un supuesto ataque sin validación humana.

Toda acción debe generar un registro con fecha, disparador, comando, resultado
y verificación. Si falla el intento autorizado, se detiene y escala a una
persona.

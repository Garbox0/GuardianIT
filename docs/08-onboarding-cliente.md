# Onboarding del primer cliente

## 1. Autorización

- Identificar responsable, equipos y servicios incluidos.
- Acordar horario y método de acceso.
- Confirmar que el diagnóstico inicial es de solo lectura.

## 2. Diagnóstico

En cada PC Windows autorizado:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\guardian-audit.ps1 `
  -ClientName "Nombre del cliente" `
  -BackupPath "D:\Backups" `
  -OutputDirectory "D:\Clientes\CLI-2026-001\03-diagnostico"
```

Entregar el HTML. Conservar el JSON como evidencia técnica y no incluir
contraseñas. La carpeta de salida debe quedar fuera del repositorio y del
directorio público del sitio.

## 3. Prioridades

Elegir como máximo cinco hallazgos. Para cada uno indicar impacto, acción,
responsable, costo y fecha. No corregir nada sin aprobación.

## 4. Monitoreo

Agregar únicamente servicios que puedan comprobarse de forma segura: sitio,
router administrable, servidor, VPN, NAS o endpoint de salud. Ocultar
direcciones internas en el panel.

## 5. Backup

Registrar origen, destino, frecuencia, última ejecución y última restauración.
Una fecha reciente no demuestra que el contenido sea recuperable.

## 6. Informe mensual

Desde un equipo conectado a Tailscale:

```bash
npm run report -- https://guardian-monitor.tailfe3e24.ts.net "Nombre del cliente" "CLI-2026-001" --html > informe.html
```

Completar el informe con incidentes atendidos, acciones realizadas y tres
próximas prioridades. El tercer argumento debe coincidir exactamente con el
grupo asignado al cliente en Gatus; así el informe no mezcla información.

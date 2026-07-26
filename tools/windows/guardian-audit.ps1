[CmdletBinding()]
param(
    [string]$ClientName = $env:COMPUTERNAME,
    [string]$BackupPath = "",
    [string]$OutputDirectory = (Join-Path $PWD "guardian-report"),
    [switch]$SelfTest
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function New-Finding {
    param(
        [string]$Control,
        [string]$Status,
        [string]$Severity,
        [string]$Evidence,
        [string]$Recommendation
    )

    [pscustomobject]@{
        Control = $Control
        Status = $Status
        Severity = $Severity
        Evidence = $Evidence
        Recommendation = $Recommendation
    }
}

function Get-DiskFinding {
    param(
        [string]$Name,
        [double]$FreePercent,
        [double]$FreeGB
    )

    if ($FreePercent -lt 10 -or $FreeGB -lt 10) {
        return New-Finding "Disco $Name" "Crítico" "Alta" "$FreeGB GB libres ($FreePercent%)" "Liberar o ampliar almacenamiento."
    }

    if ($FreePercent -lt 20 -or $FreeGB -lt 20) {
        return New-Finding "Disco $Name" "Atención" "Media" "$FreeGB GB libres ($FreePercent%)" "Planificar limpieza o ampliación."
    }

    New-Finding "Disco $Name" "Correcto" "Informativa" "$FreeGB GB libres ($FreePercent%)" "Sin acción inmediata."
}

function Get-DefenderFinding {
    param(
        [bool]$AntivirusEnabled,
        [bool]$RealTimeProtectionEnabled,
        [int]$SignatureAge,
        [bool]$TamperProtected,
        [string]$FallbackProducts = ""
    )

    if (-not $AntivirusEnabled -or -not $RealTimeProtectionEnabled) {
        $evidence = if ($FallbackProducts) {
            "Microsoft Defender no está activo. Producto detectado: $FallbackProducts."
        } else {
            "No se verificó protección antivirus en tiempo real."
        }
        return New-Finding "Protección antimalware" "Atención" "Alta" $evidence "Confirmar que un antivirus esté activo, actualizado y protegido contra cambios."
    }

    if ($SignatureAge -gt 3 -or -not $TamperProtected) {
        $tamper = if ($TamperProtected) { "activa" } else { "desactivada" }
        return New-Finding "Protección antimalware" "Atención" "Media" "Defender activo; firmas de hace $SignatureAge días; protección contra alteraciones $tamper." "Actualizar firmas y activar protección contra alteraciones si la edición lo permite."
    }

    New-Finding "Protección antimalware" "Correcto" "Informativa" "Defender en tiempo real; firmas de hace $SignatureAge días; protección contra alteraciones activa." "Sin acción inmediata."
}

function Get-WindowsEventFinding {
    param(
        [int]$CriticalCount,
        [int]$ErrorCount,
        [string]$RepeatedEvents = ""
    )

    $evidence = "$CriticalCount críticos y $ErrorCount errores en los últimos 7 días."
    if ($RepeatedEvents) { $evidence += " Repetidos: $RepeatedEvents." }
    if ($CriticalCount -gt 0 -or $ErrorCount -ge 20) {
        return New-Finding "Eventos de Windows" "Revisar" "Media" $evidence "Confirmar si los eventos coinciden con interrupciones observadas."
    }
    New-Finding "Eventos de Windows" "Sin patrón relevante" "Informativa" $evidence "Mantener revisión periódica."
}

if ($SelfTest) {
    if ((Get-DiskFinding "C:" 5 100).Severity -ne "Alta") {
        throw "Falló el control de disco crítico"
    }
    if ((Get-DiskFinding "C:" 50 100).Status -ne "Correcto") {
        throw "Falló el control de disco saludable"
    }
    if ((Get-DefenderFinding $true $true 5 $true).Severity -ne "Media") {
        throw "Falló el control de firmas antiguas"
    }
    if ((Get-DefenderFinding $true $true 0 $true).Status -ne "Correcto") {
        throw "Falló el control de Defender saludable"
    }
    if ((Get-WindowsEventFinding 1 2).Severity -ne "Media") {
        throw "Falló el control de eventos críticos"
    }
    Write-Output "Guardian audit self-test: OK"
    return
}

$findings = [System.Collections.Generic.List[object]]::new()
$os = Get-CimInstance Win32_OperatingSystem
$computer = Get-CimInstance Win32_ComputerSystem
$processor = Get-CimInstance Win32_Processor | Select-Object -First 1

foreach ($disk in Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3") {
    if ($disk.Size -le 0) { continue }
    $freeGB = [math]::Round($disk.FreeSpace / 1GB, 1)
    $freePercent = [math]::Round(($disk.FreeSpace / $disk.Size) * 100, 1)
    $findings.Add((Get-DiskFinding $disk.DeviceID $freePercent $freeGB))
}

$antivirus = @()
try {
    $antivirus = @(Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct)
    if ($antivirus.Count) {
        $names = ($antivirus | Select-Object -ExpandProperty displayName -Unique) -join ", "
        $findings.Add((New-Finding "Antivirus" "Detectado" "Informativa" $names "Confirmar protección activa y actualizada."))
    } else {
        $findings.Add((New-Finding "Antivirus" "No verificado" "Alta" "Windows no informó un producto antivirus." "Verificar protección antimalware."))
    }
} catch {
    $findings.Add((New-Finding "Antivirus" "No verificable" "Media" $_.Exception.Message "Revisar manualmente."))
}

try {
    $defender = Get-MpComputerStatus
    $signatureAge = if ($null -ne $defender.AntivirusSignatureAge) {
        [int]$defender.AntivirusSignatureAge
    } else {
        999
    }
    $fallbackProducts = ($antivirus | Select-Object -ExpandProperty displayName -Unique) -join ", "
    $findings.Add((Get-DefenderFinding `
        ([bool]$defender.AntivirusEnabled) `
        ([bool]$defender.RealTimeProtectionEnabled) `
        $signatureAge `
        ([bool]$defender.IsTamperProtected) `
        $fallbackProducts))
} catch {
    $findings.Add((New-Finding "Protección antimalware" "No verificable" "Media" $_.Exception.Message "Confirmar protección en tiempo real, firmas y protección contra alteraciones."))
}

try {
    $detections = @(Get-MpThreatDetection | Where-Object {
        $_.InitialDetectionTime -ge (Get-Date).AddDays(-30)
    })
    if ($detections.Count) {
        $findings.Add((New-Finding "Detecciones de Defender" "Revisar" "Media" "$($detections.Count) detecciones registradas en los últimos 30 días." "Confirmar que cada detección esté resuelta y que no se repita."))
    } else {
        $findings.Add((New-Finding "Detecciones de Defender" "Sin detecciones recientes" "Informativa" "Defender no informó detecciones en los últimos 30 días." "Mantener protección y firmas actualizadas."))
    }
} catch {
    $findings.Add((New-Finding "Detecciones de Defender" "No verificable" "Informativa" "El historial no está disponible o se utiliza otro antivirus." "Revisar el historial del producto antivirus instalado."))
}

try {
    $disabledProfiles = @(Get-NetFirewallProfile | Where-Object { -not $_.Enabled })
    if ($disabledProfiles.Count) {
        $findings.Add((New-Finding "Firewall" "Atención" "Alta" (($disabledProfiles.Name) -join ", ") "Activar los perfiles necesarios después de validar aplicaciones."))
    } else {
        $findings.Add((New-Finding "Firewall" "Correcto" "Informativa" "Todos los perfiles informados están activos." "Sin acción inmediata."))
    }
} catch {
    $findings.Add((New-Finding "Firewall" "No verificable" "Media" $_.Exception.Message "Revisar manualmente."))
}

try {
    $lastHotfix = Get-HotFix |
        Where-Object InstalledOn |
        Sort-Object InstalledOn -Descending |
        Select-Object -First 1
    $age = (New-TimeSpan -Start $lastHotfix.InstalledOn -End (Get-Date)).Days
    $severity = if ($age -gt 45) { "Media" } else { "Informativa" }
    $status = if ($age -gt 45) { "Atención" } else { "Correcto" }
    $findings.Add((New-Finding "Actualizaciones" $status $severity "Última revisión instalada hace $age días." "Aplicar actualizaciones fuera del horario de trabajo."))
} catch {
    $findings.Add((New-Finding "Actualizaciones" "No verificable" "Media" $_.Exception.Message "Revisar Windows Update."))
}

try {
    $bitLocker = Get-BitLockerVolume -MountPoint $env:SystemDrive
    if ($bitLocker.ProtectionStatus -eq "On") {
        $findings.Add((New-Finding "Cifrado del sistema" "Correcto" "Informativa" "BitLocker activo en $env:SystemDrive." "Resguardar la clave de recuperación."))
    } else {
        $findings.Add((New-Finding "Cifrado del sistema" "Atención" "Media" "BitLocker no está activo en $env:SystemDrive." "Evaluar cifrado después de confirmar la clave de recuperación."))
    }
} catch {
    $findings.Add((New-Finding "Cifrado del sistema" "No verificable" "Informativa" $_.Exception.Message "Revisar según el riesgo del equipo."))
}

try {
    $adminGroup = Get-LocalGroup -SID "S-1-5-32-544"
    $administrators = @(Get-LocalGroupMember -Group $adminGroup)
    $findings.Add((New-Finding "Administradores locales" "Revisar" "Media" (($administrators.Name) -join ", ") "Confirmar que cada cuenta todavía necesita privilegios."))
} catch {
    $findings.Add((New-Finding "Administradores locales" "No verificable" "Media" $_.Exception.Message "Revisar manualmente."))
}

try {
    $uacEnabled = (Get-ItemProperty -LiteralPath "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -Name EnableLUA).EnableLUA -eq 1
    if ($uacEnabled) {
        $findings.Add((New-Finding "Control de cuentas (UAC)" "Correcto" "Informativa" "UAC está habilitado." "Sin acción inmediata."))
    } else {
        $findings.Add((New-Finding "Control de cuentas (UAC)" "Desactivado" "Alta" "EnableLUA está deshabilitado." "Habilitar UAC después de validar aplicaciones y acordar el reinicio."))
    }
} catch {
    $findings.Add((New-Finding "Control de cuentas (UAC)" "No verificable" "Informativa" $_.Exception.Message "Revisar manualmente."))
}

try {
    $smb1 = Get-WindowsOptionalFeature -Online -FeatureName SMB1Protocol
    if ($smb1.State -eq "Enabled") {
        $findings.Add((New-Finding "Protocolo SMBv1" "Habilitado" "Alta" "La característica SMB1Protocol está habilitada." "Deshabilitar SMBv1 después de confirmar que ningún equipo antiguo depende de él."))
    } else {
        $findings.Add((New-Finding "Protocolo SMBv1" "Correcto" "Informativa" "SMBv1 no está habilitado." "Sin acción inmediata."))
    }
} catch {
    $findings.Add((New-Finding "Protocolo SMBv1" "No verificable" "Informativa" $_.Exception.Message "Verificar con privilegios administrativos."))
}

try {
    $secureBoot = Confirm-SecureBootUEFI
    if ($secureBoot) {
        $findings.Add((New-Finding "Arranque seguro" "Correcto" "Informativa" "Secure Boot está activo." "Sin acción inmediata."))
    } else {
        $findings.Add((New-Finding "Arranque seguro" "Desactivado" "Media" "El firmware informa Secure Boot desactivado." "Evaluar activarlo después de confirmar compatibilidad y claves de recuperación."))
    }
} catch {
    $findings.Add((New-Finding "Arranque seguro" "No verificable" "Informativa" $_.Exception.Message "Revisar firmware y compatibilidad del equipo."))
}

try {
    $guest = Get-LocalUser | Where-Object { $_.SID.Value.EndsWith("-501") } | Select-Object -First 1
    if ($guest -and $guest.Enabled) {
        $findings.Add((New-Finding "Cuenta invitado" "Habilitada" "Alta" "La cuenta local de invitado está habilitada." "Deshabilitarla salvo necesidad documentada."))
    } else {
        $findings.Add((New-Finding "Cuenta invitado" "Correcto" "Informativa" "La cuenta local de invitado no está habilitada." "Sin acción inmediata."))
    }
} catch {
    $findings.Add((New-Finding "Cuenta invitado" "No verificable" "Informativa" $_.Exception.Message "Revisar manualmente."))
}

try {
    $rdpEnabled = (Get-ItemProperty -LiteralPath "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections).fDenyTSConnections -eq 0
    if ($rdpEnabled) {
        $findings.Add((New-Finding "Escritorio remoto" "Habilitado" "Media" "Windows acepta conexiones de Escritorio remoto." "Confirmar necesidad, restringir por VPN y mantener autenticación a nivel de red."))
    } else {
        $findings.Add((New-Finding "Escritorio remoto" "Correcto" "Informativa" "Escritorio remoto no acepta conexiones." "Sin acción inmediata."))
    }
} catch {
    $findings.Add((New-Finding "Escritorio remoto" "No verificable" "Informativa" $_.Exception.Message "Revisar manualmente."))
}

try {
    $pendingReboot =
        (Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending") -or
        (Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired")
    if ($pendingReboot) {
        $findings.Add((New-Finding "Reinicio pendiente" "Atención" "Media" "Windows informa un reinicio pendiente." "Acordar una ventana, reiniciar y comprobar servicios críticos."))
    } else {
        $findings.Add((New-Finding "Reinicio pendiente" "Correcto" "Informativa" "No se detectó un reinicio pendiente." "Sin acción inmediata."))
    }
} catch {
    $findings.Add((New-Finding "Reinicio pendiente" "No verificable" "Informativa" $_.Exception.Message "Revisar manualmente."))
}

try {
    $eventStart = (Get-Date).AddDays(-7)
    $events = @(Get-WinEvent -FilterHashtable @{
        LogName = @("System", "Application")
        Level = @(1, 2)
        StartTime = $eventStart
    } -MaxEvents 200 -ErrorAction Stop)
    $criticalCount = @($events | Where-Object Level -eq 1).Count
    $errorCount = @($events | Where-Object Level -eq 2).Count
    $repeated = ($events |
        Group-Object ProviderName, Id |
        Where-Object Count -ge 3 |
        Sort-Object Count -Descending |
        Select-Object -First 3 |
        ForEach-Object { "$($_.Name) x$($_.Count)" }) -join "; "
    if ($events.Count -eq 200) {
        $repeated = if ($repeated) {
            "$repeated; muestra limitada a 200 eventos"
        } else {
            "muestra limitada a 200 eventos"
        }
    }
    $findings.Add((Get-WindowsEventFinding $criticalCount $errorCount $repeated))
} catch {
    $findings.Add((New-Finding "Eventos de Windows" "No verificable" "Informativa" "No se pudo leer el resumen de eventos." "Ejecutar con permisos suficientes si este control forma parte del alcance."))
}

try {
    $failedLogons = @(Get-WinEvent -FilterHashtable @{
        LogName = "Security"
        Id = 4625
        StartTime = (Get-Date).AddDays(-7)
    } -MaxEvents 200 -ErrorAction Stop)
    $failedCount = $failedLogons.Count
    $failedEvidence = if ($failedCount -eq 200) {
        "Al menos 200 intentos fallidos en los últimos 7 días; se alcanzó el límite de lectura."
    } else {
        "$failedCount intentos fallidos en los últimos 7 días."
    }
    $failedSeverity = if ($failedCount -ge 20) { "Media" } else { "Informativa" }
    $failedStatus = if ($failedCount -ge 20) { "Revisar" } else { "Sin patrón relevante" }
    $findings.Add((New-Finding "Inicios de sesión fallidos" $failedStatus $failedSeverity $failedEvidence "Comparar con horarios, accesos remotos y bloqueos conocidos; el conteo por sí solo no demuestra un ataque."))
} catch {
    $findings.Add((New-Finding "Inicios de sesión fallidos" "No verificable" "Informativa" "El registro de seguridad no estuvo disponible." "Ejecutar con permisos suficientes si este control forma parte del alcance."))
}

if ($BackupPath) {
    try {
        $latestBackup = Get-ChildItem -LiteralPath $BackupPath -File -Recurse |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1
        if (-not $latestBackup) { throw "No se encontraron archivos." }
        $backupAge = [math]::Round((New-TimeSpan -Start $latestBackup.LastWriteTime -End (Get-Date)).TotalHours, 1)
        $severity = if ($backupAge -gt 48) { "Alta" } else { "Informativa" }
        $status = if ($backupAge -gt 48) { "Vencido" } else { "Reciente" }
        $findings.Add((New-Finding "Backup" $status $severity "Último archivo hace $backupAge horas." "Probar una restauración; la fecha por sí sola no garantiza recuperabilidad."))
    } catch {
        $findings.Add((New-Finding "Backup" "No verificable" "Alta" $_.Exception.Message "Confirmar destino, ejecución y restauración."))
    }
} else {
    $findings.Add((New-Finding "Backup" "Revisión manual" "Alta" "No se indicó una ruta de backup." "Identificar la copia y realizar una restauración de prueba."))
}

$report = [ordered]@{
    Version = "1.2"
    Client = $ClientName
    GeneratedAt = (Get-Date).ToString("o")
    Computer = [ordered]@{
        Name = $env:COMPUTERNAME
        Manufacturer = $computer.Manufacturer
        Model = $computer.Model
        OperatingSystem = $os.Caption
        OSVersion = $os.Version
        Processor = $processor.Name
        MemoryGB = [math]::Round($computer.TotalPhysicalMemory / 1GB, 1)
        UptimeHours = [math]::Round((New-TimeSpan -Start $os.LastBootUpTime -End (Get-Date)).TotalHours, 1)
    }
    Summary = [ordered]@{
        High = @($findings | Where-Object Severity -eq "Alta").Count
        Medium = @($findings | Where-Object Severity -eq "Media").Count
        Informational = @($findings | Where-Object Severity -eq "Informativa").Count
    }
    Findings = $findings
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$safeName = ($ClientName -replace "[^a-zA-Z0-9_-]", "-").Trim("-")
if (-not $safeName) { $safeName = "cliente" }
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonPath = Join-Path $OutputDirectory "$safeName-$stamp.json"
$htmlPath = Join-Path $OutputDirectory "$safeName-$stamp.html"
$report | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $jsonPath

function Encode([object]$Value) {
    [System.Net.WebUtility]::HtmlEncode([string]$Value)
}

$rows = ($findings | ForEach-Object {
    "<tr><td>$(Encode $_.Control)</td><td>$(Encode $_.Status)</td><td>$(Encode $_.Severity)</td><td>$(Encode $_.Evidence)</td><td>$(Encode $_.Recommendation)</td></tr>"
}) -join [Environment]::NewLine

$html = @"
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Diagnóstico Guardián - $(Encode $ClientName)</title>
<style>
body{font:15px/1.5 Segoe UI,Arial,sans-serif;color:#10251f;margin:40px;max-width:1100px}
h1,h2{font-family:Georgia,serif} .summary{display:flex;gap:12px;margin:24px 0}
.summary span{padding:12px 18px;border:1px solid #d9ddd4;border-radius:8px}
table{width:100%;border-collapse:collapse}th,td{padding:12px;text-align:left;border-bottom:1px solid #d9ddd4;vertical-align:top}
th{background:#e9eee8}.note{color:#5e6f69;margin-top:28px}
</style>
</head>
<body>
<p>GUARDIÁN PYME · DIAGNÓSTICO TÉCNICO</p>
<h1>$(Encode $ClientName)</h1>
<p>Equipo $(Encode $report.Computer.Name) · $(Encode $report.Computer.OperatingSystem) · $(Encode $report.GeneratedAt)</p>
<div class="summary"><span>Prioridad alta: $($report.Summary.High)</span><span>Prioridad media: $($report.Summary.Medium)</span><span>Informativos: $($report.Summary.Informational)</span></div>
<h2>Controles observados</h2>
<table><thead><tr><th>Control</th><th>Estado</th><th>Prioridad</th><th>Evidencia</th><th>Recomendación</th></tr></thead><tbody>$rows</tbody></table>
<p class="note">Revisión de solo lectura. No constituye una prueba de penetración ni garantiza la ausencia de fallas. Los backups requieren una restauración de prueba.</p>
</body>
</html>
"@

$html | Set-Content -Encoding UTF8 $htmlPath

Write-Output "Informe HTML: $htmlPath"
Write-Output "Evidencia JSON: $jsonPath"

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

if ($SelfTest) {
    if ((Get-DiskFinding "C:" 5 100).Severity -ne "Alta") {
        throw "Falló el control de disco crítico"
    }
    if ((Get-DiskFinding "C:" 50 100).Status -ne "Correcto") {
        throw "Falló el control de disco saludable"
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
    Version = "1.0"
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

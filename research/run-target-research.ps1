# Fixed target and finite read-only group. One launch, no pairing or native retry.
#Requires -Version 7
param([Parameter(Mandatory)][ValidateSet('main','bedroom')][string]$Target, [ValidateSet('version','homeCoverage','homeDocument','homeDependencies')][string]$Group='version')
$ErrorActionPreference = 'Stop'
if ($Group -in @('homeDocument','homeDependencies') -and $Target -ne 'main') { throw 'Document research is main-only; no credential or device access.' }
$profileModule = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'target-profiles.mjs'))
$profileJson = & node --input-type=module -e "import {pathToFileURL} from 'node:url'; const {researchProfile}=await import(pathToFileURL(process.argv[1]).href); console.log(JSON.stringify(researchProfile(process.argv[2])))" $profileModule $Target
if ($LASTEXITCODE -ne 0) { throw 'Research profile unavailable.' }
$profile = $profileJson | ConvertFrom-Json
# A malformed/mismatched file must never choose an arbitrary target or credential path.
$expected = if ($Target -eq 'main') { @('192.168.4.20',4178,'v435-j01.token.dpapi') } else { @('192.168.4.23',4177,'d32f-g4.token.dpapi') }
if ($profile.target -cne $Target -or $profile.tv -cne $expected[0] -or $profile.port -ne $expected[1] -or $profile.credential -cne $expected[2]) { throw 'Research profile mismatch.' }
$base = 'http://192.168.4.26:' + $profile.port
$health = Invoke-RestMethod -Uri ($base + '/health') -TimeoutSec 5 -MaximumRedirection 0
if ($health.edge -ne 'running' -or $health.target -cne $Target) { throw 'Target listener mismatch.' }
if ($Group -eq 'homeDocument' -and $health.document24 -ne $true) { throw 'Document group is disabled; no credential or device access.' }
if ($Group -eq 'homeDependencies' -and $health.dependencies25 -ne $true) { throw 'Dependency group is disabled; no credential or device access.' }
$tokenPath = Join-Path $env:LOCALAPPDATA ('Mist\ConsoleTV\' + $profile.credential)
if (-not (Test-Path -LiteralPath $tokenPath)) { throw 'Saved target credential missing; no pairing attempted.' }
$secure = (Get-Content -LiteralPath $tokenPath -Raw).Trim() | ConvertTo-SecureString
$credential = [System.Net.NetworkCredential]::new('', $secure)
$headers = @{ AUTH = $credential.Password }
$lease = $null
try {
    # Check credential/target authentication before reserving a run or launching anything.
    $current = Invoke-RestMethod -SkipCertificateCheck -Method Get -Uri ('https://' + $profile.tv + ':7345/app/current') -Headers $headers -TimeoutSec 6 -MaximumRedirection 0
    if ($current.STATUS.RESULT -ne 'SUCCESS') { throw 'Target authentication failed.' }
    $current = $null
    $lease = Invoke-RestMethod -Method Post -Uri ($base + '/research/runs') -ContentType 'application/json' -Body (@{group=$Group}|ConvertTo-Json -Compress) -TimeoutSec 5 -MaximumRedirection 0
    $prefix = switch($Group) { version { '/research/sdk-interfaces/' } homeCoverage { '/research/home-coverage/' } homeDocument { '/research/home-document/' } homeDependencies { '/research/home-dependencies/' } }
    $probe = switch($Group) { version { 'sdk-version-10' } homeCoverage { 'sdk-home-coverage-23' } homeDocument { 'sdk-home-document-24' } homeDependencies { 'sdk-home-dependencies-25' } }
    if ($lease.target -cne $Target -or $lease.run -notmatch '^[a-f0-9]{32}$' -or $lease.path -cne ($prefix + $lease.run)) { throw 'Run admission mismatch.' }
    $url = $base + $lease.path
    $payload = @{ VALUE = @{ MESSAGE = $url; NAME_SPACE = 4; APP_ID = '17' } } | ConvertTo-Json -Depth 4
    $launched = Invoke-RestMethod -SkipCertificateCheck -Method Put -Uri ('https://' + $profile.tv + ':7345/app/launch') -Headers $headers -ContentType 'application/json' -Body $payload -TimeoutSec 10 -MaximumRedirection 0
    if ($launched.STATUS.RESULT -ne 'SUCCESS') { throw 'Native launch not accepted; no retry.' }
    $deadline = [DateTime]::UtcNow.AddSeconds(15)
    $final = $null
    do {
        $snapshot = Invoke-RestMethod -Uri ($base + '/research/runs/' + $lease.run) -TimeoutSec 3 -MaximumRedirection 0
        if ($snapshot.target -cne $Target -or $snapshot.run -cne $lease.run) { throw 'Target readback mismatch.' }
        if ($snapshot.reports.Count -eq 1) {
            $candidate = $snapshot.reports[0].report
            if ($candidate.run -ceq $lease.run -and $candidate.probe -ceq $probe -and $candidate.loaded -and ($candidate.ready -or $Group -in @('homeDocument','homeDependencies')) -and $candidate.state -in @('resolved','rejected','unavailable','threw')) { $final = $snapshot; break }
        }
        Start-Sleep -Milliseconds 350
    } while ([DateTime]::UtcNow -lt $deadline)
    if (-not $final) { throw 'Run metadata incomplete; no native retry.' }
    # Only independently validated listener metadata, no native response bodies.
    $resultDir = Join-Path $PSScriptRoot 'results'
    [void][IO.Directory]::CreateDirectory($resultDir)
    $resultPath = Join-Path $resultDir ('isolated-' + $Target + '-' + $lease.run + '.json')
    if (Test-Path -LiteralPath $resultPath) { throw 'Run artifact already exists.' }
    [IO.File]::WriteAllText($resultPath, ($final | ConvertTo-Json -Depth 12) + "`n", [Text.UTF8Encoding]::new($false))
    [pscustomobject]@{ target=$Target; run=$lease.run; loaded=$candidate.loaded; ready=$candidate.ready; state=$candidate.state; responseType=$candidate.responseType; version=$candidate.version; artifact=[IO.Path]::GetFileName($resultPath) } | ConvertTo-Json -Compress
    if ($Target -eq 'main') {
        $current = Invoke-RestMethod -SkipCertificateCheck -Method Get -Uri 'https://192.168.4.20:7345/app/current' -Headers $headers -TimeoutSec 6 -MaximumRedirection 0
        $ours = @($current.VALUE.MESSAGE, $current.ITEM.VALUE.MESSAGE, $current.ITEM.MESSAGE) -ccontains $url
        $current = $null
        if ($ours) { & (Join-Path $PSScriptRoot '../bin/launch.ps1') -AllyIP 192.168.4.26 -TVIP 192.168.4.20 | Out-Null; Write-Output '{"restore":"summary_launch_requested_after_ownership_check"}' }
        else { Write-Output '{"restore":"ownership_not_confirmed"}' }
    }
} catch { throw 'Fixed-target research failed; details withheld. No pairing or native retry.' }
finally {
    if ($lease -and $lease.run -match '^[a-f0-9]{32}$') {
        try { Invoke-RestMethod -Method Delete -Uri ($base + '/research/runs/' + $lease.run) -TimeoutSec 3 -MaximumRedirection 0 | Out-Null } catch { Write-Output '{"release":"not_confirmed_expires_60_seconds"}' }
    }
    $headers.Clear(); $credential = $null; $secure.Dispose()
    $current = $null; $launched = $null
}

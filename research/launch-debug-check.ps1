# Plan by default. DEBUG=1 comes from Vizio's public Conjure launcher's
# getLaunchData(url, debug), not an inferred developer-mode setting.
#Requires -Version 7
param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$url = 'http://192.168.4.26:4176/client/' + [Guid]::NewGuid().ToString('N')
$body = @{VALUE=@{MESSAGE=$url;NAME_SPACE=4;APP_ID='17';DEBUG=1}} | ConvertTo-Json -Depth 4
if (-not $Apply) {
    Write-Output 'PLAN ONLY: one authenticated app launch to the known TV with DEBUG=1.'
    Write-Output $body
    Write-Output 'May expose debugging access; no persistent developer-mode change is established.'
    Write-Output 'Return to normal: run console-tv/bin/launch.ps1 with the known Ally/TV addresses.'
    return
}
$health = Invoke-RestMethod -Uri 'http://192.168.4.26:4176/health' -TimeoutSec 5
if ($health.edge -ne 'running') { throw 'Existing TV listener unavailable.' }
$tokenPath = Join-Path $env:LOCALAPPDATA 'Mist\ConsoleTV\v435-j01.token.dpapi'
$secure = (Get-Content -LiteralPath $tokenPath -Raw).Trim() | ConvertTo-SecureString
$credential = [System.Net.NetworkCredential]::new('', $secure)
$headers = @{AUTH=$credential.Password}
try {
    $result = Invoke-RestMethod -SkipCertificateCheck -Method Put -Uri 'https://192.168.4.20:7345/app/launch' -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 10
    Write-Output ('API RESULT: ' + $result.STATUS.RESULT)
    Write-Output 'Debug access and actual display remain unverified until separately checked.'
} catch { throw 'Debug launch failed. No pairing attempted.' }
finally { $headers.Clear(); $credential=$null; $secure.Dispose() }

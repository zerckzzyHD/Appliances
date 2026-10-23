# Explicit owner action. Reuses the existing V435-J01 token; never pairs or writes it.
#Requires -Version 7
param(
    [Parameter(Mandatory)][System.Net.IPAddress]$AllyIP,
    [Parameter(Mandatory)][System.Net.IPAddress]$TVIP,
    [ValidateRange(1024,65535)][int]$Port = 4176
)
$ErrorActionPreference = 'Stop'
if ($AllyIP.AddressFamily -ne 'InterNetwork' -or $TVIP.AddressFamily -ne 'InterNetwork') { throw 'IPv4 addresses required.' }
$baseURL = "http://${AllyIP}:${Port}/"
$url = $baseURL + 'client/' + [Guid]::NewGuid().ToString('N')
$health = Invoke-RestMethod -Uri ($baseURL + 'health') -TimeoutSec 5
if ($health.edge -ne 'running') { throw 'Expected TV listener unavailable.' }
$tokenPath = Join-Path $env:LOCALAPPDATA 'Mist\ConsoleTV\v435-j01.token.dpapi'
if (-not (Test-Path -LiteralPath $tokenPath)) { throw 'Existing token missing. No pairing attempted.' }
$secure = (Get-Content -LiteralPath $tokenPath -Raw).Trim() | ConvertTo-SecureString
$credential = [System.Net.NetworkCredential]::new('', $secure)
$headers = @{AUTH=$credential.Password}
try {
    $payload = @{VALUE=@{MESSAGE=$url;NAME_SPACE=4;APP_ID='17'}} | ConvertTo-Json -Depth 4
    $result = Invoke-RestMethod -SkipCertificateCheck -Method Put -Uri "https://${TVIP}:7345/app/launch" -Headers $headers -ContentType 'application/json' -Body $payload -TimeoutSec 10
    Write-Output ('API RESULT: ' + $result.STATUS.RESULT)
    Write-Output 'Confirm actual summary and freshness on the TV; API acceptance is not a display result.'
} catch { throw 'TV launch request failed. Token unchanged; no automatic pairing.' }
finally { $headers.Clear(); $credential=$null; $secure.Dispose() }

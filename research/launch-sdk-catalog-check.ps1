# Owner-authorized five fixed read-only catalog type checks.
#Requires -Version 7
$ErrorActionPreference = 'Stop'
$baseURL = 'http://192.168.4.26:4176/'
$health = Invoke-RestMethod -Uri ($baseURL + 'health') -TimeoutSec 5
if ($health.edge -ne 'running') { throw 'Existing listener unavailable.' }
$url = $baseURL + 'research/sdk-catalog-check/' + [Guid]::NewGuid().ToString('N')
$tokenPath = Join-Path $env:LOCALAPPDATA 'Mist\ConsoleTV\v435-j01.token.dpapi'
$secure = (Get-Content -LiteralPath $tokenPath -Raw).Trim() | ConvertTo-SecureString
$credential = [System.Net.NetworkCredential]::new('', $secure)
$headers = @{AUTH=$credential.Password}
try {
    $body = @{VALUE=@{MESSAGE=$url;NAME_SPACE=4;APP_ID='17'}} | ConvertTo-Json -Depth 4
    $result = Invoke-RestMethod -SkipCertificateCheck -Method Put -Uri 'https://192.168.4.20:7345/app/launch' -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 10
    Write-Output ('API RESULT: ' + $result.STATUS.RESULT)
    Write-Output ('Diagnostic run ID: ' + ($url.Split('/')[-1]))
    Write-Output 'Observe MIST CATALOG TYPES / 14. API acceptance does not prove rendering or native success.'
} catch { throw 'SDK-interface-view launch failed. No pairing attempted.' }
finally { $headers.Clear(); $credential=$null; $secure.Dispose() }

# Fixed bedroom baseline; saved DPAPI credential only. No pairing, launch or writes.
#Requires -Version 7
$ErrorActionPreference = 'Stop'
$tokenPath = Join-Path $env:LOCALAPPDATA 'Mist\ConsoleTV\d32f-g4.token.dpapi'
if (-not (Test-Path -LiteralPath $tokenPath)) { throw 'Saved bedroom credential missing; no pairing attempted.' }
$secure = (Get-Content -LiteralPath $tokenPath -Raw).Trim() | ConvertTo-SecureString
$credential = [System.Net.NetworkCredential]::new('', $secure)
$headers = @{ AUTH = $credential.Password }
try {
    try {
        $response = Invoke-WebRequest -SkipCertificateCheck -SkipHttpErrorCheck -Method Get -Uri 'https://192.168.4.23:7345/app/current' -Headers $headers -TimeoutSec 6 -MaximumRedirection 0
        $body = $response.Content | ConvertFrom-Json
        $status = if ($body.STATUS.RESULT -in @('SUCCESS', 'REQUIRES_PAIRING', 'BLOCKED')) { $body.STATUS.RESULT } else { 'other' }
        [pscustomobject]@{ path = '/app/current'; method = 'GET'; httpStatus = [int]$response.StatusCode; result = $status } | ConvertTo-Json -Compress
    } catch { Write-Output '{"path":"/app/current","method":"GET","result":"check_failed"}' }
    finally { $body = $null; $response = $null }
    foreach ($path in @('/scpl/install', '/scpl/mist-research-absent-check', '/app/current')) {
        try {
            $response = Invoke-WebRequest -SkipCertificateCheck -SkipHttpErrorCheck -Method Head -Uri ('https://192.168.4.23:7345' + $path) -Headers $headers -TimeoutSec 6 -MaximumRedirection 0
            $type = ([string]$response.Headers['Content-Type']).Split(';')[0]
            if ($type -notin @('text/html', 'application/json', 'text/plain')) { $type = 'other' }
            [pscustomobject]@{ path = $path; method = 'HEAD'; httpStatus = [int]$response.StatusCode; type = $type } | ConvertTo-Json -Compress
        } catch { [pscustomobject]@{ path = $path; method = 'HEAD'; result = 'check_failed' } | ConvertTo-Json -Compress }
        finally { $response = $null }
    }
} finally { $headers.Clear(); $credential = $null; $secure.Dispose() }

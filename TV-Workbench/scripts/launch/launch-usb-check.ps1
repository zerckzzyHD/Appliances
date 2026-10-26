# One explicit diagnostic launch; no uploads, commands, settings or firmware writes.
#Requires -Version 7
$ErrorActionPreference = 'Stop'
$url = 'http://127.0.0.1:12345/usbparts/sda1/mist-usb-check.html'
$tokenPath = Join-Path $env:LOCALAPPDATA 'Mist\ConsoleTV\v435-j01.token.dpapi'
$secure = (Get-Content -LiteralPath $tokenPath -Raw).Trim() | ConvertTo-SecureString
$credential = [System.Net.NetworkCredential]::new('', $secure)
$headers = @{AUTH=$credential.Password}
try {
    $body = @{VALUE=@{MESSAGE=$url;NAME_SPACE=4;APP_ID='17'}} | ConvertTo-Json -Depth 4
    $result = Invoke-RestMethod -SkipCertificateCheck -Method Put -Uri 'https://192.168.4.20:7345/app/launch' -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 10
    Write-Output ('API RESULT: ' + $result.STATUS.RESULT)
    Write-Output 'Observe whether MIST USB CHECK / USB-302 appears. API success is not display evidence.'
} catch { throw 'USB-page launch request failed. No pairing attempted.' }
finally { $headers.Clear(); $credential=$null; $secure.Dispose() }

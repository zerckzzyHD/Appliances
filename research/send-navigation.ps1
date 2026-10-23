# Owner-authorized bounded navigation only; no power/settings keys or pairing.
#Requires -Version 7
param([Parameter(Mandatory)][ValidateSet('Right','OK','Back','Up','Down','Left')][string[]]$Key)
$ErrorActionPreference='Stop'
$codes=@{Right=@(3,7);OK=@(3,2);Back=@(4,0);Up=@(3,8);Down=@(3,0);Left=@(3,1)}
$tokenPath=Join-Path $env:LOCALAPPDATA 'Mist\ConsoleTV\v435-j01.token.dpapi'
$secure=(Get-Content -LiteralPath $tokenPath -Raw).Trim() | ConvertTo-SecureString
$credential=[System.Net.NetworkCredential]::new('', $secure)
$headers=@{AUTH=$credential.Password}
try {
 foreach($button in $Key){
  $code=$codes[$button]
  $body=@{KEYLIST=@(@{CODESET=$code[0];CODE=$code[1];ACTION='KEYPRESS'})} | ConvertTo-Json -Depth 4
  $result=Invoke-RestMethod -SkipCertificateCheck -Method Put -Uri 'https://192.168.4.20:7345/key_command/' -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 10
  Write-Output ($button+': '+$result.STATUS.RESULT)
  if($result.STATUS.RESULT -ne 'SUCCESS'){throw 'Navigation not accepted.'}
  Start-Sleep -Milliseconds 300
 }
} finally {$headers.Clear();$credential=$null;$secure.Dispose()}

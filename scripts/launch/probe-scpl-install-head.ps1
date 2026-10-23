# Exact advisory L9-44-476 path plus same-prefix absent control. HEAD only; no override/update/upload.
#Requires -Version 7
$ErrorActionPreference='Stop'
$tokenPath=Join-Path $env:LOCALAPPDATA 'Mist\ConsoleTV\v435-j01.token.dpapi'
$secure=(Get-Content -LiteralPath $tokenPath -Raw).Trim() | ConvertTo-SecureString
$credential=[System.Net.NetworkCredential]::new('', $secure)
$headers=@{AUTH=$credential.Password}
try{
 foreach($path in @('/scpl/install','/scpl/mist-research-absent-check','/app/current')){
  try{
   $response=Invoke-WebRequest -SkipCertificateCheck -SkipHttpErrorCheck -Method Head -Uri ('https://192.168.4.20:7345'+$path) -Headers $headers -TimeoutSec 5 -MaximumRedirection 0
   $type=([string]$response.Headers['Content-Type']).Split(';')[0]
   if($type -notin @('text/html','application/json','text/plain')){$type='other'}
   Write-Output ($path+': HTTP '+[int]$response.StatusCode+'; type '+$type)
  }catch{Write-Output ($path+': header check failed; details withheld')}
 }
}finally{$headers.Clear();$credential=$null;$secure.Dispose()}

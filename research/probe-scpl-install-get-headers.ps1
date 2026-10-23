# Advisory L9-44-476 form path; GET headers only, response body never read.
#Requires -Version 7
$ErrorActionPreference='Stop'
$secure=(Get-Content -LiteralPath (Join-Path $env:LOCALAPPDATA 'Mist\ConsoleTV\v435-j01.token.dpapi') -Raw).Trim() | ConvertTo-SecureString
$credential=[System.Net.NetworkCredential]::new('', $secure)
$handler=[System.Net.Http.HttpClientHandler]::new()
$handler.AllowAutoRedirect=$false
$handler.ServerCertificateCustomValidationCallback=[System.Net.Http.HttpClientHandler]::DangerousAcceptAnyServerCertificateValidator
$client=[System.Net.Http.HttpClient]::new($handler)
$client.Timeout=[TimeSpan]::FromSeconds(5)
try {
  $client.DefaultRequestHeaders.Add('AUTH',$credential.Password)
  foreach($path in @('/scpl/install','/scpl/mist-research-absent-check','/app/current')) {
    $response=$null
    try {
      $response=$client.GetAsync(('https://192.168.4.20:7345'+$path),[System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).GetAwaiter().GetResult()
      $type=[string]$response.Content.Headers.ContentType.MediaType
      if($type -notin @('text/html','application/json','text/plain')){$type='other'}
      Write-Output ($path+': GET HTTP '+[int]$response.StatusCode+'; type '+$type+'; body not read')
    } catch {Write-Output ($path+': GET header check failed; details withheld')}
    finally {if($null -ne $response){$response.Dispose()}}
  }
} finally {$client.DefaultRequestHeaders.Clear();$client.Dispose();$handler.Dispose();$credential=$null;$secure.Dispose()}

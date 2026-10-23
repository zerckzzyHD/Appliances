# One explicit native launch, then bounded GET-only metadata polling. No native retry.
#Requires -Version 7
param([Parameter(Mandatory)][ValidateSet('version','store','internal','speech','appLookup','catalogTypes','routeFilter','homeReferences','sourceMapping')][string]$Group)
$ErrorActionPreference='Stop'
$launchers=@{sourceMapping='launch-source-mapping-check.ps1';homeReferences='launch-home-source-check.ps1';routeFilter='launch-conjure-route-check.ps1';version='launch-sdk-interfaces.ps1';store='launch-sdk-store-check.ps1';internal='launch-sdk-internal-check.ps1';speech='launch-sdk-speech-check.ps1';appLookup='launch-sdk-app-lookup.ps1';catalogTypes='launch-sdk-catalog-check.ps1'}
$lines=@(& (Join-Path $PSScriptRoot $launchers[$Group]))
$lines | Write-Output
if($lines -notcontains 'API RESULT: SUCCESS'){throw 'Native launch not accepted; no retry.'}
$run=($lines | Select-String -Pattern '^Diagnostic run ID: ([a-f0-9]{32})$').Matches.Groups[1].Value
if($run -notmatch '^[a-f0-9]{32}$'){throw 'Expected run identifier missing.'}
& node (Join-Path $PSScriptRoot 'await-diagnostics.mjs') $Group $run
if($LASTEXITCODE -ne 0){throw 'Matched diagnostics incomplete; native operation was not retried.'}

#Requires -Version 5.1
# Read-only health snapshot. Never starts/stops a process, launches TV, or opens a token.
param(
    [Parameter(Mandatory)][System.Net.IPAddress]$AllyIP,
    [ValidateRange(1024,65535)][int]$Port = 4176
)
$ErrorActionPreference='Stop'
$task=Get-ScheduledTask -TaskName 'MistConsoleTV-Summary' -ErrorAction SilentlyContinue
$listener=@(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
$edge=$false; $summary=$false; $stale=$null
$consoleListener=Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue | Where-Object {$_.LocalAddress -eq '127.0.0.1'}
$consoleOwned=[bool]($listener | Where-Object {$_.LocalAddress -eq $AllyIP.ToString() -and $_.OwningProcess -eq $consoleListener.OwningProcess})
try { $edge=(Invoke-RestMethod -Uri ('http://'+$AllyIP+':'+$Port+'/health') -TimeoutSec 5).edge -eq 'running' } catch { }
try {
    $value=Invoke-RestMethod -Uri ('http://'+$AllyIP+':'+$Port+'/summary.json') -TimeoutSec 7
    $summary=$value.availability -eq 'AVAILABLE'; $stale=$value.freshness.sourceStale
} catch { }
$result=[ordered]@{
    ObservedAt=[DateTimeOffset]::Now.ToString('o');
    TaskPresent=[bool]$task; TaskState=$(if($task){[string]$task.State}else{'ABSENT'});
    ExactLANListener=[bool]($listener | Where-Object {$_.LocalAddress -eq $AllyIP.ToString()});
    OtherInterfaceListener=[bool]($listener | Where-Object {$_.LocalAddress -ne $AllyIP.ToString()});
    ConsoleOwnedListener=$consoleOwned;
    EdgeHTTPReady=$edge; ApprovedSummaryAvailable=$summary; SourceStale=$stale;
    TVDisplay='NOT_TESTED_BY_THIS_CHECK'; LogonSurvival='NOT_TESTED_BY_THIS_CHECK'
}
[pscustomobject]$result|ConvertTo-Json
if (-not $edge -or -not $summary -or -not $consoleOwned -or $result.OtherInterfaceListener) {exit 1}

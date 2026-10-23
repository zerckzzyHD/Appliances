#Requires -Version 5.1
# Historical installer: read-only retirement notice; never installs a new task.
param([Parameter(Mandatory)][System.Net.IPAddress]$AllyIP,[Parameter(Mandatory)][System.Net.IPAddress]$TVIP,[ValidateRange(1024,65535)][int]$Port=4176,[switch]$Apply)
$ErrorActionPreference='Stop'
if($Apply){throw 'Independent TV task installation is retired. Configure the Console-owned Vite plugin.'}
foreach($ip in @($AllyIP,$TVIP)){
  if($ip.AddressFamily -ne 'InterNetwork' -or $ip.ToString() -notmatch '^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)'){throw 'Private IPv4 addresses required.'}
}
if($Port -in @(4174,5173)){throw 'Reserved port; existing services are protected.'}
[pscustomobject]@{Mode='PLAN_ONLY';TaskName='MistConsoleTV-Summary';Retired=$true;ActivationSupported=$false;Replacement='Console-owned Vite lifecycle';ConfigurationChanged=$false;ExistingTasksChanged=$false;AutoLaunchTV=$false}|ConvertTo-Json

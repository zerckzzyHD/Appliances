# TV client evidence

Current-scope pointer, 2026-10-23: HOME-SPEC.md and EXECUTION-PLAN.md govern the
customized ad-free Home goal and offline preparation. This file retains dated
client evidence; it is not the current experiment queue. The original menu's
navigation evidence below must be retained when assessing the next input test.

Current lifecycle: Console-owned hosting, with the historical TV task disabled.
See CONSOLE-LIFECYCLE.md and the latest dated section below; earlier entries
are retained observations and do not describe current startup.

## Earlier hardware evidence, 2026-10-17

Vizio V435-J01, observed user agent firmware 1.720.9.1-1 / Conjure 128.1.9.
Earlier plain probe requests from the TV returned HTTP 200 and HTML/JavaScript/
Enter callbacks. Owner confirmed visible content. Corrected launch URL then
displayed the original four-tile menu; owner confirmed arrows, OK open and OK
return. Original expression "$serverURL?v=$stamp" had expanded to only a stamp
suffix; braced interpolation/concatenation preserved the URL. Original script
and menu were retained unchanged. Input Lab was not edited.

## Earlier implementation evidence

Candidate filter/server: 14 synthetic tests passed in staging before source
organization. A loopback read of the existing real /view.json route passed the
allowlist and returned AVAILABLE. That demonstrates upstream compatibility,
not the TV display of this new summary page.

Existing probe task was Running with zero triggers; original PID 2252 served 4174. Fresh PowerShell launches reused the token without PIN. Actual Termius
disconnect, Windows relogon, WAN removal, Back/Home/Exit-to-Switch, TV-native
Home entry and second-TV support remain untested. No auto-ready task is installed.

New repository checks and hardware tests must be recorded below after execution.

### Repository checks executed

- Component JavaScript syntax checks passed; 15 component tests passed, 0 failed after adding CLI boundary checks.
- PowerShell launch script parsed without errors.
- Existing View fixture selftest: 84 passed, 0 failed.
- View conformance was not run: its source states that part B reads live status
  directly. No direct production-state access was performed for this workstream.
- No repository-specific linter is configured for the new zero-dependency
  component. Formatting is checked with the already-installed local formatter;
  no packages are installed by this workstream.

### Repository foreground trial

The repository CLI bound only 192.168.4.26:4176 with a 180-second lifetime.
The approved summary route returned HTTP 200 against the existing live Console.
/reports, /view.json and a query attempting to supply an upstream URL all
returned 404. The launcher reused the existing token and the TV API returned
SUCCESS. Owner confirmation of the new summary display is still pending;
this is separate from the earlier confirmed four-tile demo display.

During the trial, socket inspection still showed the original 4174 listener
and Vite on 127.0.0.1:5173. Original Downloads script and menu hashes matched
the initial baseline. No other repository changes were reported in RobCo UOS.

### Owner photo and foreground recovery, 2026-10-17

Owner-supplied photo 6695.jpg visibly shows the new MIST CONSOLE / TV page with
UNAVAILABLE and the failed-fetch message. This confirms client-page rendering,
not successful display of real summary values. The earlier 180-second trial
had exited; a fresh socket check found no listener on 4176. A loopback read
still returned an AVAILABLE aggregate projection from existing Mist Console.

The repository CLI was then explicitly restarted in a foreground session
without --seconds. No code, configuration or startup setting change was needed.
The LAN summary route returned HTTP 200. Socket inspection observed connections
from the configured TV at 192.168.4.20. The existing page's periodic fetch can
recover without another Conjure launch. Owner confirmation of the recovered
ATTENTION/counts/STALE display remains pending.

This foreground process is not a logon task, service, or proof of survival
across closing Codex/the hosting session. It has no three-minute timer, but
must not be described as installed persistent readiness.

### Live summary visible on the TV, 2026-10-17

The subsequent owner-provided photo shows MIST CONSOLE / TV, ATTENTION,
0 of 31 PASS, 5 of 31 FAIL, 26 of 31 UNOBSERVABLE, and supervisor publication
marked STALE. Its displayed projection timestamp is 2026-10-17T18:44:36.596Z.
This establishes visible real-summary content on the V435-J01 and supersedes
the earlier pending display confirmation. It does not establish startup or
session independence of the foreground listener.

The owner explicitly reported that the supervisor and related components are
intentionally paused and that failures/unknowns are expected in that state.
This is owner-reported operational context, not independently inspected state
or a diagnosis that every reported outcome has the same cause. No supervisor,
scheduled task, lock, ledger or control-plane state was changed or resumed.
The client continues to display the existing projection without overriding
its verdict or freshness.

### Startup preparation and queue check, 2026-10-17

Prepared start-ready.ps1, install-readiness.ps1 and check-ready.ps1 in the
repository. All PowerShell files parsed without errors. The installer default
plan ran under built-in Windows PowerShell with ConfigurationChanged=false,
ExistingTasksChanged=false and AutoLaunchTV=false. The read-only health check
reported the foreground edge and approved summary available, dedicated task
absent, and source stale. Source staleness did not fail host readiness.

JavaScript checks passed; the component suite now reports 17 passed, 0 failed,
0 skipped, including Windows installer plan and rejected-profile cases.
Formatting and Git whitespace checks passed. No task was installed or changed;
task-hosted operation, restart behavior and real logon remain untested.

Pause visibility was located in existing canonical queue items CM9 D-14 and
MI34; exact pointers and search limits are in CONTEXT.md. No duplicate queue
item was added, no queue edit was made, and no pause/resume state was changed.

### Approved dedicated-task activation, 2026-10-17

The owner explicitly approved installing/starting MistConsoleTV-Summary and
replacing only this workstream's foreground listener. Preflight found the task
absent and the known foreground node.exe PID 11700 owning 4176. Identity and
arguments were rechecked immediately before stopping that process. The repo
installer was run with -Apply, without an execution-policy bypass.

Post-transition health under a fresh built-in Windows PowerShell process:
TaskPresent=true, TaskState=Running, ExactLANListener=true,
OtherInterfaceListener=false, EdgeHTTPReady=true, ApprovedSummaryAvailable=true.
The supervisor source remained stale, which does not invalidate host readiness.
Observed listener PID 18464 had parent PowerShell PID 13352, whose command line
was the dedicated hidden start-ready.ps1 action. The registered trigger was
MSFT_TaskLogonTrigger, principal Limited/Interactive, three retries/PT1M,
execution time limit PT0S. The numeric last-result field was 267009 while the
task reported Running; it was not treated as a completed-process result.

Vite remained PID 12096 on 127.0.0.1:5173; the original probe remained PID 2252
on 192.168.4.26:4174. No Conjure launch, pairing, token write, supervisor action,
firewall change, Tailscale change, or other task mutation was issued.

This establishes currently running task-hosted serving. Actual Windows relogon,
automatic recovery after failure, SSH disconnect and changed DHCP remain
untested. No reboot/logoff or fault injection was performed on the owner.

### Coordinated login test baseline, 2026-10-17

Owner requested the login test. At 14:55:19 EDT, dedicated task was Running,
LastRunTime 2026-10-17T14:52:29-04:00, listener PID 18464. A later task run/new
listener and successful health checks are required before reporting logon
readiness observed. Sign-out/relogon has not yet occurred at this record point.
The owner is instructed to save work and perform the sign-out manually; no
automated logoff or reboot is run. HANDOFF-NOTES.md preserves the task inventory,
source/hardware context and instructions to update the proper governing homes.

### Coordinated login result, 2026-10-17

After the sign-out/sign-in instructions the owner returned with "back".
No manual server start, scheduled-task start, Conjure launch or pairing was
issued before measurement. At 14:58:57 EDT, MistConsoleTV-Summary was Running,
LastRunTime 2026-10-17T14:57:07-04:00 (newer than the 14:52:29 baseline).
Listener PID 25320, created 14:57:10.833794-04:00, replaced baseline PID 18464.
Its parent was PowerShell PID 12108 running the exact hidden repo task action.

The fresh read-only check returned TaskPresent=true, ExactLANListener=true,
OtherInterfaceListener=false, EdgeHTTPReady=true and ApprovedSummaryAvailable=true.
Vite returned independently as PID 10644 on 127.0.0.1:5173; root HTTP 200.
These measurements support auto-readiness across this coordinated user login.
They do not establish recovery across every startup race or Windows update.

The older on-demand probe server on 4174 did not return; its existing task was
Ready, with no listener. It was not restarted or reconfigured. Its old files
were retained, and it is distinct from the new task-backed live-summary client.
The foreground-only health tool still labels LogonSurvival NOT_TESTED_BY_THIS_CHECK:
this longitudinal result comes from the before/after evidence, not that script.
Owner observation of no unwanted TV input switch is requested separately.
Actual automatic failure recovery, SSH disconnect, WAN removal, Back/Home/
Switch exit and second-TV support remain untested.

### Login observation, local time and process lifetime, 2026-10-17

Owner confirmed after login: same TV input, live summary visible. This supplies
the previously pending no-input-hijack/display observation for that login.
Owner then identified that raw UTC hour 19 should display local hour 15.
Added an America/New_York 24-hour formatter with EDT/EST label, preserving UTC
in the data contract. Four regression cases cover October, winter/DST, date
boundaries, unknown timestamps and execution of the actual delivered page script.
The updated page was served with the formatter and a one-time explicit Conjure
reload was accepted. Actual updated on-TV clock confirmation is pending.

The reload exposed a real lifecycle defect: Stop-ScheduledTask left old Node
PID 25320 alive after its host stopped. That specifically identified child was
cleaned up and service restored; the startup wrapper was then fixed using a
non-inheritable kill-on-close Windows job before spawning Node. A synthetic
host/child termination test passed. During the actual task verification,
TASK_STOP_CLOSED_NODE=True and PORT_FREE_AFTER_STOP=True, followed by task
Running, exact LAN listener, health and approved summary available at 15:05 EDT.
Only this dedicated task and its verified children were stopped/started.

The earlier login pass predates this containment helper; the revised helper has
passed controlled task start/stop, not another real Windows login. No automatic
crash-retry, supervisor operation or unrelated startup change was performed.

Final checks for these corrections: 22 component tests passed, 0 failed,
0 skipped; JavaScript syntax, all PowerShell parsing, formatting and Git
whitespace checks passed. Executing the actual served page script against the
actual approved summary produced "Projection generated: 2026-10-17 15:06:00 EDT".
This is a delivered-script check, not a substitute for the pending TV photo/
owner confirmation. Prior View tests were not rerun because its files did not
change. No clock, system timezone, Vite, Tailscale or supervisor setting changed.

### Updated-document reload after owner clock feedback, 2026-10-17

The owner answered that UTC or another issue remained after the first clock
reload. The previous launcher reused the identical root URL; retained document
state was a hypothesis, not a measured historical cause. Manual launch now
selects a unique strict /client/<hex> route serving the same fixed page. No
arbitrary upstream/query route or new data field was opened.

Added a fixed script marker on normal summary requests and a TV-peer-specific,
in-memory health boolean. Before the fresh-URL launch it was false; afterward
tvLocalTimeUISeen=true with actual TCP connections from 192.168.4.20. This
establishes execution of the updated requesting script on the TV. Owner visual
confirmation of the timestamp remains a separate pending observation.

The dedicated task stopped its Node child successfully during this restart,
then returned to serving. No task configuration, Vite, Tailscale, firmware,
supervisor or system time setting was changed. JavaScript checks and 24 tests
passed, including strict unique-document routing and marker behavior. The
manual launcher still uses braces/concatenation for valid URL construction.

### Console-owned lifecycle activated, 2026-10-17

Owner visually confirmed the corrected local 24-hour clock: hour 15 was correct.
Owner then requested that TV hosting exist only while Mist Console (Vite) runs,
explicitly allowing Vite changes. This supersedes independent TV login startup.

The private vite-plugin.mjs now hosts the restricted summary listener inside the
Console process. Public RobCo source contains only a generic optional development
extension loader. The machine-local module/profile JSON is ignored by Git and
HTTP-denied (actual request returned 403). Existing Vite loopback bind, allowed
hosts, private View routes and Tailscale configuration were not widened.

Only MistConsoleTV-Summary was disabled and stopped. Its previously contained
Node process exited and freed 4176; the task is retained Disabled, Enabled=false.
The older 4174 probe task and supervisor tasks were left untouched. Independent
serve/start/install entry points now refuse activation. No startup trigger was
added and no automatic TV launch was introduced.

At 15:38 EDT, Console 127.0.0.1:5173 and TV 192.168.4.26:4176 both belonged to
PID 15348. The readiness check reported ConsoleOwnedListener=true,
OtherInterfaceListener=false, EdgeHTTPReady=true, ApprovedSummaryAvailable=true.
An actual stop through the existing dev-server manager then measured both ports
closed. Restart with --no-proxy brought both back as PID 9004; health was running
and tvLocalTimeUISeen=true after normal TV polling. Tailscale writes were skipped.
These PIDs are observations, not configuration values.

JavaScript syntax and all 27 TV tests passed (0 failed/skipped), including real
fixture listener start/close and cancellation while waiting for LAN. Public fast
gate passed, including its browser boot smoke. The full gate result is recorded
separately after it finishes. The new coupled startup has not been measured
across another Windows login, LAN loss/recovery, or every startup race. The older
standalone task's observed login result remains historical evidence only.

Public Console full gate subsequently exited 0: 4,061 Node assertions passed,
plus boot smoke, mobile rendering, accessibility, runtime audit, queue click path,
save survival and offline browser behavior. This browser offline test is not the
still-pending coordinated TV/WAN-removal experiment. Fast and full gate logs were
captured in the current Codex workspace. All PowerShell source parsed with zero
errors, changed JavaScript formatting passed and Git whitespace checks passed.
No dependencies were installed. The public service-worker cache revision changes
r69 to r70 solely because its required changelog update is a served asset; no
remote publish/deploy occurred.

### Startup display and retained TV pairing, 2026-10-17

The owner confirmed the Vite popup visually looked good and provided its actual
startup text: Console /home, separate RobCo /terminal/, and actual TV LISTENING.
That text showed a duplicate early TV line. The listener's ready event is now
quiet before the normal banner; a delayed LAN start still updates STARTING to
LISTENING. Regression cases cover both orderings. All 29 TV tests and syntax,
changed-JavaScript formatting and whitespace checks passed.

Managed Vite child environment explicitly enables color and removes inherited
NO_COLOR only from the child. An actual spawned Node color probe emitted ANSI.
A real Vite API startup on the actual Console port, with captured custom logger,
reported ansi=true, homePrinted=true, tvListeningPrinted=true, base=/terminal/,
HTTP home=200 and edgeRunning=true. This harness then closed and the normal
managed Console was restored using --no-proxy. It did not launch or pair the TV.
The normal manager's on-disk startup log remained stale; it is not used as proof
of the new popup's contents. The owner's pasted output and the captured Vite API
probe supply the startup evidence instead. No logging-capture repair is claimed.

Owner performed remote off/20-second/on and reported Vizio Home. Owner clarified
that Home return is expected: the requirement is retained pairing and reconnect
on future tile selection, not automatic reopening. A read-only /app/current GET
with the existing DPAPI-protected saved credential returned HTTP 200 SUCCESS;
the same GET without credentials returned HTTP 403. No token rewrite, pairing,
app launch or input switch occurred. This supports retained authentication after
this standby cycle; it does not establish cold-boot, reset or DHCP-change behavior,
nor establish a supported private Home-tile installation path.

Public Console full gate exited 0 with 4,063 Node checks and all browser checks.
The source color change is public-generic; private TV paths/profile/status remain
in the private component. Public cache r70->r71 accompanies its required served
changelog update; no deployment or push occurred. Current TV listener remains
Console-owned; dedicated historical TV task disabled. Tailscale, startup trigger
and paused supervisor were not reconfigured. TV-ENTRY.md contains researched
TAIL1-TAIL3 milestones; none is claimed executed.

### Manual relaunch after standby, 2026-10-17

With Console-owned listener healthy and approved summary available, the explicit
source launcher reused the existing saved pairing after the owner's TV standby
cycle. API returned SUCCESS. Owner subsequently reported Mist visible, no PIN,
and projection timestamp advancing during the 30-second observation. No pairing
or startup change was performed. This is one observed post-standby relaunch and
refresh result; cold power loss/reset and a native Home tile remain unestablished.
Owner reasserted manual Home-tile entry as the goal; screenshots and automatic
wake launch are outside the current priority. Optional success notification is
recorded as an idea, not as an implemented or tested external integration.

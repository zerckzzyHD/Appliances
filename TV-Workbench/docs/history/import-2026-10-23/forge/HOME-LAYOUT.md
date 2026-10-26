# Vizio Home app-order persistence

Current issue record, opened 2026-10-17. Related to the TV entry experience;
not a defect in Mist's rendered summary. No fix is established.

## Evidence and limits

OWNER-REPORTED: custom Home app ordering occasionally resets, while other TV
settings stay saved. The owner reports the same symptom on a second TV of the
same model. The second unit was not independently inspected; its firmware and
account/network configuration are unknown.

OBSERVED: three supplied photos show a Home screen/Recent Apps overlay, App
Search for `mist` without a Mist result among the visible catalog entries, and
App Search for `conju` reporting no results. The owner reports no Mist/Conjure
tile. The visible tabs include Discover, A-Z, Home Screen Apps, App Search and
Bundles. These photos do not show every catalog entry or the opened Home Screen
Apps management panel. No custom-URL registration control has been observed.

Photo attachment basenames: image-1792268086718.jpg, image-1792268135870.jpg,
image-1792268156289.jpg. Original uploads remain in the conversation attachments;
room photos have not been copied into source or a public repository.

OBSERVED, authenticated GET only: admin_and_privacy settings returned store_demo
as T_LIST_V1 with scalar value Off. This is one measured mode value, not a full
settings audit. Update/reset action identifiers were seen but never invoked.
A deviceinfo read did not yield verified fresh model/firmware metadata: its
returned string could not be decoded by the attempted JSON-only parser. The
prior firmware observation is historical; no latest-version claim is made.

The scope of this symptom makes a shared Home personalization/software/service
problem plausible. It does not prove a server-side cause, intentional advertising
changes, a firmware regression, storage damage, or which release fixes it.

## Sources checked

https://www.vizio.com/en/home-screen documents catalog app management and reorder.
It does not diagnose this persistence failure or document arbitrary private tiles.
https://www.reddit.com/r/VizioTV/comments/1wdpd66/home_apps_order_keeps_changing/
contains firsthand reports of app ordering changing and removed apps returning.
These corroborate symptoms only; comment theories and workarounds are unverified.
Search results and the rendered page disagree on relative/date presentation;
no exact publication date is adopted here. Retrieved 2026-10-17.

Official model-information, firmware-information and app-management support
pages returned Loading/CSS Error to the retrieval tool. No supported V435-J01
fix, compatible firmware image, release-note remedy or downgrade procedure was
verified. Generic advice and another model's instructions are not substitutes.

## Next diagnostic steps

1. Inspect Apps -> Home Screen Apps, using the tab labels visible in the owner's
   photos. Record available edit/move/add/save controls without changing the list.
2. Record the current saved custom row, separately from the Recent Apps overlay.
   If the owner chooses a controlled reorder test, use one deliberately chosen
   change and the actual on-screen save/confirm control. Do not invent key presses.
3. Compare after returning Home, then after an owner-conducted normal standby
   cycle, and later regular use. Record when the row first differs; intermittent
   success does not establish the issue resolved.
4. Obtain firmware and Home version/update stamps from the TV's visible information
   screen if available, excluding serials/account names. Compare the second TV
   only if its owner supplies the same limited observations.
5. If an update correlation is observed, research that exact model/release before
   proposing any update. Vendor escalation would require owner authorization.

No flashing, factory reset, update check/action, DNS/network change, account
change, app reorder or automatic restoration watcher was performed. The original
Mist Home-tile goal remains open. Screenshot capture is deferred; quiet Console-
owned server readiness and manual TV entry remain the owner's chosen behavior.

This file owns the component-level issue record. The canonical planning queue
has not been edited. Final Claude handoff must reconcile an existing item before
adding a new one, under that queue's writer rules.

## Video inspection, 2026-10-17 (supersedes pending panel inspection)

Owner supplied Google Drive file 1VW5lMLrfj1HlrKjsQpqulijoOvFl2XVq. Public file
was downloaded through its ordinary confirmation form, with no account login or
sharing change. Local inspection copy is in this Codex workspace at
work/tv-ui-video.mp4 (284120598 bytes); SHA256:
6C74A0F2A714220D5FBED3895485AD0C77044566DDCB5A9ABC1500FFEDECDB58.
Clip duration 37.675459 seconds. It is HEVC with rotated display orientation.
Browser playback did not yield video frames, so a workspace-local standalone
FFmpeg decoder was extracted from the imageio-ffmpeg 0.6.0 Windows wheel after
matching its SHA256 to PyPI distribution metadata. No package was installed into
the project or global Python environment. Decoder and clip remain workspace
scratch; neither was copied into the source repository.

Method: extracted 38 keyframes at approximately one-second intervals, inspected
a timestamped overview and detailed TV-region crops. These are sampled frames,
not a full-frame-rate button/IR timing measurement. Crops are derived from the
owner's footage, not generated mockups or TV-side screenshot captures.

OBSERVED on-screen states:
- Around 7 seconds the Apps page has navigation/tab scaffolding with its main
  content still loading; by 10 seconds Discover content is populated.
- Home Screen Apps opens a horizontal row. In edit mode the actual instruction
  says to move left/right and press OK to save; Down removes an app.
- At 28 seconds Netflix is before Prime Video. At 31 seconds Netflix has moved
  after Prime Video while the edit-mode prompt remains visible.
- At 37 seconds Hulu is highlighted with the normal move/remove selection hint,
  rather than the edit-mode save prompt. The ending view does not itself verify
  the earlier Netflix position was committed or survived a return/restart.
- No arbitrary-URL, custom-package or private-tile registration control appears
  in the inspected panel states. This is not an exhaustive undocumented-API test.

The footage supplies the previously missing management-panel evidence. It does
not capture a spontaneous saved-order reset, establish exact button-to-screen
latency, isolate IR/remote/network/rendering causes, or establish a firmware fix.
Do not blame the owner's save procedure or present lag as quantitatively measured.

Next controlled check can reuse the Netflix/Prime Video change already shown:
finish its explicit OK save if still editing, compare relative positions after
returning Home, then after an owner-conducted ordinary standby/off-on cycle.
Record the first stage that loses the order. One passing cycle does not close an
intermittent issue. No TV settings, app positions, power or inputs were changed
by the agent during this video analysis.

## Owner persistence result and delayed recurrence, 2026-10-17

Owner confirms the reordered layout persists through the immediate save/Home/
standby check. Resets are delayed: sometimes a couple of hours, sometimes a
couple of days. This supersedes the pending immediate-persistence check above.
Save failure and inevitable reset on every ordinary off/on cycle are not supported
by the current evidence. No immediate test loop or repeated reorder is needed.
This is owner-observed behavior; the agent did not continuously monitor either TV.

Keep the current arrangement as a baseline. At its next natural reset, record
approximate time, whether membership changed (apps returned/disappeared) or just
order, and any observed update/restart/account event. Do not infer an update or
server synchronization merely from the elapsed interval. Version/update stamps
may help compare before/after if actually available. Longitudinal monitoring,
external notifications and background restoration are not installed or scheduled.
Native Home-tile access remains a separate unresolved capability; a layout reset
fix is not established and is not a prerequisite for further tile research.

## Owner onset history, 2026-10-17

Owner has had this TV for a couple of years and reports the customized Home app
layout stayed configured for years. The delayed resets began only a few months
ago. No exact onset date, firmware/Home release or triggering event is established.
Treat this as a reported regression after a long stable period, rather than normal
expected customization behavior. The stable history plus delayed recurrence and
second same-model report strengthens a shared Home software/service regression
hypothesis; it does not identify the responsible component or establish a fix.
The observed onset predates this Mist TV workstream. No new immediate-save test
is warranted merely because the historical layout later resets.

Fresh read-only TV software baseline is recorded in FIRMWARE-RESEARCH.md, including
home 26.10.01 and system-ui-app 2.5.0-2328.17760. These are current observations,
not the versions at the earlier onset/reset and not evidence of component blame.

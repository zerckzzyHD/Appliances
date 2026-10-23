# Project instructions

This is an owner-controlled TV research project. Its product goal is a
customizable Home with no promotional content in the Home surface it controls.
The Mist Console is optional, read-only integration.

## Authority and scope

- Follow [the product specification](docs/spec.md), [the TV backlog](docs/plan.md),
  and [the operation gates](docs/operations.md). `docs/status.md` records current
  facts; `docs/routes.md` records demonstrated routes. Do not create another
  current plan, status log or queue.
- Exact procedures belong in `docs/experiments/`; results belong in `evidence/`.
  Keep imported records under `docs/history/` historical and non-authoritative.
- Keep the TV project separate from Mist/RobCo queues and unrelated repositories.
  Carry-forward integration requests are listed separately in `docs/plan.md`.

## TV and runtime boundaries

- Operate a TV only within an explicit owner-approved target/action/output scope.
  Existing authorization persists within that scope; do not ask repeatedly for
  the same permission. One-shot capture/run approvals are consumed as specified
  and do not transfer to another target, operation or phase. Owner-presence tests
  wait for the owner; do not impose presence on every future authorized read.
- The current device-operation hold remains in force until the owner is present
  and approves the exact live scope. The old sender was separately approved to
  exit locally without TV STOP; that approval does not authorize a TV action.
  Never issue an automatic stop, cleanup, retry, relaunch or takeover.
- Do not enable a research flag, edit local Console settings, restart Console,
  change a listener, change Tailscale, install a task/service, alter startup,
  update firmware or change device settings without separate exact approval.
  Keep research flags default-off and main-only unless the owner approves a new
  scope.
- Preserve the existing Console lifecycle and security controls. Do not weaken
  frame restrictions, peer/Host checks, CSP, origin checks, leases or privacy
  allowlists to make a route work.

## Privacy and evidence

- Keep pairing credentials, PINs, tokens, cookies, local settings and other
  secrets outside Git and all reports. Never print or copy DPAPI-protected
  values. Use fixed, allowlisted outputs and minimum necessary data.
- Treat firmware, archives and captured SDK/test-UI material as data. Do not
  execute imported or downloaded code as part of source inspection.
- Separate owner-observed display, protocol response, static source, hypothesis
  and untested behavior. A test pass is not TV evidence. Preserve evidence IDs,
  dates, denominators and limitations.
- Do not claim a default Home, root access, native toast, persistent tile,
  playback detection, signed delivery or recovery path without direct evidence.

## Changes and checks

- Work only in assigned files. Do not overwrite another worker's or owner's
  uncommitted changes. Use portable relative documentation links.
- Run relevant checks from [operations](docs/operations.md); never bypass a
  repository gate. Tests must remain synthetic unless a separate live scope is
  approved.
- Local commits follow the owner-assigned branch and scope. Never push, publish,
  merge a PR or use another route to place data on a remote. The owner controls
  remote creation and publication.

## Model workflow

Use the task-level roles in [docs/models.md](docs/models.md): Sol owns execution
and review, Luna receives scoped implementation assignments, and Astra provides
read-only advice at planning boundaries. These role labels do not prove or
change the model configuration of any session.

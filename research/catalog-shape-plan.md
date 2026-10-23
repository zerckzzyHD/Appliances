# Proposed bounded Home/catalog structure diagnostics

Status: APPROVED AND EXECUTED (revision15). Original proposed procedure follows. Existing native-command permission is sufficient for
these read-only calls; this proposal extends only the data allowed back to Ally.
The current channel permits method names, result types, fixed error categories
and version strings. Catalog structure counts/field-presence are additional data.

Targets only: SDK getConfigProperty for VIZIOApps, VirtualInputs, AppMigration,
plus getVizioAppInfoByCname('sctv'). Never request the complete SC config, accounts,
identity/network data, auth tokens, credentials or private Console state.

Projection computed on the TV, with a maximum3 levels/128 visited objects:
- root kind (null/array/object/string/number/boolean/undefined);
- bounded child counts and scalar-type counts, never scalar contents;
- presence and type only for this fixed field allowlist: APP_ID, NAME_SPACE,
  MESSAGE, AppID, AppId, NameSpace, HtmlAppURI, HtmlAppUri, CNAME, cname, Apps,
  apps, Items, items, Properties, properties, URL, url, URI, uri, enabled, order.
- no arbitrary key names, app names, app/device/user IDs, URLs/paths, messages,
  ordering values, config scalars or token/account data. Unknown keys contribute
  only to aggregate counts; accessors are skipped. No UI screenshot or DOM dump.

Return one bounded JSON structure (16KiB ceiling) per fixed target via existing
4176 listener, exact TV socket, Host and Origin, no forwarded identity. Backend
validates exact keys, fixed target labels/types/field enum, bounded integers and
array membership; reject everything else. Snapshot stays in RAM; save only the
validated structural projection with timestamp/run ID. No raw configuration export.
No configuration/store/firmware/install write or settings toggle accompanies it.
Remove this temporary shape route when research finishes.

Purpose: distinguish the actual catalog/input routing structure from a generic
store without guessing storage keys or modifying entries. Presence of a launch
URI is not a persistent Home installer contract or permission to change it.

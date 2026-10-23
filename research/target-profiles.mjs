// Owner-provided targets; credentials are resolved by PowerShell, never sent to TV pages.
const profiles = Object.freeze({
  main: Object.freeze({
    target: "main",
    tv: "192.168.4.20",
    port: 4178,
    credential: "v435-j01.token.dpapi",
  }),
  bedroom: Object.freeze({
    target: "bedroom",
    tv: "192.168.4.23",
    port: 4177,
    credential: "d32f-g4.token.dpapi",
  }),
});
export function researchProfile(target) {
  if (!Object.hasOwn(profiles, target)) throw Error("Unknown research target");
  return profiles[target];
}

import { networkInterfaces } from "node:os";
import { isIP } from "node:net";
import { createTVServer, readExistingConsole } from "../console/server.mjs";
import { researchProfile } from "../research/target-profiles.mjs";
import { createResearchServer } from "../research/isolated-server.mjs";

// The host owns the timer and listener. No process, task or TV launch is created.
export function bindToConsole(
  owner,
  companion,
  endpoint,
  {
    ready = () => true,
    error = () => {},
    interval = 1000,
    attempts = 120,
  } = {},
) {
  let closed = false,
    timer,
    remaining = attempts;
  function stop() {
    closed = true;
    clearTimeout(timer);
    if (companion.listening) {
      companion.close();
      companion.closeAllConnections?.();
    }
  }
  companion.on("listening", () => {
    if (closed) stop();
  });
  companion.on("error", () => {
    error("TV companion listener unavailable.");
  });
  function start() {
    if (closed || !owner.listening) return;
    if (!ready()) {
      if (--remaining > 0) {
        timer = setTimeout(start, interval);
        timer.unref();
      } else error("TV companion LAN address unavailable; no fallback bind.");
      return;
    }
    companion.listen({ ...endpoint, exclusive: true });
  }
  owner.once("close", stop);
  if (owner.listening) start();
  else owner.once("listening", start);
  return stop;
}

// Presentation only: do not change Vite's base, resolved URLs or bind.
export function installConsoleBanner(vite, companion, { bind, port }) {
  const original = vite.printUrls.bind(vite);
  const colored =
    !process.env.NO_COLOR &&
    (process.platform === "win32" ||
      process.stdout.isTTY ||
      process.env.FORCE_COLOR);
  const cyan = (text) => (colored ? "\x1b[36m" + text + "\x1b[0m" : text);
  const line = (label, value) =>
    vite.config.logger.info("  >  " + label + ": " + cyan(value));
  let stopped = false,
    failed = false,
    printed = false;
  const tvLine = () =>
    line(
      "TV",
      (stopped
        ? "STOPPED"
        : failed
          ? "UNAVAILABLE"
          : companion.listening
            ? "LISTENING"
            : "STARTING") +
        " http://" +
        bind +
        ":" +
        port +
        "/ (TV display not checked)",
    );
  companion.on("listening", () => {
    if (printed) tvLine();
  });
  companion.on("close", () => {
    stopped = true;
    tvLine();
  });
  companion.on("error", () => {
    failed = true;
    tvLine();
  });
  vite.printUrls = () => {
    if (!vite.resolvedUrls) return original();
    for (const url of vite.resolvedUrls.local) {
      line("Local", new URL("/home", url).href);
      line("RobCo", url);
    }
    for (const url of vite.resolvedUrls.network) line("Network", url);
    printed = true;
    tvLine();
  };
}

export default function consoleTVPlugin(options = {}) {
  const { bind, tv, port = 4176 } = options;
  const researchTargets = options.researchTargets ?? [];
  const researchDocument24 = options.researchDocument24 ?? false;
  const researchDependencies25 = options.researchDependencies25 ?? false;
  const researchDashcastMarker = options.researchDashcastMarker ?? false;
  const researchHomeInput = options.researchHomeInput ?? false;
  if (
    typeof researchHomeInput !== "boolean" ||
    (researchHomeInput &&
      (!Array.isArray(researchTargets) || !researchTargets.includes("main")))
  )
    throw Error("Home input diagnostic requires explicit main opt-in.");
  if (
    typeof researchDashcastMarker !== "boolean" ||
    (researchDashcastMarker && !researchTargets.includes("main"))
  )
    throw Error("DashCast marker requires explicit main opt-in.");
  if (
    typeof researchDocument24 !== "boolean" ||
    (researchDocument24 && !researchTargets.includes("main"))
  )
    throw Error("Document research requires explicit main opt-in.");
  if (
    typeof researchDependencies25 !== "boolean" ||
    (researchDependencies25 && !researchTargets.includes("main"))
  )
    throw Error("Dependency research requires explicit main opt-in.");
  if (
    !Array.isArray(researchTargets) ||
    researchTargets.length > 2 ||
    new Set(researchTargets).size !== researchTargets.length
  )
    throw new Error("Invalid research targets.");
  const researchProfiles = researchTargets.map(researchProfile);
  if (
    researchProfiles.length &&
    (bind !== "192.168.4.26" || tv !== "192.168.4.20" || port !== 4176)
  )
    throw new Error(
      "Research targets require the recorded main Console profile.",
    );
  const privateV4 = (value) =>
    isIP(value) === 4 &&
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(value);
  if (
    !privateV4(bind) ||
    !privateV4(tv) ||
    bind === tv ||
    !Number.isInteger(port) ||
    port < 1024 ||
    port > 65535 ||
    [4174, 5173].includes(port)
  )
    throw new Error("Invalid private TV companion profile.");
  let stop = () => {};
  const researchStops = [];
  return {
    name: "mist-console-tv-lifecycle",
    apply: "serve",
    configureServer(vite) {
      const owner = vite.httpServer;
      if (!owner) return;
      const companion = createTVServer({
        readProjection: readExistingConsole,
        peers: new Set([bind, tv]),
        tvPeer: tv,
        authority: bind + ":" + port,
      });
      installConsoleBanner(vite, companion, { bind, port });
      const bits = (value) =>
        value
          .split(".")
          .reduce((n, octet) => ((n << 8) | Number(octet)) >>> 0, 0);
      stop = bindToConsole(
        owner,
        companion,
        { host: bind, port },
        {
          ready() {
            const address = owner.address();
            if (
              !address ||
              address.address !== "127.0.0.1" ||
              address.port !== 5173
            )
              return false;
            const iface = Object.values(networkInterfaces())
              .flat()
              .find(
                (value) =>
                  value.address === bind &&
                  value.family === "IPv4" &&
                  !value.internal,
              );
            return (
              !!iface &&
              (bits(bind) & bits(iface.netmask)) ===
                (bits(tv) & bits(iface.netmask))
            );
          },
          error: (message) => vite.config.logger.error(message),
        },
      );
      for (const profile of researchProfiles) {
        const research = createResearchServer({
          profile,
          ally: bind,
          documentEnabled: profile.target === "main" && researchDocument24,
          dashcastMarkerEnabled:
            profile.target === "main" && researchDashcastMarker,
          homeInputEnabled: profile.target === "main" && researchHomeInput,
          dependenciesEnabled:
            profile.target === "main" && researchDependencies25,
        });
        researchStops.push(
          bindToConsole(
            owner,
            research,
            { host: bind, port: profile.port },
            {
              ready() {
                const address = owner.address();
                if (
                  !address ||
                  address.address !== "127.0.0.1" ||
                  address.port !== 5173
                )
                  return false;
                return Object.values(networkInterfaces())
                  .flat()
                  .some(
                    (iface) =>
                      iface.family === "IPv4" &&
                      !iface.internal &&
                      iface.address === bind &&
                      (bits(bind) & bits(iface.netmask)) ===
                        (bits(profile.tv) & bits(iface.netmask)),
                  );
              },
              error: () =>
                vite.config.logger.error(
                  "Research listener unavailable: " + profile.target,
                ),
            },
          ),
        );
      }
    },
    closeBundle() {
      stop();
      for (const dispose of researchStops) dispose();
    },
  };
}

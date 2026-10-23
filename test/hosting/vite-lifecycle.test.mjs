import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import consoleTVPlugin, {
  bindToConsole,
  installConsoleBanner,
} from "../../src/hosting/vite-plugin.mjs";

test("listener stays down until Console listens, and closes when Console closes", async (t) => {
  const owner = http.createServer((req, res) => res.end("fixture"));
  const client = http.createServer((req, res) => res.end("summary fixture"));
  t.after(() => {
    owner.close();
    client.close();
    owner.closeAllConnections();
    client.closeAllConnections();
  });
  bindToConsole(owner, client, { host: "127.0.0.1", port: 0 });
  assert.equal(client.listening, false);
  const up = once(client, "listening");
  owner.listen(0, "127.0.0.1");
  await up;
  assert.equal(client.listening, true);
  assert.equal(
    await (await fetch("http://127.0.0.1:" + client.address().port)).text(),
    "summary fixture",
  );
  const down = once(client, "close");
  owner.close();
  await down;
  assert.equal(client.listening, false);
});
test("closing Console while LAN is unavailable cancels a delayed start", async (t) => {
  const owner = http.createServer(),
    client = http.createServer();
  let ready = false;
  t.after(() => {
    owner.close();
    client.close();
  });
  bindToConsole(
    owner,
    client,
    { host: "127.0.0.1", port: 0 },
    { ready: () => ready, interval: 5, attempts: 10 },
  );
  owner.listen(0, "127.0.0.1");
  await once(owner, "listening");
  owner.close();
  await once(owner, "close");
  ready = true;
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(client.listening, false);
});
test("Console shutdown hooks dispose the listener and unsafe profiles are refused", () => {
  for (const options of [
    { bind: "0.0.0.0", tv: "192.168.4.20" },
    { bind: "192.168.4.26", tv: "8.8.8.8" },
    { bind: "192.168.4.26", tv: "192.168.4.20", port: 5173 },
  ])
    assert.throws(() => consoleTVPlugin(options));
  const plugin = consoleTVPlugin({ bind: "192.168.4.26", tv: "192.168.4.20" });
  assert.equal(plugin.apply, "serve");
  plugin.closeBundle();
});

test("startup shows Console home and actual TV socket state without moving RobCo", async (t) => {
  const companion = http.createServer();
  t.after(() => companion.close());
  const lines = [];
  const urls = { local: ["http://127.0.0.1:5173/terminal/"], network: [] };
  const vite = {
    resolvedUrls: urls,
    printUrls() {
      throw new Error("unexpected fallback");
    },
    config: { logger: { info: (line) => lines.push(line) } },
  };
  installConsoleBanner(vite, companion, { bind: "192.168.4.26", port: 4176 });
  vite.printUrls();
  const plain = () => lines.join("\n").replace(/\x1b\[[0-9;]*m/g, "");
  assert.match(plain(), /Local: http:\/\/127\.0\.0\.1:5173\/home/);
  assert.match(plain(), /RobCo: http:\/\/127\.0\.0\.1:5173\/terminal\//);
  assert.match(plain(), /TV: STARTING/);
  assert.strictEqual(vite.resolvedUrls, urls);
  assert.equal(urls.local[0], "http://127.0.0.1:5173/terminal/");
  companion.listen(0, "127.0.0.1");
  await once(companion, "listening");
  assert.match(plain(), /TV: LISTENING/);
  assert.match(plain(), /TV display not checked/);
  const down = once(companion, "close");
  companion.close();
  await down;
  assert.match(plain(), /TV: STOPPED/);
});

test("a listener ready before the Vite banner is printed appears only once", async (t) => {
  const companion = http.createServer();
  t.after(() => companion.close());
  const lines = [];
  const vite = {
    resolvedUrls: { local: ["http://127.0.0.1:5173/terminal/"], network: [] },
    printUrls() {},
    config: { logger: { info: (line) => lines.push(line) } },
  };
  installConsoleBanner(vite, companion, { bind: "192.168.4.26", port: 4176 });
  companion.listen(0, "127.0.0.1");
  await once(companion, "listening");
  assert.equal(lines.length, 0);
  vite.printUrls();
  assert.equal(lines.filter((line) => line.includes("TV:")).length, 1);
  assert.match(lines.join("\n"), /LISTENING/);
});

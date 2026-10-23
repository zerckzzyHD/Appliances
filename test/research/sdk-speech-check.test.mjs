import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { SDK_SPEECH_PAGE } from "../../src/research/sdk-speech-check.mjs";
import { validateDiagnosticReport } from "../../src/research/restricted-diagnostics.mjs";
async function run(reject = false) {
  let ready, script;
  const reports = [],
    timers = [],
    calls = [],
    output = {};
  const root = {
    VIZIO_MODULES: {
      TextToSpeech: {
        speak(text) {
          assert.equal(text, "Mist is connected to this TV.");
          calls.push("speak");
          return reject
            ? Promise.reject(Error("PRIVATE_SENTINEL"))
            : Promise.resolve(undefined);
        },
        stopSpeech() {
          calls.push("stop");
          return Promise.resolve(undefined);
        },
        setTextToSpeechEnabled() {
          throw Error("Must not change setting");
        },
      },
    },
    location: { pathname: "/research/sdk-speech-check/" + "a".repeat(32) },
    setTimeout(fn, ms) {
      assert.equal(ms, 5000);
      timers.push(fn);
    },
    fetch(path, options) {
      reports.push(JSON.parse(options.body));
      return Promise.resolve({ status: 204 });
    },
  };
  const document = {
    getElementById() {
      return output;
    },
    addEventListener(name, fn) {
      ready = fn;
    },
    createElement() {
      return {};
    },
    body: {
      appendChild(s) {
        script = s;
      },
    },
  };
  vm.runInNewContext(SDK_SPEECH_PAGE.match(/<script>([\s\S]*)<\/script>/)[1], {
    window: root,
    document,
  });
  ready();
  ready();
  script.onload();
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, ["speak"]);
  assert.equal(timers.length, 1);
  timers[0]();
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, ["speak", "stop"]);
  for (const r of reports) assert.ok(validateDiagnosticReport(r));
  const lastStart = reports
    .filter((r) => r.probe === "sdk-speech-start-17")
    .at(-1);
  assert.equal(lastStart.state, reject ? "rejected" : "resolved");
  assert.equal(
    reports.filter((r) => r.probe === "sdk-speech-stop-17").at(-1).state,
    "resolved",
  );
  assert.doesNotMatch(
    JSON.stringify(reports) + output.textContent,
    /PRIVATE_SENTINEL/,
  );
}
test("native speech test issues one fixed utterance and one stop without setting changes", () =>
  run());
test("speech rejection stays distinct from cleanup success and omits raw error", () =>
  run(true));

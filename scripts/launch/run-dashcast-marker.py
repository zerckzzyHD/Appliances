"""Plan by default. One main-TV DashCast iframe marker run; never arbitrary URLs."""
import argparse
import json
import logging
from pathlib import Path
import sys
import time
import threading
from urllib.request import Request, build_opener, ProxyHandler, HTTPRedirectHandler
from uuid import UUID

BASE = "http://192.168.4.26:4178"
APP = "84912283"
NAMESPACE = "urn:x-cast:com.madmod.dashcast"
BACKDROP = "E8C28D3"

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

class Control:
    def __init__(self):
        self.opener = build_opener(ProxyHandler({}), NoRedirect())
    def call(self, method, path, value=None):
        if path not in ("/health", "/research/runs") and not (
            path.startswith("/research/runs/") and valid_run(path.rsplit("/", 1)[-1])
        ):
            raise ValueError("control_path")
        body = None if value is None else json.dumps(value).encode()
        req = Request(BASE + path, data=body, method=method,
                      headers={"Content-Type": "application/json"} if body else {})
        with self.opener.open(req, timeout=3) as response:
            raw = response.read(16385)
        if len(raw) > 16384:
            raise ValueError("control_size")
        return json.loads(raw)

def valid_run(value):
    return isinstance(value, str) and len(value) == 32 and all(c in "0123456789abcdef" for c in value)

def idle_cast(status):
    return status is not None and status.app_id in (None, "", BACKDROP)

def owns(status, session):
    return bool(session and status and status.app_id == APP and status.session_id == session)

def payload(run):
    if not valid_run(run):
        raise ValueError("run")
    return {"url": BASE + "/research/dashcast-marker/" + run,
            "force": False, "reload": False, "reload_time": 0}

def fixed_marker_status(value):
    if not isinstance(value, dict) or set(value) != {"responsesIssued", "lastRejection"}:
        raise ValueError("marker_status")
    count = value["responsesIssued"]
    reason = value["lastRejection"]
    if type(count) is not int or not 0 <= count <= 2 or reason not in (
        "none", "method", "origin_present", "request_limit"
    ):
        raise ValueError("marker_status")
    return {"responsesIssued": count, "lastRejection": reason}

def stopped_session_absent(response, session):
    if not session or not isinstance(response, dict) or response.get("type") != "RECEIVER_STATUS":
        return False
    status = response.get("status")
    if not isinstance(status, dict):
        return False
    apps = status.get("applications", [])
    if not isinstance(apps, list):
        return False
    for app in apps:
        if not isinstance(app, dict) or not isinstance(app.get("sessionId"), str):
            return False
        if app["sessionId"] == session:
            return False
    return True

def cleanup(cast, session, control, run, result, ack_timeout=3):
    incomplete = False
    if cast:
        try:
            if owns(cast.status, session):
                event = threading.Event()
                ack = {"sent": False, "response": False, "stopped": False}
                def callback(sent, response):
                    ack["sent"] = sent is True
                    ack["response"] = isinstance(response, dict)
                    ack["stopped"] = stopped_session_absent(response, session)
                    event.set()
                result["ownedStopAttempted"] = True
                # Pin STOP to captured session: never insert a later current session.
                cast.socket_client.receiver_controller.send_message(
                    {"type": "STOP", "sessionId": session}, inc_session_id=False,
                    callback_function=callback)
                acknowledged = event.wait(ack_timeout)
                result["stopSendConfirmed"] = acknowledged and ack["sent"]
                result["stopResponseReceived"] = acknowledged and ack["response"]
                result["capturedSessionAbsent"] = acknowledged and ack["stopped"]
                if not result["stopSendConfirmed"] or not result["capturedSessionAbsent"]:
                    incomplete = True
            else:
                result["ownedStopAttempted"] = False
                if result.get("receiverLaunchAttempted") and not session:
                    result["receiverCleanupUnconfirmed"] = True
                    incomplete = True
        except Exception:
            result["stopSendConfirmed"] = False
            incomplete = True
        finally:
            try:
                cast.disconnect(timeout=3)
                result["senderDisconnected"] = True
            except Exception:
                result["senderDisconnected"] = False
                incomplete = True
    if run:
        try:
            released = control.call("DELETE", "/research/runs/" + run)
            result["leaseReleased"] = released.get("released") is True
        except Exception:
            result["leaseReleased"] = False
        incomplete = incomplete or not result["leaseReleased"]
    result["cleanupIncomplete"] = incomplete

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--packages", type=Path)
    args = parser.parse_args()
    if not args.apply:
        print(json.dumps({"planOnly": True, "target": "main", "group": "dashcastMarker",
                          "messages": 1, "mode": "iframe", "observeSeconds": 12,
                          "warning": "full-screen app launch; owned quit may return Home"}))
        return 0
    if args.packages is None or not args.packages.is_dir():
        parser.error("--apply requires the existing isolated --packages directory")
    result = {"target": "main", "messages": 0, "visualResult": "unobserved"}
    control, cast, run, session = Control(), None, None, None
    started = time.monotonic()
    try:
        health = control.call("GET", "/health")
        if health.get("edge") != "running" or health.get("target") != "main" or health.get("dashcastMarker") is not True:
            raise ValueError("marker_disabled")
        sys.path.insert(0, str(args.packages.resolve()))
        logging.disable(logging.CRITICAL)
        import pychromecast
        from pychromecast.models import CastInfo, HostServiceInfo
        from pychromecast.controllers.dashcast import DashCastController
        info = CastInfo({HostServiceInfo("192.168.4.20", 8009)}, UUID(int=0),
                        "V435-J01", "Mist marker test", "192.168.4.20", 8009, "cast", "Vizio")
        cast = pychromecast.Chromecast(info, tries=1, timeout=4, retry_wait=1)
        cast.wait(timeout=8)
        if not idle_cast(cast.status):
            raise ValueError("existing_cast_app_or_unknown")
        before = cast.status.session_id
        lease = control.call("POST", "/research/runs", {"group": "dashcastMarker"})
        candidate = lease.get("run")
        if not valid_run(candidate) or lease.get("target") != "main" or lease.get("path") != "/research/dashcast-marker/" + candidate:
            raise ValueError("lease_mismatch")
        run = candidate
        message = payload(run)
        class MarkerController(DashCastController):
            echo = False
            def receive_message(self, incoming, data):
                if isinstance(data, dict) and data.get("url") == message["url"]:
                    self.echo = True
                return True
        controller = MarkerController()
        cast.register_handler(controller)
        if not idle_cast(cast.status):
            raise ValueError("existing_cast_app_or_unknown")
        result["receiverLaunchAttempted"] = True
        controller.launch(force_launch=True)
        ready = False
        deadline = min(time.monotonic() + 12, started + 25)
        while time.monotonic() < deadline:
            status = cast.status
            if status and status.app_id == APP and status.session_id and status.session_id != before:
                if session is None:
                    session = status.session_id
                if not owns(status, session):
                    raise ValueError("session_changed")
                if status.status_text == "Application ready" and NAMESPACE in cast.socket_client.app_namespaces:
                    ready = True
                    break
            time.sleep(0.1)
        if not ready or not owns(cast.status, session):
            raise ValueError("receiver_not_ready")
        status = cast.status
        if not owns(status, session) or not status.transport_id:
            raise ValueError("session_changed")
        message["sessionId"] = session
        # Pin both destination and session from one status snapshot; no relaunch.
        cast.socket_client.send_message(status.transport_id, NAMESPACE, message,
                                        inc_session_id=False, no_add_request_id=True)
        result["messages"] = 1
        deadline = min(time.monotonic() + 12, started + 30)
        while time.monotonic() < deadline and owns(cast.status, session):
            time.sleep(0.1)
        result["urlEchoReceived"] = controller.echo
        snapshot = control.call("GET", "/research/runs/" + run)
        if snapshot.get("run") != run or snapshot.get("target") != "main":
            raise ValueError("snapshot_mismatch")
        result["marker"] = fixed_marker_status(snapshot.get("marker"))
        result["outcome"] = "observed_protocol_only"
    except Exception as error:
        known = {"marker_disabled", "existing_cast_app_or_unknown", "lease_mismatch", "session_changed",
                 "receiver_not_ready", "snapshot_mismatch", "marker_status"}
        result["outcome"] = str(error) if str(error) in known else "transport_or_protocol_error"
    finally:
        cleanup(cast, session, control, run, result)
        if run:
            out = Path(__file__).parent / "../../evidence/results" / ("dashcast-iframe-main-" + run + ".json")
            with out.open("x", encoding="utf-8") as saved:
                json.dump(result, saved, indent=2)
                saved.write("\n")
        print(json.dumps(result))
    return 0 if result.get("outcome") == "observed_protocol_only" and not result["cleanupIncomplete"] else 1

if __name__ == "__main__":
    raise SystemExit(main())

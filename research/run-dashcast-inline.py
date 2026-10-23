"""One fixed inline DashCast iframe test; only an explicit stop command sends STOP."""
import argparse
import base64
import importlib.util
import json
from pathlib import Path
import queue
import sys
import threading
import time
from uuid import UUID, uuid4

spec = importlib.util.spec_from_file_location("dashcast_marker", Path(__file__).with_name("run-dashcast-marker.py"))
shared = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shared)
HTML = '<!doctype html><meta charset="utf-8"><title>Mist inline control</title><body style="background:black;color:white;font:64px Arial;text-align:center"><h1>MIST INLINE CONTROL</h1><p>Self-contained page</p></body>'
URL = "data:text/html;base64," + base64.b64encode(HTML.encode("utf-8")).decode("ascii")

def message(session):
    return {"url": URL, "force": False, "reload": False, "reload_time": 0, "sessionId": session}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--packages", type=Path)
    args = parser.parse_args()
    if not args.apply:
        print(json.dumps({"planOnly": True, "target": "main", "mode": "iframe", "source": "fixed inert data URI", "autoStop": False}))
        return 0
    if not args.packages or not args.packages.is_dir():
        parser.error("--apply requires existing isolated --packages")
    run = uuid4().hex
    log = Path(__file__).parent / "results" / ("dashcast-inline-main-" + run + ".jsonl")
    def emit(stage, **fields):
        record = {"run": run, "target": "main", "stage": stage, **fields}
        with log.open("a", encoding="utf-8") as output:
            output.write(json.dumps(record) + "\n")
        print(json.dumps(record), flush=True)
    cast, session = None, None
    launch_attempted = False
    try:
        sys.path.insert(0, str(args.packages.resolve()))
        import logging
        logging.disable(logging.CRITICAL)
        import pychromecast
        from pychromecast.models import CastInfo, HostServiceInfo
        from pychromecast.controllers.dashcast import DashCastController
        info = CastInfo({HostServiceInfo("192.168.4.20",8009)}, UUID(int=0), "V435-J01", "Mist inline control", "192.168.4.20",8009,"cast","Vizio")
        cast = pychromecast.Chromecast(info, tries=1, timeout=4, retry_wait=1)
        cast.wait(timeout=8)
        if not shared.idle_cast(cast.status):
            emit("aborted", reason="existing_cast_app_or_unknown")
            cast.disconnect(timeout=3)
            return 1
        before = cast.status.session_id
        class Controller(DashCastController):
            echo = False
            def receive_message(self, incoming, data):
                if isinstance(data,dict) and data.get("url") == URL:
                    self.echo = True
                return True
        controller = Controller()
        cast.register_handler(controller)
        launch_attempted = True
        controller.launch(force_launch=True)
        deadline = time.monotonic() + 12
        ready = False
        while time.monotonic() < deadline:
            status = cast.status
            if status and status.app_id == shared.APP and status.session_id and status.session_id != before:
                if session is None: session = status.session_id
                if shared.owns(status,session) and status.status_text == "Application ready" and shared.NAMESPACE in cast.socket_client.app_namespaces:
                    ready = True
                    break
            time.sleep(0.1)
        if ready:
            status = cast.status
            if shared.owns(status,session) and status.transport_id:
                cast.socket_client.send_message(status.transport_id,shared.NAMESPACE,message(session),inc_session_id=False,no_add_request_id=True)
                emit("url_sent", messages=1, autoStop=False, visualResult="unobserved")
            else: emit("not_sent", reason="session_changed")
        else: emit("not_sent", reason="receiver_not_ready")
        emit("awaiting_owner", commands=["status","stop"], autoStop=False)
        commands = queue.Queue()
        def read_input():
            while True:
                line = sys.stdin.readline()
                if not line:
                    commands.put("input_closed")
                    return
                commands.put(line.strip().lower())
        threading.Thread(target=read_input,daemon=True).start()
        echoed = False
        lost = False
        while True:
            if controller.echo and not echoed:
                echoed = True
                emit("url_echo", received=True)
            current_owned = shared.owns(cast.status,session)
            if session and not current_owned and not lost:
                lost = True
                emit("session_lost_before_stop", stopSent=False)
            try: command = commands.get(timeout=0.5)
            except queue.Empty: continue
            if command == "stop":
                emit("owner_stop_requested")
                result = {"receiverLaunchAttempted": True}
                shared.cleanup(cast,session,None,None,result)
                emit("cleanup", **result)
                return 1 if result["cleanupIncomplete"] else 0
            if command == "status":
                emit("status", urlEchoReceived=controller.echo, capturedSessionActive=current_owned, stopSent=False)
            elif command == "input_closed":
                emit("input_closed", stopSent=False)
                # Keep sender attached; no EOF-driven STOP or timeout cleanup.
            else:
                emit("command_ignored", stopSent=False)
    except Exception:
        emit("transport_or_protocol_error", stopSent=False, autoStop=False)
        # Preserve the owner's no-stop instruction even after an operational error.
        if cast and launch_attempted:
            emit("awaiting_owner_after_error", commands=["stop"], autoStop=False)
            while True:
                line = sys.stdin.readline()
                if line.strip().lower() == "stop":
                    emit("owner_stop_requested")
                    result = {"receiverLaunchAttempted": True}
                    shared.cleanup(cast,session,None,None,result)
                    emit("cleanup", **result)
                    return 1
                time.sleep(0.5)
        if cast:
            try: cast.disconnect(timeout=3)
            except Exception: pass
        return 1

if __name__ == "__main__":
    raise SystemExit(main())

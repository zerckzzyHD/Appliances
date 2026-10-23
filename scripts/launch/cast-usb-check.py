"""Explicit static USB-page check using PyChromecast's DashCast controller.

Supply the isolated package directory with --packages. Without --launch this
only reads Cast status. No device discovery/name listing, pairing, uploads,
firmware writes, receiver registration or startup settings are performed.
"""

import argparse
import json
import logging
from pathlib import Path
import sys
import threading

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--packages", type=Path, required=True)
parser.add_argument("--launch", action="store_true")
parser.add_argument("--direct-navigation", action="store_true")
parser.add_argument("--lan-control", action="store_true")
args = parser.parse_args()
if args.direct_navigation and not args.launch:
    parser.error("--direct-navigation requires --launch")
if args.lan_control and not (args.launch and args.direct_navigation):
    parser.error("--lan-control requires --launch --direct-navigation")
sys.path.insert(0, str(args.packages.resolve()))
logging.disable(logging.CRITICAL)

import pychromecast  # noqa: E402
from pychromecast.controllers.dashcast import DashCastController  # noqa: E402

URL = (
    "http://192.168.4.26:4176/"
    if args.lan_control
    else "http://127.0.0.1:12345/usbparts/sda1/mist-usb-check.html"
)


class MarkerController(DashCastController):
    def __init__(self):
        super().__init__()
        self.echo_received = threading.Event()

    def receive_message(self, message, data):
        if data.get("url") == URL:
            self.echo_received.set()
        return super().receive_message(message, data)


class ReadyListener:
    def __init__(self):
        self.ready = threading.Event()

    def new_cast_status(self, status):
        if status.app_id == "84912283" and status.status_text == "Application ready":
            self.ready.set()


cast = None
try:
    # Direct known host, no multicast discovery or device-name inventory.
    cast = pychromecast.get_chromecast_from_host(
        ("192.168.4.20", 8009, None, None, None),
        tries=1,
        retry_wait=1,
        timeout=5,
    )
    cast.wait(timeout=10)
    print(json.dumps({"stage": "status", "application_id": cast.app_id}), flush=True)
    if args.launch:
        controller = MarkerController()
        cast.register_handler(controller)
        listener = ReadyListener()
        cast.register_status_listener(listener)
        if cast.status:
            listener.new_cast_status(cast.status)
        controller.launch()
        if not listener.ready.wait(25):
            raise TimeoutError("DashCast readiness was not observed")
        print(json.dumps({"stage": "receiver_ready"}), flush=True)
        response_event = threading.Event()

        def callback(succeeded, response):
            # With a request ID this callback waits for the receiver's reply.
            # It does not establish page retrieval or pixel output.
            print(json.dumps({"stage": "callback", "request_succeeded": succeeded}), flush=True)
            response_event.set()

        # Receiver launch/readiness was already established above. Send the
        # documented DashCast payload directly rather than relaunching it in
        # load_url's additional callback chain.
        controller.send_message(
            {"url": URL, "force": args.direct_navigation, "reload": False, "reload_time": 0},
            inc_session_id=True,
            callback_function=None if args.direct_navigation else callback,
            no_add_request_id=args.direct_navigation,
        )
        print(json.dumps({"stage": "socket_write_returned"}), flush=True)
        acknowledged = None if args.direct_navigation else response_event.wait(25)
        # DashCast's direct-navigation branch changes location and returns before
        # sending the message echo. Its absence in that mode is not a failure.
        receiver_echo = (
            None if args.direct_navigation else controller.echo_received.wait(10)
        )
        if args.direct_navigation:
            # Published receiver schedules navigation one second after receipt.
            # Keep the sender connected briefly; no response exists in this mode.
            threading.Event().wait(3)
        print(
            json.dumps(
                {
                    "stage": "finished",
                    "callback_received": acknowledged,
                    "direct_navigation": args.direct_navigation,
                    "target": "lan_control" if args.lan_control else "usb_marker",
                    "receiver_echo_received": receiver_echo,
                    "application_id": cast.app_id,
                    "display_verified": False,
                }
            ),
            flush=True,
        )
except Exception as error:
    print(json.dumps({"stage": "error", "type": type(error).__name__}), flush=True)
    sys.exit(1)
finally:
    if cast:
        # Disconnect sender only; do not issue a stop/quit command to the TV.
        cast.disconnect(timeout=5)

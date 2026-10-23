import base64
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location("inline_test",Path(__file__).resolve().parents[1]/"research/run-dashcast-inline.py")
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)

class InlineTest(unittest.TestCase):
 def test_plan_has_no_device_or_control_operations(self):
  with patch.object(m.sys,"argv",["inline"]),patch.object(m.shared,"cleanup",side_effect=AssertionError("forbidden")),contextlib.redirect_stdout(io.StringIO()) as output:
   self.assertEqual(m.main(),0)
  self.assertTrue(json.loads(output.getvalue())["planOnly"])
 def test_payload_is_fixed_and_inert_and_does_not_select_lan_url(self):
  msg=m.message("owned")
  self.assertFalse(msg["force"]);self.assertFalse(msg["reload"]);self.assertEqual(msg["sessionId"],"owned")
  self.assertEqual(base64.b64decode(msg["url"].split(",",1)[1]).decode(),m.HTML)
  self.assertIn("MIST INLINE CONTROL",m.HTML)
  for forbidden in ["<script","http:","https:","<img","<iframe","<form"]:self.assertNotIn(forbidden,m.HTML)
 def test_session_remains_until_explicit_stop_and_stop_is_pinned(self):
  calls=[];holder={}
  status=lambda app,session:SimpleNamespace(app_id=app,session_id=session,transport_id="transport",status_text="Application ready")
  cast=SimpleNamespace(status=status(m.shared.BACKDROP,"before"),wait=lambda **k:None)
  cast.register_handler=lambda value:holder.update(handler=value)
  def disconnect(**kwargs):
   self.assertIn("STOP",calls);calls.append("disconnect")
  cast.disconnect=disconnect
  def send(dest,ns,message,**kwargs):
   self.assertEqual(dest,"transport");self.assertFalse(kwargs["inc_session_id"]);self.assertTrue(message["url"].startswith("data:text/html;base64,"));calls.append("URL");holder["handler"].receive_message(None,message)
  def stop(message,**kwargs):
   self.assertIn("owner_stop",calls);self.assertEqual(message["sessionId"],"owned");self.assertFalse(kwargs["inc_session_id"]);calls.append("STOP");kwargs["callback_function"](True,{"type":"RECEIVER_STATUS","status":{"applications":[]}})
  cast.socket_client=SimpleNamespace(app_namespaces={m.shared.NAMESPACE},send_message=send,receiver_controller=SimpleNamespace(send_message=stop))
  class Controller:
   def launch(self,**kwargs):cast.status=status(m.shared.APP,"owned")
  class Commands:
   count=0
   def get(self,timeout):
    self.count+=1
    if self.count==1:self_outer.assertNotIn("STOP",calls);return "status"
    self_outer.assertNotIn("STOP",calls);calls.append("owner_stop");return "stop"
  self_outer=self
  fake_modules={"pychromecast":SimpleNamespace(Chromecast=lambda *a,**k:cast),"pychromecast.models":SimpleNamespace(CastInfo=lambda *a:None,HostServiceInfo=lambda *a:a),"pychromecast.controllers.dashcast":SimpleNamespace(DashCastController=Controller)}
  with tempfile.TemporaryDirectory() as temp:
   folder=Path(temp);(folder/"results").mkdir();(folder/"packages").mkdir()
   with patch.dict(m.sys.modules,fake_modules),patch.object(m,"__file__",str(folder/"run.py")),patch.object(m.sys,"argv",["inline","--apply","--packages",str(folder/"packages")]),patch.object(m.queue,"Queue",Commands),patch.object(m.threading,"Thread",lambda **k:SimpleNamespace(start=lambda:None)),contextlib.redirect_stdout(io.StringIO()) as output:
    self.assertEqual(m.main(),0)
   records=[json.loads(line) for line in output.getvalue().splitlines()]
   self.assertEqual([r["stage"] for r in records],["url_sent","awaiting_owner","url_echo","status","owner_stop_requested","cleanup"])
   self.assertEqual(records[3]["stopSent"],False)
   self.assertFalse(records[-1]["cleanupIncomplete"])
   self.assertEqual(calls.count("URL"),1);self.assertEqual(calls.count("STOP"),1)

if __name__=="__main__":unittest.main()

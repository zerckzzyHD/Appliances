import contextlib
import importlib.util
import io
from pathlib import Path
import unittest
import json
import tempfile
import types
from unittest.mock import patch
from types import SimpleNamespace

spec=importlib.util.spec_from_file_location("marker_launcher",Path(__file__).resolve().parents[2]/"scripts/launch/run-dashcast-marker.py")
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)

class LauncherBoundaries(unittest.TestCase):
 def test_default_plan_cannot_construct_control_or_connect(self):
  with patch.object(module,"Control",side_effect=AssertionError("network forbidden")),patch.object(module.sys,"argv",["marker"]),contextlib.redirect_stdout(io.StringIO()) as out:
   self.assertEqual(module.main(),0)
  self.assertIn('"planOnly": true',out.getvalue())
 def test_unknown_and_active_cast_sessions_are_vetoed(self):
  self.assertFalse(module.idle_cast(None))
  for app in ["84912283","CC1AD845","other"]:
   self.assertFalse(module.idle_cast(SimpleNamespace(app_id=app)))
  self.assertTrue(module.idle_cast(SimpleNamespace(app_id=module.BACKDROP)))
 def test_cleanup_requires_exact_new_session_and_app(self):
  self.assertFalse(module.owns(SimpleNamespace(app_id=module.APP,session_id="other"),"owned"))
  self.assertFalse(module.owns(SimpleNamespace(app_id="other",session_id="owned"),"owned"))
  self.assertFalse(module.owns(SimpleNamespace(app_id=module.APP,session_id=None),None))
  self.assertTrue(module.owns(SimpleNamespace(app_id=module.APP,session_id="owned"),"owned"))
 def test_marker_payload_cannot_choose_target_or_force_navigation(self):
  for run in ["../../bad","a"*31,"A"*32,"g"*32,{},None]:
   with self.assertRaises(ValueError):module.payload(run)
  value=module.payload("a"*32)
  self.assertEqual(value,{"url":module.BASE+"/research/dashcast-marker/"+"a"*32,"force":False,"reload":False,"reload_time":0})
 def test_telemetry_rejects_unbounded_and_unapproved_values(self):
  for value in [{"responsesIssued":3,"lastRejection":"none"},{"responsesIssued":True,"lastRejection":"none"},{"responsesIssued":0,"lastRejection":"private error"},{"responsesIssued":0,"lastRejection":"none","source":"secret"}]:
   with self.assertRaises(ValueError):module.fixed_marker_status(value)
  self.assertEqual(module.fixed_marker_status({"responsesIssued":1,"lastRejection":"none"})["responsesIssued"],1)
 def test_unknown_control_path_rejected_before_transport(self):
  control=module.Control()
  with patch.object(control.opener,"open",side_effect=AssertionError("network forbidden")):
   for path in ["http://other/","/research/runs/"+"a"*32+"?x=1","/summary.json"]:
    with self.assertRaises(ValueError):control.call("GET",path)


class CleanupBoundaries(unittest.TestCase):
 def fake(self, stop_error=False, disconnect_error=False, release_error=False, changed=False):
  sent=[]
  cast=SimpleNamespace(status=SimpleNamespace(app_id=module.APP,session_id="owned"),disconnected=False)
  def stop(message,**kwargs):
   if changed:cast.status=SimpleNamespace(app_id="another",session_id="other")
   sent.append((message.copy(),kwargs["inc_session_id"]))
   if stop_error:raise TimeoutError()
   kwargs["callback_function"](True,{"type":"RECEIVER_STATUS","status":{"applications":[]}})
  cast.socket_client=SimpleNamespace(receiver_controller=SimpleNamespace(send_message=stop))
  def disconnect(**kwargs):
   cast.disconnected=True
   if disconnect_error:raise TimeoutError()
  cast.disconnect=disconnect
  def call(*args):
   if release_error:raise TimeoutError()
   return {"released":True}
  return cast,SimpleNamespace(call=call),sent
 def test_stop_is_pinned_even_if_status_changes_during_send(self):
  cast,control,sent=self.fake(changed=True);result={}
  module.cleanup(cast,"owned",control,"a"*32,result,ack_timeout=0)
  self.assertEqual(sent,[({"type":"STOP","sessionId":"owned"},False)])
  self.assertTrue(cast.disconnected);self.assertFalse(result["cleanupIncomplete"])
 def test_stop_exception_cannot_skip_disconnect_or_release(self):
  cast,control,_=self.fake(stop_error=True);result={}
  module.cleanup(cast,"owned",control,"a"*32,result,ack_timeout=0)
  self.assertTrue(cast.disconnected);self.assertTrue(result["leaseReleased"]);self.assertTrue(result["cleanupIncomplete"])
 def test_preexisting_changed_session_is_never_stopped(self):
  cast,control,sent=self.fake();cast.status=SimpleNamespace(app_id=module.APP,session_id="other");result={}
  module.cleanup(cast,"owned",control,"a"*32,result,ack_timeout=0)
  self.assertEqual(sent,[]);self.assertTrue(cast.disconnected)
 def test_disconnect_and_release_errors_remain_cleanup_failures(self):
  for kwargs in [{"disconnect_error":True},{"release_error":True}]:
   cast,control,_=self.fake(**kwargs);result={}
   module.cleanup(cast,"owned",control,"a"*32,result,ack_timeout=0)
   self.assertTrue(result["cleanupIncomplete"])
 def test_missing_stop_ack_is_not_claimed_as_cleanup_success(self):
  cast,control,_=self.fake();cast.socket_client.receiver_controller.send_message=lambda *a,**k:None;result={}
  module.cleanup(cast,"owned",control,"a"*32,result,ack_timeout=0)
  self.assertFalse(result["stopResponseReceived"]);self.assertTrue(result["senderDisconnected"]);self.assertTrue(result["cleanupIncomplete"])

 def test_rejected_or_still_owned_stop_reply_is_incomplete(self):
  for response in [{"type":"INVALID_REQUEST"},{"type":"RECEIVER_STATUS"},{"type":"RECEIVER_STATUS","status":{"applications":[{"sessionId":"owned"}]}},{"type":"RECEIVER_STATUS","status":{"applications":[{}]}}]:
   cast,control,_=self.fake()
   def send(message,**kwargs):kwargs["callback_function"](True,response)
   cast.socket_client.receiver_controller.send_message=send;result={}
   module.cleanup(cast,"owned",control,"a"*32,result,ack_timeout=0)
   self.assertTrue(result["stopResponseReceived"]);self.assertFalse(result["capturedSessionAbsent"]);self.assertTrue(result["cleanupIncomplete"])
 def test_explicit_receiver_status_allows_another_session_without_stopping_it(self):
  self.assertTrue(module.stopped_session_absent({"type":"RECEIVER_STATUS","status":{"applications":[{"sessionId":"other"}]}},"owned"))
  self.assertTrue(module.stopped_session_absent({"type":"RECEIVER_STATUS","status":{}},"owned"))

class ApplyLifecycle(unittest.TestCase):
 def run_apply(self, stop_error):
  run="a"*32;clock=[0];calls=[];holder={}
  status=lambda app,session:SimpleNamespace(app_id=app,session_id=session,transport_id="owned-transport",status_text="Application ready")
  cast=SimpleNamespace(status=status(module.BACKDROP,"before"))
  cast.wait=lambda **k:None;cast.disconnect=lambda **k:calls.append("disconnect")
  cast.register_handler=lambda handler:holder.update(handler=handler)
  def send(dest,namespace,message,**kwargs):
   self.assertEqual(dest,"owned-transport");self.assertEqual(namespace,module.NAMESPACE)
   self.assertEqual(message["sessionId"],"owned");self.assertFalse(kwargs["inc_session_id"])
   holder["handler"].receive_message(None,message);calls.append("LOAD_URL")
  def stop(message,**kwargs):
   calls.append("STOP")
   self.assertEqual(message["sessionId"],"owned");self.assertFalse(kwargs["inc_session_id"])
   if stop_error:raise TimeoutError()
   kwargs["callback_function"](True,{"type":"RECEIVER_STATUS","status":{"applications":[]}})
  cast.socket_client=SimpleNamespace(app_namespaces={module.NAMESPACE},send_message=send,receiver_controller=SimpleNamespace(send_message=stop))
  class Controller:
   def launch(self,**kwargs):cast.status=status(module.APP,"owned")
  def control_call(self,method,path,value=None):
   calls.append(method+" "+path)
   if path=="/health":return {"edge":"running","target":"main","dashcastMarker":True}
   if method=="POST":return {"target":"main","run":run,"path":"/research/dashcast-marker/"+run}
   if method=="DELETE":return {"released":True}
   return {"target":"main","run":run,"marker":{"responsesIssued":1,"lastRejection":"none"}}
  fake_modules={"pychromecast":types.SimpleNamespace(Chromecast=lambda *a,**k:cast),"pychromecast.models":types.SimpleNamespace(CastInfo=lambda *a:None,HostServiceInfo=lambda *a:a),"pychromecast.controllers.dashcast":types.SimpleNamespace(DashCastController=Controller)}
  def sleep(dt):clock[0]+=dt
  with tempfile.TemporaryDirectory() as temp:
   folder=Path(temp);(folder/"evidence/results").mkdir(parents=True);(folder/"packages").mkdir()
   with patch.object(module.Control,"call",control_call),patch.dict(module.sys.modules,fake_modules),patch.object(module,"__file__",str(folder/"scripts/launch/run.py")),patch.object(module,"time",SimpleNamespace(monotonic=lambda:clock[0],sleep=sleep)),patch.object(module.sys,"argv",["marker","--apply","--packages",str(folder/"packages")]),contextlib.redirect_stdout(io.StringIO()) as output:
    code=module.main()
   result=json.loads(output.getvalue());self.assertTrue((folder/"evidence/results"/("dashcast-iframe-main-"+run+".json")).is_file())
  return code,result,calls
 def test_apply_success_records_protocol_without_claiming_pixels(self):
  code,result,calls=self.run_apply(False)
  self.assertEqual(code,0);self.assertEqual(result["messages"],1);self.assertTrue(result["urlEchoReceived"]);self.assertEqual(result["visualResult"],"unobserved");self.assertFalse(result["cleanupIncomplete"])
  self.assertEqual(calls.count("LOAD_URL"),1);self.assertEqual(calls.count("STOP"),1)
 def test_apply_keeps_findings_but_returns_nonzero_on_cleanup_error(self):
  code,result,calls=self.run_apply(True)
  self.assertEqual(code,1);self.assertEqual(result["outcome"],"observed_protocol_only");self.assertTrue(result["cleanupIncomplete"]);self.assertIn("disconnect",calls);self.assertTrue(result["leaseReleased"])

if __name__=="__main__":unittest.main()

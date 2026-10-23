import { formatProjectionTime } from "./time.mjs";
import {
  describeNativeInterfaces,
  renderCapabilityProbe,
} from "./capabilities.mjs";

export const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>Mist Console TV</title>
<style>body{background:#081726;color:#edffff;font:30px Arial;margin:50px}h1{color:#76f0e1;font-size:42px}#verdict{font-size:64px}p{line-height:1.5}.warn{color:#ffd287}</style></head>
<body><h1>MIST CONSOLE / TV</h1><p>Read-only summary from existing Mist Console</p>
<div id="verdict">UNAVAILABLE</div><p id="counts">Waiting for an approved summary</p>
<p id="age" class="warn">Source freshness unknown</p><p id="update">No successful update</p>
<p>Refreshes every 15 seconds. No system actions are available.</p>
<script>(function(){
${describeNativeInterfaces.toString()}
${renderCapabilityProbe.toString()}
if(typeof window!=='undefined' && window.location.hash==='#mist-capabilities'){
renderCapabilityProbe(window,document,describeNativeInterfaces);return;}
${formatProjectionTime.toString()}
function text(id,value){document.getElementById(id).textContent=value;}
function unavailable(){text('verdict','UNAVAILABLE');text('counts','Console summary unavailable');text('age','Source freshness unknown');text('update','Current fetch failed; no cached summary displayed');}
function refresh(){var request=new XMLHttpRequest();request.open('GET','/summary.json',true);request.setRequestHeader('X-Mist-TV-UI','local-time-1');request.timeout=6000;
request.onload=function(){try{if(request.status!==200)throw new Error();var value=JSON.parse(request.responseText);if(value.availability!=='AVAILABLE')throw new Error();
text('verdict',value.summary.verdict);var c=value.summary.counts,n=value.summary.total;
text('counts',c.PASS+' of '+n+' PASS | '+c.FAIL+' of '+n+' FAIL | '+c.UNOBSERVABLE+' of '+n+' UNOBSERVABLE');
var age=value.freshness.sourceAgeMs;var state=value.freshness.sourceStale;
text('age','Supervisor publication: '+(age===null?'age unknown':Math.floor(age/1000)+' seconds old')+' | '+(state===null?'freshness unknown':state?'STALE':'within source freshness window'));
text('update','Projection generated: '+formatProjectionTime(value.projectionGeneratedAt)+' | fetched just now');
}catch(e){unavailable();}};request.onerror=unavailable;request.ontimeout=unavailable;request.send(null);}
refresh();setInterval(refresh,15000);
})();</script></body></html>`;

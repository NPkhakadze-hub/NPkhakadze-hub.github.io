// Personal-link unlock for /k/ (see packs.py). No keys here — they come from the guard.
var NDK=(function(){
var GUARD="", MSG={"notoken": "ეს გვერდი მხოლოდ პირადი ბმულით იხსნება. გახსენი ბმული, რომელიც გამოგიგზავნე.", "taken": "ეს ბმული უკვე ორ მოწყობილობაზეა გააქტიურებული. თუ ბმული შენია და ახალი ტელეფონით ან კომპიუტერით შედიხარ, მომწერე — აღგიდგენ.", "off": "ეს ბმული გათიშულია. თუ ფიქრობ, რომ შეცდომაა, მომწერე.", "bad": "ბმული არასწორია. შეამოწმე, ბოლომდე დაკოპირდა თუ არა.", "nolevel": "ეს დონე შენს პაკეტში არ შედის.", "dec": "გაკვეთილი ვერ გაიხსნა. მომწერე და მალე გავასწორებ.", "net": "ვერ დავუკავშირდი. შეამოწმე ინტერნეტი და სცადე თავიდან.", "nosrv": "გაკვეთილები ჯერ მზადდება — მალე გაიხსნება."};
function b64(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
function ck(k,v){if(v===undefined){var m=document.cookie.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));return m?m[1]:null;}
  document.cookie=k+'='+v+'; path=/k/; max-age=34560000; samesite=lax'+(location.protocol==='https:'?'; secure':'');}
// Device id: random, kept in localStorage and a cookie so one cleared store doesn't burn a device slot.
function device(){var d=ls('nd-dev')||ck('nd_dev');
  if(!d||!/^[0-9a-f]{32}$/.test(d)){var a=new Uint8Array(16);crypto.getRandomValues(a);
    d=Array.prototype.map.call(a,function(x){return('0'+x.toString(16)).slice(-2);}).join('');}
  ls('nd-dev',d);ck('nd_dev',d);return d;}
// Token: taken from #t=… once, then the hash is wiped so a copied address bar carries nothing.
function token(){var m=/[#&]t=([a-z0-9-]+)/i.exec(location.hash);
  if(m){var t=m[1].toLowerCase();ls('nd-tok',t);ck('nd_tok',t);
    try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}return t;}
  return ls('nd-tok')||ck('nd_tok');}
async function session(){
  var t=token(),d=device(),c=null;
  try{c=JSON.parse(sessionStorage.getItem('nd-s')||'null');}catch(e){}
  if(c&&c.t===t&&Date.now()-c.at<36e5)return c;
  if(!t)return{ok:false,why:'notoken'};
  if(!GUARD)return{ok:false,why:'nosrv'};
  var r;try{r=await(await fetch(GUARD,{method:'POST',body:JSON.stringify({t:t,d:d})})).json();}
  catch(e){return{ok:false,why:'net'};}
  if(r&&r.ok){r.t=t;r.at=Date.now();try{sessionStorage.setItem('nd-s',JSON.stringify(r));}catch(e){}}
  else{try{sessionStorage.removeItem('nd-s');}catch(e){}}
  return r||{ok:false,why:'net'};}
async function decrypt(kb64,P){
  var key=await crypto.subtle.importKey('raw',b64(kb64),'AES-GCM',false,['decrypt']);
  return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(P.iv)},key,b64(P.ct)));}
function text(why){return MSG[why]||MSG.bad;}
return{session:session,decrypt:decrypt,text:text};
})();

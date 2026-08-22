(function(){
  document.documentElement.className=document.documentElement.className.replace(/\bno-js\b/,"js");
  /* ─── ენის ავტომატური ამორჩევა ───────────────────────────────
     ქართველი → / · გერმანელი → /de/ · სხვა → ზოლი „English?"
     ⚠️ ინგლისურზე განზრახ არ ვამისამართებთ: Googlebot en-US-ით დადის და
     ავტომატური გადამისამართება ქართულ მთავარ გვერდს ინდექსაციიდან გაიყვანდა. */
  var KEY='lng';                       // მომხმარებლის ხელით არჩევანი
  var chosen=null; try{chosen=localStorage.getItem(KEY);}catch(e){}
  var path=location.pathname.replace(/index\.html$/,'');
  var cur = path==='/de/'?'de' : path==='/en/'?'en' : path==='/'?'ka' : null;

  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('.lang a, .langbar a');
    if(a){try{localStorage.setItem(KEY,a.getAttribute('hreflang')||a.dataset.l||'');}catch(err){}}
  });

  if(cur && !chosen){
    var L=(navigator.languages||[navigator.language||'']).join(',').toLowerCase();
    var tz=''; try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){}
    var want='en';
    if(/(^|,)ka\b|ka-ge/.test(L) || tz==='Asia/Tbilisi') want='ka';
    else if(/(^|,)de\b|de-/.test(L) || /Berlin|Vienna|Zurich|Busingen/.test(tz)) want='de';
    if(want!==cur){
      if(want==='en'){ showBar('en'); }
      else { try{sessionStorage.setItem('auto','1');}catch(e){}
             location.replace((want==='ka'?'/':'/'+want+'/')+location.hash); return; }
    }
  }

  function showBar(l){
    var TXT={en:['This page is also available in English.','Read in English','Stay here']};
    var t=TXT[l]; if(!t) return;
    var bar=document.createElement('div'); bar.className='langbar';
    bar.innerHTML='<span></span><a href="/'+l+'/" data-l="'+l+'"></a><button type="button"></button>';
    bar.children[0].textContent=t[0]; bar.children[1].textContent=t[1]; bar.children[2].textContent=t[2];
    bar.children[2].addEventListener('click',function(){
      try{localStorage.setItem(KEY,'ka');}catch(e){} bar.remove();
    });
    document.addEventListener('DOMContentLoaded',function(){document.body.appendChild(bar);});
    if(document.body) document.body.appendChild(bar);
  }
})();

(function(){
  var b=document.querySelector('.burger'),ul=document.querySelector('.nav ul');
  if(b&&ul){b.addEventListener('click',function(){ul.classList.toggle('open');b.setAttribute('aria-expanded',ul.classList.contains('open'));});
    ul.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){ul.classList.remove('open');});});}
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.08});
    els.forEach(function(e){io.observe(e);});
  } else { els.forEach(function(e){e.classList.add('in');}); }
  var rg=document.getElementById('revgrid'),rm=document.getElementById('revmore');
  if(rg&&rm){rm.addEventListener('click',function(){
    var open=rg.classList.toggle('open');
    rm.textContent=open?rm.dataset.less:rm.dataset.more;
    if(!open)rg.scrollIntoView({behavior:'smooth',block:'start'});
    rg.querySelectorAll('.tcard.extra').forEach(function(e){e.classList.add('in');});
  });}
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();

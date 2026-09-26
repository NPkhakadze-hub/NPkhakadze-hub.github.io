(function(){
  document.documentElement.className=document.documentElement.className.replace(/\bno-js\b/,"js");
  /* ─── ენის შეთავაზება — ზოლით, არა გადამისამართებით ──────────────
     Google: „Avoid automatically redirecting users from one language version
     to another." ავტომატური redirect ამოღებულია. რჩება: (1) hreflang,
     (2) ხილული გადამრთველი, (3) ეს ზოლი — შეთავაზება, არჩევანი მომხმარებლისაა. */
  var KEY='lng';                       // ხელით არჩეული ენა (localStorage)
  var OFF='langbar-off';               // „აქ დავრჩები" — ამ სესიაზე აღარ ვაჩვენოთ
  var chosen=null; try{chosen=localStorage.getItem(KEY);}catch(e){}
  var off=null;    try{off=sessionStorage.getItem(OFF);}catch(e){}
  var path=location.pathname.replace(/index\.html$/,'');
  var cur = path==='/de/'?'de' : path==='/en/'?'en' : path==='/'?'ka' : null;

  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('.lang a, .langbar a');
    if(a){try{localStorage.setItem(KEY,a.getAttribute('hreflang')||a.dataset.l||'');}catch(err){}}
  });

  if(cur && !chosen && !off){
    var L=(navigator.languages||[navigator.language||'']).join(',').toLowerCase();
    var tz=''; try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){}
    // ქართველების უმეტესობას ინგლისურენოვანი ტელეფონი აქვს — ინგლისურს
    // მხოლოდ მაშინ ვთავაზობთ, თუ ka არსად ჩანს და დრო თბილისისა არ არის.
    var isKa = /(^|,)ka\b|ka-ge/.test(L) || tz==='Asia/Tbilisi';
    // გერმანულს მხოლოდ ძირითად ენაზე ვთავაზობთ (navigator.language), არა სიაში
    // მოხვედრაზე — ქართველ ემიგრანტს გერმანიაში de-DE მეორე ენად უწერია.
    var isDe = /^de\b/.test((navigator.language||'').toLowerCase());
    if(isDe && cur!=='de')       showBar('de');
    else if(!isKa && !isDe && cur!=='en') showBar('en');
  }

  function showBar(l){
    var TXT={
      en:['This page is also available in English.','Read in English','Stay here'],
      de:['Diese Seite gibt es auch auf Deutsch.','Auf Deutsch lesen','Hier bleiben']
    };
    var t=TXT[l]; if(!t || !document.body) return;
    var bar=document.createElement('div'); bar.className='langbar';
    bar.innerHTML='<span></span><a href="/'+l+'/" hreflang="'+l+'" data-l="'+l+'"></a><button type="button"></button>';
    bar.children[0].textContent=t[0]; bar.children[1].textContent=t[1]; bar.children[2].textContent=t[2];
    bar.children[2].addEventListener('click',function(){
      try{sessionStorage.setItem(OFF,'1');}catch(e){}
      bar.parentNode&&bar.parentNode.removeChild(bar);
      document.body.classList.remove('has-langbar');
    });
    document.body.appendChild(bar);
    document.body.classList.add('has-langbar');   // sticky CTA ზემოთ აიწევს
  }
})();

(function(){
  /* მენიუ ყველა ეკრანზე ხილულია (☰ აღარ არის). მიმდინარე გვერდს ვნიშნავთ. */
  var here=location.pathname.replace(/index\.html$/,'');
  document.querySelectorAll('.nav ul a').forEach(function(a){
    var p=a.pathname.replace(/index\.html$/,'');
    if(a.hash) return;                                   // #programs და მსგავსი — არა
    if(p===here || (p==='/blog/' && here.indexOf('/blog/')===0)) a.setAttribute('aria-current','page');
  });
  /* ვიწრო ეკრანზე მენიუ ჰორიზონტალურად სრიალებს: „›“ მინიშნება, სანამ მარჯვნივ კიდევ არის;
     მიმდინარე გვერდის ღილაკი ჩატვირთვისას ეკრანზე შემოდის; ღუზების ოფსეტი = header-ის სიმაღლე. */
  var mnav=document.querySelector('.nav nav[aria-label=Main]'), mul=mnav&&mnav.querySelector('ul'), hdr=document.querySelector('header');
  if(mnav&&mul){
    var hint=function(){
      mnav.classList.toggle('can-right', mul.scrollWidth-mul.clientWidth-mul.scrollLeft>4);
      mnav.classList.toggle('can-left', mul.scrollLeft>4);
    };
    mnav.addEventListener('click',function(e){          // „›“-ზე შეხება — შემდეგი სათაურებისკენ
      if(e.target.closest('a')) return;
      if(mnav.classList.contains('can-right') && e.clientX>mnav.getBoundingClientRect().right-48)
        mul.scrollBy({left:Math.round(mul.clientWidth*.6),behavior:'smooth'});
    });
    var pad=function(){ if(hdr) document.documentElement.style.scrollPaddingTop=(hdr.offsetHeight+10)+'px'; };
    mul.addEventListener('scroll',hint,{passive:true});
    addEventListener('resize',function(){hint();pad();},{passive:true});
    var cur=mul.querySelector('a[aria-current]');
    if(cur && mul.scrollWidth>mul.clientWidth){ var x=cur.offsetLeft-22; if(x>0) mul.scrollLeft=x; }
    hint(); pad();
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){hint();pad();});
  }
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

  /* sticky CTA — ჩნდება, როცა hero-ს ღილაკები ეკრანს ზემოთ გავა.
     IntersectionObserver აქ არ გამოდგება: მობილურზე ღილაკები ჩატვირთვისასვე
     ეკრანს ქვემოთაა (≈1100px), ანუ „არ იკვეთება" — ზოლი მაშინვე გამოჩნდებოდა.
     ადგილი CSS-ითაა დაცული (padding-bottom), ამიტომ CLS არ იზრდება. */
  var sticky=document.querySelector('.stickycta');
  if(sticky){
    var anchor=document.querySelector('.hero .actions')||document.querySelector('.hero');
    if(!anchor){ sticky.classList.add('on'); }        // ბლოგი/ქვეგვერდები — hero არ აქვთ
    else {
      var tick=false;
      var upd=function(){
        tick=false;
        sticky.classList.toggle('on', anchor.getBoundingClientRect().bottom < 0);
      };
      var onScroll=function(){ if(!tick){ tick=true; requestAnimationFrame(upd); } };
      addEventListener('scroll', onScroll, {passive:true});
      addEventListener('resize', onScroll, {passive:true});
      upd();
    }
  }
})();

/* ── საკონტაქტო ფორმა ────────────────────────────────────────────────
   GitHub Pages-ს სერვერი არ აქვს. ამიტომ ფორმა შევსებულ ტექსტს WhatsApp-ში
   ან ელფოსტაში გადააქვს — მუშაობს დღესვე, backend-ის გარეშე.
   თუ ოდესმე Formspree/Getform ჩაირთვება (build.py → FORM_ENDPOINT),
   ფორმას data-endpoint გაუჩნდება და ჩვეულებრივ POST-ს გააკეთებს. */
(function(){
  var f=document.getElementById('lead-form');
  if(!f) return;
  function compose(){
    var g=function(n){var el=f.elements[n];return el?String(el.value||'').trim():'';};
    var L=['გამარჯობა, ნოდარ! საიტიდან გწერ.'];
    if(g('name'))    L.push('სახელი: '+g('name'));
    if(g('goal'))    L.push('რისთვის: '+g('goal'));
    if(g('phone'))   L.push('ტელეფონი: '+g('phone'));
    if(g('message')) L.push('დამატებით: '+g('message'));
    return L.join('\n');
  }
  function track(method){
    try{ if(window.gtag) window.gtag('event','generate_lead',{method:method,
      goal:(f.elements['goal']?f.elements['goal'].value:'')}); }catch(e){}
  }
  f.addEventListener('submit', function(e){
    if(f.dataset.endpoint){ track('form'); return; }   // რეალური backend — ჩვეულებრივი POST
    e.preventDefault();
    if(!f.reportValidity()) return;
    track('whatsapp');
    var url=f.dataset.wa+'?text='+encodeURIComponent(compose());
    window.open(url,'_blank','noopener');
  });
  var mail=document.getElementById('lead-mail');
  if(mail) mail.addEventListener('click', function(e){
    e.preventDefault();
    if(!f.reportValidity()) return;
    track('email');
    location.href='mailto:'+mail.dataset.email+
      '?subject='+encodeURIComponent('ინგლისურის გაკვეთილები — საიტიდან')+
      '&body='+encodeURIComponent(compose());
  });
})();

/* ── მოსწავლის შეფასების ფორმა (#reviews) ──────────────────────────
   იგივე ლოგიკა, რაც კონტაქტის ფორმას: ტექსტი WhatsApp-ში ან ელფოსტაში
   გადადის. საიტზე შეფასება მხოლოდ ნოდარის დადასტურების შემდეგ ჩნდება. */
(function(){
  var f=document.getElementById('review-form');
  if(!f) return;
  function val(n){var el=f.elements[n];return el?String(el.value||'').trim():'';}
  function stars(){
    var r=f.querySelector('input[name="stars"]:checked');
    return r?parseInt(r.value,10):5;
  }
  function compose(){
    var n=stars();
    var L=[f.dataset.intro];
    if(val('name'))    L.push('სახელი / Name: '+val('name'));
    if(val('goal'))    L.push('მიმართულება / Course: '+val('goal'));
    L.push('შეფასება / Rating: '+n+'/5 '+Array(n+1).join('\u2605'));
    if(val('message')) L.push('');
    if(val('message')) L.push(val('message'));
    return L.join('\n');
  }
  function track(method){
    try{ if(window.gtag) window.gtag('event','submit_review',
      {method:method, rating:stars(), goal:val('goal')}); }catch(e){}
  }
  f.addEventListener('submit', function(e){
    e.preventDefault();
    if(!f.reportValidity()) return;
    track('whatsapp');
    window.open(f.dataset.wa+'?text='+encodeURIComponent(compose()),'_blank','noopener');
  });
  var mail=document.getElementById('review-mail');
  if(mail) mail.addEventListener('click', function(e){
    e.preventDefault();
    if(!f.reportValidity()) return;
    track('email');
    location.href='mailto:'+mail.dataset.email+
      '?subject='+encodeURIComponent(f.dataset.subject)+
      '&body='+encodeURIComponent(compose());
  });
})();

/* ინგლისურის დონის ტესტი (/blog/inglisuris-donis-testi.html) — პასუხები data-a-შია.
   4 ბლოკი × 5 კითხვა (A1, A2, B1, B2). დონე ჩაითვლება, თუ ბლოკში ≥4/5 სწორია
   და ყველა ქვედა ბლოკიც ჩათვლილია — ასე შემთხვევითი გამოცნობა შედეგს ვერ ზრდის. */
(function(){
  var t=document.getElementById('lvltest'); if(!t) return;
  var btn=t.querySelector('.lcheck'), note=t.querySelector('.lnote');
  btn.addEventListener('click', function(){
    var qs=t.querySelectorAll('.lq'), ok=0, empty=0, band=[0,0,0,0];
    qs.forEach(function(q,i){
      var c=q.querySelector('input:checked');
      q.classList.remove('ok','bad','skip');
      if(!c){ empty++; q.classList.add('skip'); return; }
      if(c.value===q.dataset.a){ ok++; band[Math.floor(i/5)]++; q.classList.add('ok'); }
      else q.classList.add('bad');
    });
    t.querySelectorAll('.lres').forEach(function(r){ r.hidden=true; });
    note.hidden=false;
    if(empty>5){
      t.classList.remove('done');
      note.textContent='შედეგის სანახავად მინიმუმ 15 კითხვას უპასუხე. ახლა გამოტოვებულია: '+empty+'.';
      return;
    }
    var lvl=0; while(lvl<4 && band[lvl]>=4) lvl++;
    t.classList.add('done');
    note.textContent='სწორი პასუხი: '+ok+' / '+qs.length+(empty?' · გამოტოვებული: '+empty:'')+
      '. ზემოთ, თითოეულ კითხვასთან, ახსნა გამოჩნდა.';
    var r=t.querySelector('.lres[data-lvl="'+lvl+'"]');
    btn.textContent='ხელახლა შემოწმება';
    try{ if(window.gtag) window.gtag('event','level_test',{score:ok, level:lvl}); }catch(e){}
    if(r){ r.hidden=false; r.scrollIntoView({behavior:'smooth',block:'center'}); r.focus({preventScroll:true}); }
  });
})();

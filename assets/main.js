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

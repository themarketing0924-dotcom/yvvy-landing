/* Apple 스타일 스크롤 모션: ① 문단 단어 포커스 ② 히어로 축소·페이드. rAF + passive 리스너로 가볍게. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vh=innerHeight, items=[], hero=document.querySelector('.hero>.wrap,.hero>.wrap-wide');
  function wrap(el){
    var words=[];
    (function walk(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var parts=c.nodeValue.split(/(\s+)/), f=document.createDocumentFragment();
          parts.forEach(function(p){ if(!p) return; if(/^\s+$/.test(p)){ f.appendChild(document.createTextNode(p)); } else { var s=document.createElement('span'); s.className='w'; s.textContent=p; f.appendChild(s); words.push(s); } });
          c.parentNode.replaceChild(f,c);
        } else if(c.nodeType===1 && !/^(SCRIPT|STYLE|BR|SVG|INPUT)$/i.test(c.tagName)){ walk(c); }
      });
    })(el);
    return words;
  }
  if(!reduce){
    document.querySelectorAll('section:not(.hero) :is(.body,.sub), section:not(.hero) .wrap>p, section:not(.hero) .wrap-wide>p').forEach(function(el){
      if(el.closest('.card,.vz,.risk,details,.gate,.fine,.note,.warn,footer,.tbl-wrap,table')) return;
      if(/(^| )(fine|note|small|eyebrow|gate-hint|vz-cap|vz-src|contact)( |$)/.test(el.className)) return;
      var len=(el.textContent||'').length; if(len<24||len>420) return;
      var words=wrap(el); if(words.length<4) return;
      el.classList.add('fx-on'); items.push({el:el,w:words,n:words.length,on:0});
    });
  }
  var ticking=false;
  function frame(){
    ticking=false; vh=innerHeight;
    for(var i=0;i<items.length;i++){
      var it=items[i], r=it.el.getBoundingClientRect();
      if(r.bottom<-50||r.top>vh+50){ if(r.top>vh+50 && it.on){ for(var k=0;k<it.n;k++) it.w[k].classList.remove('on'); it.on=0; } else if(r.bottom<-50 && it.on<it.n){ for(var m=it.on;m<it.n;m++) it.w[m].classList.add('on'); it.on=it.n; } continue; }
      var p=(vh*0.92-r.top)/(vh*0.42+r.height*0.35); p=p<0?0:p>1?1:p;
      var t=Math.round(p*it.n);
      if(t>it.on){ for(var a=it.on;a<t;a++) it.w[a].classList.add('on'); }
      else if(t<it.on){ for(var b=t;b<it.on;b++) it.w[b].classList.remove('on'); }
      it.on=t;
    }
    if(hero && !reduce){
      var y=scrollY, p2=y/(vh*0.9); p2=p2<0?0:p2>1?1:p2;
      hero.style.transform='scale('+(1-p2*0.07).toFixed(4)+')'; hero.style.opacity=(1-p2*0.6).toFixed(3);
    }
  }
  function req(){ if(!ticking){ ticking=true; requestAnimationFrame(frame); } }
  addEventListener('scroll',req,{passive:true}); addEventListener('resize',req,{passive:true});
  frame();
})();

/* Mejoras de experiencia: índice por secciones y casos de ejemplo del simulador. No modifica datos. */
(function(){
'use strict';
try{
  // 1) Índice de secciones al inicio de cada módulo
  ['m0','m1','m2','m3','m4'].forEach(function(mid){
    var m=document.getElementById(mid);if(!m)return;
    var hs=[].slice.call(m.querySelectorAll('h2'));if(hs.length<3)return;
    var nav=document.createElement('nav');nav.className='secnav';nav.setAttribute('aria-label','Secciones de este módulo');
    hs.forEach(function(h,i){
      if(!h.id)h.id=mid+'-s'+i;h.style.scrollMarginTop='140px';
      var a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;
      a.addEventListener('click',function(e){e.preventDefault();h.scrollIntoView({behavior:'smooth',block:'start'});h.setAttribute('tabindex','-1');h.focus({preventScroll:true})});
      nav.appendChild(a);
    });
    var first=m.querySelector('h2');first.parentNode.insertBefore(nav,first);
  });
  // 2) Casos de ejemplo en el simulador de transmisión (valores didácticos, etiquetados como Simulación)
  var rs=document.getElementById('sReset');
  if(rs){
    var casos=[['Línea de 400 kV',300,400,10,0.95],['Línea de 230 kV',100,230,10,1],['Línea de 115 kV',50,115,8,0.9]];
    var wrap=document.createElement('span');wrap.className='casos';
    wrap.innerHTML='<span class="fuente" style="margin:0 6px 0 0">Casos de ejemplo (valores didácticos, no mediciones):</span>';
    casos.forEach(function(c){
      var b=document.createElement('button');b.type='button';b.className='b';b.textContent=c[0];
      b.onclick=function(){['sP','sV','sR','sF'].forEach(function(id,i){var e=document.getElementById(id);e.value=c[i+1]});
        document.getElementById('sP').dispatchEvent(new Event('input',{bubbles:true}))};
      wrap.appendChild(b);
    });
    rs.parentNode.appendChild(wrap);
  }
}catch(e){}
})();

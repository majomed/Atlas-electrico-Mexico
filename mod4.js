'use strict';
/* Módulo 4: ¿Sabías que? y La reforma energética de 2013 */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const C={cafe:'#7C2D12',teja:'#9A3412',nar:'#F97316',amb:'#FBBF24',txt:'#3A1608'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf=(n,d=0)=>Number(n).toLocaleString('es-MX',{minimumFractionDigits:d,maximumFractionDigits:d});
const tag=(k,t)=>`<span class="tag t-${k}">${t}</span>`;
const TAGN={oficial:'Oficial',calculo:'Cálculo',simulacion:'Simulación'};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const nd=s=>s.replace(/Dato no disponible/g,'<span class="nd">Dato no disponible</span>');
const def=(t)=>`<span class="def" tabindex="0" data-tip="${esc(GLOSARIO[t])}">${esc(t)}</span>`;

function capChart(){
  const R=REF_CAP,W=720,H=300,m={l:60,r:20,t:24,b:36},n=R.anios.length;
  const X=i=>m.l+i*(W-m.l-m.r)/(n-1),Y=v=>H-m.b-v/100000*(H-m.t-m.b);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Capacidad instalada total y limpia del SEN, 2010 a 2024">`;
  for(let v=0;v<=100000;v+=25000)s+=`<line x1="${m.l}" x2="${W-m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#EBD3AE"/><text x="${m.l-6}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="${C.txt}">${nf(v)}</text>`;
  R.anios.forEach((a,i)=>{s+=`<text x="${X(i)}" y="${H-m.b+16}" text-anchor="middle" font-size="11" fill="${C.txt}">${a}</text>`});
  [[3,'2013: decreto'],[4,'2014: leyes']].forEach(([i,l],k)=>{s+=`<line x1="${X(i)}" x2="${X(i)}" y1="${m.t}" y2="${H-m.b}" stroke="${C.nar}" stroke-dasharray="5 4" stroke-width="1.5"/><text x="${X(i)+(k?4:-4)}" y="${m.t-6}" text-anchor="${k?'start':'end'}" font-size="11" font-weight="700" fill="${C.teja}">${l}</text>`});
  const pl=(arr,c,nm)=>{s+=`<polyline fill="none" stroke="${c}" stroke-width="2.6" points="${arr.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ')}"/>`+arr.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="3.6" fill="${c}"><title>${nm} ${R.anios[i]}: ${nf(v)} MW</title></circle>`).join('')};
  pl(R.total,C.cafe,'Total');pl(R.limpia,C.nar,'Limpia');
  s+=`<text x="${X(14)-4}" y="${Y(R.total[14])-8}" text-anchor="end" font-size="11" font-weight="700" fill="${C.cafe}">Total ${nf(R.total[14])}</text><text x="${X(14)-4}" y="${Y(R.limpia[14])-8}" text-anchor="end" font-size="11" font-weight="700" fill="${C.nar}">Limpia ${nf(R.limpia[14])}</text>`;
  s+=`<text x="14" y="${H/2}" transform="rotate(-90 14 ${H/2})" text-anchor="middle" font-size="11" fill="${C.txt}">Capacidad instalada (MW)</text></svg>`;
  return s;
}

function modulo4(){
  const el=$('#m4');
  el.innerHTML=`
  <h1>¿Sabías que?</h1>
  <p class="lead">Veinte hallazgos documentados, cinco por tema. Cada uno indica si la cifra es ${tag('oficial','Oficial')}, un ${tag('calculo','Cálculo')} de este atlas o una ${tag('simulacion','Simulación')}, y de qué documento y página sale. Lo que no está en los documentos aparece como <span class="nd">Dato no disponible</span>.</p>
  <div class="filters" role="group" aria-label="Filtrar hallazgos por tema"><span id="m4f"></span><span id="m4c" class="fuente"></span></div>
  <div class="grid" id="m4g" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))"></div>

  <h2 id="reforma">La reforma energética de 2013</h2>
  <p class="lead">Qué cambió en los textos legales entre 2013 y 2025, y qué muestran los datos publicados. Este módulo <b>no atribuye</b> cambios observados a la reforma: describe documentos y cifras por separado.</p>
  <p class="fuente">Términos (pasa el cursor o enfoca): ${['CENACE','MEM','Estricta separación legal','Empresa productiva del Estado','Empresa pública del Estado','Planeación vinculante','Capacidad instalada'].map(def).join(' · ')}.</p>
  <h3>Línea de tiempo</h3>
  <div class="filters" id="m4nv"><span class="fuente">Nivel:</span></div>
  <div class="card"><div id="m4tl" role="tablist" aria-label="Línea de tiempo de la reforma" style="display:flex;gap:6px;flex-wrap:wrap;align-items:stretch;margin-bottom:12px"></div><div id="m4td" aria-live="polite"></div></div>

  <h3>Cambios estructurales documentados</h3>
  <div class="card tw" id="m4ch"></div>

  <h3>Comparación: 2013, 2014 y 2024-2025</h3>
  <div class="card tw" id="m4cp"></div>

  <h3>Capacidad instalada del SEN, 2010 a 2024</h3>
  <div class="card"><div id="m4cap"></div><p class="fuente">${tag('oficial','Oficial')} ${esc(REF_CAP.src)}. Las líneas marcan el decreto de 2013 y las leyes de 2014 solo como referencia cronológica.</p></div>

  <h3>Repercusiones documentadas</h3>
  <div class="grid" id="m4rp" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))"></div>

  <div class="card" style="border-left:5px solid ${C.nar}"><h3 style="margin-top:0">Límites de este análisis</h3><ul id="m4lim"></ul></div>`;

  /* ---- hallazgos ---- */
  let tema='todos';
  $('#m4f').innerHTML=[{id:'todos',n:'Todos (20)'},...SABIAS_TEMAS.map(t=>({id:t.id,n:`${t.n} (${SABIAS.filter(h=>h.tema===t.id).length})`}))].map(t=>`<button class="b${t.id==='todos'?' p':''}" data-t="${t.id}" aria-pressed="${t.id==='todos'}">${t.n}</button>`).join(' ');
  function hall(){
    const L=SABIAS.filter(h=>tema==='todos'||h.tema===tema);
    $('#m4c').textContent=`${L.length} hallazgo${L.length===1?'':'s'}`;
    $('#m4g').innerHTML=L.map(h=>{const T=SABIAS_TEMAS.find(t=>t.id===h.tema);
      return `<article class="card" style="border-top:5px solid ${T.c}"><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><span class="fuente" style="margin:0">${h.id}/20 · ${esc(T.n)}</span>${tag(h.tag,TAGN[h.tag])}</div>
       <h3 style="margin:.4em 0">${esc(h.t)}</h3>
       <div style="font-family:Fraunces,Georgia,serif;font-size:1.7rem;font-weight:700;color:${C.cafe};line-height:1.1">${esc(h.dato)}</div><div class="fuente" style="margin:0 0 8px">${esc(h.datoL)}</div>
       <p>${nd(esc(h.txt))}</p>
       <details><summary>Fuentes y límites</summary><ul class="fuente">${h.src.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p class="nota">${nd(esc(h.nota))}</p></details></article>`}).join('');
  }
  $('#m4f').onclick=e=>{const b=e.target.closest('button');if(!b)return;tema=b.dataset.t;document.querySelectorAll('#m4f button').forEach(x=>{const on=x===b;x.classList.toggle('p',on);x.setAttribute('aria-pressed',on)});hall()};
  hall();

  /* ---- línea de tiempo ---- */
  const niveles=['Todos',...new Set(REF_LINEA.map(x=>x.nivel))];let nivel='Todos',sel='a';
  $('#m4nv').insertAdjacentHTML('beforeend',niveles.map(n=>`<button class="b${n==='Todos'?' p':''}" data-n="${esc(n)}">${esc(n)}</button>`).join(' '));
  function tl(){
    const L=REF_LINEA.filter(x=>nivel==='Todos'||x.nivel===nivel);
    if(!L.find(x=>x.id===sel))sel=L[0].id;
    $('#m4tl').innerHTML=L.map(x=>`<button role="tab" class="b${x.id===sel?' p':''}" data-id="${x.id}" aria-selected="${x.id===sel}" style="flex:1 1 130px;text-align:left"><b>${esc(x.f)}</b><br><span style="font-weight:400;font-size:.85em">${esc(x.nivel)}</span></button>`).join('');
    const x=REF_LINEA.find(y=>y.id===sel);
    $('#m4td').innerHTML=`<h3 style="margin-top:0">${esc(x.f)} · ${esc(x.t)}</h3><p>${esc(x.txt)}</p><p class="fuente">${tag('oficial','Oficial')} ${esc(x.src)}</p>`;
  }
  $('#m4nv').onclick=e=>{const b=e.target.closest('button');if(!b)return;nivel=b.dataset.n;document.querySelectorAll('#m4nv button').forEach(x=>x.classList.toggle('p',x===b));tl()};
  $('#m4tl').onclick=e=>{const b=e.target.closest('button');if(!b)return;sel=b.dataset.id;tl()};
  tl();

  /* ---- cambios, comparación, repercusiones ---- */
  $('#m4ch').innerHTML=`<table><thead><tr><th>Tema</th><th>2013</th><th>2014</th><th>2024-2025</th></tr></thead><tbody>${REF_CAMBIOS.map(c=>`<tr><td><b>${esc(c.t)}</b></td><td>${nd(esc(cap(c.a.replace(/^2013: /,''))))}</td><td>${nd(esc(cap(c.b.replace(/^2014: /,''))))}</td><td>${nd(esc(cap(c.c.replace(/^2024-2025: |^2025: /,''))))}</td></tr>`).join('')}</tbody></table><p class="fuente">${tag('oficial','Oficial')} Fuentes por fila: ${REF_CAMBIOS.map(c=>esc(c.t)+': '+esc(c.src)).join('. ')}.</p>`;
  $('#m4cp').innerHTML=`<table><thead><tr><th>Concepto</th><th>2013</th><th>2014</th><th>2024-2025</th><th>Fuente</th></tr></thead><tbody>${REF_COMP.map(r=>`<tr><td><b>${esc(r.k)}</b></td><td>${nd(esc(r.a))}</td><td>${nd(esc(r.b))}</td><td>${nd(esc(r.c))}${r.cx?`<div class="fuente">${nd(esc(r.cx))}</div>`:''}</td><td class="fuente">${esc(r.src)}</td></tr>`).join('')}</tbody></table><p class="fuente">Las cifras de 2013 y 2014 son las del año calendario respectivo (Tabla 2.1). Entre una y otra puede haber cambios de cobertura de la serie, que el documento no detalla.</p>`;
  $('#m4cap').innerHTML=capChart();
  $('#m4rp').innerHTML=REF_REP.map(r=>`<article class="card"><span class="fuente" style="margin:0">Repercusión ${r.id}/6</span><h3 style="margin:.3em 0">${esc(r.t)}</h3><p><b>Qué muestra:</b> ${nd(esc(r.muestra))}</p><p><b>Qué no permite concluir:</b> ${nd(esc(r.noconcluye))}</p><p class="fuente">${tag('oficial','Oficial')} ${esc(r.src)}</p></article>`).join('');
  $('#m4lim').innerHTML=REF_LIM.map(t=>`<li>${nd(esc(t))}</li>`).join('');
}
modulo4();
})();

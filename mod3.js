'use strict';
/* Módulo 3: Distribución eléctrica */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const C={cafe:'#7C2D12',teja:'#9A3412',nar:'#F97316',amb:'#FBBF24',txt:'#3A1608'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf=(n,d=0)=>Number(n).toLocaleString('es-MX',{minimumFractionDigits:d,maximumFractionDigits:d});
const ND='<span class="nd">Dato no disponible</span>';
const tip=t=>`<span class="def" tabindex="0" data-tip="${esc(GLOSARIO[t])}">${esc(t)}</span>`;
const tag=(k,t)=>`<span class="tag t-${k}">${t}</span>`;
const SRC3='CFE Distribución, Programa de Ampliación y Modernización de las RGD 2025-2039';

/* ---- transformador ideal ---- */
function trCalc(Vp_kV,Np,Ns,S_kVA,mode){
  const k=mode==='3f'?Math.sqrt(3):1,Vp=Vp_kV*1000,a=Np/Ns,Vs=Vp/a,S=S_kVA*1000;
  const Ip=S/(k*Vp),Is=S/(k*Vs);
  return {a,Vp,Vs,Ip,Is,Sin:k*Vp*Ip,Sout:k*Vs*Is};
}
window.trCalc=trCalc;

/* ---- gráficas ---- */
function bars(rows,o={}){
  const W=720,lw=o.lw||170,rh=o.rh||24,h=rows.length*rh+10,max=o.max||Math.max(...rows.map(r=>r.v),1),sc=(W-lw-(o.rm||130))/max;
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img" aria-label="${esc(o.aria||'Gráfica')}">`;
  rows.forEach((r,i)=>{const y=5+i*rh,w=Math.max(r.v*sc,1);
    s+=`<text x="${lw-6}" y="${y+13}" text-anchor="end" font-size="12" fill="${C.txt}">${esc(r.l)}</text><rect x="${lw}" y="${y}" width="${w}" height="${rh-7}" rx="3" fill="${r.c||C.amb}" stroke="${C.cafe}" stroke-width="${r.sel?2.2:.5}"><title>${esc(r.l)}: ${esc(r.t)}</title></rect><text x="${lw+w+5}" y="${y+13}" font-size="12" fill="${C.txt}">${esc(r.t)}</text>`});
  return s+'</svg>';
}
function line(series,o){
  const W=360,H=250,m={l:60,r:14,t:16,b:42};
  const xs=series.flatMap(s=>s.pts.map(p=>p[0])),x0=Math.min(...xs),x1=Math.max(...xs);
  const ys=series.flatMap(s=>s.pts.map(p=>p[1])),y1=Math.max(...ys)*1.08;
  const X=x=>m.l+(Math.log10(x)-Math.log10(x0))/(Math.log10(x1)-Math.log10(x0))*(W-m.l-m.r),Y=y=>H-m.b-(y/y1)*(H-m.t-m.b);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(o.aria)}">`;
  for(let i=0;i<=4;i++){const v=y1*i/4;s+=`<line x1="${m.l}" x2="${W-m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#EBD3AE"/><text x="${m.l-6}" y="${Y(v)+4}" text-anchor="end" font-size="10" fill="${C.txt}">${nf(v,o.dy||0)}</text>`}
  [0.1,1,10,100,1000,10000,100000].forEach(v=>{if(v>=x0&&v<=x1)s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${m.t}" y2="${H-m.b}" stroke="#EBD3AE"/><text x="${X(v)}" y="${H-m.b+14}" text-anchor="middle" font-size="10" fill="${C.txt}">${v}</text>`});
  series.forEach(se=>{s+=`<polyline fill="none" stroke="${se.c}" stroke-width="2.5" ${se.dash?'stroke-dasharray="6 4"':''} points="${se.pts.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' ')}"/>`;
    if(se.cur&&se.cur[0]>=x0&&se.cur[0]<=x1)s+=`<circle cx="${X(se.cur[0])}" cy="${Y(Math.min(se.cur[1],y1))}" r="6" fill="${se.c}" stroke="#fff" stroke-width="2"><title>${esc(se.name)}: ${nf(se.cur[1],o.dy||0)} ${o.u}</title></circle>`});
  s+=`<text x="${(m.l+W-m.r)/2}" y="${H-4}" text-anchor="middle" font-size="11" fill="${C.txt}">Relación de espiras a = Np/Ns (escala logarítmica)</text><text x="12" y="${H/2}" transform="rotate(-90 12 ${H/2})" text-anchor="middle" font-size="11" fill="${C.txt}">${esc(o.yl)}</text>`;
  s+=series.map((se,i)=>`<text x="${m.l+8}" y="${m.t+12+i*14}" font-size="11" fill="${se.c}" font-weight="700">${se.dash?'- - ':'—— '}${esc(se.name)}</text>`).join('');
  return s+'</svg>';
}
function color(t){ // 0..1 de ámbar a café
  const a=[251,191,36],b=[124,45,18],c=a.map((v,i)=>Math.round(v+(b[i]-v)*t));return `rgb(${c})`;
}

/* ---- indicadores de la división ---- */
const IND={
 svc:{n:'Servicios de suministro (miles)',years:[2012,2024],v:(d,y)=>d[y===2012?'s12':'s24'][4],f:v=>nf(v)+' mil',nat:y=>DIV_NAC[y===2012?'s12':'s24'][4],src:'Tabla III.1, pdf-p15/16'},
 km:{n:'Longitud de líneas de media tensión (km)',years:[2012,2024],v:(d,y)=>d[y===2012?'s12':'s24'][2],f:v=>nf(v)+' km',nat:y=>DIV_NAC[y===2012?'s12':'s24'][2],src:'Tabla III.1, pdf-p15/16'},
 ventas:{n:'Ventas de energía (GWh)',years:[2012,2024],v:(d,y)=>d[y===2012?'s12':'s24'][5],f:v=>nf(v)+' GWh',nat:y=>DIV_NAC[y===2012?'s12':'s24'][5],src:'Tabla III.1, pdf-p15/16'},
 pt:{n:'Pérdidas técnicas (%)',years:[2023,2024],v:(d,y)=>d.pt[y-2023],f:v=>nf(v,2)+' %',nat:y=>DIV_NAC.pt[y-2023],src:'Tabla V.5, pdf-p37 (datos preliminares)'},
 pn:{n:'Pérdidas no técnicas (%)',years:[2023,2024],v:(d,y)=>d.pn[y-2023],f:v=>nf(v,2)+' %',nat:y=>DIV_NAC.pn[y-2023],src:'Tabla V.5, pdf-p37 (datos preliminares)'},
 saidi:{n:'SAIDID, duración promedio de interrupciones (min por usuario)',years:[2023,2024],v:(d,y)=>d.saidi[y-2023],f:v=>nf(v,2)+' min',nat:y=>DIV_NAC.saidi[y-2023],src:'Tabla V.1, pdf-p28'},
 saifi:{n:'SAIFID, frecuencia promedio de interrupciones (por usuario)',years:[2023,2024],v:(d,y)=>d.saifi[y-2023],f:v=>nf(v,2),nat:y=>DIV_NAC.saifi[y-2023],src:'Tabla V.1, pdf-p28'},
 gd:{n:'Índice de incorporación de generación distribuida (%)',years:[2024],v:(d,y)=>y===2024?d.gdi:null,f:v=>nf(v,2)+' %',nat:y=>y===2024?DIV_NAC.gdi:null,src:'Tabla X.2, pdf-p83'}
};

function modulo3(){
  const el=$('#m3');
  el.innerHTML=`
  <h1>Distribución eléctrica</h1>
  <p class="lead">La distribución lleva la energía de las subestaciones a los usuarios. En México la opera CFE Distribución con <b>16 divisiones</b> y 150 zonas de distribución. Cada cifra de esta sección corresponde a la división indicada; los totales nacionales se muestran aparte y no se atribuyen a ninguna división.</p>
  <p class="fuente">Términos (pasa el cursor o enfoca): ${['RGD','SAIDID','SAIFID','CAIDID','Pérdidas no técnicas','Servicio de suministro','Transformador ideal','Relación de espiras','MVA','kV'].filter(t=>GLOSARIO[t]).map(tip).join(' · ')}.</p>
  <div class="filters"><label>Indicador <select id="m3i">${Object.keys(IND).map(k=>`<option value="${k}">${IND[k].n}</option>`).join('')}</select></label>
   <label>Año <select id="m3y"></select></label>
   <label>División <select id="m3d"><option value="0">Todas</option>${DIV.map(d=>`<option value="${d.id}">${d.id}. ${d.n}</option>`).join('')}</select></label>
   <button class="b" id="m3r">Restablecer</button></div>

  <h2>Mapa de divisiones de distribución</h2>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))">
   <div class="card"><div id="m3map"></div><div id="m3leg"></div>
    <p class="fuente">${tag('oficial','Oficial')} Figura III.1 “Divisiones de Distribución de CFE Distribución”, ${esc(SRC3)}, pdf-p14 (imagen reproducida del documento). Los círculos numerados se colocaron sobre los números de la figura y se colorean según el indicador elegido. No se redibujaron las fronteras ni se asignaron estados a divisiones: el documento solo ofrece este mapa, y los límites de las divisiones cruzan los de algunos estados.</p></div>
   <div class="card" id="m3ficha" aria-live="polite"></div></div>

  <h2>Indicadores</h2>
  <div class="grid" id="m3kpi"></div>
  <h3 id="m3t1"></h3>
  <div class="card"><div id="m3g1"></div><p class="fuente" id="m3f1"></p></div>
  <h3>Usuarios y red de media tensión, 2012 y 2024</h3>
  <div class="card tw" id="m3tab"></div>
  <h3>Pérdidas y continuidad por división, 2024</h3>
  <div class="card tw" id="m3tab2"></div>

  <h2>Simulador de transformador ideal</h2>
  <p class="lead">Calcula la tensión y la corriente del secundario de un transformador ideal. ${tag('simulacion','Simulación')} Los valores iniciales son un ejemplo didáctico, no un transformador real de CFE.</p>
  <div class="card"><div class="filters">
   <label>Conexión <select id="tM"><option value="1f">Monofásico</option><option value="3f">Trifásico (tensiones de línea)</option></select></label>
   <label>Tensión primaria Vp (kV) <input id="tV" type="number" min="0.1" step="any" value="13.8" style="width:90px"></label>
   <label>Espiras primario Np <input id="tNp" type="number" min="1" step="any" value="6000" style="width:90px"></label>
   <label>Espiras secundario Ns <input id="tNs" type="number" min="1" step="any" value="100" style="width:90px"></label>
   <label>Potencia aparente S (kVA) <input id="tS" type="number" min="0.1" step="any" value="75" style="width:90px"></label>
   <button class="b" id="tR">Valores por defecto</button></div>
   <p id="tMsg" role="alert" style="color:#9A3412;font-weight:700"></p>
   <div class="grid" id="tOut"></div><p class="nota" id="tNota"></p></div>
  <div class="grid" style="margin-top:12px"><div class="card"><h3 style="margin-top:0">Tensión del secundario frente a la relación de espiras</h3><div id="tG1"></div></div>
   <div class="card"><h3 style="margin-top:0">Corrientes frente a la relación de espiras</h3><div id="tG2"></div></div></div>
  <div class="card"><h3 style="margin-top:0">Transformadores reales de CFE Distribución (2024)</h3><div id="tReal"></div></div>
  <div class="card"><h3 style="margin-top:0">Supuestos del transformador ideal</h3>
   <p><b>Ecuaciones:</b> V<sub>p</sub> / V<sub>s</sub> = N<sub>p</sub> / N<sub>s</sub> y V<sub>p</sub> · I<sub>p</sub> = V<sub>s</sub> · I<sub>s</sub>. En trifásico, con tensiones y corrientes de línea, la potencia aparente es S = √3 · V · I en cada lado; la relación de tensiones de línea sigue la relación de espiras por fase en las conexiones que la conservan (aquí se supone que a es la relación de tensiones de línea).</p>
   <ul><li>Sin pérdidas: no hay pérdidas en el cobre ni en el núcleo, así que la potencia aparente de entrada es igual a la de salida.</li>
   <li>Sin flujo de dispersión y con núcleo de permeabilidad infinita: no hay corriente de magnetización ni caída interna de tensión.</li>
   <li>Régimen senoidal permanente y comportamiento lineal, sin saturación.</li>
   <li>Unidades: tensión en kV en la entrada y en V en los resultados; corrientes en A; potencia en kVA. Se convierten internamente a V, A y VA.</li>
   <li>En un transformador real hay pérdidas y regulación de tensión. CFE reporta pérdidas técnicas en transformadores de media a baja tensión (ver arriba).</li></ul></div>`;

  const st={i:'svc',y:2024,d:0};
  function fillYears(){
    const ys=IND[st.i].years;if(!ys.includes(st.y))st.y=ys[ys.length-1];
    $('#m3y').innerHTML=[...ys].reverse().map(y=>`<option${y===st.y?' selected':''}>${y}</option>`).join('');
  }
  function map(){
    const I=IND[st.i],vals=DIV.map(d=>I.v(d,st.y)),ok=vals.filter(v=>v!=null),mn=Math.min(...ok),mx=Math.max(...ok);
    let s=`<svg viewBox="0 0 970 800" width="100%" role="group" aria-label="Mapa de las 16 divisiones de distribución de CFE"><image href="img/divisiones.png" x="0" y="0" width="970" height="800"/>`;
    DIV.forEach((d,i)=>{const v=vals[i],t=v==null?0:(mx>mn?(v-mn)/(mx-mn):0.5),sel=st.d===d.id,dim=st.d&&!sel;
      s+=`<g data-d="${d.id}" tabindex="0" role="button" aria-label="${esc(d.n)}" style="cursor:pointer" opacity="${dim?.35:1}">
       <circle cx="${d.hx}" cy="${d.hy}" r="${sel?21:17}" fill="${v==null?'#B9A99A':color(t)}" stroke="${sel?C.nar:'#fff'}" stroke-width="${sel?4:2.5}"/>
       <text x="${d.hx}" y="${d.hy+5}" text-anchor="middle" font-size="14" font-weight="700" fill="${t>.55&&v!=null?'#fff':C.txt}">${d.id}</text>
       <title>${esc(d.n)}: ${v==null?'Dato no disponible':I.f(v)}</title></g>`});
    $('#m3map').innerHTML=s+'</svg>';
    $('#m3leg').innerHTML=`<div class="legend"><span><i style="background:${color(0)};border:1px solid ${C.cafe}"></i>menor valor: ${I.f(mn)}</span><span><i style="background:${color(1)};border:1px solid ${C.cafe}"></i>mayor valor: ${I.f(mx)}</span><span>${esc(I.n)}, ${st.y}</span></div>`;
    document.querySelectorAll('#m3map [data-d]').forEach(g=>{const f=()=>{st.d=Number(g.dataset.d);$('#m3d').value=st.d;all()};g.onclick=f;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}}});
  }
  function ficha(){
    const f=$('#m3ficha');
    if(!st.d){f.innerHTML=`<h3 style="margin-top:0">16 divisiones, 150 zonas</h3><p>CFE Distribución atiende a <b>${nf(DIV_NAC.s24[4]/1000,1)} millones de servicios</b> con 555,336 km de líneas de media tensión y 345,966 km de baja tensión. Selecciona una división en el mapa para ver sus datos.</p><p class="fuente">${tag('oficial','Oficial')} ${esc(SRC3)}, Tablas III.1 y III.3 (pdf-p15/16) e Informe Anual 2024, pdf-p100. “Servicio” equivale a una acometida con contrato; CFE lo reporta como número de servicios o usuarios.</p>`;return}
    const d=DIV.find(x=>x.id===st.d),b=d.s24,a=d.s12;
    const row=(l,v,t)=>`<tr><td>${l}</td><td>${v}</td></tr>`;
    f.innerHTML=`<h3 style="margin-top:0">${d.id}. ${esc(d.n)}</h3>
     <table><tbody>
      ${row('Servicios 2024',nf(b[4])+' mil (2012: '+nf(a[4])+' mil; crecimiento anual publicado '+nf(d.svcGrowth,2)+' %)')}
      ${row('Líneas de media tensión 2024',nf(b[2])+' km ('+nf(b[1])+' circuitos)')}
      ${row('Subestaciones AT/MT',nf(b[0])+' MVA')}
      ${row('Redes de distribución',nf(b[3])+' MVA')}
      ${row('Ventas de energía 2024',nf(b[5])+' GWh')}
      ${row('Pérdidas técnicas 2024',nf(d.pt[1],2)+' % (2023: '+nf(d.pt[0],2)+' %)')}
      ${row('Pérdidas no técnicas 2024',nf(d.pn[1],2)+' % (2023: '+nf(d.pn[0],2)+' %)')}
      ${row('SAIDID 2024',nf(d.saidi[1],2)+' min por usuario (2023: '+nf(d.saidi[0],2)+')')}
      ${row('SAIFID 2024',nf(d.saifi[1],2)+' interrupciones por usuario')}
      ${row('Generación distribuida 2024',nf(d.gdm)+' MVA instalados; índice '+nf(d.gdi,2)+' %')}
      ${row('Usuarios por km de línea de MT '+tag('calculo','Cálculo'),nf(b[4]*1000/b[2],1))}
      ${row('Ventas por servicio '+tag('calculo','Cálculo'),nf(b[5]*1000/b[4],0)+' kWh al año')}
     </tbody></table>
     <p class="fuente">${tag('oficial','Oficial')} ${esc(SRC3)}: Tabla III.1 (pdf-p15/16), Tabla V.5 (pdf-p37, datos preliminares), Tabla V.1 (pdf-p28) y Tabla X.2 (pdf-p83). Datos propios de esta división; no son promedios nacionales.</p>`;
  }
  function kpis(){
    const k=[['Servicios atendidos',nf(DIV_NAC.s24[4]/1000,1)+' millones','Nacional, 2024. Tabla III.1 e Informe Anual 2024 pdf-p98'],['Líneas de media tensión',nf(DIV_NAC.s24[2])+' km','2.4 a 34.5 kV. Tabla III.3, pdf-p16'],['Líneas de baja tensión',nf(DIV_INFRA.kmBT)+' km','Tabla III.3, pdf-p16'],['Pérdidas técnicas / no técnicas',nf(DIV_NAC.pt[1],2)+' % / '+nf(DIV_NAC.pn[1],2)+' %','Nacional (RGD), 2024, preliminar. Tabla V.5'],['SAIDID nacional',nf(DIV_NAC.saidi[1],2)+' min','Minutos por usuario al año, 2024. Tabla V.1']];
    $('#m3kpi').innerHTML=k.map(x=>`<div class="card kpi">${tag('oficial','Oficial · CFE')}<b>${x[1]}</b>${x[0]}<div class="fuente">${x[2]}</div></div>`).join('');
  }
  function charts(){
    const I=IND[st.i],rows=DIV.map(d=>({l:`${d.id}. ${d.n}`,v:I.v(d,st.y),id:d.id})).filter(r=>r.v!=null).sort((a,b)=>b.v-a.v);
    $('#m3t1').textContent=`${I.n}, ${st.y}`;
    const nat=I.nat(st.y);
    $('#m3g1').innerHTML=bars(rows.map(r=>({l:r.l,v:r.v,c:C.amb,sel:r.id===st.d,t:I.f(r.v)})),{max:Math.max(...rows.map(r=>r.v)),aria:I.n});
    $('#m3f1').innerHTML=`${tag('oficial','Oficial')} ${esc(SRC3)}, ${I.src}. ${nat!=null?`Referencia nacional (no es de ninguna división): ${I.f(nat)}.`:''} ${st.i==='pt'||st.i==='pn'?'Datos preliminares. La RGD considera en la energía recibida las pérdidas de los transformadores de alta a media tensión.':''}${st.i==='saidi'||st.i==='saifi'?' Índices de confiabilidad que CFE evalúa sobre los circuitos de media tensión (RGD pdf-p27): SAIDID en minutos por usuario, SAIFID en interrupciones por usuario y CAIDID en minutos por interrupción.':''}`;
    const t=(k)=>DIV.map(d=>`<tr><td>${d.id}. ${d.n}</td><td>${nf(d.s12[4])}</td><td>${nf(d.s24[4])}</td><td>${nf(d.svcGrowth,2)} %</td><td>${nf(d.s12[2])}</td><td>${nf(d.s24[2])}</td></tr>`).join('');
    $('#m3tab').innerHTML=`<table><thead><tr><th>División</th><th>Servicios 2012 (miles)</th><th>Servicios 2024 (miles)</th><th>Crec. anual servicios</th><th>Líneas MT 2012 (km)</th><th>Líneas MT 2024 (km)</th></tr></thead><tbody>${t()}<tr><td><b>Total nacional</b></td><td><b>${nf(DIV_NAC.s12[4])}</b></td><td><b>${nf(DIV_NAC.s24[4])}</b></td><td><b>2.76 %</b></td><td><b>${nf(DIV_NAC.s12[2])}</b></td><td><b>${nf(DIV_NAC.s24[2])}</b></td></tr></tbody></table><p class="fuente">${tag('oficial','Oficial')} ${esc(SRC3)}, Tabla III.1, pdf-p15/16. El crecimiento anual es el publicado por CFE. Nota de consistencia: con 36,400 mil servicios en 2012 y 49,101 mil en 2024, el 2.76 % publicado corresponde a 11 periodos de capitalización; con los 12 años entre 2012 y 2024 la tasa sería 2.53 % (cálculo). El documento no explica la diferencia.</p>`;
    $('#m3tab2').innerHTML=`<table><thead><tr><th>División</th><th>Pérd. técnicas (%)</th><th>Pérd. no técnicas (%)</th><th>SAIDID (min/usuario)</th><th>SAIFID</th><th>CAIDID (min/interrupción)</th></tr></thead><tbody>${DIV.map(d=>`<tr style="${st.d===d.id?'background:#FFE6BC':''}"><td>${d.id}. ${d.n}</td><td>${nf(d.pt[1],2)}</td><td>${nf(d.pn[1],2)}</td><td>${nf(d.saidi[1],2)}</td><td>${nf(d.saifi[1],2)}</td><td>${nf(d.caidi[1],2)}</td></tr>`).join('')}<tr><td><b>Nacional</b></td><td><b>${DIV_NAC.pt[1]}</b></td><td><b>${DIV_NAC.pn[1]}</b></td><td><b>${DIV_NAC.saidi[1]}</b></td><td><b>${DIV_NAC.saifi[1]}</b></td><td><b>${DIV_NAC.caidi[1]}</b></td></tr></tbody></table>
     <p class="fuente">${tag('oficial','Oficial')} Tablas V.5 (pdf-p37) y V.1 (pdf-p28), datos preliminares 2024. <b>Nota de consistencia:</b> la suma de pérdidas técnicas y no técnicas nacionales de esta tabla (${nf(DIV_NAC.pt[1]+DIV_NAC.pn[1],2)} %) no es igual al 12.88 % de pérdidas MT + BT del Informe Anual 2024 (pdf-p99) ni al 10.69 % que incluye alta tensión: las bases de cálculo son distintas y los documentos no las concilian.</p>`;
  }
  /* simulador transformador */
  function sim(){
    const V=parseFloat($('#tV').value),Np=parseFloat($('#tNp').value),Ns=parseFloat($('#tNs').value),S=parseFloat($('#tS').value),mode=$('#tM').value;
    const bad=!(V>0&&Np>0&&Ns>0&&S>0);$('#tMsg').textContent=bad?'Todos los datos deben ser positivos.':'';
    if(bad){$('#tOut').innerHTML='';return}
    const r=trCalc(V,Np,Ns,S,mode);
    $('#tOut').innerHTML=[['Relación a = Np/Ns',nf(r.a,r.a<0.1?4:2)],['Tensión secundaria Vs',r.Vs>=1000?nf(r.Vs/1000,3)+' kV':nf(r.Vs,1)+' V'],['Corriente primaria Ip',nf(r.Ip,2)+' A'],['Corriente secundaria Is',nf(r.Is,2)+' A'],['Potencia entrada / salida',nf(r.Sin/1000,2)+' kVA / '+nf(r.Sout/1000,2)+' kVA']].map(x=>`<div class="card kpi">${tag('simulacion','Simulación')}<b>${x[1]}</b>${x[0]}</div>`).join('');
    $('#tNota').innerHTML=`${r.a>1?'Transformador reductor (Vs < Vp): la corriente del secundario es mayor.':r.a<1?'Transformador elevador (Vs > Vp): la corriente del secundario es menor.':'Relación 1:1.'} Verificación: Vp·Ip = Vs·Is = ${nf(r.Sin/1000,2)} kVA ${mode==='3f'?'(con el factor √3)':''}; Is/Ip = ${nf(r.Is/r.Ip,2)} = a.`;
    const lo=Math.min(0.3,r.a/3),hi=Math.max(200,r.a*3),pts=n=>{const a=[];for(let e=0;e<=60;e++)a.push(lo*Math.pow(hi/lo,e/60));return a};
    const as=pts();
    $('#tG1').innerHTML=line([{name:'Vs (V)',c:C.cafe,pts:as.map(a=>[a,V*1000/a]),cur:[r.a,r.Vs]}],{aria:'Tensión del secundario frente a la relación de espiras',yl:'Vs (V)',u:'V'});
    $('#tG2').innerHTML=line([{name:'Is (A)',c:C.nar,pts:as.map(a=>[a,trCalc(V,a,1,S,mode).Is]),cur:[r.a,r.Is]},{name:'Ip (A)',c:C.cafe,dash:true,pts:as.map(a=>[a,r.Ip]),cur:[r.a,r.Ip]}],{aria:'Corrientes primaria y secundaria frente a la relación de espiras',yl:'Corriente (A)',u:'A',dy:0});
  }
  function real(){
    const t=DIV_INFRA;
    $('#tReal').innerHTML=`<table><thead><tr><th>Tipo</th><th>Número</th><th>Capacidad</th><th>Capacidad media (cálculo)</th></tr></thead><tbody>
     <tr><td>Transformadores de potencia (alta a media tensión)</td><td>${nf(t.trafosPotencia.n)}</td><td>${nf(t.trafosPotencia.mva)} MVA</td><td>${nf(t.trafosPotencia.mva/t.trafosPotencia.n,1)} MVA</td></tr>
     <tr><td>Transformadores de distribución (media a baja tensión)</td><td>${nf(t.trafosDistribucion.n)}</td><td>${nf(t.trafosDistribucion.mva)} MVA</td><td>${nf(t.trafosDistribucion.mva/t.trafosDistribucion.n*1000,1)} kVA</td></tr></tbody></table>
     <p class="fuente">${tag('oficial','Oficial')} ${esc(SRC3)}, Tabla III.2, pdf-p16 (el Informe Anual 2024, pdf-p100, da 81,284 MVA para los de potencia; diferencia de 1 MVA). La capacidad media es ${tag('calculo','Cálculo')}; los transformadores individuales varían.</p>
     <p>Pérdidas técnicas de 2024 en transformadores de media a baja tensión: <b>${nf(t.perdTWh.trMtBt,3)} TWh</b> de ${nf(t.perdTWh.total,3)} TWh de pérdidas técnicas totales de las RGD, es decir ${nf(t.perdTWh.trMtBt/t.perdTWh.total*100,1)} % ${tag('calculo','Cálculo')} (Tabla V.4, pdf-p37, datos preliminares). Un transformador ideal no tiene esas pérdidas.</p>`;
  }
  function all(){map();ficha();charts()}
  $('#m3i').onchange=e=>{st.i=e.target.value;fillYears();all()};
  $('#m3y').onchange=e=>{st.y=Number(e.target.value);all()};
  $('#m3d').onchange=e=>{st.d=Number(e.target.value);all()};
  $('#m3r').onclick=()=>{st.i='svc';st.y=2024;st.d=0;$('#m3i').value='svc';$('#m3d').value='0';fillYears();all()};
  ['tV','tNp','tNs','tS','tM'].forEach(i=>$('#'+i).addEventListener('input',sim));
  $('#tR').onclick=()=>{$('#tV').value=13.8;$('#tNp').value=6000;$('#tNs').value=100;$('#tS').value=75;$('#tM').value='1f';sim()};
  fillYears();kpis();real();all();sim();
}
modulo3();
})();

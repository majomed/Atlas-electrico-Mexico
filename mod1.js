'use strict';
/* Módulo 1: Generación eléctrica */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const C={cafe:'#7C2D12',teja:'#9A3412',nar:'#F97316',amb:'#FBBF24',txt:'#3A1608'};
const YR=[2022,2023,2024],YC={2022:'#FBBF24',2023:'#F97316',2024:'#7C2D12'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf=(n,d=0)=>Number(n).toLocaleString('es-MX',{minimumFractionDigits:d,maximumFractionDigits:d});
const ND='<span class="nd">Dato no disponible</span>';
const tip=t=>`<span class="def" tabindex="0" data-tip="${esc(GLOSARIO[t])}">${esc(t)}</span>`;
const tag=(k,t)=>`<span class="tag t-${k}">${t}</span>`;
const SH={'Hidroeléctrica':'circle','Geotérmica':'tri','Solar fotovoltaica':'diamond','Eólica':'square','Nuclear':'hex'};
const TCOL={'Hidroeléctrica':C.cafe,'Geotérmica':C.teja,'Solar fotovoltaica':C.amb,'Eólica':C.nar,'Nuclear':C.txt};
const grp=t=>GRUPO_TEC[t];
const sumG=(t,i)=>GEN_CFE[t][i];

function shape(kind,x,y,r,fill,extra=''){
  const st=`fill="${fill}" stroke="#fff" stroke-width="1.5" ${extra}`;
  if(kind==='circle')return `<circle cx="${x}" cy="${y}" r="${r}" ${st}/>`;
  if(kind==='square')return `<rect x="${x-r}" y="${y-r}" width="${2*r}" height="${2*r}" ${st}/>`;
  if(kind==='diamond')return `<polygon points="${x},${y-r*1.3} ${x+r*1.3},${y} ${x},${y+r*1.3} ${x-r*1.3},${y}" ${st}/>`;
  if(kind==='tri')return `<polygon points="${x},${y-r*1.3} ${x+r*1.2},${y+r} ${x-r*1.2},${y+r}" ${st}/>`;
  const p=[0,1,2,3,4,5].map(i=>`${x+r*1.2*Math.cos(Math.PI/3*i)},${y+r*1.2*Math.sin(Math.PI/3*i)}`).join(' ');
  return `<polygon points="${p}" ${st}/>`;
}
function hbars(rows,o={}){
  const W=720,lw=o.lw||190,rh=o.rh||24,h=rows.length*rh+14,max=o.max||Math.max(...rows.map(r=>r.v)),sc=(W-lw-(o.rm||110))/max;
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img" aria-label="${esc(o.aria||'Gráfica')}">`;
  rows.forEach((r,i)=>{const y=6+i*rh,w=Math.max(r.v*sc,1);
    s+=`<text x="${lw-6}" y="${y+13}" text-anchor="end" font-size="12" fill="${C.txt}">${esc(r.l)}</text><rect x="${lw}" y="${y}" width="${w}" height="${rh-7}" rx="3" fill="${r.c}" stroke="${C.cafe}" stroke-width=".6"><title>${esc(r.l)}: ${esc(r.t)}</title></rect><text x="${lw+w+5}" y="${y+13}" font-size="12" fill="${C.txt}">${esc(r.t)}</text>`});
  return s+'</svg>';
}
function leg(items){return '<div class="legend">'+items.map(i=>`<span><i style="background:${i[1]};border:1px solid ${C.cafe}"></i>${i[0]}</span>`).join('')+'</div>'}
function gbars(cats,get,o={}){ // cats: nombres; get(cat,i)=valor|null; años 3 barras
  const W=720,lw=170,gh=3*15+10,h=cats.length*gh+10,vals=cats.flatMap(c=>YR.map((y,i)=>get(c,i)).filter(v=>v!=null)),max=Math.max(...vals,1),sc=(W-lw-100)/max;
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img" aria-label="${esc(o.aria||'Gráfica')}">`;
  cats.forEach((c,ci)=>{const y0=6+ci*gh;
    s+=`<text x="${lw-6}" y="${y0+24}" text-anchor="end" font-size="12" fill="${C.txt}">${esc(c)}</text>`;
    YR.forEach((y,i)=>{const v=get(c,i),yy=y0+i*15;
      if(v==null){s+=`<text x="${lw+4}" y="${yy+11}" font-size="11" fill="#7A5A4A" font-style="italic">${y}: Dato no disponible</text>`;return}
      const w=Math.max(v*sc,1),sel=(o.sel===y);
      s+=`<rect x="${lw}" y="${yy}" width="${w}" height="12" rx="2" fill="${YC[y]}" stroke="${C.cafe}" stroke-width="${sel?1.6:.5}"><title>${esc(c)} ${y}: ${nf(v,o.d||0)} ${o.u||''}</title></rect><text x="${lw+w+5}" y="${yy+10}" font-size="11" fill="${C.txt}">${nf(v,o.d||0)}</text>`})});
  return s+'</svg>'+leg(YR.map(y=>[String(y),YC[y]]));
}
function divbars(rows,o={}){ // valores +/-
  const W=720,lw=190,rh=24,h=rows.length*rh+30,vs=rows.map(r=>r.v),mn=Math.max(0,-Math.min(...vs)),mp=Math.max(0,Math.max(...vs)),sc2=(W-lw-260)/((mn+mp)||1),zx=lw+80+mn*sc2;
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img" aria-label="${esc(o.aria||'Variación')}"><line x1="${zx}" x2="${zx}" y1="2" y2="${h-22}" stroke="${C.cafe}"/>`;
  rows.forEach((r,i)=>{const y=6+i*rh,w=Math.abs(r.v)*sc2,x=r.v>=0?zx:zx-w;
    s+=`<text x="${lw-6}" y="${y+13}" text-anchor="end" font-size="12" fill="${C.txt}">${esc(r.l)}</text><rect x="${x}" y="${y}" width="${Math.max(w,1)}" height="${rh-7}" rx="3" fill="${r.v>=0?C.nar:C.cafe}"><title>${esc(r.l)}: ${r.v>0?'+':''}${nf(r.v,1)} %</title></rect><text x="${r.v>=0?zx+w+5:zx-w-5}" y="${y+13}" text-anchor="${r.v>=0?'start':'end'}" font-size="12" fill="${C.txt}">${r.v>0?'+':''}${nf(r.v,1)} %</text>`});
  return s+`<text x="${zx}" y="${h-6}" text-anchor="middle" font-size="11" fill="${C.txt}">0 %</text></svg>`+leg([['Aumento',C.nar],['Disminución',C.cafe]]);
}

/* proyección */
const LON0=-118.5,LON1=-86,LAT0=14.3,LAT1=32.9,K=28,CX=Math.cos(24*Math.PI/180);
const px=(lon,lat)=>[(lon-LON0)*K*CX,(LAT1-lat)*K];
const VBW=(LON1-LON0)*K*CX,VBH=(LAT1-LAT0)*K;

window.modulo1=function(){
  const el=$('#m1');
  const TECS=Object.keys(GRUPO_TEC);
  el.innerHTML=`
  <h1>Generación eléctrica</h1>
  <p class="lead">La electricidad se produce en centrales de distintas tecnologías. Aquí se ven las centrales de CFE que sí publican generación individual (hidroeléctricas, geotérmicas, solar, eólica y nuclear), la generación de CFE por tecnología de 2022 a 2024 y cómo se compara con el total nacional. Se distingue siempre entre <b>CFE</b> y el <b>Sistema Eléctrico Nacional</b> (${tip('SEN')}).</p>
  <div class="filters"><label>Año <select id="m1y"><option>2024</option><option>2023</option><option>2022</option></select></label>
   <label>Tecnología <select id="m1t"><option value="todas">Todas</option>${TECS.map(t=>`<option>${t}</option>`).join('')}</select></label>
   <label>Estado <select id="m1e"><option value="todos">Todos</option>${[...new Set(PLANTAS.map(p=>p.e))].sort().map(e=>`<option>${e}</option>`).join('')}</select></label>
   <button class="b" id="m1r">Restablecer</button></div>

  <h2>Mapa de centrales</h2>
  <div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(260px,1fr)">
   <div class="card"><div id="m1map"></div><div id="m1leg"></div>
    <p class="fuente">${tag('oficial','Oficial')} Generación y capacidad: Informes Anuales de CFE 2022-2024 (páginas en cada ficha). Contornos estatales: CONABIO, límites municipales 2023 (derivados del INEGI), vía PhantomInsights/mexico-geojson, fusionados y simplificados aquí; no es el archivo oficial del INEGI. ${tag('estim','Ubicación')} Coordenadas: Google Maps (Places), consultado el 06-nov-2026; no son de CFE. Cada punto es el que Google asigna al nombre de la central (a veces la presa, no la casa de máquinas).</p></div>
   <div class="card" id="m1ficha" aria-live="polite"><p class="lead">Selecciona una central en el mapa o en la lista.</p></div></div>
  <div class="card tw" style="margin-top:12px"><table id="m1tab"></table></div>

  <h2>Generación de CFE por tecnología, 2022-2024</h2>
  <div class="card"><div id="m1g1"></div>
   <p class="fuente">${tag('oficial','Oficial')} ${tip('generación bruta')} de CFE, GWh. 2022: Informe Anual 2023, pdf-p304 (cuadro de generación agregada CFE). 2023 y 2024: Informe Anual 2024, pdf-p29 (SIACIG, incluye unidades en puesta en servicio). Ámbito: solo CFE (no incluye privados ni productores independientes). Totales CFE: 141,343 / 150,462 / 154,059 GWh.</p></div>

  <h3>Participación por tecnología en la generación de CFE</h3>
  <div class="card"><div id="m1g2"></div>
   <p class="fuente">${tag('calculo','Cálculo')} Cada tecnología entre el total bruto de CFE del año seleccionado.</p></div>

  <h3>Variación interanual</h3>
  <div class="filters"><label>Periodo <select id="m1v"><option value="1">2022 → 2023</option><option value="2" selected>2023 → 2024</option></select></label></div>
  <div class="card"><div id="m1g3"></div>
   <p class="fuente">${tag('calculo','Cálculo')} (G<sub>final</sub> − G<sub>inicial</sub>) / G<sub>inicial</sub>. Las variaciones 2023→2024 coinciden con las publicadas en el Informe Anual 2024 pdf-p29 (por ejemplo ciclo combinado +5.6 %, hidroeléctrica +14.2 %, total +2.4 %). La del 2022→2023 se calcula aquí. Turbojet, diésel, eólica y solar parten de volúmenes muy pequeños y su porcentaje exagera cambios pequeños en GWh.</p></div>

  <h3>Fuentes fósiles y limpias en CFE</h3>
  <div class="card"><div id="m1g4"></div>
   <p class="fuente">${tag('calculo','Cálculo')} Limpias: hidroeléctrica, nuclear, geotérmica, eólica y solar (las que CFE reporta como limpias; en 2024 suman 38,982.9 GWh, 25.3 % de la generación de CFE, Informe Anual 2024 pdf-p30). Nota: ese informe dice que equivale a “más del 25 % del total de la generación eléctrica del país”; el porcentaje es de la generación de CFE, no del país. En 2023 cayó la hidroeléctrica (año seco) y por eso la participación limpia baja.</p></div>

  <h2>Ciclo combinado frente a vapor convencional</h2>
  <p class="lead">Ambas queman combustible fósil, pero convierten el calor de forma distinta: el ${tip('vapor convencional')} usa un ${tip('ciclo Rankine')}; el ${tip('ciclo combinado')} añade una turbina de gas antes del ciclo de vapor para aprovechar el calor de escape.</p>
  <div class="card tw" id="m1cc"></div>
  <div class="card"><div id="m1g5"></div>
   <p class="fuente">${tag('calculo','Cálculo')} ${tip('factor de planta')} bruto = generación bruta / (capacidad efectiva de fin de año × horas del año). Generación: ver arriba. Capacidad CFE (sin PIE): 2022 Informe Anual 2023 pdf-p20; 2023-2024 Informe Anual 2024 pdf-p24. Es una aproximación: la capacidad pudo cambiar durante el año, la generación es bruta, y el ciclo combinado de CFE excluye los PIE (15,990.5 MW en 2024, CFE Generación V).</p></div>

  <h2>CFE frente al total nacional</h2>
  <p class="lead">El ${tip('SEN')} incluye a CFE y a los privados. Esta sección usa la generación <b>neta inyectada</b> del SEN publicada por SENER, que no incluye generación distribuida.</p>
  <div class="card"><div id="m1n1"></div><div id="m1n1t"></div></div>
  <div class="card tw"><div id="m1n2"></div></div>

  <h2>Fósil, nuclear y renovables en el SEN, 2022-2024</h2>
  <p class="lead">Las tecnologías de la gráfica anterior agrupadas en familias para ver los tres años a la vez. Cambia la vista para comparar participación, energía o cambio frente a 2022.</p>
  <div class="filters"><label>Vista <select id="m1fv"><option value="pct">Participación (%)</option><option value="gwh">Energía (GWh)</option><option value="dif">Cambio frente a 2022 (GWh)</option></select></label></div>
  <div class="card"><div id="m1f1"></div></div>
  <div class="card tw" id="m1f2"></div>
  <div class="card" id="m1f3"></div>`;

  const st={y:2024,t:'todas',e:'todos',sel:null};
  const yi=()=>YR.indexOf(st.y);
  const gnum=p=>p.g[yi()];
  const filt=()=>PLANTAS.filter(p=>(st.t==='todas'||p.t===st.t)&&(st.e==='todos'||p.e===st.e));

  /* ---- mapa ---- */
  function drawMap(){
    const L=filt(),hasSt=new Set(PLANTAS.map(p=>p.cve));
    let vb=[0,0,VBW,VBH];
    if(L.length&&(st.e!=='todos'||st.t!=='todas')){
      const pts=L.map(p=>px(p.lon,p.lat)),xs=pts.map(a=>a[0]),ys=pts.map(a=>a[1]);
      let w=Math.max(Math.max(...xs)-Math.min(...xs),120)+80,h=Math.max(Math.max(...ys)-Math.min(...ys),90)+80;
      const r=VBW/VBH;if(w/h<r)w=h*r;else h=w/r;
      const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;vb=[cx-w/2,cy-h/2,w,h]}
    const z=vb[2]/VBW; // factor de escala visual
    let s=`<svg viewBox="${vb.join(' ')}" width="100%" role="group" aria-label="Mapa de México con centrales eléctricas">`;
    for(const k in ESTADOS){const v=ESTADOS[k];
      const d=v.r.map(r=>'M'+r.map(q=>px(q[0],q[1]).map(a=>a.toFixed(1)).join(',')).join('L')+'Z').join('');
      s+=`<path d="${d}" fill="${hasSt.has(k)?'#FFE6BC':'#FFFBF3'}" stroke="#B9A99A" stroke-width="${0.7*z}" fill-rule="evenodd"><title>${esc(v.n)}</title></path>`}
    const mx=L.length?Math.max(...L.map(p=>gnum(p)||0),1):1;
    [...L].sort((a,b)=>(gnum(b)||0)-(gnum(a)||0)).forEach(p=>{const [x,y]=px(p.lon,p.lat),g=gnum(p),r=(g==null?4:4+6*Math.sqrt(g/mx))*z;
      const sel=st.sel===p.n;
      s+=`<g tabindex="0" role="button" data-p="${esc(p.n)}" aria-label="${esc(p.n)}" style="cursor:pointer">
       ${sel?`<circle cx="${x}" cy="${y}" r="${r+7*z}" fill="none" stroke="${C.nar}" stroke-width="${2.5*z}"/>`:''}
       ${shape(SH[p.t],x,y,r,TCOL[p.t],p.baja?`stroke-dasharray="${3*z}" opacity=".85"`:'')}<title>${esc(p.n)} (${p.t}) ${st.y}: ${g==null?'Dato no disponible':nf(g,1)+' GWh'}</title></g>`});
    $('#m1map').innerHTML=s+'</svg>';
    $('#m1leg').innerHTML=leg([]).replace('<div class="legend"></div>','')+`<div class="legend">${Object.keys(SH).map(t=>`<span><svg width="16" height="16" viewBox="-10 -10 20 20" aria-hidden="true">${shape(SH[t],0,0,6,TCOL[t])}</svg> ${t}</span>`).join('')}<span>Tamaño = generación del año seleccionado. Contorno punteado = ubicación aproximada.</span></div>`;
    document.querySelectorAll('#m1map [data-p]').forEach(g=>{const f=()=>{st.sel=g.dataset.p;drawAll()};g.onclick=f;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}}});
  }
  function ficha(){
    const p=PLANTAS.find(x=>x.n===st.sel);const el=$('#m1ficha');
    if(!p){el.innerHTML='<p class="lead">Selecciona una central en el mapa o en la lista.</p>';return}
    const gv=p.g.map((v,i)=>({l:String(YR[i]),v:v==null?0:v,c:YC[YR[i]],t:v==null?'Dato no disponible':(p.aprox&&p.aprox[i]?'≈ ':'')+nf(v,1)+' GWh'}));
    const nn=p.g.map((v,i)=>i&&p.g[i-1]&&v!=null?((v/p.g[i-1]-1)*100):null);
    el.innerHTML=`<h3 style="margin-top:0">${esc(p.n)}</h3>
     <p>${tag('oficial','Oficial')} <b>${p.t}</b><br>Ubicación: ${esc(p.eg)}${p.baja?' <i>(aproximada: Google marca la localidad, no el parque)</i>':''}<br>Coordenadas: ${p.lat.toFixed(4)}, ${p.lon.toFixed(4)} (Google Maps)<br>
     Capacidad: ${p.cap?`<b>${/\(/.test(p.capTxt)?esc(p.capTxt):nf(p.cap)} MW</b> (${esc(p.capSrc)}${/pdf-p27/.test(p.capSrc)?', “capacidad actual”':''})`:ND}</p>
     ${hbars(gv,{lw:46,rh:28,max:Math.max(...p.g.filter(v=>v!=null),1),aria:'Generación neta anual de la central'})}
     <p class="nota">Variación interanual: ${nn.map((v,i)=>i?`${YR[i-1]}→${YR[i]}: ${v==null?'Dato no disponible':(v>0?'+':'')+nf(v,1)+' %'}`:'').filter(Boolean).join('; ')} ${tag('calculo','Cálculo')}</p>
     <p class="fuente">Generación neta anual (GWh): Informes Anuales de CFE, pdf-pp. ${esc(p.pg)} (IA2022 / IA2023 / IA2024). ${p.nota?esc(p.nota)+' ':''}<a href="${esc(p.link)}" target="_blank" rel="noopener">Ver en Google Maps</a>.</p>`;
  }
  function lista(){
    const L=filt();
    $('#m1tab').innerHTML=`<thead><tr><th>Central</th><th>Tecnología</th><th>Estado</th><th>Capacidad (MW)</th><th>Gen. ${st.y} (GWh)</th></tr></thead><tbody>${L.length?L.map(p=>{const g=gnum(p);return `<tr data-p="${esc(p.n)}" tabindex="0" style="cursor:pointer;${st.sel===p.n?'background:#FFE6BC':''}"><td>${esc(p.n)}</td><td>${p.t}</td><td>${p.e}</td><td>${p.cap?nf(p.cap,p.cap%1?1:0):ND}</td><td>${g==null?ND:(p.aprox&&p.aprox[yi()]?'≈ ':'')+nf(g,1)}</td></tr>`}).join(''):`<tr><td colspan="5">${st.t!=='todas'&&!SH[st.t]?'No hay centrales de esta tecnología en el mapa: los informes de CFE disponibles no publican generación por central fósil. Consulta la generación por tecnología más abajo.':'Sin centrales con esos filtros.'}</td></tr>`}</tbody>
     <tfoot><tr><td colspan="5" class="fuente">Se muestran ${L.length} de ${PLANTAS.length} centrales en ${new Set(PLANTAS.map(p=>p.e)).size} estados y ${new Set(PLANTAS.map(p=>p.t)).size} tecnologías.</td></tr></tfoot>`;
    document.querySelectorAll('#m1tab tbody tr[data-p]').forEach(r=>{const f=()=>{st.sel=r.dataset.p;drawAll()};r.onclick=f;r.onkeydown=e=>{if(e.key==='Enter')f()}});
  }

  /* ---- gráficas CFE ---- */
  function charts(){
    const sel=st.t==='todas'?Object.keys(GRUPO_TEC):[st.t];
    $('#m1g1').innerHTML=gbars(sel,(c,i)=>GEN_CFE[c][i],{u:'GWh',sel:st.y,aria:'Generación bruta de CFE por tecnología 2022-2024'});
    const i=yi(),tot=GEN_CFE_TOTAL[i];
    $('#m1g2').innerHTML=hbars(sel.map(c=>({l:c,v:GEN_CFE[c][i]/tot*100,c:grp(c)==='fosil'?C.cafe:C.amb,t:nf(GEN_CFE[c][i]/tot*100,1)+' % ('+nf(GEN_CFE[c][i])+' GWh)'})).sort((a,b)=>b.v-a.v),{max:70,rm:190,aria:'Participación por tecnología en CFE'})+leg([['Fósil',C.cafe],['Limpia',C.amb]])+`<p class="nota">Año ${st.y}. Total CFE: ${nf(tot)} GWh.</p>`;
    const k=Number($('#m1v').value);
    $('#m1g3').innerHTML=divbars(sel.map(c=>({l:c,v:(GEN_CFE[c][k]/GEN_CFE[c][k-1]-1)*100})).concat(st.t==='todas'?[{l:'Total CFE',v:(GEN_CFE_TOTAL[k]/GEN_CFE_TOTAL[k-1]-1)*100}]:[]),{aria:'Variación interanual de la generación'});
    const cl=(j)=>Object.keys(GRUPO_TEC).filter(c=>grp(c)==='limpia').reduce((a,c)=>a+GEN_CFE[c][j],0);
    $('#m1g4').innerHTML=hbars(YR.flatMap((y,j)=>[{l:y+' limpia',v:cl(j),c:C.amb,t:nf(cl(j))+' GWh ('+nf(cl(j)/GEN_CFE_TOTAL[j]*100,1)+' %)'},{l:y+' fósil',v:GEN_CFE_TOTAL[j]-cl(j),c:C.cafe,t:nf(GEN_CFE_TOTAL[j]-cl(j))+' GWh ('+nf((1-cl(j)/GEN_CFE_TOTAL[j])*100,1)+' %)'}]),{lw:100,max:120000,rm:200,aria:'Generación fósil y limpia de CFE'})+leg([['Fósil',C.cafe],['Limpia',C.amb]]);
    // CC vs vapor
    const cf=(t,j)=>GEN_CFE[t][j]*100000/(CAP_CC_VAPOR[t][j]*HORAS[j]);
    $('#m1cc').innerHTML=`<table><thead><tr><th></th><th>Ciclo combinado</th><th>Vapor convencional</th></tr></thead><tbody>
     <tr><td>Ciclo termodinámico</td><td>Brayton (gas) + Rankine (vapor)</td><td>Rankine (vapor)</td></tr>
     <tr><td>Combustible (CFE)</td><td>Gas natural</td><td>Gas natural / combustóleo (IA2023 pdf-p40, p61)</td></tr>
     ${YR.map((y,j)=>`<tr><td>Generación bruta ${y} (GWh)</td><td>${nf(GEN_CFE['Ciclo combinado'][j])}</td><td>${nf(GEN_CFE['Vapor convencional'][j])}</td></tr>`).join('')}
     ${YR.map((y,j)=>`<tr><td>Capacidad efectiva ${y} (MW)</td><td>${nf(CAP_CC_VAPOR['Ciclo combinado'][j],1)}</td><td>${nf(CAP_CC_VAPOR['Vapor convencional'][j],1)}</td></tr>`).join('')}
     ${YR.map((y,j)=>`<tr><td>Factor de planta bruto ${y} ${tag('calculo','Cálculo')}</td><td>${nf(cf('Ciclo combinado',j),1)} %</td><td>${nf(cf('Vapor convencional',j),1)} %</td></tr>`).join('')}
     <tr><td>Emisiones directas / eficiencia por tecnología</td><td>${ND}</td><td>${ND}</td></tr></tbody></table>
     <p class="fuente">Los informes de CFE disponibles no separan eficiencia térmica ni emisiones por tecnología (solo por empresa subsidiaria), así que no se comparan aquí. Los valores de ciclo de vida del IPCC para gas en ciclo combinado están en el Módulo 0; el IPCC no incluye vapor convencional.</p>`;
    $('#m1g5').innerHTML=gbars(['Ciclo combinado','Vapor convencional'],(c,j)=>cf(c,j),{u:'%',d:1,aria:'Factor de planta bruto'});
  }
  /* ---- nacional ---- */
  function nacional(){
    const j=yi(),y=st.y,tot=NAC_NET_TOTAL[j],T=Object.keys(NAC_NET).filter(k=>k!=='anios');
    const rows=T.map(k=>({l:k,v:NAC_NET[k][j]/tot*100,c:NAC_FOSIL.includes(k)?C.cafe:C.amb,t:nf(NAC_NET[k][j]/tot*100,1)+' % ('+nf(NAC_NET[k][j])+' GWh)'})).sort((a,b)=>b.v-a.v);
    $('#m1n1').innerHTML=`<h3 style="margin-top:0">Generación neta inyectada del SEN en ${y}, por tecnología</h3>`+hbars(rows,{max:70,rm:200,aria:'Generación del SEN por tecnología'})+leg([['Fósil',C.cafe],['Limpia',C.amb]]);
    const lim=NAC_NET_LIMPIAS[j];
    $('#m1n1t').innerHTML=`<p class="fuente">${tag('oficial','Oficial')} SENER, PLADESE (DOF 17-oct-2025), Tabla 2.2, pdf-p10. Total ${nf(tot)} GWh; energías limpias ${nf(lim)} GWh (${nf(lim/tot*100,1)} %); fósiles ${nf(tot-lim)} GWh (${nf((tot-lim)/tot*100,1)} %). Los porcentajes son ${tag('calculo','Cálculo')}. Verifiqué que las tecnologías suman el total de cada año.</p>
     <p class="nota"><b>Por qué hay otras cifras de “limpias”:</b> PRODESEN 2024-2038 da 24.32 % para 2023 porque suma la generación distribuida fotovoltaica (5,191 GWh): (80,358 + 5,191) / (346,501 + 5,191) = 24.32 %, igual que la cifra publicada. Para 2022, PRODESEN 2023-2037 publicó 31.2 % con otro criterio (incluía “Otros limpios” 2.5 %, Acuerdo A/018/2023 de la CRE); con la serie del PLADESE el valor es ${nf(NAC_NET_LIMPIAS[0]/NAC_NET_TOTAL[0]*100,1)} %. Por eso no se debe comparar 31.2 % de 2022 con las cifras posteriores.</p>`;
    const map=[['Ciclo combinado',['Ciclo combinado'],'Ciclo combinado'],['Vapor / térmica convencional',['Vapor convencional'],'Térmica convencional'],['Carboeléctrica',['Carboeléctrica'],'Carboeléctrica'],['Turbogás (CFE: turbogás + turbojet)',['Turbogás','Turbojet'],'Turbogás'],['Combustión interna (CFE: diésel)',['Diésel'],'Combustión interna'],['Hidroeléctrica',['Hidroeléctrica'],'Hidroeléctrica'],['Nuclear',['Nuclear'],'Nuclear'],['Geotérmica',['Geotérmica'],'Geotérmica'],['Eólica',['Eólica'],'Eólica'],['Solar fotovoltaica',['Solar fotovoltaica'],'Solar fotovoltaica']];
    $('#m1n2').innerHTML=`<h3 style="margin-top:0">CFE frente al SEN por tecnología, ${y}</h3><table><thead><tr><th>Tecnología</th><th>CFE, bruta (GWh)</th><th>SEN, neta inyectada (GWh)</th><th>CFE / SEN</th></tr></thead><tbody>
     ${map.map(m=>{const c=m[1].reduce((a,k)=>a+GEN_CFE[k][j],0),n=NAC_NET[m[2]][j];return `<tr><td>${m[0]}</td><td>${nf(c)}</td><td>${nf(n)}</td><td>${nf(c/n*100,c/n<0.1?1:0)} % ${tag('estim','Estimación')}</td></tr>`}).join('')}
     <tr><td><b>Total</b></td><td><b>${nf(GEN_CFE_TOTAL[j])}</b></td><td><b>${nf(tot)}</b></td><td><b>${nf(GEN_CFE_TOTAL[j]/tot*100,1)} %</b> ${tag('estim','Estimación')}</td></tr></tbody></table>
     <p class="fuente">CFE: Informes Anuales (IA2023 pdf-p304; IA2024 pdf-p29). SEN: PLADESE Tabla 2.2. ${tag('estim','Estimación')} Compara generación <b>bruta</b> de CFE con generación <b>neta</b> del SEN, por eso algunos cocientes pasan de 100 % (carboeléctrica, nuclear y geotérmica en 2024). La equivalencia entre nombres de tecnología (vapor/térmica convencional, diésel/combustión interna, turbogás+turbojet) es una suposición mía. El ciclo combinado de CFE no incluye a los productores independientes ni a otras centrales privadas, por eso CFE aporta una fracción menor de esa tecnología.</p>`;
  }

  /* Fósil, nuclear y renovables, tres años (PLADESE Tabla 2.2, generación neta inyectada, sin GD) */
  function fam3y(){
    const G={fosil:NAC_FOSIL,nuclear:['Nuclear'],renov:['Hidroeléctrica','Eólica','Solar fotovoltaica','Geotérmica','Bioenergía'],otra:['Cogeneración eficiente']};
    const K=['fosil','nuclear','renov','otra'],nm={fosil:'Fósiles',nuclear:'Nuclear',renov:'Renovables',otra:'Otras limpias'};
    const V={};K.forEach(k=>V[k]=[0,1,2].map(j=>G[k].reduce((a,t)=>a+NAC_NET[t][j],0)));
    const tot=NAC_NET_TOTAL,pc=(k,j)=>V[k][j]/tot[j]*100;
    const view=()=>{const m=$('#m1fv').value;let h='';
      if(m==='pct'){const W=720,lw=60,rh=46,hh=3*rh+40,sc=(W-lw-20)/100;
        h=`<svg viewBox="0 0 ${W} ${hh}" width="100%" role="img" aria-label="Participación de fósiles, nuclear, renovables y otras limpias en la generación neta del SEN, 2022 a 2024">`;
        [0,25,50,75,100].forEach(t=>{h+=`<line x1="${lw+t*sc}" x2="${lw+t*sc}" y1="4" y2="${hh-26}" stroke="#EBD3AE"/><text x="${lw+t*sc}" y="${hh-12}" text-anchor="middle" font-size="11" fill="${C.txt}">${t} %</text>`});
        [0,1,2].forEach(j=>{let x=lw;const y=8+j*rh;h+=`<text x="${lw-8}" y="${y+22}" text-anchor="end" font-size="13" font-weight="700" fill="${C.txt}">${YR[j]}</text>`;
          K.forEach(k=>{const w=pc(k,j)*sc;h+=`<rect x="${x}" y="${y}" width="${w}" height="34" fill="${FAM[k].c}" stroke="#fff" stroke-width="1.5"><title>${nm[k]} ${YR[j]}: ${nf(pc(k,j),1)} % (${nf(V[k][j])} GWh)</title></rect>`;
            if(w>34)h+=`<text x="${x+w/2}" y="${y+22}" text-anchor="middle" font-size="12" font-weight="700" fill="${k==='fosil'?'#fff':C.txt}">${nf(pc(k,j),1)} %</text>`;x+=w})});
        h+='</svg>'}
      else if(m==='gwh'){h=gbars(K.map(k=>nm[k]),(c,i)=>V[K.find(k=>nm[k]===c)][i],{u:'GWh',d:0,aria:'Generación neta por familia, 2022 a 2024'})}
      else{const rows=[];K.forEach(k=>[1,2].forEach(j=>rows.push({l:`${nm[k]} ${YR[j]}`,v:V[k][j]-V[k][0],k})));
        const W=720,lw=170,rh=24,hh=rows.length*rh+32,mn=Math.max(0,-Math.min(...rows.map(r=>r.v))),mp=Math.max(0,...rows.map(r=>r.v)),sc=(W-lw-190)/((mn+mp)||1),zx=lw+64+mn*sc;
        h=`<svg viewBox="0 0 ${W} ${hh}" width="100%" role="img" aria-label="Cambio de la generación neta por familia frente a 2022, en GWh"><line x1="${zx}" x2="${zx}" y1="2" y2="${hh-22}" stroke="${C.cafe}"/>`;
        rows.forEach((r,i)=>{const y=6+i*rh,w=Math.abs(r.v)*sc;h+=`<text x="${lw-6}" y="${y+13}" text-anchor="end" font-size="12" fill="${C.txt}">${r.l}</text><rect x="${r.v>=0?zx:zx-w}" y="${y}" width="${Math.max(w,1)}" height="${rh-7}" rx="3" fill="${FAM[r.k].c}" stroke="${C.cafe}" stroke-width=".6"><title>${r.l}: ${r.v>0?'+':''}${nf(r.v)} GWh frente a 2022</title></rect><text x="${r.v>=0?zx+w+5:zx-w-5}" y="${y+13}" text-anchor="${r.v>=0?'start':'end'}" font-size="11" fill="${C.txt}">${r.v>0?'+':''}${nf(r.v)}</text>`});
        h+=`<text x="${zx}" y="${hh-6}" text-anchor="middle" font-size="11" fill="${C.txt}">0 (= 2022)</text></svg>`}
      $('#m1f1').innerHTML=`<h3 style="margin-top:0">${{pct:'Participación en la generación neta del SEN',gwh:'Generación neta del SEN por familia (GWh)',dif:'Cambio frente a 2022 (GWh)'}[m]}</h3>`+h+(m==='gwh'?'':leg(K.map(k=>[nm[k],FAM[k].c])))};
    $('#m1fv').onchange=view;view();
    const d=(k,a,b)=>V[k][b]-V[k][a],hid=NAC_NET['Hidroeléctrica'],resto=d('renov',0,1)-(hid[1]-hid[0]);
    $('#m1f2').innerHTML=`<table><thead><tr><th>Familia</th>${YR.map(y=>`<th>${y} (GWh)</th><th>${y} (%)</th>`).join('')}<th>2024 − 2022 (GWh)</th><th>2024 − 2022 (puntos %)</th></tr></thead><tbody>${K.map(k=>`<tr><td><i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${FAM[k].c};border:1px solid ${C.cafe};vertical-align:middle"></i> ${nm[k]}</td>${[0,1,2].map(j=>`<td>${nf(V[k][j])}</td><td>${nf(pc(k,j),1)}</td>`).join('')}<td>${d(k,0,2)>0?'+':''}${nf(d(k,0,2))}</td><td>${pc(k,2)-pc(k,0)>0?'+':''}${nf(pc(k,2)-pc(k,0),1)}</td></tr>`).join('')}<tr><td><b>Total</b></td>${[0,1,2].map(j=>`<td><b>${nf(tot[j])}</b></td><td><b>100</b></td>`).join('')}<td><b>+${nf(tot[2]-tot[0])}</b></td><td></td></tr></tbody></table>
     <p class="fuente">${tag('oficial','Oficial')} SENER, PLADESE (DOF 17-oct-2025), Tabla 2.2, pdf-p10 (generación neta inyectada, sin generación distribuida). ${tag('calculo','Cálculo')} Las familias, sumas, porcentajes y diferencias son de este atlas. <b>Fósiles</b>: ciclo combinado, térmica convencional, carboeléctrica, turbogás y combustión interna. <b>Renovables</b>: hidroeléctrica, eólica, solar fotovoltaica, geotérmica y bioenergía (la ley condiciona la hidroeléctrica y la bioenergía). <b>Otras limpias</b>: cogeneración eficiente, que no se asigna a una familia porque depende del combustible.</p>`;
    $('#m1f3').innerHTML=`<h3 style="margin-top:0">Cómo leer estos tres años</h3><ul>
     <li><b>Fósiles:</b> su participación pasó de ${nf(pc('fosil',0),1)} % a ${nf(pc('fosil',1),1)} % en 2023 y ${nf(pc('fosil',2),1)} % en 2024; en energía, ${d('fosil',0,2)>0?'+':''}${nf(d('fosil',0,2))} GWh entre 2022 y 2024.</li>
     <li><b>Renovables:</b> bajaron de ${nf(pc('renov',0),1)} % a ${nf(pc('renov',1),1)} % en 2023 y subieron a ${nf(pc('renov',2),1)} % en 2024. En 2023 la hidroeléctrica cambió ${nf(hid[1]-hid[0])} GWh (${nf((hid[1]/hid[0]-1)*100,1)} %), más que la baja total de renovables (${nf(d('renov',0,1))} GWh); el resto de renovables sumó +${nf(resto)} GWh.</li>
     <li><b>Nuclear:</b> ${nf(pc('nuclear',0),1)} %, ${nf(pc('nuclear',1),1)} % y ${nf(pc('nuclear',2),1)} % de la generación; ${nf(V.nuclear[0])}, ${nf(V.nuclear[1])} y ${nf(V.nuclear[2])} GWh.</li>
     <li><b>Participación y energía no son lo mismo:</b> el total creció ${nf(tot[2]-tot[0])} GWh (${nf((tot[2]/tot[0]-1)*100,1)} %) entre 2022 y 2024, así que una familia puede generar más GWh y aun así perder participación.</li></ul>
     <p class="fuente">${tag('calculo','Cálculo')} Este análisis describe las cifras publicadas; no atribuye las variaciones a una causa, porque el PLADESE no las explica en la tabla usada.</p>`;
  }
  function drawAll(){drawMap();ficha();lista();charts();nacional()}
  const bind=(id,k,fn)=>$(id).onchange=e=>{st[k]=k==='y'?Number(e.target.value):e.target.value;if(k==='e'||k==='t')st.sel=null;fn()};
  bind('#m1y','y',drawAll);bind('#m1t','t',drawAll);bind('#m1e','e',drawAll);
  $('#m1v').onchange=charts;
  $('#m1r').onclick=()=>{st.y=2024;st.t='todas';st.e='todos';st.sel=null;$('#m1y').value='2024';$('#m1t').value='todas';$('#m1e').value='todos';drawAll()};
  drawAll();fam3y();
};
modulo1();
})();

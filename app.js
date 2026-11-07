'use strict';
const $=(s,r=document)=>r.querySelector(s);
const C={cafe:'#7C2D12',teja:'#9A3412',nar:'#F97316',amb:'#FBBF24',txt:'#3A1608'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tip=t=>`<span class="def" tabindex="0" data-tip="${esc(GLOSARIO[t])}">${esc(t)}</span>`;
const tag=(k,txt)=>`<span class="tag t-${k}">${txt}</span>`;
const TAGS={oficial:'Oficial',calculo:'Cálculo',simulacion:'Simulación',estim:'Estimación'};
const nf=(n,d=0)=>Number(n).toLocaleString('es-MX',{minimumFractionDigits:d,maximumFractionDigits:d});
const ND='<span class="nd">Dato no disponible</span>';
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- Gráficas SVG ---------- */
function hbars(rows,o={}){
  const W=720,lw=o.lw||190,rh=o.rh||24,h=rows.length*rh+30,max=o.max||Math.max(...rows.map(r=>r.v)),sc=(W-lw-90)/max;
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img" aria-label="${esc(o.aria||'Gráfica de barras')}">`;
  rows.forEach((r,i)=>{const y=8+i*rh,w=Math.max(r.v*sc,1);
    s+=`<text x="${lw-6}" y="${y+14}" text-anchor="end" font-size="12" fill="${C.txt}">${esc(r.l)}</text>
    <rect x="${lw}" y="${y}" width="${w}" height="${rh-8}" rx="3" fill="${r.c}" stroke="${C.cafe}" stroke-width=".6"><title>${esc(r.l)}: ${esc(r.t||nf(r.v,2))}</title></rect>
    <text x="${lw+w+5}" y="${y+14}" font-size="12" fill="${C.txt}">${esc(r.t||nf(r.v,2))}</text>`});
  return s+'</svg>';
}
function legend(items){return '<div class="legend">'+items.map(i=>`<span><i style="background:${i[1]};border:1px solid ${C.cafe}"></i>${i[0]}</span>`).join('')+'</div>'}
const colG=f=>FAM[f]?FAM[f].c:C.amb;

function rangeChart(){
  const keys=Object.keys(IPCC),W=720,lw=170,rh=30,h=keys.length*rh+54,x0=lw,x1=W-175;
  const lg=v=>x0+(Math.log10(Math.max(v,1))/Math.log10(3000))*(x1-x0);
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img" aria-label="Emisiones directas y de ciclo de vida por tecnología, escala logarítmica">`;
  [1,10,100,1000].forEach(t=>{s+=`<line x1="${lg(t)}" x2="${lg(t)}" y1="4" y2="${h-30}" stroke="#EBD3AE"/><text x="${lg(t)}" y="${h-14}" text-anchor="middle" font-size="11" fill="${C.txt}">${t}</text>`});
  s+=`<text x="${(x0+x1)/2}" y="${h-1}" text-anchor="middle" font-size="11" fill="${C.txt}">gCO2eq/kWh (escala logarítmica; las emisiones directas de 0 no se grafican)</text>`;
  keys.forEach((k,i)=>{const y=14+i*rh,d=IPCC[k].d,c=IPCC[k].c;
    s+=`<text x="${lw-8}" y="${y+4}" text-anchor="end" font-size="12" fill="${C.txt}">${esc(IPCC[k].n)}</text>
    <line x1="${lg(c[0])}" x2="${lg(c[2])}" y1="${y}" y2="${y}" stroke="${C.nar}" stroke-width="5" stroke-linecap="round"><title>Ciclo de vida ${esc(IPCC[k].n)}: mín ${c[0]} / mediana ${c[1]} / máx ${c[2]}</title></line>
    <circle cx="${lg(c[1])}" cy="${y}" r="6" fill="${C.cafe}" stroke="#fff"><title>Mediana ciclo de vida: ${c[1]}</title></circle>`;
    if(d[1]>0)s+=`<rect x="${lg(d[1])-5}" y="${y-5}" width="10" height="10" fill="${C.amb}" stroke="${C.cafe}" transform="rotate(45 ${lg(d[1])} ${y})"><title>Mediana directa: ${d[1]}</title></rect>`;
    s+=`<text x="${W-165}" y="${y+4}" font-size="11" fill="${C.txt}">${c[1]} (${c[0]}–${c[2]})</text>`});
  return s+'</svg>';
}

/* ---------- Estructura ---------- */
const MODS=['0 Recursos','1 Generación','2 Transmisión','3 Distribución','4 ¿Sabías que?'];
function build(){
  const nav=$('#nav'),main=$('#main');
  MODS.forEach((m,i)=>{
    nav.insertAdjacentHTML('beforeend',`<button role="tab" aria-selected="${i===0}" data-i="${i}">${m}</button>`);
    main.insertAdjacentHTML('beforeend',`<section class="mod${i===0?' on':''}" id="m${i}" role="tabpanel"></section>`);
  });
  nav.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    nav.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',x===b));
    document.querySelectorAll('.mod').forEach((s,i)=>s.classList.toggle('on',i==b.dataset.i));window.scrollTo(0,0)});
  modulo0();
}

function modulo0(){
  const el=$('#m0');
  const limpia=MATRIZ_2023.filter(r=>r.g==='limpia').reduce((a,r)=>a+r.p,0),fosil=MATRIZ_2023.filter(r=>r.g==='fosil').reduce((a,r)=>a+r.p,0);
  el.innerHTML=`
  <h1>Recursos energéticos</h1>
  <p class="lead">Antes de hablar de redes, hay que entender de dónde sale la energía. Este módulo clasifica los recursos, muestra cómo se convierten en electricidad y compara tecnologías con datos de México. Las definiciones de <i>renovable</i>, <i>limpia</i> y <i>fósil</i> son las de la ley vigente; no son sinónimos.</p>
  <div class="legend">${Object.keys(TAGS).map(k=>tag(k,TAGS[k])).join(' ')}<span>Cada cifra indica su tipo y su fuente.</span></div>

  <h2>Cinco indicadores para tomar conciencia</h2>
  <div class="grid" id="kpis"></div>
  <div class="card" style="margin-top:16px"><h3 style="margin-top:0">¿Cuánto CO2e se asocia a tu consumo?</h3>
   ${tag('calculo','Cálculo')}
   <div class="filters"><label>Consumo mensual (kWh) <input id="kwh" type="number" min="0" value="150" style="width:110px;padding:6px;border:1px solid var(--borde);border-radius:8px"></label></div>
   <p id="co2out"></p>
   <p class="fuente">Cálculo: kWh × 0.438 kg CO2e/kWh (equivale a 0.438 tCO2e/MWh). Es el factor de la red nacional publicado por CRE/SEMARNAT el 29-feb-2024, citado en PRODESEN 2024-2038, pdf-p98. No es un factor de ciclo de vida.</p></div>

  <h2>Tres familias de fuentes</h2>
  <div id="fam3"></div>

  <h2>Clasificador de recursos</h2>
  <p class="lead">Para cada recurso responde tres preguntas: cada respuesta recibe explicación al instante, con el artículo que la respalda. Verificar revisa todo, incluso lo que dejaste sin responder. Hay casos que la ley deja condicionados: ahí la respuesta correcta es “Condicionada o no listada”. Definiciones: ${esc(FUENTES.LPTE)}; ${esc(FUENTES.LSE)}.</p>
  <div class="cls" id="cls"></div>
  <div class="filters"><button class="b p" id="verif">Verificar</button><button class="b" id="reset">Reiniciar</button><strong id="score" aria-live="polite"></strong></div>

  <h2>De la fuente a la electricidad</h2>
  <div class="filters"><label>Tecnología <select id="convSel"></select></label></div>
  <div class="card" id="conv"></div>

  <h2>Matriz de generación y capacidad</h2>
  <h3>Generación del SEN en 2023 por tecnología</h3>
  <div class="filters"><label>Grupo <select id="fGrp"><option value="todas">Todas</option><option value="fosil">Fósiles</option><option value="nuclear">Nuclear</option><option value="renov">Renovables (lista legal)</option><option value="otra">Otras limpias</option><option value="limpia">Todas las limpias</option></select></label></div>
  <div class="card"><div id="ch1"></div>${legend(Object.values(FAM).map(f=>[f.n,f.c]))}
   <p class="fuente">${tag('oficial','Oficial')} ${esc(FUENTES.PROD)}. Porcentajes de la figura; pueden variar por redondeo. Total: 351,695 GWh (incluye GD-FV de 5,191 GWh). Ámbito: SEN (CFE y privados).</p></div>
  <h3>Fósil, nuclear y renovables</h3>
  <div class="card"><div id="ch2"></div>
   ${legend(Object.values(FAM).map(f=>[f.n,f.c]))}<p class="fuente">${tag('calculo','Cálculo')} Suma de los porcentajes de la figura por familia (ver “Tres familias de fuentes”). Fósil ${nf(fosil,2)} %; limpia (nuclear + renovables + otras) ${nf(limpia,2)} %; PRODESEN publica 75.68 % y 24.32 %. Las renovables incluyen hidráulica y bioenergía, que la ley condiciona; cogeneración eficiente y otros limpios no se asignan a una familia porque dependen del combustible o de criterios de la CNE. GWh = % × 351,695 / 100.</p></div>
  <h3>Capacidad instalada de CFE</h3>
  <div class="filters"><label>Año <select id="fAnio"><option>2024</option><option>2023</option><option>2022</option></select></label>
   <label>Tecnología <select id="fTec"><option value="todas">Todas</option>${CAP_CFE.map(r=>`<option>${r.t}</option>`).join('')}</select></label></div>
  <div class="card"><div id="ch3"></div>
   <p class="fuente">${tag('oficial','Oficial')} ${esc(FUENTES.IA23)}. Solo capacidad de CFE (total CFE: 44,073.34 MW en 2022, 44,846.2 MW en 2023 y 45,116.7 MW en 2024); la hidroeléctrica de 2023 se toma del Informe Anual 2024 (12,143.6 MW) porque el Informe 2023 imprime 12,443.6 MW y esa cifra no suma su propio total. No incluye productores externos ni privados. Capacidad ${tip('bruta efectiva')}.</p></div>
  <h3>Emisiones de gases de efecto invernadero por tecnología</h3>
  <div class="card"><div id="ch4"></div>
   ${legend([['Rango de ciclo de vida (mín–máx)',C.nar],['Mediana de ciclo de vida',C.cafe],['Mediana de emisiones directas',C.amb]])}
   <p class="fuente">${tag('oficial','Oficial')} ${esc(FUENTES.IPCC)}. Valores de literatura mundial, no mediciones de centrales mexicanas. El máximo de hidroeléctrica (2,200) corresponde a casos extremos de embalses con metano. Diferencia: ${tip('emisiones directas')} frente a ${tip('ciclo de vida')}.</p></div>

  <h2>Comparador de tecnologías</h2>
  <div class="filters"><label>Tecnología A <select id="cA"></select></label><label>Tecnología B <select id="cB"></select></label></div>
  <div class="card tw" id="cmp"></div>

  <div id="vf"></div>

  <h2>Actividad de reflexión</h2>
  <p class="lead">Cinco preguntas abiertas. Tus respuestas se guardan en este navegador y puedes descargarlas.</p>
  <div id="refl"></div><div class="filters"><button class="b p" id="dl">Descargar respuestas (.txt)</button></div>`;

  /* KPIs */
  const K=[
   {v:'24.32 %',l:'de la generación del SEN en 2023 fue de energías limpias',f:'PRODESEN 2024-2038, pdf-p97',t:'oficial'},
   {v:'−42 %',l:'generación hidráulica 2023 frente a 2022 (año seco)',f:'PRODESEN 2024-2038, pdf-p97',t:'oficial'},
   {v:'0.438',l:'tCO2e/MWh, factor de emisión de la red (2023-2030)',f:'PRODESEN 2024-2038, pdf-p98 (CRE/SEMARNAT, 29-feb-2024)',t:'oficial'},
   {v:'31 %',l:'meta de reducción de emisiones del sector eléctrico frente a su línea base (NDC)',f:'PRODESEN 2024-2038, pdf-p97',t:'oficial'},
   {v:'31,739 MW',l:'de energías limpias que la planeación prevé incorporar al 2030 (meta de planeación, no capacidad instalada)',f:'PRODESEN 2024-2038, pdf-p98',t:'oficial'}];
  $('#kpis').innerHTML=K.map(k=>`<div class="card kpi">${tag(k.t,TAGS[k.t])}<b>${k.v}</b>${k.l}<div class="fuente">${k.f}</div></div>`).join('');
  const upd=()=>{const k=Math.max(0,Number($('#kwh').value)||0);$('#co2out').innerHTML=`<b>${nf(k*0.438,1)} kg CO2e al mes</b> · ${nf(k*0.438*12/1000,2)} tCO2e al año`};
  $('#kwh').addEventListener('input',upd);upd();

  /* Tres familias */
  const fsum=f=>MATRIZ_2023.filter(r=>r.f===f).reduce((a,r)=>a+r.p,0);
  const capF=f=>CAP_CFE.filter(r=>FAM_CAP(r.t)===f).reduce((a,r)=>a+r.a2024,0),capT=CAP_CFE_TOTAL.a2024;
  const ipf=f=>{const re={fosil:/Carbo|Ciclo/,nuclear:/Nucle/,renov:/Hidr|Geot|Solar|Eolo/}[f],k=Object.keys(IPCC).filter(x=>re.test(x));const rg=a=>{const m=[Math.min(...a),Math.max(...a)];return m[0]===m[1]?String(m[0]):m[0]+' a '+m[1]};return {c:rg(k.map(x=>IPCC[x].c[1])),d:rg(k.map(x=>IPCC[x].d[1])),n:k.map(x=>IPCC[x].n).join(', ')}};
  const pc=(v,t)=>`${nf(v/t*100,1)} %`;
  const col=(f,h,body,ej)=>`<div class="fcol" style="border-top:6px solid ${FAM[f].c}"><h3>${h}</h3><p>${body}</p><p class="fuente">${ej}</p></div>`;
  $('#fam3').innerHTML=`<p class="lead">La ley no habla de “fósiles, nuclear y renovables” como tres cajas: define <i>fósil</i>, <i>renovable</i> y <i>limpia</i> por separado. Este esquema las ordena sin cambiar las definiciones.</p>
   <div class="fam3">
    ${col('fosil','Fósiles','Provienen de la combustión de materiales con carbono cuya formación ocurrió por procesos geológicos (LPTE art. 3, fr. XI).','Ejemplos: gas natural, carbón mineral, combustóleo, diésel, petróleo crudo. Tecnologías: ciclo combinado, vapor convencional, carboeléctrica, turbogás, combustión interna.')}
    ${col('nuclear','Nuclear','Se obtiene por fisión de uranio. No es combustión de carbono, así que no entra en la definición de fósil, y no figura en la lista de fuentes renovables.','Tecnología: nucleoeléctrica. En México, la central Laguna Verde (ver Módulo 1).')}
    ${col('renov','Renovables','Su fuente reside en fenómenos de la naturaleza que se regeneran (LPTE art. 3, fr. X). La lista: viento, radiación solar, agua en cauces naturales o embalses ya existentes, energía oceánica, calor interno de la Tierra y los energéticos que determine la Ley de Biocombustibles.','Tecnologías: eoloeléctrica, solar fotovoltaica, hidroeléctrica, geotérmica, bioenergía.')}
    <div class="fclean"><b>Limpias (LSE art. 3, fr. XXI):</b> incluyen la nucleoeléctrica y la mayoría de las renovables. Hay casos condicionados (biocombustibles, hidrógeno, residuos urbanos, cogeneración eficiente) que solo son limpios si cumplen criterios de la CNE o de SEMARNAT. Los fósiles no figuran en la lista; la cogeneración eficiente es un proceso y su combustible puede ser fósil.</div>
   </div>
   <div class="card tw" style="margin-top:14px"><table><thead><tr><th>Criterio</th><th>Fósiles</th><th>Nuclear</th><th>Renovables</th></tr></thead><tbody>
    <tr><td>Origen de la energía</td><td>Combustión de carbono de origen geológico</td><td>Fisión de uranio</td><td>Fenómenos naturales que se regeneran</td></tr>
    <tr><td>Participación en la generación del SEN, 2023 ${tag('calculo','Cálculo')}</td><td>${nf(fsum('fosil'),2)} %</td><td>${nf(fsum('nuclear'),2)} %</td><td>${nf(fsum('renov'),2)} % (incluye hidráulica y bioenergía, condicionadas; aparte, otras limpias: ${nf(fsum('otra'),2)} %)</td></tr>
    <tr><td>Capacidad bruta efectiva de CFE, 2024 ${tag('calculo','Cálculo')}</td><td>${nf(capF('fosil'),1)} MW (${pc(capF('fosil'),capT)})</td><td>${nf(capF('nuclear'),1)} MW (${pc(capF('nuclear'),capT)})</td><td>${nf(capF('renov'),1)} MW (${pc(capF('renov'),capT)})</td></tr>
    <tr><td>Emisiones directas, mediana IPCC (gCO₂eq/kWh)</td><td>${ipf('fosil').d} (${ipf('fosil').n})</td><td>${ipf('nuclear').d}</td><td>${ipf('renov').d}</td></tr>
    <tr><td>Emisiones de ciclo de vida, mediana IPCC (gCO₂eq/kWh)</td><td>${ipf('fosil').c}</td><td>${ipf('nuclear').c}</td><td>${ipf('renov').c} (${ipf('renov').n})</td></tr>
    <tr><td>¿Limpia según la LSE?</td><td>No figura en la lista</td><td>Sí (inc. i)</td><td>En general sí; con condiciones en los casos señalados</td></tr>
   </tbody></table>
   <p class="fuente">${tag('oficial','Oficial')} Definiciones: ${esc(FUENTES.LPTE)}; ${esc(FUENTES.LSE)}. Generación: ${esc(FUENTES.PROD)}; las sumas por familia son de este atlas. Capacidad: ${esc(FUENTES.IA23)} (solo CFE; la suma coincide con el total de 45,116.7 MW). Emisiones: ${esc(FUENTES.IPCC)}; valores mundiales, no de centrales mexicanas; el IPCC no lista aquí combustóleo ni diésel.</p></div>`;

  /* Clasificador */
  const opt=v=>`<option value="">—</option><option value="si"${v==='si'?'':''}>Sí</option><option value="no">No</option><option value="cond">Condicionada o no listada</option>`;
  $('#cls').innerHTML=RECURSOS.map(r=>`<div class="card" id="c_${r.id}"><h4>${esc(r.n)}</h4>
   ${[['ren','¿Renovable?'],['fos','¿Fósil?'],['lim','¿Limpia (ley)?']].map(([d,l])=>`<label>${l} <select data-r="${r.id}" data-d="${d}" aria-describedby="fb_${r.id}_${d}">${opt()}</select></label><div class="fb" id="fb_${r.id}_${d}" aria-live="polite"></div>`).join('')}
   <div class="nota" hidden></div></div>`).join('');
  const LB={si:'Sí',no:'No',cond:'Condicionada o no listada'};
  const fbHtml=(r,d,v,forced)=>{const ok=r[d],x=EXPL[r.id][d];
    if(!v)return forced?`<span class="fbno">○ Sin responder.</span> Respuesta: <b>${LB[ok]}</b>. ${esc(x)}`:'';
    if(v===ok)return `<span class="fbok">✓ Correcto.</span> ${esc(x)}`;
    const h=EXPL_PISTA(d,v,ok,r);return `<span class="fbno">✗ No exactamente.</span> Elegiste “${LB[v]}”; la respuesta es <b>${LB[ok]}</b>. ${esc(x)}${h?` <i>${esc(h)}</i>`:''}`};
  const clsScore=()=>{let ok=0,ans=0;RECURSOS.forEach(r=>['ren','fos','lim'].forEach(d=>{const v=$(`#c_${r.id} select[data-d="${d}"]`).value;if(v){ans++;if(v===r[d])ok++}}));
    $('#score').textContent=ans?`Aciertos: ${ok} de ${ans} respondidas (de ${RECURSOS.length*3}).`:''};
  const cardState=(r,forced)=>{const c=$('#c_'+r.id),sel=[...c.querySelectorAll('select')],ans=sel.filter(s=>s.value).length,all=sel.every(s=>s.value===r[s.dataset.d]);
    const n=c.querySelector('.nota');
    if(ans===3||forced){c.className='card '+(all?'ok':'bad');n.hidden=false;n.innerHTML=`<b>Resumen:</b> renovable ${LB[r.ren]}; fósil ${LB[r.fos]}; limpia ${LB[r.lim]}. ${esc(r.nota)}`}
    else{c.className='card';n.hidden=true}};
  $('#cls').addEventListener('change',e=>{const s=e.target.closest('select');if(!s)return;const r=RECURSOS.find(x=>x.id===s.dataset.r);
    $(`#fb_${r.id}_${s.dataset.d}`).innerHTML=fbHtml(r,s.dataset.d,s.value);cardState(r);clsScore()});
  $('#verif').onclick=()=>{if(![...document.querySelectorAll('#cls select')].some(x=>x.value)){$('#score').textContent='Elige al menos una respuesta antes de verificar.';return}RECURSOS.forEach(r=>{['ren','fos','lim'].forEach(d=>{const v=$(`#c_${r.id} select[data-d="${d}"]`).value;$(`#fb_${r.id}_${d}`).innerHTML=fbHtml(r,d,v,true)});cardState(r,true)});clsScore()};
  $('#reset').onclick=()=>{document.querySelectorAll('#cls select').forEach(s=>s.value='');document.querySelectorAll('#cls .fb').forEach(f=>f.innerHTML='');RECURSOS.forEach(r=>cardState(r));$('#score').textContent=''};

  /* Conversión */
  const cs=$('#convSel');cs.innerHTML=Object.keys(CONVERSION).map(k=>`<option>${k}</option>`).join('');
  const rc=()=>{const c=CONVERSION[cs.value],cf=CONV_FAM[cs.value],F=FAM[cf.f];$('#conv').innerHTML=`<p><span class="tag" style="background:${F.c};color:${cf.f==='renov'?C.txt:'#fff'};border-color:${F.c}">${F.n.replace(' (lista legal)','')}${cf.cond?' (condicionada en la ley)':''}</span> <b>Fuente de energía:</b> ${esc(cf.calor)}</p><div class="chain">${c.pasos.map((p,i)=>(i?'<span aria-hidden="true">→</span>':'')+`<div>${esc(p)}</div>`).join('')}</div><p><b>Formas de energía:</b> ${c.formas.map(esc).join(' → ')}</p><p><b>Idea física:</b> ${esc(c.fis)}</p><p class="fuente">${tag('estim','Explicativo')} Esquema conceptual de principios físicos; no contiene cifras de eficiencia ni datos de centrales específicas.</p>`};
  cs.onchange=rc;rc();
  $('#conv').insertAdjacentHTML('afterend',`<div class="card tw"><h3 style="margin-top:0">Qué cambia entre tecnologías: de dónde sale la energía</h3><table><thead><tr><th>Tecnología</th><th>Familia</th><th>Fuente de energía</th><th>¿Turbina de vapor?</th><th>¿Combustión?</th></tr></thead><tbody>${Object.keys(CONV_FAM).map(k=>{const x=CONV_FAM[k];return `<tr><td>${esc(k)}</td><td><i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${FAM[x.f].c};border:1px solid ${C.cafe};vertical-align:middle"></i> ${FAM[x.f].n.replace(' (lista legal)','')}${x.cond?' (cond.)':''}</td><td>${esc(x.calor)}</td><td>${x.vapor}</td><td>${x.comb}</td></tr>`}).join('')}</tbody></table><p class="fuente">${tag('estim','Explicativo')} Derivado de las cadenas de conversión de este módulo. Carbón, nuclear y geotermia usan una turbina de vapor; lo que cambia es de dónde sale el calor. Hidráulica, eólica y solar no parten de calor. El ciclo combinado usa una turbina de gas y luego una de vapor. Familias según LPTE art. 3 frs. X y XI y LSE art. 3 fr. XXI (ver arriba).</p></div>`);

  /* Gráficas */
  const r1=()=>{const g=$('#fGrp').value;const rows=MATRIZ_2023.filter(r=>g==='todas'||r.g===g||r.f===g).map(r=>({l:r.t,v:r.p,c:colG(r.f),t:nf(r.p,2)+' %'}));
    $('#ch1').innerHTML=hbars(rows,{max:60,aria:'Porcentaje de generación del SEN en 2023 por tecnología'})};
  $('#fGrp').onchange=r1;r1();
  const gw=p=>Math.round(p*TOTAL_SEN_2023_GWH/100);
  const fs=f=>MATRIZ_2023.filter(r=>r.f===f).reduce((a,r)=>a+r.p,0);
  $('#ch2').innerHTML=hbars(['fosil','nuclear','renov','otra'].map(f=>({l:FAM[f].n.replace(' (cogeneración eficiente y otros)','').replace(' (lista legal)',''),v:fs(f),c:FAM[f].c,t:`${nf(fs(f),2)} % ≈ ${nf(gw(fs(f)))} GWh`})),{max:100,lw:110,rh:34,aria:'Generación del SEN en 2023 por familia: fósil, nuclear, renovables y otras limpias'});
  const r3=()=>{const y='a'+$('#fAnio').value,t=$('#fTec').value;
    const rows=CAP_CFE.filter(r=>t==='todas'||r.t===t).map(r=>({l:r.t,v:r[y],c:colG(FAM_CAP(r.t)),t:nf(r[y],2)+' MW'}));
    $('#ch3').innerHTML=hbars(rows,{max:13000,aria:'Capacidad bruta efectiva de CFE por tecnología'})+legend(['fosil','nuclear','renov'].map(f=>[FAM[f].n,FAM[f].c]))};
  $('#fAnio').onchange=r3;$('#fTec').onchange=r3;r3();
  $('#ch4').innerHTML=rangeChart();

  /* Comparador */
  const T=MATRIZ_2023.filter(r=>!/GD-FV|Cogeneración|Bioenergía|Otros/.test(r.t)).map(r=>r.t);
  ['cA','cB'].forEach((id,i)=>{$('#'+id).innerHTML=T.map((t,j)=>`<option${j===(i?5:0)?' selected':''}>${t}</option>`).join('')});
  const capMap={'Termoeléctrica convencional':'Vapor convencional','Eoloeléctrica':'Eoloeléctrica','Hidráulica':'Hidroeléctrica','Geotérmica':'Geotermoeléctrica'};
  const convMap={'Carboeléctrica':'Carboeléctrica / vapor','Termoeléctrica convencional':'Carboeléctrica / vapor','Turbogás':'Turbogás / combustión interna','Combustión interna':'Turbogás / combustión interna'};
  const info=t=>{const m=MATRIZ_2023.find(r=>r.t===t),cap=CAP_CFE.find(r=>r.t===(capMap[t]||t)),ip=IPCC[t],cv=CONVERSION[convMap[t]||t];
    return {grp:m.g==='fosil'?'Fósil':'Limpia (según clasificación de PRODESEN)',p:`${nf(m.p,2)} %`,gwh:`${nf(gw(m.p))} GWh (cálculo)`,
      cap:cap?`${nf(cap.a2023,2)} MW (solo CFE, 2023)`:ND,dir:ip?`${ip.d[1]} (rango ${ip.d[0]}–${ip.d[2]}) gCO2eq/kWh`:ND,
      cv:ip?`${ip.c[1]} (rango ${ip.c[0]}–${ip.c[2]}) gCO2eq/kWh`:ND,cad:cv?cv.pasos.join(' → '):ND}};
  const rcmp=()=>{const a=$('#cA').value,b=$('#cB').value,A=info(a),B=info(b);
    const rows=[['Grupo','grp'],['Participación en generación SEN 2023','p'],['Generación 2023','gwh'],['Capacidad CFE','cap'],['Emisiones directas (mediana, IPCC)','dir'],['Emisiones de ciclo de vida (mediana, IPCC)','cv'],['Cadena de conversión','cad']];
    $('#cmp').innerHTML=`<table><thead><tr><th>Característica</th><th>${esc(a)}</th><th>${esc(b)}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${A[r[1]]}</td><td>${B[r[1]]}</td></tr>`).join('')}</tbody></table>
    <p class="fuente">Participación: PRODESEN pdf-p97. Capacidad: Informe Anual CFE 2023, pdf-p20 (“Termoeléctrica convencional” se compara con “Vapor convencional” de CFE; en el SEN incluye también a privados). Emisiones: IPCC AR5 Anexo III (valores mundiales; la tabla no incluye termoeléctrica convencional, turbogás ni combustión interna, por eso aparece “Dato no disponible”).</p>`};
  $('#cA').onchange=rcmp;$('#cB').onchange=rcmp;rcmp();

  /* Verdadero o falso */
  const vfEl=$('#vf'),vfA={};
  const vfDraw=()=>{const done=Object.keys(vfA).length,ok=Object.keys(vfA).filter(i=>vfA[i]===VF[i].v).length;
    vfEl.innerHTML=`<h2>¿Verdadero o falso?</h2><p class="lead">Ocho afirmaciones sobre las tres familias. Elige y lee la explicación con su fuente.</p>
    ${VF.map((x,i)=>{const a=vfA[i],has=a!==undefined,right=has&&a===x.v;return `<div class="card ${has?(right?'ok':'bad'):''}" style="margin-bottom:10px"><p><b>${i+1}.</b> ${esc(x.q)}</p><div class="filters"><button class="b" data-i="${i}" data-a="1" ${has?'disabled':''}>Verdadero</button><button class="b" data-i="${i}" data-a="0" ${has?'disabled':''}>Falso</button></div>${has?`<p class="nota"><b>${right?'Correcto.':'No es así.'}</b> ${esc(x.why)}</p><p class="fuente">${tag('oficial','Oficial')} ${esc(x.src)}</p>`:''}</div>`}).join('')}
    <div class="filters"><strong aria-live="polite">${done?`Aciertos: ${ok} de ${done} respondidas (de ${VF.length}).`:''}</strong><button class="b" id="vfR">Reiniciar</button></div>`;
    vfEl.querySelectorAll('button[data-i]').forEach(b=>b.onclick=()=>{vfA[b.dataset.i]=b.dataset.a==='1';vfDraw()});
    $('#vfR').onclick=()=>{Object.keys(vfA).forEach(k=>delete vfA[k]);vfDraw()}};
  vfDraw();

  /* Reflexión */
  const Q=['En 2023 la generación hidráulica cayó 42 % respecto a 2022. ¿Qué te dice eso sobre depender de una sola fuente limpia?',
   'Explica con tus palabras por qué la energía nuclear es “limpia” según la ley pero no “renovable”.',
   'El ciclo combinado aportó 58.46 % de la generación en 2023. ¿Qué ventajas y qué riesgos ves en esa concentración?',
   'Compara las emisiones directas y de ciclo de vida de la solar fotovoltaica. ¿Por qué no son cero en ciclo de vida?',
   'Con tu consumo mensual y el factor de 0.438 kg CO2e/kWh, ¿qué acción concreta reduciría tu huella y cuánto?'];
  $('#refl').innerHTML=Q.map((q,i)=>`<div class="card" style="margin-bottom:10px"><label for="q${i}"><b>${i+1}.</b> ${esc(q)}</label><textarea id="q${i}">${esc(store.get('atlas_q'+i)||'')}</textarea></div>`).join('');
  Q.forEach((_,i)=>$('#q'+i).addEventListener('input',e=>store.set('atlas_q'+i,e.target.value)));
  $('#dl').onclick=()=>{const t=Q.map((q,i)=>`${i+1}. ${q}\n${$('#q'+i).value}\n`).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain;charset=utf-8'}));a.download='reflexion_modulo0.txt';a.click()};
}
build();

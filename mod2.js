'use strict';
/* Módulo 2: Transmisión eléctrica */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const C={cafe:'#7C2D12',teja:'#9A3412',nar:'#F97316',amb:'#FBBF24',txt:'#3A1608'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf=(n,d=0)=>Number(n).toLocaleString('es-MX',{minimumFractionDigits:d,maximumFractionDigits:d});
const ND='<span class="nd">Dato no disponible</span>';
const tip=t=>`<span class="def" tabindex="0" data-tip="${esc(GLOSARIO[t])}">${esc(t)}</span>`;
const tag=(k,t)=>`<span class="tag t-${k}">${t}</span>`;

/* ---- cálculo físico (trifásico equilibrado, solo resistencia) ---- */
const fp=W=>W>=1e6?nf(W/1e6,3)+' MW':W>=1e3?nf(W/1e3,1)+' kW':nf(W,0)+' W';
function txCalc(P_MW,V_kV,R_ohm,cosphi){
  const P=P_MW*1e6,V=V_kV*1e3;
  const I=P/(Math.sqrt(3)*V*cosphi);          // A
  const Pl=3*I*I*R_ohm;                        // W
  return {I,Pl_W:Pl,Pl_MW:Pl/1e6,pct:Pl/P*100,Prec_MW:(P-Pl)/1e6};
}
window.txCalc=txCalc;

/* ---- gráficas ---- */
function bars(rows,o={}){
  const W=720,lw=o.lw||150,rh=o.rh||26,h=rows.length*rh+12,max=Math.max(...rows.map(r=>r.v)),min=o.min||0,sc=(W-lw-(o.rm||120))/((max-min)||1);
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img" aria-label="${esc(o.aria||'Gráfica')}">`;
  rows.forEach((r,i)=>{const y=6+i*rh,w=Math.max((r.v-min)*sc,2);
    s+=`<text x="${lw-6}" y="${y+14}" text-anchor="end" font-size="12" fill="${C.txt}">${esc(r.l)}</text><rect x="${lw}" y="${y}" width="${w}" height="${rh-8}" rx="3" fill="${r.c||C.nar}" stroke="${C.cafe}" stroke-width="${r.sel?2:.5}"><title>${esc(r.l)}: ${esc(r.t)}</title></rect><text x="${lw+w+5}" y="${y+14}" font-size="12" fill="${C.txt}">${esc(r.t)}</text>`});
  return s+'</svg>';
}
function leg(items){return '<div class="legend">'+items.map(i=>`<span><i style="background:${i[1]};border:1px solid ${C.cafe}"></i>${i[0]}</span>`).join('')+'</div>'}
function line(pts,o){
  const W=360,H=250,m={l:58,r:14,t:16,b:40};
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y1=Math.max(...ys)*1.05;
  const X=x=>m.l+(x-x0)/(x1-x0)*(W-m.l-m.r),Y=y=>H-m.b-(y/y1)*(H-m.t-m.b);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(o.aria)}">`;
  for(let i=0;i<=4;i++){const v=y1*i/4;s+=`<line x1="${m.l}" x2="${W-m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#EBD3AE"/><text x="${m.l-6}" y="${Y(v)+4}" text-anchor="end" font-size="10" fill="${C.txt}">${nf(v,o.dy||0)}</text>`}
  [100,200,300,400].forEach(v=>{if(v>=x0&&v<=x1)s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${m.t}" y2="${H-m.b}" stroke="#EBD3AE"/><text x="${X(v)}" y="${H-m.b+14}" text-anchor="middle" font-size="10" fill="${C.txt}">${v}</text>`});
  s+=`<polyline fill="none" stroke="${C.cafe}" stroke-width="2.5" points="${pts.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' ')}"/>`;
  (o.std||[]).forEach(p=>{s+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.5" fill="${C.amb}" stroke="${C.cafe}"><title>${p[0]} kV: ${nf(p[1],o.dy||0)} ${o.u}</title></circle>`});
  if(o.cur&&o.cur[0]>=x0&&o.cur[0]<=x1)s+=`<circle cx="${X(o.cur[0])}" cy="${Y(Math.min(o.cur[1],y1))}" r="7" fill="${C.nar}" stroke="${C.txt}" stroke-width="2"><title>Valor actual: ${nf(o.cur[0],1)} kV, ${nf(o.cur[1],o.dy||0)} ${o.u}</title></circle>`;
  s+=`<text x="${(m.l+W-m.r)/2}" y="${H-4}" text-anchor="middle" font-size="11" fill="${C.txt}">Tensión entre líneas (kV)</text><text x="12" y="${H/2}" transform="rotate(-90 12 ${H/2})" text-anchor="middle" font-size="11" fill="${C.txt}">${esc(o.yl)}</text>`;
  return s+'</svg>';
}

/* ---- proyección del mapa ---- */
const LON0=-118.5,LON1=-86,LAT0=14.3,LAT1=32.9,K=28,CX=Math.cos(24*Math.PI/180);
const px=(lon,lat)=>[(lon-LON0)*K*CX,(LAT1-lat)*K];
const VBW=(LON1-LON0)*K*CX,VBH=(LAT1-LAT0)*K;
const pathOf=rs=>rs.map(r=>'M'+r.map(q=>px(q[0],q[1]).map(a=>a.toFixed(1)).join(',')).join('L')+'Z').join('');

function modulo2(){
  const el=$('#m2');
  el.innerHTML=`
  <h1>Transmisión eléctrica</h1>
  <p class="lead">La red de transmisión transporta la energía desde las centrales hasta las redes de distribución. En México no hay una sola red: el Sistema Eléctrico Nacional (${tip('SEN')}) tiene <b>cuatro sistemas interconectados</b> que no están unidos entre sí. Aquí se ven esos sistemas, los indicadores de la red y un simulador de pérdidas en una línea.</p>
  <div class="filters"><label>Sistema <select id="m2s"><option value="todos">Todos</option>${Object.keys(SISTEMAS).map(k=>`<option value="${k}">${k}</option>`).join('')}</select></label>
   <label>Año <select id="m2y"><option>2024</option><option>2023</option><option>2022</option><option>2021</option><option>2020</option></select></label>
   <button class="b" id="m2r">Restablecer</button></div>

  <h2>Los cuatro sistemas</h2>
  <div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(260px,1fr)">
   <div class="card"><div id="m2map"></div>${leg(Object.keys(SISTEMAS).map(k=>[SISTEMAS[k].n,SISTEMAS[k].c]))}
    <p class="fuente">${tag('estim','Esquema territorial')} Cada sistema se pinta por estado, salvo SIMUL, que se aproxima con el municipio de Mulegé (CONABIO, límites municipales 2023, vía PhantomInsights/mexico-geojson). Los límites eléctricos reales no coinciden exactamente con los político-administrativos. <b>El mapa no dibuja líneas de transmisión</b>: los documentos proporcionados no incluyen su trazado y no se inventan. Composición de sistemas: PLADESE (DOF 17-oct-2025), pdf-p7.</p></div>
   <div class="card" id="m2ficha" aria-live="polite"></div></div>

  <h3>Esquema de conexiones</h3>
  <div class="card" id="m2diag"></div>

  <h2>Indicadores de la red</h2>
  <div class="grid" id="m2kpi"></div>
  <h3>Longitud de las líneas</h3><div class="card"><div id="m2g1"></div>
   <p class="fuente">${tag('oficial','Oficial')} Kilómetros de líneas de la RNT (69 kV a 400 kV), CFE Transmisión. ${esc(TX.fuente)}. Una línea de doble circuito cuenta una vez por circuito (km-circuito). Para 2024, el PLADESE desglosa ${nf(TX2024.km161_400)} km de 161 a 400 kV y ${nf(TX2024.km69_138)} km de 69 a 138 kV (suman ${nf(TX2024.km161_400+TX2024.km69_138)} km, igual al dato de CFE).</p></div>
  <h3>Niveles de tensión</h3><div class="card" id="m2volt"></div>
  <h3>Subestaciones y capacidad de transformación</h3>
  <div class="card"><div id="m2g2"></div><div id="m2g3"></div>
   <p class="fuente">${tag('oficial','Oficial')} ${esc(TX.fuente)}. ${tip('MVA')}: capacidad de transformación de las subestaciones de la RNT. Al cierre de 2024 había 2,317 subestaciones: 608 de 161 kV o más y 1,709 de 161 kV o menos (IA2024 pdf-p80).</p></div>
  <h3>Capacidad de transformación según SENER (RNT y RGD)</h3><div class="card" id="m2g5"></div>
  <h3>Consumo neto por sistema</h3><div class="card"><div id="m2g4"></div></div>

  <h2>Simulador de transmisión</h2>
  <p class="lead">Calcula la corriente y las pérdidas resistivas de una línea trifásica. ${tag('simulacion','Simulación')} Los valores iniciales son ejemplos didácticos, no corresponden a una línea real.</p>
  <div class="card"><div class="filters">
   <label>Potencia P (MW) <input id="sP" type="number" min="0.1" step="any" value="100" style="width:100px"></label>
   <label>Tensión entre líneas V (kV) <input id="sV" type="number" min="1" step="any" value="230" style="width:100px"></label>
   <label>Resistencia por fase R (Ω) <input id="sR" type="number" min="0.001" step="any" value="10" style="width:100px"></label>
   <label>${tip('factor de potencia')} cos φ <input id="sF" type="number" min="0.5" max="1" step="0.01" value="1" style="width:80px"></label>
   <button class="b" id="sReset">Valores por defecto</button></div>
   <p id="sMsg" role="alert" style="color:#9A3412;font-weight:700"></p>
   <div class="grid" id="sOut"></div>
   <p class="nota" id="sInsight"></p></div>
  <div class="grid" style="margin-top:12px"><div class="card"><h3 style="margin-top:0">Corriente frente a tensión</h3><div id="sG1"></div></div>
   <div class="card"><h3 style="margin-top:0">Pérdidas resistivas (${tip('pérdidas Joule')}) frente a tensión</h3><div id="sG2"></div></div></div>
  <div class="card" style="margin-top:12px"><h3 style="margin-top:0">Cómo se encadenan tensión, corriente y pérdidas</h3>
   <p>Mueve la tensión de comparación V′ y mira qué pasa con la corriente y las pérdidas respecto al caso de arriba (misma potencia P, resistencia R y cos φ).</p>
   <div class="filters"><label>Tensión de comparación V′ <input type="range" id="sSl" min="50" max="450" step="1" aria-describedby="sSlV"></label> <b id="sSlV" aria-live="polite"></b></div>
   <div class="chain" id="sChain"></div>
   <h4 style="margin:14px 0 4px">Destino de la potencia P</h4><div id="sBar"></div>
   <h4 style="margin:14px 0 4px">Corriente y pérdidas relativas al caso actual (escala logarítmica)</h4><div id="sRel"></div>
   <p class="fuente">${tag('simulacion','Simulación')} Con P y cos φ constantes, I = P / (√3·V·cos φ), así que I′/I = V/V′; las pérdidas son 3·I²·R, así que P′<sub>pérdidas</sub>/P<sub>pérdidas</sub> = (V/V′)². En escala logarítmica ambas son rectas, con pendiente −1 (corriente) y −2 (pérdidas). Un valor de 1 equivale al caso actual.</p></div>
  <p class="fuente">Curva: P, R y cos φ fijos de los campos de arriba. Puntos amarillos: niveles de tensión de la RNT (69, 85, 115, 138, 161, 230 y 400 kV). Punto naranja: tu valor. <span id="sRange"></span></p>
  <div class="card tw"><h3 style="margin-top:0">Mismo caso en cada nivel de tensión de la RNT</h3><table id="sTab"></table></div>
  <div class="card"><h3 style="margin-top:0">Modelo y límites</h3>
   <p><b>Fórmulas:</b> I = P / (√3 · V · cos φ) y P<sub>pérdidas</sub> = 3 · I² · R. P es potencia activa en watts, V la tensión entre líneas en volts, I la corriente de línea en amperes y R la resistencia equivalente por fase en ohms.</p>
   <ul><li>Línea trifásica equilibrada, régimen senoidal permanente.</li>
   <li>Solo se considera la resistencia: no hay reactancia, capacitancia, efecto corona ni efecto piel, y R no cambia con la temperatura.</li>
   <li>Se usa V como tensión constante en el cálculo de I (no se resuelve la caída de tensión de la línea) y las pérdidas se calculan con esa corriente, sin iterar.</li>
   <li>R es un dato tuyo: la resistencia real depende del conductor, la longitud y la temperatura, y los documentos usados no la traen.</li>
   <li>Con cos φ menor que 1 la corriente crece como 1/cos φ y las pérdidas como 1/cos² φ.</li>
   <li>Si las pérdidas calculadas llegan a una fracción grande de P, el modelo deja de ser razonable y se avisa.</li></ul></div>`;

  const st={s:'todos',y:2024};
  /* mapa */
  function map(){
    const sel=st.s;let sv=`<svg viewBox="-40 0 ${VBW+40} ${VBH}" width="100%" role="group" aria-label="Mapa de los cuatro sistemas interconectados">`;
    const sysOf=k=>k==='02'?'SIBC':k==='03'?'SIBCS':'SIN';
    for(const k in ESTADOS){const sy=sysOf(k),dim=sel!=='todos'&&sel!==sy&&!(sel==='SIMUL'&&false);
      sv+=`<path d="${pathOf(ESTADOS[k].r)}" data-s="${sy}" tabindex="0" role="button" aria-label="${esc(SISTEMAS[sy].n)}: ${esc(ESTADOS[k].n)}" fill="${SISTEMAS[sy].c}" fill-opacity="${dim?.12:(sy==='SIN'?.45:.9)}" stroke="#7A5A4A" stroke-width=".7" fill-rule="evenodd" style="cursor:pointer"><title>${esc(ESTADOS[k].n)} · ${esc(SISTEMAS[sy].n)}</title></path>`}
    const dm=sel!=='todos'&&sel!=='SIMUL';
    sv+=`<path d="${pathOf(MULEGE)}" data-s="SIMUL" tabindex="0" role="button" aria-label="${esc(SISTEMAS.SIMUL.n)}" fill="${SISTEMAS.SIMUL.c}" fill-opacity="${dm?.12:1}" stroke="#fff" stroke-width=".6" style="cursor:pointer"><title>Municipio de Mulegé · ${esc(SISTEMAS.SIMUL.n)} (aproximación)</title></path>`;
    const lab=[['SIBC',-117.6,30.4,-115.4,30.2],['SIMUL',-116.9,27.4,-113.9,27.6],['SIBCS',-116.4,24.9,-111.8,24.9]];
    lab.forEach(l=>{const a=px(l[1],l[2]),b=px(l[3],l[4]);sv+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.txt}" stroke-width=".8"/><text x="${a[0]-4}" y="${a[1]+4}" text-anchor="end" font-size="11" font-weight="700" fill="${C.txt}">${l[0]}</text>`});
    const n=px(-101,24.8);sv+=`<text x="${n[0]}" y="${n[1]}" text-anchor="middle" font-size="16" font-weight="700" fill="${C.cafe}" fill-opacity=".7" style="pointer-events:none">SIN</text>`;
    $('#m2map').innerHTML=sv+'</svg>';
    document.querySelectorAll('#m2map [data-s]').forEach(p=>{const f=()=>{st.s=p.dataset.s;$('#m2s').value=st.s;all()};p.onclick=f;p.onkeydown=e=>{if(e.key==='Enter')f()}});
  }
  function ficha(){
    const k=st.s,f=$('#m2ficha');
    if(k==='todos'){f.innerHTML=`<h3 style="margin-top:0">SEN: 4 sistemas</h3><p>El SEN se compone de <b>8 gerencias de control regional</b> con 100 regiones de transmisión. Siete forman el SIN. La octava, Baja California, contiene tres sistemas separados: SIBC, SIBCS y SIMUL (PLADESE pdf-p7).</p><p>${tag('oficial','Oficial')} Consumo neto del SEN en 2023: ${nf(CONS.SEN[2])} GWh; el SIN aportó ${nf(CONS.SIN[2]/CONS.SEN[2]*100,1)} % ${tag('calculo','Cálculo')}.</p><p class="nota">Selecciona un sistema en el mapa o en el filtro.</p><p class="fuente">Consumo neto: PRODESEN 2024-2038, Cuadro 3.1, pdf-p38.</p>`;return}
    const S=SISTEMAS[k],v=CONS[k],ye=CONS.anios.indexOf(st.y);
    f.innerHTML=`<h3 style="margin-top:0">${esc(S.n)}</h3><p><b>Gerencias:</b> ${esc(S.gcr)}</p>
     ${bars(CONS.anios.map((a,i)=>({l:String(a),v:v[i],c:S.c==='#FBBF24'?C.amb:S.c,sel:a===st.y,t:nf(v[i])+' GWh'})),{lw:46,rh:28,aria:'Consumo neto del sistema'})}
     <p class="nota">${ye>=0?`Año ${st.y}: ${nf(v[ye])} GWh, ${nf(v[ye]/CONS.SEN[ye]*100,k==='SIN'?1:2)} % del SEN ${tag('calculo','Cálculo')}.`:`Consumo neto de ${st.y}: ${ND}.`} Crecimiento 2023: ${CONS.inc2023[k]>0?'+':''}${CONS.inc2023[k]} %.</p>
     <p>${esc(S.extra)}</p><p class="fuente">${tag('oficial','Oficial')} Consumo neto (GWh): SENER, PRODESEN 2024-2038, Cuadro 3.1, pdf-p38.${k!=='SIN'?' Ubicación: aproximación territorial.':''}</p>`;
  }
  function diag(){
    const g=['CEN','NES','NOR','NTE','OCC','ORI','PEN'];let s=`<svg viewBox="0 0 720 300" width="100%" role="img" aria-label="Esquema de conexiones entre sistemas: el SIN reúne siete gerencias; SIBC, SIBCS y SIMUL están separados">`;
    s+=`<rect x="10" y="10" width="440" height="280" rx="12" fill="#FFE6BC" stroke="${C.cafe}" stroke-width="2"/><text x="26" y="34" font-size="14" font-weight="700" fill="${C.cafe}">SIN: Sistema Interconectado Nacional</text>`;
    g.forEach((n,i)=>{const col=i%4,row=Math.floor(i/4),x=26+col*104,y=60+row*70;s+=`<rect x="${x}" y="${y}" width="92" height="50" rx="8" fill="#FFFBF3" stroke="${C.cafe}"/><text x="${x+46}" y="${y+22}" text-anchor="middle" font-size="14" font-weight="700" fill="${C.txt}">${n}</text><text x="${x+46}" y="${y+40}" text-anchor="middle" font-size="10" fill="${C.txt}">GCR</text>`});
    s+=`<text x="26" y="215" font-size="12" fill="${C.txt}">Las 7 gerencias están interconectadas mediante</text><text x="26" y="232" font-size="12" fill="${C.txt}">“enlaces equivalentes” entre sus 100 regiones de</text><text x="26" y="249" font-size="12" fill="${C.txt}">transmisión (PLADESE, Fig. 2.1). No se trazan</text><text x="26" y="266" font-size="12" fill="${C.txt}">enlaces individuales: no están en los documentos.</text>`;
    [['SIBC',C.nar,20],['SIBCS',C.teja,110],['SIMUL',C.txt,200]].forEach(a=>{s+=`<rect x="480" y="${a[2]}" width="230" height="70" rx="10" fill="#FFFBF3" stroke="${a[1]}" stroke-width="3" stroke-dasharray="7 4"/><text x="595" y="${a[2]+30}" text-anchor="middle" font-size="15" font-weight="700" fill="${C.txt}">${a[0]}</text><text x="595" y="${a[2]+47}" text-anchor="middle" font-size="11" fill="${C.txt}">GCR Baja California</text><text x="595" y="${a[2]+61}" text-anchor="middle" font-size="11" fill="${C.txt}">no interconectado al SIN</text>`});
    s+=`<text x="595" y="292" text-anchor="middle" font-size="11" fill="${C.txt}">Sin enlace entre sí ni con el SIN</text>`;
    $('#m2diag').innerHTML=s+`</svg><p class="fuente">${tag('estim','Esquema')} No es un plano geográfico. Los sistemas no interconectados suman 5.8 % del consumo bruto de 2024 (PLADESE pdf-p9). Además, el SEN tiene interconexiones internacionales con Estados Unidos, Belice y Guatemala (PLADESE pdf-p8); el documento no precisa aquí por qué línea ni sistema, así que no se dibujan.</p>`;
  }
  function kpis(){
    const j=TX.anios.indexOf(st.y);
    const k=[['Longitud de líneas',nf(TX.km[j])+' km',`${st.y}, RNT 69-400 kV`],['Subestaciones',nf(TX.sub[j]),st.y],['Capacidad de transformación',nf(TX.mva[j])+' MVA',st.y],['Capacidad media por subestación',nf(TX.mva[j]/TX.sub[j],1)+' MVA','Cálculo: MVA / subestaciones']];
    $('#m2kpi').innerHTML=k.map((x,i)=>`<div class="card kpi">${tag(i===3?'calculo':'oficial',i===3?'Cálculo':'Oficial · CFE')}<b>${x[1]}</b>${x[0]}<div class="fuente">${x[2]}${i<3?'. '+'IA2022 pdf-p125 / IA2024 pdf-p79':''}</div></div>`).join('');
    const rowsOf=key=>TX.anios.map((a,i)=>({l:String(a),v:TX[key][i],c:C.amb,sel:a===st.y,t:nf(TX[key][i])}));
    const pr=(key)=>{const r=rowsOf(key),mn=Math.min(...r.map(x=>x.v))*0.97;return bars(r,{lw:46,rh:26,min:mn,aria:key})};
    $('#m2g1').innerHTML=pr('km')+`<p class="nota">El eje empieza en un valor cercano al mínimo para que se aprecie el cambio; las diferencias son menores a 1 % entre 2020 y 2023 y de 0.5 % de 2023 a 2024.</p>`;
    $('#m2g2').innerHTML='<h4 style="margin:6px 0">Subestaciones</h4>'+pr('sub');
    $('#m2g3').innerHTML='<h4 style="margin:6px 0">Capacidad de transformación (MVA)</h4>'+pr('mva')+`<p class="nota">Las ordenadas no parten de cero. De 2023 a 2024 la capacidad aumentó ${nf(TX.mva[4]-TX.mva[3])} MVA (+${nf((TX.mva[4]/TX.mva[3]-1)*100,2)} %) ${tag('calculo','Cálculo')}; coincide con los 3,989 MVA del Informe Anual 2024.</p>`;
    const jv=TXV.anios.indexOf(st.y),NV=['400 kV','230 kV','161 kV','138 kV','115 kV','85 kV','69 kV'],tv=NV.reduce((a,k)=>a+TXV[k][jv],0);
    $('#m2volt').innerHTML=bars(NV.map(k=>({l:k,v:TXV[k][jv],c:['400 kV','230 kV','161 kV'].includes(k)?C.cafe:C.amb,t:nf(TXV[k][jv])+' km ('+nf(TXV[k][jv]/tv*100,1)+' %)'})),{lw:60,rm:180,aria:'Longitud de líneas por nivel de tensión'})+leg([['161 a 400 kV',C.cafe],['69 a 138 kV',C.amb]])+`
     <table style="margin-top:10px"><thead><tr><th>Red (${st.y})</th><th>Niveles de tensión</th><th>Longitud</th></tr></thead><tbody>
     <tr><td>${tip('RNT')}: transmisión</td><td>69 kV a 400 kV</td><td>${nf(TXV.sub161_400[jv]+TXV.sub69_138[jv])} km</td></tr>
     <tr><td>&nbsp;&nbsp;De 161 a 400 kV</td><td>161, 230 y 400 kV</td><td>${nf(TXV.sub161_400[jv])} km</td></tr>
     <tr><td>&nbsp;&nbsp;De 69 a 138 kV</td><td>69, 85, 115 y 138 kV</td><td>${nf(TXV.sub69_138[jv])} km</td></tr>
     <tr><td>${tip('RGD')}: media y baja tensión</td><td>más de 1 kV / hasta 1 kV</td><td>Ver Módulo 3</td></tr></tbody></table>
     <p class="fuente">${tag('oficial','Oficial')} SENER, PLADESE (DOF 17-oct-2025), Tabla 2.3, pdf-p11 (información del CENACE y de CFE). Porcentajes: ${tag('calculo','Cálculo')} sobre la suma de los siete niveles (${nf(tv)} km; el total publicado puede diferir 1 km por redondeo). En ${st.y} el nivel de 115 kV es el más largo.</p>
     <p class="nota"><b>Discrepancia entre fuentes:</b> la suma de la Tabla 2.3 (${nf(TXV.sub161_400[jv]+TXV.sub69_138[jv])} km en ${st.y}) ${(TXV.sub161_400[jv]+TXV.sub69_138[jv])===TX.km[jv]?'coincide':'difiere de '+nf(TX.km[jv])+' km, que reporta CFE Transmisión (diferencia '+nf(TXV.sub161_400[jv]+TXV.sub69_138[jv]-TX.km[jv])+' km, '+nf((TXV.sub161_400[jv]+TXV.sub69_138[jv])/TX.km[jv]*100-100,2)+' %)'}. De 2020 a 2023 hay diferencias de 0.18 a 0.26 %; en 2024 coinciden exactamente.</p>`;
    const jm=TXM.anios.indexOf(st.y);
    $('#m2g5').innerHTML=bars([{l:'Bancos de la RNT',v:TXM.rnt[jm],c:C.cafe,t:nf(TXM.rnt[jm])+' MVA'},{l:'Bancos de las RGD (MEM)',v:TXM.rgd[jm],c:C.amb,t:nf(TXM.rgd[jm])+' MVA'}],{lw:150,rm:130,aria:'Capacidad de transformación RNT y RGD'})+`<p class="fuente">${tag('oficial','Oficial')} SENER, PLADESE, Tabla 2.4, pdf-p11, ${st.y} (información del CENACE y de CFE). RNT + RGD = ${nf(TXM.rnt[jm]+TXM.rgd[jm])} MVA ${tag('calculo','Cálculo')}.</p><p class="nota"><b>No es la misma cifra que la de CFE:</b> CFE Transmisión reporta ${nf(TX.mva[jm])} MVA de “capacidad de transformación” en ${st.y}, y SENER reporta ${nf(TXM.rnt[jm])} MVA para los bancos de la RNT. Las definiciones y alcances son distintos y los documentos no explican la diferencia, así que no se suman ni se comparan. Además, la serie de la RNT de SENER cambia de nivel de 2016 a 2017 (de 169,382 a 109,591 MVA); aquí solo se usan 2020 a 2024.</p>`;
    const sy=CONS.anios.indexOf(st.y);
    $('#m2g4').innerHTML=sy<0?`<p>Consumo neto de ${st.y}: ${ND}. El PRODESEN 2024-2038 publica 2021 a 2023. Para 2024 solo hay el consumo bruto del SIN (338,994 GWh) y del SEN (359,807 GWh), PLADESE pdf-p9.</p>`:
      bars(Object.keys(CONS.GCR).map(n=>({l:n,v:CONS.GCR[n][sy],c:C.amb,t:nf(CONS.GCR[n][sy])+' GWh'})).concat(['SIBC','SIBCS','SIMUL'].map(n=>({l:n,v:CONS[n][sy],c:SISTEMAS[n].c,t:nf(CONS[n][sy])+' GWh'}))),{lw:130,rm:130,aria:'Consumo neto por gerencia y sistema'})+leg([['Gerencias del SIN',C.amb],['SIBC',C.nar],['SIBCS',C.teja],['SIMUL',C.txt]])+`<p class="fuente">${tag('oficial','Oficial')} SENER, PRODESEN 2024-2038, Cuadro 3.1, pdf-p38, ${st.y}. Consumo neto: energía usada por los suministros, exportaciones netas, pérdidas y usos propios. Total SEN ${nf(CONS.SEN[sy])} GWh. Las gerencias suman ${nf(Object.values(CONS.GCR).reduce((a,v)=>a+v[sy],0))} GWh, igual que el SIN (${nf(CONS.SIN[sy])} GWh) salvo redondeo.</p>`;
  }
  /* simulador */
  const STD=[69,85,115,138,161,230,400];
  function sim(){
    const P=parseFloat($('#sP').value),V=parseFloat($('#sV').value),R=parseFloat($('#sR').value),F=parseFloat($('#sF').value);
    const bad=!(P>0&&V>0&&R>0&&F>=0.5&&F<=1);
    $('#sMsg').textContent=bad?'Revisa los datos: P, V y R deben ser positivos y cos φ debe estar entre 0.5 y 1.':'';
    if(bad){$('#sOut').innerHTML='';rel();return}
    const r=txCalc(P,V,R,F),warn=r.pct>=10?`Las pérdidas son ${nf(r.pct,1)} % de P: el modelo simplificado deja de ser confiable (caída de tensión y reactancia serían relevantes).`:'';
    $('#sMsg').textContent=warn;
    $('#sOut').innerHTML=[['Corriente de línea I',nf(r.I,1)+' A'],['Pérdidas resistivas',fp(r.Pl_W)],['Pérdidas respecto a P',nf(r.pct,2)+' %'],['Potencia que llega (P − pérdidas)',r.pct>=100?'No aplica: las pérdidas igualan o superan a P':nf(r.Prec_MW,2)+' MW']].map(x=>`<div class="card kpi">${tag('simulacion','Simulación')}<b>${x[1]}</b>${x[0]}</div>`).join('');
    $('#sRange').textContent=(V<50||V>450)?`Tu tensión (${nf(V,1)} kV) queda fuera del rango graficado (50 a 450 kV): el punto naranja no aparece, pero los resultados de arriba sí corresponden a tu valor.`:'';
    const r2=txCalc(P,V*2,R,F);
    $('#sInsight').innerHTML=`Si duplicas la tensión a ${nf(V*2,0)} kV con la misma P, R y cos φ, la corriente baja a ${nf(r2.I,1)} A (la mitad) y las pérdidas a ${fp(r2.Pl_W)} (la cuarta parte): I ∝ 1/V y P<sub>pérdidas</sub> ∝ 1/V². ${F<1?`Con cos φ = ${F} la corriente es ${nf(1/F,2)} veces la que habría con cos φ = 1 y las pérdidas ${nf(1/(F*F),2)} veces.`:''}`;
    const pts=[];for(let v=50;v<=450;v+=5)pts.push([v,txCalc(P,v,R,F)]);
    const loss=x=>x.Pl_MW,cur=x=>x.I;
    $('#sG1').innerHTML=line(pts.map(p=>[p[0],cur(p[1])]),{aria:'Corriente en función de la tensión',yl:'Corriente (A)',u:'A',std:STD.map(v=>[v,cur(txCalc(P,v,R,F))]),cur:[V,r.I]});
    $('#sG2').innerHTML=line(pts.map(p=>[p[0],loss(p[1])]),{aria:'Pérdidas resistivas en función de la tensión',yl:'Pérdidas (MW)',u:'MW',dy:2,std:STD.map(v=>[v,loss(txCalc(P,v,R,F))]),cur:[V,r.Pl_MW]});
    $('#sTab').innerHTML=`<thead><tr><th>V (kV)</th><th>I (A)</th><th>Pérdidas (MW)</th><th>Pérdidas / P (%)</th></tr></thead><tbody>${STD.map(v=>{const q=txCalc(P,v,R,F);return `<tr><td>${v}</td><td>${nf(q.I,1)}</td><td>${nf(q.Pl_MW,3)}</td><td>${nf(q.pct,2)} ${q.pct>=10?'⚠':''}</td></tr>`}).join('')}</tbody>`;
    rel();
  }

  let lastV=null;
  function rel(){
    const P=parseFloat($('#sP').value),V=parseFloat($('#sV').value),R=parseFloat($('#sR').value),F=parseFloat($('#sF').value);
    if(!(P>0&&V>0&&R>0&&F>=0.5&&F<=1)){$('#sChain').innerHTML='';$('#sBar').innerHTML='';$('#sRel').innerHTML='';return}
    if(V!==lastV){lastV=V;const nx=STD.find(x=>x>V);$('#sSl').value=Math.min(450,Math.max(50,nx||V/2))}
    const Vp=parseFloat($('#sSl').value),a=txCalc(P,V,R,F),b=txCalc(P,Vp,R,F),k=Vp/V;
    $('#sSlV').textContent=nf(Vp,0)+' kV';
    const lf=x=>fp(x.Pl_W);
    $('#sChain').innerHTML=[`<b>V′ = ${nf(Vp,0)} kV</b><br>× ${nf(k,2)} respecto a ${nf(V,0)} kV`,`<b>I′ = ${nf(b.I,1)} A</b><br>× ${nf(b.I/a.I,3)} (= 1/${nf(k,2)})`,`<b>Pérdidas = ${lf(b)}</b><br>× ${nf(b.Pl_W/a.Pl_W,3)} (= 1/${nf(k*k,2)}); ${nf(b.pct,2)} % de P`].map((t,i)=>(i?'<span aria-hidden="true">→</span>':'')+`<div>${t}</div>`).join('');
    const W=720,lw=110,sc=(W-lw-20)/100,row=(l,x,y)=>{const lost=Math.min(100,x.pct),ok=100-lost;return `<text x="${lw-8}" y="${y+19}" text-anchor="end" font-size="12" fill="${C.txt}">${l}</text><rect x="${lw}" y="${y}" width="${ok*sc}" height="28" fill="${C.amb}" stroke="#fff"><title>Llega: ${nf(Math.max(0,x.Prec_MW),2)} MW</title></rect><rect x="${lw+ok*sc}" y="${y}" width="${lost*sc}" height="28" fill="${C.cafe}" stroke="#fff"><title>Pérdidas: ${lf(x)}</title></rect><text x="${lw+4}" y="${y+19}" font-size="12" font-weight="700" fill="${C.txt}">${ok>12?'Llega '+nf(ok,1)+' %':''}</text><text x="${lw+W*0+ok*sc+(lost*sc>60?lost*sc/2:-4)}" y="${y+19}" text-anchor="${lost*sc>60?'middle':'end'}" font-size="12" font-weight="700" fill="${lost*sc>60?'#fff':C.txt}">${lost*sc>60?nf(lost,1)+' %':''}</text>`};
    $('#sBar').innerHTML=`<svg viewBox="0 0 ${W} 80" width="100%" role="img" aria-label="Porcentaje de la potencia que llega y que se pierde, a ${nf(V,0)} kV y a ${nf(Vp,0)} kV">${row('V = '+nf(V,0)+' kV',a,2)}${row('V′ = '+nf(Vp,0)+' kV',b,40)}</svg>`+leg([['Potencia que llega',C.amb],['Pérdidas resistivas',C.cafe]])+(b.pct>=100?'<p class="nota" role="alert">A esta tensión las pérdidas igualarían o superarían P: el caso no es físicamente posible con estos datos.</p>':b.pct>=10?'<p class="nota">Las pérdidas superan 10 % de P: el modelo simplificado deja de ser confiable.</p>':'')+(a.pct>=100?'':'');
    const PW=720,PH=270,m={l:62,r:16,t:14,b:44},x0=Math.log10(50),x1=Math.log10(450),y0=Math.log10(0.02),y1=Math.log10(50);
    const X=v=>m.l+(Math.log10(v)-x0)/(x1-x0)*(PW-m.l-m.r),Y=v=>PH-m.b-(Math.log10(Math.min(50,Math.max(0.02,v)))-y0)/(y1-y0)*(PH-m.t-m.b);
    let g=`<svg viewBox="0 0 ${PW} ${PH}" width="100%" role="img" aria-label="Corriente y pérdidas relativas al caso actual frente a la tensión, escala logarítmica">`;
    [0.1,1,10].forEach(t=>{g+=`<line x1="${m.l}" x2="${PW-m.r}" y1="${Y(t)}" y2="${Y(t)}" stroke="${t===1?C.cafe:'#EBD3AE'}" ${t===1?'stroke-dasharray="4 4"':''}/><text x="${m.l-6}" y="${Y(t)+4}" text-anchor="end" font-size="11" fill="${C.txt}">${t}</text>`});
    [50,100,200,400].forEach(t=>{g+=`<line x1="${X(t)}" x2="${X(t)}" y1="${m.t}" y2="${PH-m.b}" stroke="#EBD3AE"/><text x="${X(t)}" y="${PH-m.b+14}" text-anchor="middle" font-size="11" fill="${C.txt}">${t}</text>`});
    const vs=[];for(let v=50;v<=450;v+=5)vs.push(v);
    g+=`<polyline fill="none" stroke="${C.nar}" stroke-width="2.6" points="${vs.map(v=>X(v).toFixed(1)+','+Y(V/v).toFixed(1)).join(' ')}"/><polyline fill="none" stroke="${C.cafe}" stroke-width="2.6" points="${vs.map(v=>X(v).toFixed(1)+','+Y((V/v)**2).toFixed(1)).join(' ')}"/>`;
    g+=`<line x1="${X(Vp)}" x2="${X(Vp)}" y1="${m.t}" y2="${PH-m.b}" stroke="${C.teja}" stroke-width="1.5"/><circle cx="${X(Vp)}" cy="${Y(V/Vp)}" r="6" fill="${C.nar}" stroke="#fff" stroke-width="2"><title>I′/I = ${nf(V/Vp,3)}</title></circle><circle cx="${X(Vp)}" cy="${Y((V/Vp)**2)}" r="6" fill="${C.cafe}" stroke="#fff" stroke-width="2"><title>Pérdidas′/Pérdidas = ${nf((V/Vp)**2,3)}</title></circle><circle cx="${X(Math.min(450,Math.max(50,V)))}" cy="${Y(1)}" r="5" fill="#fff" stroke="${C.cafe}" stroke-width="2"><title>Caso actual</title></circle>`;
    g+=`<text x="${(m.l+PW-m.r)/2}" y="${PH-4}" text-anchor="middle" font-size="11" fill="${C.txt}">Tensión (kV, escala logarítmica)</text><text x="12" y="${PH/2}" transform="rotate(-90 12 ${PH/2})" text-anchor="middle" font-size="11" fill="${C.txt}">Relativo al caso actual (= 1)</text>`;
    g+=`<text x="${m.l+8}" y="${PH-m.b-26}" font-size="11" font-weight="700" fill="${C.nar}">—— Corriente (∝ 1/V)</text><text x="${m.l+8}" y="${PH-m.b-11}" font-size="11" font-weight="700" fill="${C.cafe}">—— Pérdidas (∝ 1/V²)</text></svg>`;
    $('#sRel').innerHTML=g;
  }
  $('#sSl').addEventListener('input',rel);
  ['sP','sV','sR','sF'].forEach(i=>$('#'+i).addEventListener('input',sim));
  $('#sReset').onclick=()=>{$('#sP').value=100;$('#sV').value=230;$('#sR').value=10;$('#sF').value=1;sim()};
  function all(){map();ficha();kpis()}
  $('#m2s').onchange=e=>{st.s=e.target.value;all()};
  $('#m2y').onchange=e=>{st.y=Number(e.target.value);all()};
  $('#m2r').onclick=()=>{st.s='todos';st.y=2024;$('#m2s').value='todos';$('#m2y').value='2024';all()};
  diag();all();sim();
}
modulo2();
})();

/* Módulo 4: ¿Sabías que? y La reforma energética de 2013.
   Cada hallazgo: tag = oficial | calculo | simulacion; fuente = documento, página PDF y valor. Sin dato => "Dato no disponible". */
Object.assign(GLOSARIO,{
 'CENACE':'Centro Nacional de Control de Energía. En la Ley de la Industria Eléctrica (2014, art. 107) es un organismo público descentralizado a cargo del Control Operativo del Sistema Eléctrico Nacional; en la Ley del Sector Eléctrico (2025, art. 14) el Estado ejerce ese control a través de él.',
 'MEM':'Mercado Eléctrico Mayorista: sistema de transacciones operado por el CENACE (Ley del Sector Eléctrico, art. 3, fr. XXXI).',
 'Estricta separación legal':'Requisito de que generación, transmisión, distribución y comercialización se realicen de manera independiente (Ley de la Industria Eléctrica, art. 8, pdf-p49).',
 'Empresa productiva del Estado':'Figura jurídica con la que la reforma de 2013 (transitorio tercero) y la Ley de la CFE de 2014 (art. 2) definieron a CFE: propiedad exclusiva del Gobierno Federal, con personalidad jurídica y patrimonio propios.',
 'Empresa pública del Estado':'Figura con la que la Ley de la Empresa Pública del Estado, CFE (DOF 18-mar-2025, art. 2) define a CFE: entidad de la Administración Pública Federal sectorizada a la Secretaría de Energía.',
 'Planeación vinculante':'Planeación del sector eléctrico a cargo de la Secretaría de Energía, con carácter obligatorio (Ley del Sector Eléctrico, art. 12).',
 'SAIDID':'Índice de la duración promedio de las interrupciones del sistema, en minutos por usuario (nombre que usa CFE en el Programa de las RGD 2025-2039, Tabla V.1).',
 'SAIFID':'Índice de la frecuencia promedio de las interrupciones, en interrupciones por usuario (Programa de las RGD, Tabla V.1).',
 'CAIDID':'Duración promedio por interrupción, en minutos por interrupción (Programa de las RGD, Tabla V.1).',
 'Pérdidas no técnicas':'Según CFE, resultan principalmente del uso ilícito de la energía eléctrica y, en menor medida, de errores administrativos o fallas de medición (Programa de las RGD, pdf-p34).',
 'Transformador ideal':'Modelo sin pérdidas, sin flujo de dispersión y con núcleo de permeabilidad infinita: Vp/Vs = Np/Ns y Vp·Ip = Vs·Is.',
 'Relación de espiras':'Cociente a = Np/Ns entre el número de espiras del primario y del secundario. Si a > 1 reduce la tensión; si a < 1 la eleva.',
 'Servicio de suministro':'Acometida con contrato que CFE cuenta como servicio o usuario; no equivale a una persona.',
 'Capacidad instalada':'Potencia máxima que pueden entregar las centrales (MW). No es lo mismo que la energía generada (GWh), que depende de cuánto operan.'
});

const SABIAS_TEMAS=[
 {id:'recursos',n:'Recursos energéticos',c:'#FBBF24'},
 {id:'generacion',n:'Generación',c:'#F97316'},
 {id:'transmision',n:'Transmisión',c:'#9A3412'},
 {id:'distribucion',n:'Distribución',c:'#7C2D12'}
];

const SABIAS=[
 /* ---------- RECURSOS ---------- */
 {id:1,tema:'recursos',tag:'oficial',t:'Limpia no es lo mismo que renovable',
  dato:'3.42 %',datoL:'generación nuclear en el SEN, 2023',
  txt:'La Ley de Planeación y Transición Energética (art. 3, fr. X) enumera las fuentes renovables y no incluye el uranio. La Ley del Sector Eléctrico (art. 3, fr. XXI, inc. i) sí incluye la energía nucleoeléctrica entre las energías limpias. Por eso la nuclear es limpia según la ley, pero no renovable.',
  src:['LPTE (DOF 18-mar-2025), art. 3 fr. X, pdf-p192 del paquete DOF','LSE (DOF 18-mar-2025), art. 3 fr. XXI, pdf-p3 de la Ley','SENER, PRODESEN 2024-2038, Fig. 4.9, pdf-p97 (3.42 % nucleoeléctrica)'],
  nota:'La lista legal define las categorías; este atlas no evalúa otros criterios (seguridad, residuos).'},
 {id:2,tema:'recursos',tag:'oficial',t:'El agua es renovable solo bajo una condición',
  dato:'12,143.6 MW',datoL:'capacidad hidroeléctrica efectiva de CFE, 2023',
  txt:'La LPTE enumera como renovable “el movimiento del agua en cauces naturales o en aquellos artificiales con embalses ya existentes”. La redacción literal se refiere a embalses existentes; el atlas no interpreta cómo se aplicaría a presas nuevas.',
  src:['LPTE art. 3 fr. X inc. c, pdf-p192','CFE, Informe Anual 2024, capacidad efectiva 2023, pdf-p24 (12,143.6 MW; el Informe Anual 2023 da 12,443.6 MW, cifra que no suma con su total)'],
  nota:'Capacidad de CFE sin PIE; no es la hidroeléctrica de todo el SEN.'},
 {id:3,tema:'recursos',tag:'oficial',t:'Sin emisiones directas no significa sin emisiones',
  dato:'820 vs 11',datoL:'gCO₂eq/kWh de ciclo de vida, mediana: carbón vs eólica terrestre',
  txt:'El IPCC reporta emisiones de ciclo de vida (mediana) de 820 g para el carbón, 490 para el gas en ciclo combinado, 48 para la solar fotovoltaica de utilidad, 38 para la geotermia, 24 para la hidroeléctrica, 12 para la nuclear y 11 para la eólica terrestre. Las tecnologías sin combustión tienen emisiones directas de cero, pero no de ciclo de vida. El rango de la hidroeléctrica es muy amplio (de 1 a 2,200).',
  src:['IPCC AR5 WGIII, Anexo III, Tabla A.III.2, pdf-p7 (2014), gCO₂eq/kWh'],
  nota:'Valores genéricos del IPCC, no específicos de México.'},
 {id:4,tema:'recursos',tag:'oficial',t:'El hidrógeno no es una fuente: su origen decide si es limpio',
  dato:'Condicional',datoL:'según eficiencia y emisiones de ciclo de vida',
  txt:'La Ley del Sector Eléctrico (art. 3, fr. XXI, inc. g) lo considera energía limpia solo si cumple la eficiencia mínima que fije la CNE y los criterios de emisiones de ciclo de vida de SEMARNAT. Un hidrógeno obtenido de combustibles fósiles tiene origen fósil. La ley trata igual de forma condicionada a la cogeneración eficiente (inc. k) y a los residuos urbanos (inc. j).',
  src:['LSE art. 3 fr. XXI incs. g, j y k, pdf-p3 de la Ley'],
  nota:'No hay cifras de generación con hidrógeno en los documentos consultados: Dato no disponible.'},
 {id:5,tema:'recursos',tag:'calculo',t:'Tres de cada cuatro kWh del SEN vinieron de tecnologías fósiles',
  dato:'75.68 %',datoL:'tecnologías fósiles en la generación del SEN, 2023',
  txt:'Sumando ciclo combinado (58.46 %), termoeléctrica convencional (8.63 %), carboeléctrica (4.05 %), turbogás (3.51 %) y combustión interna (1.03 %), las tecnologías fósiles aportan 75.68 %; el resto (24.32 %) es limpio e incluye generación distribuida fotovoltaica. “Ciclo combinado” es una tecnología, no un combustible: el atlas no asume el combustible de cada central.',
  src:['SENER, PRODESEN 2024-2038, cap. 4, Fig. 4.9, pdf-p97 (base: 351,695 GWh, incluye GD-FV de 5,191 GWh)','Suma y complemento: cálculo de este atlas'],
  nota:'PRODESEN 2022 usa otra metodología (31.2 % limpia); las cifras de años distintos no se comparan sin reservas.'},

 /* ---------- GENERACIÓN ---------- */
 {id:6,tema:'generacion',tag:'calculo',t:'El ciclo combinado de CFE trabaja mucho más tiempo que el vapor convencional',
  dato:'64.1 % vs 33.0 %',datoL:'factor de planta 2024: ciclo combinado vs vapor',
  txt:'Con la generación bruta y la capacidad efectiva de CFE, el factor de planta del ciclo combinado pasó de 52.7 % (2022) a 60.9 % (2023) y 64.1 % (2024). El de las plantas de vapor convencional fue 20.7 %, 34.4 % y 33.0 %. Factor de planta = energía generada / (capacidad × horas del año).',
  src:['CFE, Informe Anual 2023, generación agregada 2022, pdf-p304, e Informe Anual 2024, SIACIG, pdf-p29','Capacidad efectiva: IA 2023 pdf-p20; IA 2024 pdf-p24','Horas: 8,760 (2022 y 2023) y 8,784 (2024). Cociente: cálculo'],
  nota:'Solo centrales de CFE (sin PIE); generación bruta.'},
 {id:7,tema:'generacion',tag:'calculo',t:'La participación limpia en la generación neta bajó entre 2022 y 2024',
  dato:'26.7 % → 23.4 %',datoL:'energía limpia / generación neta inyectada al SEN',
  txt:'El PLADESE reporta generación neta limpia de 89,109, 80,358 y 82,426 GWh y generación neta total de 333,964, 346,501 y 352,305 GWh para 2022, 2023 y 2024. Los porcentajes (26.7 %, 23.2 % y 23.4 %) son un cálculo. El 24.32 % del PRODESEN para 2023 incluye la generación distribuida; el 23.2 % de aquí no.',
  src:['SENER, PLADESE (DOF 17-oct-2025), Tabla 2.2, pdf-p10','Cociente: cálculo de este atlas'],
  nota:'No se atribuye la variación a una causa: los documentos no la explican.'},
 {id:8,tema:'generacion',tag:'oficial',t:'Eólica y solar fotovoltaica pasaron de casi nada a casi 15,500 MW',
  dato:'1,097 → 7,512 MW',datoL:'capacidad eólica instalada del SEN, 2012 y 2024',
  txt:'La capacidad solar fotovoltaica interconectada pasó de 1 MW (2012) a 7,961 MW (2024) y la eólica de 1,097 a 7,512 MW; juntas suman 15,473 MW (cálculo). El ritmo cambió: entre 2012 y 2020 la solar subió a 5,149 MW y la eólica a 6,504 MW, y de 2020 a 2024 sumaron 2,812 MW y 1,008 MW más (cálculo).',
  src:['SENER, PLADESE (DOF 17-oct-2025), Tabla 2.1, pdf-p10 (2010 a 2024)','Sumas y diferencias: cálculo de este atlas'],
  nota:'Capacidad de todo el SEN (CFE, PIE, autoabasto, cogeneración, pequeño productor y otros), no solo de CFE.'},
 {id:9,tema:'generacion',tag:'calculo',t:'CFE generó 9 % más en 2024 que en 2022',
  dato:'+9.0 %',datoL:'generación bruta de CFE, 2022 a 2024',
  txt:'La generación bruta de las centrales de CFE pasó de 141,343 GWh (2022) a 150,462 GWh (2023) y 154,059 GWh (2024). La variación de +9.0 % es un cálculo. Es energía bruta de CFE, no la generación neta del SEN: no se divide una entre otra.',
  src:['CFE, Informe Anual 2023, pdf-p304 (2022); Informe Anual 2024, pdf-p29 (2023 y 2024)'],
  nota:'Generación bruta de CFE (sin PIE). Base distinta de la del SEN.'},
 {id:10,tema:'generacion',tag:'calculo',t:'Los paneles de los techos ya pesan en el balance nacional',
  dato:'5,191 GWh',datoL:'generación distribuida fotovoltaica, 2023 (1.48 % del SEN)',
  txt:'El PRODESEN 2024-2038 incluye en la generación del SEN 5,191 GWh de generación distribuida fotovoltaica (GD-FV), equivalentes a 1.48 % de los 351,695 GWh del año. El 1.48 % es un cálculo y coincide con el de la figura.',
  src:['SENER, PRODESEN 2024-2038, cap. 4, Fig. 4.9, pdf-p97','Cociente: cálculo de este atlas'],
  nota:'La GD-FV se reporta aparte de las centrales de CFE y de las del mercado.'},

 /* ---------- TRANSMISIÓN ---------- */
 {id:11,tema:'transmision',tag:'calculo',t:'La red de transmisión casi no creció en cuatro años',
  dato:'+0.77 %',datoL:'longitud de la RNT, 2020 a 2024',
  txt:'CFE Transmisión reporta 110,294 km en 2020 y 111,138 km en 2024, un aumento de 844 km. El cálculo de +0.77 % es de este atlas. La misma cifra de 2024 (111,138 km) coincide con la suma por nivel de tensión del PLADESE.',
  src:['CFE, Informe Anual 2022, pdf-p125 (2020-2022) e Informe Anual 2024, pdf-p79 (2022-2024)','SENER, PLADESE, Tabla 2.3, pdf-p11 (suma 111,139 km por redondeo)'],
  nota:'Otras fuentes oficiales dan kilómetros y MVA distintos; se señalan en el Módulo 2.'},
 {id:12,tema:'transmision',tag:'calculo',t:'La mitad de la red troncal es de 400 y 230 kV',
  dato:'50.6 %',datoL:'de los 111,138 km de la RNT, 2024',
  txt:'400 kV suma 26,451 km y 230 kV suma 29,749 km: 56,200 km. El nivel de 115 kV aporta otros 48,717 km (43.8 %). Los niveles de 161, 138, 85 y 69 kV suman el resto. Los porcentajes son un cálculo.',
  src:['SENER, PLADESE (DOF 17-oct-2025), Tabla 2.3, pdf-p11 (transcrita de la tabla completa)'],
  nota:'Es longitud de líneas, no capacidad de transporte.'},
 {id:13,tema:'transmision',tag:'calculo',t:'La capacidad de transformación creció mucho más en distribución que en transmisión',
  dato:'+8.4 % vs +1.6 %',datoL:'MVA en RGD y en RNT, 2020 a 2024',
  txt:'La capacidad de transformación de las RGD pasó de 75,192 a 81,504 MVA y la de la RNT de 114,807 a 116,625 MVA. En la RNT el valor de 2023 (113,688 MVA) fue menor que el de 2022 (116,082 MVA); el documento no lo explica. CFE Transmisión reporta otro total (168,981 MVA en 2024) y las bases no se concilian.',
  src:['SENER, PLADESE, Tabla 2.4, pdf-p11','CFE, Informe Anual 2024, pdf-p79 (168,981 MVA)','Variaciones: cálculo'],
  nota:'Los alcances de las tablas pueden diferir; no se suman entre fuentes.'},
 {id:14,tema:'transmision',tag:'simulacion',t:'Duplicar la tensión divide entre cuatro las pérdidas',
  dato:'8.38 → 2.09 MW',datoL:'pérdidas Joule al pasar de 115 a 230 kV',
  txt:'Para transmitir 100 MW con factor de potencia 0.95 por una línea de 10 Ω por fase, la corriente es 528.5 A a 115 kV y 264.2 A a 230 kV. Como las pérdidas son 3·I²·R, bajan a la cuarta parte: de 8.38 MW (8.4 %) a 2.09 MW (2.1 %). Se puede reproducir en el simulador del Módulo 2.',
  src:['Modelo del Módulo 2: I = P / (√3·V·cosφ); Ppérdidas = 3·I²·R (trifásico balanceado, solo resistencia)','Los 10 Ω son un valor didáctico, no el de una línea de CFE'],
  nota:'Es una simulación; no incluye reactancia, efecto corona ni variación de la resistencia.'},
 {id:15,tema:'transmision',tag:'calculo',t:'El SEN no es una sola red: el 94 % del consumo está en el SIN',
  dato:'94.4 %',datoL:'del consumo neto del SEN en el SIN, 2023',
  txt:'El SIN consumió 326,027 GWh de los 345,439 GWh del SEN en 2023. Los sistemas de Baja California (15,999 GWh), Baja California Sur (3,257 GWh) y Mulegé (157 GWh) operan sin conexión con él. Baja California Sur creció 9.9 % ese año. El porcentaje es un cálculo.',
  src:['SENER, PRODESEN 2024-2038, Cuadro 3.1, pdf-p38 (consumo neto, GWh)'],
  nota:'El PLADESE da 94.2 % con consumo bruto de 2024 (pdf-p9): otra base y otro año.'},

 /* ---------- DISTRIBUCIÓN ---------- */
 {id:16,tema:'distribucion',tag:'oficial',t:'CFE Distribución se organiza en 16 divisiones y 150 zonas',
  dato:'49.1 M',datoL:'servicios atendidos, 2024',
  txt:'El Programa de Ampliación y Modernización de las RGD describe 16 divisiones de distribución formalmente constituidas, con 150 zonas. CFE reporta 49,101 miles de servicios en 2024, 555,336 km de líneas de media tensión y 345,966 km de baja tensión.',
  src:['CFE Distribución, Programa de las RGD 2025-2039, pdf-p14 (divisiones y zonas); Tablas III.1 y III.3, pdf-p15/16'],
  nota:'“Servicio” es una acometida con contrato; no es lo mismo que persona.'},
 {id:17,tema:'distribucion',tag:'calculo',t:'La tasa de crecimiento de servicios publicada usa 11 periodos, no 12',
  dato:'2.76 % vs 2.53 %',datoL:'tasa publicada vs tasa a 12 años',
  txt:'Los servicios pasaron de 36,400 miles (2012) a 49,101 miles (2024). CFE publica 2.76 % anual. Ese valor coincide con 11 periodos de capitalización; con los 12 años entre 2012 y 2024 sale 2.53 %. Lo mismo ocurre con las demás columnas de la tabla. El documento no aclara el motivo.',
  src:['CFE Distribución, Programa de las RGD, Tabla III.1, pdf-p16 (fila “% anual”)','Recálculo: de este atlas'],
  nota:'No se corrigió la cifra oficial; se señala la diferencia.'},
 {id:18,tema:'distribucion',tag:'oficial',t:'Las pérdidas no técnicas varían más de cinco veces entre divisiones',
  dato:'2.57 % – 14.33 %',datoL:'pérdidas no técnicas 2024: Centro Occidente y Oriente',
  txt:'CFE reporta pérdidas no técnicas de 2.57 % en Centro Occidente y de 14.33 % en Oriente (nacional: 8.64 %, datos preliminares). CFE explica que son principalmente uso ilícito de energía y, en menor medida, errores administrativos o de medición. El valor nacional no describe a ninguna división.',
  src:['CFE Distribución, Programa de las RGD, Tabla V.5, pdf-p37 (preliminar); definición en pdf-p34'],
  nota:'El documento no concilia estas cifras con el 12.88 % del Informe Anual 2024.'},
 {id:19,tema:'distribucion',tag:'oficial',t:'Una interrupción dura distinto según la región, y el Sureste es el más afectado',
  dato:'8.67 – 30.68 min',datoL:'SAIDID 2024: Centro Oriente y Sureste (nacional 16.71)',
  txt:'El SAIDID (minutos por usuario) va de 8.67 en Centro Oriente a 30.68 en Sureste. El Sureste mejoró de 36.33 en 2023, pero sigue siendo el más alto. A nivel nacional el índice bajó 1.08 minutos (6.1 %). CFE evalúa estos índices sobre circuitos de media tensión.',
  src:['CFE Distribución, Programa de las RGD, Tabla V.1, pdf-p28; texto en pdf-p29 (mejora 6.1 %) y pdf-p27'],
  nota:'Datos preliminares de 2024. El documento llama SAIDID, SAIFID y CAIDID a estos índices.'},
 {id:20,tema:'distribucion',tag:'calculo',t:'Casi uno de cada cinco kWh perdidos en las redes se pierde en los transformadores de poste',
  dato:'19.7 %',datoL:'de las pérdidas técnicas de las RGD, 2024',
  txt:'CFE tiene 1,660,977 transformadores de media a baja tensión con 60,912 MVA, un promedio de 36.7 kVA. Sus pérdidas técnicas en 2024 fueron 2.433 TWh de un total de 12.351 TWh (19.7 %). El promedio y el porcentaje son cálculos de este atlas.',
  src:['CFE Distribución, Programa de las RGD, Tabla III.2, pdf-p16 (transformadores); Tabla V.4, pdf-p37 (pérdidas, preliminar)'],
  nota:'Un transformador ideal, como el del simulador, no tiene estas pérdidas.'}
];

/* ---------- LA REFORMA ENERGÉTICA DE 2013 ---------- */
const REF_LINEA=[
 {id:'a',f:'20-dic-2013',nivel:'Constitución',t:'Decreto constitucional en materia de energía',
  txt:'Reforma los artículos 25, 27 y 28. En el art. 27 (párrafo sexto) corresponde exclusivamente a la Nación la planeación y el control del sistema eléctrico y el servicio público de transmisión y distribución; no se otorgan concesiones, pero el Estado puede celebrar contratos con particulares. Los transitorios ordenan que CFE se convierta en empresa productiva del Estado en máximo dos años (tercero), que se cree el CENACE (décimo sexto), que SENER fije la estricta separación legal (décimo) y que la CRE sea órgano regulador coordinado (décimo segundo).',
  src:'DOF 20-dic-2013, art. 27 párr. sexto y transitorios 3, 10, 11, 12 y 16'},
 {id:'b',f:'11-ago-2014',nivel:'Leyes secundarias',t:'Ley de la Industria Eléctrica y Ley de la CFE',
  txt:'Se expiden la Ley de la Industria Eléctrica (LIE), la Ley de la CFE y la Ley de los Órganos Reguladores Coordinados. El art. 4 de la LIE señala que la generación y la comercialización se prestan en “régimen de libre competencia”; el art. 8 exige estricta separación legal; el art. 107 crea al CENACE como organismo público descentralizado; el art. 2 de la Ley de la CFE la define como empresa productiva del Estado.',
  src:'DOF 11-ago-2014 (edición vespertina): LIE pdf-p44 (art. 4 pdf-p48; art. 8 pdf-p49; art. 107 pdf-p70); Ley de la CFE art. 2, pdf-p219; Ley de los Órganos Reguladores, pdf-p102'},
 {id:'c',f:'11-ene-2016',nivel:'Disposición administrativa',t:'Términos para la Estricta Separación Legal de CFE',
  txt:'Emitidos por la Secretaría de Energía. Este atlas no dispone del texto; solo consta su existencia y fecha por la mención del transitorio décimo tercero del decreto de 2025, que los deroga en lo que se opongan.',
  src:'Mencionados en DOF 18-mar-2025, transitorio décimo tercero, pdf-p134 del paquete DOF'},
 {id:'d',f:'31-oct-2024',nivel:'Constitución',t:'Reforma en materia de áreas y empresas estratégicas',
  txt:'Reforma el párrafo quinto del art. 25, los párrafos sexto y séptimo del 27 y el cuarto del 28. El art. 25 establece que el sector público tiene a su cargo, de manera exclusiva, las áreas estratégicas, y que el Gobierno Federal mantiene la propiedad y el control de las empresas públicas del Estado.',
  src:'DOF 31-oct-2024, decreto, art. único (art. 25 párr. quinto)'},
 {id:'e',f:'18-mar-2025',nivel:'Leyes secundarias',t:'Ley del Sector Eléctrico, Ley de la Empresa Pública del Estado CFE y otras',
  txt:'El mismo decreto expide la Ley del Sector Eléctrico (LSE), la Ley de la Empresa Pública del Estado CFE, la Ley de Planeación y Transición Energética y la Ley de la CNE. El art. 12 de la LSE obliga a que el Estado mantenga al menos 54 % del promedio de la energía inyectada a la red en un año calendario. El art. 4 habla de “régimen de competencia, sin prevalencia para los particulares”.',
  src:'DOF 18-mar-2025: LSE art. 12 (pdf-p15 de la Ley) y art. 4 (pdf-p7); Ley de la CFE art. 2, pdf-p1 del paquete DOF'},
 {id:'f',f:'17-oct-2025',nivel:'Planeación',t:'Plan de Desarrollo del Sector Eléctrico (PLADESE)',
  txt:'La SENER publica el PLADESE en el DOF. Indica que el Estado debe mantener al menos 54 % de la energía inyectada y proyecta una participación de las empresas públicas (CFE, FONADIN y PEMEX) superior a 54 % en 2026-2030, con 59 % en 2030. Es una proyección de planeación, no un resultado observado.',
  src:'SENER, PLADESE (DOF 17-oct-2025), pdf-p28'}
];

const REF_CAMBIOS=[
 {id:1,t:'Áreas estratégicas',a:'2013: planeación y control del sistema eléctrico y servicio público de transmisión y distribución son exclusivos de la Nación; sin concesiones, con posibles contratos con particulares.',b:'2014: la LIE reproduce esa división: generación y comercialización en libre competencia (art. 4).',c:'2024-2025: el art. 25 reitera lo exclusivo del sector público y la LSE (art. 4) agrega “sin prevalencia para los particulares”.',src:'DOF 2013 art. 27; LIE pdf-p48; DOF 2024; LSE pdf-p7'},
 {id:2,t:'Régimen jurídico de CFE',a:'2013: de organismo descentralizado a empresa productiva del Estado en máximo dos años (transitorio 3).',b:'2014: Ley de la CFE, art. 2: empresa productiva del Estado de propiedad exclusiva del Gobierno Federal.',c:'2025: Ley de la Empresa Pública del Estado, CFE, art. 2: entidad de la Administración Pública Federal sectorizada a SENER.',src:'DOF 2013 trans. 3; ves2014 pdf-p219; paquete DOF 2025 pdf-p1'},
 {id:3,t:'Operación y mercado',a:'2013: el CENACE se crea como organismo público descentralizado para el control operativo y la operación del mercado mayorista (transitorio 16).',b:'2014: LIE art. 107 crea al CENACE.',c:'2025: la LSE mantiene el CENACE y el MEM (art. 3 fr. XXXI y art. 14).',src:'DOF 2013 trans. 16; LIE pdf-p70; LSE pdf-p5 y pdf-p15'},
 {id:4,t:'Regulación',a:'2013: la CRE regula y da permisos de generación y fija tarifas de porteo; pasa a órgano regulador coordinado (transitorios 10 y 12).',b:'2014: Ley de los Órganos Reguladores Coordinados en Materia Energética.',c:'2025: la Comisión Nacional de Energía (CNE) aparece como autoridad en la LSE (art. 3 fr. XIII).',src:'DOF 2013 trans. 10 y 12; ves2014 pdf-p102; LSE pdf-p3'},
 {id:5,t:'Separación entre actividades',a:'2013: SENER establecerá los términos de estricta separación legal (transitorio 10).',b:'2014: LIE art. 8: actividades independientes y bajo estricta separación legal.',c:'2025: se derogan los Términos de 2016 en lo que se opongan al decreto (transitorio décimo tercero).',src:'DOF 2013 trans. 10; ves2014 pdf-p49; paquete DOF 2025 pdf-p134'},
 {id:6,t:'Participación mínima del Estado en energía inyectada',a:'2013: Dato no disponible (el decreto no fija un porcentaje).',b:'2014: Dato no disponible en los artículos consultados.',c:'2025: LSE art. 12: al menos 54 % del promedio anual de energía inyectada; PLADESE proyecta 59 % en 2030.',src:'LSE pdf-p15; PLADESE pdf-p28'}
];

/* Tabla 2.1 PLADESE, pdf-p10: capacidad instalada 2010-2024, MW (captura de la tabla completa proporcionada por la autora) */
const REF_CAP={anios:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
 total:[55090,54656,55692,57413,62359,63545,73242,68051,72958,78447,83122,86154,87131,89007,90543],
 limpia:[14383,14302,15290,15516,18593,19079,20911,20884,23947,26900,29507,30813,31369,32449,33441],
 eolica:[449,450,1097,1431,2660,2877,3735,3898,4866,6050,6504,6977,6921,7055,7512],
 solar:[0,0,1,11,55,57,145,171,1878,3646,5149,5955,6515,7437,7961],
 src:'SENER, PLADESE (DOF 17-oct-2025), Tabla 2.1 y texto, pdf-p10'};

const REF_REP=[
 {id:1,t:'Se creó el CENACE y el Mercado Eléctrico Mayorista, y siguen existiendo en 2025',
  muestra:'La LIE de 2014 (art. 107) crea al CENACE. La LSE de 2025 mantiene al CENACE y al MEM (art. 3 fr. XXXI; art. 14).',
  noconcluye:'La existencia legal no mide cuánta energía se transa en el mercado: los documentos consultados no dan ese dato.',
  src:'LIE pdf-p70; LSE pdf-p5, pdf-p15'},
 {id:2,t:'La capacidad instalada del SEN creció 57.7 % entre 2013 y 2024',
  muestra:'De 57,413 MW (2013) a 90,543 MW (2024). Entre 2013 y 2014 subió de 57,413 a 62,359 MW (+8.6 %). Los porcentajes son cálculos de este atlas con datos del PLADESE.',
  noconcluye:'La serie incluye todas las modalidades y no separa causas (demanda, costos de las tecnologías, programas anteriores). No prueba que la reforma haya causado el aumento. La serie no es monótona (73,242 MW en 2016 y 68,051 MW en 2017) y el documento no lo explica.',
  src:'PLADESE Tabla 2.1, pdf-p10'},
 {id:3,t:'La capacidad limpia se más que duplicó entre 2013 y 2024',
  muestra:'De 15,516 MW a 33,441 MW (+115.5 %, cálculo). En 2024 subió 3.1 % respecto de 2023 (32,449 MW), según el PLADESE.',
  noconcluye:'No se separa la parte de CFE de la de otros propietarios, ni se prueba una relación causal con la reforma. La Tabla 2.1 incluye en la capacidad limpia la hidroeléctrica, la nuclear y la cogeneración eficiente, que ya existían en 2013.',
  src:'PLADESE Tabla 2.1 y texto, pdf-p10'},
 {id:4,t:'Eólica y solar fotovoltaica pasaron de ser marginales a sumar 15,473 MW',
  muestra:'Eólica: de 1,431 MW (2013) a 7,512 MW (2024). Solar fotovoltaica: de 11 MW a 7,961 MW. La suma de 2024 es un cálculo. El PLADESE atribuye 37.1 % del crecimiento limpio de 2010 a 2024 a la eólica y 41.8 % a la solar.',
  noconcluye:'Cronología, no causa. Los documentos consultados no separan cuánto se instaló por cada esquema legal.',
  src:'PLADESE Tabla 2.1 y texto, pdf-p10'},
 {id:5,t:'La proporción limpia de la capacidad es estable desde 2021, pero la de la generación bajó',
  muestra:'Capacidad limpia sobre total: 36.0 % (2022), 36.5 % (2023) y 36.9 % (2024). Generación neta limpia sobre total: 26.7 % (2022), 23.2 % (2023) y 23.4 % (2024). Todos los porcentajes son cálculos con las Tablas 2.1 y 2.2.',
  noconcluye:'Capacidad no es energía generada: el documento no explica la brecha. Las tablas miden cosas distintas (capacidad instalada frente a generación neta inyectada).',
  src:'PLADESE Tabla 2.1 y Tabla 2.2, pdf-p10'},
 {id:6,t:'En 2025 la ley fija una participación mínima del Estado',
  muestra:'La LSE (art. 12) exige al menos 54 % del promedio de la energía inyectada a la red. El PLADESE proyecta 59 % en 2030 para las empresas públicas (CFE, FONADIN y PEMEX).',
  noconcluye:'La cifra de 2030 es una proyección de planeación. Los documentos consultados no dan la participación observada del Estado en 2024: Dato no disponible.',
  src:'LSE pdf-p15; PLADESE pdf-p28'}
];

const REF_COMP=[
 {k:'Capacidad instalada del SEN (MW)',a:'57,413',b:'62,359',c:'90,543',cx:'+57.7 % frente a 2013 (cálculo)',tag:'oficial',src:'PLADESE Tabla 2.1, pdf-p10'},
 {k:'Capacidad limpia (MW)',a:'15,516',b:'18,593',c:'33,441',cx:'27.0 % de la capacidad en 2013 y 36.9 % en 2024 (cálculo)',tag:'oficial',src:'PLADESE pdf-p10'},
 {k:'Capacidad eólica (MW)',a:'1,431',b:'2,660',c:'7,512',cx:'Capacidad de todo el SEN',tag:'oficial',src:'PLADESE Tabla 2.1'},
 {k:'Capacidad solar fotovoltaica (MW)',a:'11',b:'55',c:'7,961',cx:'Capacidad de todo el SEN',tag:'oficial',src:'PLADESE Tabla 2.1'},
 {k:'Régimen jurídico de CFE',a:'Organismo descentralizado que deberá convertirse en empresa productiva (trans. 3)',b:'Empresa productiva del Estado (Ley de la CFE, art. 2)',c:'Empresa pública del Estado (Ley de 2025, art. 2)',tag:'oficial',src:'DOF 2013; ves2014 pdf-p219; paquete DOF 2025 pdf-p1'},
 {k:'Generación y comercialización',a:'Los particulares participan según lo que establezcan las leyes',b:'Régimen de libre competencia (LIE art. 4)',c:'Régimen de competencia, sin prevalencia para los particulares (LSE art. 4)',tag:'oficial',src:'DOF 2013 art. 27; LIE pdf-p48; LSE pdf-p7'},
 {k:'Transmisión y distribución',a:'Exclusivas de la Nación, sin concesiones; contratos con particulares posibles',b:'El Estado es responsable del servicio; los particulares pueden contratar con él el financiamiento, la operación y la ampliación de la infraestructura (LIE, pdf-p56)',c:'Actividades estratégicas a cargo exclusivo del sector público (art. 25 reformado)',tag:'oficial',src:'DOF 2013 art. 27; ves2014 pdf-p56; DOF 2024'},
 {k:'Participación mínima del Estado en energía inyectada',a:'Dato no disponible',b:'Dato no disponible',c:'54 % (LSE art. 12)',tag:'oficial',src:'LSE pdf-p15'}
];

const REF_LIM=[
 'Este módulo describe textos legales y datos publicados. No atribuye cambios observados a la reforma: una coincidencia en el tiempo no es una causa.',
 'El estado anterior a 2013 (marco legal, usuarios, tarifas, inversión) no está en los documentos proporcionados: Dato no disponible.',
 'No se dispone de cifras de tarifas, inversión privada ni participación de mercado: no se afirma nada sobre ellas.'
];

/* ===== Módulo 0: mejoras para distinguir fósiles, nuclear y renovables ===== */
const FAM={
 fosil:{n:'Fósiles',c:'#7C2D12'},
 nuclear:{n:'Nuclear',c:'#F97316'},
 renov:{n:'Renovables (lista legal)',c:'#FBBF24'},
 otra:{n:'Otras limpias (cogeneración eficiente y otros)',c:'#B9A99A'}
};
const FAM_MATRIZ={'Ciclo combinado':'fosil','Termoeléctrica convencional':'fosil','Carboeléctrica':'fosil','Turbogás':'fosil','Combustión interna':'fosil',
 'Nucleoeléctrica':'nuclear','Eoloeléctrica':'renov','Hidráulica':'renov','Solar fotovoltaica':'renov','GD-FV (generación distribuida)':'renov','Geotérmica':'renov','Bioenergía':'renov',
 'Cogeneración eficiente':'otra','Otros limpios':'otra'};
MATRIZ_2023.forEach(r=>{r.f=FAM_MATRIZ[r.t]});
const FAM_CAP=t=>/Hidro|Eolo|Solar|Geo/.test(t)?'renov':/Nucle/.test(t)?'nuclear':'fosil';

/* Cadenas de conversión: qué cambia entre tecnologías (derivado de CONVERSION) */
const CONV_FAM={
 'Hidráulica':{f:'renov',cond:true,calor:'Agua en movimiento (energía potencial y cinética)',vapor:'No',comb:'No'},
 'Eoloeléctrica':{f:'renov',calor:'Viento (energía cinética)',vapor:'No',comb:'No'},
 'Solar fotovoltaica':{f:'renov',calor:'Radiación solar (efecto fotoeléctrico)',vapor:'No',comb:'No'},
 'Carboeléctrica / vapor':{f:'fosil',calor:'Calor de combustión de un combustible fósil',vapor:'Sí',comb:'Sí'},
 'Ciclo combinado':{f:'fosil',calor:'Combustión de gas natural y calor de escape de la turbina de gas',vapor:'Sí (segunda etapa)',comb:'Sí'},
 'Geotérmica':{f:'renov',calor:'Calor interno de la Tierra',vapor:'Sí',comb:'No'},
 'Nucleoeléctrica':{f:'nuclear',calor:'Fisión de uranio en el reactor',vapor:'Sí',comb:'No'},
 'Turbogás / combustión interna':{f:'fosil',calor:'Combustión del combustible (según la central)',vapor:'No',comb:'Sí'}
};

/* Verdadero o falso con retroalimentación (todas verificables en los documentos) */
const VF=[
 {q:'Toda la energía limpia es renovable.',v:false,
  why:'Falso. La LSE incluye la energía nucleoeléctrica entre las limpias (art. 3, fr. XXI, inc. i), pero la LPTE no la lista entre las fuentes renovables (art. 3, fr. X).',
  src:'LSE pdf-p3; LPTE pdf-p192'},
 {q:'El ciclo combinado y el gas natural son lo mismo.',v:false,
  why:'Falso. El gas natural es un recurso fósil; el ciclo combinado es una tecnología que, con una turbina de gas y otra de vapor, lo convierte en electricidad. En el SEN 2023 el ciclo combinado aportó 58.46 % de la generación.',
  src:'LPTE pdf-p192 (fr. XI); PRODESEN pdf-p97; cadena de conversión de este módulo'},
 {q:'Una central solar fotovoltaica no genera emisiones en toda su vida útil.',v:false,
  why:'Falso. No tiene emisiones directas al operar, pero el IPCC reporta una mediana de ciclo de vida de 48 gCO₂eq/kWh para la solar fotovoltaica de utilidad (por fabricación, construcción y desmantelamiento).',
  src:'IPCC AR5 WGIII, Tabla A.III.2, pdf-p7'},
 {q:'Según la LPTE, el movimiento del agua en embalses artificiales ya existentes es una fuente renovable.',v:true,
  why:'Verdadero. El art. 3, fr. X, inc. c, la incluye textualmente. La redacción no menciona embalses nuevos.',
  src:'LPTE pdf-p192'},
 {q:'En 2023 la energía nucleoeléctrica aportó más de 3 % de la generación del SEN.',v:true,
  why:'Verdadero. Aportó 3.42 % según la Figura 4.9 del PRODESEN.',
  src:'PRODESEN 2024-2038, pdf-p97'},
 {q:'En 2023 las tecnologías fósiles aportaron menos de la mitad de la generación del SEN.',v:false,
  why:'Falso. Sumando ciclo combinado, termoeléctrica convencional, carboeléctrica, turbogás y combustión interna resultan 75.68 % (cálculo con la figura).',
  src:'PRODESEN pdf-p97'},
 {q:'El hidrógeno siempre se considera energía limpia en la Ley del Sector Eléctrico.',v:false,
  why:'Falso. Solo lo es si cumple la eficiencia mínima de la CNE y los criterios de emisiones de ciclo de vida de SEMARNAT (art. 3, fr. XXI, inc. g).',
  src:'LSE pdf-p3'},
 {q:'Según el IPCC, la mediana de emisiones de ciclo de vida de la eólica terrestre es menor que la del gas en ciclo combinado.',v:true,
  why:'Verdadero. 11 frente a 490 gCO₂eq/kWh. Son valores de literatura mundial, no de centrales mexicanas.',
  src:'IPCC AR5 WGIII, Tabla A.III.2, pdf-p7'}
];

/* Clasificador: explicación por recurso y por pregunta (LPTE art. 3 frs. X y XI; LSE art. 3 fr. XXI) */
const EXPL={
 sol:{ren:'LPTE (art. 3, fr. X, inc. b): lista “la radiación solar, en todas sus formas”.',fos:'No proviene de la combustión de materiales con carbono formados por procesos geológicos (LPTE, fr. XI).',lim:'LSE (art. 3, fr. XXI, inc. b): la incluye entre las energías limpias.'},
 viento:{ren:'LPTE (fr. X, inc. a): lista el viento en zonas terrestres y marinas.',fos:'No hay combustión de materiales con carbono de origen geológico (LPTE, fr. XI).',lim:'LSE (fr. XXI, inc. a): lista el viento entre las limpias.'},
 agua:{ren:'La LPTE (fr. X, inc. c) solo menciona el movimiento del agua en cauces naturales o en artificiales con embalses ya existentes; no cubre cualquier uso del agua.',fos:'No hay combustión de materiales con carbono de origen geológico (LPTE, fr. XI).',lim:'LSE (fr. XXI, inc. h): incluye la energía de centrales hidroeléctricas, sin la restricción de embalses existentes que sí tiene la LPTE para “renovable”.'},
 geo:{ren:'LPTE (fr. X, inc. e): lista la energía del calor interno de la Tierra.',fos:'Usa calor del subsuelo, no la combustión de materiales con carbono (LPTE, fr. XI).',lim:'LSE (fr. XXI, inc. d): lista el calor de los yacimientos geotérmicos.'},
 ocean:{ren:'LPTE (fr. X, inc. d): lista la energía oceánica (mareas, gradiente térmico, corrientes, olas, gradiente de sal).',fos:'No hay combustión de materiales con carbono de origen geológico (LPTE, fr. XI).',lim:'LSE (fr. XXI, inc. c): la lista entre las limpias.'},
 biocomb:{ren:'Solo son renovables los energéticos que determine la Ley de Biocombustibles (LPTE, fr. X, inc. f); por eso la respuesta es “condicionada”.',fos:'La definición de fósil exige formación por procesos geológicos (fr. XI); los biocombustibles no están en esa categoría.',lim:'LSE (fr. XXI, inc. e): solo los que determine la Ley de Biocombustibles, y toda energía limpia debe respetar los umbrales de emisiones del reglamento.'},
 uranio:{ren:'El uranio no figura en la lista de fuentes renovables de la LPTE (fr. X).',fos:'La definición de fósil exige combustión de materiales con carbono formados por procesos geológicos (fr. XI); la fisión del uranio no es combustión de carbono.',lim:'LSE (fr. XXI, inc. i): incluye la energía nucleoeléctrica. Limpia no implica renovable.'},
 gasnat:{ren:'No figura en la lista de fuentes renovables (LPTE, fr. X).',fos:'Contiene carbono, se quema y se formó por procesos geológicos (LPTE, fr. XI).',lim:'No figura entre las energías limpias que enumera la LSE (fr. XXI).'},
 carbon:{ren:'No figura en la lista de fuentes renovables (LPTE, fr. X).',fos:'Material sólido con carbono formado por procesos geológicos, que se quema (LPTE, fr. XI).',lim:'No figura entre las energías limpias que enumera la LSE (fr. XXI).'},
 combus:{ren:'No figura en la lista de fuentes renovables (LPTE, fr. X).',fos:'La fr. XI incluye lo “obtenido a partir de” materiales fósiles: el combustóleo se obtiene del petróleo.',lim:'No figura entre las energías limpias que enumera la LSE (fr. XXI).'},
 diesel:{ren:'No figura en la lista de fuentes renovables (LPTE, fr. X).',fos:'La fr. XI incluye lo “obtenido a partir de” materiales fósiles: el diésel se obtiene del petróleo.',lim:'No figura entre las energías limpias que enumera la LSE (fr. XXI).'},
 crudo:{ren:'No figura en la lista de fuentes renovables (LPTE, fr. X).',fos:'Líquido con carbono formado por procesos geológicos (LPTE, fr. XI).',lim:'No figura entre las energías limpias que enumera la LSE (fr. XXI).'},
 h2:{ren:'No figura en la lista de renovables de la LPTE; además es un vector energético, no una fuente primaria. Por eso es “condicionada o no listada”.',fos:'Depende de su origen: si se obtiene a partir de fósiles, su origen es fósil (LPTE, fr. XI incluye lo obtenido de ellos).',lim:'LSE (fr. XXI, inc. g): es limpio solo con la eficiencia mínima de la CNE y los criterios de emisiones de ciclo de vida de SEMARNAT.'},
 rsu:{ren:'No figura en la lista de renovables de la LPTE (fr. X).',fos:'Los residuos sólidos urbanos no se formaron por procesos geológicos (LPTE, fr. XI).',lim:'LSE (fr. XXI, inc. j): limpia solo si el procesamiento no genera dioxinas y furanos y cumple las normas oficiales de SEMARNAT.'},
 metano:{ren:'No figura en la lista de renovables de la LPTE (fr. X); solo aparece entre las limpias.',fos:'El metano de rellenos y granjas no se formó por procesos geológicos (LPTE, fr. XI).',lim:'LSE (fr. XXI, inc. f): lista el aprovechamiento del metano de rellenos sanitarios, granjas y plantas de tratamiento de aguas.'},
 cogen:{ren:'Es un proceso de producción conjunta, no una fuente de la lista de renovables (LPTE, fr. X).',fos:'Depende del combustible: la cogeneración es un proceso y su combustible puede ser fósil.',lim:'LSE (fr. XXI, inc. k): se considera limpia cuando cumple los criterios de eficiencia de la CNE y de emisiones de SEMARNAT.'}
};
const EXPL_PISTA=(d,resp,ok,r)=>{
 if(d==='ren'&&resp==='si'&&r.lim==='si'&&ok==='no')return 'Ojo: que una fuente sea limpia no la hace renovable.';
 if(d==='lim'&&resp==='no'&&ok==='si'&&r.ren==='no')return 'Ojo: no ser renovable ni fósil no impide ser limpia según la LSE.';
 if(d==='fos'&&resp==='si'&&ok==='no')return 'Ojo: fósil se define por combustión de carbono de origen geológico, no por ser un combustible o una tecnología térmica.';
 if(resp==='cond'&&ok!=='cond')return 'La opción “condicionada” es para casos que la ley deja sujetos a criterios o que no lista.';
 if(ok==='cond'&&resp!=='cond')return 'Este es un caso que la ley condiciona o no lista: revisa la explicación.';
 return '';
};

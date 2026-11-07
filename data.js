/* Datos del Atlas Eléctrico de México. Cada dato lleva fuente (documento, página PDF, año, unidad).
   Tipos: "oficial" (cifra publicada), "calculo" (derivada aquí), "estimacion". Ausente => "Dato no disponible". */
const FUENTES = {
  LSE:   'Ley del Sector Eléctrico (DOF 18-mar-2025), art. 3, fr. XXI (Energías Limpias), pdf-p3 del archivo de la Ley / pdf-p85 del paquete DOF',
  LPTE:  'Ley de Planeación y Transición Energética (DOF 18-mar-2025), art. 3, frs. IX-XI, pdf-p192 del paquete DOF',
  PROD:  'SENER, PRODESEN 2024-2038, cap. 4, Figura 4.9, pdf-p97 (elaboración SENER con datos de CENACE, CRE y CFE), año 2023',
  PROD98:'SENER, PRODESEN 2024-2038, cap. 4, pdf-p98',
  IA23:  'CFE, Informe Anual 2023, capacidad bruta efectiva 2022 (pdf-p20), e Informe Anual 2024, capacidad efectiva 2023-2024 (pdf-p24)',
  IPCC:  'IPCC AR5 WGIII, Anexo III, Tabla A.III.2, pdf-p7 (2014), gCO2eq/kWh'
};
const TOTAL_SEN_2023_GWH = 351695; // PRODESEN 2024-2038, pdf-p97 (incluye GD-FV 5,191 GWh)

/* Clasificador: valores 'si' | 'no' | 'cond' (condicionada o no listada en la definición legal) */
const RECURSOS = [
 {id:'sol',n:'Radiación solar',ren:'si',fos:'no',lim:'si',nota:'LPTE art.3 fr.X inc. b y LSE art.3 fr.XXI inc. b: "la radiación solar, en todas sus formas".'},
 {id:'viento',n:'Viento',ren:'si',fos:'no',lim:'si',nota:'Listado como renovable (inc. a) y limpia (inc. a).'},
 {id:'agua',n:'Agua en presas hidroeléctricas',ren:'cond',fos:'no',lim:'si',nota:'La LPTE considera renovable el agua en cauces naturales o embalses ya existentes; la LSE incluye la energía de centrales hidroeléctricas entre las limpias (inc. h).'},
 {id:'geo',n:'Calor geotérmico',ren:'si',fos:'no',lim:'si',nota:'Calor interno de la Tierra: renovable (inc. e) y limpia (inc. d).'},
 {id:'ocean',n:'Energía oceánica (mareas, olas, gradientes)',ren:'si',fos:'no',lim:'si',nota:'Listada en ambas definiciones (inc. d renovable; inc. c limpia).'},
 {id:'biocomb',n:'Biocombustibles',ren:'cond',fos:'no',lim:'cond',nota:'Renovables y limpios solo los que determine la Ley de Biocombustibles; limpia además sujeta a umbrales de emisiones.'},
 {id:'uranio',n:'Uranio (nucleoeléctrica)',ren:'no',fos:'no',lim:'si',nota:'No figura en la lista de renovables; la LSE incluye la energía nucleoeléctrica entre las limpias (inc. i). Limpia no implica renovable.'},
 {id:'gasnat',n:'Gas natural',ren:'no',fos:'si',lim:'no',nota:'Proviene de procesos geológicos y se quema: fósil (LPTE fr. XI). No figura entre las energías limpias de la lista legal.'},
 {id:'carbon',n:'Carbón mineral',ren:'no',fos:'si',lim:'no',nota:'Combustible fósil sólido (LPTE fr. XI).'},
 {id:'combus',n:'Combustóleo',ren:'no',fos:'si',lim:'no',nota:'Derivado del petróleo: fósil.'},
 {id:'diesel',n:'Diésel',ren:'no',fos:'si',lim:'no',nota:'Derivado del petróleo: fósil.'},
 {id:'crudo',n:'Petróleo crudo',ren:'no',fos:'si',lim:'no',nota:'Formado por procesos geológicos: fósil.'},
 {id:'h2',n:'Hidrógeno (vector energético)',ren:'cond',fos:'cond',lim:'cond',nota:'LSE inc. g: limpia solo con la eficiencia mínima de la CNE y criterios de emisiones de ciclo de vida de SEMARNAT. Si se obtiene de fósiles, su origen es fósil.'},
 {id:'rsu',n:'Residuos sólidos urbanos (gasificación o plasma)',ren:'cond',fos:'no',lim:'cond',nota:'LSE inc. j: limpia solo si no genera dioxinas y furanos y cumple las NOM de SEMARNAT. No figura en la lista de renovables.'},
 {id:'metano',n:'Metano de rellenos sanitarios y granjas',ren:'cond',fos:'no',lim:'si',nota:'LSE inc. f lo lista entre las limpias; no figura en la lista legal de renovables.'},
 {id:'cogen',n:'Cogeneración eficiente (proceso)',ren:'no',fos:'cond',lim:'si',nota:'LSE inc. k: limpia si cumple los criterios de eficiencia de la CNE y de emisiones de SEMARNAT. Es un proceso; el combustible puede ser fósil.'}
];

/* Matriz 2023 SEN, % (PRODESEN 2024-2038 Fig. 4.9, pdf-p97). grupo: fosil | limpia */
const MATRIZ_2023 = [
 {t:'Ciclo combinado',p:58.46,g:'fosil'},{t:'Termoeléctrica convencional',p:8.63,g:'fosil'},
 {t:'Carboeléctrica',p:4.05,g:'fosil'},{t:'Turbogás',p:3.51,g:'fosil'},{t:'Combustión interna',p:1.03,g:'fosil'},
 {t:'Eoloeléctrica',p:5.89,g:'limpia'},{t:'Hidráulica',p:5.86,g:'limpia'},{t:'Solar fotovoltaica',p:5.16,g:'limpia'},
 {t:'Nucleoeléctrica',p:3.42,g:'limpia'},{t:'GD-FV (generación distribuida)',p:1.48,g:'limpia'},
 {t:'Geotérmica',p:1.18,g:'limpia'},{t:'Cogeneración eficiente',p:1.18,g:'limpia'},
 {t:'Bioenergía',p:0.14,g:'limpia'},{t:'Otros limpios',p:0.02,g:'limpia'}
];
/* Capacidad bruta efectiva CFE, MW (Informe Anual 2023, pdf-p20). Solo CFE, sin PEE. */
const CAP_CFE = [
 {t:'Hidroeléctrica',a2022:12125.36,a2023:12143.6,a2024:12155.6},{t:'Vapor convencional',a2022:9747.60,a2023:9747.60,a2024:9697.6},
 {t:'Ciclo combinado',a2022:10912.38,a2023:10912.38,a2024:10912.4},{t:'Carboeléctrica',a2022:5463.45,a2023:5463.45,a2024:5463.5},
 {t:'Turbogás',a2022:2953.33,a2023:2942.00,a2024:2940.9},{t:'Geotermoeléctrica',a2022:808.08,a2023:808.08,a2024:808.1},
 {t:'Combustión interna',a2022:362.44,a2023:1009.30,a2024:1011.9},{t:'Eoloeléctrica',a2022:85.70,a2023:85.70,a2024:85.7},
 {t:'Solar fotovoltaica',a2022:6.00,a2023:126.00,a2024:433.0},{t:'Nucleoeléctrica',a2022:1608,a2023:1608,a2024:1608.0}
];
const CAP_CFE_TOTAL = {a2022:44073.34,a2023:44846.2,a2024:45116.7};
/* Emisiones IPCC AR5 (gCO2eq/kWh): directas min/med/max y ciclo de vida min/med/max */
const IPCC = {
 'Carboeléctrica':{n:'Carbón (PC)',d:[670,760,870],c:[740,820,910]},
 'Ciclo combinado':{n:'Gas, ciclo combinado',d:[350,370,490],c:[410,490,650]},
 'Geotérmica':{n:'Geotermia',d:[0,0,0],c:[6.0,38,79]},
 'Hidráulica':{n:'Hidroeléctrica',d:[0,0,0],c:[1.0,24,2200]},
 'Nucleoeléctrica':{n:'Nuclear',d:[0,0,0],c:[3.7,12,110]},
 'Solar fotovoltaica':{n:'Solar FV (utilidad)',d:[0,0,0],c:[18,48,180]},
 'Eoloeléctrica':{n:'Eólica terrestre',d:[0,0,0],c:[7.0,11,56]}
};
/* Cadenas de conversión (principios físicos; sin cifras de eficiencia no documentadas) */
const CONVERSION = {
 'Hidráulica':{pasos:['Energía potencial gravitatoria del agua embalsada','Energía cinética del flujo (tubería de presión)','Turbina hidráulica (energía mecánica rotacional)','Generador síncrono','Electricidad'],
  formas:['Potencial gravitatoria','Cinética','Mecánica rotacional','Eléctrica'],
  fis:'La potencia hidráulica es P = ρ·g·Q·H·η, con ρ la densidad del agua, g la gravedad, Q el gasto, H la altura neta de caída y η la eficiencia global de la turbina y el generador. Una parte de la energía se disipa como calor por fricción y turbulencia.'},
 'Eoloeléctrica':{pasos:['Energía cinética del viento','Rotor (par mecánico)','Generador','Convertidor electrónico (en aerogeneradores de velocidad variable)','Electricidad'],
  formas:['Cinética','Mecánica rotacional','Eléctrica'],
  fis:'La potencia del viento que atraviesa el rotor es P = ½·ρ·A·v³ (ρ densidad del aire, A área barrida, v velocidad): crece con el cubo de la velocidad. La turbina solo puede extraer una fracción Cp ≤ 16/27 ≈ 59.3 % (límite de Betz).'},
 'Solar fotovoltaica':{pasos:['Radiación solar (fotones)','Celda fotovoltaica (efecto fotovoltaico en unión p-n)','Corriente continua','Inversor','Electricidad en CA'],
  formas:['Radiante','Eléctrica en CC','Eléctrica en CA'],
  fis:'La celda convierte directamente la energía de los fotones en corriente continua, sin etapa térmica ni partes giratorias; el inversor la convierte a corriente alterna. La radiación que no se convierte se disipa como calor en la celda.'},
 'Carboeléctrica / vapor':{pasos:['Energía química del combustible','Calor de combustión','Vapor a alta presión (caldera)','Turbina de vapor','Generador síncrono','Electricidad'],
  formas:['Química','Térmica','Mecánica rotacional','Eléctrica'],
  fis:'Ciclo Rankine: el vapor se expande en la turbina y luego se condensa. Por la segunda ley de la termodinámica, parte del calor se rechaza al condensador; ningún ciclo térmico supera la eficiencia de Carnot, η ≤ 1 − Tf/Tc (temperaturas absolutas).'},
 'Ciclo combinado':{pasos:['Energía química del combustible (caso de referencia: gas natural)','Combustión en la cámara de la turbina de gas','Turbina de gas (ciclo Brayton) y su generador','Calor residual de los gases de escape','Caldera de recuperación: vapor (ciclo Rankine)','Turbina de vapor y su generador','Electricidad'],
  formas:['Química','Térmica','Mecánica rotacional','Térmica residual','Mecánica rotacional','Eléctrica'],
  fis:'Dos ciclos en serie: la turbina de gas (Brayton) mueve su propio generador y sus gases de escape, aún calientes, producen en la caldera de recuperación el vapor de un ciclo Rankine que mueve un segundo generador. Aprovechar ese calor residual eleva la eficiencia frente a una turbina de gas sola.'},
 'Geotérmica':{pasos:['Calor del subsuelo','Vapor geotérmico (o fluido secundario en una planta de ciclo binario)','Turbina de vapor','Generador síncrono','Electricidad'],
  formas:['Térmica','Mecánica rotacional','Eléctrica'],
  fis:'Usa el calor interno de la Tierra como fuente térmica en lugar de quemar combustible. Sigue siendo un ciclo de vapor: rechaza calor al condensador y está limitado por Carnot, con temperaturas de fuente menores que las de una caldera de combustión.'},
 'Nucleoeléctrica':{pasos:['Energía nuclear del uranio (fisión)','Calor en el núcleo del reactor','Calor transferido al agua del reactor','Vapor','Turbina de vapor','Generador síncrono','Electricidad'],
  formas:['Nuclear','Térmica','Mecánica rotacional','Eléctrica'],
  fis:'Sustituye la caldera de combustión por un reactor: la fisión libera calor sin quemar carbono. El resto es un ciclo de vapor que, como cualquier ciclo térmico, rechaza calor al condensador y está limitado por Carnot.'},
 'Turbogás / combustión interna':{pasos:['Energía química del combustible','Combustión','Turbina de gas (ciclo Brayton) o motor de combustión interna (energía mecánica)','Generador','Electricidad'],
  formas:['Química','Térmica','Mecánica rotacional','Eléctrica'],
  fis:'Los gases calientes realizan trabajo directamente sobre los álabes de la turbina o sobre los pistones del motor, sin caldera de vapor. Los gases de escape salen aún calientes: ese calor se pierde, salvo que se aproveche como en el ciclo combinado.'}
};
const GLOSARIO = {
 'SEN':'Sistema Eléctrico Nacional: incluye generación de CFE y de privados.',
 'GWh':'Gigawatt-hora: 1 GWh = 1,000,000 kWh. Mide energía.',
 'MW':'Megawatt: potencia. 1 MW = 1,000 kW.',
 'ciclo de vida':'Suma de emisiones de construcción, combustible, operación y desmantelamiento, no solo de la operación.',
 'emisiones directas':'Emisiones liberadas en la propia central al generar electricidad.',
 'factor de emisión':'Toneladas de CO2 equivalente por MWh generado o consumido.',
 'GD-FV':'Generación distribuida fotovoltaica: sistemas pequeños conectados a la red de distribución.',
 'PEE':'Productor externo de energía.',
 'vapor convencional':'Central termoeléctrica que quema combustóleo o gas natural en una caldera para producir vapor que mueve una turbina (ciclo Rankine).',
 'ciclo Rankine':'Ciclo termodinámico de vapor: la caldera genera vapor, la turbina lo expande, el condensador lo regresa a líquido y la bomba lo reinyecta.',
 'ciclo combinado':'Una turbina de gas (ciclo Brayton) y una de vapor (Rankine) en serie: el calor de escape de la primera produce el vapor de la segunda.',
 'turbogás':'Turbina que mueve el generador con gases de combustión calientes, sin caldera de vapor.',
 'combustión interna':'Motores (p. ej. diésel) acoplados a un generador.',
 'factor de planta':'Energía generada entre la que produciría la central operando todo el año a su capacidad: E / (P × horas).',
 'generación bruta':'Energía medida en terminales del generador, antes de descontar los usos propios de la central.',
 'generación neta':'Generación bruta menos los usos propios de la central.',
 'PIE':'Productor Independiente de Energía: central privada que vende su energía a CFE.',
 'RNT':'Red Nacional de Transmisión: redes que transportan la energía en tensiones iguales o mayores a 69 kV (PLADESE pdf-p11).',
 'RGD':'Redes Generales de Distribución: media tensión (más de 1 kV) y baja tensión (hasta 1 kV).',
 'GCR':'Gerencia de Control Regional: región operativa del CENACE. El SEN tiene 8.',
 'SIBC':'Sistema Interconectado Baja California.','SIBCS':'Sistema Interconectado Baja California Sur.','SIMUL':'Sistema Interconectado Mulegé.',
 'kV':'Kilovolt: 1 kV = 1,000 V. En trifásica se usa la tensión entre líneas.',
 'MVA':'Megavoltampere: potencia aparente. Mide la capacidad de transformadores y subestaciones.',
 'factor de potencia':'cos φ: relación entre potencia activa P y aparente S. Con cos φ menor que 1 circula más corriente para la misma P.',
 'pérdidas Joule':'Calor que disipa la resistencia de los conductores: P = 3·I²·R en una línea trifásica.',
 'bruta efectiva':'Capacidad de la central medida en terminales del generador.'
};

/* Módulo 2: Transmisión. Cada dato lleva fuente. */
const TX={
 anios:[2020,2021,2022,2023,2024],
 km:[110294,110347,110449,110558,111138],        // CFE Transmisión: 2020-2022 IA2022 pdf-p125; 2022-2024 IA2024 pdf-p79
 sub:[2258,2275,2279,2302,2317],
 mva:[165230,165804,165541,164992,168981],
 fuente:'CFE, Informe Anual 2022 (pdf-p125) y Informe Anual 2024 (pdf-p79), cuadro “Escenario Tecnológico”, fuente CFE Transmisión'
};
const TX2024={km161_400:56720,km69_138:54418,fuente:'SENER, PLADESE (DOF 17-oct-2025), pdf-p11'}; // suma 111,138 km = TX.km 2024
/* Consumo neto de energía eléctrica, GWh. SENER, PRODESEN 2024-2038, Cuadro 3.1, pdf-p38 */
const CONS={anios:[2021,2022,2023],
 SEN:[322552,333662,345439],SIN:[304034,314317,326027],SIBC:[15541,16233,15999],SIBCS:[2826,2964,3257],SIMUL:[150,148,157],
 GCR:{'Central (CEN)':[56862,58099,58623],'Oriental (ORI)':[52083,53321,55374],'Occidental (OCC)':[69893,72679,75542],'Noroeste (NOR)':[25548,25735,27610],'Norte (NTE)':[28948,29735,31179],'Noreste (NES)':[57152,60277,61757],'Peninsular (PEN)':[13549,14470,15941]},
 inc2023:{SIN:3.7,SIBC:-1.4,SIBCS:9.9,SIMUL:5.7}};
const SISTEMAS={
 SIN:{n:'Sistema Interconectado Nacional (SIN)',c:'#FBBF24',gcr:'Siete gerencias de control regional: Central, Noreste, Noroeste, Norte, Occidental, Oriental y Peninsular.',extra:'Consumo bruto 2024: 338,994 GWh (94.2 % del SEN; PLADESE pdf-p9). Demanda máxima integrada bruta 2024: 52,302 MWh/h, en mayo a las 17:00 (PLADESE pdf-p9).'},
 SIBC:{n:'Sistema Interconectado Baja California (SIBC)',c:'#F97316',gcr:'GCR Baja California.',extra:'La GCR Baja California concentra 71.9 % de las importaciones de energía del SEN en 2024 (PLADESE pdf-p8).'},
 SIBCS:{n:'Sistema Interconectado Baja California Sur (SIBCS)',c:'#9A3412',gcr:'GCR Baja California.',extra:'Mayor crecimiento del consumo neto entre los sistemas en 2023 (+9.9 %).'},
 SIMUL:{n:'Sistema Interconectado Mulegé (SIMUL)',c:'#3A1608',gcr:'GCR Baja California.',extra:'Sistema muy pequeño, en el municipio de Mulegé. CFE reporta el sistema aislado de Guerrero Negro y su central CCI Guerrero Negro IV (7.52 MW netos; Informe Anual 2023 pdf-p221).'}
};

/* Longitud de líneas de la RNT por nivel de tensión, km. SENER, PLADESE (DOF 17-oct-2025), Tabla 2.3, pdf-p11 (fuente de la tabla: SENER con información del CENACE y de CFE). Transcrita de captura de la tabla completa. */
const TXV={anios:[2020,2021,2022,2023,2024],
 '400 kV':[26097,26098,26125,26135,26451],'230 kV':[29722,29723,29743,29743,29749],'161 kV':[519,521,521,531,520],
 '138 kV':[1620,1620,1620,1620,1603],'115 kV':[48456,48496,48584,48725,48717],'85 kV':[1747,1756,1757,1757,1764],'69 kV':[2335,2335,2335,2335,2335],
 sub161_400:[56338,56342,56389,56409,56720],sub69_138:[54158,54207,54296,54437,54418]};
/* Capacidad de transformación, MVA. PLADESE Tabla 2.4, pdf-p11 */
const TXM={anios:[2020,2021,2022,2023,2024],rnt:[114807,114807,116082,113688,116625],rgd:[75192,76331,77056,79812,81504]};

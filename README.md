# Atlas Eléctrico de México: de los recursos energéticos al consumidor

Aplicación web estática (HTML, CSS y JavaScript, sin dependencias ni compilación) para el curso TE1020 Análisis de Circuitos Eléctricos.
Autora: matrícula A01744281.

## Cómo abrirla
Abre `index.html` en un navegador. También funciona publicada en GitHub Pages. Las tipografías (Fraunces y Outfit) se cargan desde Google Fonts; sin conexión se usan tipografías de respaldo.

## Módulos
0. Recursos energéticos · 1. Generación · 2. Transmisión (simulador de pérdidas Joule) · 3. Distribución (simulador de transformador ideal) · 4. ¿Sabías que? y La reforma energética de 2013.

## Criterios de datos
- Cada cifra lleva etiqueta: **Oficial** (publicada), **Cálculo** (derivada aquí), **Simulación** o **Estimación**. Lo que no está en los documentos aparece como **Dato no disponible**.
- Fuentes primarias: Informes Anuales de CFE 2022-2024, PRODESEN 2024-2038 y PLADESE (SENER), Programa de las RGD 2025-2039 (CFE Distribución), DOF (2013, 2014, 2024, 2025) e IPCC AR5 WGIII. Cada dato cita documento y página PDF.
- Los contornos de estados y de Mulegé provienen de límites municipales CONABIO 2023 distribuidos en GitHub (PhantomInsights/mexico-geojson, licencia MIT), simplificados para el atlas. No son el archivo oficial del INEGI.
- Las coordenadas de las centrales se consultaron en Google Maps el 6-nov-2026; la de La Venta tiene baja confianza.
- La imagen de las divisiones de distribución es la Figura III.1 del Programa de las RGD 2025-2039 de CFE Distribución.

## Estructura
`index.html`, `css/styles.css`, `js/` (datos `data*.js` y módulos `app.js`, `mod1-4.js`), `data/` (contornos), `img/`.

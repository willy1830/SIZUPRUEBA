"use strict";

// Funciones reutilizables
function calcArea(diameter) {
  // Área de un círculo en mm²
  return Math.PI * (diameter / 2) ** 2;
}

function calcForce(areaMm2, pressureBar) {
  // Convierte area(mm²) → m² = ×10⁻⁶ y presión(bar) → Pa = ×10⁵
  // F = area·pressure = areaMm2×10⁻⁶ × pressureBar×10⁵ = areaMm2×pressureBar×10⁻¹
  return areaMm2 * pressureBar * 1e-1; // N
}

function convertFlowToMm3s(flowLPerMin) {
  // Convierte flujo L/min → mm³/s
  return (flowLPerMin * 1e6) / 60;
}

function formatResults({
  areaPiston,
  areaRod,
  areaDiff,
  volumeExtMm3,
  volumeRetMm3,
  forceExt,
  forceRet,
  velExt,
  velRet,
  timeExt,
  timeRet,
  cycleTime
}) {
  return `
    <p><strong>Área Pistón:</strong> ${areaPiston.toFixed(2)} mm²</p>
    <p><strong>Área Vástago:</strong> ${areaRod.toFixed(2)} mm²</p>
    <p><strong>Área Diferencial:</strong> ${areaDiff.toFixed(2)} mm²</p>
    <p><strong>Volumen Extensión:</strong> ${(volumeExtMm3 / 1000).toFixed(2)} cm³</p>
    <p><strong>Volumen Retracción:</strong> ${(volumeRetMm3 / 1000).toFixed(2)} cm³</p>
    <p><strong>Fuerza Extensión:</strong> ${forceExt.toFixed(2)} N</p>
    <p><strong>Fuerza Retracción:</strong> ${forceRet.toFixed(2)} N</p>
    <p><strong>Velocidad Extensión:</strong> ${velExt.toFixed(2)} mm/s</p>
    <p><strong>Velocidad Retracción:</strong> ${velRet.toFixed(2)} mm/s</p>
    <p><strong>Tiempo Extensión:</strong> ${timeExt.toFixed(2)} s</p>
    <p><strong>Tiempo Retracción:</strong> ${timeRet.toFixed(2)} s</p>
    <p><strong>Tiempo Ciclo:</strong> ${cycleTime.toFixed(2)} s</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("hydraulic-form");
  const resultsContainer = document.getElementById("results");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtención de datos
    const dPiston  = parseFloat(document.getElementById("dPiston").value);
    const dRod     = parseFloat(document.getElementById("dRod").value);
    const stroke   = parseFloat(document.getElementById("stroke").value);
    const pressure = parseFloat(document.getElementById("pressure").value);
    const flow     = parseFloat(document.getElementById("flow").value);

    // Validar que sean números positivos
    if ([dPiston, dRod, stroke, pressure, flow].some(v => isNaN(v) || v <= 0)) {
      resultsContainer.innerHTML = `<p class="error">Error: Ingresa valores numéricos positivos en todos los campos.</p>`;
      return;
    }

    // Cálculos
    const areaPiston    = calcArea(dPiston);
    const areaRod       = calcArea(dRod);
    const areaDiff      = areaPiston - areaRod;
    const volumeExtMm3  = areaPiston * stroke;
    const volumeRetMm3  = areaDiff * stroke;
    const forceExt      = calcForce(areaPiston, pressure);
    const forceRet      = calcForce(areaDiff, pressure);
    const flowMm3s      = convertFlowToMm3s(flow);
    const velExt        = flowMm3s / areaPiston;
    const velRet        = flowMm3s / areaDiff;
    const timeExt       = stroke / velExt;
    const timeRet       = stroke / velRet;
    const cycleTime     = timeExt + timeRet;

    // Mostrar en pantalla
    resultsContainer.innerHTML = formatResults({
      areaPiston,
      areaRod,
      areaDiff,
      volumeExtMm3,
      volumeRetMm3,
      forceExt,
      forceRet,
      velExt,
      velRet,
      timeExt,
      timeRet,
      cycleTime
    });
  });
});

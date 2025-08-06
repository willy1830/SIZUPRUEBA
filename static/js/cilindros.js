document.getElementById('hydraulic-form')
  .addEventListener('submit', function(e) {
    e.preventDefault();

    // Tomar valores
    const dPiston = parseFloat(document.getElementById('dPiston').value);
    const dRod    = parseFloat(document.getElementById('dRod').value);
    const stroke  = parseFloat(document.getElementById('stroke').value);
    const pressure= parseFloat(document.getElementById('pressure').value);
    const flow    = parseFloat(document.getElementById('flow').value);

    // Cálculos
    const areaPiston = Math.PI * (dPiston/2)**2;        // mm²
    const areaRod    = Math.PI * (dRod/2)**2;           // mm²
    const areaDiff   = areaPiston - areaRod;            // mm²

    const volumeExt  = areaPiston * stroke;             // mm³
    const volumeRet  = areaDiff * stroke;               // mm³

    const forceExt   = areaPiston * pressure * 1e5/1e3; // N  (bar→Pa, mm²→m²)
    const forceRet   = areaDiff  * pressure * 1e5/1e3; // N

    // Caudal: L/min → mm³/s
    const flowMm3s   = flow * 1e6 / 60;                 // mm³/s

    const velExt     = flowMm3s / areaPiston;           // mm/s
    const velRet     = flowMm3s / areaDiff;             // mm/s

    const timeExt    = stroke / velExt;                 // s
    const timeRet    = stroke / velRet;                 // s
    const cycleTime  = timeExt + timeRet;               // s

    // Mostrar resultados
    const R = document.getElementById('results');
    R.innerHTML = `
      <p>Área Pistón: ${areaPiston.toFixed(2)} mm²</p>
      <p>Área Vástago: ${areaRod.toFixed(2)} mm²</p>
      <p>Área Diferencial: ${areaDiff.toFixed(2)} mm²</p>
      <p>Volumen Extensión: ${(volumeExt/1000).toFixed(2)} cm³</p>
      <p>Volumen Retracción: ${(volumeRet/1000).toFixed(2)} cm³</p>
      <p>Fuerza Extensión: ${forceExt.toFixed(2)} N</p>
      <p>Fuerza Retracción: ${forceRet.toFixed(2)} N</p>
      <p>Velocidad Extensión: ${velExt.toFixed(2)} mm/s</p>
      <p>Velocidad Retracción: ${velRet.toFixed(2)} mm/s</p>
      <p>Tiempo Extensión: ${timeExt.toFixed(2)} s</p>
      <p>Tiempo Retracción: ${timeRet.toFixed(2)} s</p>
      <p>Tiempo Ciclo: ${cycleTime.toFixed(2)} s</p>
    `;
});

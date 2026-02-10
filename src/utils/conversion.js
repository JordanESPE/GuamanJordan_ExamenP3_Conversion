function toCelsius(f) {
  if (typeof f !== 'number' || !Number.isFinite(f)) {
    throw new TypeError('El valor debe ser un número finito');
  }
  return Number(((f - 32) * 5 / 9).toFixed(1));
}

function toFahrenheit(c) {
  if (typeof c !== 'number' || !Number.isFinite(c)) {
    throw new TypeError('El valor debe ser un número finito');
  }
  return Number(((c * 9 / 5) + 32).toFixed(1));
}

function movingAverages(series, window) {
  if (!Array.isArray(series) || series.some(v => typeof v !=='number' || !Number.isFinite(v))) {
    throw new TypeError('Serie inválida, debe contener solo números finitos');
  }
  if (!Number.isInteger(window) || window < 2 || window > series.length) {
    throw new RangeError('Ventana fuera de rango');
  

  const averages = [];
  for (let i = 0; i <= series.length - window; i++) {
    const slice = series.slice(i, i + window);
    const avg = slice.reduce((acc, val) => acc + val, 0) / window;
    averages.push(Number(avg.toFixed(2)));
  }
  return averages;
}

module.exports = { toCelsius, toFahrenheit, movingAverages };
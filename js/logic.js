// Datandroid — lógica de negócio

export function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function calculateSafetyScore(route, weather) {
  const distance = route.distance || 0;
  const duration = route.duration || 0;
  const wind = weather?.current_weather?.windspeed || 0;
  const humidity = weather?.hourly?.relativehumidity_2m?.[0] || 0;
  const rawScore = 100 - Math.min(45, wind * 1.5) - Math.min(20, humidity * 0.2) - Math.min(15, distance / 1000);
  const score = Math.max(0, Math.round(rawScore));
  const status = score > 75 ? 'Ótimo' : score > 55 ? 'Aceitável' : score > 35 ? 'Cuidado' : 'Perigoso';
  const detail = `Vento ${wind.toFixed(0)} km/h · Humidade ${humidity.toFixed(0)}% · Distância ${ (distance/1000).toFixed(1) } km`;
  return { score, status, detail };
}

export function formatMinutes(seconds) {
  return Math.round(seconds / 60);
}

export function createFlightHistoryEntry(origin, destination, route, weather, score) {
  return {
    id: Date.now().toString(),
    origin,
    destination,
    distance: (route.distance / 1000).toFixed(2) + ' km',
    duration: formatMinutes(route.duration) + ' min',
    wind: weather?.current_weather?.windspeed ? `${weather.current_weather.windspeed} km/h` : 'N/A',
    temperature: weather?.current_weather?.temperature ? `${weather.current_weather.temperature}°C` : 'N/A',
    score: score.score,
    status: score.status,
    createdAt: new Date().toLocaleString('pt-PT')
  };
}

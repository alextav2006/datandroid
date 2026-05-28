// Datandroid — API helpers

const apiHeaders = {
  'Accept': 'application/json'
};

export async function fetchJson(url) {
  try {
    const response = await fetch(url, { headers: apiHeaders });
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[API]', error, url);
    throw new Error('Não foi possível aceder aos dados remotos. Tente novamente mais tarde.');
  }
}

export async function geocodeQuery(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=pt`;
  const data = await fetchJson(url);
  return data.results || [];
}

export async function reverseGeocode(lat, lon) {
  const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=pt`;
  const data = await fetchJson(url);
  return data || {};
}

export async function fetchForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,winddirection_10m&current_weather=true&timezone=auto`;
  return await fetchJson(url);
}

export async function fetchRoute(origin, destination) {
  const coords = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false&geometries=geojson&steps=false`;
  const data = await fetchJson(url);
  if (!data.routes || !data.routes.length) {
    throw new Error('Não foi possível calcular a rota.');
  }
  return data.routes[0];
}

export async function loadDroneModels() {
  const sparql = `SELECT ?item ?itemLabel ?flightTime ?usageLabel WHERE {\n  ?item wdt:P31/wdt:P279* wd:Q1192428.\n  OPTIONAL { ?item wdt:P6097 ?flightTime. }\n  OPTIONAL { ?item wdt:P366 ?usage. }\n  SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en". }\n} LIMIT 24`;
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}`;
  const response = await fetch(url, { headers: { Accept: 'application/sparql-results+json' } });
  if (!response.ok) {
    throw new Error('Falha ao carregar dados da Wikidata.');
  }
  const data = await response.json();
  const models = data.results.bindings.map(item => ({
    id: item.item.value,
    name: item.itemLabel.value,
    autonomy: item.flightTime ? parseInt(item.flightTime.value, 10) : 20,
    usage: item.usageLabel ? item.usageLabel.value : 'Geral',
    description: 'Drone civil para missões de inspeção e mapeamento.'
  }));
  return models.length ? models : getFallbackDroneModels();
}

export function getFallbackDroneModels() {
  return [
    { id: 'drone-1', name: 'Datandroid Falcon', autonomy: 25, usage: 'Entrega', description: 'Rápido e estável para operações urbanas.' },
    { id: 'drone-2', name: 'Datandroid Guardian', autonomy: 40, usage: 'Segurança', description: 'Projectado para patrulha e monitorização.' },
    { id: 'drone-3', name: 'Datandroid Mapper', autonomy: 32, usage: 'Cartografia', description: 'Ideal para levantamento fotogramétrico.' },
    { id: 'drone-4', name: 'Datandroid Breeze', autonomy: 18, usage: 'Recreativo', description: 'Compacto e fácil de pilotar para treino.' },
    { id: 'drone-5', name: 'Datandroid Atlas', autonomy: 48, usage: 'Pesquisa', description: 'Robusto para missões de longa distância.' }
  ];
}

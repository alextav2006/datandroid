// Datandroid — app.js
// Navegação entre os 3 ecrãs

var screenTabMap = {
  'screen-frota':       'tab-frota',
  'screen-planeamento': 'tab-planeamento',
  'screen-voo':         'tab-voo'
};

var WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
var GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
var ROUTING_API_BASE = 'https://router.project-osrm.org/route/v1/driving';

var elements = {
  originInput: null,
  destinationInput: null,
  weatherStatus: null,
  weatherLocation: null,
  weatherWindValue: null,
  weatherWindUnit: null,
  weatherRainValue: null,
  weatherRainUnit: null,
  weatherVisibilityValue: null,
  weatherVisibilityUnit: null,
  frotaWindValue: null,
  frotaWindDirection: null,
  vooWindOverlay: null,
  flightAlertBanner: null,
  vooSpeedValue: null,
  autonomyValue: null,
  autonomyRing: null,
  autonomyCaption: null,
  calculateRouteBtn: null,
  routeFastestTitle: null,
  routeFastestDistance: null,
  routeFastestTime: null,
  routeFastestRisk: null,
  routeBalancedTitle: null,
  routeBalancedDistance: null,
  routeBalancedTime: null,
  routeBalancedRisk: null,
  routeSafeTitle: null,
  routeSafeDistance: null,
  routeSafeTime: null,
  routeSafeRisk: null
};

function showScreen(screenId) {
  // Esconde todos os ecrãs
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });

  // Remove tab ativo
  document.querySelectorAll('.nav-tab').forEach(function(t) {
    t.classList.remove('active');
  });

  // Mostra o ecrã pedido
  var screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');

  // Ativa o tab correspondente
  var tabId = screenTabMap[screenId];
  var tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');

  // Faz scroll para o topo
  if (screen) screen.scrollTop = 0;
}

function setStatus(message, isError) {
  if (!elements.weatherStatus) return;
  elements.weatherStatus.textContent = message;
  elements.weatherStatus.style.color = isError ? '#D70015' : '';
}

function roundNumber(value, digits) {
  var factor = Math.pow(10, digits || 0);
  return Math.round(value * factor) / factor;
}

function visibilityToKm(visibilityMeters) {
  if (visibilityMeters === null || visibilityMeters === undefined) return null;
  return roundNumber(visibilityMeters / 1000, 1);
}

function degToCompass(deg) {
  if (deg === null || deg === undefined) return 'n/a';
  var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  var index = Math.round(deg / 45) % 8;
  return directions[index];
}

function formatDistanceKm(meters) {
  return roundNumber((meters || 0) / 1000, 1) + ' km';
}

function formatDurationMin(seconds) {
  return Math.max(1, Math.round((seconds || 0) / 60)) + ' min';
}

function calcBearingFromCoords(start, end) {
  if (!start || !end) return 0;
  var lat1 = start[1] * Math.PI / 180;
  var lat2 = end[1] * Math.PI / 180;
  var dLon = (end[0] - start[0]) * Math.PI / 180;

  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2)
    - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  var brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

function setGaugeMinutes(minutes) {
  if (!elements.autonomyValue || !elements.autonomyRing) return;
  var maxMinutes = 35;
  var clamped = Math.max(8, Math.min(maxMinutes, Math.round(minutes)));
  var circumference = 245;
  var progress = clamped / maxMinutes;
  var dashOffset = roundNumber(circumference * (1 - progress), 2);

  elements.autonomyValue.textContent = String(clamped);
  elements.autonomyRing.setAttribute('stroke-dashoffset', String(dashOffset));
}

function computeDroneAdvice(current, hourlyPrecipProbability) {
  var wind = current.wind_speed_10m || 0;
  var gust = current.wind_gusts_10m || wind;
  var visibilityKm = visibilityToKm(current.visibility);
  var precipProb = hourlyPrecipProbability || 0;

  var risk = 'baixo';
  if (gust >= 35 || wind >= 28 || precipProb >= 70 || (visibilityKm !== null && visibilityKm < 2.5)) {
    risk = 'alto';
  } else if (gust >= 25 || wind >= 18 || precipProb >= 40 || (visibilityKm !== null && visibilityKm < 5)) {
    risk = 'moderado';
  }

  var recommendedSpeed = 34 - (wind * 0.55) - (precipProb * 0.04);
  if (risk === 'alto') recommendedSpeed -= 4;
  if (visibilityKm !== null && visibilityKm < 4) recommendedSpeed -= 2;
  recommendedSpeed = Math.max(12, Math.min(32, Math.round(recommendedSpeed)));

  var estimatedAutonomy = 30 - (wind * 0.25) - (precipProb * 0.04);
  if (visibilityKm !== null && visibilityKm < 4) estimatedAutonomy -= 2;
  estimatedAutonomy = Math.max(8, Math.min(35, estimatedAutonomy));

  return {
    risk: risk,
    recommendedSpeed: recommendedSpeed,
    estimatedAutonomy: estimatedAutonomy,
    wind: wind,
    gust: gust,
    precipProb: precipProb,
    visibilityKm: visibilityKm
  };
}

function findCurrentHourPrecipProbability(weatherData) {
  if (!weatherData || !weatherData.current || !weatherData.hourly) return null;
  var hourly = weatherData.hourly;
  if (!hourly.time || !hourly.precipitation_probability) return null;

  var currentTime = weatherData.current.time;
  var idx = hourly.time.indexOf(currentTime);
  if (idx === -1) return null;
  return hourly.precipitation_probability[idx];
}

function weatherRiskLabel(score) {
  if (score >= 75) return 'baixo';
  if (score >= 55) return 'moderado';
  return 'alto';
}

function scoreRouteForDrone(route, weatherCurrent, precipProb) {
  var coords = route.geometry && route.geometry.coordinates ? route.geometry.coordinates : [];
  var start = coords.length > 0 ? coords[0] : null;
  var end = coords.length > 1 ? coords[coords.length - 1] : start;

  var bearing = calcBearingFromCoords(start, end);
  var windDir = weatherCurrent.wind_direction_10m || 0;
  var wind = weatherCurrent.wind_speed_10m || 0;
  var gust = weatherCurrent.wind_gusts_10m || wind;
  var rain = precipProb || 0;

  var delta = Math.abs(bearing - windDir);
  if (delta > 180) delta = 360 - delta;
  var crosswindFactor = Math.abs(Math.sin(delta * Math.PI / 180));

  var distanceKm = (route.distance || 0) / 1000;
  var durationMin = (route.duration || 0) / 60;
  var exposurePenalty = (durationMin * 0.35) + (distanceKm * 0.8);
  var windPenalty = (wind * crosswindFactor * 1.6) + (gust * 0.25);
  var rainPenalty = rain * 0.35;
  var visibilityPenalty = 0;
  if (weatherCurrent.visibility !== null && weatherCurrent.visibility !== undefined) {
    var visKm = visibilityToKm(weatherCurrent.visibility);
    if (visKm < 2.5) visibilityPenalty = 18;
    else if (visKm < 5) visibilityPenalty = 10;
    else if (visKm < 8) visibilityPenalty = 4;
  }

  var score = 100 - exposurePenalty - windPenalty - rainPenalty - visibilityPenalty;
  score = Math.max(5, Math.min(99, roundNumber(score, 1)));

  return {
    distanceKm: distanceKm,
    durationMin: durationMin,
    safetyScore: score,
    risk: weatherRiskLabel(score)
  };
}

function setRouteCardValues(kind, data) {
  var titleEl = elements.routeFastestTitle;
  var distanceEl = elements.routeFastestDistance;
  var timeEl = elements.routeFastestTime;
  var riskEl = elements.routeFastestRisk;

  if (kind === 'balanced') {
    titleEl = elements.routeBalancedTitle;
    distanceEl = elements.routeBalancedDistance;
    timeEl = elements.routeBalancedTime;
    riskEl = elements.routeBalancedRisk;
  } else if (kind === 'safe') {
    titleEl = elements.routeSafeTitle;
    distanceEl = elements.routeSafeDistance;
    timeEl = elements.routeSafeTime;
    riskEl = elements.routeSafeRisk;
  }

  if (titleEl && data.title) titleEl.textContent = data.title;
  if (distanceEl) distanceEl.innerHTML = '<i class="bi bi-map"></i> ' + formatDistanceKm(data.route.distance);
  if (timeEl) timeEl.innerHTML = '<i class="bi bi-clock"></i> ' + formatDurationMin(data.route.duration);
  if (riskEl) riskEl.innerHTML = '<i class="bi bi-shield-check"></i> risco ' + data.metrics.risk + ' (' + Math.round(data.metrics.safetyScore) + ')';
}

function renderRouteRecommendations(routes, weatherData) {
  if (!routes || routes.length === 0 || !weatherData || !weatherData.current) return;

  var precipProb = findCurrentHourPrecipProbability(weatherData) || 0;
  var ranked = routes.map(function(route) {
    return {
      route: route,
      metrics: scoreRouteForDrone(route, weatherData.current, precipProb)
    };
  });

  var fastest = ranked.reduce(function(best, current) {
    return current.route.duration < best.route.duration ? current : best;
  }, ranked[0]);

  var safest = ranked.reduce(function(best, current) {
    return current.metrics.safetyScore > best.metrics.safetyScore ? current : best;
  }, ranked[0]);

  var balanced = ranked.reduce(function(best, current) {
    var bestScore = best.metrics.safetyScore - (best.route.duration / 60) * 0.9;
    var currentScore = current.metrics.safetyScore - (current.route.duration / 60) * 0.9;
    return currentScore > bestScore ? current : best;
  }, ranked[0]);

  setRouteCardValues('fastest', {
    title: '⚡ Mais rapida',
    route: fastest.route,
    metrics: fastest.metrics
  });
  setRouteCardValues('balanced', {
    title: '🍃 Equilibrada',
    route: balanced.route,
    metrics: balanced.metrics
  });
  setRouteCardValues('safe', {
    title: '🛡️ Mais segura',
    route: safest.route,
    metrics: safest.metrics
  });
}

function updateWeatherUI(weatherData, locationLabel) {
  var current = weatherData.current;
  var precipProb = findCurrentHourPrecipProbability(weatherData);
  var advice = computeDroneAdvice(current, precipProb);

  if (elements.weatherLocation) {
    elements.weatherLocation.textContent = 'Local: ' + locationLabel + ' | Atualizado: ' + current.time.replace('T', ' ');
  }

  if (elements.weatherWindValue) elements.weatherWindValue.textContent = String(Math.round(advice.wind));
  if (elements.weatherWindUnit) elements.weatherWindUnit.textContent = 'km/h';
  if (elements.weatherRainValue) {
    if (advice.precipProb === null || advice.precipProb === undefined) {
      elements.weatherRainValue.textContent = roundNumber(current.precipitation || 0, 1) + '';
      if (elements.weatherRainUnit) elements.weatherRainUnit.textContent = 'mm/h chuva';
    } else {
      elements.weatherRainValue.textContent = String(Math.round(advice.precipProb)) + '%';
      if (elements.weatherRainUnit) elements.weatherRainUnit.textContent = 'prob. chuva';
    }
  }
  if (elements.weatherVisibilityValue) {
    elements.weatherVisibilityValue.textContent = advice.visibilityKm === null ? 'n/a' : String(advice.visibilityKm);
  }
  if (elements.weatherVisibilityUnit) elements.weatherVisibilityUnit.textContent = 'km vis.';

  if (elements.frotaWindValue) {
    elements.frotaWindValue.textContent = Math.round(advice.wind) + ' km/h';
  }
  if (elements.frotaWindDirection) {
    elements.frotaWindDirection.textContent = 'dir. ' + degToCompass(current.wind_direction_10m);
  }
  if (elements.vooWindOverlay) {
    elements.vooWindOverlay.textContent = Math.round(advice.wind) + ' km/h (raj. ' + Math.round(advice.gust) + ')';
  }
  if (elements.vooSpeedValue) {
    elements.vooSpeedValue.textContent = String(advice.recommendedSpeed);
  }

  setGaugeMinutes(advice.estimatedAutonomy);

  if (elements.autonomyCaption) {
    elements.autonomyCaption.textContent = 'Autonomia estimada (' + advice.risk + ' risco)';
  }

  if (elements.flightAlertBanner) {
    if (advice.risk === 'alto') {
      elements.flightAlertBanner.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Risco alto: reduzir para ' + advice.recommendedSpeed + ' km/h e considerar adiamento';
      elements.flightAlertBanner.style.background = '#FFE5E5';
      elements.flightAlertBanner.style.color = '#A90E0E';
    } else if (advice.risk === 'moderado') {
      elements.flightAlertBanner.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Condicoes moderadas: operar ate ' + advice.recommendedSpeed + ' km/h';
      elements.flightAlertBanner.style.background = '#FFF4D6';
      elements.flightAlertBanner.style.color = '#875500';
    } else {
      elements.flightAlertBanner.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Condicoes estaveis para voo nesta zona';
      elements.flightAlertBanner.style.background = '#E8F8EE';
      elements.flightAlertBanner.style.color = '#0F6B35';
    }
  }
}

function buildWeatherUrl(lat, lon) {
  var params = [
    'latitude=' + encodeURIComponent(lat),
    'longitude=' + encodeURIComponent(lon),
    'current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,weather_code',
    'hourly=precipitation_probability',
    'timezone=auto'
  ];
  return WEATHER_API_BASE + '?' + params.join('&');
}

function fetchWeatherDataByCoords(lat, lon) {
  return fetch(buildWeatherUrl(lat, lon))
    .then(function(response) {
      if (!response.ok) throw new Error('Falha na API de meteo');
      return response.json();
    })
    .then(function(data) {
      if (!data || !data.current) throw new Error('Resposta meteo invalida');
      return data;
    });
}

function fetchWeatherByCoords(lat, lon, label) {
  setStatus('A obter meteo real...', false);

  return fetchWeatherDataByCoords(lat, lon)
    .then(function(data) {
      if (!data || !data.current) throw new Error('Resposta meteo invalida');
      updateWeatherUI(data, label);
      setStatus('Meteo atualizada com sucesso', false);
    })
    .catch(function(error) {
      setStatus('Erro ao obter meteo: ' + error.message, true);
    });
}

function geocodeDestination(query) {
  var url = GEOCODING_API_BASE
    + '?name=' + encodeURIComponent(query)
    + '&count=1&language=pt&format=json';

  return fetch(url)
    .then(function(response) {
      if (!response.ok) throw new Error('Falha na geocodificacao');
      return response.json();
    })
    .then(function(data) {
      if (!data || !data.results || data.results.length === 0) {
        throw new Error('Destino nao encontrado');
      }
      return data.results[0];
    });
}

function fetchRouteAlternatives(origin, destination) {
  var url = ROUTING_API_BASE
    + '/' + encodeURIComponent(origin.longitude) + ',' + encodeURIComponent(origin.latitude)
    + ';' + encodeURIComponent(destination.longitude) + ',' + encodeURIComponent(destination.latitude)
    + '?alternatives=true&overview=full&geometries=geojson&steps=false';

  return fetch(url)
    .then(function(response) {
      if (!response.ok) throw new Error('Falha na API de rotas');
      return response.json();
    })
    .then(function(data) {
      if (!data || !data.routes || data.routes.length === 0) {
        throw new Error('Sem rotas para esta origem/destino');
      }
      return data.routes.slice(0, 3);
    });
}

function calculateRouteFromInputs() {
  if (!elements.originInput || !elements.destinationInput) return;

  var originText = (elements.originInput.value || '').trim();
  var destinationText = (elements.destinationInput.value || '').trim();

  if (!originText || !destinationText) {
    setStatus('Preenche origem e destino para calcular rota.', true);
    return;
  }

  setStatus('A calcular rota e condicoes de voo...', false);

  Promise.all([geocodeDestination(originText), geocodeDestination(destinationText)])
    .then(function(places) {
      var origin = places[0];
      var destination = places[1];
      var midLat = (origin.latitude + destination.latitude) / 2;
      var midLon = (origin.longitude + destination.longitude) / 2;
      var locationLabel = origin.name + ' → ' + destination.name;

      return Promise.all([
        fetchRouteAlternatives(origin, destination),
        fetchWeatherDataByCoords(midLat, midLon)
      ]).then(function(data) {
        return {
          routes: data[0],
          weather: data[1],
          label: locationLabel
        };
      });
    })
    .then(function(result) {
      updateWeatherUI(result.weather, result.label);
      renderRouteRecommendations(result.routes, result.weather);
      setStatus('Rota mais rapida e mais segura calculadas', false);
    })
    .catch(function(error) {
      setStatus(error.message, true);
    });
}

function fetchWeatherFromCurrentLocation() {
  if (!navigator.geolocation) {
    setStatus('Geolocalizacao indisponivel. Usa um destino manual.', true);
    return;
  }

  setStatus('A obter geolocalizacao...', false);
  navigator.geolocation.getCurrentPosition(
    function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var label = 'Posicao atual';
      fetchWeatherByCoords(lat, lon, label);
    },
    function() {
      setStatus('Sem permissao de localizacao. Usa um destino manual.', true);
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
}

document.addEventListener('DOMContentLoaded', function() {
  elements.originInput = document.getElementById('origin-input');
  elements.destinationInput = document.getElementById('destination-input');
  elements.weatherStatus = document.getElementById('weather-status');
  elements.weatherLocation = document.getElementById('weather-location');
  elements.weatherWindValue = document.getElementById('weather-wind-value');
  elements.weatherWindUnit = document.getElementById('weather-wind-unit');
  elements.weatherRainValue = document.getElementById('weather-rain-value');
  elements.weatherRainUnit = document.getElementById('weather-rain-unit');
  elements.weatherVisibilityValue = document.getElementById('weather-visibility-value');
  elements.weatherVisibilityUnit = document.getElementById('weather-visibility-unit');
  elements.frotaWindValue = document.getElementById('frota-wind-value');
  elements.frotaWindDirection = document.getElementById('frota-wind-direction');
  elements.vooWindOverlay = document.getElementById('voo-wind-overlay');
  elements.flightAlertBanner = document.getElementById('flight-alert-banner');
  elements.vooSpeedValue = document.getElementById('voo-speed-value');
  elements.autonomyValue = document.getElementById('autonomy-value');
  elements.autonomyRing = document.getElementById('autonomy-ring');
  elements.autonomyCaption = document.getElementById('autonomy-caption');
  elements.calculateRouteBtn = document.getElementById('btn-calculate-route');
  elements.routeFastestTitle = document.getElementById('route-fastest-title');
  elements.routeFastestDistance = document.getElementById('route-fastest-distance');
  elements.routeFastestTime = document.getElementById('route-fastest-time');
  elements.routeFastestRisk = document.getElementById('route-fastest-risk');
  elements.routeBalancedTitle = document.getElementById('route-balanced-title');
  elements.routeBalancedDistance = document.getElementById('route-balanced-distance');
  elements.routeBalancedTime = document.getElementById('route-balanced-time');
  elements.routeBalancedRisk = document.getElementById('route-balanced-risk');
  elements.routeSafeTitle = document.getElementById('route-safe-title');
  elements.routeSafeDistance = document.getElementById('route-safe-distance');
  elements.routeSafeTime = document.getElementById('route-safe-time');
  elements.routeSafeRisk = document.getElementById('route-safe-risk');

  if (elements.calculateRouteBtn) {
    elements.calculateRouteBtn.addEventListener('click', calculateRouteFromInputs);
  }

  if (elements.originInput) {
    elements.originInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        calculateRouteFromInputs();
      }
    });
  }

  if (elements.destinationInput) {
    elements.destinationInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        calculateRouteFromInputs();
      }
    });
  }

  fetchWeatherFromCurrentLocation();
});

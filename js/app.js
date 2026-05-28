var screenTabMap = {
  'screen-frota': 'tab-frota',
  'screen-planeamento': 'tab-planeamento',
  'screen-voo': 'tab-voo',
  'screen-historico': 'tab-historico'
};

var WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
var GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
var REVERSE_GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/reverse';
var ROUTING_API_BASE = 'https://router.project-osrm.org/route/v1/driving';
var DRONE_MODELS_API_BASE = 'https://query.wikidata.org/sparql';
var LOCAL_DRONE_MODELS_PATH = 'data/drone-models.json';

var ROUTE_CLIMATE_WIND_WEIGHTS = {
  route: 0.35,
  climate: 0.25,
  wind: 0.40
};

var ROUTE_LIMITS = {
  maxDurationMin: 40,
  maxDistanceKm: 20
};

var CLIMATE_LIMITS = {
  maxPrecipProb: 100,
  maxPrecipMmHour: 8,
  lowVisibilityKm: 2.5,
  mediumVisibilityKm: 5,
  highVisibilityKm: 8
};

var WIND_LIMITS = {
  maxWindKmh: 35,
  maxGustKmh: 45
};

var EMERGENCY_DRONE_MODELS = [
  { id: 'atlas_x4', label: 'Atlas X4', manufacturer: 'AeroMatrix', autonomyMin: 42, maxSpeedKmh: 68, maxPayloadG: 1200, recommendedUse: 'Inspecao industrial e vigilancia perimetral' },
  { id: 'vento_s9', label: 'Vento S9', manufacturer: 'SkyForge', autonomyMin: 36, maxSpeedKmh: 74, maxPayloadG: 850, recommendedUse: 'Resposta rapida e missao urbana curta' },
  { id: 'falcon_edge', label: 'Falcon Edge', manufacturer: 'Helix Dynamics', autonomyMin: 48, maxSpeedKmh: 63, maxPayloadG: 1500, recommendedUse: 'Topografia e captura fotografica prolongada' }
];

var droneModelsCache = [];
var currentDroneProfile = {
  id: 'default',
  label: 'Drone generico',
  manufacturer: 'N/A',
  maxSpeedKmh: 52,
  cruiseSpeedKmh: 31,
  minOperationalSpeedKmh: 10,
  maxOperationalSpeedKmh: 35,
  baseAutonomyMin: 30,
  maxWindKmh: 30,
  maxGustKmh: 40,
  maxPayloadG: 0,
  recommendedUse: 'Operacao geral'
};

var startupState = {
  modelsReady: false,
  weatherReady: false,
  minimumDelayDone: false,
  splashHidden: false
};

var historySortState = {
  key: 'date',
  direction: 'desc'
};

var flightHistory = [
  { date: '2026-05-28 09:10', origin: 'Porto', destination: 'Maia', model: 'Atlas X4', score: 92, duration: 14 },
  { date: '2026-05-28 08:35', origin: 'Braga', destination: 'Guimaraes', model: 'Falcon Edge', score: 84, duration: 19 },
  { date: '2026-05-27 17:20', origin: 'Aveiro', destination: 'Ilhavo', model: 'Sentinel R3', score: 88, duration: 11 },
  { date: '2026-05-27 15:05', origin: 'Viseu', destination: 'Tondela', model: 'Zephyr Duo', score: 76, duration: 18 },
  { date: '2026-05-27 11:45', origin: 'Coimbra', destination: 'Figueira da Foz', model: 'Cargo H12', score: 68, duration: 27 },
  { date: '2026-05-26 16:50', origin: 'Setubal', destination: 'Palmela', model: 'Lince MK2', score: 72, duration: 13 }
];

var elements = {
  frotaDroneTitle: null,
  droneModelSelect: null,
  droneModelStatus: null,
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
  useCurrentLocationBtn: null,
  calculateRouteBtn: null,
  startFlightBtn: null,
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
  routeSafeRisk: null,
  detailOverallScore: null,
  detailRoute: null,
  detailClimate: null,
  detailWind: null,
  detailWeights: null,
  splashScreen: null,
  splashStatus: null,
  splashProgressBar: null,
  instrumentWind: null,
  instrumentSpeed: null,
  instrumentAutonomy: null,
  instrumentAlert: null,
  instrumentWindValue: null,
  instrumentSpeedValue: null,
  instrumentAutonomyValue: null,
  instrumentAlertValue: null,
  instrumentAlertState: null,
  instrumentAlertHint: null,
  historyTableBody: null,
  exportHistoryBtn: null,
  sortButtons: []
};

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(function(screen) {
    screen.classList.remove('active');
  });

  document.querySelectorAll('.nav-tab').forEach(function(tab) {
    tab.classList.remove('active');
  });

  var screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add('active');
    screen.scrollTop = 0;
  }

  var tabId = screenTabMap[screenId];
  var tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');
}

function setStatus(message, isError) {
  if (!elements.weatherStatus) return;
  elements.weatherStatus.textContent = message;
  elements.weatherStatus.style.color = isError ? '#ff8e98' : '';
}

function setDroneModelStatus(message, isError) {
  if (!elements.droneModelStatus) return;
  elements.droneModelStatus.textContent = message;
  elements.droneModelStatus.style.color = isError ? '#ffb3bb' : '';
}

function setSplashStatus(message, progress) {
  if (elements.splashStatus) elements.splashStatus.textContent = message;
  if (elements.splashProgressBar && typeof progress === 'number') {
    elements.splashProgressBar.style.width = clamp(progress, 8, 100) + '%';
  }
}

function tryHideSplashScreen() {
  if (startupState.splashHidden) return;
  if (!startupState.modelsReady || !startupState.weatherReady || !startupState.minimumDelayDone) return;

  startupState.splashHidden = true;
  setSplashStatus('Sistema pronto para operacao', 100);

  if (elements.splashScreen) {
    elements.splashScreen.classList.add('hidden');
    window.setTimeout(function() {
      elements.splashScreen.classList.remove('active');
    }, 420);
  }
}

function markStartupReady(kind, message, progress) {
  if (kind === 'models') startupState.modelsReady = true;
  if (kind === 'weather') startupState.weatherReady = true;
  if (message) setSplashStatus(message, progress);
  tryHideSplashScreen();
}

function roundNumber(value, digits) {
  var factor = Math.pow(10, digits || 0);
  return Math.round(value * factor) / factor;
}

function clamp(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(maxValue, value));
}

function normalizeLabel(label) {
  return String(label || '').replace(/\s+/g, ' ').trim();
}

function parseNumericBinding(bindingValue) {
  var num = parseFloat(bindingValue);
  if (isNaN(num)) return null;
  return num;
}

function mapLocalDroneModel(model) {
  return {
    id: model.id,
    label: model.name,
    manufacturer: model.manufacturer || 'N/A',
    autonomyMin: model.autonomyMin,
    maxSpeedKmh: model.maxSpeedKmh,
    maxPayloadG: model.maxPayloadG,
    recommendedUse: model.recommendedUse || 'Operacao geral'
  };
}

function buildDroneProfile(model) {
  var maxSpeed = clamp(model.maxSpeedKmh || 52, 25, 120);
  var cruise = clamp(Math.round(maxSpeed * 0.60), 16, 48);
  var baseAutonomy = clamp(model.autonomyMin || Math.round(42 - (maxSpeed * 0.18)), 16, 55);
  var maxWind = clamp(Math.round(maxSpeed * 0.52), 16, 45);
  var maxGust = clamp(maxWind + 10, 25, 58);

  return {
    id: model.id,
    label: model.label,
    manufacturer: model.manufacturer || 'N/A',
    maxSpeedKmh: maxSpeed,
    cruiseSpeedKmh: cruise,
    minOperationalSpeedKmh: 10,
    maxOperationalSpeedKmh: clamp(Math.round(cruise + 6), 20, 50),
    baseAutonomyMin: baseAutonomy,
    maxWindKmh: maxWind,
    maxGustKmh: maxGust,
    maxPayloadG: model.maxPayloadG || 0,
    recommendedUse: model.recommendedUse || 'Operacao geral'
  };
}

function renderDroneModelOptions(models) {
  if (!elements.droneModelSelect) return;
  elements.droneModelSelect.innerHTML = '';

  models.forEach(function(model, index) {
    var option = document.createElement('option');
    option.value = model.id;
    option.textContent = model.manufacturer ? model.label + ' | ' + model.manufacturer : model.label;
    if (index === 0) option.selected = true;
    elements.droneModelSelect.appendChild(option);
  });
}

function applyDroneModel(modelId) {
  var found = droneModelsCache.find(function(item) {
    return item.id === modelId;
  });

  if (!found && droneModelsCache.length > 0) found = droneModelsCache[0];
  if (!found) return;

  currentDroneProfile = buildDroneProfile(found);
  WIND_LIMITS.maxWindKmh = currentDroneProfile.maxWindKmh;
  WIND_LIMITS.maxGustKmh = currentDroneProfile.maxGustKmh;

  if (elements.frotaDroneTitle) {
    elements.frotaDroneTitle.textContent = 'Drone A1 | ' + currentDroneProfile.label;
  }

  if (elements.detailWeights) {
    elements.detailWeights.textContent = 'Pesos: rota ' + Math.round(ROUTE_CLIMATE_WIND_WEIGHTS.route * 100)
      + '% | clima ' + Math.round(ROUTE_CLIMATE_WIND_WEIGHTS.climate * 100)
      + '% | vento ' + Math.round(ROUTE_CLIMATE_WIND_WEIGHTS.wind * 100)
      + '% | modelo ' + currentDroneProfile.label;
  }

  setDroneModelStatus(
    'Perfil ativo: ' + currentDroneProfile.label + ' | autonomia base ' + currentDroneProfile.baseAutonomyMin
    + ' min | payload ' + currentDroneProfile.maxPayloadG + ' g | uso ' + currentDroneProfile.recommendedUse,
    false
  );
}

function fetchDroneModelsFromApi() {
  var query = [
    'SELECT ?item ?itemLabel ?manufacturerLabel ?maxSpeed WHERE {',
    '  ?item wdt:P31/wdt:P279* wd:Q484000 .',
    '  OPTIONAL { ?item wdt:P176 ?manufacturer . }',
    '  OPTIONAL { ?item wdt:P2052 ?maxSpeed . }',
    '  SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en" . }',
    '}',
    'LIMIT 80'
  ].join(' ');

  var url = DRONE_MODELS_API_BASE + '?format=json&query=' + encodeURIComponent(query);

  return fetch(url, {
    headers: {
      Accept: 'application/sparql-results+json'
    }
  })
    .then(function(response) {
      if (!response.ok) throw new Error('Falha ao obter modelos por API');
      return response.json();
    })
    .then(function(payload) {
      var bindings = payload && payload.results ? payload.results.bindings || [] : [];
      var seen = {};
      var models = [];

      bindings.forEach(function(row) {
        var label = normalizeLabel(row.itemLabel && row.itemLabel.value);
        if (!label || label.length < 3) return;

        var idSource = (row.item && row.item.value) || label;
        var id = 'wd_' + idSource.split('/').pop().toLowerCase();
        if (seen[id]) return;
        seen[id] = true;

        models.push({
          id: id,
          label: label,
          manufacturer: normalizeLabel(row.manufacturerLabel && row.manufacturerLabel.value) || 'N/A',
          maxSpeedKmh: parseNumericBinding(row.maxSpeed && row.maxSpeed.value) || null,
          autonomyMin: null,
          maxPayloadG: 0,
          recommendedUse: 'Modelo importado por API'
        });
      });

      if (models.length === 0) throw new Error('Sem modelos validos na API');
      return models.slice(0, 40);
    });
}

function fetchLocalDroneModels() {
  return fetch(LOCAL_DRONE_MODELS_PATH)
    .then(function(response) {
      if (!response.ok) throw new Error('Falha ao ler dados locais');
      return response.json();
    })
    .then(function(models) {
      if (!Array.isArray(models) || models.length === 0) {
        throw new Error('JSON local sem modelos');
      }
      return models.map(mapLocalDroneModel);
    });
}

function loadDroneModels() {
  setSplashStatus('A carregar frota...', 28);
  setDroneModelStatus('A obter modelos de aeronave...', false);

  fetchDroneModelsFromApi()
    .catch(function() {
      setDroneModelStatus('API externa indisponivel. A usar catalogo local.', true);
      return fetchLocalDroneModels();
    })
    .catch(function() {
      setDroneModelStatus('Catalogo local indisponivel. A usar reserva minima.', true);
      return EMERGENCY_DRONE_MODELS.slice();
    })
    .then(function(models) {
      droneModelsCache = models;
      renderDroneModelOptions(models);
      applyDroneModel(models[0].id);
      markStartupReady('models', 'Frota sincronizada', 56);
    });
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
  var maxMinutes = 55;
  var clamped = Math.max(8, Math.min(maxMinutes, Math.round(minutes)));
  var circumference = 245;
  var progress = clamped / maxMinutes;
  var dashOffset = roundNumber(circumference * (1 - progress), 2);

  elements.autonomyValue.textContent = String(clamped);
  elements.autonomyRing.setAttribute('stroke-dashoffset', String(dashOffset));
}

function computeDroneAdvice(current, hourlyPrecipProbability) {
  var profile = currentDroneProfile;
  var wind = current.wind_speed_10m || 0;
  var gust = current.wind_gusts_10m || wind;
  var visibilityKm = visibilityToKm(current.visibility);
  var precipProb = hourlyPrecipProbability || 0;

  var risk = 'baixo';
  if (gust >= profile.maxGustKmh || wind >= 50 || precipProb >= 70 || (visibilityKm !== null && visibilityKm < 2.5)) {
    risk = 'alto';
  } else if (gust >= profile.maxGustKmh * 0.75 || wind >= 30 || precipProb >= 40 || (visibilityKm !== null && visibilityKm < 5)) {
    risk = 'moderado';
  }

  var recommendedSpeed = profile.cruiseSpeedKmh - (wind * 0.55) - (precipProb * 0.04);
  if (risk === 'alto') recommendedSpeed -= 4;
  if (visibilityKm !== null && visibilityKm < 4) recommendedSpeed -= 2;
  recommendedSpeed = Math.max(profile.minOperationalSpeedKmh, Math.min(profile.maxOperationalSpeedKmh, Math.round(recommendedSpeed)));

  var estimatedAutonomy = profile.baseAutonomyMin - (wind * 0.25) - (precipProb * 0.04);
  if (visibilityKm !== null && visibilityKm < 4) estimatedAutonomy -= 2;
  estimatedAutonomy = Math.max(8, Math.min(55, estimatedAutonomy));

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
  if (!weatherData.hourly.time || !weatherData.hourly.precipitation_probability) return null;

  var currentTime = weatherData.current.time;
  var idx = weatherData.hourly.time.indexOf(currentTime);
  if (idx === -1) return null;
  return weatherData.hourly.precipitation_probability[idx];
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
  var visibilityKm = weatherCurrent.visibility !== null && weatherCurrent.visibility !== undefined
    ? visibilityToKm(weatherCurrent.visibility)
    : null;
  var precipitationMmHour = weatherCurrent.precipitation || 0;

  var routeRisk = clamp(
    ((durationMin / ROUTE_LIMITS.maxDurationMin) * 0.6)
      + ((distanceKm / ROUTE_LIMITS.maxDistanceKm) * 0.4),
    0,
    1
  );

  var rainProbabilityRisk = clamp(rain / CLIMATE_LIMITS.maxPrecipProb, 0, 1);
  var rainIntensityRisk = clamp(precipitationMmHour / CLIMATE_LIMITS.maxPrecipMmHour, 0, 1);
  var visibilityRisk = 0;
  if (visibilityKm !== null) {
    if (visibilityKm < CLIMATE_LIMITS.lowVisibilityKm) visibilityRisk = 1;
    else if (visibilityKm < CLIMATE_LIMITS.mediumVisibilityKm) visibilityRisk = 0.7;
    else if (visibilityKm < CLIMATE_LIMITS.highVisibilityKm) visibilityRisk = 0.35;
  }

  var climateRisk = clamp(
    (rainProbabilityRisk * 0.45) + (rainIntensityRisk * 0.25) + (visibilityRisk * 0.30),
    0,
    1
  );

  var baseWindRisk = clamp(wind / WIND_LIMITS.maxWindKmh, 0, 1);
  var gustRisk = clamp(gust / WIND_LIMITS.maxGustKmh, 0, 1);
  var crossWindRisk = clamp(baseWindRisk * crosswindFactor, 0, 1);
  var windRisk = clamp(
    (baseWindRisk * 0.35) + (gustRisk * 0.25) + (crossWindRisk * 0.40),
    0,
    1
  );

  var totalRisk = (
    (routeRisk * ROUTE_CLIMATE_WIND_WEIGHTS.route)
    + (climateRisk * ROUTE_CLIMATE_WIND_WEIGHTS.climate)
    + (windRisk * ROUTE_CLIMATE_WIND_WEIGHTS.wind)
  );

  var score = roundNumber(clamp((1 - totalRisk) * 100, 5, 99), 1);

  return {
    distanceKm: distanceKm,
    durationMin: durationMin,
    safetyScore: score,
    risk: weatherRiskLabel(score),
    context: {
      windKmh: roundNumber(wind, 1),
      gustKmh: roundNumber(gust, 1),
      precipProb: Math.round(rain),
      precipMmHour: roundNumber(precipitationMmHour, 1),
      visibilityKm: visibilityKm,
      crosswindPercent: Math.round(crosswindFactor * 100)
    },
    breakdown: {
      route: Math.round(routeRisk * 100),
      climate: Math.round(climateRisk * 100),
      wind: Math.round(windRisk * 100)
    }
  };
}

function renderScoreDetails(primaryRoute) {
  if (!primaryRoute || !primaryRoute.metrics) return;
  var metrics = primaryRoute.metrics;
  var ctx = metrics.context || {};

  if (elements.detailOverallScore) {
    elements.detailOverallScore.textContent = 'Score geral: ' + Math.round(metrics.safetyScore)
      + ' (' + metrics.risk + ' risco)';
  }
  if (elements.detailRoute) {
    elements.detailRoute.textContent = 'Rota: ' + metrics.breakdown.route + '% risco | '
      + roundNumber(metrics.distanceKm, 1) + ' km | ' + Math.round(metrics.durationMin) + ' min';
  }
  if (elements.detailClimate) {
    elements.detailClimate.textContent = 'Clima: ' + metrics.breakdown.climate + '% risco | chuva '
      + (ctx.precipProb || 0) + '% (' + (ctx.precipMmHour || 0) + ' mm/h) | vis. '
      + (ctx.visibilityKm === null || ctx.visibilityKm === undefined ? 'n/a' : ctx.visibilityKm + ' km');
  }
  if (elements.detailWind) {
    elements.detailWind.textContent = 'Vento: ' + metrics.breakdown.wind + '% risco | '
      + (ctx.windKmh || 0) + ' km/h (raj. ' + (ctx.gustKmh || 0) + ' km/h) | lateral '
      + (ctx.crosswindPercent || 0) + '%';
  }
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
  if (riskEl) {
    riskEl.innerHTML = '<i class="bi bi-shield-check"></i> risco ' + data.metrics.risk
      + ' (' + Math.round(data.metrics.safetyScore) + ')'
      + ' R' + data.metrics.breakdown.route
      + ' C' + data.metrics.breakdown.climate
      + ' V' + data.metrics.breakdown.wind;
  }
}

function scoreLevel(score) {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-medium';
  return 'score-low';
}

function addFlightHistoryEntry(entry) {
  flightHistory.unshift(entry);
  renderHistoryTable();
}

function renderRouteRecommendations(routes, weatherData, routeLabel) {
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
    title: 'Mais rapida',
    route: fastest.route,
    metrics: fastest.metrics
  });
  setRouteCardValues('balanced', {
    title: 'Equilibrada',
    route: balanced.route,
    metrics: balanced.metrics
  });
  setRouteCardValues('safe', {
    title: 'Mais segura',
    route: safest.route,
    metrics: safest.metrics
  });

  renderScoreDetails(safest);

  if (routeLabel) {
    addFlightHistoryEntry({
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      origin: routeLabel.origin,
      destination: routeLabel.destination,
      model: currentDroneProfile.label,
      score: Math.round(safest.metrics.safetyScore),
      duration: Math.round(safest.metrics.durationMin)
    });
  }
}

function updateInstrumentCard(element, status, stateText) {
  if (!element) return;
  element.classList.remove('status-normal', 'status-warning', 'status-danger');
  element.classList.add(status);
  var stateEl = element.querySelector('.instrument-state');
  if (stateEl && stateText) stateEl.textContent = stateText;
}

function updateOperationalAlerts(advice) {
  var wind = Math.round(advice.wind);
  var gust = Math.round(advice.gust);
  var alertClass = 'alert-normal';
  var bannerMessage = '<i class="bi bi-check-circle-fill me-2"></i>Condicoes estaveis. Corredor operacional dentro da margem planeada.';
  var alertState = 'estavel';
  var alertValue = 'Normal';
  var alertHint = 'Sem indicios de risco operacional imediato.';
  var windStatus = 'status-normal';
  var speedStatus = advice.risk === 'alto' ? 'status-warning' : 'status-normal';
  var autonomyStatus = advice.estimatedAutonomy < 15 ? 'status-warning' : 'status-normal';

  if (wind > 50) {
    alertClass = 'alert-danger';
    bannerMessage = '<i class="bi bi-exclamation-octagon-fill me-2"></i>Alerta vermelho: vento acima de 50 km/h. Recomenda-se aterrar e suspender a missao.';
    alertState = 'aterrar';
    alertValue = 'Critico';
    alertHint = 'Ate nova avaliacao, executar procedimento seguro de aterragem.';
    windStatus = 'status-danger';
    speedStatus = 'status-danger';
    autonomyStatus = advice.estimatedAutonomy < 12 ? 'status-danger' : 'status-warning';
  } else if (wind > 30) {
    alertClass = 'alert-warning';
    bannerMessage = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Alerta amarelo: vento acima de 30 km/h. Reduza velocidade e monitorize a aproximacao.';
    alertState = 'monitorizar';
    alertValue = 'Elevado';
    alertHint = 'Manter corredor alternativo de regresso preparado.';
    windStatus = 'status-warning';
    speedStatus = 'status-warning';
  }

  if (elements.flightAlertBanner) {
    elements.flightAlertBanner.classList.remove('alert-normal', 'alert-warning', 'alert-danger', 'pulse');
    elements.flightAlertBanner.classList.add(alertClass);
    if (alertClass === 'alert-danger') elements.flightAlertBanner.classList.add('pulse');
    elements.flightAlertBanner.innerHTML = bannerMessage;
  }

  updateInstrumentCard(elements.instrumentWind, windStatus, wind > 50 ? 'critico' : wind > 30 ? 'vigilancia' : 'normal');
  updateInstrumentCard(elements.instrumentSpeed, speedStatus, advice.risk === 'alto' ? 'restrita' : 'cruzeiro');
  updateInstrumentCard(elements.instrumentAutonomy, autonomyStatus, advice.estimatedAutonomy < 15 ? 'reserva' : 'suficiente');
  updateInstrumentCard(elements.instrumentAlert, wind > 50 ? 'status-danger' : wind > 30 ? 'status-warning' : 'status-normal', alertState);

  if (elements.instrumentWindValue) elements.instrumentWindValue.textContent = String(wind);
  if (elements.instrumentSpeedValue) elements.instrumentSpeedValue.textContent = String(advice.recommendedSpeed);
  if (elements.instrumentAutonomyValue) elements.instrumentAutonomyValue.textContent = String(Math.round(advice.estimatedAutonomy));
  if (elements.instrumentAlertValue) elements.instrumentAlertValue.textContent = alertValue;
  if (elements.instrumentAlertState) elements.instrumentAlertState.textContent = alertState;
  if (elements.instrumentAlertHint) {
    elements.instrumentAlertHint.textContent = alertHint + ' Rajadas atuais: ' + gust + ' km/h.';
  }
}

function updateWeatherUI(weatherData, locationLabel) {
  if (!weatherData || !weatherData.current) return;

  var current = weatherData.current;
  var precipProb = findCurrentHourPrecipProbability(weatherData);
  var advice = computeDroneAdvice(current, precipProb);

  if (elements.weatherLocation) {
    elements.weatherLocation.textContent = 'Local de referencia: ' + locationLabel + ' | Atualizado: ' + current.time.replace('T', ' ');
  }
  if (elements.weatherWindValue) elements.weatherWindValue.textContent = String(Math.round(advice.wind));
  if (elements.weatherWindUnit) elements.weatherWindUnit.textContent = 'km/h';
  if (elements.weatherRainValue) {
    if (advice.precipProb === null || advice.precipProb === undefined) {
      elements.weatherRainValue.textContent = String(roundNumber(current.precipitation || 0, 1));
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

  if (elements.frotaWindValue) elements.frotaWindValue.textContent = Math.round(advice.wind) + ' km/h';
  if (elements.frotaWindDirection) elements.frotaWindDirection.textContent = 'dir. ' + degToCompass(current.wind_direction_10m);
  if (elements.vooWindOverlay) elements.vooWindOverlay.textContent = Math.round(advice.wind) + ' km/h | raj. ' + Math.round(advice.gust) + ' km/h';
  if (elements.vooSpeedValue) elements.vooSpeedValue.textContent = String(advice.recommendedSpeed);

  setGaugeMinutes(advice.estimatedAutonomy);
  if (elements.autonomyCaption) elements.autonomyCaption.textContent = 'Autonomia estimada (' + advice.risk + ' risco)';

  updateOperationalAlerts(advice);
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

function geolocationErrorMessage(error) {
  if (!error) return 'Nao foi possivel obter a localizacao do terminal.';
  if (error.code === 1) return 'Permissao de localizacao negada no navegador.';
  if (error.code === 2) return 'Localizacao indisponivel neste dispositivo.';
  if (error.code === 3) return 'Tempo de espera da geolocalizacao excedido.';
  return 'Erro de geolocalizacao: ' + (error.message || 'desconhecido');
}

function getCurrentPositionPromise(options) {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function reverseGeocodeCoords(lat, lon) {
  var url = REVERSE_GEOCODING_API_BASE
    + '?latitude=' + encodeURIComponent(lat)
    + '&longitude=' + encodeURIComponent(lon)
    + '&language=pt&format=json';

  return fetch(url)
    .then(function(response) {
      if (!response.ok) throw new Error('Falha na geocodificacao inversa');
      return response.json();
    })
    .then(function(data) {
      if (!data || !data.results || data.results.length === 0) return null;
      return data.results[0];
    })
    .catch(function() {
      return null;
    });
}

function fetchWeatherDataByCoords(lat, lon) {
  return fetch(buildWeatherUrl(lat, lon))
    .then(function(response) {
      if (!response.ok) throw new Error('Falha na API de meteorologia');
      return response.json();
    })
    .then(function(data) {
      if (!data || !data.current) throw new Error('Resposta meteorologica invalida');
      return data;
    });
}

function fetchWeatherByCoords(lat, lon, label) {
  setStatus('A obter meteorologia operacional...', false);
  setSplashStatus('A verificar meteorologia...', 72);

  return fetchWeatherDataByCoords(lat, lon)
    .then(function(data) {
      updateWeatherUI(data, label);
      setStatus('Meteorologia atualizada com sucesso.', false);
      markStartupReady('weather', 'Meteorologia validada', 86);
    })
    .catch(function(error) {
      setStatus('Erro ao obter meteorologia: ' + error.message, true);
      markStartupReady('weather', 'Operacao iniciada com meteorologia indisponivel', 86);
    });
}

function usePositionData(position, initiatedByUser) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  return reverseGeocodeCoords(lat, lon)
    .then(function(place) {
      var label = 'Posicao atual';
      if (place) {
        label = place.name;
        if (place.admin1) label += ', ' + place.admin1;
        if (elements.originInput && (!elements.originInput.value || initiatedByUser)) {
          elements.originInput.value = place.name;
        }
      } else if (elements.originInput && (!elements.originInput.value || initiatedByUser)) {
        elements.originInput.value = roundNumber(lat, 5) + ', ' + roundNumber(lon, 5);
      }
      return fetchWeatherByCoords(lat, lon, label);
    });
}

function parseLatLonInput(text) {
  if (!text) return null;
  var match = String(text).trim().match(/^(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  var lat = parseFloat(match[1]);
  var lon = parseFloat(match[2]);
  if (isNaN(lat) || isNaN(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  return {
    name: roundNumber(lat, 5) + ', ' + roundNumber(lon, 5),
    latitude: lat,
    longitude: lon
  };
}

function geocodeDestination(query, fieldName) {
  var urlPt = GEOCODING_API_BASE
    + '?name=' + encodeURIComponent(query)
    + '&count=5&language=pt&format=json';

  var urlFallback = GEOCODING_API_BASE
    + '?name=' + encodeURIComponent(query)
    + '&count=5&format=json';

  function fetchAndPick(url) {
    return fetch(url)
      .then(function(response) {
        if (!response.ok) throw new Error('Falha na geocodificacao');
        return response.json();
      })
      .then(function(data) {
        if (!data || !data.results || data.results.length === 0) return null;
        return data.results[0];
      });
  }

  return fetchAndPick(urlPt)
    .then(function(result) {
      if (result) return result;
      return fetchAndPick(urlFallback);
    })
    .then(function(result) {
      if (!result) throw new Error((fieldName || 'Local') + ' nao encontrado. Confirme a designacao operacional.');
      return result;
    });
}

function resolvePlaceInput(text, fieldName) {
  var coords = parseLatLonInput(text);
  if (coords) return Promise.resolve(coords);
  return geocodeDestination(text, fieldName);
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
        throw new Error('Sem rotas disponiveis para esta origem e destino.');
      }
      return data.routes.slice(0, 3);
    });
}

function calculateRouteFromInputs() {
  if (!elements.originInput || !elements.destinationInput) return;

  var originText = (elements.originInput.value || '').trim();
  var destinationText = (elements.destinationInput.value || '').trim();

  if (!originText || !destinationText) {
    setStatus('Preencha origem e destino para calcular a rota.', true);
    return;
  }

  setStatus('A calcular rota e risco operacional...', false);
  setSplashStatus('A sincronizar rotas...', 92);

  Promise.all([
    resolvePlaceInput(originText, 'Origem'),
    resolvePlaceInput(destinationText, 'Destino')
  ])
    .then(function(places) {
      var origin = places[0];
      var destination = places[1];
      var midLat = (origin.latitude + destination.latitude) / 2;
      var midLon = (origin.longitude + destination.longitude) / 2;
      var locationLabel = origin.name + ' -> ' + destination.name;

      return Promise.all([
        fetchRouteAlternatives(origin, destination),
        fetchWeatherDataByCoords(midLat, midLon)
      ]).then(function(data) {
        return {
          routes: data[0],
          weather: data[1],
          label: locationLabel,
          origin: origin,
          destination: destination
        };
      });
    })
    .then(function(result) {
      updateWeatherUI(result.weather, result.label);
      renderRouteRecommendations(result.routes, result.weather, {
        origin: result.origin.name,
        destination: result.destination.name
      });
      setStatus('Rota calculada. Consulte a alternativa segura antes de iniciar o voo.', false);
      showScreen('screen-planeamento');
    })
    .catch(function(error) {
      setStatus(error.message, true);
    });
}

function fetchWeatherFromCurrentLocation(initiatedByUser) {
  if (!navigator.geolocation) {
    setStatus('Geolocalizacao indisponivel. Introduza a origem manualmente.', true);
    markStartupReady('weather', 'Sem geolocalizacao. Operacao em modo manual.', 86);
    return;
  }

  if (!window.isSecureContext) {
    setStatus('Geolocalizacao requer HTTPS ou localhost. Introduza a origem manualmente.', true);
    markStartupReady('weather', 'Modo manual ativo. Geolocalizacao bloqueada.', 86);
    return;
  }

  setStatus('A obter geolocalizacao atual...', false);
  setSplashStatus('A verificar meteorologia...', 68);

  getCurrentPositionPromise({ timeout: 7000, enableHighAccuracy: true, maximumAge: 0 })
    .catch(function(firstError) {
      return getCurrentPositionPromise({ timeout: 14000, enableHighAccuracy: false, maximumAge: 300000 })
        .catch(function() {
          throw firstError;
        });
    })
    .then(function(position) {
      return usePositionData(position, !!initiatedByUser);
    })
    .catch(function(error) {
      setStatus(geolocationErrorMessage(error) + ' Introduza a origem manualmente.', true);
      markStartupReady('weather', 'Sem localizacao automatica. Interface pronta.', 86);
    });
}

function sortHistoryEntries(entries) {
  var sorted = entries.slice();
  var direction = historySortState.direction === 'asc' ? 1 : -1;
  var key = historySortState.key;

  sorted.sort(function(a, b) {
    var aValue = a[key];
    var bValue = b[key];
    if (key === 'score' || key === 'duration') {
      return (aValue - bValue) * direction;
    }
    return String(aValue).localeCompare(String(bValue)) * direction;
  });

  return sorted;
}

function renderHistoryTable() {
  if (!elements.historyTableBody) return;
  elements.historyTableBody.innerHTML = '';

  sortHistoryEntries(flightHistory).forEach(function(entry) {
    var row = document.createElement('tr');
    var fields = ['date', 'origin', 'destination', 'model'];

    fields.forEach(function(field) {
      var cell = document.createElement('td');
      cell.textContent = entry[field];
      row.appendChild(cell);
    });

    var scoreCell = document.createElement('td');
    var badge = document.createElement('span');
    badge.className = 'history-score-badge ' + scoreLevel(entry.score);
    badge.textContent = String(entry.score);
    scoreCell.appendChild(badge);
    row.appendChild(scoreCell);

    var durationCell = document.createElement('td');
    durationCell.textContent = entry.duration + ' min';
    row.appendChild(durationCell);

    elements.historyTableBody.appendChild(row);
  });

  elements.sortButtons.forEach(function(button) {
    button.classList.toggle('active', button.getAttribute('data-sort-key') === historySortState.key);
  });
}

function exportHistoryAsJson() {
  var data = sortHistoryEntries(flightHistory);
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'datandroid-historico-voos.json';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function handleSortButtonClick(event) {
  var key = event.currentTarget.getAttribute('data-sort-key');
  if (!key) return;

  if (historySortState.key === key) {
    historySortState.direction = historySortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    historySortState.key = key;
    historySortState.direction = key === 'date' ? 'desc' : 'asc';
  }

  renderHistoryTable();
}

function startFlightMode() {
  document.body.classList.add('flight-started');
  showScreen('screen-voo');
}

document.addEventListener('DOMContentLoaded', function() {
  elements.frotaDroneTitle = document.getElementById('frota-drone-title');
  elements.droneModelSelect = document.getElementById('drone-model-select');
  elements.droneModelStatus = document.getElementById('drone-model-status');
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
  elements.useCurrentLocationBtn = document.getElementById('btn-use-current-location');
  elements.calculateRouteBtn = document.getElementById('btn-calculate-route');
  elements.startFlightBtn = document.getElementById('btn-start-flight');
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
  elements.detailOverallScore = document.getElementById('detail-overall-score');
  elements.detailRoute = document.getElementById('detail-route');
  elements.detailClimate = document.getElementById('detail-climate');
  elements.detailWind = document.getElementById('detail-wind');
  elements.detailWeights = document.getElementById('detail-weights');
  elements.splashScreen = document.getElementById('splash-screen');
  elements.splashStatus = document.getElementById('splash-status');
  elements.splashProgressBar = document.getElementById('splash-progress-bar');
  elements.instrumentWind = document.getElementById('instrument-wind');
  elements.instrumentSpeed = document.getElementById('instrument-speed');
  elements.instrumentAutonomy = document.getElementById('instrument-autonomy');
  elements.instrumentAlert = document.getElementById('instrument-alert');
  elements.instrumentWindValue = document.getElementById('instrument-wind-value');
  elements.instrumentSpeedValue = document.getElementById('instrument-speed-value');
  elements.instrumentAutonomyValue = document.getElementById('instrument-autonomy-value');
  elements.instrumentAlertValue = document.getElementById('instrument-alert-value');
  elements.instrumentAlertState = document.getElementById('instrument-alert-state');
  elements.instrumentAlertHint = document.getElementById('instrument-alert-hint');
  elements.historyTableBody = document.getElementById('history-table-body');
  elements.exportHistoryBtn = document.getElementById('btn-export-history');
  elements.sortButtons = Array.prototype.slice.call(document.querySelectorAll('.sort-button'));

  setSplashStatus('A iniciar sistema...', 14);
  window.setTimeout(function() {
    startupState.minimumDelayDone = true;
    tryHideSplashScreen();
  }, 1200);

  if (elements.droneModelSelect) {
    elements.droneModelSelect.addEventListener('change', function(event) {
      applyDroneModel(event.target.value);
    });
  }

  if (elements.useCurrentLocationBtn) {
    elements.useCurrentLocationBtn.addEventListener('click', function() {
      fetchWeatherFromCurrentLocation(true);
    });
  }

  if (elements.calculateRouteBtn) {
    elements.calculateRouteBtn.addEventListener('click', calculateRouteFromInputs);
  }

  if (elements.startFlightBtn) {
    elements.startFlightBtn.addEventListener('click', startFlightMode);
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

  elements.sortButtons.forEach(function(button) {
    button.addEventListener('click', handleSortButtonClick);
  });

  if (elements.exportHistoryBtn) {
    elements.exportHistoryBtn.addEventListener('click', exportHistoryAsJson);
  }

  renderHistoryTable();
  loadDroneModels();
  fetchWeatherFromCurrentLocation(false);
});
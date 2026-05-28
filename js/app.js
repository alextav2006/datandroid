import { geocodeQuery, fetchForecast, fetchRoute, loadDroneModels, reverseGeocode } from './api.js';
import { debounce, calculateSafetyScore, createFlightHistoryEntry } from './logic.js';
import { saveToStorage, loadFromStorage, saveAppState, loadAppState } from './storage.js';
import { showScreen, renderAutocomplete, showLoading, hideLoading, showError, clearError, renderFlightHistory, renderDroneModels, updateTelemetryPanel, updateRouteSummary } from './ui.js';

const screenTabMap = {
  'screen-frota': 'tab-frota',
  'screen-planeamento': 'tab-planeamento',
  'screen-modelos': 'tab-modelos',
  'screen-historico': 'tab-historico',
  'screen-voo': 'tab-voo'
};

const appState = loadAppState();
let storedHistory = loadFromStorage('flight-history') || [];
let droneModels = [];
let currentForecast = null;
let telemetryTimer = null;

window.showScreen = showScreen;

function persistState() {
  saveAppState({ lastScreen: document.querySelector('.screen.active')?.id || 'screen-frota' });
}

function getLastActiveScreen() {
  return appState.lastScreen || loadFromStorage('last-screen') || 'screen-frota';
}

function saveHistory(history) {
  saveToStorage('flight-history', history);
}

function savePreferences() {
  const favorite = document.getElementById('favorite-drone').value;
  const unit = document.getElementById('speed-unit').value;
  saveToStorage('preferences', { favoriteDrone: favorite, speedUnit: unit });
}

function loadPreferences() {
  const prefs = loadFromStorage('preferences') || {};
  if (prefs.favoriteDrone) {
    document.getElementById('favorite-drone').value = prefs.favoriteDrone;
  }
  if (prefs.speedUnit) {
    document.getElementById('speed-unit').value = prefs.speedUnit;
  }
}

async function resolveLocation(input) {
  const label = input.value.trim();
  if (!label) throw new Error('Escreva um local válido.');
  if (input.dataset.latitude && input.dataset.longitude) {
    return {
      name: input.value,
      latitude: Number(input.dataset.latitude),
      longitude: Number(input.dataset.longitude)
    };
  }
  const results = await geocodeQuery(label);
  if (!results.length) throw new Error('Não foram encontradas sugestões para: ' + label);
  const first = results[0];
  return { name: first.name, latitude: first.latitude, longitude: first.longitude };
}

async function updateRoute() {
  const originInput = document.getElementById('origem-input');
  const destinationInput = document.getElementById('destino-input');
  clearError('planning-screen');
  try {
    showLoading('planning-screen');
    const origin = await resolveLocation(originInput);
    const destination = await resolveLocation(destinationInput);
    const route = await fetchRoute(origin, destination);
    const weather = await fetchForecast(destination.latitude, destination.longitude);
    const placeData = await reverseGeocode(destination.latitude, destination.longitude);
    currentForecast = weather;
    const score = calculateSafetyScore(route, weather);
    updateRouteSummary(route, score);
    const destinationLabel = placeData.name || destination.name;
    const detail = document.getElementById('route-detail');
    if (detail) detail.textContent = `${score.detail} · Local: ${destinationLabel}`;
    appState.lastTelemetryLocation = { latitude: destination.latitude, longitude: destination.longitude };
    window.dispatchEvent(new CustomEvent('securityScoreCalculated', { detail: { score } }));
    return { origin, destination, route, weather, score };
  } catch (error) {
    showError(error.message, 'planning-screen');
    throw error;
  } finally {
    hideLoading('planning-screen');
  }
}

async function saveCurrentPlan() {
  try {
    const { origin, destination, route, weather, score } = await updateRoute();
    const entry = createFlightHistoryEntry(origin.name, destination.name, route, weather, score);
    storedHistory.unshift(entry);
    storedHistory = storedHistory.slice(0, 10);
    saveHistory(storedHistory);
    renderFlightHistory(storedHistory);
    showScreen('screen-historico');
  } catch (error) {
    // already handled by updateRoute
  }
}

function setupAutocomplete() {
  const inputs = [document.getElementById('origem-input'), document.getElementById('destino-input')];
  const list = document.getElementById('autocomplete-list');
  inputs.forEach(input => {
    input.addEventListener('input', debounce(async () => {
      if (!input.value.trim()) {
        list.classList.add('hidden');
        return;
      }
      input.classList.add('autocomplete-active');
      try {
        const suggestions = await geocodeQuery(input.value.trim());
        renderAutocomplete(suggestions);
      } catch (error) {
        renderAutocomplete([]);
      }
    }, 350));
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        list.classList.add('hidden');
        input.classList.remove('autocomplete-active');
      }
    });
  });
}

function setupDroneFilters() {
  const autonomy = document.getElementById('autonomy-filter');
  const usage = document.getElementById('usage-filter');
  const favorite = document.getElementById('favorite-drone');
  const speedUnit = document.getElementById('speed-unit');

  function applyFilters() {
    const minimum = Number(autonomy.value);
    const type = usage.value;
    const filtered = droneModels.filter(model => {
      const matchesAutonomy = model.autonomy >= minimum;
      const matchesType = type === 'Todos' || model.usage === type;
      return matchesAutonomy && matchesType;
    });
    document.getElementById('autonomy-value').textContent = `${minimum} min`;
    renderDroneModels(filtered);
  }

  autonomy.addEventListener('input', applyFilters);
  usage.addEventListener('change', applyFilters);
  favorite.addEventListener('change', savePreferences);
  speedUnit.addEventListener('change', savePreferences);
  applyFilters();
}

async function loadModels() {
  try {
    showLoading('models-screen');
    droneModels = await loadDroneModels();
    const usageOptions = new Set(['Todos', ...droneModels.map(model => model.usage)]);
    const usageSelect = document.getElementById('usage-filter');
    usageSelect.innerHTML = '';
    usageOptions.forEach(option => {
      const item = document.createElement('option');
      item.value = option;
      item.textContent = option;
      usageSelect.appendChild(item);
    });
    renderDroneModels(droneModels);
    setupDroneFilters();
  } catch (error) {
    showError(error.message, 'models-screen');
    droneModels = [];
  } finally {
    hideLoading('models-screen');
  }
}

function ensureHistorySample() {
  if (storedHistory.length) {
    renderFlightHistory(storedHistory);
    return;
  }
  storedHistory = Array.from({ length: 6 }, (_, index) => ({
    id: `sample-${index}`,
    origin: 'Base Centro',
    destination: `Ponto ${index + 1}`,
    distance: `${(1.2 + index * 0.4).toFixed(1)} km`,
    duration: `${8 + index} min`,
    wind: `${12 + index} km/h`,
    temperature: `${18 + index}°C`,
    score: 80 - index * 4,
    status: index < 2 ? 'Ótimo' : index < 4 ? 'Aceitável' : 'Cuidado',
    createdAt: new Date(Date.now() - index * 3600000).toLocaleString('pt-PT')
  }));
  saveHistory(storedHistory);
  renderFlightHistory(storedHistory);
}

function setupHistoryActions() {
  document.getElementById('clear-history').addEventListener('click', () => {
    storedHistory = [];
    saveHistory(storedHistory);
    renderFlightHistory(storedHistory);
  });
}

async function updateTelemetry() {
  const location = appState.lastTelemetryLocation || { latitude: -23.5505, longitude: -46.6333 };
  try {
    const weather = await fetchForecast(location.latitude, location.longitude);
    const score = calculateSafetyScore({ distance: 1200, duration: 300 }, weather);
    updateTelemetryPanel({
      temperature: weather.current_weather.temperature,
      windspeed: weather.current_weather.windspeed,
      status: score.status === 'Perigoso' ? 'Alerta: condições adversas' : 'Condições estáveis'
    });
    currentForecast = weather;
  } catch (error) {
    showError(error.message, 'flight-screen');
  }
}

function setupTeleportTimer() {
  if (telemetryTimer) clearInterval(telemetryTimer);
  telemetryTimer = setInterval(async () => {
    await updateTelemetry();
  }, 30000);
}

async function initApp() {
  const last = getLastActiveScreen();
  showScreen(last);
  loadPreferences();
  ensureHistorySample();
  setupHistoryActions();
  setupAutocomplete();
  loadModels();
  setupTeleportTimer();
  document.getElementById('plan-route').addEventListener('click', event => {
    event.preventDefault();
    updateRoute();
  });
  document.getElementById('save-flight').addEventListener('click', event => {
    event.preventDefault();
    saveCurrentPlan();
  });
  document.getElementById('refresh-telemetry').addEventListener('click', event => {
    event.preventDefault();
    updateTelemetry();
  });
  document.getElementById('favorite-drone').addEventListener('input', savePreferences);
  document.getElementById('speed-unit').addEventListener('change', savePreferences);
  window.addEventListener('securityScoreCalculated', event => {
    const scoreDetail = event.detail.score;
    console.info('Evento customizado: score calculado', scoreDetail);
  });
  window.addEventListener('beforeunload', persistState);
}

window.addEventListener('DOMContentLoaded', initApp);

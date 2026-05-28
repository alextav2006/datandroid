// Datandroid — manipulação do DOM

export function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));

  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');
  const tab = document.getElementById(`tab-${screenId.replace('screen-', '')}`);
  if (tab) tab.classList.add('active');
  window.localStorage.setItem('datandroid-last-screen', screenId);
}

export function renderAutocomplete(items = []) {
  const list = document.getElementById('autocomplete-list');
  list.innerHTML = '';
  if (!items.length) {
    list.classList.add('hidden');
    return;
  }
  items.slice(0, 6).forEach(item => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'autocomplete-item';
    row.textContent = `${item.name}, ${item.country || item.admin1 || ''}`.trim();
    row.dataset.latitude = item.latitude;
    row.dataset.longitude = item.longitude;
    row.dataset.label = item.name;
    row.addEventListener('click', () => {
      const activeInput = document.querySelector('.autocomplete-active');
      if (activeInput) {
        activeInput.value = row.dataset.label;
        activeInput.dataset.latitude = row.dataset.latitude;
        activeInput.dataset.longitude = row.dataset.longitude;
        list.classList.add('hidden');
        activeInput.classList.remove('autocomplete-active');
      }
    });
    list.appendChild(row);
  });
  list.classList.remove('hidden');
}

export function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let spinner = container.querySelector('.loading-indicator');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.className = 'loading-indicator';
    spinner.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">A carregar...</span></div>';
    container.appendChild(spinner);
  }
  spinner.classList.remove('hidden');
}

export function hideLoading(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const spinner = container.querySelector('.loading-indicator');
  if (spinner) spinner.classList.add('hidden');
}

export function showError(message, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let alert = container.querySelector('.error-card');
  if (!alert) {
    alert = document.createElement('div');
    alert.className = 'error-card';
    container.prepend(alert);
  }
  alert.textContent = message;
  alert.classList.remove('hidden');
}

export function clearError(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const alert = container.querySelector('.error-card');
  if (alert) alert.classList.add('hidden');
}

export function renderFlightHistory(history = []) {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  history.forEach(entry => {
    const card = document.createElement('article');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="history-meta">
        <strong>${entry.origin}</strong> → <strong>${entry.destination}</strong>
        <span>${entry.createdAt}</span>
      </div>
      <div class="history-details">
        <div><strong>Distância</strong> ${entry.distance}</div>
        <div><strong>Duração</strong> ${entry.duration}</div>
        <div><strong>Vento</strong> ${entry.wind}</div>
        <div><strong>Temp.</strong> ${entry.temperature}</div>
        <div><strong>Score</strong> ${entry.score} / ${entry.status}</div>
      </div>
    `;
    card.addEventListener('mouseover', () => card.classList.add('hovered'));
    card.addEventListener('mouseout', () => card.classList.remove('hovered'));
    list.appendChild(card);
  });
}

export function renderDroneModels(models = []) {
  const container = document.getElementById('modelos-list');
  container.innerHTML = '';
  models.forEach(model => {
    const card = document.createElement('article');
    card.className = 'drone-card';
    card.innerHTML = `
      <div class="drone-card-header">
        <h3>${model.name}</h3>
        <span class="drone-usage">${model.usage}</span>
      </div>
      <p>${model.description}</p>
      <div class="drone-meta">
        <span>Autonomia ${model.autonomy} min</span>
        <button type="button" class="btn-select-model">Favorito</button>
      </div>
    `;
    card.querySelector('.btn-select-model').addEventListener('click', () => {
      document.getElementById('favorite-drone').value = model.name;
      saveFavoriteModel(model.name);
    });
    container.appendChild(card);
  });
}

export function saveFavoriteModel(name) {
  const event = new CustomEvent('favoriteModelSelected', { detail: { model: name } });
  window.dispatchEvent(event);
}

export function updateTelemetryPanel(data) {
  const temp = document.getElementById('telemetry-temperature');
  const wind = document.getElementById('telemetry-wind');
  const status = document.getElementById('telemetry-alert');
  if (temp) temp.textContent = data.temperature ? `${data.temperature}°C` : 'N/A';
  if (wind) wind.textContent = data.windspeed ? `${data.windspeed} km/h` : 'N/A';
  if (status) status.textContent = data.status || 'Sem alertas';
}

export function updateRouteSummary(route, score) {
  const distanceNode = document.getElementById('route-distance');
  const durationNode = document.getElementById('route-duration');
  const scoreNode = document.getElementById('route-score');
  if (distanceNode) distanceNode.textContent = route ? `${(route.distance / 1000).toFixed(2)} km` : '—';
  if (durationNode) durationNode.textContent = route ? `${Math.round(route.duration / 60)} min` : '—';
  if (scoreNode) scoreNode.textContent = score ? `${score.score} (${score.status})` : '—';
}

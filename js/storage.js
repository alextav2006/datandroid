// Datandroid — armazenamento local

const storagePrefix = 'datandroid-';

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(storagePrefix + key, JSON.stringify(value));
  } catch (error) {
    console.warn('[Storage] não foi possível gravar', error);
  }
}

export function loadFromStorage(key) {
  try {
    const item = localStorage.getItem(storagePrefix + key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn('[Storage] não foi possível ler', error);
    return null;
  }
}

export function clearStorage(key) {
  try {
    localStorage.removeItem(storagePrefix + key);
  } catch (error) {
    console.warn('[Storage] não foi possível limpar', error);
  }
}

export function saveAppState(state) {
  saveToStorage('state', state);
}

export function loadAppState() {
  return loadFromStorage('state') || {};
}

// Datandroid — app.js
// Navegação entre os 3 ecrãs

var screenTabMap = {
  'screen-frota':       'tab-frota',
  'screen-planeamento': 'tab-planeamento',
  'screen-voo':         'tab-voo'
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

/* interactions.js — Utilitários compartilhados */

// Carrega dados do JSON e retorna promise
async function carregarJSON(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Falha ao carregar ${url}`);
  return resp.json();
}

// Alterna classe com animação simples
function toggle(el, classe) {
  if (!el) return;
  el.classList.toggle(classe);
}

// Detecta se o dispositivo suporta AR (WebXR ou fallback model-viewer)
function detectarCapacidadeAR() {
  const temWebXR = 'xr' in navigator;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  return { temWebXR, isIOS, isAndroid, temCamera: !!(navigator.mediaDevices?.getUserMedia) };
}

// Mostra/esconde elemento
function mostrar(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

function esconder(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

// Exibe notificação toast simples
function toast(mensagem, tipo = 'info', duracao = 3000) {
  const t = document.createElement('div');
  t.textContent = mensagem;
  t.style.cssText = `
    position:fixed; bottom:5rem; left:50%; transform:translateX(-50%);
    background:${tipo === 'erro' ? '#e05252' : '#2c6e9e'};
    color:white; padding:.6rem 1.2rem; border-radius:8px;
    font-size:.85rem; font-weight:600; z-index:9999;
    box-shadow:0 4px 12px rgba(0,0,0,.4);
    animation: fadeInUp .2s ease;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duracao);
}

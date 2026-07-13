/* anatomy.js — Modo Estudo: modelo 3D com A-Frame */

const ESTRUTURAS_URL = '../data/estruturas.json';
let dadosEstruturas = [];
let estruturaAtiva = null;

async function carregarEstruturas() {
  const resp = await fetch(ESTRUTURAS_URL);
  const json = await resp.json();
  dadosEstruturas = json.estruturas;
  return dadosEstruturas;
}

function mostrarInfo(estruturaId) {
  const est = dadosEstruturas.find(e => e.id === estruturaId);
  if (!est) return;

  estruturaAtiva = estruturaId;

  const painel = document.getElementById('painel-info');
  document.getElementById('info-nome').textContent = est.nome;
  document.getElementById('info-descricao').textContent = est.descricao;
  painel.classList.add('visivel');

  // Destaca chip na sidebar
  document.querySelectorAll('.estrutura-chip').forEach(el => {
    el.classList.toggle('ativo', el.dataset.id === estruturaId);
  });
}

function fecharInfo() {
  document.getElementById('painel-info').classList.remove('visivel');
  estruturaAtiva = null;
  document.querySelectorAll('.estrutura-chip').forEach(el => el.classList.remove('ativo'));
}

function construirSidebar(estruturas) {
  const sidebar = document.getElementById('sidebar-estruturas');
  sidebar.innerHTML = '';
  estruturas.forEach(est => {
    const chip = document.createElement('button');
    chip.className = 'estrutura-chip';
    chip.dataset.id = est.id;
    chip.innerHTML = `
      <span class="estrutura-cor" style="background:${est.cor}"></span>
      <span>${est.nome}</span>
    `;
    chip.addEventListener('click', () => mostrarInfo(est.id));
    sidebar.appendChild(chip);
  });
}

// Constrói esferas coloridas no modelo A-Frame
function construirModeloSimbolico(estruturas) {
  const scene = document.querySelector('a-scene');
  if (!scene) return;

  // Posições simbólicas aproximadas no trato vocal (vista sagital)
  const posicoes = {
    'lingua':        { x: 0,     y: 0.1,   z: 0.15 },
    'epiglote':      { x: 0,     y: -0.3,  z: 0.05 },
    'pregas-vocais': { x: 0,     y: -0.65, z: 0 },
    'palato-mole':   { x: 0,     y: 0.35,  z: -0.1 },
    'faringe':       { x: 0,     y: -0.15, z: -0.2 },
    'laringe':       { x: 0,     y: -0.55, z: -0.1 },
  };

  estruturas.forEach(est => {
    const pos = posicoes[est.id] || { x: 0, y: 0, z: 0 };

    // Esfera representando a estrutura
    const esfera = document.createElement('a-sphere');
    esfera.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
    esfera.setAttribute('radius', '0.08');
    esfera.setAttribute('color', est.cor);
    esfera.setAttribute('opacity', '0.85');
    esfera.setAttribute('class', 'clicavel');
    esfera.setAttribute('data-id', est.id);
    esfera.setAttribute('animation__hover', 'property: scale; to: 1.3 1.3 1.3; startEvents: mouseenter; dur: 150');
    esfera.setAttribute('animation__unhover', 'property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150');

    // Label texto flutuante
    const texto = document.createElement('a-text');
    texto.setAttribute('value', est.nome);
    texto.setAttribute('position', `${pos.x + 0.12} ${pos.y + 0.06} ${pos.z}`);
    texto.setAttribute('scale', '0.3 0.3 0.3');
    texto.setAttribute('color', '#e8f0f7');
    texto.setAttribute('align', 'left');

    esfera.addEventListener('click', () => mostrarInfo(est.id));
    esfera.addEventListener('touchstart', () => mostrarInfo(est.id));

    scene.querySelector('#modelo-grupo').appendChild(esfera);
    scene.querySelector('#modelo-grupo').appendChild(texto);
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  const estruturas = await carregarEstruturas();
  construirSidebar(estruturas);

  // Aguarda A-Frame carregar antes de construir modelo simbólico
  const scene = document.querySelector('a-scene');
  if (scene) {
    if (scene.hasLoaded) {
      construirModeloSimbolico(estruturas);
    } else {
      scene.addEventListener('loaded', () => construirModeloSimbolico(estruturas));
    }
  }

  document.getElementById('btn-fechar-info').addEventListener('click', fecharInfo);
});

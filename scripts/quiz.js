/* quiz.js — Lógica do quiz anatômico */

let dadosQuiz = [];
let dadosEstruturas = [];
let perguntaAtual = 0;
let pontuacao = 0;
let respondida = false;

async function carregarDados() {
  const resp = await fetch('../data/estruturas.json');
  const json = await resp.json();
  dadosQuiz = embaralhar([...json.quiz]);
  dadosEstruturas = json.estruturas;
}

function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function nomeEstrutura(id) {
  const est = dadosEstruturas.find(e => e.id === id);
  return est ? est.nome : id;
}

function renderizarProgresso() {
  const barra = document.getElementById('progresso-barra');
  barra.innerHTML = '';
  dadosQuiz.forEach((_, i) => {
    const item = document.createElement('div');
    item.className = 'quiz-progresso-item';
    if (i < perguntaAtual) item.classList.add('completo');
    else if (i === perguntaAtual) item.classList.add('atual');
    barra.appendChild(item);
  });
}

function renderizarPergunta() {
  const q = dadosQuiz[perguntaAtual];
  respondida = false;

  document.getElementById('quiz-numero').textContent =
    `Pergunta ${perguntaAtual + 1} de ${dadosQuiz.length}`;
  document.getElementById('quiz-pergunta').textContent = q.pergunta;
  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('btn-proxima').style.display = 'none';

  const opcoesEl = document.getElementById('quiz-opcoes');
  opcoesEl.innerHTML = '';
  embaralhar([...q.opcoes]).forEach(opcaoId => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opcao';
    btn.textContent = nomeEstrutura(opcaoId);
    btn.dataset.id = opcaoId;
    btn.addEventListener('click', () => responder(opcaoId));
    opcoesEl.appendChild(btn);
  });

  renderizarProgresso();
}

function responder(opcaoId) {
  if (respondida) return;
  respondida = true;

  const q = dadosQuiz[perguntaAtual];
  const correta = opcaoId === q.resposta;
  const feedback = document.getElementById('quiz-feedback');

  // Estiliza os botões
  document.querySelectorAll('.quiz-opcao').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.id === q.resposta) btn.classList.add('correta');
    if (btn.dataset.id === opcaoId && !correta) btn.classList.add('errada');
  });

  if (correta) {
    pontuacao++;
    const est = dadosEstruturas.find(e => e.id === q.resposta);
    feedback.className = 'quiz-feedback correta';
    feedback.textContent = `✓ Correto! ${est ? est.descricao : ''}`;
  } else {
    feedback.className = 'quiz-feedback errada';
    feedback.textContent = `✗ Incorreto. A resposta certa era: ${nomeEstrutura(q.resposta)}.`;
  }

  document.getElementById('btn-proxima').style.display = 'block';
}

function proximaPergunta() {
  perguntaAtual++;
  if (perguntaAtual >= dadosQuiz.length) {
    mostrarResultado();
  } else {
    renderizarPergunta();
  }
}

function mostrarResultado() {
  document.getElementById('tela-quiz').style.display = 'none';
  const resultado = document.getElementById('tela-resultado');
  resultado.style.display = 'block';

  const pct = Math.round((pontuacao / dadosQuiz.length) * 100);
  document.getElementById('pontuacao-numero').textContent = `${pontuacao}/${dadosQuiz.length}`;

  let mensagem, classe;
  if (pct === 100) {
    mensagem = '🏆 Perfeito! Domínio completo da anatomia!';
    classe = 'correta';
  } else if (pct >= 80) {
    mensagem = '🎉 Excelente! Você conhece bem o trato vocal.';
    classe = 'correta';
  } else if (pct >= 60) {
    mensagem = '📚 Bom resultado! Revise as estruturas e tente de novo.';
    classe = '';
  } else {
    mensagem = '🔄 Continue estudando! O modo estudo pode ajudar.';
    classe = 'errada';
  }

  const msgEl = document.getElementById('resultado-mensagem');
  msgEl.textContent = mensagem;
  msgEl.className = `quiz-mensagem ${classe}`;
}

function reiniciarQuiz() {
  perguntaAtual = 0;
  pontuacao = 0;
  dadosQuiz = embaralhar([...dadosQuiz]);
  document.getElementById('tela-resultado').style.display = 'none';
  document.getElementById('tela-quiz').style.display = 'block';
  renderizarPergunta();
}

document.addEventListener('DOMContentLoaded', async () => {
  await carregarDados();
  renderizarPergunta();

  document.getElementById('btn-proxima').addEventListener('click', proximaPergunta);
  document.getElementById('btn-reiniciar').addEventListener('click', reiniciarQuiz);
});

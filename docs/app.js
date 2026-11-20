import { endpoint } from './config.js';

const secoes = [...document.querySelectorAll('main section')];
const navegacao = [...document.querySelectorAll('nav a')];
const consultas = new Map();

function mostrarEtapa(focar) {
  const id = window.location.hash.slice(1);
  const ativa = secoes.find(secao => secao.id === id) ?? secoes[0];
  for (const secao of secoes) secao.hidden = secao !== ativa;
  for (const link of navegacao) {
    if (link.hash === '#' + ativa.id) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  }
  if (focar && id !== 'conteudo') ativa.querySelector('h2').focus();
}

mostrarEtapa(false);
window.addEventListener('hashchange', () => mostrarEtapa(true));

for (const form of document.querySelectorAll('.consulta')) {
  form.addEventListener('submit', async evento => {
    evento.preventDefault();
    const agente = form.dataset.agente;
    const pergunta = form.elements.pergunta.value.trim();
    const botao = form.querySelector('button');
    const status = form.querySelector('.status');
    const resultado = form.parentElement.querySelector('.resultado');
    if (!pergunta) {
      status.textContent = 'Digite uma pergunta para consultar o agente.';
      return;
    }
    if (!endpoint) {
      status.textContent = 'A conexão com o serviço de IA aguarda a publicação do Worker.';
      return;
    }

    botao.disabled = true;
    status.textContent = 'Consultando o agente…';
    resultado.hidden = true;
    try {
      const resposta = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agente, pergunta }),
        signal: AbortSignal.timeout(35000)
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok || !dados.resposta) {
        status.textContent = dados.erro ?? 'O serviço de IA está indisponível. Tente novamente.';
        return;
      }
      resultado.querySelector('.resposta').textContent = dados.resposta;
      resultado.querySelector('.modelo').textContent = 'Workers AI · ' + dados.modelo;
      const fontes = resultado.querySelector('.fontes');
      fontes.replaceChildren();
      for (const evidencia of dados.evidencias) {
        const item = document.createElement('li');
        const detalhes = document.createElement('details');
        const titulo = document.createElement('summary');
        const trecho = document.createElement('p');
        const link = document.createElement('a');
        titulo.textContent = evidencia.titulo + ' · ' + evidencia.id;
        trecho.textContent = evidencia.texto.replaceAll('**', '').replaceAll('`', '');
        link.textContent = 'Abrir documento no Drive';
        link.href = evidencia.url;
        link.target = '_blank';
        link.rel = 'noopener';
        detalhes.append(titulo, trecho, link);
        item.append(detalhes);
        fontes.append(item);
      }
      consultas.set(agente, { pergunta, ...dados });
      resultado.hidden = false;
      status.textContent = 'Resposta recebida.';
    } catch {
      status.textContent = 'Falha ao conectar ao serviço de IA. Tente novamente.';
    } finally {
      botao.disabled = false;
    }
  });
}

document.querySelector('#registro').addEventListener('submit', evento => {
  evento.preventDefault();
  const campos = Object.fromEntries(new FormData(evento.currentTarget));
  const decisao = Object.fromEntries(Object.entries(campos).map(([chave, valor]) => [chave, valor.trim()]));
  const status = document.querySelector('#exportacao');
  if (Object.values(decisao).some(valor => !valor)) {
    status.textContent = 'Preencha todos os campos antes de exportar.';
    return;
  }
  const registro = {
    caso: 'ACAD-001',
    registradoEm: new Date().toISOString(),
    ...decisao,
    consultas: Object.fromEntries(consultas)
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(registro, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'decisao-ACAD-001.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Registro preparado para download.';
});
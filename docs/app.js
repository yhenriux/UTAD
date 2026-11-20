import { endpoint } from './config.js';

const secoes = [...document.querySelectorAll('main section')];
const navegacao = [...document.querySelectorAll('nav a')];
const consultas = new Map();

function renderizarMarkdown(destino, texto) {
  destino.replaceChildren();
  function inserir(elemento, linha) {
    const marcas = /`([^`\n]+)`|\*\*([^*\n]+)\*\*|__([^_\n]+)__|\*([^*\n]+)\*|_([^_\n]+)_/g;
    let inicio = 0;
    for (const marca of linha.matchAll(marcas)) {
      elemento.append(linha.slice(inicio, marca.index));
      const tag = document.createElement(marca[1] ? 'code' : marca[2] || marca[3] ? 'strong' : 'em');
      tag.textContent = marca[1] ?? marca[2] ?? marca[3] ?? marca[4] ?? marca[5];
      elemento.append(tag);
      inicio = marca.index + marca[0].length;
    }
    elemento.append(linha.slice(inicio));
  }

  let bloco;
  for (const linha of texto.trim().split(/\r?\n/)) {
    if (!linha.trim()) {
      bloco = undefined;
      continue;
    }
    const lista = linha.match(/^\s*(?:([-+*])|\d+[.)])\s+(.+)$/);
    const titulo = linha.match(/^#{1,6}\s+(.+)$/);
    const citacao = linha.match(/^>\s?(.*)$/);
    const tipo = lista ? (lista[1] ? 'ul' : 'ol') : titulo ? 'h4' : citacao ? 'blockquote' : 'p';
    if (bloco?.localName !== tipo || titulo) {
      bloco = document.createElement(tipo);
      destino.append(bloco);
    }
    if (lista) {
      const item = document.createElement('li');
      inserir(item, lista[2]);
      bloco.append(item);
    } else {
      if (bloco.hasChildNodes()) bloco.append(document.createElement('br'));
      inserir(bloco, titulo?.[1] ?? citacao?.[1] ?? linha);
    }
  }
}

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

    const rotulo = botao.textContent;
    const consultaAnterior = consultas.get(agente);
    botao.disabled = true;
    botao.textContent = 'Consultando…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.estado = 'carregando';
    status.textContent = 'Buscando nas fontes e preparando a resposta…';
    try {
      const resposta = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agente, pergunta,
          anterior: consultaAnterior?.pergunta,
          respostaAnterior: consultaAnterior?.resposta
        }),
        signal: AbortSignal.timeout(35000)
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok || !dados.resposta) {
        status.dataset.estado = 'erro';
        status.textContent = dados.erro ?? 'O serviço de IA está indisponível. Tente novamente.';
        return;
      }
      resultado.querySelector('.pergunta-enviada').textContent = pergunta;
      renderizarMarkdown(resultado.querySelector('.resposta'), dados.resposta);
      resultado.querySelector('.modelo').textContent = 'Workers AI · ' + dados.modelo;
      const fontes = resultado.querySelector('.fontes');
      fontes.replaceChildren();
      for (const evidencia of dados.evidencias) {
        const item = document.createElement('li');
        const detalhes = document.createElement('details');
        const titulo = document.createElement('summary');
        const trecho = document.createElement('div');
        trecho.className = 'trecho';
        const link = document.createElement('a');
        if (evidencia.estado && evidencia.documento) {
          const estado = document.createElement('span');
          estado.className = 'estado-fonte';
          estado.dataset.estado = evidencia.estado.toLowerCase();
          estado.textContent = evidencia.estado === 'Revogada' ? 'Revogada · histórica' : evidencia.estado;
          titulo.append(evidencia.documento + ' · ' + evidencia.id + ' ', estado);
        } else {
          titulo.textContent = evidencia.titulo + ' · ' + evidencia.id;
        }
        renderizarMarkdown(trecho, evidencia.texto);
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
      status.dataset.estado = 'pronto';
      status.textContent = 'Resposta pronta. Você pode continuar a conversa com outra pergunta.';
    } catch (erro) {
      status.dataset.estado = 'erro';
      status.textContent = erro.name === 'TimeoutError'
        ? 'O agente demorou a responder. Envie a pergunta novamente.'
        : 'Não foi possível conectar ao agente. Confira sua conexão e tente novamente.';
    } finally {
      form.removeAttribute('aria-busy');
      botao.textContent = rotulo;
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
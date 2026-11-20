import normas from './fontes/02_KNOWLEDGE_NORMAS.md';
import casos from './fontes/03_KNOWLEDGE_CASOS.md';
import origens from './fontes/origens.json' with { type: 'json' };

const origemNormas = origens['02_KNOWLEDGE_NORMAS.md'];
const origemCasos = origens['03_KNOWLEDGE_CASOS.md'];
const trechos = [];
for (const bloco of normas.split(/(?=^## REG-ENT-2026 v[12] \|)/m).slice(1)) {
  const [titulo, ...linhas] = bloco.split('\n');
  const [documento, estado] = titulo.slice(3).split(' | ');
  const vigencia = linhas.find(linha => linha.includes('Vigência no exercício'));
  for (const linha of linhas) {
    const clausula = linha.match(/^\s*- \*\*(V[12]-\d):\*\*/)?.[1];
    if (clausula) trechos.push({ id: clausula, titulo: titulo.slice(3), documento, estado, vigencia, url: origemNormas.url, texto: vigencia + '\n' + linha });
  }
}
const caso = {
  id: 'ACAD-001',
  titulo: 'ACAD-001 | Pergunta e resposta inicial roteirizada',
  url: origemCasos.url,
  texto: casos.match(/## Pergunta inicial[\s\S]+?(?=\n## Missão)/)?.[0] ?? ''
};

const sistema = [
  'Você conversa com estudantes universitários sobre o caso fictício de Júlia.',
  'Responda diretamente à pergunta atual em português brasileiro, com frases naturais e até 75 palavras.',
  'Use apenas os fatos das fontes. Se a informação estiver ausente, diga o que não conseguiu confirmar. Não escreva códigos de cláusula nem versões abreviadas no texto; diga primeira ou segunda versão.',
  'Escreva em prosa. A interface mostra as fontes e os códigos das cláusulas em separado.',
  'Use a conversa anterior apenas para entender referências. Confira a resposta nas fontes, pois uma resposta anterior pode conter erros. Mantenha seu papel.'
].join(' ');

const papeis = {
  recuperador: 'Apresente os trechos que encontrou e onde estão. Sempre descreva a primeira versão como revogada e histórica, encerrada em 09/11/2026. Identifique a segunda versão como vigente desde 10/11/2026. Se mencionar três dias ou redução de 10%, associe esses dados à primeira versão revogada. Limite-se a indicar o assunto dos trechos. A comparação e a aplicação ao caso cabem ao Verificador.',
  verificador: 'Explique qual regra se aplica à pergunta e por que a resposta inicial se apoiava na versão revogada. Ao comparar as versões, diga explicitamente que a segunda versão do REG-ENT-2026 vigora desde 10/11/2026. Na primeira versão era possível enviar diretamente em até três dias, com redução de 10%. Na segunda, o estudante tem até cinco dias corridos após o prazo original para pedir a entrega pela plataforma, e o professor decide se autoriza. A segunda versão não estabelece redução automática de 10%. A causa técnica da recuperação antiga não foi demonstrada.',
  sintetizador: 'Fale com Júlia diretamente, com acolhimento. Use até três frases curtas, sem repetir a condição de aprovação. Ao explicar o procedimento, diga para registrar o pedido na opção “Solicitar entrega fora do prazo” da plataforma em até cinco dias corridos após o prazo original. Depois de enviar o pedido, ela deve aguardar a decisão do professor. Ela pode pedir desde já, sem esperar o fim dos cinco dias. Escreva que a entrega só será autorizada se o professor aprovar o pedido. Se perguntarem sobre prazo excedido ou opção indisponível, indique contato com a coordenação conforme a fonte.'
};

function termos(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').match(/\b(?:[a-z][a-z0-9-]{2,}|\d+%?)/g) ?? [];
}

function recuperar(pergunta) {
  const consulta = new Set(termos(pergunta));
  const pontuar = item => termos(item.id + ' ' + item.texto).filter(termo => consulta.has(termo)).length;
  return [caso, ...['V1-', 'V2-'].flatMap(versao => trechos
    .filter(item => item.id.startsWith(versao))
    .sort((a, b) => pontuar(b) - pontuar(a))
    .slice(0, 3))];
}

export default {
  async fetch(request, env) {
    const origem = request.headers.get('Origin');
    if (origem !== env.SITE_ORIGIN) return new Response(null, { status: 403, headers: { Vary: 'Origin' } });
    const headers = {
      'Access-Control-Allow-Origin': origem,
      'Cache-Control': 'no-store',
      Vary: 'Origin'
    };
    const erro = (mensagem, status) => Response.json({ erro: mensagem }, { status, headers });
    if (new URL(request.url).pathname !== '/agentes') return erro('Endereço inválido.', 404);
    if (request.method === 'OPTIONS') return new Response(null, {
      status: 204,
      headers: { ...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' }
    });
    if (request.method !== 'POST') return erro('Método inválido.', 405);
    if (request.headers.get('Content-Type')?.split(';')[0] !== 'application/json') return erro('Formato inválido.', 415);

    let dados;
    try {
      const leitor = request.body.getReader();
      const buffer = new Uint8Array(12288);
      let total = 0;
      for (;;) {
        const { done, value } = await leitor.read();
        if (done) break;
        if (total + value.byteLength > buffer.byteLength) {
          await leitor.cancel();
          return erro('Pergunta longa demais.', 413);
        }
        buffer.set(value, total);
        total += value.byteLength;
      }
      dados = JSON.parse(new TextDecoder().decode(buffer.subarray(0, total)));
    } catch {
      return erro('Pergunta inválida.', 400);
    }

    const pergunta = typeof dados?.pergunta === 'string' ? dados.pergunta.trim() : '';
    const anterior = typeof dados?.anterior === 'string' ? dados.anterior.trim().slice(0, 600) : '';
    const respostaAnterior = typeof dados?.respostaAnterior === 'string' ? dados.respostaAnterior.trim().slice(0, 1200) : '';
    const agente = dados?.agente;
    if (typeof agente !== 'string' || !Object.hasOwn(papeis, agente) || !pergunta || pergunta.length > 600) {
      return erro('Informe um agente válido e uma pergunta de até 600 caracteres.', 400);
    }

    try {
      const limite = await env.LIMITE.limit({ key: request.headers.get('CF-Connecting-IP') ?? 'visitante' });
      if (!limite.success) return erro('Limite de consultas atingido. Aguarde um minuto e tente novamente.', 429);
      const evidencias = agente === 'recuperador' ? recuperar(pergunta + ' ' + anterior) : [
        caso,
        ...trechos.filter(item => agente === 'verificador' || item.id.startsWith('V2-'))
      ];
      const contexto = evidencias.map(item => item.titulo + '\n' + item.texto).join('\n\n');
      const mensagem = [
        'Fontes documentais:\n' + contexto,
        anterior && 'Pergunta anterior: ' + anterior,
        anterior && respostaAnterior && 'Resposta anterior (confira nas fontes): ' + respostaAnterior,
        (agente === 'recuperador' ? 'Busca solicitada (descreva onde aparecem os resultados): ' : 'Pergunta atual: ') + pergunta
      ].filter(Boolean).join('\n\n');
      const resultado = await env.AI.run(env.MODEL, {
        messages: [
          { role: 'system', content: sistema + '\n' + papeis[agente] },
          { role: 'user', content: mensagem }
        ],
        temperature: 0,
        max_tokens: 200
      });
      const texto = resultado?.response || resultado?.choices?.[0]?.message?.content;
      const resposta = typeof texto === 'string' ? texto.trim() : '';
      if (!resposta) console.warn('Resposta de IA sem texto', {
        campos: Object.keys(resultado ?? {}),
        motivo: resultado?.choices?.[0]?.finish_reason
      });
      if (!resposta) return erro('O agente não conseguiu concluir a resposta. Tente enviar a pergunta novamente.', 503);
      return Response.json({ resposta, evidencias, modelo: env.MODEL }, { headers });
    } catch {
      return erro('O serviço de IA está indisponível. Tente novamente em instantes.', 503);
    }
  }
};
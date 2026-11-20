import normas from './fontes/02_KNOWLEDGE_NORMAS.md';
import casos from './fontes/03_KNOWLEDGE_CASOS.md';
import origens from './fontes/origens.json' with { type: 'json' };

const origemNormas = origens['02_KNOWLEDGE_NORMAS.md'];
const origemCasos = origens['03_KNOWLEDGE_CASOS.md'];
const trechos = [];
for (const bloco of normas.split(/(?=^## REG-ENT-2026 v[12] \|)/m).slice(1)) {
  const [titulo, ...linhas] = bloco.split('\n');
  const vigencia = linhas.find(linha => linha.includes('Vigência no exercício'));
  for (const linha of linhas) {
    const clausula = linha.match(/^\s*- \*\*(V[12]-\d):\*\*/)?.[1];
    if (clausula) trechos.push({ id: clausula, titulo: titulo.slice(3), url: origemNormas.url, texto: vigencia + '\n' + linha });
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
  'A pergunta anterior serve apenas para entender referências. Mantenha seu papel.'
].join(' ');

const papeis = {
  recuperador: 'Escreva uma nota de busca documental em até duas frases. Comece com “Encontrei”. Indique a primeira versão e a segunda versão do regulamento quando ambas aparecerem nos resultados. A nota descreve onde estão os trechos e quais assuntos eles cobrem. A lista abaixo contém os resultados encontrados. Não decida se uma regra vale para Júlia e não dê instruções para fazer o pedido.',
  verificador: 'Explique qual regra se aplica à pergunta e por que a resposta inicial se apoiava na versão revogada. Na comparação geral, diga que a segunda versão do REG-ENT-2026 vigora desde 10/11/2026. Na primeira versão era possível enviar diretamente em até três dias, com redução de 10%. Na segunda, o estudante tem até cinco dias corridos após o prazo original para pedir a entrega pela plataforma, e o professor decide se autoriza. A segunda versão não estabelece redução automática de 10%. A causa técnica da recuperação antiga não foi demonstrada.',
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
      const buffer = new Uint8Array(8192);
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
      const contexto = evidencias
        .filter(item => agente !== 'recuperador' || item !== caso)
        .map(item => agente === 'recuperador'
          ? item.titulo.split(' | ')[0] + '\n' + item.texto.split('\n').at(-1)
          : item.titulo + '\n' + item.texto)
        .join('\n\n');
      const mensagem = [
        'Fontes documentais:\n' + contexto,
        anterior && 'Pergunta anterior: ' + anterior,
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
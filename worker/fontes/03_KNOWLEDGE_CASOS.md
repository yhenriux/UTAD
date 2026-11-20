# 03 | Casos e respostas esperadas

**Todos os nomes, datas institucionais, políticas e respostas aqui apresentados são ficcionais.** Caso: `ACAD-001`; data da pergunta: 20/11/2026.

## Pergunta inicial

> Sou a Júlia. Perdi ontem o prazo de entrega do trabalho de Metodologia. Ainda posso entregar?

## Resposta problemática produzida por IA (roteirizada)

> Sim. O regulamento permite entregar até três dias depois, com desconto de 10% na nota. Basta enviar o trabalho na área de entregas.

**Falha observável no material:** a resposta usa `REG-ENT-2026 v1`, que deixou de vigorar em 09/11/2026; omite a solicitação e o deferimento definidos em `V2-1` a `V2-3` e apresenta uma penalização que a v2 não prevê automaticamente (`V2-5`). Trata-se de um erro preparado para a atividade, não de uma execução verificada de modelo real.

## Missão dos participantes

1. Identificar a versão que sustentou a resposta inicial.
2. Conferir a norma v2 e os limites que ela estabelece.
3. Consultar as saídas do Recuperador, do Verificador e do Sintetizador, com análise crítica.
4. Decidir, com justificativa humana, o texto que será apresentado à estudante e registrar a trilha de validação.

**Alternativa A:** corrigir a orientação concreta à Júlia e registrar fontes, condições e limites.  
**Alternativa B:** ampliar a investigação para explicar por que a IA recuperou a versão revogada e propor melhoria do processo.  
Ambas são estratégias admissíveis; a escolha deve ser feita por pessoa, com motivo e evidência. O participante pode combinar as duas, se o tempo permitir.

## Saídas exemplificativas, explicitamente simuladas

**R1 Recuperador:** `REG-ENT-2026 v1 (V1-1, V1-2): 3 dias e envio direto; revogada em 09/11. REG-ENT-2026 v2 (V2-1 a V2-5): pedido até 5 dias, via plataforma, dependente de deferimento docente. Vigente desde 10/11.`

**V1 Verificador:** `O conselho de enviar diretamente com 10% de desconto não tem suporte na v2. O enunciado vigente prevê solicitação em até cinco dias, análise do pedido e comunicação da decisão. Há risco de criar falsa expectativa de aceitação.`

**S1 Sintetizador:** `Proposta A: informar que Júlia pode registrar um pedido na plataforma, até cinco dias corridos do prazo, sujeito a análise do docente. Proposta B: além de corrigir a resposta, investigar a persistência da versão v1. O responsável humano valida conteúdo e limites antes de comunicar.`

## Exemplo de resposta adequada à estudante

> Júlia, segundo a norma fictícia REG-ENT-2026 v2, você pode solicitar a entrega fora do prazo até cinco dias corridos após a data original. Registre o pedido na plataforma acadêmica, indicando a atividade e o motivo. O docente analisará a solicitação e informará se a entrega foi autorizada e em quais condições. Como o prazo venceu ontem, você ainda está dentro do período para solicitar, mas a autorização depende dessa análise.

**Resposta inadequada:** `Pode enviar quando quiser. Seu trabalho será aceito automaticamente e receberá apenas 10% de desconto.` Motivos: inventa garantia e reproduz penalidade de v1.

## Log de decisão humana, modelo

`ID | data/hora | pergunta | agentes consultados | evidências/versões | alternativa escolhida | texto corrigido | responsável | justificativa | lacunas`

**Exemplo simulado, a confirmar durante a sessão:** `DEC-ACAD-001 | 20/11 | entrega de Júlia | R1,V1,S1 (roteiros) | REG-ENT-2026 V2-1 a V2-5 | A | [texto acima] | participante/facilitador | preservar possibilidade de pedido sem prometer aceitação | não há confirmação de deferimento`.

## Critérios de avaliação

Corretude temporal; citação da cláusula; respeito à incerteza; linguagem compreensível para estudantes; papel decisório humano; trilha verificável; explicitação de saídas simuladas quando não houver agente funcional.

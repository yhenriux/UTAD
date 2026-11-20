# 04 | Guia operacional: laboratório de orientação acadêmica

**Objetivo:** realizar uma prova de conceito de aprendizagem imersiva com um erro documental simples e verificável, preservando a continuidade da ILCS da AF1.

## Espaços e acesso

- **FrameVR:** https://framevr.io/laboratorio-imersivo-auditoria-ia
- **Discord:** https://discord.gg/dYxq8mmfj (verificar validade do convite)
- **Drive:** https://drive.google.com/drive/folders/1DR4hz7eNOVZ6rrcMYGPRL50uPc-E8xjm?usp=drive_link

Os endereços foram mantidos para preservar o tópico já publicado. Verifique com um participante convidado se há acesso de leitura. Não publicar dados reais de estudantes.

## Três quadros para o FrameVR

1. **O desafio:** "Júlia perdeu ontem o prazo de um trabalho. A IA respondeu: 'Pode enviar em três dias, com 10% de desconto'. Essa orientação ainda vale?" Incluir link ou QR para o Drive.
2. **Investigar:** "Confronte a norma REG-ENT-2026 v1 (3 dias, desconto) com a v2 (pedido em até 5 dias, sujeito a decisão docente). Consulte os três agentes."
3. **Decidir:** "Escolha A: corrigir a resposta à Júlia. Ou B: também investigar a falha de atualização. Cite V2-1 a V2-5; registre a decisão no Discord."

Os três conteúdos estão instalados como objetos **Text Area** nativos na cena `Caso Júlia | AF2 v2`, identificados `01_Desafio_Julia_v2`, `02_Investigar_Normas_v2` e `03_Decisao_Humana_v2`. A cena `Arquivo: pré-teste v1` mantém dois painéis antigos para consulta histórica. Os ficheiros `painel_01_desafio.png`, `painel_02_investigar.png` e `painel_03_decidir.png` na pasta `05_Paineis` são versões gráficas alternativas para eventual upload posterior. Manter também a transcrição textual para acessibilidade.

## Sequência da sessão (10 a 15 minutos)

1. **Discord #briefing:** o facilitador publica a pergunta de Júlia e a resposta problemática, avisando que os documentos são fictícios. A pessoa participante confirma presença.
2. **FrameVR:** entrar na sala, ler os três painéis e escolher a missão. O facilitador pode representar papéis alternados em uma simulação individual, informando a encenação.
3. **Drive:** abrir as duas versões da norma; executar, ou representar de forma explícita, R1 Recuperador, V1 Verificador e S1 Sintetizador com base nos arquivos do grimório.
4. **Discord #decisoes:** registrar escolha humana, fontes e resposta corrigida para Júlia; pedir uma pergunta crítica socrática e uma prudencial do analista aristotélico-estoico.
5. **Drive #03_Evidencias:** guardar log, capturas e checklist. No vídeo de 3 a 5 minutos, apresentar início, investigação, decisão e limite da prova de conceito.

## Mensagens prontas

### #briefing

**AF2 IIA | Caso ACAD-001 (Universidade Aurora, fictícia) | Versão 2 do laboratório**

Júlia perguntou: "Perdi ontem o prazo de entrega do trabalho. Ainda posso entregar?" A IA respondeu com uma regra antiga: "Sim, até três dias depois, com desconto de 10%; basta enviar". Nossa missão é conferir a norma atual, dialogar com três agentes (Recuperador, Verificador e Sintetizador) e decidir uma orientação segura.

**Fontes:** pasta `01_Fontes` no Drive. **Espaço de investigação:** FrameVR. **Entrega:** registrar no `#decisoes` a escolha A (corrigir a resposta) ou B (também investigar por que a IA usou a versão antiga), citando evidências. Todas as normas são inventadas para a atividade. A encenação anterior, sobre uma política corporativa, fica identificada como pré-teste.

### #decisoes, modelo para preencher após a nova simulação

**DEC-ACAD-001 | Decisão humana, caso Júlia**

Alternativa escolhida: [A / B / ambas]. Fonte vigente: REG-ENT-2026 v2, desde 10/11/2026. Evidências: [cláusulas]. Saídas consultadas: [R1/V1/S1, indicar se simuladas ou IA funcional]. Resposta validada: [texto]. Justificativa humana: [motivo]. Limites: pedido sujeito à apreciação docente; não há aceitação automática. Responsável e momento: [preencher].

## Avaliação metodológica

- As mensagens antigas permanecem como histórico de pré-teste e os novos avisos da versão 2 já foram publicados no `#briefing` e no `#decisoes`.
- O código RAG local anterior, se utilizado, precisa reindexar `02_KNOWLEDGE_NORMAS.md` e `03_KNOWLEDGE_CASOS.md` novos; respostas da base corporativa ficam desatualizadas.
- Um RAG funcional agrega demonstração de recuperação, mas a atividade aceita um grimório com prompts e conhecimento. Se os agentes forem representados manualmente, sinalizar `saída roteirizada`.
- A decisão humana deve refletir uma ação real na simulação, com captura e justificativa própria. A reflexão de ~300 palavras e a ILCS final dependem das evidências observadas.

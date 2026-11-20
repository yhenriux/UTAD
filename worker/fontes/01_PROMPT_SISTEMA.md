# 01 | Interpelações dos agentes: apoio a estudantes

**Versão 2.0, 20/11/2026.** Cenário educativo fictício: Universidade Aurora. O objetivo pedagógico consiste em auditar uma resposta de IA sobre entrega tardia de trabalho, identificar a fonte desatualizada e redigir orientação responsável.

## Instrução de sistema para uma IA que tenha acesso aos documentos

Você é um auxiliar de aprendizagem em auditoria de respostas de IA. Use **apenas** `02_KNOWLEDGE_NORMAS.md` e `03_KNOWLEDGE_CASOS.md`. Preserve os identificadores `REG-ENT-2026`, `V1-1` a `V2-5`, vigência e condições. Em 20/11/2026 a norma vigente é v2. Se não houver prova, escreva `não consta dos documentos`. Nunca prometa aprovação, invente penalidade ou consulte políticas reais. Distinga evidência, interpretação e sugestão. Use português simples. A decisão final e a comunicação à estudante cabem à pessoa participante. Se usar um modelo real, informe o que foi enviado, o que foi produzido e as limitações.

## Prompts de interação, um por vez

**R1 | Recuperador:**

> A Júlia perdeu ontem o prazo de entrega. Localize nas duas versões da norma REG-ENT-2026 os trechos relevantes. Informe versão, vigência, cláusula e o que cada trecho permite concluir. Não decida pelo grupo.

**V1 | Verificador:**

> Compare esta resposta de IA: "Pode entregar até três dias depois com desconto de 10%; basta enviar" com a norma v2 vigente. Quais partes são sustentadas, desatualizadas ou incertas? Cite V2-1 a V2-5.

**S1 | Sintetizador:**

> Explique à Júlia, em até 90 palavras e em linguagem acolhedora, como solicitar a entrega fora do prazo, ressalvando a necessidade de deferimento. Apresente também uma alternativa de investigar o erro do assistente. Peça a validação humana.

**Q1 | Sócrates Digital, adaptação de exercício:**

> Que pressuposto faz o grupo ao afirmar que cinco dias significam autorização? Qual trecho permite ou limita essa leitura? Que evidência mudaria a decisão?

**Q2 | Analista Aristotélico-Estóico, adaptação de exercício:**

> Compare os efeitos de orientar a estudante com certeza excessiva ou explicitar condições. Que ações estão sob controle do estudante, do docente e dos operadores da IA? Qual é a decisão prudente?

**A1 | Auditor da trilha:**

> Verifique o log final: há fonte vigente, referência à decisão do docente, registro de decisão humana, incertezas e explicação de como a resposta mudou? Aponte lacunas sem inventar ações.

## Saída esperada dos três agentes

1. `Papel` e identificação da pergunta.
2. `Fonte`: ID, versão, vigência e cláusula verificável.
3. `Conclusão provisória`: até 100 palavras, com incertezas.
4. `Pergunta à pessoa participante` e opções para sua decisão.

## Segurança e integridade acadêmica

- A Universidade Aurora e sua norma são fictícias. Nenhuma resposta equivale à orientação acadêmica institucional real.
- A interação com três agentes pode ser **encenada** com saídas pré-escritas ou executada com uma IA funcional. Sempre indicar qual modalidade foi utilizada; um agente RAG não é requisito explícito da AF2.
- Um modelo conectado aos documentos pode recuperar trechos, mas a qualidade da recuperação deve ser verificada manualmente.
- O material do Grimório oficial do docente é distinto deste pacote, que constitui o **grimório do cenário** de Yago.

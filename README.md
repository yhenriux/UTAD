# Laboratório de Orientação Acadêmica com IA

Aplicação da AF2 de Interação e Interfaces Avançadas Web. O caso ACAD-001 e o regulamento REG-ENT-2026 são fictícios.

O frontend está em `docs/`. O Worker usa o binding Workers AI, com um único modelo e um prompt por papel. O corpus de execução são as normas e os casos originais em `worker/fontes/`. O arquivo `origens.json` registra a procedência dos documentos. A decisão é exportada em JSON no navegador.

## Implantação

1. Em uma conta Cloudflare no plano **Workers Free**, habilite o subdomínio workers.dev. A franquia do Workers AI é de 10.000 neurônios por dia. [Preços e limites](https://developers.cloudflare.com/workers-ai/platform/pricing/).
2. Em `worker/`, rode `npx wrangler login` e `npx wrangler deploy`. O modelo dos três agentes é configurado em `wrangler.toml`.
3. Em `docs/config.js`, informe o URL HTTPS retornado pela implantação, seguido de `/agentes`.
4. Publique o repositório público `yhenriux/UTAD` no GitHub Pages, a partir de `main` e `/docs`. Se o domínio mudar, atualize também `SITE_ORIGIN` no Worker.
5. Abra o endereço do Pages em uma sessão anônima. Consulte os três agentes, confira as referências, registre uma decisão e abra o JSON exportado.
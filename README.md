# Draxivo Digital

Portfólio de desenvolvimento para pequenos negócios, com três demonstrações navegáveis: Barber Shop, Sabor Express e Painel Atlântica.

Repositório: [italop26/Studio-Digital](https://github.com/italop26/Studio-Digital).

## Executar localmente

Requer Node.js 22.12 ou superior; o CI usa Node.js 24. Na raiz do projeto:

```sh
npm ci
npm ci --prefix sabor-express
npm test
npm run build
npm run check
npm run smoke
npm run preview
```

Abra `http://127.0.0.1:4173`. No PowerShell, se a política de execução bloquear `npm.ps1`, use `npm.cmd` nos mesmos comandos. Para editar apenas o Sabor Express com atualização automática: `npm run dev --prefix sabor-express`.

## Organização

```text
index.html                 Portfólio e formulário
agendamento/               Tela de conclusão do envio
assets/                    Imagens e favicon do portfólio
css/ e js/                 Estilos e interações do portfólio
barber-shop/               Demonstração de barbearia em HTML/CSS/JS
sabor-express/src/         Cardápio e carrinho em React/Vite
sabor-express/public/      Imagens locais do cardápio
dashboard/                 Painel em React/HTM, com CSS e JS separados
scripts/                   Build, verificação e servidor de prévia
tests/                     Regressões do agendamento e do carrinho
docs/                      Revisão e orientações de entrega
.github/workflows/         Verificação automática em push e pull request
dist/                      Site completo gerado, ignorado pelo Git
```

## Agendamento

O formulário principal envia ao Formspree pelo endpoint já presente no HTML. Nome: 2 a 80 caracteres. WhatsApp: celular brasileiro com DDD, aceitando também o prefixo 55. E-mail opcional, validado pelo navegador. Mensagem: 10 a 1.500 caracteres. Datas passadas são recusadas; dia e período continuam opcionais.

O botão fica desabilitado durante o envio. Apenas uma resposta HTTP de sucesso redireciona para `agendamento/index.html`. Falhas mantêm os campos preenchidos e permitem nova tentativa. A página de conclusão funciona sem JavaScript ou armazenamento do navegador. Ela confirma a solicitação; a disponibilidade e o horário são combinados por WhatsApp.

As validações locais melhoram o preenchimento. A aceitação, proteção contra abuso e entrega de e-mails dependem da configuração da conta Formspree. Os testes usam respostas simuladas, sem enviar dados ao serviço.

## Demonstrações

- **Barber Shop:** preços e imagens ilustrativos. Sem reservas reais. Um número comercial próprio pode ser configurado em `barber-shop/js/config.js`; vazio, os botões explicam que se trata de uma demonstração.
- **Sabor Express:** filtros, carrinho com até 20 unidades por item e conclusão de pedido fictícia. Não coleta dados bancários nem faz cobranças. O carrinho funciona em memória quando o armazenamento local está bloqueado.
- **Painel Atlântica:** indicadores, filtros e ordenação de colaboradores e clientes. Nomes, empresas e valores são fictícios; a referência fixa é outubro de 2026. Não há API ou backend Python em execução; `dashboard/requirements.txt` é um arquivo legado, sem uso pelo build.

O dashboard carrega React e HTM por CDN; fontes e parte das imagens do Sabor Express também dependem de serviços externos. A prévia e a publicação precisam de internet para esses recursos.

## Build e publicação

`npm run build` compila o Sabor Express e reúne somente os arquivos públicos em `dist/`. As URLs existentes são preservadas, incluindo `/sabor-express/dist/index.html`. Não publique a raiz inteira: isso exporia arquivos de desenvolvimento e ignoraria a preparação do build.

`vercel.json` configura instalação, build e diretório público. A publicação pode ser conectada a este repositório na Vercel. O workflow valida o código, mas não publica por conta própria.

O domínio declarado nos canonicals, no sitemap e em `robots.txt` é `https://draxivo-digital.vercel.app`, já usado pelo projeto local. A descrição do repositório no GitHub referencia outro endereço; confirme qual domínio ficará em produção. Caso mude, atualize as três fontes em conjunto antes de publicar. A confirmação usa `noindex` e não participa do sitemap.

## Git e entrega

Dependências, builds, configurações locais e arquivos `.env` estão no `.gitignore`. Os arquivos de lock ficam versionados para instalações reproduzíveis. Foram retirados do índice 4.734 arquivos de dependências, build e configuração local do editor; todos continuam no computador. Essa limpeza vale para o próximo commit e não reescreve o histórico antigo. Não foram feitos commit, push ou deploy nesta revisão.

Depois de revisar `git diff` e `git diff --cached`, prepare também os arquivos novos com `git add .`. O índice já contém a retirada dos arquivos gerados; inclua as fontes e configurações novas no mesmo commit para manter o conjunto completo.

Antes de publicar: confira desktop e celular, faça um envio real autorizado ao Formspree e confirme o recebimento, o WhatsApp e o domínio definitivo. Consulte [a revisão técnica](docs/revisao.md) para o escopo das verificações.

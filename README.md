# Bíblia — leitura offline

Aplicativo editorial de leitura bíblica construído com React 19. Ele contém os 66
livros e 1.189 capítulos localmente, funciona como PWA, pesquisa sem bloquear a
interface e mantém preferências e dados pessoais no IndexedDB.

## Recursos

- navegação por livro, capítulo, versículo e links compartilháveis;
- texto integral da Bíblia Livre carregado por capítulo;
- busca textual em Web Worker, sem diferenciar caixa ou acentos;
- parser de referências como `João 3:16`, `Jo 3 16`, `Jó 1:1` e `1Co 13:4`;
- favoritos, quatro cores de destaque e notas pessoais;
- continuação da última leitura e restauração aproximada do scroll;
- tamanho de texto, espaçamento, tema do aplicativo e tema do leitor;
- layout mobile-first com navegação inferior e sidebar no desktop;
- PWA instalável com todos os capítulos e índice preparados para uso offline;
- atualização do service worker somente após confirmação do usuário;
- interface sem fontes, APIs ou assets externos em tempo de execução.

## Stack

React 19, TypeScript strict, Vite, React Router, Tailwind CSS v4, componentes no
padrão shadcn/ui, Lucide, Zod 4, IndexedDB com `idb`, vite-plugin-pwa/Workbox,
Vitest, React Testing Library e Playwright.

## Requisitos e instalação

- Node.js 20 ou mais recente;
- npm 10 ou mais recente.

```bash
npm install
npm run dev
```

O servidor de desenvolvimento informa a URL local no terminal.

## Scripts

```bash
npm run dev             # desenvolvimento
npm run build           # valida dados, checa tipos e gera o PWA
npm run preview         # prévia do build
npm run lint            # ESLint
npm run typecheck       # TypeScript strict
npm run test            # Vitest + Testing Library
npm run test:e2e        # Playwright em mobile e desktop
npm run validate:bible  # valida 66 livros e 1.189 capítulos
npm run generate:bible  # regenera JSONs e índice a partir da Bíblia Livre
npm run bible:import     # importa a BPM a partir de data/bpm-usfm
```

Na primeira execução dos testes E2E pode ser necessário:

```bash
npx playwright install chromium
```

## Estrutura

```text
src/
├── app/             providers, roteamento e error boundary
├── components/      layout, leitor e primitivas de UI
├── features/search/ parser de referências
├── lib/db/          banco IndexedDB versionado
├── pages/           telas divididas por rota
├── repositories/    acesso exclusivo aos dados do usuário
├── schemas/         validações Zod
├── services/        carregamento e navegação bíblica
├── types/           entidades de domínio
└── workers/         pesquisa textual fora da thread principal

public/bible/blivre/
├── metadata.json
├── search-index.json
└── <livro>/<capítulo>.json
```

## Dados bíblicos e licença

O app usa a [Bíblia Livre](https://github.com/blivre/BibliaLivre), licenciada sob
CC BY 3.0 BR. Os créditos completos estão em
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) e também na tela de
configurações.

Para regenerar o conteúdo a partir de um clone da fonte oficial:

```bash
git clone --depth 1 https://github.com/blivre/BibliaLivre.git /tmp/BibliaLivre
npm run generate:bible -- /tmp/BibliaLivre/textos/f4/tr
npm run validate:bible
```

O gerador remove notas editoriais da fonte, preserva o texto principal, cria um
JSON por capítulo e produz o índice da pesquisa. A Bíblia não entra no bundle
JavaScript; os capítulos continuam sendo buscados individualmente.

## Como adicionar outra tradução

1. Confirme que a licença permite redistribuição e registre a atribuição.
2. Gere arquivos com o mesmo schema em `public/bible/<versão>/<livro>/<capítulo>.json`.
3. Adicione a versão ao metadata e selecione a raiz no serviço de carregamento.
4. Gere um índice próprio para a tradução.
5. Execute `npm run validate:bible`, testes e build.

O domínio já possui `BibleVersion`; a versão escolhida fica em `ReaderSettings.version`
(`src/types/user-data.ts`) e é lida por `bible.service.ts` e pelo worker de busca.

### Importação das traduções ACF, AA e NVI (thiagobodruk/biblia)

```bash
npm run bible:import:thiagobodruk [caminho-do-clone-thiagobodruk-biblia]
```

Lê `json/acf.json`, `json/aa.json` e `json/nvi.json` (BOM UTF-8, array de 66 livros na
ordem canônica) e gera `public/bible/{acf,aa,nvi}/`. Essas traduções são **CC BY-NC
(uso não comercial)** — ver `THIRD_PARTY_NOTICES.md`, diferente da licença CC BY da
Bíblia Livre. `npm run validate:bible` valida todos os diretórios de versão encontrados
em `public/bible/` automaticamente.

O seletor de tradução em Configurações lista `blivre`, `acf`, `aa` e `nvi`
(`src/data/bible-versions.ts`).

**TODO**: `public/bible/bpm/` não está no seletor. O formato dos capítulos da BPM
(`book` como objeto aninhado, verso com campo `label`) e do seu `search-index.json`
(`{b,c,v,t}` em vez de `{bookId,chapter,verse,text}`) diverge do schema usado por
`bible.service.ts` e pelo worker de busca; wire-up foi adiado para não arriscar a
correção das versões ACF/AA/NVI, que eram a prioridade desta tarefa.

### Importação USFM da Bíblia Portuguesa Mundial

A fonte USFM da BPM está em `data/bpm-usfm/`. O importador identifica livros pelo
marcador `\\id`, ignora automaticamente textos fora do cânon protestante e só
substitui a saída após validar todos os 66 livros e 1.189 capítulos.

```bash
npm run bible:import
```

Também é possível informar caminhos diferentes:

```bash
npx tsx scripts/import-bible.ts ./outra-fonte-usfm ./public/bible/bpm
```

A saída fica em `public/bible/bpm/`, com um JSON por capítulo, metadata, índice de
pesquisa compacto e manifesto offline. Notas, referências cruzadas, figuras,
headings e metadata linguística de `\\w` são removidas; texto poético e
continuações de parágrafo são preservados.

## Offline e atualizações

O App Shell e todos os JSONs são precacheados no primeiro preparo do service
worker. O runtime usa `CacheFirst` para `/bible/` no cache `bible-data-v1`.
Depois da instalação, a busca e a navegação entre quaisquer capítulos funcionam
sem rede. Uma versão nova mostra um aviso e só ativa após o usuário escolher
**Atualizar**.

Favoritos, destaques, notas, preferências e histórico usam stores separadas no
banco `biblia-offline`, versão 1. Esses dados nunca são enviados para um servidor.

## Qualidade e expansão

Rotas são carregadas com `lazy`/`Suspense`, capítulos adjacentes têm prefetch e a
busca pesada roda em Web Worker. A camada de repositórios permite adicionar no
futuro sincronização, login ou backup sem acoplar persistência aos componentes.

Antes de publicar, execute:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

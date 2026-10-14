# Library Events Dash — Resumo completo da conversa

## Contexto do projeto

O projeto é um exercício de Product Design chamado **Library Events Dash**. O objetivo é criar uma experiência para coordenadores de bibliotecas navegarem, filtrarem e acompanharem eventos de várias unidades.

Os documentos considerados fonte de verdade foram:

- `Library-Events-Dash-Agent-Brief.md`
- `Library-Events-Dash-Design-Process.md`
- As imagens na pasta `Reference images/`

Não foi encontrado um terceiro brief original separado. As referências visuais foram tratadas como direção de design e inspiração de padrões, sem copiar telas.

## Processo combinado

O trabalho foi dividido em fases:

1. **Entender** — ler a documentação, estudar os usuários, prioridades, restrições e referências.
2. **Estruturar** — estabelecer navegação, hierarquia, escopo de unidades, escopo temporal, busca, filtros e relação entre tabela e calendário.
3. **Construir o protótipo** — implementar a experiência funcional em React.
4. **Revisar e iterar** — parar para receber feedback e ajustar o protótipo.
5. **Figma** — reconstruir a experiência aprovada no arquivo informado pelo usuário.
6. **Documentação final** — registrar decisões, iterações, trade-offs e aprendizados reais.

O usuário autorizou as fases 2 e 3 e, posteriormente, pediu o início da fase de Figma. A documentação final do processo ainda não foi iniciada.

## Problema a resolver

Coordenadores precisam consultar eventos de várias unidades em um só lugar, entender o que está acontecendo agora e o que vem a seguir, localizar eventos específicos e alternar entre uma visão de tabela e uma visão de calendário sem perder o contexto dos filtros.

O conceito de “needs attention” foi interpretado como **relevância temporal**: eventos em andamento e próximos ganham destaque pela proximidade da data e do horário. Não foram inventados alertas operacionais, regras de prontidão ou métricas de negócio.

## Usuários e necessidades principais

- Coordenadores de programação e operações de bibliotecas.
- Pessoas que precisam navegar por várias filiais.
- Pessoas que precisam alternar entre visão detalhada em tabela e visão espacial no calendário.
- Pessoas que precisam localizar eventos por texto, tipo, status, filial ou intervalo de datas.

## Escopo principal mantido

- Escopo de filiais: todas, uma ou várias unidades.
- Escopo temporal: esta semana, este mês, todas as datas e intervalo personalizado.
- Busca em títulos e descrições.
- Filtro por status.
- Filtro por tipo de evento.
- Visão Table.
- Visão Calendar.
- Mesmo conjunto filtrado compartilhado entre tabela e calendário.
- Navegação para uma prévia detalhada do evento.
- Eventos em andamento, próximos, anteriores e cancelados identificáveis.
- Estados vazios e mensagens acionáveis.
- Dados mockados locais em TypeScript.

## Fora de escopo

- Backend.
- Autenticação.
- Banco de dados.
- Sincronização real com calendários.
- Criar ou editar eventos de verdade.
- Alertas operacionais complexos.
- Regras de readiness ou preparação de evento.
- Analytics avançado.
- Ações em massa.
- Sistema completo de permissões.
- Fluxo completo para o botão de criar evento.

## Direção visual escolhida

O usuário pediu maior proximidade com as referências, especialmente:

- Sidebar persistente.
- Cores mais expressivas e menos planas.
- Cards de evento mais ricos.
- Calendário como experiência principal.
- Layout de dashboard com navegação lateral e áreas de controle bem definidas.

Ao mesmo tempo, o usuário pediu para remover textos institucionais, promocionais ou externos à operação do app.

## Textos removidos por não serem necessários no produto

Foram removidos:

- “A clear view of what’s happening, and what’s next.”
- “Bring every branch’s schedule into focus.”
- “One system. Every community.”
- “12 branches, one shared calendar.”
- O bloco promocional da sidebar.
- Informações explicativas sobre o protótipo, como limites do exercício e criação/edição fora do escopo.
- A faixa superior “Workspace / Events / Oct 6, 2026 · 10:30 AM ET”.

Foram mantidos textos funcionais, como rótulos de busca, filtros, status, datas, unidades, horários, salas, legendas e mensagens de estado vazio.

## Sidebar

A sidebar foi adicionada e iterada com os seguintes requisitos:

- Fundo verde escuro.
- Identidade Maple County Library System.
- Navegação entre Events e Calendar.
- Lista das 12 unidades.
- Seleção de todas as unidades ou de uma unidade específica.
- Estado selecionado visível.
- Sem bloco promocional.
- Sem rolagem vertical em altura normal.
- Adaptação para telas muito baixas.
- Em telas desktop, compacta por padrão e expansível por hover ou foco de teclado.
- A expansão não desloca o conteúdo principal.
- Em telas menores, continua disponível por botão de abrir/fechar e scrim.

## Controles e acessibilidade

Os controles principais foram padronizados para 44 px de altura, incluindo:

- Seletor de filial.
- Criar novo evento.
- Filtros.
- Abas de período.
- Alternância Table/Calendar.
- Botões de ícone.

Também foram reforçados:

- Foco visível de teclado.
- Rótulos ARIA para controles.
- Alvos de toque com tamanho consistente.
- Navegação por teclado.
- Escape para fechar estados expandidos.

## Botão “Criar novo evento”

Foi adicionado o botão **Criar novo evento** no cabeçalho da página.

Por enquanto ele é apenas visual e não abre conteúdo, porque criação/edição real está fora do escopo atual.

## Calendário

O calendário passou a ser a visualização principal.

### Ordem das visualizações

- Calendar agora aparece à esquerda.
- Table aparece à direita.
- Calendar é a visualização inicial para novas sessões.
- A escolha do usuário continua preservada em sessão.

### Cards do calendário

Os cards foram enriquecidos com dados reais do mock:

- Ícone do tipo de evento.
- Tipo do evento.
- Horário completo.
- Título.
- Unidade/filial.
- Sala.
- Status.
- Indicador temporal, como “Happening now”, “Today” ou “Tomorrow”, quando aplicável.
- Seta de navegação para a prévia do evento.

Os tipos possuem tratamento visual distinto:

- Story hour.
- Workshop.
- Author talk.
- Community meeting.

Cards cancelados usam borda tracejada e tratamento visual próprio.

### Linha do horário atual

A linha do horário atual foi ajustada para:

- Ficar acima dos cards de evento.
- Passar por trás do cabeçalho fixo de dias e horários.
- Não sobrepor visualmente o cabeçalho “ET / dias”.

### Cabeçalho do calendário

O cabeçalho com “ET” e os dias da semana ficou fixo no topo da área rolável.

## Calendário expandido

Foi adicionado um botão de expandir calendário.

No modo expandido:

- O calendário ocupa toda a área disponível do app.
- A sidebar fica escondida.
- O cabeçalho de página fica escondido.
- O seletor de período fica escondido.
- A legenda inferior fica escondida para liberar espaço.
- O botão de restaurar permanece disponível.
- Clicar novamente restaura a visualização anterior.
- Escape também restaura a visualização.
- Os filtros e a busca continuam disponíveis em uma barra compacta.
- Branch, status, tipo, busca e escopo temporal continuam funcionando.

O usuário pediu explicitamente que o calendário expandido não perdesse a capacidade de pesquisar e filtrar.

## Rolagem e responsividade

O usuário pediu que os blocos de interface não tivessem uma rolagem geral desnecessária.

Decisão implementada:

- Sidebar sem rolagem vertical em altura normal.
- Bloco principal fixo à altura da tela.
- Apenas tabela e calendário possuem rolagem interna.
- Legenda de cores permanece visível no modo normal.
- Calendário e tabela se adaptam à altura disponível.
- Calendário semanal mantém rolagem horizontal quando necessário.
- Layout móvel mantém controles acessíveis e sidebar recolhida.

## Legenda de cores

A legenda dos quatro tipos de evento fica sempre visível no modo normal:

- Story hour.
- Workshop.
- Author talk.
- Community meeting.

Ela fica posicionada no rodapé da área principal, fora da rolagem da tabela/calendário.

No modo expandido, a legenda é escondida para reservar mais espaço ao calendário.

## Protótipo técnico

Stack usada:

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Primitivos no estilo shadcn/ui.
- Lucide.
- date-fns.
- Dados locais mockados em TypeScript.

Não foi adicionado backend, autenticação, banco ou infraestrutura desnecessária.

Arquivos principais:

- `src/App.tsx`
- `src/styles.css`
- `src/components/Sidebar.tsx`
- `src/components/Calendar.tsx`
- `src/components/Controls.tsx`
- `src/components/EventPresentation.tsx`
- `src/lib/events.ts`
- `src/lib/calendar.ts`
- `src/data/events.ts`
- `src/types/event.ts`

## Comportamentos implementados

- Busca atualiza tabela e calendário.
- Filtros atualizam tabela e calendário.
- Mudança de unidade atualiza tabela e calendário.
- Mudança de período atualiza tabela e calendário.
- Calendar e Table representam o mesmo conjunto filtrado.
- Navegação para detalhes preserva o contexto.
- Links de eventos funcionam por hash.
- Estado de navegação é preservado em `sessionStorage`.
- Paginação da tabela funciona.
- Calendário mensal e semanal funcionam.
- Dias com muitos eventos exibem acesso a eventos adicionais.
- Estados vazios oferecem ações para limpar busca/filtros ou ampliar o escopo.
- Atalho `/` foca a busca.
- Escape fecha estados apropriados.

## Verificações realizadas

- `npm run build` passou após as principais iterações.
- Testes Vitest passaram com 13 testes.
- Testes manuais foram feitos em desktop, altura reduzida e viewport móvel.
- Expansão do calendário foi testada.
- Busca e filtros no calendário expandido foram testados.
- Expansão da sidebar por hover/foco foi testada.
- Cabeçalho fixo do calendário foi verificado após rolagem.
- Alturas dos controles foram verificadas em 44 px.

## Figma

O usuário forneceu este arquivo:

`https://www.figma.com/design/P1DJdwVJtMRvbIoe9Kk7Kh/Untitled`

O arquivo foi inspecionado e estava vazio:

- Página: `Page 1`.
- Nenhum frame existente.
- Nenhum componente local.
- Nenhuma variável local.
- Nenhum estilo local.

Foram consultadas as bibliotecas disponíveis e a busca de componentes. Foram encontrados componentes de bibliotecas externas, mas nenhum foi aplicado ainda.

A primeira tentativa de criar a composição editável no Figma foi bloqueada pela revisão automática por limite de uso da ferramenta. Portanto:

- A reconstrução no Figma ainda não foi criada.
- O protótipo React continua sendo a fonte de verdade operacional atual.
- A próxima etapa autorizada é criar a composição editável no arquivo informado.

## Próximo trabalho no Figma

Quando a ferramenta estiver disponível, a reconstrução deve incluir:

- Auto Layout.
- Sidebar expansível/compacta.
- Calendário como tela principal.
- Tabela como visualização complementar.
- Barra de busca e filtros.
- Seletor de filial.
- Botão Criar novo evento.
- Cards de evento reutilizáveis.
- Variantes visuais por tipo e status.
- Calendário semanal e mensal.
- Estado expandido do calendário.
- Legenda de tipos.
- Wireframes/conceitos de estados necessários.
- Componentes reutilizáveis e variantes apropriadas.
- Fundamentos e tokens consistentes.

O Figma deve refletir as decisões validadas no protótipo, sem virar uma redesign separado.

## Decisões que devem ser preservadas

- Não reintroduzir slogans ou marketing na interface operacional.
- Não adicionar texto externo ou explicativo sem função de uso.
- Não inventar pesquisa de usuário, métricas ou regras de negócio.
- Não criar backend, login ou banco.
- Não transformar o botão de criação em fluxo completo sem nova decisão.
- Não perder filtros ao alternar Table/Calendar.
- Não deixar o calendário expandido sem busca e filtros.
- Não deixar o cabeçalho ET/dias ser coberto pela linha de horário.
- Não deixar a sidebar criar uma rolagem vertical desnecessária.
- Não substituir a experiência por uma captura achatada no Figma; os elementos devem ser editáveis.


# Doctor Auto Prime — Mapa Completo de Páginas

**Versão:** 1.0 — Março 2026  
**Projeto:** Doctor Auto Prime — Sistema de Gestão Automotiva  
**Stack:** React 19 + Vite + tRPC 11 + Express 4 + MySQL  
**Total de páginas:** 57 rotas | 4 perfis de acesso | 26 routers tRPC | 31 tabelas no banco

---

## Visão Geral por Perfil de Acesso

| Perfil | Acesso | Páginas | Foco |
|---|---|---|---|
| **Dev** | Total | 10 páginas | Infraestrutura, IA, sistema, processos |
| **Gestão** | Estratégico | 15 páginas | Dashboards, KPIs, metas, relatórios |
| **Consultor (Admin)** | Operacional | 24 páginas | Pátio, OS, clientes, agenda, financeiro |
| **Mecânico** | Campo | 1 página | OS atribuídas, agenda, aprendizado |

---

## 1. Páginas Públicas e Autenticação

Estas páginas são acessíveis sem autenticação ou fazem parte do fluxo de login do sistema.

| Rota | Componente | Linhas | Descrição |
|---|---|---|---|
| `/` | `Home` | — | Landing page / redirecionamento para login |
| `/login` | `Login` | — | Autenticação local com usuário e senha |
| `/selecionar-perfil` | `SelecionarPerfil` | 122 | Seleção do perfil de acesso após login (Dev, Gestão, Consultor, Mecânico) |
| `/trocar-senha` | `TrocarSenha` | 291 | Alteração de senha do usuário autenticado |
| `/callback` | — | — | Callback do Manus OAuth |
| `/404` | `NotFound` | 52 | Página de erro para rotas inexistentes |

---

## 2. Perfil Consultor (Admin) — Operação Diária

O perfil Consultor é o núcleo operacional do sistema. Consultores como João e Pedro gerenciam o fluxo completo de OS, agendamentos, clientes e financeiro no dia a dia da oficina.

### 2.1 Operacional

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/admin` | — | — | — | Redireciona para `/admin/dashboard` |
| `/admin/dashboard` | `AdminDashboard` | 243 | `dashboard.kpis`, `pendencias.list`, `pendencias.updateStatus` | Painel principal com KPIs do dia, alertas de pendências e ações rápidas |
| `/admin/patio` | `AdminPatio` | 210 | `os.patio`, `os.updateStatus`, `colaboradores.list` | Pátio visual com cards de OS ativas, filtros por status e atualização de andamento |
| `/admin/pendencias` | `AdminPendencias` | 227 | `os.patio` | Lista de OS críticas: atrasadas, sem mecânico, aguardando peças, sem orçamento |
| `/admin/operacional` | `Operacional` | 420 | `os.patio`, `agendamentos.list`, `colaboradores.list` | Visão operacional consolidada com pátio, agenda e equipe |

### 2.2 Ordens de Serviço

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/admin/os` | `AdminOrdensServico` | 140 | `os.list` | Lista completa de OS com filtros e busca |
| `/admin/os/:id` | `AdminOSDetalhes` | 911 | `os.get`, `os.update`, `os.updateStatus`, `os.addItemFull`, `os.addObservacao`, `os.deleteItem`, `os.updateItemStatus`, `mecanicos.list`, `colaboradores.list` | Detalhe completo da OS: itens, histórico, mecânico, status, observações, anexos |
| `/admin/os/nova` | `AdminNovaOS` | 725 | `os.create`, `clientes.list`, `clientes.create`, `veiculos.list`, `veiculos.create`, `mecanicos.list`, `colaboradores.list`, `recursos.list` | Criação de nova OS com busca de cliente/veículo e seleção de serviços |
| `/admin/nova-os` | `NovaOS` | 545 | `os.create`, `clientes.list`, `clientes.create`, `veiculos.list`, `veiculos.create`, `mecanicos.list`, `colaboradores.list` | Alias de criação de OS (fluxo simplificado) |

### 2.3 Agenda

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/admin/agenda` | `AdminAgendamentos` | 158 | `agendamentos.list`, `agendamentos.create`, `clientes.list`, `veiculos.list`, `colaboradores.list`, `mecanicos.list` | Agenda de agendamentos com criação, filtros e visualização por data |
| `/admin/agenda-mecanicos` | `AdminAgendaMecanicos` | 225 | `agendamentos.list`, `mecanicos.list`, `os.list` | Agenda visual por mecânico — quem está em qual OS/agendamento |

### 2.4 Cadastros

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/admin/clientes` | `AdminClientes` | 81 | `clientes.list` | Lista de clientes com busca por nome, telefone e placa |
| `/admin/clientes/:id` | `AdminClienteDetalhe` | 245 | `clientes.byId` | Detalhe do cliente: veículos, histórico de OS, contato |

### 2.5 Relatórios e Análise

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/admin/financeiro` | `AdminFinanceiro` | 272 | `dashboard.financeiro` | Faturamento mensal, ticket médio, comparativo por período |
| `/admin/produtividade` | `AdminProdutividade` | 181 | `dashboard.produtividade` | Produtividade por mecânico: OS concluídas, tempo médio, eficiência |
| `/admin/mecanicos/analytics` | `AdminMechanicAnalytics` | 229 | `dashboard.produtividade`, `mecanicos.list` | Analytics detalhado por mecânico com ranking e comparativo |
| `/admin/mecanicos/feedback` | `AdminMechanicFeedback` | 223 | `mecanicoFeedback.add`, `mecanicoFeedback.listToday`, `mecanicos.list` | Registro de feedback positivo/negativo por mecânico |
| `/admin/ia-qg` | `IaQG` | 819 | `kommo.leads`, `kommo.status`, `kommo.analisarLote`, `kommo.distribuir`, `kommo.runReactivation`, `leadScoring.list`, `leadScoring.scoreLeads`, `leadScoring.history`, `leadScoring.deleteScore`, `colaboradores.list` | QG de IA: temperatura de leads, distribuição por consultor, análise de pipeline Kommo, lead scoring |

### 2.6 Integrações e Configurações

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/admin/integracoes` | `AdminIntegracoes` | 309 | `config.get`, `config.set` | Configuração de integrações: Kommo, Trello, WhatsApp, webhooks |
| `/admin/trello-migracao` | `TrelloMigracao` | 723 | `trello.boardStatus`, `trello.importFromTrello`, `trello.fetchEntregues`, `trello.gerarPlanilha`, `trello.historico`, `trello.updateCard`, `trello.getOverrides` | Migração e sincronização de OS com o Trello Board |
| `/admin/configuracoes` | `AdminConfiguracoes` | 205 | `config.get`, `config.set`, `colaboradores.list` | Configurações gerais da oficina: metas, horários, parâmetros |
| `/admin/usuarios` | `AdminUsuarios` | 534 | `colaboradores.list`, `colaboradores.create`, `colaboradores.update`, `colaboradores.delete`, `colaboradores.resetSenha`, `colaboradores.niveisAcesso` | Gestão de usuários: criação, roles, reset de senha, vinculação de mecânico |

### 2.7 Processos

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/admin/processosPatio` | `AdminProcessosPatio` | 246 | — | Diagramas Mermaid dos processos do pátio: entrada, execução, entrega, agendamento, pendências |
| `/admin/processosSistema` | `AdminProcessosSistema` | 262 | — | Diagramas de arquitetura do sistema: stack, auth, agentes IA, Kommo, Trello |

---

## 3. Perfil Gestão — Visão Estratégica

O perfil Gestão fornece dashboards de alto nível para tomada de decisão estratégica, análise de KPIs e planejamento.

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/gestao/os-ultimate` | `GestaoOSUltimate` | 693 | `os.list`, `dashboard.financeiro`, `mecanicos.list`, `colaboradores.list` | Visão completa de OS: KPIs com delta, funil clicável, mix de serviços, ranking de mecânicos, exportação CSV |
| `/gestao/visao-geral` | `GestaoVisaoGeral` | 165 | `dashboard.kpis`, `dashboard.financeiro`, `dashboard.produtividade` | Dashboard consolidado: faturamento, OS ativas, produtividade e metas |
| `/gestao/operacional` | `GestaoOperacional` | 129 | `dashboard.kpis`, `os.list` | Visão operacional simplificada para gestores |
| `/gestao/financeiro` | `GestaoFinanceiro` | 147 | `dashboard.financeiro` | Análise financeira: faturamento, ticket médio, histórico mensal |
| `/gestao/produtividade` | `GestaoProdutividade` | 179 | `dashboard.produtividade` | Produtividade da equipe: OS por mecânico, tempo médio, eficiência |
| `/gestao/colaboradores` | `GestaoColaboradores` | 115 | `colaboradores.list` | Lista de colaboradores com cargos e status |
| `/gestao/mecanicos` | `GestaoMecanicos` | 126 | `mecanicos.list` | Lista de mecânicos com especialidades e grau de conhecimento |
| `/gestao/metas` | `GestaoMetas` | 231 | `config.get`, `config.list`, `config.set`, `dashboard.financeiro`, `dashboard.produtividade`, `colaboradores.list` | Definição e acompanhamento de metas: faturamento, OS, ticket médio |
| `/gestao/relatorios` | `GestaoRelatorios` | 161 | `dashboard.kpis`, `dashboard.financeiro`, `dashboard.produtividade` | Relatórios consolidados para exportação e análise |
| `/gestao/melhorias` | `GestaoMelhorias` | 306 | `melhorias.list`, `melhorias.create`, `melhorias.updateStatus`, `melhorias.vote` | Backlog de melhorias: criação, votação, status de implementação |
| `/gestao/campanhas` | `GestaoCampanhas` | 302 | `dashboard.kpis`, `dashboard.financeiro` | Análise de campanhas e promoções com impacto no faturamento |
| `/gestao/rh` | `GestaoRH` | 268 | `colaboradores.list`, `mecanicos.list`, `mecanicoFeedback.list`, `dashboard.produtividade` | RH: equipe, feedbacks de mecânicos, produtividade individual |
| `/gestao/operacoes` | `GestaoOperacoes` | 274 | `os.list`, `agendamentos.list`, `pendencias.list`, `dashboard.kpis` | Operações: OS, agendamentos e pendências em uma visão |
| `/gestao/tecnologia` | `GestaoTecnologia` | 236 | `dashboard.kpis`, `kommo.status`, `trello.boardStatus`, `melhorias.list` | Status das integrações tecnológicas e roadmap de melhorias |
| `/gestao/antes-depois` | `GestaoAntesDePois` | 541 | `dashboard.kpis`, `dashboard.financeiro`, `dashboard.produtividade`, `agendamentos.list` | Comparativo de 10 KPIs antes e depois da implantação do sistema |

---

## 4. Perfil Dev — Infraestrutura e IA

O perfil Dev tem acesso total ao sistema, incluindo configurações de IA, status de integrações, processos e painel de controle técnico.

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/dev` | `DevPanel` | — | `colaboradores.list`, `changelog.list`, `config.*` | Painel Dev principal: usuários, changelog, configurações do sistema |
| `/dev/painel` | `DevPanel` | — | — | Alias do Painel Dev |
| `/dev/ia-portal` | `IAPortal` | 622 | `agentes.list`, `agentes.orquestrar`, `agentes.chat` | Chat multi-agente: Sophia orquestra e delega para Simone (sistema) ou Raena (Kommo) |
| `/dev/sistema` | `Sistema` | 582 | `config.list`, `logs.list` | Status em tempo real das integrações: banco, Kommo, Trello, LLM, WhatsApp |
| `/dev/processos` | `Processos` | 471 | — | Diagramas de processos do sistema e da operação |
| `/dev/cliente` | `ClientePortal` | 484 | — | Portal de visualização do cliente |
| `/dev/qgia/perfil-ia` | `PerfilIA` | 313 | `config.list`, `config.setMany`, `config.getPerfilIA` | Configuração dos agentes IA: model, temperatura, max tokens, system prompt por agente |
| `/dev/qgia/temperatura-lead` | `TemperaturaLead` | 169 | — | Análise de temperatura dos leads do Kommo |
| `/dev/qgia/distribuicao-leads` | `DistribuicaoLeads` | 134 | — | Distribuição de leads por consultor e status |
| `/dev/qgia/historico-pontuacao` | `HistoricoPontuacao` | 149 | — | Histórico de pontuação de leads pelo sistema de scoring |

---

## 5. Perfil Mecânico — Visão de Campo

O mecânico acessa uma interface dedicada e simplificada, focada nas suas OS atribuídas e no seu desenvolvimento profissional.

| Rota | Componente | Linhas | Procedures tRPC | Descrição |
|---|---|---|---|---|
| `/mecanico` | `MecanicoView` | — | `os.patio`, `os.updateStatus`, `mecanicos.list`, `agendamentos.listByMecanico`, `agendamentos.updateStatusMecanico` | Visão gamificada: trilha de 6 etapas, sistema de XP, barra de progresso diária, níveis (Iniciante → Mestre), aba Agenda |

---

## 6. Páginas Transversais

Páginas acessíveis por múltiplos perfis.

| Rota | Componente | Linhas | Procedures tRPC | Acesso | Descrição |
|---|---|---|---|---|---|
| `/visaogeral` | `VisaoGeral` | 418 | `os.patio`, `agendamentos.list`, `dashboard.kpis`, `dashboard.financeiro` | Consultor, Gestão, Dev | Visão executiva consolidada: pátio ativo, pendências, agenda do dia, termômetro de meta |

---

## 7. Banco de Dados — Tabelas por Domínio

### Domínio Operacional (OS e Pátio)

| Tabela | Uso Principal |
|---|---|
| `ordensServico` | Ordens de serviço — tabela central do sistema |
| `osHistorico` | Histórico de mudanças de status de cada OS |
| `osItens` | Itens/serviços de cada OS com mecânico responsável |
| `osAnexos` | Fotos e documentos anexados às OS |
| `agendamentos` | Agendamentos de clientes com vínculo a mecânico |
| `pendencias` | Pendências críticas identificadas no pátio |
| `faturamento` | Registros de faturamento ao entregar OS |

### Domínio Cadastros

| Tabela | Uso Principal |
|---|---|
| `clientes` | Cadastro de clientes com contato e histórico |
| `veiculos` | Veículos vinculados a clientes |
| `colaboradores` | Usuários do sistema (consultores, gestores) |
| `mecanicos` | Mecânicos com especialidade e grau de conhecimento |
| `mecanicoFeedback` | Feedbacks positivos/negativos por mecânico |
| `recursos` | Recursos/peças disponíveis na oficina |
| `servicosCatalogo` | Catálogo de serviços com preços de referência |
| `empresas` | Dados da empresa/oficina |
| `nivelDeAcesso` | Níveis de acesso e permissões |
| `oficinaVagas` | Vagas físicas do pátio (mapa da oficina) |

### Domínio Integrações

| Tabela | Uso Principal |
|---|---|
| `kommoTokens` | Tokens OAuth do Kommo CRM (access + refresh) |
| `kommoLeads` | Cache de leads do Kommo com dados de pipeline |
| `leadScores` | Pontuação de leads pelo sistema de scoring IA |
| `leadScoreHistory` | Histórico de pontuações ao longo do tempo |
| `trelloSyncLog` | Log de sincronizações com o Trello Board |
| `trelloCardOverrides` | Sobrescritas manuais de cards do Trello |
| `crm` | Dados de CRM internos |
| `analisePromocoes` | Análise de promoções e campanhas |

### Domínio Sistema e IA

| Tabela | Uso Principal |
|---|---|
| `systemConfig` | Configurações do sistema: metas, parâmetros IA, integrações |
| `systemLogs` | Logs de eventos do sistema para auditoria |
| `changelog` | Histórico de atualizações do sistema (ChangelogBell) |
| `melhorias` | Backlog de melhorias com votação e status |
| `users` | Usuários autenticados (Manus OAuth) |

---

## 8. Agentes IA — Ecossistema

| Agente | Domínio | System Prompt | Contexto Injetado |
|---|---|---|---|
| **Sophia** | Orquestradora | Analisa intent e decide delegação | Nenhum — apenas roteamento |
| **Simone** | Sistema Interno | Especialista em operação da oficina | OS ativas, pendências, agendamentos do banco |
| **Raena** | Kommo CRM | Especialista em leads e pipeline | Leads reais da API Kommo (cache 60s, fallback banco) |

> **Regra crítica da Raena:** Não passa preços nem negocia. Foca em qualificação de leads e análise de pipeline.

Os system prompts são persistidos na tabela `systemConfig` com chaves `ia.agente.*.systemPrompt` e configuráveis em tempo real via `/dev/qgia/perfil-ia`.

---

## 9. Routers tRPC — Referência Rápida

| Router | Procedures principais | Tabelas |
|---|---|---|
| `auth` | `me`, `logout`, `login` | `users`, `colaboradores` |
| `usuarios` | `list`, `create`, `update`, `delete`, `vincularMecanico` | `colaboradores`, `mecanicos` |
| `dashboard` | `kpis`, `financeiro`, `produtividade` | `ordensServico`, `faturamento`, `mecanicos` |
| `os` | `list`, `get`, `create`, `update`, `updateStatus`, `patio`, `addItemFull` | `ordensServico`, `osItens`, `osHistorico`, `faturamento` |
| `agendamentos` | `list`, `create`, `listByMecanico`, `updateStatusMecanico` | `agendamentos` |
| `clientes` | `list`, `byId`, `create` | `clientes`, `veiculos` |
| `mecanicos` | `list` | `mecanicos` |
| `colaboradores` | `list`, `create`, `update`, `delete`, `resetSenha`, `niveisAcesso` | `colaboradores`, `nivelDeAcesso` |
| `kommo` | `leads`, `status`, `analisarLote`, `distribuir`, `runReactivation` | `kommoLeads`, `kommoTokens` |
| `trello` | `boardStatus`, `importFromTrello`, `fetchEntregues`, `gerarPlanilha` | `trelloSyncLog`, `trelloCardOverrides` |
| `leadScoring` | `list`, `scoreLeads`, `history`, `deleteScore` | `leadScores`, `leadScoreHistory` |
| `agentes` | `list`, `orquestrar`, `chat`, `getConfig` | `systemConfig` |
| `config` | `list`, `get`, `set`, `setMany`, `getPerfilIA` | `systemConfig` |
| `changelog` | `list`, `create`, `marcarLido` | `changelog` |
| `logs` | `list` | `systemLogs` |
| `melhorias` | `list`, `create`, `updateStatus`, `vote` | `melhorias` |
| `pendencias` | `list`, `updateStatus` | `pendencias` |

---

*Documento gerado automaticamente em Março de 2026 — Doctor Auto Prime v1.0*

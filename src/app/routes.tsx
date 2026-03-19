import { createBrowserRouter, redirect } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DevLogin from "./pages/DevLogin";
import StaffLogin from "./pages/StaffLogin";
import ForgotPassword from "./pages/ForgotPassword";
import DevDashboard from "./pages/DevDashboard";
import DevTables from "./pages/DevTables";
import DevUsers from "./pages/DevUsers";
import DevDatabase from "./pages/DevDatabase";
import DevExplorer from "./pages/DevExplorer";
import Dashboard from "./pages/Dashboard";
import PatioKanban from "./pages/PatioKanban";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminAgendamentos from "./pages/admin/AdminAgendamentos";
import AdminClientes from "./pages/admin/AdminClientes";
import AdminClienteDetalhe from "./pages/admin/AdminClienteDetalhe";
import AdminOrdensServico from "./pages/admin/AdminOrdensServico";
import AdminOSDetalhes from "./pages/admin/AdminOSDetalhes";
import AdminNovaOS from "./pages/admin/AdminNovaOS";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";
import AdminRelatorios from "./pages/admin/AdminRelatorios";
import AdminPendencias from "./pages/admin/AdminPendencias";
import AdminOperacional from "./pages/admin/AdminOperacional";
import AdminAgendaMecanicos from "./pages/admin/AdminAgendaMecanicos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import MecanicoView from "./pages/MecanicoView";
import AdminFinanceiro from "./pages/admin/AdminFinanceiro";
import AdminProdutividade from "./pages/admin/AdminProdutividade";
import AdminIaQG from "./pages/admin/AdminIaQG";
import GestaoOsUltimate from "./pages/gestao/GestaoOsUltimate";
import GestaoVisaoGeral from "./pages/gestao/GestaoVisaoGeral";
import GestaoMetas from "./pages/gestao/GestaoMetas";
import GestaoMelhorias from "./pages/gestao/GestaoMelhorias";
import VisaoGeral from "./pages/VisaoGeral";
import AdminIntegracoes from "./pages/admin/AdminIntegracoes";
import AdminTrelloMigracao from "./pages/admin/AdminTrelloMigracao";
import DevIAPortal from "./pages/dev/DevIAPortal";
import DevPerfilIA from "./pages/dev/DevPerfilIA";
import GestaoFornecedores from "./pages/gestao/GestaoFornecedores";
import GestaoDashboards from "./pages/gestao/GestaoDashboards";
import GestaoRH from "./pages/gestao/GestaoRH";
import GestaoOperacoes from "./pages/gestao/GestaoOperacoes";
import GestaoFinanceiro from "./pages/gestao/GestaoFinanceiro";
import GestaoComercial from "./pages/gestao/GestaoComercial";
import GestaoTecnologia from "./pages/gestao/GestaoTecnologia";
import GestaoVeiculosOrfaos from "./pages/gestao/GestaoVeiculosOrfaos";
import AnalyticsFunil from "./pages/analytics/AnalyticsFunil";

// NOVAS PÁGINAS DEV
import DevLogs from "./pages/dev/DevLogs";
import DevConfiguracoes from "./pages/dev/DevConfiguracoes";
import DevDocumentacao from "./pages/dev/DevDocumentacao";
import DevAPI from "./pages/dev/DevAPI";
import DevPermissoes from "./pages/dev/DevPermissoes";
import DevProcessos from "./pages/dev/DevProcessos";
import DevFerramentas from "./pages/dev/DevFerramentas";

// NOVAS PÁGINAS - GESTÃO AVANÇADA
import AdminEstoque from "./pages/admin/AdminEstoque";
import AdminCompras from "./pages/admin/AdminCompras";
import AdminVendas from "./pages/admin/AdminVendas";
import AdminComissoes from "./pages/admin/AdminComissoes";
import AdminFluxoCaixa from "./pages/admin/AdminFluxoCaixa";
import AdminDespesas from "./pages/admin/AdminDespesas";
import AdminContasPagar from "./pages/admin/AdminContasPagar";
import AdminContasReceber from "./pages/admin/AdminContasReceber";
import AdminNFe from "./pages/admin/AdminNFe";

// NOVAS PÁGINAS - ANALYTICS & FEEDBACK
import AnalyticsROI from "./pages/analytics/AnalyticsROI";
import AnalyticsLTV from "./pages/analytics/AnalyticsLTV";
import AnalyticsChurn from "./pages/analytics/AnalyticsChurn";
import AnalyticsNPS from "./pages/analytics/AnalyticsNPS";
import AdminAvaliacoes from "./pages/admin/AdminAvaliacoes";
import AdminReclamacoes from "./pages/admin/AdminReclamacoes";
import AdminSugestoes from "./pages/admin/AdminSugestoes";

// NOVAS PÁGINAS - PROCESSOS & EXTRAS
import AdminChecklists from "./pages/admin/AdminChecklists";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAjuda from "./pages/admin/AdminAjuda";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/staff-login",
    Component: StaffLogin,
  },
  {
    path: "/dev-login",
    Component: DevLogin,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  // Dev Routes
  {
    path: "/dev-dashboard",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevDashboard,
      },
    ],
  },
  {
    path: "/dev-tables",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevTables,
      },
    ],
  },
  {
    path: "/dev-users",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevUsers,
      },
    ],
  },
  {
    path: "/dev-database",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevDatabase,
      },
    ],
  },
  {
    path: "/dev-ia-portal",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevIAPortal,
      },
    ],
  },
  {
    path: "/dev-perfil-ia",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevPerfilIA,
      },
    ],
  },
  // Admin Routes (Dashboard Operacional)
  {
    path: "/dashboard",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
    ],
  },
  {
    path: "/patio",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: PatioKanban,
      },
    ],
  },
  {
    path: "/agendamentos",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminAgendamentos,
      },
    ],
  },
  {
    path: "/clientes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminClientes,
      },
    ],
  },
  {
    path: "/clientes/:id",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminClienteDetalhe,
      },
    ],
  },
  {
    path: "/ordens-servico",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminOrdensServico,
      },
    ],
  },
  {
    path: "/ordens-servico/:id",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminOSDetalhes,
      },
    ],
  },
  {
    path: "/ordens-servico/nova",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminNovaOS,
      },
    ],
  },
  {
    path: "/configuracoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminConfiguracoes,
      },
    ],
  },
  {
    path: "/relatorios",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminRelatorios,
      },
    ],
  },
  {
    path: "/pendencias",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminPendencias,
      },
    ],
  },
  {
    path: "/operacional",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminOperacional,
      },
    ],
  },
  {
    path: "/agenda-mecanicos",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminAgendaMecanicos,
      },
    ],
  },
  {
    path: "/usuarios",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminUsuarios,
      },
    ],
  },
  {
    path: "/mecanico/:id",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: MecanicoView,
      },
    ],
  },
  {
    path: "/financeiro",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminFinanceiro,
      },
    ],
  },
  {
    path: "/produtividade",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminProdutividade,
      },
    ],
  },
  {
    path: "/ia-qg",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminIaQG,
      },
    ],
  },
  {
    path: "/gestao/os-ultimate",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: GestaoOsUltimate,
      },
    ],
  },
  {
    path: "/gestao/visao-geral",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: GestaoVisaoGeral,
      },
    ],
  },
  {
    path: "/gestao/metas",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: GestaoMetas,
      },
    ],
  },
  {
    path: "/gestao/melhorias",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: GestaoMelhorias,
      },
    ],
  },
  {
    path: "/visao-geral",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: VisaoGeral,
      },
    ],
  },
  {
    path: "/admin/integracoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminIntegracoes,
      },
    ],
  },
  {
    path: "/admin/trello-migracao",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminTrelloMigracao,
      },
    ],
  },
  {
    path: "/gestao/fornecedores",
    Component: ProtectedRoute,
    children: [{ index: true, Component: GestaoFornecedores }],
  },
  {
    path: "/gestao",
    Component: ProtectedRoute,
    children: [{ index: true, Component: GestaoDashboards }],
  },
  {
    path: "/gestao/rh",
    Component: ProtectedRoute,
    children: [{ index: true, Component: GestaoRH }],
  },
  {
    path: "/gestao/operacoes",
    Component: ProtectedRoute,
    children: [{ index: true, Component: GestaoOperacoes }],
  },
  {
    path: "/gestao/financeiro",
    Component: ProtectedRoute,
    children: [{ index: true, Component: GestaoFinanceiro }],
  },
  {
    path: "/gestao/comercial",
    Component: ProtectedRoute,
    children: [{ index: true, Component: GestaoComercial }],
  },
  {
    path: "/gestao/tecnologia",
    Component: ProtectedRoute,
    children: [{ index: true, Component: GestaoTecnologia }],
  },
  {
    path: "/gestao/veiculos-orfaos",
    Component: ProtectedRoute,
    children: [{ index: true, Component: GestaoVeiculosOrfaos }],
  },
  {
    path: "/analytics/funil",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AnalyticsFunil,
      },
    ],
  },
  // NOVAS ROTAS - GESTÃO AVANÇADA
  {
    path: "/estoque",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminEstoque,
      },
    ],
  },
  {
    path: "/compras",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminCompras,
      },
    ],
  },
  {
    path: "/vendas",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminVendas,
      },
    ],
  },
  {
    path: "/comissoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminComissoes,
      },
    ],
  },
  {
    path: "/fluxo-caixa",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminFluxoCaixa,
      },
    ],
  },
  {
    path: "/despesas",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminDespesas,
      },
    ],
  },
  {
    path: "/contas-pagar",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminContasPagar,
      },
    ],
  },
  {
    path: "/contas-receber",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminContasReceber,
      },
    ],
  },
  {
    path: "/nfe",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminNFe,
      },
    ],
  },
  // NOVAS ROTAS - ANALYTICS & FEEDBACK
  {
    path: "/analytics/roi",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AnalyticsROI,
      },
    ],
  },
  {
    path: "/analytics/ltv",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AnalyticsLTV,
      },
    ],
  },
  {
    path: "/analytics/churn",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AnalyticsChurn,
      },
    ],
  },
  {
    path: "/analytics/nps",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AnalyticsNPS,
      },
    ],
  },
  {
    path: "/avaliacoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminAvaliacoes,
      },
    ],
  },
  {
    path: "/reclamacoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminReclamacoes,
      },
    ],
  },
  {
    path: "/sugestoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminSugestoes,
      },
    ],
  },
  // NOVAS ROTAS - PROCESSOS & EXTRAS
  {
    path: "/checklists",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminChecklists,
      },
    ],
  },
  {
    path: "/notificacoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminNotifications,
      },
    ],
  },
  {
    path: "/ajuda",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: AdminAjuda,
      },
    ],
  },
  // NOVAS ROTAS - DEV
  {
    path: "/dev-logs",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevLogs,
      },
    ],
  },
  {
    path: "/dev-configuracoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevConfiguracoes,
      },
    ],
  },
  {
    path: "/dev-documentacao",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevDocumentacao,
      },
    ],
  },
  {
    path: "/dev-api",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevAPI,
      },
    ],
  },
  {
    path: "/dev-permissoes",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevPermissoes,
      },
    ],
  },
  {
    path: "/dev-processos",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevProcessos,
      },
    ],
  },
  {
    path: "/dev-ferramentas",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: DevFerramentas,
      },
    ],
  },
  {
    path: "*",
    loader: () => redirect("/"),
  },
]);
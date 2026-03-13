import { createBrowserRouter, redirect } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DevLogin from "./pages/DevLogin";
import ForgotPassword from "./pages/ForgotPassword";
import DevDashboard from "./pages/DevDashboard";
import DevTables from "./pages/DevTables";
import DevUsers from "./pages/DevUsers";
import DevDatabase from "./pages/DevDatabase";
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
    path: "*",
    loader: () => redirect("/"),
  },
]);
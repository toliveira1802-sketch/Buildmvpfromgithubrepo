import { lazy } from "react";
import { RouteObject } from "react-router";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ExecutiveLayout from "./components/ExecutiveLayout";

// Lazy-loaded pages — each becomes its own chunk
const GestaoVisaoGeral = lazy(() => import("./pages/GestaoVisaoGeral"));
const AdminIaQG = lazy(() => import("./pages/AdminIaQG"));
const AdminFinanceiro = lazy(() => import("./pages/AdminFinanceiro"));
const AdminRelatorios = lazy(() => import("./pages/AdminRelatorios"));
const AdminProdutividade = lazy(() => import("./pages/AdminProdutividade"));

const AnalyticsROI = lazy(() => import("./pages/AnalyticsROI"));
const AnalyticsFunil = lazy(() => import("./pages/AnalyticsFunil"));
const AnalyticsChurn = lazy(() => import("./pages/AnalyticsChurn"));
const AnalyticsLTV = lazy(() => import("./pages/AnalyticsLTV"));
const AnalyticsNPS = lazy(() => import("./pages/AnalyticsNPS"));

const GestaoDashboards = lazy(() => import("./pages/GestaoDashboards"));
const GestaoMetas = lazy(() => import("./pages/GestaoMetas"));
const GestaoMelhorias = lazy(() => import("./pages/GestaoMelhorias"));

/**
 * Rotas do Portal Executivo (The Command Center)
 * Protegido por ProtectedRoute -> ExecutiveLayout -> Pages (lazy)
 * Acesso: Dev(1), Gestao(2), Gestao+(5)
 */
export const executiveRoutes: RouteObject = {
  path: "executive",
  Component: ProtectedRoute,
  children: [
    {
      Component: ExecutiveLayout,
      children: [
        // Command Center
        { index: true, Component: GestaoVisaoGeral },
        { path: "ia-qg", Component: AdminIaQG },
        { path: "financeiro", Component: AdminFinanceiro },
        { path: "relatorios", Component: AdminRelatorios },
        { path: "produtividade", Component: AdminProdutividade },

        // Analytics Engine
        { path: "analytics-roi", Component: AnalyticsROI },
        { path: "analytics-funil", Component: AnalyticsFunil },
        { path: "analytics-churn", Component: AnalyticsChurn },
        { path: "analytics-ltv", Component: AnalyticsLTV },
        { path: "analytics-nps", Component: AnalyticsNPS },

        // Strategic Management
        { path: "dashboards", Component: GestaoDashboards },
        { path: "metas", Component: GestaoMetas },
        { path: "melhorias", Component: GestaoMelhorias },
      ],
    },
  ],
};

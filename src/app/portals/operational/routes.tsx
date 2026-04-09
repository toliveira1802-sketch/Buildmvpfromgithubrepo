import { lazy } from "react";
import { RouteObject } from "react-router";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import OperationalLayout from "./components/OperationalLayout";

// Lazy-loaded pages — each becomes its own chunk
const ConsultantDashboard = lazy(() => import("./pages/ConsultantDashboard"));
const OperationalTrinityHub = lazy(() => import("./pages/OperationalTrinityHub"));
const FastCheckIn = lazy(() => import("./pages/FastCheckIn"));
const ClientList = lazy(() => import("./pages/ClientList"));
const VehicleList = lazy(() => import("./pages/VehicleList"));
const OSList = lazy(() => import("./pages/OSList"));

/**
 * Rotas do Portal Operacional (Consultant Hub)
 * Protegido por ProtectedRoute -> OperationalLayout -> Pages (lazy)
 * Acesso: Dev(1), Gestao(2), Consultor(3), Gestao+(5)
 */
export const operationalRoutes: RouteObject = {
  path: "/operational",
  Component: ProtectedRoute,
  children: [
    {
      Component: OperationalLayout,
      children: [
        { index: true, Component: ConsultantDashboard },
        { path: "hub", Component: OperationalTrinityHub },
        { path: "fast-checkin", Component: FastCheckIn },
        { path: "clients", Component: ClientList },
        { path: "vehicles", Component: VehicleList },
        { path: "os", Component: OSList },
      ],
    },
  ],
};

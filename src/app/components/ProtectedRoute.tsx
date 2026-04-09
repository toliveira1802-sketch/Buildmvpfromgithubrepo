import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";

interface DapUser {
  id: number;
  nome: string;
  cargo: string;
  nivelAcessoId: number;
  role?: string;
}

/** Maps route prefixes to the minimum access levels allowed */
const ROUTE_ACCESS: Record<string, number[]> = {
  "/dev-":      [1],           // Dev only
  "/executive": [1, 2, 5],    // Dev, Gestão, Gestão+ (C-Level Portal)
  "/gestao":    [1, 2, 5],    // Dev, Gestão, Gestão+
  "/analytics": [1, 2, 5],    // Dev, Gestão, Gestão+
  "/mecanico":  [1, 4],       // Dev, Mecânico
};

/** Default: Admin routes accessible by Dev(1), Gestão(2), Consultor(3), Gestão+(5) */
const DEFAULT_ALLOWED_LEVELS = [1, 2, 3, 5];

function getAllowedLevels(pathname: string): number[] {
  for (const [prefix, levels] of Object.entries(ROUTE_ACCESS)) {
    if (pathname.startsWith(prefix)) return levels;
  }
  return DEFAULT_ALLOWED_LEVELS;
}

// TODO: REMOVER — Demo mode bypass para teste de UI
const DEMO_BYPASS = true;

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (DEMO_BYPASS) {
      const fakeUser = { id: 0, nome: "Thales", cargo: "Gestão", nivelAcessoId: 2, role: "gestao" };
      if (!localStorage.getItem("dap-user")) localStorage.setItem("dap-user", JSON.stringify(fakeUser));
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    const raw = localStorage.getItem("dap-user") || sessionStorage.getItem("dap-user");

    if (!raw && !location.pathname.startsWith("/operational")) {
      const loginRoute = location.pathname.startsWith("/dev-") ? "/dev-login" : "/";
      navigate(loginRoute, { replace: true });
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    if (!raw && location.pathname.startsWith("/operational")) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    let user: DapUser;
    try {
      user = JSON.parse(raw);
    } catch {
      localStorage.removeItem("dap-user");
      sessionStorage.removeItem("dap-user");
      navigate("/", { replace: true });
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    const allowed = getAllowedLevels(location.pathname);
    if (!allowed.includes(user.nivelAcessoId)) {
      navigate("/", { replace: true });
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}

import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('🔒 ProtectedRoute: Verificando autenticação...');
    console.log('📍 Rota atual:', location.pathname);
    
    // Verifica AMBOS localStorage E sessionStorage
    const userLocalStorage = localStorage.getItem("dap-user");
    const userSessionStorage = sessionStorage.getItem("dap-user");
    const user = userLocalStorage || userSessionStorage;
    
    const tokenLocalStorage = localStorage.getItem("dap-token");
    const tokenSessionStorage = sessionStorage.getItem("dap-token");
    const token = tokenLocalStorage || tokenSessionStorage;
    
    console.log('👤 Usuário no localStorage:', userLocalStorage ? 'SIM' : 'NÃO');
    console.log('👤 Usuário no sessionStorage:', userSessionStorage ? 'SIM' : 'NÃO');
    console.log('🔑 Token encontrado:', token ? 'SIM' : 'NÃO');
    
    if (!user) {
      console.log('❌ Nenhum usuário encontrado! Redirecionando...');
      
      // Se não há usuário, redireciona para landing ou login dependendo da rota
      if (location.pathname.startsWith("/dev-")) {
        console.log('🔄 Redirecionando para /dev-login');
        navigate("/dev-login", { replace: true });
      } else {
        console.log('🔄 Redirecionando para /');
        navigate("/", { replace: true });
      }
      setIsAuthenticated(false);
      setIsLoading(false);
    } else {
      console.log('✅ Usuário autenticado!');
      console.log('📄 Dados:', JSON.parse(user));
      setIsAuthenticated(true);
      setIsLoading(false);
    }
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
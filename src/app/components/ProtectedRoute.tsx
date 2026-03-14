import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("dap-user");
    
    if (!user) {
      // Se não há usuário, redireciona para dev-login ou landing dependendo da rota
      if (location.pathname.startsWith("/dev-")) {
        navigate("/dev-login");
      } else {
        navigate("/");
      }
    } else {
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

  return <Outlet />;
}
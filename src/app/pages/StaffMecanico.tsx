import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function StaffMecanico() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está autenticado como Mecânico
    const userDataString = localStorage.getItem("dap-user") || sessionStorage.getItem("dap-user");
    
    if (!userDataString) {
      toast.error("Acesso negado. Faça login primeiro.");
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userDataString);
      
      // Verifica se o role é "mecanico" (case-insensitive)
      if (userData.role?.toLowerCase() !== "mecanico") {
        toast.error("Acesso negado. Este perfil não tem permissão para acessar esta área.");
        navigate("/login");
        return;
      }

      // Redirecionar para dashboard do mecânico
      toast.success(`Bem-vindo(a), ${userData.name || userData.firstName}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Erro ao validar autenticação.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Carregando...</div>
    </div>
  );
}

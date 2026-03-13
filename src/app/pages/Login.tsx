import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, UserCircle2, Users, Wrench } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Login - Doctor Auto";
  }, []);

  const roles = [
    { 
      id: "gestao", 
      label: "GESTAO", 
      icon: UserCircle2, 
      color: "from-purple-500 to-pink-500",
      description: "Administração e relatórios"
    },
    { 
      id: "consultores", 
      label: "CONSULTORES", 
      icon: Users, 
      color: "from-blue-500 to-cyan-500",
      description: "Atendimento e vendas"
    },
    { 
      id: "mecanico", 
      label: "MECANICO", 
      icon: Wrench, 
      color: "from-orange-500 to-red-500",
      description: "Execução de serviços"
    },
  ];

  const handleLogin = (roleId: string) => {
    setSelectedRole(roleId);
    
    // Simula autenticação
    setTimeout(() => {
      localStorage.setItem("dap-user", JSON.stringify({ role: roleId }));
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Acessar Sistema
          </h1>
          <p className="text-zinc-400 text-lg">
            Selecione seu perfil para continuar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isSelected ? 'ring-2 ring-primary scale-105' : ''
                }`}
                onClick={() => handleLogin(role.id)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                    <Icon className="size-8 text-white" />
                  </div>
                  <CardTitle>{role.label}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                  >
                    {isSelected ? "Entrando..." : "Acessar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Doctor Auto • Sistema de Gestão Automotiva
        </p>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, UserCircle2, Users, Wrench, User, Lock } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Login - Doctor Auto";
  }, []);

  const roles = [
    { 
      id: "Gestao", 
      label: "GESTÃO", 
      icon: UserCircle2, 
      color: "from-purple-500 to-pink-500",
      description: "Administração e relatórios",
      route: "/staff-gestao"
    },
    { 
      id: "Consultor", 
      label: "CONSULTOR", 
      icon: Users, 
      color: "from-blue-500 to-cyan-500",
      description: "Atendimento e vendas",
      route: "/staff-consultor"
    },
    { 
      id: "Mecanico", 
      label: "MECÂNICO", 
      icon: Wrench, 
      color: "from-orange-500 to-red-500",
      description: "Execução de serviços",
      route: "/staff-mecanico"
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error("Selecione um perfil primeiro");
      return;
    }

    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      // Valida formato: Role_PrimeiroNome
      if (!username.includes("_")) {
        toast.error(`Nome inválido. Use o formato: ${selectedRole}_seu_nome`);
        setIsLoading(false);
        return;
      }

      const [role, firstName] = username.split("_");

      // Verifica se a role bate com o perfil selecionado
      if (role.toLowerCase() !== selectedRole.toLowerCase()) {
        toast.error(`Perfil selecionado (${selectedRole}) não corresponde ao nome (${role})`);
        setIsLoading(false);
        return;
      }

      // Chama o backend para autenticar
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0092e077/auth/login-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          username: username,
          password: password,
          role: selectedRole.toLowerCase()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(data.error || 'Erro ao fazer login');
      }

      const selectedRoleData = roles.find(r => r.id === selectedRole);
      
      const userData = { 
        username: username,
        role: selectedRole.toLowerCase(),
        firstName: firstName,
        name: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        loginType: "staff",
        cargo: selectedRoleData?.label || selectedRole,
        userId: data.userId
      };

      // Salva no localStorage (ou sessionStorage se não marcar "lembrar de mim")
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("dap-user", JSON.stringify(userData));
      if (data.sessionToken) {
        storage.setItem("dap-token", data.sessionToken);
      }

      setIsLoading(false);
      toast.success(`Bem-vindo(a), ${userData.name}!`);
      
      // Pequeno delay para garantir que o toast seja mostrado antes de navegar
      setTimeout(() => {
        navigate(selectedRoleData?.route || "/dashboard");
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Erro ao fazer login');
      setIsLoading(false);
    }
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

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <img 
              src="figma:asset/c84924fffe8eefdfa83c8a6fa6d7ef2e7b310b86.png" 
              alt="Doctor Auto Logo" 
              className="w-20 h-20"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Acessar Sistema
          </h1>
          <p className="text-zinc-400 text-lg">
            Selecione seu perfil e faça login
          </p>
        </div>

        {/* Seleção de Perfil */}
        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              
              return (
                <Card 
                  key={role.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedRole(role.id)}
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
                      variant="outline"
                      className="w-full"
                    >
                      Selecionar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // Formulário de Login
          <div className="max-w-md mx-auto">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="space-y-4 pb-6">
                {(() => {
                  const selectedRoleData = roles.find(r => r.id === selectedRole);
                  const Icon = selectedRoleData?.icon || UserCircle2;
                  return (
                    <>
                      <div className={`mx-auto w-16 h-16 rounded-xl bg-gradient-to-br ${selectedRoleData?.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center">
                        <CardTitle className="text-2xl text-white">
                          {selectedRoleData?.label}
                        </CardTitle>
                        <CardDescription className="text-zinc-400 mt-2">
                          {selectedRoleData?.description}
                        </CardDescription>
                      </div>
                    </>
                  );
                })()}
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-zinc-200">
                      Nome
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                      <Input
                        id="username"
                        type="text"
                        placeholder={`${selectedRole}_thales`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-zinc-500">
                      Formato: {selectedRole}_seu_nome
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-200">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  {/* Lembrar de mim */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-zinc-300 cursor-pointer"
                    >
                      Lembrar de mim
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Autenticando..." : "Entrar"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-zinc-400 hover:text-white"
                    onClick={() => {
                      setSelectedRole(null);
                      setUsername("");
                      setPassword("");
                    }}
                  >
                    Trocar perfil
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <p className="text-center text-sm text-zinc-500 mt-8">
          Doctor Auto • Sistema de Gestão Automotiva
        </p>
      </div>
    </div>
  );
}
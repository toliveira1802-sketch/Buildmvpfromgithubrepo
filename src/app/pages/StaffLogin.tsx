import { useState } from "react";
import { useNavigate } from "react-router";
import { Wrench, LogIn, ArrowLeft, Eye, EyeOff, UserCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

export default function StaffLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perfil, setPerfil] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Usuários mockados - DADOS REMOVIDOS - CONECTAR AO BACKEND REAL
  const mockUsers: Array<{
    email: string;
    password: string;
    perfil: string;
    nome: string;
    avatar: string;
  }> = [];

  const handleLogin = () => {
    setIsLoading(true);

    // Validações
    if (!email || !password) {
      toast.error("Preencha email e senha!");
      setIsLoading(false);
      return;
    }

    if (!perfil) {
      toast.error("Selecione seu perfil!");
      setIsLoading(false);
      return;
    }

    // Simular delay de autenticação
    setTimeout(() => {
      // Buscar usuário
      const user = mockUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          u.perfil === perfil
      );

      if (user) {
        // Salvar no localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", user.perfil);
        localStorage.setItem("userName", user.nome);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userAvatar", user.avatar);

        toast.success(`Bem-vindo(a), ${user.nome}!`);

        // Redirecionar baseado no perfil
        switch (user.perfil) {
          case "Gestão":
            navigate("/gestao/visao-geral");
            break;
          case "Mecânico":
            navigate("/patio");
            break;
          case "Consultor":
            navigate("/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        toast.error("Email, senha ou perfil incorretos!");
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Wrench className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Doctor Auto</h1>
          <p className="text-zinc-400">Login de Colaboradores</p>
        </div>

        {/* Card de Login */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Acesso Staff</CardTitle>
            <CardDescription>Entre com suas credenciais profissionais</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Perfil */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Perfil</Label>
              <Select value={perfil} onValueChange={setPerfil}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Gestão" className="text-white hover:bg-zinc-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      Gestão
                    </div>
                  </SelectItem>
                  <SelectItem value="Consultor" className="text-white hover:bg-zinc-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Consultor
                    </div>
                  </SelectItem>
                  <SelectItem value="Mecânico" className="text-white hover:bg-zinc-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Mecânico
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Email</Label>
              <Input
                type="email"
                placeholder="seu.email@doctorautao.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Senha</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Esqueci a senha */}
            <div className="text-right">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Botão de Login */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-400">ou</span>
              </div>
            </div>

            {/* Botão Login Simples */}
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Login Simplificado
            </Button>
          </CardContent>
        </Card>

        {/* Aviso - Backend não configurado */}
        <Card className="mt-4 bg-red-900/20 border-red-800/50">
          <CardContent className="pt-4">
            <p className="text-xs text-red-400 mb-2 font-semibold">⚠️ Backend não configurado</p>
            <div className="space-y-1 text-xs text-red-300/70">
              <p>O sistema de autenticação precisa ser integrado ao backend.</p>
              <p>Configure a API de autenticação para habilitar o login.</p>
            </div>
          </CardContent>
        </Card>

        {/* Botão Voltar */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para início
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-500">
          <p>Doctor Auto © 2026 - Sistema de Gestão de Oficina</p>
          <p className="mt-1">Acesso restrito a colaboradores autorizados</p>
        </div>
      </div>
    </div>
  );
}
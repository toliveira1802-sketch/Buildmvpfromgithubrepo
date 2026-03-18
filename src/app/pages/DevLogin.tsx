import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Code, Lock, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function DevLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Dev Login - Doctor Auto";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      // Valida formato: Dev_PrimeiroNome
      if (!username.includes("_")) {
        toast.error("Nome inválido. Use o formato: Dev_seu_nome");
        setIsLoading(false);
        return;
      }

      const [role, firstName] = username.split("_");

      // Verifica se o formato é correto: Dev_PrimeiroNome
      if (role.toLowerCase() !== "dev") {
        toast.error("Nome inválido. Use o formato: Dev_seu_nome");
        setIsLoading(false);
        return;
      }

      console.log('🔐 Tentando autenticar:', username);

      // Chama o backend para autenticar
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0092e077/auth/login-dev`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();
      console.log('📡 Resposta do backend:', { status: response.status, data });

      if (!response.ok) {
        console.error('❌ Login falhou:', data.error);
        setIsLoading(false);
        throw new Error(data.error || 'Erro ao fazer login');
      }

      console.log('✅ Login bem-sucedido!');

      const userData = {
        name: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        username: username,
        role: "dev",
        firstName: firstName,
        permissions: ["full-access", "database", "settings", "users"],
        userId: data.userId
      };

      // Salva no localStorage (ou sessionStorage se não marcar "lembrar de mim")
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("dap-user", JSON.stringify(userData));
      if (data.sessionToken) {
        storage.setItem("dap-token", data.sessionToken);
      }

      console.log('💾 Dados salvos no storage:', userData);
      console.log('🔑 Token salvo:', data.sessionToken?.substring(0, 20) + '...');

      toast.success(`Acesso do Desenvolvedor Autorizado - Bem-vindo, ${userData.name}!`);
      
      console.log('🚀 Navegando para /dev-dashboard...');
      
      // Navega IMEDIATAMENTE sem setTimeout
      setIsLoading(false);
      navigate("/dev-dashboard", { replace: true });
      
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      toast.error(error.message || 'Credenciais de desenvolvedor inválidas');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Card de Login */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center">
              <Code className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">
                Acesso do Desenvolvedor
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-2">
                system-oficina
              </CardDescription>
            </div>
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
                    placeholder="Dev_thales"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Formato: Dev_seu_nome
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-200">
                    Senha
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs text-red-600 hover:text-red-500 p-0 h-auto"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
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
                {isLoading ? "Autenticando..." : "Acessar Sistema"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 text-center">
                Área restrita para desenvolvedores e administradores do sistema.
                <br />
                Acesso autorizado apenas com credenciais válidas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
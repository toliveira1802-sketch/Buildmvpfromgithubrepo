import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Code, Lock, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function DevLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Dev Login - Doctor Auto";
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    // Simulação de login do desenvolvedor
    setTimeout(() => {
      if (email.includes("dev") || email.includes("admin")) {
        localStorage.setItem("dap-user", JSON.stringify({
          name: "Desenvolvedor",
          email: email,
          role: "dev",
          permissions: ["full-access", "database", "settings", "users"]
        }));
        toast.success("Acesso do Desenvolvedor Autorizado");
        navigate("/dev-dashboard");
      } else {
        toast.error("Credenciais de desenvolvedor inválidas");
        setIsLoading(false);
      }
    }, 1000);
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
                <Label htmlFor="email" className="text-zinc-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="dev@doctorauto.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
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
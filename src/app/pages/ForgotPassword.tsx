import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { User, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"username" | "token" | "success">("username");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Recuperar Senha - Doctor Auto";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      toast.error("Digite seu nome de usuário");
      return;
    }

    if (!username.includes("_")) {
      toast.error("Digite um nome válido (Ex: Dev_thales)");
      return;
    }

    setIsLoading(true);

    try {
      // Chama o backend para gerar token
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0092e077/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ username })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao solicitar recuperação');
      }

      setIsLoading(false);
      setStep("token");
      toast.success(`Token enviado! Verifique o console.`);
      
      // Mostra o token no console para desenvolvimento
      console.log("==== TOKEN DE RECUPERAÇÃO ====");
      console.log("Usuário:", username);
      console.log("Token:", data.token);
      console.log("Válido até:", new Date(data.expiresAt).toLocaleString("pt-BR"));
      console.log("==============================");
      
      toast.info(`Token: ${data.token}`, { duration: 10000 });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'Erro ao solicitar recuperação');
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Digite o token");
      return;
    }

    setIsLoading(true);

    try {
      // Verifica o token com o backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0092e077/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ username, token })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token inválido ou expirado');
      }

      setIsLoading(false);
      setStep("success");
      toast.success("Token verificado com sucesso!");
    } catch (error: any) {
      console.error('Token verification error:', error);
      toast.error(error.message || 'Token inválido ou expirado');
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            onClick={() => navigate("/dev-login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="space-y-4 text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-950 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">
                  Token Verificado!
                </CardTitle>
                <CardDescription className="text-zinc-400 mt-2">
                  Você pode redefinir sua senha
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-2">
                <p className="text-sm text-zinc-300">
                  Token verificado para:
                </p>
                <p className="text-base text-white font-semibold">
                  {username}
                </p>
              </div>

              <div className="space-y-3 text-sm text-zinc-400">
                <p>O token é válido por 2 horas.</p>
                <p>Em breve você poderá redefinir sua senha.</p>
              </div>

              <Button
                variant="outline"
                className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                onClick={() => {
                  setStep("username");
                  setUsername("");
                  setToken("");
                }}
              >
                Solicitar novo token
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "token") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            onClick={() => navigate("/dev-login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="space-y-4 text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">
                  Verificar Token
                </CardTitle>
                <CardDescription className="text-zinc-400 mt-2">
                  Insira o token gerado
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleTokenSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-zinc-200">
                    Token
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                    <Input
                      id="token"
                      type="text"
                      placeholder="Digite o token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Verificando..." : "Verificar Token"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 text-center">
                  O token de recuperação é válido por 2 horas.
                  <br />
                  Verifique o console do navegador.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white"
          onClick={() => navigate("/dev-login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao login
        </Button>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">
                Recuperar Senha
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-2">
                Gere um token de recuperação
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-200">
                  Nome de usuário
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
                    autoFocus
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Formato: Role_nome (Ex: Dev_thales)
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Gerando..." : "Gerar Token"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 text-center">
                O token de recuperação será gerado e mostrado no console.
                <br />
                Válido por 2 horas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

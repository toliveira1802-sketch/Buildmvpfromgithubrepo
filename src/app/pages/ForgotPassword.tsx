import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Mail, ArrowLeft, Check, KeyRound } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "token" | "success">("email");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Recuperar Senha - Doctor Auto";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Digite seu email");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Digite um email válido");
      return;
    }

    setIsLoading(true);

    // Simulação de envio de email
    setTimeout(() => {
      setIsLoading(false);
      setStep("token");
      toast.success("Token enviado para seu email!");
    }, 1500);
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Digite o token");
      return;
    }

    setIsLoading(true);

    // Simulação de verificação de token
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      toast.success("Token verificado com sucesso!");
    }, 1500);
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
                  Email Enviado!
                </CardTitle>
                <CardDescription className="text-zinc-400 mt-2">
                  Verifique sua caixa de entrada
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-2">
                <p className="text-sm text-zinc-300">
                  Enviamos um token de recuperação para:
                </p>
                <p className="text-base text-white font-semibold">
                  {email}
                </p>
              </div>

              <div className="space-y-3 text-sm text-zinc-400">
                <p>O token é válido por 30 minutos.</p>
                <p>Não recebeu o email? Verifique sua pasta de spam ou lixo eletrônico.</p>
              </div>

              <Button
                variant="outline"
                className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
              >
                Enviar novamente
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
                  Insira o token recebido em seu email
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
                      placeholder="token"
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
                  O token de recuperação será enviado para o email cadastrado.
                  <br />
                  Válido por 30 minutos.
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
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">
                Recuperar Senha
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-2">
                Enviaremos um token para seu email
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-200">
                  Email cadastrado
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? "Enviando..." : "Enviar Token"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 text-center">
                O token de recuperação será enviado para o email cadastrado.
                <br />
                Válido por 30 minutos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
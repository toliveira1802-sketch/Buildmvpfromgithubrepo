import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from '../shared/ui/button';
import { Input } from '../shared/ui/input';
import { Label } from '../shared/ui/label';
import { Checkbox } from '../shared/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../shared/ui/card';
import { Code, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
export default function DevLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => { document.title = "Dev Login - Doctor Auto"; }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { toast.error("Preencha todos os campos"); return; }
    if (!username.toLowerCase().startsWith("dev_")) { toast.error("Formato inválido. Use: Dev_seu_nome"); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("verify_staff_login", { p_username: username, p_password: password });
      if (error) throw error;
      const user = data?.[0];
      if (!user || !user.ok) { toast.error("Usuário ou senha incorretos"); return; }
      if (!user.ativo) { toast.error("Usuário inativo"); return; }
      if (user.nivelAcessoId !== 1) { toast.error("Acesso negado — não é Dev"); return; }
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("dap-user", JSON.stringify({ id: user.id, nome: user.nome, cargo: user.cargo, username: user.username, nivelAcessoId: user.nivelAcessoId, primeiroAcesso: user.primeiroAcesso, role: "dev", permissions: ["full-access","database","settings","users"] }));
      toast.success(`Bem-vindo(a), ${user.nome}!`);
      navigate("/dev-dashboard", { replace: true });
    } catch (err: any) { toast.error("Erro: " + err.message); }
    finally { setIsLoading(false); }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => navigate("/")}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center"><Code className="w-8 h-8 text-red-600" /></div>
            <div>
              <CardTitle className="text-2xl text-white">Acesso do Desenvolvedor</CardTitle>
              <CardDescription className="text-zinc-400 mt-2">system-oficina · nivelAcessoId: 1</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-200">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                  <Input type="text" placeholder="Dev_thales" value={username} onChange={e => setUsername(e.target.value)} autoFocus className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>
                <p className="text-xs text-zinc-500">Formato: <code className="text-zinc-400">Dev_seu_nome</code></p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-200">Senha</Label>
                  <Button type="button" variant="link" className="text-xs text-red-600 hover:text-red-500 p-0 h-auto" onClick={() => navigate("/forgot-password")}>Esqueceu a senha?</Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={c => setRememberMe(c as boolean)} />
                <label htmlFor="remember" className="text-sm text-zinc-300 cursor-pointer">Lembrar de mim</label>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold">
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Autenticando...</> : "Acessar Sistema"}
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 text-center">Área restrita. Acesso apenas com credenciais válidas.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

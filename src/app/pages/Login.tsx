import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, UserCircle2, Users, Wrench, User, Lock, Terminal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Logo from "../components/Logo";
import { supabase } from "../../lib/supabase";
import { setupUserContext } from "../../lib/supabase-extended";

const ROLES = [
  { id: "Gestao",    label: "GESTÃO",    icon: UserCircle2, color: "from-purple-500 to-pink-500", desc: "Administração e relatórios", route: "/gestao/visao-geral", nivel: 2 },
  { id: "Consultor", label: "CONSULTOR", icon: Users,       color: "from-blue-500 to-cyan-500",   desc: "Atendimento e vendas",       route: "/dashboard",          nivel: 3 },
  { id: "Mecanico",  label: "MECÂNICO",  icon: Wrench,      color: "from-orange-500 to-red-500",  desc: "Execução de serviços",       route: "/patio",              nivel: 4 },
  { id: "Dev",       label: "DEV",       icon: Terminal,    color: "from-zinc-600 to-zinc-500",   desc: "Acesso de desenvolvedor",    route: "/dev-dashboard",      nivel: 1, isDev: true },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { document.title = "Login - Doctor Auto"; }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { toast.error("Selecione um perfil"); return; }
    if (!username || !password) { toast.error("Preencha usuário e senha"); return; }

    setIsLoading(true);
    try {
      // Chama RPC que verifica bcrypt no banco — sem expor hash
      const { data, error } = await supabase.rpc("verify_staff_login", {
        p_username: username,
        p_password: password,
      });

      if (error) throw error;

      const user = data?.[0];

      if (!user || !user.ok) {
        toast.error("Usuário ou senha incorretos"); setIsLoading(false); return;
      }

      if (!user.ativo) {
        toast.error("Usuário inativo — contate o DEV"); setIsLoading(false); return;
      }

      // Verifica se o role selecionado bate com o nivelAcessoId
      const roleData = ROLES.find(r => r.id === selectedRole);
      if (user.nivelAcessoId !== roleData?.nivel) {
        toast.error(`Perfil selecionado não corresponde ao cargo: ${user.cargo}`);
        setIsLoading(false); return;
      }

      // Salva sessão
      const session = {
        id: user.id, nome: user.nome, cargo: user.cargo,
        username: user.username, nivelAcessoId: user.nivelAcessoId,
        primeiroAcesso: user.primeiroAcesso, role: selectedRole.toLowerCase(),
      };
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("dap-user", JSON.stringify(session));

      // Setup oficina context (multi-tenant segmentation)
      const userRole = selectedRole.toLowerCase() as 'colaborador' | 'mecanico' | 'admin';
      await setupUserContext(user.id, userRole);

      toast.success(`Bem-vindo(a), ${user.nome}!`);
      navigate(roleData?.route || "/dashboard", { replace: true });
    } catch (err: any) {
      toast.error("Erro no login: " + err.message);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <Button variant="ghost" className="text-zinc-400 hover:text-white mb-6" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center"><Logo size={80} className="drop-shadow-lg" /></div>
          <h1 className="text-4xl font-bold text-white mb-2">Acessar Sistema</h1>
          <p className="text-zinc-400">Selecione seu perfil e faça login</p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-2 gap-4">
            {ROLES.map(role => {
              const Icon = role.icon;
              return (
                <Card key={role.id} className="cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => { if (role.isDev) { navigate("/dev-login"); return; } setSelectedRole(role.id); }}>
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-3`}>
                      <Icon className="size-7 text-white" />
                    </div>
                    <CardTitle className="text-lg">{role.label}</CardTitle>
                    <CardDescription>{role.desc}</CardDescription>
                  </CardHeader>
                  <CardContent><Button variant="outline" className="w-full">Selecionar</Button></CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="space-y-4 pb-6">
                {(() => {
                  const r = ROLES.find(x => x.id === selectedRole);
                  const Icon = r?.icon || UserCircle2;
                  return (
                    <>
                      <div className={`mx-auto w-16 h-16 rounded-xl bg-gradient-to-br ${r?.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center">
                        <CardTitle className="text-2xl text-white">{r?.label}</CardTitle>
                        <CardDescription className="text-zinc-400 mt-1">{r?.desc}</CardDescription>
                      </div>
                    </>
                  );
                })()}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-200">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                      <Input type="text" placeholder={`${selectedRole}_thales`} value={username}
                        onChange={e => setUsername(e.target.value)} autoFocus
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                    </div>
                    <p className="text-xs text-zinc-500">
                      Ex: <code className="text-zinc-400">Dev_thales</code>, <code className="text-zinc-400">Consultor_maria</code>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-200">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                      <Input type="password" placeholder="••••••••" value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={c => setRememberMe(c as boolean)} />
                    <label htmlFor="remember" className="text-sm text-zinc-300 cursor-pointer">Lembrar de mim</label>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg font-semibold">
                    {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Autenticando...</> : "Entrar"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full text-zinc-400 hover:text-white"
                    onClick={() => { setSelectedRole(null); setUsername(""); setPassword(""); }}>
                    Trocar perfil
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        <p className="text-center text-sm text-zinc-500 mt-8">Doctor Auto • Sistema de Gestão Automotiva</p>
      </div>
    </div>
  );
}

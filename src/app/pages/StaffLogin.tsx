import { useState } from "react";
import { useNavigate } from "react-router";
import { Wrench, LogIn, ArrowLeft, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from '../shared/ui/button';
import { Input } from '../shared/ui/input';
import { Label } from '../shared/ui/label';
import { toast } from "sonner";
import { supabase as sb } from "../../lib/supabase";

export default function StaffLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { toast.error("Preencha usuário e senha"); return; }
    setLoading(true);
    try {
      // Busca em 01_colaboradores (nova tabela) com join em 00_companies
      const { data: colab, error } = await sb
        .from("colaboradores")
        .select("id, nome, cargo, nivel_acesso, empresa_id, username, senha_hash, primeiro_acesso, 00_companies(id, nome, slug, cor_primaria)")
        .eq("username", username)
        .eq("is_active", true)
        .single();

      // Fallback: busca em 10_users legado
      let user: any = colab;
      if (error || !colab) {
        const { data: legacy } = await sb
          .from("app_users")
          .select("id, nome, cargo, nivelAcessoId, empresaId, username, senha, primeiroAcesso")
          .or(`username.eq.${username},email.eq.${username}`)
          .eq("ativo", true)
          .single();
        if (!legacy) { toast.error("Usuário não encontrado"); return; }
        if (legacy.senha !== password) { toast.error("Senha incorreta"); return; }
        user = { ...legacy, nivel_acesso: legacy.nivelAcessoId, empresa_id: legacy.empresaId, senha_hash: legacy.senha };
      } else {
        if (colab.senha_hash !== password) { toast.error("Senha incorreta"); return; }
      }

      // Buscar empresa se não veio no join
      let empresa: any = (user as any)["companies"] || null;
      if (!empresa && user.empresa_id) {
        const { data: emp } = await sb.from("companies").select("id, nome, slug, cor_primaria").eq("id", user.empresa_id).single();
        empresa = emp;
      }

      const session = {
        id: user.id,
        nome: user.nome,
        cargo: user.cargo,
        nivelAcessoId: user.nivel_acesso ?? user.nivelAcessoId,
        empresa_id: empresa?.id ?? user.empresa_id ?? null,
        empresa_nome: empresa?.nome ?? "Doctor Auto",
        empresa_slug: empresa?.slug ?? "doctor-auto",
        empresa_cor: empresa?.cor_primaria ?? "#dc2626",
      };

      const storage = document.querySelector<HTMLInputElement>('[data-remember]')?.checked
        ? localStorage : sessionStorage;
      localStorage.setItem("dap-user", JSON.stringify(session));
      localStorage.setItem("dap-token", `token-${user.id}`);

      toast.success(`Bem-vindo, ${user.nome}!`);

      const nivel = session.nivelAcessoId;
      if (nivel === 1) navigate("/dev-dashboard");
      else if (nivel === 3 || nivel === 5) navigate("/gestao/visao-geral");
      else if (nivel === 4) navigate(`/mecanico/${user.id}`);
      else navigate("/dashboard");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao fazer login");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Wrench className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Doctor Auto</h1>
          <p className="text-zinc-500 text-sm">Login de Colaboradores</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <Label className="text-zinc-300 text-sm">Usuário ou E-mail</Label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="seu.usuario"
              className="bg-zinc-800 border-zinc-700 text-white mt-1"
              autoComplete="username"
            />
          </div>
          <div>
            <Label className="text-zinc-300 text-sm">Senha</Label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••"
                className="bg-zinc-800 border-zinc-700 text-white pr-10"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" data-remember className="rounded border-zinc-700 bg-zinc-800" />
            <label htmlFor="remember" className="text-zinc-400 text-sm cursor-pointer">Lembrar de mim</label>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold"
          >
            {loading ? "Entrando..." : <><LogIn className="size-4 mr-2" /> Entrar</>}
          </Button>
        </div>

        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-zinc-500 hover:text-white text-sm mx-auto">
          <ArrowLeft className="size-3.5" /> Voltar
        </button>
      </div>
    </div>
  );
}

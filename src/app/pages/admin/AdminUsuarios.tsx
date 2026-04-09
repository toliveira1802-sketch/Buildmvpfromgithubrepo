import { useState, useEffect } from "react";
import { Users, RefreshCw, Loader2, Shield, Wrench, UserCheck, UserX } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { Card } from '../../shared/ui/card';
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";

const CARGO_COLORS: Record<string,string> = {
  Dev:"bg-purple-700", Gestao:"bg-blue-700", Consultor:"bg-green-700", Mecanico:"bg-orange-700",
  Desenvolvedor:"bg-purple-700",
};

export default function AdminUsuarios() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("colaboradores")
      .select("id,nome,username,cargo,nivelAcessoId,ativo,primeiroAcesso,createdAt,auth_user_id")
      .order("createdAt", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  async function toggleAtivo(u: any) {
    await sb.from("colaboradores").update({ ativo: !u.ativo }).eq("id", u.id);
    load();
  }

  const stats = {
    total: users.length,
    ativos: users.filter(u => u.ativo).length,
    primeiroAcesso: users.filter(u => u.primeiroAcesso).length,
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-400" />Usuários
            </h1>
            <p className="text-zinc-400 mt-1">Colaboradores cadastrados em 10_users</p>
          </div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300">
            <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Total", value:stats.total, icon:Users, color:"text-blue-400" },
            { label:"Ativos", value:stats.ativos, icon:UserCheck, color:"text-green-400" },
            { label:"1º Acesso", value:stats.primeiroAcesso, icon:Shield, color:"text-yellow-400" },
          ].map(s => { const Icon = s.icon; return (
            <Card key={s.label} className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <Icon className={"h-6 w-6 " + s.color} />
                <div><p className="text-xs text-zinc-400">{s.label}</p><p className={"text-2xl font-bold " + s.color}>{s.value}</p></div>
              </div>
            </Card>
          );})}
        </div>

        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800">
              <tr>{["Nome","Username","Cargo","Auth","Status",""].map(h =>
                <th key={h} className="px-4 py-3 text-left text-zinc-400 font-medium">{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {loading ? (<tr><td colSpan={6} className="py-16 text-center text-zinc-500"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>)
              : users.map(u => (
                <tr key={u.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30">
                  <td className="px-4 py-3 text-white font-medium">{u.nome}</td>
                  <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{u.username}</td>
                  <td className="px-4 py-3">
                    <Badge className={(CARGO_COLORS[u.cargo || ""] || "bg-zinc-700") + " text-white text-xs"}>
                      {u.cargo}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {u.auth_user_id
                      ? <span className="text-green-400 text-xs">✓ vinculado</span>
                      : <span className="text-zinc-500 text-xs">sem auth</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAtivo(u)}>
                      <Badge className={u.ativo
                        ? "bg-green-900/40 text-green-400 border border-green-800 cursor-pointer"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-pointer"}>
                        {u.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {u.primeiroAcesso && <Badge className="bg-yellow-900/40 text-yellow-400 text-xs border border-yellow-800">1º acesso</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminLayout>
  );
}
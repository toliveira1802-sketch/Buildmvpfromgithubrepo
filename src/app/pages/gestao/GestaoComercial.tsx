import { useState, useEffect } from "react";
import { ShoppingBag, UserCheck, UserX, CheckCheck, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../../lib/supabase";
import { EmpresaToggle } from "../../components/EmpresaToggle";

interface Cliente { id: number; full_name?: string; email?: string; phone?: string; created_at: string; }

export default function GestaoComercial() {
  const [aba, setAba] = useState<"visao" | "pendentes">("visao");
  const [pendentes, setPendentes] = useState<Cliente[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const [{ data: pend }, { count }] = await Promise.all([
      supabase.from("04_CLIENTS").select("*").eq("status_cadastro", "pendente"),
      supabase.from("04_CLIENTS").select("id", { count: "exact", head: true }),
    ]);
    setPendentes(pend || []);
    setTotalClientes(count || 0);
    setLoading(false);
  }

  async function aprovar(id: string) {
    await supabase.from("04_CLIENTS").update({ status_cadastro: "ativo" }).eq("id", id);
    setPendentes(p => p.filter(c => c.id !== id));
  }

  async function rejeitar(id: string) {
    await supabase.from("04_CLIENTS").update({ status_cadastro: "rejeitado" }).eq("id", id);
    setPendentes(p => p.filter(c => c.id !== id));
  }

  async function aprovarTodos() {
    await supabase.from("04_CLIENTS").update({ status_cadastro: "ativo" }).eq("status_cadastro", "pendente");
    setPendentes([]);
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-pink-400" /> Comercial
            </h1>
            <p className="text-zinc-400 mt-1">Clientes, promoções e aprovações</p>
          </div>
          <div className="flex items-center gap-3">
            <EmpresaToggle />
            {pendentes.length > 0 && (
              <Badge className="bg-red-600 text-white text-sm px-3 py-1 flex items-center gap-1">
                <Bell className="h-3 w-3" /> {pendentes.length} pendentes
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {["visao", "pendentes"].map(a => (
            <button key={a} onClick={() => setAba(a as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${aba === a ? "bg-pink-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
              {a === "visao" ? "Visão Geral" : `Novos Cadastros ${pendentes.length > 0 ? `(${pendentes.length})` : ""}`}
            </button>
          ))}
        </div>

        {aba === "visao" && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-zinc-400">Total de Clientes</CardDescription>
                <CardTitle className="text-4xl text-white">{loading ? "—" : totalClientes}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-pink-950 border-pink-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-pink-300">Aguardando Aprovação</CardDescription>
                <CardTitle className="text-4xl text-white">{pendentes.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {aba === "pendentes" && (
          <div className="space-y-4">
            {pendentes.length > 0 && (
              <div className="flex justify-end">
                <Button onClick={aprovarTodos} className="bg-green-600 hover:bg-green-700">
                  <CheckCheck className="h-4 w-4 mr-2" /> Aprovar Todos
                </Button>
              </div>
            )}
            {loading ? <p className="text-zinc-500 text-sm">Carregando...</p>
              : pendentes.length === 0 ? (
                <div className="text-center py-16 text-zinc-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum cadastro pendente.</p>
                </div>
              ) : pendentes.map(c => (
                <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{c.full_name || "Sem nome"}</p>
                    <p className="text-zinc-400 text-sm">{c.email || "—"}</p>
                    <p className="text-zinc-600 text-xs">{new Date(c.created_at).toLocaleString("pt-BR")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => aprovar(c.id)}>
                      <UserCheck className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-950" onClick={() => rejeitar(c.id)}>
                      <UserX className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

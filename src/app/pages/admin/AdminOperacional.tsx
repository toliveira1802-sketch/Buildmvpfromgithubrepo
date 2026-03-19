import { useState, useEffect } from "react";
import { Wrench, RefreshCw, Loader2, Car, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

export default function AdminOperacional() {
  const navigate = useNavigate();
  const [osAtivas, setOsAtivas] = useState<any[]>([]);
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [os, mecs] = await Promise.all([
      sb.from("06_OS")
        .select("id,numero_os,status,cliente_nome,veiculo_modelo,veiculo_placa,mecanico_nome,valor_total,created_at")
        .in("status", ["aprovado","em_execucao","diagnostico","orcamento","aguardando_aprovacao"])
        .order("created_at", { ascending: true }),
      sb.from("12_MECANICOS").select("id,nome,especialidade,nivel").order("nome"),
    ]);
    setOsAtivas(os.data || []);
    setMecanicos(mecs.data || []);
    setLoading(false);
  }

  const fmt = (v: number) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const emExecucao = osAtivas.filter(o => o.status === "em_execucao");
  const aguardando = osAtivas.filter(o => ["diagnostico","orcamento","aguardando_aprovacao"].includes(o.status));
  const aprovados = osAtivas.filter(o => o.status === "aprovado");

  const STATUS_COLOR: Record<string,string> = {
    diagnostico:"bg-zinc-700 text-zinc-300", orcamento:"bg-yellow-900/50 text-yellow-300",
    aguardando_aprovacao:"bg-orange-900/50 text-orange-300", aprovado:"bg-blue-900/50 text-blue-300",
    em_execucao:"bg-purple-900/50 text-purple-300",
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Wrench className="h-8 w-8 text-orange-400" />Operacional
            </h1>
            <p className="text-zinc-400 mt-1">{osAtivas.length} OS ativas no pátio</p>
          </div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300">
            <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Em Execução", value:emExecucao.length, color:"text-purple-400", icon:Wrench },
            { label:"Aprovados", value:aprovados.length, color:"text-blue-400", icon:CheckCircle },
            { label:"Aguardando", value:aguardando.length, color:"text-yellow-400", icon:Clock },
          ].map(s => { const Icon = s.icon; return (
            <Card key={s.label} className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <Icon className={"h-6 w-6 " + s.color} />
                <div><p className="text-xs text-zinc-400">{s.label}</p><p className={"text-3xl font-bold " + s.color}>{s.value}</p></div>
              </div>
            </Card>
          );})}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Wrench className="h-4 w-4 text-orange-400"/>OS Ativas</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
              : osAtivas.length === 0 ? <p className="text-zinc-500 text-sm">Nenhuma OS ativa</p>
              : osAtivas.map(o => (
                <div key={o.id} onClick={() => navigate("/ordens-servico/"+o.id)}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 hover:border-orange-600 cursor-pointer">
                  <div>
                    <p className="text-white text-sm font-medium">{o.cliente_nome || "—"}</p>
                    <p className="text-zinc-400 text-xs">{o.veiculo_modelo} {o.veiculo_placa && "· "+o.veiculo_placa}</p>
                    {o.mecanico_nome && <p className="text-zinc-500 text-xs">{o.mecanico_nome}</p>}
                  </div>
                  <div className="text-right">
                    <Badge className={(STATUS_COLOR[o.status]||"bg-zinc-700 text-zinc-300")+" text-xs"}>{o.status?.replace(/_/g," ")}</Badge>
                    <p className="text-green-400 text-xs mt-1">{fmt(o.valor_total)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Wrench className="h-4 w-4 text-zinc-400"/>Mecânicos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {mecanicos.length === 0 ? <p className="text-zinc-500 text-sm">Nenhum mecânico cadastrado</p>
              : mecanicos.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
                  <div>
                    <p className="text-white font-medium">{m.nome}</p>
                    <p className="text-zinc-400 text-xs">{m.especialidade || "Geral"}</p>
                  </div>
                  <Badge className="bg-orange-900/40 text-orange-300 border border-orange-800 text-xs">{m.nivel}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
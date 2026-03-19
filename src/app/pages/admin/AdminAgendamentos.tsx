import { useState, useEffect } from "react";
import { Calendar, Plus, RefreshCw, Loader2, Clock, Car, Wrench, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

// Agendamentos = OS com status diagnostico/orcamento do dia de hoje e futuros
interface OS { id:number; numero_os:string; status:string; cliente_nome:string; veiculo_placa:string; veiculo_modelo:string; mecanico_nome:string; created_at:string; }

const STATUS_BADGE: Record<string,string> = {
  diagnostico: "bg-zinc-700 text-zinc-300",
  orcamento: "bg-yellow-900/50 text-yellow-300",
  aguardando_aprovacao: "bg-orange-900/50 text-orange-300",
  aprovado: "bg-blue-900/50 text-blue-300",
  em_execucao: "bg-purple-900/50 text-purple-300",
};

export default function AdminAgendamentos() {
  const navigate = useNavigate();
  const [os, setOs] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSel, setDiaSel] = useState<string>(new Date().toISOString().split("T")[0]);

  useEffect(() => { load(); }, [diaSel]);

  async function load() {
    setLoading(true);
    const start = diaSel + "T00:00:00";
    const end = diaSel + "T23:59:59";
    const { data } = await sb.from("06_OS")
      .select("id,numero_os,status,cliente_nome,veiculo_placa,veiculo_modelo,mecanico_nome,created_at")
      .gte("created_at", start).lte("created_at", end)
      .not("status","in","(entregue,cancelado)")
      .order("created_at",{ascending:true});
    setOs(data||[]);
    setLoading(false);
  }

  const hoje = new Date().toISOString().split("T")[0];
  const dias = Array.from({length:7},(_,i) => {
    const d = new Date(); d.setDate(d.getDate()-3+i);
    return { iso: d.toISOString().split("T")[0], label: d.toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"2-digit"}) };
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Calendar className="h-8 w-8 text-blue-400"/>Agendamentos</h1>
            <p className="text-zinc-400 mt-1">OS por dia — baseado em 06_OS</p>
          </div>
          <Button onClick={() => navigate("/ordens-servico/nova")} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2"/>Nova OS</Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {dias.map(d => (
            <button key={d.iso} onClick={() => setDiaSel(d.iso)}
              className={"flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors "+(diaSel===d.iso ? "bg-blue-600 border-blue-500 text-white" : d.iso===hoje ? "bg-blue-950/40 border-blue-800 text-blue-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white")}>
              {d.label}
            </button>
          ))}
          <Button onClick={load} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 flex-shrink-0"><RefreshCw className={"h-3.5 w-3.5"+(loading?" animate-spin":"")}/></Button>
        </div>

        {loading ? (<div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-blue-400"/></div>)
        : os.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30"/>
            <p>Nenhuma OS neste dia</p>
            <Button onClick={() => navigate("/ordens-servico/nova")} className="mt-4 bg-red-600 hover:bg-red-700 text-sm">Criar OS</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-zinc-400 text-sm">{os.length} OS em {new Date(diaSel+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"})}</p>
            {os.map(o => (
              <Card key={o.id} className="bg-zinc-900 border-zinc-800 p-4 cursor-pointer hover:border-blue-600 transition-colors" onClick={() => navigate("/ordens-servico/"+o.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900/40 flex items-center justify-center"><Car className="h-5 w-5 text-blue-400"/></div>
                    <div>
                      <p className="text-white font-medium">{o.cliente_nome||"—"} <span className="text-zinc-500 text-xs font-mono ml-1">{o.numero_os}</span></p>
                      <p className="text-zinc-400 text-sm">{o.veiculo_modelo} {o.veiculo_placa && "· "+o.veiculo_placa}</p>
                      {o.mecanico_nome && <p className="text-zinc-500 text-xs flex items-center gap-1"><Wrench className="h-3 w-3"/>{o.mecanico_nome}</p>}
                    </div>
                  </div>
                  <Badge className={(STATUS_BADGE[o.status]||"bg-zinc-700 text-zinc-300")+" text-xs"}>{o.status?.replace(/_/g," ")}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
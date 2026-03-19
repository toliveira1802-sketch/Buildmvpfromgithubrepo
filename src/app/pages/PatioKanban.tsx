import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Wrench, Clock, CheckCircle, XCircle, AlertTriangle, Plus, RefreshCw, Loader2, Car } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import ConsultorLayout from "../components/ConsultorLayout";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

const COLUNAS = [
  { key:"diagnostico",     label:"Diagnóstico",     color:"bg-zinc-700",    icon:Car },
  { key:"orcamento",       label:"Orçamento",        color:"bg-yellow-700",  icon:Clock },
  { key:"aguardando_aprovacao", label:"Ag. Aprovação", color:"bg-orange-700", icon:AlertTriangle },
  { key:"aprovado",        label:"Aprovado",         color:"bg-blue-700",    icon:CheckCircle },
  { key:"em_execucao",     label:"Em Execução",      color:"bg-purple-700",  icon:Wrench },
  { key:"concluido",       label:"Concluído",        color:"bg-green-700",   icon:CheckCircle },
];

interface OS {
  id: number; numero_os: string; status: string;
  cliente_nome: string; veiculo_placa: string; veiculo_modelo: string;
  mecanico_nome: string; valor_total: number; created_at: string;
}

export default function PatioKanban() {
  const navigate = useNavigate();
  const [os, setOs] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<number|null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("06_OS")
      .select("id,numero_os,status,cliente_nome,veiculo_placa,veiculo_modelo,mecanico_nome,valor_total,created_at")
      .not("status","in","(entregue,cancelado)")
      .order("created_at",{ascending:true});
    setOs(data||[]);
    setLoading(false);
  }

  async function moverStatus(id:number, novoStatus:string) {
    setMoving(id);
    await sb.from("06_OS").update({ status: novoStatus }).eq("id", id);
    await load();
    setMoving(null);
  }

  const fmt = (v:number) => v ? v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
  const statusIdx = (s:string) => COLUNAS.findIndex(c => c.key===s);

  return (
    <ConsultorLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Wrench className="h-6 w-6 text-purple-400"/>Pátio</h1>
            <p className="text-zinc-400 text-sm">{os.length} veículos ativos</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className="h-4 w-4"/></Button>
            <Button onClick={() => navigate("/ordens-servico/nova")} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-1"/>Nova OS</Button>
          </div>
        </div>

        {loading ? (<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-purple-400"/></div>)
        : os.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Car className="h-12 w-12 mx-auto mb-3 opacity-30"/>
            <p>Nenhum veículo no pátio</p>
            <Button onClick={() => navigate("/ordens-servico/nova")} className="mt-4 bg-red-600 hover:bg-red-700">Criar primeira OS</Button>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {COLUNAS.map(col => {
              const Icon = col.icon;
              const cards = os.filter(o => o.status === col.key);
              return (
                <div key={col.key} className="flex-shrink-0 w-72">
                  <div className={"flex items-center gap-2 px-3 py-2 rounded-t-lg "+col.color}>
                    <Icon className="h-4 w-4 text-white"/><span className="text-white font-medium text-sm">{col.label}</span>
                    <Badge className="ml-auto bg-black/30 text-white text-xs">{cards.length}</Badge>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-b-lg min-h-24 p-2 space-y-2">
                    {cards.map(o => (
                      <div key={o.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 cursor-pointer hover:border-purple-500 transition-colors"
                        onClick={() => navigate("/ordens-servico/"+o.id)}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white font-medium text-sm">{o.numero_os}</p>
                            <p className="text-zinc-300 text-xs">{o.cliente_nome||"—"}</p>
                            <p className="text-zinc-500 text-xs">{o.veiculo_placa} {o.veiculo_modelo}</p>
                          </div>
                          <p className="text-green-400 text-xs font-medium">{fmt(o.valor_total)}</p>
                        </div>
                        {o.mecanico_nome && <p className="text-zinc-400 text-xs mt-1 flex items-center gap-1"><Wrench className="h-2.5 w-2.5"/>{o.mecanico_nome}</p>}
                        <div className="flex gap-1 mt-2">
                          {statusIdx(o.status) > 0 && (
                            <button disabled={moving===o.id}
                              onClick={e => { e.stopPropagation(); moverStatus(o.id, COLUNAS[statusIdx(o.status)-1].key); }}
                              className="text-xs px-2 py-0.5 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300">← Voltar</button>
                          )}
                          {statusIdx(o.status) < COLUNAS.length-1 && (
                            <button disabled={moving===o.id}
                              onClick={e => { e.stopPropagation(); moverStatus(o.id, COLUNAS[statusIdx(o.status)+1].key); }}
                              className="text-xs px-2 py-0.5 bg-purple-700 hover:bg-purple-600 rounded text-white">Avançar →</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ConsultorLayout>
  );
}
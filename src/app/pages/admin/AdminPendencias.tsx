import { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw, Loader2, CheckCircle, Clock, FileText } from "lucide-react";
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

interface OS { id:number; numero_os:string; status:string; cliente_nome:string; veiculo_modelo:string; valor_total:number; created_at:string; }

export default function AdminPendencias() {
  const navigate = useNavigate();
  const [pendentes, setPendentes] = useState<OS[]>([]);
  const [aguardando, setAguardando] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [p, a] = await Promise.all([
      sb.from("06_OS").select("id,numero_os,status,cliente_nome,veiculo_modelo,valor_total,created_at")
        .eq("status","orcamento").order("created_at",{ascending:true}),
      sb.from("06_OS").select("id,numero_os,status,cliente_nome,veiculo_modelo,valor_total,created_at")
        .eq("status","aguardando_aprovacao").order("created_at",{ascending:true}),
    ]);
    setPendentes(p.data||[]);
    setAguardando(a.data||[]);
    setLoading(false);
  }

  const fmt = (v:number) => v ? v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
  const fmtDate = (d:string) => { const dias = Math.floor((Date.now()-new Date(d).getTime())/86400000); return dias===0?"hoje":dias===1?"ontem":dias+"d atrás"; };

  function OSCard({o,badge,cor}:{o:OS,badge:string,cor:string}) {
    return (
      <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-600 cursor-pointer transition-colors"
        onClick={() => navigate("/ordens-servico/"+o.id)}>
        <div className="flex items-center gap-3">
          <div className={"w-2 h-10 rounded-full "+cor}/>
          <div>
            <p className="text-white font-medium">{o.cliente_nome||"—"} <span className="text-zinc-500 text-xs font-mono">{o.numero_os}</span></p>
            <p className="text-zinc-400 text-sm">{o.veiculo_modelo||"—"}</p>
            <p className="text-zinc-500 text-xs flex items-center gap-1"><Clock className="h-3 w-3"/>{fmtDate(o.created_at)}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge className={badge+" text-xs"}>{o.status?.replace(/_/g," ")}</Badge>
          <p className="text-green-400 text-sm font-medium mt-1">{fmt(o.valor_total)}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><AlertTriangle className="h-8 w-8 text-orange-400"/>Pendências</h1>
            <p className="text-zinc-400 mt-1">OS aguardando ação</p>
          </div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>

        {loading ? (<div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-orange-400"/></div>) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-yellow-300 font-semibold flex items-center gap-2 mb-3"><FileText className="h-4 w-4"/>Orçamentos para enviar ({pendentes.length})</h2>
              {pendentes.length === 0 ? <p className="text-zinc-500 text-sm">Nenhum</p>
              : pendentes.map(o => <OSCard key={o.id} o={o} badge="bg-yellow-900/50 text-yellow-300" cor="bg-yellow-500"/>)}
            </div>
            <div>
              <h2 className="text-orange-300 font-semibold flex items-center gap-2 mb-3"><Clock className="h-4 w-4"/>Aguardando aprovação do cliente ({aguardando.length})</h2>
              {aguardando.length === 0 ? <p className="text-zinc-500 text-sm">Nenhum</p>
              : aguardando.map(o => <OSCard key={o.id} o={o} badge="bg-orange-900/50 text-orange-300" cor="bg-orange-500"/>)}
            </div>
            {pendentes.length === 0 && aguardando.length === 0 && (
              <div className="text-center py-12 text-zinc-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-60"/>
                <p className="text-lg font-medium text-green-400">Tudo em dia!</p>
                <p className="text-sm mt-1">Nenhuma OS pendente no momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
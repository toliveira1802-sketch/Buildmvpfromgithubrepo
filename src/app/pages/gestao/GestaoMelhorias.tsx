import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw, Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://acuufrgoyjwzlyhopaus.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4");

export default function GestaoMelhorias() {
  const navigate = useNavigate();
  const [canceladas, setCanceladas] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [canc, osData] = await Promise.all([
      sb.from("06_OS").select("id,numero_os,cliente_nome,veiculo_modelo,motivo_recusa,valor_total,created_at")
        .eq("status","cancelado").order("created_at",{ascending:false}).limit(10),
      sb.from("06_OS").select("status,valor_total"),
    ]);
    setCanceladas(canc.data||[]);
    const rows = osData.data||[];
    const total = rows.length;
    const cancelados = rows.filter(r => r.status==="cancelado").length;
    const taxa = total > 0 ? (cancelados/total)*100 : 0;
    const ins: string[] = [];
    if (taxa > 15) ins.push("Taxa de cancelamento alta ("+taxa.toFixed(0)+"%) — revisar processo de orçamento");
    if (taxa <= 5) ins.push("Taxa de cancelamento ótima ("+taxa.toFixed(0)+"%) — manter processo atual");
    const orcamentos = rows.filter(r => r.status==="orcamento").length;
    if (orcamentos > 5) ins.push(orcamentos+" OS aguardando envio de orçamento — priorizar envio");
    const aguardando = rows.filter(r => r.status==="aguardando_aprovacao").length;
    if (aguardando > 3) ins.push(aguardando+" OS aguardando aprovação do cliente — fazer follow-up");
    if (ins.length === 0) ins.push("Sistema operando bem — nenhuma ação urgente identificada");
    setInsights(ins);
    setLoading(false);
  }

  const fmt = (v:number) => (v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Lightbulb className="h-8 w-8 text-yellow-400"/>Melhorias</h1>
            <p className="text-zinc-400 mt-1">Insights automáticos baseados nos dados do sistema</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><TrendingUp className="h-4 w-4 text-yellow-400"/>Insights Automáticos</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400"/>
            : insights.map((ins,i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-yellow-950/30 border border-yellow-800/50 rounded-lg">
                <Lightbulb className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5"/>
                <p className="text-yellow-200 text-sm">{ins}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-400"/>OS Canceladas Recentes ({canceladas.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400"/>
            : canceladas.length === 0 ? <p className="text-zinc-500 text-sm">Nenhuma OS cancelada</p>
            : <div className="space-y-2">
              {canceladas.map(o => (
                <div key={o.id} onClick={() => navigate("/ordens-servico/"+o.id)}
                  className="p-3 rounded-lg border border-zinc-800 hover:border-red-800 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{o.cliente_nome||"—"} <span className="text-zinc-500 font-mono text-xs">{o.numero_os}</span></p>
                      <p className="text-zinc-400 text-xs">{o.veiculo_modelo||"—"}</p>
                      {o.motivo_recusa && <p className="text-red-300 text-xs mt-0.5">Motivo: {o.motivo_recusa}</p>}
                    </div>
                    <p className="text-zinc-400 text-xs">{fmt(o.valor_total)}</p>
                  </div>
                </div>
              ))}
            </div>}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
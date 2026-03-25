import { useState, useEffect } from "react";
import { Star, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://acuufrgoyjwzlyhopaus.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4");

export default function AnalyticsNPS() {
  const [kpis, setKpis] = useState({ entregues:0, total:0, ticket:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("06_OS").select("status,valor_total");
    const total = (data||[]).length;
    const entregues = (data||[]).filter(r => r.status==="entregue");
    const somaTicket = entregues.reduce((s,r) => s+(r.valor_total||0),0);
    const ticket = entregues.length > 0 ? somaTicket/entregues.length : 0;
    setKpis({ entregues:entregues.length, total, ticket });
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const nps = kpis.total > 0 ? Math.round((kpis.entregues/kpis.total)*100) : 0;

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Star className="h-8 w-8 text-yellow-400"/>NPS / Satisfação</h1>
            <p className="text-zinc-400 mt-1">Módulo de NPS em desenvolvimento — métricas baseadas em OS entregues</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"OS Entregues", value:kpis.entregues.toString(), color:"text-green-400" },
            { label:"Taxa de Entrega", value:nps+"%", color: nps>80?"text-green-400":nps>50?"text-yellow-400":"text-red-400" },
            { label:"Ticket Médio", value:fmt(kpis.ticket), color:"text-blue-400" },
          ].map(k => (
            <Card key={k.label} className="bg-zinc-900 border-zinc-800 p-4">
              <p className="text-xs text-zinc-400">{k.label}</p>
              <p className={"text-2xl font-bold "+k.color}>{loading?"—":k.value}</p>
            </Card>
          ))}
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white">Score de Entrega</CardTitle><CardDescription className="text-zinc-400">Proxy para NPS até integração com sistema de avaliação</CardDescription></CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className={"text-8xl font-black "+(nps>80?"text-green-400":nps>50?"text-yellow-400":"text-red-400")}>{loading?"—":nps}</div>
            <p className="text-zinc-400 mt-2">% de OS que chegaram até entrega</p>
            <p className="text-zinc-600 text-xs mt-4">NPS real disponível após integração com módulo de Avaliações</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
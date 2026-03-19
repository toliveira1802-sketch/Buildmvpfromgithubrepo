import { useState, useEffect } from "react";
import { UserX, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://acuufrgoyjwzlyhopaus.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4");

export default function AnalyticsChurn() {
  const [kpis, setKpis] = useState({ cancelados:0, total:0, taxa:0, motivos:[] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("06_OS").select("status,motivo_recusa");
    const total = (data||[]).length;
    const cancelados = (data||[]).filter(r => r.status==="cancelado");
    const taxa = total > 0 ? Math.round((cancelados.length/total)*100) : 0;
    const motivoMap: Record<string,number> = {};
    cancelados.forEach(r => {
      const m = r.motivo_recusa||"Não informado";
      motivoMap[m] = (motivoMap[m]||0)+1;
    });
    const motivos = Object.entries(motivoMap).map(([motivo,count]) => ({motivo,count})).sort((a,b) => b.count-a.count);
    setKpis({ cancelados:cancelados.length, total, taxa, motivos });
    setLoading(false);
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><UserX className="h-8 w-8 text-red-400"/>Churn / Cancelamentos</h1>
            <p className="text-zinc-400 mt-1">OS canceladas e motivos</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Total OS", value:kpis.total.toString(), color:"text-white" },
            { label:"Canceladas", value:kpis.cancelados.toString(), color:"text-red-400" },
            { label:"Taxa Cancelamento", value:kpis.taxa+"%", color: kpis.taxa>15?"text-red-400":kpis.taxa>5?"text-yellow-400":"text-green-400" },
          ].map(k => (
            <Card key={k.label} className="bg-zinc-900 border-zinc-800 p-4">
              <p className="text-xs text-zinc-400">{k.label}</p>
              <p className={"text-2xl font-bold "+k.color}>{loading?"—":k.value}</p>
            </Card>
          ))}
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white">Motivos de Cancelamento</CardTitle><CardDescription className="text-zinc-400">Campo motivo_recusa em 06_OS</CardDescription></CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin"/></div>
            : kpis.cancelados === 0 ? <p className="text-zinc-500 text-sm text-center py-8">Nenhuma OS cancelada</p>
            : <div className="space-y-2">
              {kpis.motivos.map((m,i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                  <span className="text-zinc-200 text-sm">{m.motivo}</span>
                  <span className="text-red-400 font-bold">{m.count}</span>
                </div>
              ))}
            </div>}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
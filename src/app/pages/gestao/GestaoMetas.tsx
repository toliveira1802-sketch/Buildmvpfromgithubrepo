import { useState, useEffect } from "react";
import { Target, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://acuufrgoyjwzlyhopaus.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4");

const METAS = [
  { key:"fat", label:"Faturamento Mensal", meta:70000, fmt:(v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}), color:"text-green-400" },
  { key:"os", label:"OS Abertas no Mês", meta:50, fmt:(v:number) => v.toString()+" OS", color:"text-blue-400" },
  { key:"ticket", label:"Ticket Médio", meta:1500, fmt:(v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}), color:"text-purple-400" },
  { key:"entrega", label:"Taxa de Entrega", meta:90, fmt:(v:number) => v.toFixed(1)+"%", color:"text-teal-400" },
];

export default function GestaoMetas() {
  const [valores, setValores] = useState<Record<string,number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const start = new Date(); start.setDate(1); start.setHours(0,0,0,0);
    const { data } = await sb.from("06_OS")
      .select("status,valor_total,created_at")
      .gte("created_at", start.toISOString());
    const rows = data||[];
    const total = rows.length;
    const concluidas = rows.filter(r => ["concluido","entregue"].includes(r.status));
    const fat = concluidas.reduce((s,r) => s+(r.valor_total||0),0);
    const ticket = concluidas.length > 0 ? fat/concluidas.length : 0;
    const entregues = rows.filter(r => r.status==="entregue").length;
    const taxaEntrega = total > 0 ? (entregues/total)*100 : 0;
    setValores({ fat, os:total, ticket, entrega:taxaEntrega });
    setLoading(false);
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Target className="h-8 w-8 text-blue-400"/>Metas</h1>
            <p className="text-zinc-400 mt-1">Progresso das metas do mês atual</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        <div className="space-y-4">
          {METAS.map(m => {
            const atual = valores[m.key]||0;
            const pct = Math.min(Math.round((atual/m.meta)*100), 100);
            return (
              <Card key={m.key} className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{m.label}</p>
                    <div className="text-right">
                      <p className={"font-bold "+m.color}>{loading?"—":m.fmt(atual)}</p>
                      <p className="text-zinc-500 text-xs">meta: {m.fmt(m.meta)}</p>
                    </div>
                  </div>
                  <Progress value={loading?0:pct} className="h-3"/>
                  <p className="text-zinc-500 text-xs mt-1 text-right">{loading?"—":pct}%</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <p className="text-zinc-400 text-sm">Metas configuráveis disponíveis na próxima versão — valores baseados em 06_OS do mês atual</p>
        </div>
      </div>
    </AdminLayout>
  );
}
import { useState, useEffect } from "react";
import { Users, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://acuufrgoyjwzlyhopaus.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4");

export default function AnalyticsLTV() {
  const [top, setTop] = useState<any[]>([]);
  const [kpis, setKpis] = useState({ ltv:0, clientes:0, recorrentes:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("06_OS")
      .select("cliente_nome,client_id,valor_total")
      .in("status",["concluido","entregue"]);
    const map: Record<string,{nome:string,total:number,count:number}> = {};
    (data||[]).forEach(r => {
      const k = r.client_id||r.cliente_nome||"desconhecido";
      if (!map[k]) map[k] = { nome:r.cliente_nome||"—", total:0, count:0 };
      map[k].total += r.valor_total||0;
      map[k].count++;
    });
    const arr = Object.values(map).sort((a,b) => b.total-a.total).slice(0,15);
    setTop(arr);
    const totalClientes = arr.length;
    const totalValor = arr.reduce((s,c) => s+c.total,0);
    const ltv = totalClientes > 0 ? totalValor/totalClientes : 0;
    const recorrentes = arr.filter(c => c.count > 1).length;
    setKpis({ ltv, clientes:totalClientes, recorrentes });
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Users className="h-8 w-8 text-blue-400"/>LTV — Valor por Cliente</h1>
            <p className="text-zinc-400 mt-1">Lifetime Value dos clientes com OS finalizadas</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"LTV Médio", value:fmt(kpis.ltv), color:"text-blue-400" },
            { label:"Clientes Ativos", value:kpis.clientes.toString(), color:"text-white" },
            { label:"Recorrentes", value:kpis.recorrentes.toString(), color:"text-green-400" },
          ].map(k => (
            <Card key={k.label} className="bg-zinc-900 border-zinc-800 p-4">
              <p className="text-xs text-zinc-400">{k.label}</p>
              <p className={"text-2xl font-bold "+k.color}>{loading?"—":k.value}</p>
            </Card>
          ))}
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white">Top Clientes por Valor</CardTitle></CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin"/></div>
            : top.length === 0 ? <p className="text-zinc-500 text-sm text-center py-12">Nenhum dado disponível</p>
            : <table className="w-full text-sm"><thead><tr className="text-zinc-400 text-xs border-b border-zinc-800">
                <th className="pb-2 text-left">#</th>
                <th className="pb-2 text-left">Cliente</th>
                <th className="pb-2 text-right">OS</th>
                <th className="pb-2 text-right">Total Gasto</th>
              </tr></thead><tbody>
              {top.map((c,i) => (
                <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-2 text-zinc-500 text-xs">{i+1}</td>
                  <td className="py-2 text-zinc-200">{c.nome}</td>
                  <td className="py-2 text-right text-zinc-400">{c.count}</td>
                  <td className="py-2 text-right text-green-400 font-medium">{fmt(c.total)}</td>
                </tr>
              ))}
            </tbody></table>}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
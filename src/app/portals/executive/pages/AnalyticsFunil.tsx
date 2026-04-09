import { useState, useEffect } from "react";
import { TrendingDown, RefreshCw, Loader2 } from "lucide-react";
import { Button } from '@/app/shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/app/shared/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { supabase as sb } from "@/lib/supabase";

const STATUS_ORDER = ["diagnostico","orcamento","aguardando_aprovacao","aprovado","em_execucao","concluido","entregue"];
const STATUS_LABELS: Record<string,string> = {
  diagnostico:"Diagn�stico", orcamento:"Or�amento", aguardando_aprovacao:"Ag. Aprova��o",
  aprovado:"Aprovado", em_execucao:"Em Execu��o", concluido:"Conclu�do", entregue:"Entregue"
};
const COLORS = ["#94a3b8","#f59e0b","#f97316","#3b82f6","#8b5cf6","#22c55e","#10b981"];

export default function AnalyticsFunil() {
  const [data, setData] = useState<any[]>([]);
  const [totais, setTotais] = useState({ total:0, cancelados:0, taxa:0, faturamento:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data: rows } = await sb.from("ordens_servico").select("status,valor_total");
    const counts: Record<string,number> = {};
    let cancelados = 0, faturamento = 0;
    (rows||[]).forEach(r => {
      if (r.status === "cancelado") { cancelados++; return; }
      counts[r.status] = (counts[r.status]||0)+1;
      if (["concluido","entregue"].includes(r.status)) faturamento += r.valor_total||0;
    });
    const total = (rows||[]).length;
    const entregues = counts["entregue"]||0;
    const taxa = total > 0 ? Math.round((entregues/total)*100) : 0;
    setData(STATUS_ORDER.map((s,i) => ({ name: STATUS_LABELS[s], value: counts[s]||0, color: COLORS[i] })));
    setTotais({ total, cancelados, taxa, faturamento });
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><TrendingDown className="h-8 w-8 text-blue-400"/>Funil de OS</h1>
            <p className="text-zinc-400 mt-1">Distribui��o por status � todas as OS</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:"Total OS", value:totais.total.toString(), color:"text-white" },
            { label:"Canceladas", value:totais.cancelados.toString(), color:"text-red-400" },
            { label:"Taxa Entrega", value:totais.taxa+"%", color:"text-green-400" },
            { label:"Faturamento", value:fmt(totais.faturamento), color:"text-green-400" },
          ].map(k => (
            <Card key={k.label} className="bg-zinc-900 border-zinc-800 p-4">
              <p className="text-xs text-zinc-400">{k.label}</p>
              <p className={"text-2xl font-bold "+k.color}>{loading?"�":k.value}</p>
            </Card>
          ))}
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white">OS por Status</CardTitle><CardDescription className="text-zinc-400">Volume em cada etapa do funil</CardDescription></CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin"/></div>
            : data.every(d => d.value===0) ? <p className="text-zinc-500 text-sm text-center py-12">Nenhuma OS ainda � crie a primeira OS para ver o funil</p>
            : <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46"/>
                  <XAxis type="number" stroke="#71717a"/>
                  <YAxis type="category" dataKey="name" stroke="#71717a" width={130}/>
                  <Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px"}}/>
                  <Bar dataKey="value" radius={[0,6,6,0]}>
                    {data.map((e,i) => <Cell key={i} fill={e.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

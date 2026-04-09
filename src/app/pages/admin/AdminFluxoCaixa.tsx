import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from '../../shared/ui/button';
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";

export default function AdminFluxoCaixa() {
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({ entradas:0, pendentes:0, totalOS:0 });
  const [porDia, setPorDia] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const start = new Date(); start.setDate(1); start.setHours(0,0,0,0);
    const { data } = await sb.from("ordens_servico")
      .select("status,valor_total,created_at")
      .gte("created_at", start.toISOString());
    const rows = data||[];
    const conc = rows.filter(r=>r.status==="concluido"||r.status==="entregue");
    const pend = rows.filter(r=>["aprovado","em_execucao"].includes(r.status));
    setResumo({
      entradas: conc.reduce((s,r)=>s+(r.valor_total||0),0),
      pendentes: pend.reduce((s,r)=>s+(r.valor_total||0),0),
      totalOS: rows.length,
    });
    const dias: Record<string,number>={};
    conc.forEach(r=>{ const d=r.created_at?.split("T")[0]; if(d) dias[d]=(dias[d]||0)+(r.valor_total||0); });
    setPorDia(Object.entries(dias).sort().map(([dia,valor])=>({ dia:dia.slice(8), valor:Math.round(valor) })));
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><DollarSign className="h-8 w-8 text-green-400"/>Fluxo de Caixa</h1>
            <p className="text-zinc-400 mt-1">Entradas do mês atual — baseado em 06_OS concluídas</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-950/30 border-green-900/40"><CardContent className="pt-4">
            <TrendingUp className="h-6 w-6 text-green-400 mb-2"/>
            <p className="text-2xl font-bold text-green-400">{loading?"—":fmt(resumo.entradas)}</p>
            <p className="text-zinc-400 text-sm">Recebido (OS concluídas)</p>
          </CardContent></Card>
          <Card className="bg-yellow-950/30 border-yellow-900/40"><CardContent className="pt-4">
            <TrendingDown className="h-6 w-6 text-yellow-400 mb-2"/>
            <p className="text-2xl font-bold text-yellow-400">{loading?"—":fmt(resumo.pendentes)}</p>
            <p className="text-zinc-400 text-sm">A receber (OS em andamento)</p>
          </CardContent></Card>
          <Card className="bg-blue-950/30 border-blue-900/40"><CardContent className="pt-4">
            <AlertCircle className="h-6 w-6 text-blue-400 mb-2"/>
            <p className="text-2xl font-bold text-blue-400">{loading?"—":fmt(resumo.entradas+resumo.pendentes)}</p>
            <p className="text-zinc-400 text-sm">Projeção total do mês</p>
          </CardContent></Card>
        </div>
        {porDia.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white">Faturamento Diário</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={240}>
              <BarChart data={porDia}><CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
                <XAxis dataKey="dia" tick={{fill:"#71717a",fontSize:11}}/><YAxis tick={{fill:"#71717a",fontSize:11}}
                  tickFormatter={v=>v>=1000?Math.round(v/1000)+"k":v}/>
                <Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px"}}
                  formatter={(v:any)=>[fmt(v),"Valor"]}/>
                <Bar dataKey="valor" fill="#22c55e" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer></CardContent>
          </Card>
        )}
        {!loading && porDia.length===0 && (
          <div className="text-center py-12 text-zinc-500"><DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30"/><p>Nenhuma OS concluída este mês ainda</p></div>
        )}
      </div>
    </AdminLayout>
  );
}
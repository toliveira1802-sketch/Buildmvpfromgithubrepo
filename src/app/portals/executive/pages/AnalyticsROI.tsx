import { useState, useEffect } from "react";
import { DollarSign, RefreshCw, Loader2, TrendingUp } from "lucide-react";
import { Button } from '@/app/shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/shared/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase as sb } from "@/lib/supabase";

export default function AnalyticsROI() {
  const [mensal, setMensal] = useState<any[]>([]);
  const [kpis, setKpis] = useState({ total:0, media:0, melhorMes:"�", melhorValor:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("ordens_servico")
      .select("valor_total,created_at")
      .in("status",["concluido","entregue"])
      .order("created_at",{ascending:true});
    const meses: Record<string,number> = {};
    (data||[]).forEach(r => {
      const m = new Date(r.created_at).toLocaleDateString("pt-BR",{month:"short",year:"2-digit"});
      meses[m] = (meses[m]||0)+(r.valor_total||0);
    });
    const arr = Object.entries(meses).map(([mes,valor]) => ({ mes, valor }));
    setMensal(arr);
    const total = arr.reduce((s,r) => s+r.valor,0);
    const media = arr.length > 0 ? total/arr.length : 0;
    const melhor = arr.reduce((a,b) => a.valor>b.valor?a:b, {mes:"�",valor:0});
    setKpis({ total, media, melhorMes:melhor.mes, melhorValor:melhor.valor });
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><DollarSign className="h-8 w-8 text-green-400"/>ROI / Faturamento</h1>
            <p className="text-zinc-400 mt-1">Receita de OS conclu�das e entregues</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:"Total Geral", value:fmt(kpis.total) },
            { label:"M�dia Mensal", value:fmt(kpis.media) },
            { label:"Melhor M�s", value:kpis.melhorMes },
            { label:"Melhor Valor", value:fmt(kpis.melhorValor) },
          ].map(k => (
            <Card key={k.label} className="bg-zinc-900 border-zinc-800 p-4">
              <p className="text-xs text-zinc-400">{k.label}</p>
              <p className="text-xl font-bold text-green-400">{loading?"�":k.value}</p>
            </Card>
          ))}
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white">Faturamento por M�s</CardTitle></CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin"/></div>
            : mensal.length === 0 ? <p className="text-zinc-500 text-sm text-center py-12">Nenhuma OS finalizada ainda</p>
            : <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46"/>
                  <XAxis dataKey="mes" stroke="#71717a"/>
                  <YAxis stroke="#71717a" tickFormatter={v => "R$"+Math.round(v/1000)+"k"}/>
                  <Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px"}} formatter={(v:any) => fmt(v)}/>
                  <Bar dataKey="valor" fill="#22c55e" radius={[6,6,0,0]}/>
                </BarChart>
              </ResponsiveContainer>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { BarChart2, Wrench, CheckCircle, Clock, RefreshCw, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

export default function AdminProdutividade() {
  const [loading, setLoading] = useState(true);
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [mecs, os] = await Promise.all([
      sb.from("12_MECANICOS").select("id,nome,especialidade,nivel"),
      sb.from("06_OS").select("mecanico_nome,status,valor_total"),
    ]);
    const rows = os.data || [];
    const mecData = (mecs.data||[]).map(m => {
      const minhas = rows.filter(r => r.mecanico_nome === m.nome);
      const conc = minhas.filter(r => r.status==="concluido"||r.status==="entregue");
      const ativas = minhas.filter(r => ["aprovado","em_execucao"].includes(r.status));
      const fat = conc.reduce((s,r)=>s+(r.valor_total||0),0);
      return { ...m, total:minhas.length, concluidas:conc.length, ativas:ativas.length, faturamento:fat };
    }).sort((a,b)=>b.concluidas-a.concluidas);
    setMecanicos(mecData);
    setRanking(mecData.slice(0,5).map(m=>({ name:m.nome.split(" ")[0], concluidas:m.concluidas, ativas:m.ativas })));
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const NIVEL = {junior:"bg-zinc-700",pleno:"bg-blue-900/50",senior:"bg-purple-900/50",master:"bg-yellow-900/50"};

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><BarChart2 className="h-8 w-8 text-purple-400"/>Produtividade</h1>
            <p className="text-zinc-400 mt-1">Performance por mecânico</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        {ranking.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white">OS por Mecânico</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={220}>
              <BarChart data={ranking}><CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
                <XAxis dataKey="name" tick={{fill:"#71717a"}}/><YAxis tick={{fill:"#71717a"}}/>
                <Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px"}}/>
                <Bar dataKey="concluidas" fill="#22c55e" name="Concluídas" radius={[4,4,0,0]}/>
                <Bar dataKey="ativas" fill="#8b5cf6" name="Ativas" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer></CardContent>
          </Card>
        )}
        <div className="space-y-3">
          {loading ? <p className="text-zinc-500 text-sm">Carregando...</p>
          : mecanicos.length === 0 ? <p className="text-zinc-500 text-sm text-center py-8">Nenhum mecânico cadastrado em 12_MECANICOS</p>
          : mecanicos.map((m,i) => (
            <div key={m.id} className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                {i===0?<Trophy className="h-4 w-4 text-yellow-400"/>:<span className="text-zinc-500 text-sm font-bold">{i+1}</span>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{m.nome}</p>
                  <Badge className={(NIVEL[m.nivel as keyof typeof NIVEL]||"bg-zinc-700")+" text-xs text-zinc-300"}>{m.nivel}</Badge>
                </div>
                {m.especialidade && <p className="text-zinc-400 text-xs">{m.especialidade}</p>}
              </div>
              <div className="flex gap-6 text-center">
                <div><p className="text-green-400 font-bold">{m.concluidas}</p><p className="text-zinc-500 text-xs">concluídas</p></div>
                <div><p className="text-purple-400 font-bold">{m.ativas}</p><p className="text-zinc-500 text-xs">ativas</p></div>
                <div><p className="text-blue-400 font-bold">{m.total}</p><p className="text-zinc-500 text-xs">total</p></div>
                <div><p className="text-emerald-400 font-bold text-sm">{fmt(m.faturamento)}</p><p className="text-zinc-500 text-xs">faturado</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
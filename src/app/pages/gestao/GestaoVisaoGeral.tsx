import { useState, useEffect } from "react";
import { TrendingUp, Users, Wrench, DollarSign, Car, Clock, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Button } from "../../components/ui/button";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
import EmpresaToggle from "../../components/EmpresaToggle";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

export default function GestaoVisaoGeral() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ clientes:0, osTotal:0, osAtivas:0, faturamento:0, concluidas:0, mecanicos:0 });
  const [osPorStatus, setOsPorStatus] = useState<any[]>([]);
  const [osPorDia, setOsPorDia] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [os, clientes, mecs] = await Promise.all([
      sb.from("06_OS").select("status,valor_total,created_at"),
      sb.from("04_CLIENTS").select("id", { count:"exact", head:true }),
      sb.from("12_MECANICOS").select("id", { count:"exact", head:true }),
    ]);
    const rows = os.data || [];
    const ativas = ["diagnostico","orcamento","aguardando_aprovacao","aprovado","em_execucao"];
    const conc = rows.filter(r => r.status==="concluido"||r.status==="entregue");
    const fat = conc.reduce((s,r)=>s+(r.valor_total||0),0);
    setKpis({ clientes:clientes.count||0, osTotal:rows.length, osAtivas:rows.filter(r=>ativas.includes(r.status)).length, faturamento:fat, concluidas:conc.length, mecanicos:mecs.count||0 });
    const counts: Record<string,number> = {};
    rows.forEach(r=>{ counts[r.status]=(counts[r.status]||0)+1; });
    setOsPorStatus(Object.entries(counts).map(([name,value])=>({ name:name.replace(/_/g," "), value })));
    const dias: Record<string,number> = {};
    rows.forEach(r=>{ const d=r.created_at?.split("T")[0]; if(d) dias[d]=(dias[d]||0)+1; });
    setOsPorDia(Object.entries(dias).sort().slice(-14).map(([dia,total])=>({ dia:dia.slice(5), total })));
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  const KPIS = [
    { label:"Clientes", value:kpis.clientes, icon:Users, color:"text-blue-400", bg:"bg-blue-950/30 border-blue-900/40" },
    { label:"OS Total", value:kpis.osTotal, icon:Car, color:"text-purple-400", bg:"bg-purple-950/30 border-purple-900/40" },
    { label:"OS Ativas", value:kpis.osAtivas, icon:Wrench, color:"text-orange-400", bg:"bg-orange-950/30 border-orange-900/40" },
    { label:"Concluídas", value:kpis.concluidas, icon:CheckCircle, color:"text-green-400", bg:"bg-green-950/30 border-green-900/40" },
    { label:"Faturamento", value:fmt(kpis.faturamento), icon:DollarSign, color:"text-emerald-400", bg:"bg-emerald-950/30 border-emerald-900/40" },
    { label:"Mecânicos", value:kpis.mecanicos, icon:Wrench, color:"text-yellow-400", bg:"bg-yellow-950/30 border-yellow-900/40" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><TrendingUp className="h-8 w-8 text-blue-400"/>Visão Geral</h1>
            <p className="text-zinc-400 mt-1">KPIs consolidados — Doctor Auto Prime</p></div>
          <div className="flex items-center gap-3">
            <EmpresaToggle />
            <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {KPIS.map((k,i)=>{ const Icon=k.icon; return (
            <Card key={i} className={"border "+k.bg}><CardContent className="pt-4">
              <Icon className={"h-5 w-5 mb-2 "+k.color}/>
              <p className={"text-xl font-bold "+k.color}>{loading?"—":k.value}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{k.label}</p>
            </CardContent></Card>
          );})}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white">OS por Status</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={220}>
              <BarChart data={osPorStatus}><CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
                <XAxis dataKey="name" tick={{fill:"#71717a",fontSize:10}}/><YAxis tick={{fill:"#71717a",fontSize:10}}/>
                <Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px"}}/>
                <Bar dataKey="value" fill="#8b5cf6" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer></CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white">OS Abertas por Dia</CardTitle><CardDescription className="text-zinc-400">Últimos 14 dias</CardDescription></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={220}>
              <LineChart data={osPorDia}><CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
                <XAxis dataKey="dia" tick={{fill:"#71717a",fontSize:10}}/><YAxis tick={{fill:"#71717a",fontSize:10}}/>
                <Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px"}}/>
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer></CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
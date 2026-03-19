import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Car, Clock, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Button } from "../../components/ui/button";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);
const META = 70000;

export default function AdminFinanceiro() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ faturamento:0, ticket:0, servicos:0, emExecucao:0, aguardando:0 });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const start = new Date(); start.setDate(1); start.setHours(0,0,0,0);
    const { data: rows } = await sb.from("06_OS")
      .select("status,valor_total").gte("created_at",start.toISOString());
    const all = rows||[];
    const conc = all.filter(r=>r.status==="concluido"||r.status==="entregue");
    const exec = all.filter(r=>r.status==="aprovado"||r.status==="em_execucao");
    const aguard = all.filter(r=>r.status==="aguardando_aprovacao");
    const fat = conc.reduce((s,r)=>s+(r.valor_total||0),0);
    setData({ faturamento:fat, ticket:conc.length>0?fat/conc.length:0, servicos:conc.length, emExecucao:exec.length, aguardando:aguard.length });
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const prog = Math.min((data.faturamento/META)*100,100);
  const dias = new Date().getDate();
  const diasTotal = new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  const projecao = dias>0?(data.faturamento/dias)*diasTotal:0;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><DollarSign className="h-8 w-8 text-green-400"/>Financeiro</h1>
            <p className="text-zinc-400 mt-1">Faturamento e métricas do mês atual</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"Faturamento", value:fmt(data.faturamento), icon:DollarSign, bg:"bg-green-950 border-green-800", color:"text-green-300" },
            { label:"Ticket Médio", value:fmt(data.ticket), icon:TrendingUp, bg:"bg-blue-950 border-blue-800", color:"text-blue-300" },
            { label:"Serviços Conc.", value:String(data.servicos), icon:DollarSign, bg:"bg-zinc-900 border-zinc-800", color:"text-zinc-400" },
            { label:"Projeção Mês", value:fmt(projecao), icon:TrendingUp, bg:"bg-purple-950 border-purple-800", color:"text-purple-300" },
          ].map((k,i)=>{ const Icon=k.icon; return (
            <Card key={i} className={k.bg}><CardContent className="pt-4">
              <CardTitle className={"text-xs font-medium mb-1 flex items-center gap-1 "+k.color}><Icon className="h-3 w-3"/>{k.label}</CardTitle>
              <p className="text-xl font-bold text-white">{loading?"—":k.value}</p>
            </CardContent></Card>
          );})}
        </div>
        <Card className="bg-zinc-900 border-zinc-800"><CardHeader>
          <CardTitle className="text-white">Meta Mensal — {fmt(META)}</CardTitle>
          <CardDescription className="text-zinc-400">{fmt(data.faturamento)} realizado ({Math.round(prog)}%)</CardDescription>
        </CardHeader><CardContent>
          <Progress value={prog} className="h-4"/>
          <p className="text-zinc-400 text-sm mt-2">Faltam {fmt(Math.max(META-data.faturamento,0))} para a meta</p>
        </CardContent></Card>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-orange-950 border-orange-800"><CardContent className="pt-4">
            <Car className="h-5 w-5 text-orange-400 mb-2"/>
            <p className="text-3xl font-bold text-white">{loading?"—":data.emExecucao}</p>
            <p className="text-orange-300 text-sm">Em execução no pátio</p>
          </CardContent></Card>
          <Card className="bg-yellow-950 border-yellow-800"><CardContent className="pt-4">
            <Clock className="h-5 w-5 text-yellow-400 mb-2"/>
            <p className="text-3xl font-bold text-white">{loading?"—":data.aguardando}</p>
            <p className="text-yellow-300 text-sm">Aguardando aprovação</p>
          </CardContent></Card>
        </div>
      </div>
    </AdminLayout>
  );
}
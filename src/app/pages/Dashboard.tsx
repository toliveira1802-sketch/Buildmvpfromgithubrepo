import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useEffect, useState } from "react";
import { TrendingUp, Clock, CheckCircle2, AlertCircle, DollarSign, Car, FileText, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router";
import ConsultorLayout from "../components/ConsultorLayout";
import { createClient } from "@supabase/supabase-js";
import { Button } from "../components/ui/button";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

const STATUS_COLORS: Record<string,string> = {
  diagnostico:"#94a3b8", orcamento:"#f59e0b", aguardando_aprovacao:"#f97316",
  aprovado:"#3b82f6", em_execucao:"#8b5cf6", concluido:"#22c55e",
  entregue:"#10b981", cancelado:"#ef4444",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ patioCount:0, osAbertas:0, faturamento:0, ticket:0, clientes:0 });
  const [statusData, setStatusData] = useState<{name:string;value:number;color:string}[]>([]);
  const [osRecentes, setOsRecentes] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Dashboard - Doctor Auto";
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const mes = new Date(); mes.setDate(1); mes.setHours(0,0,0,0);
      const [os, clientes, recentes] = await Promise.all([
        sb.from("06_OS").select("status,valor_total"),
        sb.from("04_CLIENTS").select("id", { count: "exact", head: true }),
        sb.from("06_OS").select("id,numero_os,status,valor_total,created_at,mecanico_nome").order("created_at",{ascending:false}).limit(5),
      ]);
      const rows = os.data || [];
      const ativas = ["diagnostico","orcamento","aguardando_aprovacao","aprovado","em_execucao"];
      const patio = rows.filter(r => ativas.includes(r.status)).length;
      const abertas = rows.filter(r => r.status !== "entregue" && r.status !== "cancelado").length;
      const concluidas = rows.filter(r => r.status === "concluido" || r.status === "entregue");
      const fat = concluidas.reduce((s,r) => s+(r.valor_total||0), 0);
      const ticket = concluidas.length > 0 ? fat/concluidas.length : 0;
      setKpis({ patioCount:patio, osAbertas:abertas, faturamento:fat, ticket, clientes:clientes.count||0 });
      const counts: Record<string,number> = {};
      rows.forEach(r => { counts[r.status] = (counts[r.status]||0)+1; });
      setStatusData(Object.entries(counts).map(([name,value]) => ({ name, value, color: STATUS_COLORS[name]||"#6b7280" })));
      setOsRecentes(recentes.data || []);
    } finally { setLoading(false); }
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  const KPIS = [
    { title:"Veículos no Pátio", value: kpis.patioCount.toString(), icon:Car, color:"text-blue-400", bg:"bg-blue-500/10" },
    { title:"OS Abertas", value: kpis.osAbertas.toString(), icon:FileText, color:"text-purple-400", bg:"bg-purple-500/10" },
    { title:"Faturamento Mês", value: fmt(kpis.faturamento), icon:DollarSign, color:"text-green-400", bg:"bg-green-500/10" },
    { title:"Ticket Médio", value: fmt(kpis.ticket), icon:TrendingUp, color:"text-orange-400", bg:"bg-orange-500/10" },
  ];

  return (
    <ConsultorLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral da oficina em tempo real</p>
          </div>
          <Button onClick={() => navigate("/ordens-servico/nova")} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2"/>Nova OS
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((kpi, i) => { const Icon = kpi.icon; return (
            <Card key={i}><CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className={"p-2 rounded-lg "+kpi.bg}><Icon className={"size-5 "+kpi.color}/></div>
            </CardHeader><CardContent>
              <div className="text-2xl font-bold">{loading?"—":kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpis.clientes} clientes cadastrados</p>
            </CardContent></Card>
          );})}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Status das OS</CardTitle><CardDescription>Distribuição atual</CardDescription></CardHeader>
            <CardContent>
              {statusData.length === 0 ? (
                <div className="flex items-center justify-center h-[260px] text-zinc-500">
                  <div className="text-center"><AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-40"/><p>Nenhuma OS ainda</p></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={90}
                    label={({ name, percent }) => name+" "+Math.round(percent*100)+"%"}>
                    {statusData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                  </Pie><Tooltip/></PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card><CardHeader><CardTitle>OS Recentes</CardTitle><CardDescription>Últimas abertas</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {loading ? <p className="text-zinc-500 text-sm">Carregando...</p>
              : osRecentes.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-40"/>
                  <p>Nenhuma OS aberta</p>
                  <Button onClick={() => navigate("/ordens-servico/nova")} className="mt-3 bg-red-600 hover:bg-red-700 text-sm">Criar primeira OS</Button>
                </div>
              ) : osRecentes.map(os => (
                <div key={os.id} onClick={() => navigate("/ordens-servico/"+os.id)}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-zinc-800/40 cursor-pointer">
                  <div>
                    <p className="font-medium text-sm">{os.numero_os||"OS #"+os.id}</p>
                    <p className="text-xs text-zinc-400">{os.mecanico_nome||"—"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-0.5 rounded-full border"
                      style={{color: STATUS_COLORS[os.status]||"#6b7280", borderColor: STATUS_COLORS[os.status]||"#6b7280"}}>
                      {os.status}
                    </span>
                    <p className="text-xs text-zinc-400 mt-0.5">{fmt(os.valor_total||0)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ConsultorLayout>
  );
}
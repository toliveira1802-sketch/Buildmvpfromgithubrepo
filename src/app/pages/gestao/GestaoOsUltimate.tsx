import { useState, useEffect } from "react";
import { FileText, RefreshCw, Loader2, TrendingUp, Clock, CheckCircle, XCircle, Wrench } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";
import { EmpresaToggle } from '../../shared/components/EmpresaToggle';

const STATUS_COLORS: Record<string,string> = {
  diagnostico:"#94a3b8", orcamento:"#f59e0b", aguardando_aprovacao:"#f97316",
  aprovado:"#3b82f6", em_execucao:"#8b5cf6", concluido:"#22c55e", entregue:"#10b981", cancelado:"#ef4444"
};

export default function GestaoOsUltimate() {
  const navigate = useNavigate();
  const [os, setOs] = useState<any[]>([]);
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [osRes, mecRes] = await Promise.all([
      sb.from("ordens_servico").select("id,numero_os,status,cliente_nome,veiculo_modelo,mecanico_nome,valor_total,created_at").order("created_at",{ascending:false}).limit(50),
      sb.from("mecanicos").select("nome").order("nome"),
    ]);
    setOs(osRes.data||[]);
    setMecanicos(mecRes.data||[]);
    setLoading(false);
  }

  const filtered = filtro === "todos" ? os : os.filter(o => o.mecanico_nome === filtro);
  const fmt = (v:number) => (v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const counts: Record<string,number> = {};
  os.forEach(o => { counts[o.status] = (counts[o.status]||0)+1; });
  const pieData = Object.entries(counts).map(([name,value]) => ({ name, value, color: STATUS_COLORS[name]||"#6b7280" }));
  const mecStats = mecanicos.map(m => ({
    nome: m.nome,
    os: os.filter(o => o.mecanico_nome === m.nome).length,
    fat: os.filter(o => o.mecanico_nome === m.nome && ["concluido","entregue"].includes(o.status)).reduce((s,o) => s+(o.valor_total||0),0)
  }));

  const STATUS_BADGE: Record<string,string> = {
    diagnostico:"bg-zinc-700 text-zinc-300", orcamento:"bg-yellow-900/50 text-yellow-300",
    aguardando_aprovacao:"bg-orange-900/50 text-orange-300", aprovado:"bg-blue-900/50 text-blue-300",
    em_execucao:"bg-purple-900/50 text-purple-300", concluido:"bg-green-900/50 text-green-300",
    entregue:"bg-teal-900/50 text-teal-300", cancelado:"bg-red-900/50 text-red-300",
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><FileText className="h-8 w-8 text-purple-400"/>OS Ultimate</h1>
            <p className="text-zinc-400 mt-1">Visão completa das Ordens de Serviço</p></div>
          <div className="flex items-center gap-3">
            <EmpresaToggle />
            <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white text-sm">Distribuição por Status</CardTitle></CardHeader>
            <CardContent>
              {loading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-400 mx-auto"/>
              : <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                    {pieData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                  </Pie><Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46"}}/></PieChart>
                </ResponsiveContainer>}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white text-sm">Mecânicos</CardTitle></CardHeader>
            <CardContent className="space-y-2 overflow-y-auto max-h-52">
              {mecStats.map(m => (
                <div key={m.nome} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{m.nome}</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-zinc-400">{m.os} OS</span>
                    <span className="text-green-400">{fmt(m.fat)}</span>
                  </div>
                </div>
              ))}
              {mecStats.length === 0 && <p className="text-zinc-600 text-sm">Sem mecânicos</p>}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white text-sm">Resumo</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label:"Total OS", value:os.length, icon:FileText, color:"text-white" },
                { label:"Em Execução", value:os.filter(o=>o.status==="em_execucao").length, icon:Wrench, color:"text-purple-400" },
                { label:"Concluídas", value:os.filter(o=>["concluido","entregue"].includes(o.status)).length, icon:CheckCircle, color:"text-green-400" },
                { label:"Canceladas", value:os.filter(o=>o.status==="cancelado").length, icon:XCircle, color:"text-red-400" },
              ].map(s => { const Icon = s.icon; return (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1 text-sm"><Icon className={"h-4 w-4 "+s.color}/>{s.label}</span>
                  <span className={"font-bold "+s.color}>{loading?"—":s.value}</span>
                </div>
              );})}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select value={filtro} onChange={e => setFiltro(e.target.value)} className="bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">
            <option value="todos">Todos os mecânicos</option>
            {mecanicos.map(m => <option key={m.nome} value={m.nome}>{m.nome}</option>)}
          </select>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800"><tr>
              {["OS","Cliente","Veículo","Mecânico","Status","Valor",""].map(h =>
                <th key={h} className="px-4 py-3 text-left text-zinc-400 font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-500"/></td></tr>
              : filtered.map(o => (
                <tr key={o.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 cursor-pointer" onClick={() => navigate("/ordens-servico/"+o.id)}>
                  <td className="px-4 py-3 font-mono text-blue-400 text-xs">{o.numero_os}</td>
                  <td className="px-4 py-3 text-zinc-200">{o.cliente_nome||"—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{o.veiculo_modelo||"—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{o.mecanico_nome||"—"}</td>
                  <td className="px-4 py-3"><Badge className={(STATUS_BADGE[o.status]||"bg-zinc-700 text-zinc-300")+" text-xs"}>{o.status?.replace(/_/g," ")}</Badge></td>
                  <td className="px-4 py-3 text-green-400">{fmt(o.valor_total)}</td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white text-xs">Ver →</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminLayout>
  );
}
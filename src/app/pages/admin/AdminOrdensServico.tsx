import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FileText, Plus, Search, RefreshCw, Loader2, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

const STATUS_COLORS: Record<string,string> = {
  diagnostico:"bg-zinc-700 text-zinc-300", orcamento:"bg-yellow-900/50 text-yellow-300",
  aguardando_aprovacao:"bg-orange-900/50 text-orange-300", aprovado:"bg-blue-900/50 text-blue-300",
  em_execucao:"bg-purple-900/50 text-purple-300", concluido:"bg-green-900/50 text-green-300",
  entregue:"bg-teal-900/50 text-teal-300", cancelado:"bg-red-900/50 text-red-300",
};

const TODOS_STATUS = ["diagnostico","orcamento","aguardando_aprovacao","aprovado","em_execucao","concluido","entregue","cancelado"];

interface OS {
  id:number; numero_os:string; status:string; cliente_nome:string;
  veiculo_placa:string; veiculo_modelo:string; mecanico_nome:string;
  valor_total:number; created_at:string;
}

export default function AdminOrdensServico() {
  const navigate = useNavigate();
  const [os, setOs] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [page, setPage] = useState(0);
  const PAGE = 20;

  useEffect(() => { load(); }, [statusFiltro, page]);

  async function load() {
    setLoading(true);
    let q = sb.from("06_OS")
      .select("id,numero_os,status,cliente_nome,veiculo_placa,veiculo_modelo,mecanico_nome,valor_total,created_at")
      .order("created_at",{ascending:false})
      .range(page*PAGE, (page+1)*PAGE-1);
    if (statusFiltro !== "todos") q = q.eq("status", statusFiltro);
    const { data } = await q;
    setOs(data||[]);
    setLoading(false);
  }

  const filtered = os.filter(o => {
    const q = search.toLowerCase();
    return !q || o.numero_os?.toLowerCase().includes(q) || o.cliente_nome?.toLowerCase().includes(q) || o.veiculo_placa?.toLowerCase().includes(q);
  });

  const fmt = (v:number) => v ? v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
  const fmtDate = (d:string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><FileText className="h-8 w-8 text-purple-400"/>Ordens de Serviço</h1>
            <p className="text-zinc-400 mt-1">Gerenciar OS do sistema</p>
          </div>
          <Button onClick={() => navigate("/ordens-servico/nova")} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2"/>Nova OS</Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"/>
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar OS, cliente, placa..." className="pl-10 bg-zinc-800 border-zinc-700 text-white"/>
          </div>
          <select value={statusFiltro} onChange={e => { setStatusFiltro(e.target.value); setPage(0); }}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">
            <option value="todos">Todos os status</option>
            {TODOS_STATUS.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
          </select>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>{["Número","Cliente","Veículo","Mecânico","Status","Valor","Data",""].map(h =>
                <th key={h} className="px-4 py-3 text-left text-zinc-400 font-medium">{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {loading ? (<tr><td colSpan={8} className="py-16 text-center text-zinc-500"><Loader2 className="h-6 w-6 animate-spin mx-auto mb-2"/>Carregando...</td></tr>)
              : filtered.length === 0 ? (<tr><td colSpan={8} className="py-16 text-center text-zinc-500">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30"/>
                <p>Nenhuma OS encontrada</p>
                <Button onClick={() => navigate("/ordens-servico/nova")} className="mt-3 bg-red-600 hover:bg-red-700 text-sm">Criar primeira OS</Button>
              </td></tr>)
              : filtered.map(o => (
                <tr key={o.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 cursor-pointer" onClick={() => navigate("/ordens-servico/"+o.id)}>
                  <td className="px-4 py-3 font-mono text-blue-400 text-xs">{o.numero_os||"—"}</td>
                  <td className="px-4 py-3 text-white font-medium">{o.cliente_nome||"—"}</td>
                  <td className="px-4 py-3"><p className="text-zinc-300">{o.veiculo_modelo||"—"}</p><p className="text-zinc-500 text-xs">{o.veiculo_placa}</p></td>
                  <td className="px-4 py-3 text-zinc-400">{o.mecanico_nome||"—"}</td>
                  <td className="px-4 py-3"><Badge className={(STATUS_COLORS[o.status]||"bg-zinc-700 text-zinc-300")+" text-xs"}>{o.status?.replace(/_/g," ")||"—"}</Badge></td>
                  <td className="px-4 py-3 text-green-400 font-medium">{fmt(o.valor_total)}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{fmtDate(o.created_at)}</td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs">Ver →</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <span className="text-zinc-500 text-xs">Página {page+1}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page===0} onClick={() => setPage(p=>p-1)} className="border-zinc-700 text-zinc-300 h-7 text-xs">← Anterior</Button>
              <Button size="sm" variant="outline" disabled={os.length < PAGE} onClick={() => setPage(p=>p+1)} className="border-zinc-700 text-zinc-300 h-7 text-xs">Próxima →</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
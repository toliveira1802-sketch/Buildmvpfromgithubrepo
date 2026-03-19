import { useState, useEffect } from "react";
import { TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://acuufrgoyjwzlyhopaus.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4");
export default function AdminVendas() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await sb.from("06_OS")
      .select("id,numero_os,status,cliente_nome,veiculo_modelo,valor_total,created_at")
      .in("status",["concluido","entregue"])
      .order("created_at",{ascending:false}).limit(30);
    setRows(data||[]);
    setLoading(false);
  }
  const fmt = (v:number) => (v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const fmtDate = (d:string) => new Date(d).toLocaleDateString("pt-BR");
  const total = rows.reduce((s,r) => s+(r.valor_total||0),0);
  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-green-400"/>Vendas</h1>
            <p className="text-zinc-400 mt-1">OS finalizadas — receita gerada</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right"><p className="text-xs text-zinc-500">Total</p><p className="text-green-400 font-bold text-lg">{fmt(total)}</p></div>
            <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
          </div>
        </div>
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800"><tr>
              <th className="px-4 py-3 text-left text-zinc-400">OS</th>
              <th className="px-4 py-3 text-left text-zinc-400">Cliente</th>
              <th className="px-4 py-3 text-left text-zinc-400">Status</th>
              <th className="px-4 py-3 text-right text-zinc-400">Valor</th>
              <th className="px-4 py-3 text-right text-zinc-400">Data</th>
            </tr></thead>
            <tbody>
              {loading ? (<tr><td colSpan={5} className="py-12 text-center text-zinc-500"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></td></tr>)
              : rows.length === 0 ? (<tr><td colSpan={5} className="py-12 text-center text-zinc-500">Nenhum registro</td></tr>)
              : rows.map(r => (
                <tr key={r.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-mono text-blue-400 text-xs">{r.numero_os}</td>
                  <td className="px-4 py-3 text-zinc-200">{r.cliente_nome||"—"}</td>
                  <td className="px-4 py-3"><Badge className="bg-zinc-800 text-zinc-300 text-xs">{r.status?.replace(/_/g," ")}</Badge></td>
                  <td className="px-4 py-3 text-right text-green-400 font-medium">{fmt(r.valor_total)}</td>
                  <td className="px-4 py-3 text-right text-zinc-500 text-xs">{fmtDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        
      </div>
    </AdminLayout>
  );
}
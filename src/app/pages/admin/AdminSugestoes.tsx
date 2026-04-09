import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw, Loader2, MessageSquare } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../shared/ui/card';
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";

export default function AdminSugestoes() {
  const [os, setOs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("ordens_servico")
      .select("id,numero_os,cliente_nome,veiculo_modelo,valor_total,created_at")
      .in("status",["concluido","entregue"])
      .order("created_at",{ascending:false}).limit(20);
    setOs(data||[]);
    setLoading(false);
  }

  const fmt = (d:string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Lightbulb className="h-8 w-8 text-blue-400" />Sugestões
            </h1>
            <p className="text-zinc-400 mt-1">Sugestões de melhoria dos clientes</p>
          </div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300">
            <RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")} />
          </Button>
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">OS Recentes Finalizadas</CardTitle>
            <CardDescription className="text-zinc-400">Base para registrar feedback dos clientes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-zinc-400"/></div>
            : os.length === 0 ? <p className="text-zinc-500 text-sm text-center py-8">Nenhuma OS finalizada ainda</p>
            : <table className="w-full text-sm"><thead><tr className="text-zinc-400 text-xs border-b border-zinc-800">
                <th className="pb-2 text-left">OS</th><th className="pb-2 text-left">Cliente</th><th className="pb-2 text-left">Veículo</th><th className="pb-2 text-right">Data</th>
              </tr></thead><tbody>
              {os.map(o => (
                <tr key={o.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-2 font-mono text-blue-400 text-xs">{o.numero_os}</td>
                  <td className="py-2 text-zinc-200">{o.cliente_nome||"—"}</td>
                  <td className="py-2 text-zinc-400">{o.veiculo_modelo||"—"}</td>
                  <td className="py-2 text-right text-zinc-500 text-xs">{fmt(o.created_at)}</td>
                </tr>
              ))}
            </tbody></table>}
          </CardContent>
        </Card>
        <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <p className="text-zinc-400 text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4"/>Módulo de Sugestões em desenvolvimento — vinculação com clientes e OS via 04_CLIENTS + 06_OS</p>
        </div>
      </div>
    </AdminLayout>
  );
}
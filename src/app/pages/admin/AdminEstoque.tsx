import { useState, useEffect } from "react";
import { Package, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://acuufrgoyjwzlyhopaus.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4");
export default function AdminEstoque() {
  const [itens, setItens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await sb.from("07_OS_ITENS")
      .select("descricao,tipo,quantidade,valor_unitario")
      .eq("tipo","peca")
      .order("created_at",{ascending:false}).limit(50);
    setItens(data||[]);
    setLoading(false);
  }
  const fmt = (v:number) => (v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Package className="h-8 w-8 text-cyan-400"/>Estoque</h1>
            <p className="text-zinc-400 mt-1">Peças utilizadas em OS — via 07_OS_ITENS</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white">Peças Recentes em OS</CardTitle></CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin"/></div>
            : itens.length === 0 ? <p className="text-zinc-500 text-sm text-center py-8">Nenhuma peça em OS ainda</p>
            : <table className="w-full text-sm"><thead><tr className="text-zinc-400 text-xs border-b border-zinc-800">
                <th className="pb-2 text-left">Peça</th><th className="pb-2 text-right">Qtd</th><th className="pb-2 text-right">Unit.</th>
              </tr></thead><tbody>
              {itens.map((item,i) => (
                <tr key={i} className="border-b border-zinc-800/50">
                  <td className="py-2 text-zinc-200">{item.descricao||"—"}</td>
                  <td className="py-2 text-right text-zinc-400">{item.quantidade}</td>
                  <td className="py-2 text-right text-green-400">{fmt(item.valor_unitario)}</td>
                </tr>
              ))}
            </tbody></table>}
          </CardContent>
        </Card>
        <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <p className="text-zinc-400 text-sm">Gestão de estoque dedicada em desenvolvimento — dados baseados em 07_OS_ITENS</p>
        </div>
      </div>
    </AdminLayout>
  );
}
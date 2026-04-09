import { useState, useEffect } from "react";
import { Truck, RefreshCw, Loader2, Package } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../shared/ui/card';
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";
import { EmpresaToggle } from '../../shared/components/EmpresaToggle';

export default function GestaoFornecedores() {
  const [pecas, setPecas] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalPecas:0, totalGasto:0, osComPecas:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("ordens_servico_itens").select("descricao,tipo,quantidade,valor_unitario,valor_total,os_id").eq("tipo","peca");
    const rows = data||[];
    const descMap: Record<string,{count:number,total:number}> = {};
    rows.forEach(r => {
      const k = r.descricao||"Peça sem nome";
      if (!descMap[k]) descMap[k] = {count:0,total:0};
      descMap[k].count += r.quantidade||1;
      descMap[k].total += r.valor_total||0;
    });
    const arr = Object.entries(descMap).map(([nome,v]) => ({nome,...v})).sort((a,b) => b.total-a.total).slice(0,20);
    setPecas(arr);
    const totalGasto = rows.reduce((s,r) => s+(r.valor_total||0),0);
    const osIds = new Set(rows.map(r => r.os_id));
    setStats({ totalPecas:arr.length, totalGasto, osComPecas:osIds.size });
    setLoading(false);
  }

  const fmt = (v:number) => (v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Truck className="h-8 w-8 text-blue-400"/>Fornecedores</h1>
            <p className="text-zinc-400 mt-1">Peças utilizadas em OS — base para gestão de fornecedores</p></div>
          <div className="flex items-center gap-3">
            <EmpresaToggle />
            <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Tipos de Peça", value:stats.totalPecas.toString(), color:"text-blue-400" },
            { label:"Gasto em Peças", value:fmt(stats.totalGasto), color:"text-green-400" },
            { label:"OS com Peças", value:stats.osComPecas.toString(), color:"text-white" },
          ].map(k => (
            <Card key={k.label} className="bg-zinc-900 border-zinc-800 p-4">
              <p className="text-xs text-zinc-400">{k.label}</p>
              <p className={"text-xl font-bold "+k.color}>{loading?"—":k.value}</p>
            </Card>
          ))}
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Package className="h-4 w-4 text-blue-400"/>Peças Mais Utilizadas</CardTitle>
            <CardDescription className="text-zinc-400">Via 07_OS_ITENS — top 20 por valor total</CardDescription></CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin"/></div>
            : pecas.length === 0 ? <p className="text-zinc-500 text-sm text-center py-8">Nenhuma peça em OS ainda</p>
            : <table className="w-full text-sm"><thead><tr className="text-zinc-400 text-xs border-b border-zinc-800">
                <th className="pb-2 text-left">#</th>
                <th className="pb-2 text-left">Peça</th>
                <th className="pb-2 text-right">Qtd</th>
                <th className="pb-2 text-right">Total</th>
              </tr></thead><tbody>
              {pecas.map((p,i) => (
                <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-2 text-zinc-600 text-xs">{i+1}</td>
                  <td className="py-2 text-zinc-200">{p.nome}</td>
                  <td className="py-2 text-right text-zinc-400">{p.count}</td>
                  <td className="py-2 text-right text-green-400 font-medium">{fmt(p.total)}</td>
                </tr>
              ))}
            </tbody></table>}
          </CardContent>
        </Card>
        <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <p className="text-zinc-400 text-sm">Cadastro de fornecedores em desenvolvimento — dados baseados em 07_OS_ITENS</p>
        </div>
      </div>
    </AdminLayout>
  );
}
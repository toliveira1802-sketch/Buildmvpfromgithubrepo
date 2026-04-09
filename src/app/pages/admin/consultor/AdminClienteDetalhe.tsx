import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, User, Phone, Mail, Car, FileText, Loader2, MapPin, CreditCard } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/ui/card';
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";
export default function AdminClienteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<any>(null);
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [os, setOs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (id) load(); }, [id]);
  async function load() {
    setLoading(true);
    const [cli, veics, ordens] = await Promise.all([
      sb.from("clients").select("*").eq("id",id).single(),
      sb.from("vehicles").select("*").eq("client_id",id).order("created_at",{ascending:false}),
      sb.from("ordens_servico").select("id,numero_os,status,valor_total,created_at,mecanico_nome,veiculo_modelo").eq("client_id",id).order("created_at",{ascending:false}).limit(10),
    ]);
    setCliente(cli.data);
    setVeiculos(veics.data||[]);
    setOs(ordens.data||[]);
    setLoading(false);
  }
  const fmt = (v:number) => (v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const fmtDate = (d:string) => d ? new Date(d).toLocaleDateString("pt-BR") : "—";
  const STATUS_BADGE: Record<string,string> = {
    diagnostico:"bg-zinc-700 text-zinc-300", orcamento:"bg-yellow-900/50 text-yellow-300",
    aprovado:"bg-blue-900/50 text-blue-300", em_execucao:"bg-purple-900/50 text-purple-300",
    concluido:"bg-green-900/50 text-green-300", entregue:"bg-teal-900/50 text-teal-300",
    cancelado:"bg-red-900/50 text-red-300",
  };
  if (loading) return (<AdminLayout><div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-blue-400"/></div></AdminLayout>);
  if (!cliente) return (<AdminLayout><div className="p-6 text-zinc-400">Cliente nao encontrado. <Button onClick={() => navigate(-1)} variant="ghost">Voltar</Button></div></AdminLayout>);
  const totalGasto = os.filter(o => ["concluido","entregue"].includes(o.status)).reduce((s,o) => s+(o.valor_total||0),0);
  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)} variant="ghost" className="text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4 mr-1"/>Voltar</Button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><User className="h-6 w-6 text-blue-400"/>{cliente.full_name||"—"}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
            <CardHeader><CardTitle className="text-white text-sm text-zinc-400">Dados do Cliente</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-zinc-500 text-xs">Nome</p><p className="text-white">{cliente.full_name||"—"}</p></div>
              <div><p className="text-zinc-500 text-xs">CPF</p><p className="text-zinc-300 font-mono">{cliente.cpf||"—"}</p></div>
              <div><p className="text-zinc-500 text-xs flex items-center gap-1"><Phone className="h-3 w-3"/>Telefone</p><p className="text-zinc-300">{cliente.phone||"—"}</p></div>
              <div><p className="text-zinc-500 text-xs flex items-center gap-1"><Mail className="h-3 w-3"/>Email</p><p className="text-zinc-300">{cliente.email||"—"}</p></div>
              <div><p className="text-zinc-500 text-xs flex items-center gap-1"><MapPin className="h-3 w-3"/>Cidade</p><p className="text-zinc-300">{cliente.cidade||"—"} {cliente.estado && "/ "+cliente.estado}</p></div>
              <div><p className="text-zinc-500 text-xs">Cadastro</p><p className="text-zinc-300">{fmtDate(cliente.created_at)}</p></div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white text-sm">Resumo</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-3 bg-green-950/30 rounded-lg border border-green-900/40">
                <p className="text-xs text-zinc-400">Total Gasto</p>
                <p className="text-green-400 font-bold text-xl">{fmt(totalGasto)}</p>
              </div>
              <div className="flex justify-between text-sm"><span className="text-zinc-400">OS totais</span><span className="text-white">{os.length}</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Veículos</span><span className="text-white">{veiculos.length}</span></div>
            </CardContent>
          </Card>
        </div>
        {veiculos.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Car className="h-4 w-4 text-blue-400"/>Veículos ({veiculos.length})</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {veiculos.map(v => (
                <div key={v.id} className="p-3 rounded-lg border border-zinc-700 bg-zinc-800/50">
                  <p className="text-white font-medium">{v.modelo||"—"} {v.marca && "· "+v.marca}</p>
                  <p className="text-zinc-400 text-sm font-mono">{v.placa}</p>
                  <p className="text-zinc-500 text-xs">{v.ano||""} {v.ultima_km && "· KM: "+v.ultima_km}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><FileText className="h-4 w-4 text-purple-400"/>Ordens de Serviço ({os.length})</CardTitle></CardHeader>
          <CardContent>
            {os.length === 0 ? <p className="text-zinc-500 text-sm">Nenhuma OS ainda</p>
            : <table className="w-full text-sm"><thead><tr className="text-zinc-400 text-xs border-b border-zinc-800">
                <th className="pb-2 text-left">OS</th><th className="pb-2 text-left">Status</th><th className="pb-2 text-left">Veículo</th><th className="pb-2 text-right">Valor</th><th className="pb-2 text-right">Data</th>
              </tr></thead><tbody>
              {os.map(o => (
                <tr key={o.id} onClick={() => navigate("/ordens-servico/"+o.id)}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer">
                  <td className="py-2 font-mono text-blue-400 text-xs">{o.numero_os}</td>
                  <td className="py-2"><Badge className={(STATUS_BADGE[o.status]||"bg-zinc-700 text-zinc-300")+" text-xs"}>{o.status?.replace(/_/g," ")}</Badge></td>
                  <td className="py-2 text-zinc-400">{o.veiculo_modelo||"—"}</td>
                  <td className="py-2 text-right text-green-400">{fmt(o.valor_total)}</td>
                  <td className="py-2 text-right text-zinc-500 text-xs">{fmtDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody></table>}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
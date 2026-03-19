import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, FileText, Car, User, Wrench, Clock, CheckCircle, ChevronRight, Loader2, DollarSign } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

const STATUS_SEQ = ["diagnostico","orcamento","aguardando_aprovacao","aprovado","em_execucao","concluido","entregue"];
const STATUS_BADGE: Record<string,string> = {
  diagnostico:"bg-zinc-700 text-zinc-300", orcamento:"bg-yellow-900/50 text-yellow-300",
  aguardando_aprovacao:"bg-orange-900/50 text-orange-300", aprovado:"bg-blue-900/50 text-blue-300",
  em_execucao:"bg-purple-900/50 text-purple-300", concluido:"bg-green-900/50 text-green-300",
  entregue:"bg-teal-900/50 text-teal-300", cancelado:"bg-red-900/50 text-red-300",
};

export default function AdminOSDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [os, setOs] = useState<any>(null);
  const [itens, setItens] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    setLoading(true);
    const [osRes, itensRes, histRes] = await Promise.all([
      sb.from("06_OS").select("*").eq("id", id).single(),
      sb.from("07_OS_ITENS").select("*").eq("os_id", id).order("created_at"),
      sb.from("08_OS_HISTORICO").select("*").eq("os_id", id).order("created_at",{ascending:false}),
    ]);
    setOs(osRes.data);
    setItens(itensRes.data||[]);
    setHistorico(histRes.data||[]);
    setLoading(false);
  }

  async function avancarStatus() {
    if (!os) return;
    const idx = STATUS_SEQ.indexOf(os.status);
    if (idx < 0 || idx >= STATUS_SEQ.length-1) return;
    setAdvancing(true);
    await sb.from("06_OS").update({status:STATUS_SEQ[idx+1]}).eq("id",os.id);
    await load();
    setAdvancing(false);
  }

  async function cancelar() {
    if (!os || !confirm("Cancelar esta OS?")) return;
    setCanceling(true);
    await sb.from("06_OS").update({status:"cancelado"}).eq("id",os.id);
    await load();
    setCanceling(false);
  }

  const fmt = (v:number) => (v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const fmtDate = (d:string) => d ? new Date(d).toLocaleString("pt-BR") : "—";
  const statusIdx = os ? STATUS_SEQ.indexOf(os.status) : -1;
  const totalItens = itens.reduce((s,i) => s+(i.valor_total||0),0);

  if (loading) return (<AdminLayout><div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-purple-400"/></div></AdminLayout>);
  if (!os) return (<AdminLayout><div className="p-6 text-zinc-400">OS não encontrada. <Button onClick={() => navigate(-1)} variant="ghost">Voltar</Button></div></AdminLayout>);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)} variant="ghost" className="text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4 mr-1"/>Voltar</Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="h-6 w-6 text-purple-400"/>{os.numero_os||"OS #"+os.id}</h1>
            <p className="text-zinc-400 text-sm">{fmtDate(os.created_at)}</p>
          </div>
          <Badge className={(STATUS_BADGE[os.status]||"bg-zinc-700 text-zinc-300")+" text-sm px-3 py-1"}>{os.status?.replace(/_/g," ")}</Badge>
        </div>

        {/* Timeline de Status */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {STATUS_SEQ.filter(s=>s!=="cancelado").map((s,i) => {
                const done = statusIdx > i || os.status==="entregue";
                const active = s===os.status;
                return (
                  <div key={s} className="flex items-center">
                    <div className={"flex-shrink-0 text-xs px-2 py-1 rounded "+(active?"bg-purple-700 text-white font-medium":done?"bg-green-900/40 text-green-400":"bg-zinc-800 text-zinc-600")}>
                      {s.replace(/_/g," ")}
                    </div>
                    {i < STATUS_SEQ.length-2 && <ChevronRight className={"h-3 w-3 flex-shrink-0 "+(done?"text-green-400":"text-zinc-700")}/>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-400 flex items-center gap-1"><User className="h-4 w-4"/>Cliente</CardTitle></CardHeader>
            <CardContent><p className="text-white font-medium">{os.cliente_nome||"—"}</p><p className="text-zinc-400 text-sm">{os.cliente_telefone||""}</p></CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-400 flex items-center gap-1"><Car className="h-4 w-4"/>Veículo</CardTitle></CardHeader>
            <CardContent><p className="text-white font-medium">{os.veiculo_modelo||"—"}</p><p className="text-zinc-400 text-sm">{os.veiculo_placa} {os.veiculo_marca && "· "+os.veiculo_marca}</p><p className="text-zinc-500 text-xs">{os.km_entrada ? "KM: "+os.km_entrada : ""}</p></CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-400 flex items-center gap-1"><Wrench className="h-4 w-4"/>Mecânico</CardTitle></CardHeader>
            <CardContent><p className="text-white font-medium">{os.mecanico_nome||"Não atribuído"}</p><p className="text-zinc-400 text-sm">{os.tipo_servico_principal||""}</p></CardContent>
          </Card>
        </div>

        {os.descricao_problema && (
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white text-sm">Problema Relatado</CardTitle></CardHeader>
            <CardContent><p className="text-zinc-300">{os.descricao_problema}</p></CardContent>
          </Card>
        )}

        <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-400"/>Itens ({itens.length})</CardTitle></CardHeader>
          <CardContent>
            {itens.length === 0 ? <p className="text-zinc-500 text-sm">Nenhum item adicionado</p> : (
              <table className="w-full text-sm"><thead><tr className="text-zinc-400 text-xs border-b border-zinc-800">
                <th className="pb-2 text-left">Item</th><th className="pb-2 text-left">Tipo</th><th className="pb-2 text-right">Qtd</th><th className="pb-2 text-right">Unit.</th><th className="pb-2 text-right">Total</th>
              </tr></thead><tbody>
                {itens.map(item => (
                  <tr key={item.id} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-200">{item.descricao||item.nome}</td>
                    <td className="py-2"><Badge className="bg-zinc-800 text-zinc-400 text-xs">{item.tipo}</Badge></td>
                    <td className="py-2 text-right text-zinc-400">{item.quantidade}</td>
                    <td className="py-2 text-right text-zinc-400">{fmt(item.valor_unitario)}</td>
                    <td className="py-2 text-right text-green-400 font-medium">{fmt(item.valor_total)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-zinc-700">
                  <td colSpan={4} className="py-2 text-right text-zinc-300 font-medium">Total</td>
                  <td className="py-2 text-right text-green-400 font-bold text-lg">{fmt(totalItens)}</td>
                </tr>
              </tbody></table>
            )}
          </CardContent>
        </Card>

        {historico.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white flex items-center gap-2"><Clock className="h-4 w-4 text-zinc-400"/>Histórico</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {historico.map((h,i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 flex-shrink-0"/>
                  <div><span className="text-zinc-400">{h.status_anterior} → </span><span className="text-white font-medium">{h.status_novo}</span><span className="text-zinc-500 text-xs ml-2">{fmtDate(h.created_at)}</span></div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {os.status !== "entregue" && os.status !== "cancelado" && (
          <div className="flex gap-3 pt-2">
            {statusIdx < STATUS_SEQ.length-1 && (
              <Button onClick={avancarStatus} disabled={advancing} className="bg-purple-700 hover:bg-purple-600 flex-1">
                {advancing ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <CheckCircle className="h-4 w-4 mr-2"/>}
                Avançar para {STATUS_SEQ[statusIdx+1]?.replace(/_/g," ")}
              </Button>
            )}
            <Button onClick={cancelar} disabled={canceling} variant="outline" className="border-red-800 text-red-400 hover:bg-red-950">
              {canceling ? <Loader2 className="h-4 w-4 animate-spin"/> : "Cancelar OS"}
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Car, User, Wrench, Clock, CheckCircle2, Loader2,
  DollarSign, Plus, Trash2, Send, Link, MessageCircle,
  Tag, Edit, ChevronRight, AlertCircle, ThumbsUp, ThumbsDown, X
} from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { Textarea } from '../../shared/ui/textarea';
import { Input } from '../../shared/ui/input';
import { Label } from '../../shared/ui/label';
import { toast } from "sonner";
import ConsultorLayout from "../../components/ConsultorLayout";
import { supabase as sb } from "../../../lib/supabase";

const STATUS_FLOW = [
  { key: "diagnostico",          label: "Diagnóstico",          color: "bg-purple-600" },
  { key: "orcamento",            label: "Orçamento",            color: "bg-yellow-600" },
  { key: "aguardando_aprovacao", label: "Aguardando Aprovação", color: "bg-orange-500" },
  { key: "aprovado",             label: "Aprovado",             color: "bg-blue-600" },
  { key: "em_execucao",          label: "Em Execução",          color: "bg-indigo-600" },
  { key: "aguardando_peca",      label: "Aguardando Peça",      color: "bg-amber-600" },
  { key: "concluido",            label: "Pronto",               color: "bg-green-600" },
  { key: "entregue",             label: "Entregue",             color: "bg-teal-600" },
  { key: "cancelado",            label: "Cancelado",            color: "bg-red-600" },
];

const STATUS_BADGE: Record<string, string> = {
  diagnostico: "bg-purple-900/60 text-purple-300 border-purple-700",
  orcamento: "bg-yellow-900/60 text-yellow-300 border-yellow-700",
  aguardando_aprovacao: "bg-orange-900/60 text-orange-300 border-orange-700",
  aprovado: "bg-blue-900/60 text-blue-300 border-blue-700",
  em_execucao: "bg-indigo-900/60 text-indigo-300 border-indigo-700",
  aguardando_peca: "bg-amber-900/60 text-amber-300 border-amber-700",
  concluido: "bg-green-900/60 text-green-300 border-green-700",
  entregue: "bg-teal-900/60 text-teal-300 border-teal-700",
  cancelado: "bg-red-900/60 text-red-300 border-red-700",
};

const fmt = (v: number) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = (d: string) => d ? new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

export default function AdminOSDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [os, setOs] = useState<any>(null);
  const [itens, setItens] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [obs, setObs] = useState("");
  const [sendingObs, setSendingObs] = useState(false);
  const [novoItem, setNovoItem] = useState({ tipo: "servico", descricao: "", quantidade: "1", valor_unitario: "" });
  const [addingItem, setAddingItem] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    setLoading(true);
    const [osRes, itensRes, histRes] = await Promise.all([
      sb.from("ordens_servico").select("*").eq("id", id).single(),
      sb.from("ordens_servico_itens").select("*").eq("os_id", id).order("created_at"),
      sb.from("ordens_servico_historico").select("*").eq("os_id", id).order("created_at", { ascending: true }),
    ]);
    setOs(osRes.data);
    setItens(itensRes.data || []);
    setHistorico(histRes.data || []);
    setLoading(false);
  }

  async function moverStatus(novoStatus: string) {
    if (!os || os.status === novoStatus) return;
    if (novoStatus === "cancelado" && !confirm("Cancelar esta OS?")) return;
    await sb.from("ordens_servico").update({ status: novoStatus }).eq("id", os.id);
    toast.success(`Status → ${novoStatus.replace(/_/g, " ")}`);
    await load();
  }

  async function toggleItemStatus(item: any, novoStatus: string) {
    await sb.from("ordens_servico_itens").update({ status: novoStatus }).eq("id", item.id);
    await load();
  }

  async function removeItem(itemId: string) {
    if (!confirm("Remover este item?")) return;
    await sb.from("ordens_servico_itens").delete().eq("id", itemId);
    toast.success("Item removido");
    await load();
  }

  async function addItem() {
    if (!novoItem.descricao || !novoItem.valor_unitario) { toast.error("Preencha descrição e valor"); return; }
    setAddingItem(true);
    const qtd = parseFloat(novoItem.quantidade) || 1;
    const unit = parseFloat(novoItem.valor_unitario) || 0;
    await sb.from("ordens_servico_itens").insert({
      os_id: id, tipo: novoItem.tipo, descricao: novoItem.descricao,
      quantidade: qtd, valor_unitario: unit, valor_total: qtd * unit, status: "pendente"
    });
    setNovoItem({ tipo: "servico", descricao: "", quantidade: "1", valor_unitario: "" });
    setShowAddItem(false);
    toast.success("Item adicionado");
    await load();
    setAddingItem(false);
  }

  async function enviarObs() {
    if (!obs.trim()) return;
    setSendingObs(true);
    await sb.from("ordens_servico_historico").insert({
      os_id: id, empresa_id: os.empresa_id,
      status_novo: os.status, status_anterior: os.status,
      descricao: obs.trim(),
    });
    setObs("");
    await load();
    setSendingObs(false);
  }

  if (loading) return (
    <ConsultorLayout>
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-8 animate-spin text-blue-400" />
      </div>
    </ConsultorLayout>
  );

  if (!os) return (
    <ConsultorLayout>
      <div className="p-6 text-zinc-400">OS não encontrada. <Button onClick={() => navigate(-1)} variant="ghost">Voltar</Button></div>
    </ConsultorLayout>
  );

  const totalOrcado = itens.reduce((s, i) => s + (i.valor_total || 0), 0);
  const totalAprovado = itens.filter(i => i.status === "aprovado").reduce((s, i) => s + (i.valor_total || 0), 0);
  const totalRecusado = itens.filter(i => i.status === "recusado").reduce((s, i) => s + (i.valor_total || 0), 0);
  const statusBadge = STATUS_BADGE[os.status] || "bg-zinc-700 text-zinc-300 border-zinc-600";
  const statusFlow = STATUS_FLOW.find(s => s.key === os.status);

  return (
    <ConsultorLayout>
      <div className="min-h-screen bg-zinc-950 p-4 md:p-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white"><ArrowLeft className="size-5" /></button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{os.numero_os || "OS #" + os.id.slice(0,8)}</h1>
              <Badge className={`text-xs border px-2 py-0.5 ${statusBadge}`}>{statusFlow?.label || os.status}</Badge>
              <Badge className="text-xs bg-zinc-800 text-zinc-400 border border-zinc-700">{os.prioridade}</Badge>
            </div>
            <p className="text-zinc-500 text-xs mt-0.5">Entrada: {fmtDate(os.created_at)}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white gap-1.5 text-xs h-8">
              <Link className="size-3.5" /> Link Cliente
            </Button>
            <Button variant="outline" size="sm" className="border-green-700 text-green-400 hover:bg-green-950 gap-1.5 text-xs h-8">
              <MessageCircle className="size-3.5" /> WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white gap-1.5 text-xs h-8">
              <Tag className="size-3.5" /> Etiqueta
            </Button>
            <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white gap-1.5 text-xs h-8">
              <Edit className="size-3.5" /> Editar
            </Button>
          </div>
        </div>

        {/* MOVER STATUS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-zinc-500 mr-1">Mover para:</span>
            {STATUS_FLOW.filter(s => s.key !== "cancelado").map(s => (
              <button key={s.key} onClick={() => moverStatus(s.key)}
                className={`text-xs px-3 py-1 rounded-full border transition-all font-medium ${os.status === s.key
                  ? `${s.color} text-white border-transparent`
                  : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500"}`}>
                {s.label}
              </button>
            ))}
            <button onClick={() => moverStatus("cancelado")}
              className="text-xs px-3 py-1 rounded-full border bg-zinc-800 text-red-400 border-red-900 hover:bg-red-950 font-medium ml-auto">
              Cancelar
            </button>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* COLUNA ESQUERDA */}
          <div className="lg:col-span-2 space-y-4">

            {/* Veículo + Cliente */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3"><Car className="size-3.5" /> Veículo</div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-zinc-500">Placa</span><span className="text-blue-400 font-mono font-bold">{os.veiculo_placa || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Modelo</span><span className="text-white">{os.veiculo_modelo || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Marca</span><span className="text-white">{os.veiculo_marca || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Ano</span><span className="text-white">{os.veiculo_ano || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">KM</span><span className="text-white">{os.km_entrada?.toLocaleString() || "—"}</span></div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3"><User className="size-3.5" /> Cliente</div>
                <div className="space-y-1.5 text-sm">
                  <div><span className="text-white font-medium">{os.client_nome || "—"}</span></div>
                  <div><span className="text-zinc-400">{os.client_phone || "—"}</span></div>
                  {os.client_id && (
                    <button onClick={() => navigate(`/clientes/${os.client_id}`)} className="text-blue-400 text-xs hover:underline mt-1">
                      Ver perfil completo →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnóstico & Serviço */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3"><Wrench className="size-3.5" /> Diagnóstico & Serviço</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Motivo</p>
                  <p className="text-zinc-200">{os.descricao_problema || "—"}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Tipo de Serviço</p>
                  <p className="text-zinc-200">{os.diagnostico || "—"}</p>
                </div>
              </div>
              {os.observacoes && (
                <div className="mt-3 pt-3 border-t border-zinc-800 text-sm">
                  <p className="text-zinc-500 text-xs mb-1">Observações</p>
                  <p className="text-zinc-300">{os.observacoes}</p>
                </div>
              )}
            </div>

            {/* Itens do Orçamento */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-3.5 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Itens do Orçamento</span>
                  <Badge className="bg-zinc-800 text-zinc-400 text-xs">{itens.length}</Badge>
                </div>
                <Button onClick={() => setShowAddItem(v => !v)} size="sm"
                  className="bg-blue-600 hover:bg-blue-700 h-7 px-3 text-xs gap-1">
                  <Plus className="size-3" /> Adicionar
                </Button>
              </div>

              {showAddItem && (
                <div className="mb-4 p-3 bg-zinc-800 rounded-lg space-y-2">
                  <div className="flex gap-2">
                    <select value={novoItem.tipo} onChange={e => setNovoItem(p => ({...p, tipo: e.target.value}))}
                      className="bg-zinc-700 border border-zinc-600 text-white rounded px-2 py-1.5 text-xs w-24">
                      {["servico","peca","fluido","outros"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <Input placeholder="Descrição *" value={novoItem.descricao} onChange={e => setNovoItem(p => ({...p, descricao: e.target.value}))}
                      className="flex-1 bg-zinc-700 border-zinc-600 text-white text-xs h-8" />
                    <Input type="number" placeholder="Qtd" value={novoItem.quantidade} onChange={e => setNovoItem(p => ({...p, quantidade: e.target.value}))}
                      className="w-14 bg-zinc-700 border-zinc-600 text-white text-xs h-8" />
                    <Input type="number" placeholder="R$" value={novoItem.valor_unitario} onChange={e => setNovoItem(p => ({...p, valor_unitario: e.target.value}))}
                      className="w-20 bg-zinc-700 border-zinc-600 text-white text-xs h-8" />
                    <Button onClick={addItem} disabled={addingItem} size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 px-2">
                      {addingItem ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
                    </Button>
                    <Button onClick={() => setShowAddItem(false)} variant="ghost" size="sm" className="h-8 px-2 text-zinc-400">
                      <X className="size-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {itens.length === 0 ? (
                  <p className="text-zinc-600 text-sm text-center py-4">Nenhum item adicionado</p>
                ) : itens.map(item => (
                  <div key={item.id} className={`p-3 rounded-lg border ${
                    item.status === "aprovado" ? "border-green-800/50 bg-green-950/20"
                    : item.status === "recusado" ? "border-red-800/50 bg-red-950/20"
                    : "border-zinc-700 bg-zinc-800/50"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="text-[10px] bg-zinc-700 text-zinc-400">{item.prioridade || "Médio"}</Badge>
                          <Badge className="text-[10px] bg-zinc-700 text-zinc-400">{item.tipo}</Badge>
                          <Badge className={`text-[10px] ${item.status === "aprovado" ? "bg-green-900 text-green-400" : item.status === "recusado" ? "bg-red-900 text-red-400" : "bg-yellow-900 text-yellow-400"}`}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-white text-sm font-medium">{item.descricao}</p>
                        <p className="text-zinc-500 text-xs">{item.quantidade}x R${item.valor_unitario?.toFixed(2)} · Custo: {fmt(item.valor_custo || 0)} · Margem: {item.margem_aplicada || 40}%</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-white font-semibold text-sm">{fmt(item.valor_total)}</span>
                        {item.status !== "aprovado" && (
                          <button onClick={() => toggleItemStatus(item, "aprovado")} title="Aprovar"
                            className="text-green-500 hover:text-green-300 p-1 rounded hover:bg-green-950">
                            <ThumbsUp className="size-3.5" />
                          </button>
                        )}
                        {item.status !== "recusado" && (
                          <button onClick={() => toggleItemStatus(item, "recusado")} title="Recusar"
                            className="text-red-500 hover:text-red-300 p-1 rounded hover:bg-red-950">
                            <ThumbsDown className="size-3.5" />
                          </button>
                        )}
                        <button onClick={() => removeItem(item.id)} title="Remover"
                          className="text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-red-950">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Observações & Histórico */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3"><Clock className="size-3.5" /> Observações & Histórico</div>
              <div className="flex gap-2 mb-4">
                <Textarea value={obs} onChange={e => setObs(e.target.value)} placeholder="Adicionar observação..."
                  rows={2} className="flex-1 bg-zinc-800 border-zinc-700 text-white text-sm resize-none" />
                <Button onClick={enviarObs} disabled={sendingObs || !obs.trim()} size="sm"
                  className="bg-blue-600 hover:bg-blue-700 self-end h-9 px-3">
                  {sendingObs ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </div>
              <div className="space-y-2">
                {historico.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-zinc-800/50 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-zinc-600 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {h.status_anterior !== h.status_novo ? (
                        <p className="text-zinc-300">
                          <span className="text-zinc-500">{h.status_anterior?.replace(/_/g," ")}</span>
                          <ChevronRight className="size-3 inline mx-1 text-zinc-600" />
                          <span className="text-white font-medium">{h.status_novo?.replace(/_/g," ")}</span>
                        </p>
                      ) : (
                        <p className="text-zinc-300">{h.descricao}</p>
                      )}
                      {h.descricao && h.status_anterior !== h.status_novo && (
                        <p className="text-zinc-500 text-xs mt-0.5">{h.descricao}</p>
                      )}
                    </div>
                    <span className="text-zinc-600 text-xs flex-shrink-0">{fmtDate(h.created_at)}</span>
                  </div>
                ))}
                {historico.length === 0 && <p className="text-zinc-600 text-xs text-center py-2">Nenhum histórico ainda</p>}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="space-y-4">

            {/* Resumo Financeiro */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3"><DollarSign className="size-3.5" /> Resumo Financeiro</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-400">Total Orçado</span><span className="text-white font-medium">{fmt(totalOrcado)}</span></div>
                <div className="flex justify-between"><span className="text-yellow-400">⏳ Pendente</span><span className="text-yellow-400 font-medium">{fmt(itens.filter(i=>i.status==="pendente").reduce((s,i)=>s+(i.valor_total||0),0))}</span></div>
                <div className="flex justify-between"><span className="text-green-400">✓ Aprovado</span><span className="text-green-400 font-medium">{fmt(totalAprovado)}</span></div>
                <div className="flex justify-between"><span className="text-red-400">✗ Recusado</span><span className="text-red-400 font-medium">{fmt(totalRecusado)}</span></div>
                <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold">
                  <span className="text-white">Total OS</span><span className="text-white">{fmt(os.valor_final || 0)}</span>
                </div>
              </div>
            </div>

            {/* Mecânico */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3"><Wrench className="size-3.5" /> Mecânico Responsável</div>
              {os.mecanico_nome ? (
                <div className="space-y-1 text-sm">
                  <p className="text-white font-medium">{os.mecanico_nome}</p>
                  {os.mecanico_especialidade && <p className="text-zinc-400">Especialidade: <span className="text-white">{os.mecanico_especialidade}</span></p>}
                  {os.mecanico_nivel && <Badge className="bg-zinc-800 text-zinc-300 text-xs">{os.mecanico_nivel}</Badge>}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">Não atribuído</p>
              )}
            </div>

            {/* Tempo no Pátio */}
            <div className="bg-gradient-to-br from-amber-950/50 to-zinc-900 border border-amber-800/50 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-2"><Clock className="size-3.5" /> Tempo no Pátio</div>
              {(() => {
                const entrada = os.data_entrada ? new Date(os.data_entrada) : new Date(os.created_at);
                const agora = new Date();
                const diff = Math.floor((agora.getTime() - entrada.getTime()) / (1000 * 60));
                const dias = Math.floor(diff / (60 * 24));
                const horas = Math.floor((diff % (60 * 24)) / 60);
                return <p className="text-2xl font-bold text-white">{dias > 0 ? `${dias}d ${horas}h` : `${horas}h`}</p>;
              })()}
            </div>

            {/* Ações Rápidas */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-zinc-400 text-xs mb-3">Ações Rápidas</p>
              <div className="space-y-2">
                <button onClick={() => navigate("/patio")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  <Car className="size-4 text-blue-400" /> Ver no Pátio Kanban
                </button>
                {os.client_id && (
                  <button onClick={() => navigate(`/clientes/${os.client_id}`)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                    <User className="size-4 text-green-400" /> Perfil do Cliente
                  </button>
                )}
                <button onClick={() => navigate("/ordens-servico")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  <AlertCircle className="size-4 text-yellow-400" /> Lista de OS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConsultorLayout>
  );
}

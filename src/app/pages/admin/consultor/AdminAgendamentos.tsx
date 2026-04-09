import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, ChevronRight, Plus, X, RotateCcw, CheckCircle2,
  Loader2, User, Car, Clock, Phone, Calendar, AlertTriangle
} from "lucide-react";
import ConsultorLayout from "../../components/ConsultorLayout";
import { supabase as sb, getEmpresaId, getUser } from "../../../lib/supabase";
import { toast } from "sonner";

interface Agendamento {
  id: string; client_nome: string; client_phone: string | null;
  veiculo_placa: string | null; veiculo_modelo: string | null;
  data_agendada: string; status: string; descricao: string | null;
  os_id: string | null; client_id: string | null;
}

const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

type Modal = null | "criar" | "cancelar" | "reagendar" | "detalhe";

export default function AdminAgendamentos() {
  const navigate = useNavigate();
  const empresaId = getEmpresaId();
  const user = getUser();
  const today = new Date();

  const [mes, setMes] = useState(today.getMonth());
  const [ano, setAno] = useState(today.getFullYear());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [agSelecionado, setAgSelecionado] = useState<Agendamento | null>(null);

  // Form criar
  const [form, setForm] = useState({ client_nome: "", client_phone: "", veiculo_placa: "", veiculo_modelo: "", descricao: "", data: "", hora: "09:00" });
  const [salvando, setSalvando] = useState(false);

  // Cancelamento — IA insiste no motivo
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [tentativasIa, setTentativasIa] = useState(0);
  const [iaMsg, setIaMsg] = useState("Por que deseja cancelar este agendamento?");
  const [cancelando, setCancelando] = useState(false);

  // Reagendamento
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("09:00");
  const [reagendando, setReagendando] = useState(false);

  useEffect(() => { load(); }, [mes, ano]);

  async function load() {
    setLoading(true);
    const inicio = new Date(ano, mes, 1).toISOString();
    const fim    = new Date(ano, mes + 1, 0, 23, 59, 59).toISOString();
    let q = sb.from("agendamentos")
      .select("id,client_nome,client_phone,veiculo_placa,veiculo_modelo,data_agendada,status,descricao,os_id,client_id")
      .gte("data_agendada", inicio).lte("data_agendada", fim)
      .order("data_agendada");
    if (empresaId) q = q.eq("empresa_id", empresaId) as any;
    const { data } = await q;
    setAgendamentos(data || []);
    setLoading(false);
  }

  function agsDoDia(dia: Date) {
    return agendamentos.filter(a => {
      const d = new Date(a.data_agendada);
      return d.getDate() === dia.getDate() && d.getMonth() === dia.getMonth() && d.getFullYear() === dia.getFullYear();
    });
  }

  function corStatus(status: string) {
    const m: Record<string,string> = {
      pendente: "bg-blue-600", confirmado: "bg-green-600",
      cancelado: "bg-red-600", realizado: "bg-zinc-600", reagendado: "bg-yellow-600"
    };
    return m[status] || "bg-zinc-600";
  }

  // ── CRIAR AGENDAMENTO ──
  async function criarAgendamento() {
    if (!form.client_nome || !form.data) { toast.error("Nome e data são obrigatórios"); return; }
    setSalvando(true);
    const dataHora = new Date(`${form.data}T${form.hora}`).toISOString();
    const { error } = await sb.from("agendamentos").insert({
      empresa_id: empresaId, client_nome: form.client_nome,
      client_phone: form.client_phone || null, veiculo_placa: form.veiculo_placa || null,
      veiculo_modelo: form.veiculo_modelo || null, descricao: form.descricao || null,
      data_agendada: dataHora, status: "pendente", criado_por: user?.id ?? null,
    });
    if (error) { toast.error(error.message); setSalvando(false); return; }
    toast.success("Agendamento criado!");
    setModal(null); setForm({ client_nome:"",client_phone:"",veiculo_placa:"",veiculo_modelo:"",descricao:"",data:"",hora:"09:00" });
    await load(); setSalvando(false);
  }

  // ── CANCELAR — IA insiste no motivo ──
  async function tentarCancelar() {
    if (!motivoCancelamento.trim() || motivoCancelamento.trim().length < 10) {
      const novasTentativas = tentativasIa + 1;
      setTentativasIa(novasTentativas);
      const msgs = [
        "Por favor, informe o motivo do cancelamento.",
        "Entendo que quer cancelar, mas precisamos registrar o motivo. O que aconteceu?",
        "Para melhorarmos nosso serviço, é importante saber o motivo. Pode detalhar um pouco mais?",
        "Última tentativa — precisamos do motivo para prosseguir com o cancelamento.",
      ];
      setIaMsg(msgs[Math.min(novasTentativas - 1, msgs.length - 1)]);
      return;
    }
    setCancelando(true);
    // Registra em 97_RECUSAS
    await sb.from("recusas").insert({
      empresa_id: empresaId, tipo: "agendamento",
      referencia_id: agSelecionado!.id, referencia_tipo: "agendamentos",
      client_id: agSelecionado!.client_id, client_nome: agSelecionado!.client_nome,
      client_phone: agSelecionado!.client_phone,
      motivo: motivoCancelamento.trim(), tentativas_ia: tentativasIa,
      registrado_por: user?.id ?? null,
      dados_snapshot: agSelecionado as any,
    });
    // Atualiza agendamento
    await sb.from("agendamentos").update({ status: "cancelado" }).eq("id", agSelecionado!.id);
    toast.success("Agendamento cancelado e motivo registrado.");
    setModal(null); setAgSelecionado(null); setMotivoCancelamento(""); setTentativasIa(0);
    setIaMsg("Por que deseja cancelar este agendamento?");
    await load(); setCancelando(false);
  }

  // ── REAGENDAR ──
  async function reagendar() {
    if (!novaData) { toast.error("Informe a nova data"); return; }
    setReagendando(true);
    const dataHora = new Date(`${novaData}T${novaHora}`).toISOString();
    await sb.from("agendamentos").update({ data_agendada: dataHora, status: "reagendado" }).eq("id", agSelecionado!.id);
    toast.success("Reagendado com sucesso!");
    setModal(null); setNovaData(""); setNovaHora("09:00");
    await load(); setReagendando(false);
  }

  // ── CONFIRMAR — abre Nova OS ──
  async function confirmarEAbrirOS() {
    await sb.from("agendamentos").update({ status: "confirmado" }).eq("id", agSelecionado!.id);
    toast.success("Confirmado! Abrindo Nova OS...");
    setModal(null);
    // Navega para Nova OS com dados pré-preenchidos via state
    navigate("/ordens-servico/nova", { state: {
      client_nome: agSelecionado!.client_nome,
      client_phone: agSelecionado!.client_phone,
      veiculo_placa: agSelecionado!.veiculo_placa,
      veiculo_modelo: agSelecionado!.veiculo_modelo,
      agendamento_id: agSelecionado!.id,
    }});
  }

  // ── CALENDÁRIO ──
  const primeiroDiaMes = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const celulas = Array.from({ length: primeiroDiaMes + diasNoMes }, (_, i) =>
    i < primeiroDiaMes ? null : new Date(ano, mes, i - primeiroDiaMes + 1)
  );
  // Completar para múltiplo de 7
  while (celulas.length % 7 !== 0) celulas.push(null);

  return (
    <ConsultorLayout>
      <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white">Agendamentos</h1>
            <p className="text-zinc-500 text-xs">{MESES[mes]} {ano}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { const d = new Date(ano, mes - 1); setMes(d.getMonth()); setAno(d.getFullYear()); }}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-white text-sm font-medium min-w-32 text-center">{MESES[mes]} {ano}</span>
            <button onClick={() => { const d = new Date(ano, mes + 1); setMes(d.getMonth()); setAno(d.getFullYear()); }}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
              <ChevronRight className="size-4" />
            </button>
            <button onClick={() => setModal("criar")}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg ml-2">
              <Plus className="size-3.5" /> Novo Agendamento
            </button>
          </div>
        </div>

        {/* Calendário */}
        <div className="flex-1 overflow-auto p-4">
          {/* Header dias da semana */}
          <div className="grid grid-cols-7 mb-1">
            {DIAS_SEMANA.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-zinc-500 py-1">{d}</div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 gap-1">
            {celulas.map((dia, i) => {
              if (!dia) return <div key={i} className="h-24 rounded-lg bg-zinc-900/30" />;
              const ags = agsDoDia(dia);
              const isHoje = dia.toDateString() === today.toDateString();
              const isSelecionado = diaSelecionado?.toDateString() === dia.toDateString();
              return (
                <div key={i} onClick={() => setDiaSelecionado(dia)}
                  className={`h-24 rounded-lg p-1.5 cursor-pointer border transition-all overflow-hidden
                    ${isSelecionado ? "border-blue-500 bg-blue-950/30" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"}`}>
                  <div className={`text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full
                    ${isHoje ? "bg-blue-600 text-white" : "text-zinc-300"}`}>
                    {dia.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {ags.slice(0, 3).map(ag => (
                      <div key={ag.id} onClick={e => { e.stopPropagation(); setAgSelecionado(ag); setModal("detalhe"); }}
                        className={`text-[10px] text-white px-1 py-0.5 rounded truncate cursor-pointer ${corStatus(ag.status)}`}>
                        {new Date(ag.data_agendada).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} {ag.client_nome}
                      </div>
                    ))}
                    {ags.length > 3 && <p className="text-[10px] text-zinc-500">+{ags.length - 3} mais</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lista do dia selecionado */}
          {diaSelecionado && (
            <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">
                {diaSelecionado.toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long" })}
                <span className="text-zinc-500 ml-2 font-normal">— {agsDoDia(diaSelecionado).length} agendamento(s)</span>
              </h3>
              {agsDoDia(diaSelecionado).length === 0
                ? <p className="text-zinc-600 text-sm">Nenhum agendamento neste dia</p>
                : agsDoDia(diaSelecionado).map(ag => (
                  <div key={ag.id} className="flex items-center justify-between p-3 mb-2 bg-zinc-800 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium text-white ${corStatus(ag.status)}`}>{ag.status}</span>
                        <span className="text-zinc-400 text-xs">{new Date(ag.data_agendada).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>
                      </div>
                      <p className="text-white text-sm font-medium">{ag.client_nome}</p>
                      {ag.veiculo_placa && <p className="text-zinc-500 text-xs font-mono">{ag.veiculo_placa} · {ag.veiculo_modelo}</p>}
                    </div>
                    {ag.status !== "cancelado" && ag.status !== "realizado" && (
                      <div className="flex gap-1.5 flex-shrink-0 ml-3">
                        <button onClick={() => { setAgSelecionado(ag); setModal("cancelar"); }}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium">Cancelar</button>
                        <button onClick={() => { setAgSelecionado(ag); setModal("reagendar"); }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs px-2.5 py-1.5 rounded-lg font-medium">Reagendar</button>
                        <button onClick={() => { setAgSelecionado(ag); confirmarEAbrirOS(); }}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium">Confirmar</button>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* ── MODAL: CRIAR AGENDAMENTO ── */}
        {modal === "criar" && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-base">Novo Agendamento</h2>
                <button onClick={() => setModal(null)} className="text-zinc-500 hover:text-white"><X className="size-5" /></button>
              </div>
              <div className="space-y-3">
                <div><label className="text-zinc-400 text-xs">Nome *</label><input value={form.client_nome} onChange={e => setForm(p=>({...p,client_nome:e.target.value}))} placeholder="Nome do cliente" className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-zinc-400 text-xs">Telefone</label><input value={form.client_phone} onChange={e => setForm(p=>({...p,client_phone:e.target.value}))} placeholder="(11) 99999-0000" className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-zinc-400 text-xs">Placa</label><input value={form.veiculo_placa} onChange={e => setForm(p=>({...p,veiculo_placa:e.target.value.toUpperCase()}))} placeholder="ABC1D23" className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm font-mono" /></div>
                  <div><label className="text-zinc-400 text-xs">Modelo</label><input value={form.veiculo_modelo} onChange={e => setForm(p=>({...p,veiculo_modelo:e.target.value}))} placeholder="Golf, Civic..." className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-zinc-400 text-xs">Data *</label><input type="date" value={form.data} onChange={e => setForm(p=>({...p,data:e.target.value}))} className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
                  <div><label className="text-zinc-400 text-xs">Hora</label><input type="time" value={form.hora} onChange={e => setForm(p=>({...p,hora:e.target.value}))} className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
                </div>
                <div><label className="text-zinc-400 text-xs">Descrição</label><textarea value={form.descricao} onChange={e => setForm(p=>({...p,descricao:e.target.value}))} placeholder="O que será feito..." rows={2} className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none" /></div>
              </div>
              <button onClick={criarAgendamento} disabled={salvando} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm">
                {salvando ? <Loader2 className="size-4 animate-spin mx-auto" /> : "Criar Agendamento"}
              </button>
            </div>
          </div>
        )}

        {/* ── MODAL: CANCELAR (IA insiste no motivo) ── */}
        {modal === "cancelar" && agSelecionado && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <div className="bg-zinc-900 border border-red-900/50 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="size-5 text-red-400" />
                <h2 className="text-white font-bold text-base">Cancelar Agendamento</h2>
              </div>
              <div className="bg-zinc-800 rounded-xl p-3 mb-4 flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">IA</span>
                </div>
                <p className="text-zinc-300 text-sm">{iaMsg}</p>
              </div>
              {tentativasIa > 0 && motivoCancelamento.trim().length < 10 && (
                <p className="text-red-400 text-xs mb-2">⚠ Motivo muito curto. Descreva melhor o motivo do cancelamento.</p>
              )}
              <textarea value={motivoCancelamento} onChange={e => setMotivoCancelamento(e.target.value)}
                placeholder="Descreva o motivo..." rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm resize-none mb-3" />
              <div className="flex gap-2">
                <button onClick={() => { setModal(null); setMotivoCancelamento(""); setTentativasIa(0); setIaMsg("Por que deseja cancelar este agendamento?"); }}
                  className="flex-1 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg py-2 text-sm">Voltar</button>
                <button onClick={tentarCancelar} disabled={cancelando}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-2 text-sm">
                  {cancelando ? <Loader2 className="size-4 animate-spin mx-auto" /> : "Confirmar Cancelamento"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL: REAGENDAR ── */}
        {modal === "reagendar" && agSelecionado && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <div className="bg-zinc-900 border border-yellow-900/50 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2"><RotateCcw className="size-4 text-yellow-400" /> Reagendar</h2>
              <p className="text-zinc-400 text-sm mb-3">{agSelecionado.client_nome} — {agSelecionado.veiculo_placa}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div><label className="text-zinc-400 text-xs">Nova Data *</label><input type="date" value={novaData} onChange={e => setNovaData(e.target.value)} className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-zinc-400 text-xs">Hora</label><input type="time" value={novaHora} onChange={e => setNovaHora(e.target.value)} className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setModal(null)} className="flex-1 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg py-2 text-sm">Cancelar</button>
                <button onClick={reagendar} disabled={reagendando} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg py-2 text-sm">
                  {reagendando ? <Loader2 className="size-4 animate-spin mx-auto" /> : "Reagendar"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ConsultorLayout>
  );
}

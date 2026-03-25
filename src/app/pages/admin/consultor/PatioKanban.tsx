import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Plus, RefreshCw, Loader2, Car, LayoutGrid, Map,
  Clock, ChevronLeft, ChevronRight, CheckCircle2, X,
  User, Wrench, AlertTriangle, Calendar
} from "lucide-react";
import ConsultorLayout from "../components/ConsultorLayout";
import { createClient } from "@supabase/supabase-js";
import { getEmpresaId } from "../../lib/supabase";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

// Ordem das colunas: Agendado ANTES de diagnóstico, Cancelado no FIM
const COLUNAS = [
  { key: "agendado",             label: "Agendados",           dot: "#3b82f6", bg: "bg-blue-950/30",    border: "border-blue-900/50"   },
  { key: "diagnostico",          label: "Diagnóstico",         dot: "#8b5cf6", bg: "bg-purple-950/30",  border: "border-purple-900/50" },
  { key: "orcamento",            label: "Orçamento",           dot: "#f59e0b", bg: "bg-yellow-950/30",  border: "border-yellow-900/50" },
  { key: "aguardando_aprovacao", label: "Aguardando Aprovação",dot: "#f97316", bg: "bg-orange-950/30",  border: "border-orange-900/50" },
  { key: "aprovado",             label: "Aprovado",            dot: "#06b6d4", bg: "bg-cyan-950/30",    border: "border-cyan-900/50"   },
  { key: "em_execucao",          label: "Em Execução",         dot: "#f97316", bg: "bg-orange-950/30",  border: "border-orange-900/50" },
  { key: "aguardando_peca",      label: "Aguardando Peça",     dot: "#ef4444", bg: "bg-red-950/30",     border: "border-red-900/50"    },
  { key: "teste",                label: "Teste",               dot: "#eab308", bg: "bg-yellow-950/30",  border: "border-yellow-900/50" },
  { key: "concluido",            label: "Pronto",              dot: "#22c55e", bg: "bg-green-950/30",   border: "border-green-900/50"  },
  { key: "entregue",             label: "Entregue",            dot: "#6b7280", bg: "bg-zinc-900",       border: "border-zinc-800"      },
  { key: "cancelado",            label: "Cancelado",           dot: "#ef4444", bg: "bg-red-950/20",     border: "border-red-900/40"    },
];

// Cor do recurso baseada no status da OS alocada
const COR_STATUS: Record<string, string> = {
  livre:             "#22c55e",
  em_execucao:       "#f97316",
  aguardando_peca:   "#ef4444",
  diagnostico:       "#8b5cf6",
  teste:             "#eab308",
  concluido:         "#10b981",
  agendado:          "#3b82f6",
};

interface OS {
  id: string; numero_os: string; status: string;
  client_nome: string; veiculo_placa: string; veiculo_modelo: string;
  mecanico_nome: string | null; valor_orcado: number; created_at: string;
  cor_card: string;
}
interface Recurso {
  id: string; nome: string; tipo: string;
  posicao_x: number; posicao_y: number; largura: number; altura: number;
  os_id_atual: string | null; cor_livre: string;
  cor_execucao: string; cor_aguardando_peca: string;
  cor_diagnostico: string; cor_teste: string; cor_pronto: string;
  is_active: boolean;
}

export default function PatioKanban() {
  const navigate = useNavigate();
  const empresaId = getEmpresaId();
  const [view, setView] = useState<"kanban" | "mapa">("kanban");
  const [os, setOs] = useState<OS[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [movendo, setMovendo] = useState<string | null>(null);
  const [confirmOS, setConfirmOS] = useState<OS | null>(null); // para agendados

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    let osQ = sb.from("06_OS")
      .select("id,numero_os,status,client_nome,veiculo_placa,veiculo_modelo,mecanico_nome,valor_orcado,created_at,cor_card")
      .not("status", "in", "(entregue)").order("created_at", { ascending: true });
    let recQ = sb.from("14_RECURSOS").select("*").eq("is_active", true).order("posicao_y").order("posicao_x");

    if (empresaId) {
      osQ = osQ.eq("empresa_id", empresaId) as any;
      recQ = recQ.eq("empresa_id", empresaId) as any;
    }

    const [osRes, recRes] = await Promise.all([osQ, recQ]);
    setOs(osRes.data || []);
    setRecursos(recRes.data || []);
    setLoading(false);
  }

  async function moverStatus(osId: string, novoStatus: string) {
    setMovendo(osId);
    await sb.from("06_OS").update({ status: novoStatus }).eq("id", osId);
    await load();
    setMovendo(null);
  }

  async function confirmarAgendado(osId: string) {
    await moverStatus(osId, "diagnostico");
    setConfirmOS(null);
  }

  async function cancelarAgendado(osId: string) {
    await moverStatus(osId, "cancelado");
    setConfirmOS(null);
  }

  // Cor do recurso baseada na OS alocada
  function corRecurso(rec: Recurso): string {
    if (!rec.os_id_atual) return rec.cor_livre || COR_STATUS.livre;
    const osAtual = os.find(o => o.id === rec.os_id_atual);
    if (!osAtual) return rec.cor_livre || COR_STATUS.livre;
    const mapa: Record<string, string> = {
      em_execucao:     rec.cor_execucao,
      aguardando_peca: rec.cor_aguardando_peca,
      diagnostico:     rec.cor_diagnostico,
      teste:           rec.cor_teste,
      concluido:       rec.cor_pronto,
    };
    return mapa[osAtual.status] || COR_STATUS.livre;
  }

  function tempoNoPatio(created: string): string {
    const diff = Math.floor((Date.now() - new Date(created).getTime()) / 60000);
    if (diff < 60) return diff + "min";
    const h = Math.floor(diff / 60);
    const d = Math.floor(h / 24);
    return d > 0 ? `${d}d ${h % 24}h` : `${h}h`;
  }

  const osPorStatus = (status: string) => os.filter(o => o.status === status);

  // Render card de OS
  const OSCard = ({ o }: { o: OS }) => {
    const isAgendado = o.status === "agendado";
    return (
      <div
        onClick={() => isAgendado ? setConfirmOS(o) : navigate("/ordens-servico/" + o.id)}
        className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 cursor-pointer hover:border-zinc-600 transition-all"
        style={{ borderLeftColor: o.cor_card || "#3b82f6", borderLeftWidth: 3 }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-blue-400 text-xs font-mono font-bold">{o.numero_os}</span>
          <div className="flex items-center gap-1 text-zinc-500 text-xs">
            <Clock className="size-3" /> {tempoNoPatio(o.created_at)}
          </div>
        </div>
        <p className="text-white text-xs font-medium truncate">
          <span className="text-zinc-400 font-mono">{o.veiculo_placa}</span> · {o.veiculo_modelo}
        </p>
        <div className="flex items-center gap-1 mt-1.5 text-zinc-500 text-xs">
          <User className="size-3" />
          <span className="truncate">{o.client_nome || "—"}</span>
        </div>
        {o.mecanico_nome && (
          <div className="flex items-center gap-1 mt-0.5 text-zinc-500 text-xs">
            <Wrench className="size-3" />
            <span className="truncate">{o.mecanico_nome}</span>
          </div>
        )}
        {isAgendado && (
          <div className="flex gap-1.5 mt-2">
            <button onClick={e => { e.stopPropagation(); confirmarAgendado(o.id); }}
              className="flex-1 flex items-center justify-center gap-1 bg-green-700 hover:bg-green-600 text-white text-xs py-1 rounded">
              <CheckCircle2 className="size-3" /> Confirmar
            </button>
            <button onClick={e => { e.stopPropagation(); cancelarAgendado(o.id); }}
              className="flex-1 flex items-center justify-center gap-1 bg-red-800 hover:bg-red-700 text-white text-xs py-1 rounded">
              <X className="size-3" /> Cancelar
            </button>
          </div>
        )}
        {movendo === o.id && (
          <div className="flex justify-center mt-1"><Loader2 className="size-3 animate-spin text-zinc-500" /></div>
        )}
      </div>
    );
  };

  return (
    <ConsultorLayout>
      <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white">
              {view === "kanban" ? "Pátio — Kanban" : "Pátio — Mapa da Oficina"}
            </h1>
            <p className="text-zinc-500 text-xs">
              {view === "kanban" ? "Use as setas para mover OS entre status" : "Visualização física das vagas da oficina"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle Kanban / Mapa */}
            <div className="flex bg-zinc-800 rounded-lg p-0.5">
              <button onClick={() => setView("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${view === "kanban" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"}`}>
                <LayoutGrid className="size-3.5" /> Kanban
              </button>
              <button onClick={() => setView("mapa")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${view === "mapa" ? "bg-zinc-600 text-white" : "text-zinc-400 hover:text-white"}`}>
                <Map className="size-3.5" /> Mapa
              </button>
            </div>
            <button onClick={load} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => navigate("/ordens-servico/nova")}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg">
              <Plus className="size-3.5" /> Nova OS
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-zinc-500" />
          </div>
        ) : view === "kanban" ? (
          /* ─── KANBAN VIEW ─── */
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-3 p-4 h-full" style={{ minWidth: `${COLUNAS.length * 200}px` }}>
              {COLUNAS.map(col => {
                const cards = osPorStatus(col.key);
                return (
                  <div key={col.key} className={`flex-shrink-0 w-48 flex flex-col rounded-xl border ${col.border} ${col.bg} overflow-hidden`}>
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-800/50">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.dot }} />
                      <span className="text-xs font-semibold text-white truncate flex-1">{col.label}</span>
                      <span className="text-xs text-zinc-500 bg-zinc-800 rounded-full px-1.5 py-0.5">{cards.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {cards.length === 0 ? (
                        <p className="text-zinc-600 text-xs text-center py-6">Vazio</p>
                      ) : cards.map(o => <OSCard key={o.id} o={o} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ─── MAPA VIEW ─── */
          <div className="flex-1 overflow-auto p-4">
            <div className="mb-3 flex items-center gap-4 text-xs">
              <span className="text-zinc-400 font-medium">Mapa da Oficina</span>
              <span className="text-zinc-500 text-xs">Clique em uma vaga para alocar ou liberar um veículo</span>
            </div>
            {/* Legenda */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {[
                { label: "Livre",           color: COR_STATUS.livre },
                { label: "Em Execução",     color: COR_STATUS.em_execucao },
                { label: "Aguardando Peça", color: COR_STATUS.aguardando_peca },
                { label: "Diagnóstico",     color: COR_STATUS.diagnostico },
                { label: "Teste",           color: COR_STATUS.teste },
                { label: "Pronto",          color: COR_STATUS.concluido },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                  <span className="text-xs text-zinc-400">{l.label}</span>
                </div>
              ))}
            </div>

            {/* Grid do mapa usando posicao_x / posicao_y */}
            {(() => {
              if (recursos.length === 0) {
                return <p className="text-zinc-600 text-sm text-center py-12">Nenhum recurso configurado para este empresa.</p>;
              }
              const maxX = Math.max(...recursos.map(r => r.posicao_x + (r.largura || 1)));
              const maxY = Math.max(...recursos.map(r => r.posicao_y + (r.altura || 1)));
              return (
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${maxX}, minmax(180px, 1fr))`,
                    gridTemplateRows: `repeat(${maxY}, 80px)`,
                  }}
                >
                  {recursos.map(rec => {
                    const cor = corRecurso(rec);
                    const osAtual = rec.os_id_atual ? os.find(o => o.id === rec.os_id_atual) : null;
                    return (
                      <div
                        key={rec.id}
                        onClick={() => osAtual && navigate("/ordens-servico/" + osAtual.id)}
                        className="relative rounded-xl border-2 transition-all cursor-pointer hover:brightness-110 flex flex-col items-center justify-center gap-1 p-2"
                        style={{
                          gridColumn: `${rec.posicao_x + 1} / span ${rec.largura || 1}`,
                          gridRow: `${rec.posicao_y + 1} / span ${rec.altura || 1}`,
                          borderColor: cor + "55",
                          background: cor + "15",
                        }}
                      >
                        {/* Dot de status no canto */}
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
                          style={{ background: cor }} />

                        {/* Ícone por tipo */}
                        {rec.tipo === "elevador" && <Car className="size-4" style={{ color: cor }} />}
                        {rec.tipo === "box" && <Wrench className="size-4" style={{ color: cor }} />}
                        {rec.tipo === "equipamento" && <Wrench className="size-4" style={{ color: cor }} />}
                        {rec.tipo === "recepcao" && <User className="size-4" style={{ color: cor }} />}
                        {rec.tipo === "rampa" && <Car className="size-4" style={{ color: cor }} />}

                        <span className="text-xs text-zinc-300 font-medium text-center leading-tight">{rec.nome}</span>

                        {/* Info da OS alocada */}
                        {osAtual && (
                          <div className="text-center">
                            <p className="text-[10px] font-mono text-blue-400">{osAtual.veiculo_placa}</p>
                            <p className="text-[10px] text-zinc-500 truncate max-w-[140px]">{osAtual.veiculo_modelo}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </ConsultorLayout>
  );
}

import { useEffect, useState } from "react";
import { Car, Calendar, DollarSign, Key, ChevronRight, AlertCircle, CheckCircle2, Plus, Wrench, BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import ConsultorLayout from "../components/ConsultorLayout";
import { createClient } from "@supabase/supabase-js";
import { getUser, getEmpresaId } from "../../lib/supabase";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

interface Pendencia { id: string; titulo: string; tipo: string; prioridade: string; created_at: string; os_id: string | null; }

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ patio: 0, agendamentos: 0, faturamento: 0, entregas: 0 });
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const user = getUser();
  const empresaId = getEmpresaId();

  useEffect(() => {
    document.title = "Dashboard - Doctor Auto";
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const hoje = new Date(); hoje.setHours(0,0,0,0);
      const mesInicio = new Date(); mesInicio.setDate(1); mesInicio.setHours(0,0,0,0);

      // Filtro por empresa (multi-tenant)
      const filtro = empresaId ? { empresa_id: empresaId } : {};

      let osQuery = sb.from("06_OS").select("status").in("status", ["diagnostico","orcamento","aguardando_aprovacao","aprovado","em_execucao","concluido"]);
      let entregasQuery = sb.from("06_OS").select("id").eq("status","entregue").gte("updated_at", mesInicio.toISOString());
      let pendQuery = sb.from("13_PENDENCIAS").select("id,titulo,tipo,prioridade,created_at,os_id").eq("status","aberta").order("created_at",{ascending:false}).limit(5);

      if (empresaId) {
        osQuery = osQuery.eq("empresa_id", empresaId) as any;
        entregasQuery = entregasQuery.eq("empresa_id", empresaId) as any;
        pendQuery = pendQuery.eq("empresa_id", empresaId) as any;
      }

      const [osRes, entregasRes, pendRes] = await Promise.all([osQuery, entregasQuery, pendQuery]);

      const osAtivas = (osRes.data || []);
      const patio = osAtivas.filter(o => ["diagnostico","orcamento","aguardando_aprovacao","aprovado","em_execucao"].includes(o.status)).length;

      setKpis({
        patio,
        agendamentos: 0,
        faturamento: 0,
        entregas: (entregasRes.data || []).length,
      });
      setPendencias(pendRes.data || []);
    } finally { setLoading(false); }
  }

  async function resolverPendencia(id: string) {
    await sb.from("13_PENDENCIAS").update({ status: "resolvida", resolvida_em: new Date().toISOString() }).eq("id", id);
    setPendencias(prev => prev.filter(p => p.id !== id));
  }

  const PRIO_COLOR: Record<string,string> = {
    urgente: "text-red-400 border-red-800 bg-red-950/30",
    alta: "text-orange-400 border-orange-800 bg-orange-950/30",
    media: "text-yellow-400 border-yellow-800 bg-yellow-950/30",
    baixa: "text-zinc-400 border-zinc-700 bg-zinc-800/30",
  };

  const fmt = (v: number) => "R$ " + (v >= 1000 ? (v/1000).toFixed(0)+"k" : v.toFixed(0));

  return (
    <ConsultorLayout>
      <div className="p-4 md:p-6 space-y-6 bg-zinc-950 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-500 text-sm">
              {user?.empresa_nome ?? "Doctor Auto"} · Visão geral em tempo real
            </p>
          </div>
          <button onClick={() => navigate("/ordens-servico/nova")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Plus className="size-4" /> Nova OS
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Veículos no Pátio",   value: loading ? "—" : String(kpis.patio),        icon: Car,      color: "text-blue-400",   border: "border-blue-900/50",   bg: "bg-blue-950/20" },
            { label: "Agendamentos Hoje",    value: loading ? "—" : String(kpis.agendamentos), icon: Calendar, color: "text-zinc-400",   border: "border-zinc-800",      bg: "bg-zinc-900" },
            { label: "Faturamento (Mês)",    value: loading ? "—" : fmt(kpis.faturamento),     icon: DollarSign,color:"text-green-400",  border: "border-green-900/50",  bg: "bg-green-950/20" },
            { label: "Entregas no Mês",      value: loading ? "—" : String(kpis.entregas),     icon: Key,      color: "text-yellow-400", border: "border-yellow-900/50", bg: "bg-yellow-950/20" },
          ].map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} className={`rounded-xl border ${k.border} ${k.bg} p-4 flex items-center justify-between`}>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">{k.label}</p>
                  <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
                </div>
                <Icon className={`size-8 opacity-30 ${k.color}`} />
              </div>
            );
          })}
        </div>

        {/* Pendências do dia */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-white font-semibold text-sm">Pendências do dia</span>
              {pendencias.length > 0 && (
                <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5">{pendencias.length}</span>
              )}
            </div>
            <button onClick={() => navigate("/pendencias")} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
              Ver todas <ChevronRight className="size-3" />
            </button>
          </div>
          <div className="p-4">
            {loading ? (
              <p className="text-zinc-500 text-sm">Carregando...</p>
            ) : pendencias.length === 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="size-5" />
                <p className="text-sm">Nenhuma pendência para hoje. Bom trabalho!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendencias.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border ${PRIO_COLOR[p.prioridade] || PRIO_COLOR.media}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertCircle className="size-4 flex-shrink-0" />
                      <span className="text-sm text-white truncate">{p.titulo}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {p.os_id && (
                        <button onClick={() => navigate("/ordens-servico/" + p.os_id)}
                          className="text-xs text-blue-400 hover:text-blue-300 px-2 py-0.5 rounded border border-blue-800">Ver OS</button>
                      )}
                      <button onClick={() => resolverPendencia(p.id)}
                        className="text-xs text-green-400 hover:text-green-300 px-2 py-0.5 rounded border border-green-800">Resolver</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Atalhos de módulos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Operacional",     sub: "Pátio e OS em andamento",       icon: Wrench,    color: "text-blue-400",   bg: "bg-blue-950/40",   border: "border-blue-900/50",   path: "/operacional" },
            { label: "Financeiro",      sub: "Faturamento e metas",           icon: DollarSign,color: "text-green-400",  bg: "bg-green-950/40",  border: "border-green-900/50",  path: "/financeiro" },
            { label: "Produtividade",   sub: "Ranking e performance",         icon: BarChart3, color: "text-purple-400", bg: "bg-purple-950/40", border: "border-purple-900/50", path: "/produtividade" },
            { label: "Agenda do Dia",   sub: "Grade horária dos mecânicos",   icon: Calendar,  color: "text-yellow-400", bg: "bg-yellow-950/40", border: "border-yellow-900/50", path: "/agendamentos" },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <button key={i} onClick={() => navigate(m.path)}
                className={`relative ${m.bg} border ${m.border} rounded-xl p-5 text-left hover:opacity-90 transition-opacity group`}>
                <ChevronRight className="absolute top-4 right-4 size-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                <div className={`w-10 h-10 rounded-lg ${m.bg} border ${m.border} flex items-center justify-center mb-3`}>
                  <Icon className={`size-5 ${m.color}`} />
                </div>
                <p className={`font-bold text-sm ${m.color}`}>{m.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{m.sub}</p>
              </button>
            );
          })}
        </div>

      </div>
    </ConsultorLayout>
  );
}

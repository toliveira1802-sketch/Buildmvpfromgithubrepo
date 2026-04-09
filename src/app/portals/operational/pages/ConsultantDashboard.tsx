import { useState, useEffect, useCallback } from "react";
import {
  Zap, DollarSign, ClipboardList, Clock, Users,
  ChevronRight, Calendar, AlertCircle,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/shared/ui/card";
import { Button } from "@/app/shared/ui/button";
import { Progress } from "@/app/shared/ui/progress";
import { useNavigate } from "react-router";
import { cn } from "@/app/shared/ui/utils";
import { supabase } from "@/lib/supabase";
import { sbEmpresa } from "@/lib/supabase-extended";
import { toast } from "sonner";
import { motion } from "motion/react";

interface DashKPIs {
  vendasHoje: number;
  osAbertos: number;
  aguardando: number;
  novosClientes: number;
}

interface RecentOS {
  id: string;
  numero_os: string;
  client_nome: string;
  veiculo_modelo: string;
  veiculo_placa: string;
  status: string;
  prioridade: string;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  diagnostico: "Diagnostico",
  orcamento: "Orcamento",
  aguardando_aprovacao: "Aguardando",
  aprovado: "Aprovado",
  em_execucao: "Em Execucao",
  concluido: "Concluido",
  entregue: "Entregue",
};

const STATUS_STYLE: Record<string, string> = {
  diagnostico: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  orcamento: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  aguardando_aprovacao: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  aprovado: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  em_execucao: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  concluido: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
  entregue: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function ConsultantDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<DashKPIs>({ vendasHoje: 0, osAbertos: 0, aguardando: 0, novosClientes: 0 });
  const [recentOS, setRecentOS] = useState<RecentOS[]>([]);
  const [approvalRate, setApprovalRate] = useState(0);

  const user = JSON.parse(localStorage.getItem("dap-user") || "{}");
  const empresaId = sbEmpresa();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let osQuery = supabase.from("ordens_servico").select("*").order("created_at", { ascending: false }).limit(100);
      let clientQuery = supabase.from("clients").select("id, created_at", { count: "exact" });

      if (empresaId) {
        osQuery = osQuery.eq("empresa_id", empresaId);
        clientQuery = clientQuery.eq("empresa_id", empresaId);
      }

      const [osRes, clientRes] = await Promise.all([osQuery, clientQuery]);

      if (osRes.error) throw osRes.error;
      const allOS = osRes.data || [];

      // KPIs
      const ativas = ["diagnostico", "orcamento", "aguardando_aprovacao", "aprovado", "em_execucao"];
      const osAbertos = allOS.filter(o => ativas.includes(o.status)).length;
      const aguardando = allOS.filter(o => o.status === "aguardando_aprovacao").length;
      const concluidas = allOS.filter(o => o.status === "concluido" || o.status === "entregue");
      const vendasHoje = concluidas.reduce((s, o) => s + (o.valor_orcado || 0), 0);

      // Novos clientes (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const novos = (clientRes.data || []).filter(c => new Date(c.created_at) > weekAgo).length;

      // Approval rate
      const totalWithDecision = allOS.filter(o => ["aprovado", "em_execucao", "concluido", "entregue", "cancelado"].includes(o.status)).length;
      const approved = allOS.filter(o => ["aprovado", "em_execucao", "concluido", "entregue"].includes(o.status)).length;
      const rate = totalWithDecision > 0 ? Math.round((approved / totalWithDecision) * 100) : 0;

      setKpis({ vendasHoje, osAbertos, aguardando, novosClientes: novos });
      setRecentOS(allOS.slice(0, 5) as RecentOS[]);
      setApprovalRate(rate);
    } catch (err: any) {
      toast.error("Erro ao carregar dashboard: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statCards = [
    { label: "Faturamento", value: `R$ ${(kpis.vendasHoje / 100).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`, icon: DollarSign, accent: "emerald" },
    { label: "OS em Aberto", value: String(kpis.osAbertos), icon: ClipboardList, accent: "blue" },
    { label: "Aguardando", value: String(kpis.aguardando), icon: Clock, accent: kpis.aguardando > 5 ? "red" : "orange" },
    { label: "Novos Clientes", value: String(kpis.novosClientes), icon: Users, accent: "violet" },
  ];

  const accentMap: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    orange: "text-orange-400 bg-orange-500/10",
    red: "text-red-400 bg-red-500/10",
    violet: "text-violet-400 bg-violet-500/10",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <Zap className="h-7 w-7 text-emerald-400" />
            </div>
            Field Ops
          </h1>
          <p className="text-zinc-600 font-semibold uppercase tracking-[0.2em] text-[10px] mt-2">
            {user.nome || "Consultor"} &middot; {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/operational/fast-checkin")}
            className="h-11 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[11px] rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all hover:shadow-[0_4px_30px_rgba(16,185,129,0.35)]"
          >
            Fast Check-in
          </Button>
          <button className="h-11 w-11 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/[0.1] transition-all">
            <Calendar className="w-4.5 h-4.5" />
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <Card className="bg-[#0a0a0c]/80 border-white/[0.04] hover:border-white/[0.08] transition-all group overflow-hidden backdrop-blur-sm">
              <CardContent className="pt-5 pb-5 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-2 rounded-lg", accentMap[s.accent])}>
                    <s.icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-0.5">
                  {loading ? (
                    <span className="inline-block w-16 h-7 bg-white/[0.04] rounded-lg animate-pulse" />
                  ) : s.value}
                </p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pipeline */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-[#0a0a0c]/80 border-white/[0.04] backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.03] pb-4">
              <div>
                <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-emerald-400" />
                  Pipeline Recente
                </CardTitle>
                <CardDescription className="text-zinc-600 text-[10px] uppercase tracking-wider">Ultimas ordens de servico</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] text-emerald-500 hover:bg-emerald-500/5 uppercase tracking-wider font-bold" onClick={() => navigate("/operational/os")}>
                Ver Todas <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-0">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 border-b border-white/[0.02] animate-pulse" />
                  ))}
                </div>
              ) : recentOS.length === 0 ? (
                <div className="py-16 flex flex-col items-center text-zinc-700">
                  <ClipboardList className="w-10 h-10 opacity-10 mb-3" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Pipeline vazio</p>
                </div>
              ) : (
                <div>
                  {recentOS.map((os, i) => (
                    <motion.div
                      key={os.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                      className="flex items-center justify-between px-6 py-4 border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group cursor-pointer"
                      onClick={() => navigate(`/ordens-servico/${os.id}`)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[10px] font-black text-emerald-500 flex-shrink-0">
                          {os.numero_os?.split("-")[1]?.slice(-3) || "OS"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{os.client_nome || "Cliente"}</p>
                          <p className="text-[9px] text-zinc-600 font-medium uppercase tracking-wider truncate">
                            {os.veiculo_placa} &middot; {os.veiculo_modelo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border",
                          STATUS_STYLE[os.status] || STATUS_STYLE.diagnostico
                        )}>
                          {STATUS_LABEL[os.status] || os.status}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Cards */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-5"
        >
          {/* Approval Rate */}
          <Card className="bg-[#0a0a0c]/80 border-white/[0.04] overflow-hidden backdrop-blur-sm">
            <div className="h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500" />
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-[11px] font-bold uppercase tracking-[0.15em]">Desempenho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
                  <span className="text-zinc-500">Approval Rate</span>
                  <span className="text-white">{loading ? "--" : `${approvalRate}%`}</span>
                </div>
                <Progress value={loading ? 0 : approvalRate} className="h-1 [&>div]:bg-emerald-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
                  <span className="text-zinc-500">Pipeline Health</span>
                  <span className="text-white">{loading ? "--" : `${Math.max(0, 100 - kpis.aguardando * 5)}%`}</span>
                </div>
                <Progress value={loading ? 0 : Math.max(0, 100 - kpis.aguardando * 5)} className="h-1 [&>div]:bg-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Tactical Alert */}
          {kpis.aguardando > 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
              <Card className="bg-orange-950/15 border-orange-500/15">
                <CardHeader className="pb-2">
                  <CardTitle className="text-orange-400 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Alerta Operacional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">
                    {kpis.aguardando} OS aguardando aprovacao. Priorize contato com clientes para destravar o pipeline.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Daily Target */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.06] flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Meta Diaria</p>
              <p className="text-lg font-black text-white mt-0.5">
                {loading ? "--" : `${Math.min(100, Math.round((kpis.vendasHoje / 1500000) * 100))}%`}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

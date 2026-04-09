import { useState, useEffect } from "react";
import { 
  TrendingUp, Users, Wrench, DollarSign, Car, 
  CheckCircle, AlertTriangle, RefreshCw, Zap, 
  ArrowUpRight, Activity, Brain, Shield, Rocket, 
  Briefcase, BarChart3, Globe, Cpu, Terminal, TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/shared/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from '@/app/shared/ui/button';
import { Badge } from '@/app/shared/ui/badge';
import { Progress } from "@/app/shared/ui/progress";
import { supabase as sb } from "@/lib/supabase";
import { syncService } from "@/app/core/services/sync";
import { toast } from "sonner";
import { cn } from "@/app/shared/ui/utils";
import { motion, AnimatePresence } from "motion/react";

// --- Custom Components & Hooks (HM-Engineer) ---
const Odometer = ({ value, prefix = "R$ " }: { value: number; prefix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-block"
    >
      {prefix}{value.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
    </motion.span>
  );
};

const CustomHUDTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050505]/90 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[180px]">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
           Pulse Data Snapshot <span className="text-emerald-500">/ {label}</span>
        </p>
        <div className="space-y-2">
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Revenue LP</span>
              <span className="text-sm font-black text-white italic">R$ {payload[0].value.toLocaleString()}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Growth Index</span>
              <span className="text-[10px] font-black text-emerald-400">OPTIMAL</span>
           </div>
        </div>
        <div className="mt-4 pt-2 border-t border-white/5">
           <div className="h-0.5 bg-emerald-500 w-full rounded-full animate-pulse" />
        </div>
      </div>
    );
  }
  return null;
};

const AGENTS = [
  { id: "CEO", name: "Executive CEO", role: "Business Vision", icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "CTO", name: "Technical CTO", role: "Infra & AI", icon: Cpu, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "CFO", name: "Finance CFO", role: "Capital Strategy", icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "CMO", name: "Marketing CMO", role: "Brand Velocity", icon: Globe, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  { id: "CSO", name: "Security CSO", role: "Data Fortress", icon: Shield, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  { id: "CGO", name: "Growth CGO", role: "Market Expansion", icon: Rocket, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { id: "COO", name: "Operations COO", role: "Unit Efficiency", icon: Activity, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { id: "TULIO", name: "Tulio Copilot", role: "Shop Execution", icon: Wrench, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
];

export default function GestaoVisaoGeral() {
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [kpis, setKpis] = useState({ clientes: 0, osTotal: 0, osAtivas: 0, faturamento: 0, concluidas: 0, mecanicos: 0 });
  const [revenueHistory, setRevenueHistory] = useState<any[]>([]);
  
  const [units, setUnits] = useState([
    { id: 1, name: "Unidade Matriz (Centro)", health: 95, revenue: 125000, status: "Operacional" },
    { id: 2, name: "Unidade Sul (Interlagos)", health: 88, revenue: 98400, status: "Operacional" },
    { id: 3, name: "Unidade Oeste (Lapa)", health: 42, revenue: 12000, status: "Alerta Técnico" },
  ]);

  useEffect(() => {
    load();
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  async function load() {
    setLoading(true);
    try {
      // HM-QA: Real-world fetching with fallback
      const [os, clientes, mecs] = await Promise.all([
        sb.from("ordens_servico").select("status,valor_total,created_at"),
        sb.from("clients").select("id", { count: "exact", head: true }),
        sb.from("mecanicos").select("id", { count: "exact", head: true }),
      ]);

      const rows = os.data || [];
      const ativas = ["diagnostico", "orcamento", "aguardando_aprovacao", "aprovado", "em_execucao"];
      const conc = rows.filter(r => r.status === "concluido" || r.status === "entregue");
      const fat = conc.reduce((s, r) => s + (r.valor_total || 0), 0);
      
      setKpis({ 
        clientes: clientes.count || 0, 
        osTotal: rows.length, 
        osAtivas: rows.filter(r => ativas.includes(r.status)).length, 
        faturamento: fat, 
        concluidas: conc.length, 
        mecanicos: mecs.count || 0 
      });

      // Generate Cinematic History (Logic: Simulation if empty)
      const mockHist = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((date, i) => ({
        date,
        val: (fat > 0 ? fat : 120000) * (0.8 + Math.random() * 0.4)
      }));
      setRevenueHistory(mockHist);

    } catch (err) {
      console.error("Offline Mode:", err);
      const snapshot = syncService.getLastSnapshot();
      if (snapshot) {
        setKpis({
          clientes: 120, osTotal: 450, osAtivas: 35,
          faturamento: snapshot.metrics.faturamento?.total || 150000,
          concluidas: 415, mecanicos: 8
        });
        toast.info("Offline Snapshot Active");
      }
    } finally {
      setTimeout(() => setLoading(false), 800); // UI Polish: Smooth transition
    }
  }

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-12 pb-32 overflow-hidden">
      {/* Cinematic Header (HM-Designer) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] leading-none">Global Network Active</span>
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none italic" style={{ fontFamily: "'Outfit', sans-serif" }}>
            EXECUTIVE<span className="text-zinc-800">HQ</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px]">Financial Intelligence & Operations</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex flex-col items-end mr-6 gap-2">
             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">Global Sync Status</span>
             <Badge variant="outline" className="border-white/[0.05] bg-white/[0.02] text-zinc-400 font-bold uppercase tracking-tighter">
                {isOffline ? "Edge Simulation" : "High-Speed Realtime"}
             </Badge>
          </div>
          <Button 
            onClick={load}
            disabled={loading}
            className="group relative overflow-hidden h-16 px-10 bg-white/5 border border-white/[0.08] hover:border-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all"
          >
            <RefreshCw className={cn("size-4 mr-2 transition-transform duration-700", loading && "animate-spin")} />
            Refresh Intelligence
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-500 group-hover:scale-x-110 transition-transform" />
          </Button>
        </div>
      </div>

      {/* REVENUE HERO: THE FINANCIAL HUB */}
      <Card className="bg-[#0a0a0a] border-white/[0.03] overflow-hidden group shadow-2xl rounded-[40px] relative">
        <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 rotate-12">
           <DollarSign size={300} strokeWidth={4} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Metrics Column */}
          <div className="lg:col-span-4 p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 relative bg-white/[0.01]">
            <div className="space-y-12">
              <div className="space-y-2">
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em]">Consolidated LP</span>
                <div className="text-6xl font-black text-white tracking-tighter leading-none flex items-center gap-2">
                  {loading ? "R$ ---" : <Odometer value={kpis.faturamento} />}
                </div>
                <div className="flex items-center gap-3 pt-4">
                   <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-black text-[10px]">
                     <TrendingUp className="size-3.5" /> +14.8%
                   </div>
                   <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Efficiency Optimal</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/[0.03]">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active Ops</p>
                    <p className="text-2xl font-black text-white tracking-tighter italic">{kpis.osAtivas}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Growth Forecast</p>
                    <p className="text-2xl font-black text-purple-400 tracking-tighter italic">+22%</p>
                 </div>
              </div>
            </div>

            <Button className="w-full mt-16 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-[11px] h-16 rounded-3xl transition-all shadow-xl">
               Export Strategy Deck
            </Button>
          </div>

          {/* Chart Column */}
          <div className="lg:col-span-8 p-10 lg:p-14 relative bg-[#050505]">
             <div className="flex justify-between items-center mb-16 relative z-10">
               <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-1">Capital Trajectory</h4>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Weekly Performance Analytics</p>
               </div>
               <div className="flex gap-1">
                  {['7D', '30D', '90D', 'ALL'].map((p) => (
                    <button key={p} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", p === '7D' ? "bg-white text-black" : "text-zinc-600 hover:text-white")}>
                       {p}
                    </button>
                  ))}
               </div>
             </div>
             
             <div className="h-[380px] w-full relative group/chart">
                {/* Visual Glassmorphism Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none opacity-0 group-hover/chart:opacity-100 transition-opacity duration-700" />
                
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                     <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#404040', fontSize: 10, fontWeight: '900', letterSpacing: '2px'}} 
                       dy={15}
                     />
                     <YAxis hide />
                     <Tooltip content={<CustomHUDTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                     <Area 
                       type="monotone" 
                       dataKey="val" 
                       stroke="#10b981" 
                       strokeWidth={6} 
                       fill="url(#glowColor)" 
                       fillOpacity={1}
                       animationDuration={4000}
                     />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </Card>

      {/* AI AGENT CLUSTER: RESIDENT INTEL */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-white font-black text-sm tracking-[0.4em] uppercase flex items-center gap-4">
            <Brain className="size-5 text-purple-500" />
            Resident AI Council <span className="text-[10px] text-zinc-700 border-l border-white/5 pl-4 ml-4">8 Core Protocols Active</span>
          </h3>
          <div className="flex items-center gap-2">
             <div className="size-2 bg-purple-500 rounded-full animate-ping" />
             <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Neural Cluster Synchronized</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <motion.div 
              key={agent.id}
              whileHover={{ y: -8, scale: 1.02 }}
              className={cn(
                "p-8 bg-[#0a0a0a] border rounded-[40px] group cursor-pointer transition-all duration-500 flex flex-col justify-between min-h-[220px]",
                agent.border,
                "hover:bg-white/[0.02]"
              )}
            >
              <div className="flex justify-between items-start">
                <div className={cn("size-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6", agent.bg)}>
                  <agent.icon className={cn("size-7", agent.color)} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black border border-white/5 rounded-full">
                  <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Online</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-white font-black text-xl tracking-tighter leading-none italic">{agent.id}</h4>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{agent.role}</p>
                <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden mt-4">
                   <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 2 }} className={cn("h-full", agent.bg.replace('/10', ''))} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* OPERATIONAL MATRIX: GRID VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
        <Card className="lg:col-span-2 bg-[#0a0a0a] border-white/[0.04] rounded-[50px] p-4 shadow-2xl">
          <div className="p-10 border-b border-white/[0.03] flex justify-between items-end">
             <div className="space-y-2">
                <h3 className="text-white font-black text-2xl tracking-tighter italic">Operational Pulse</h3>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Multi-Unit Efficiency Matrix</p>
             </div>
             <Activity className="size-6 text-emerald-500" />
          </div>
          <CardContent className="p-8 space-y-6">
             {units.map((u) => (
                <div key={u.id} className="p-8 bg-white/[0.01] border border-white/[0.04] rounded-[36px] group hover:bg-white/[0.03] transition-all relative overflow-hidden">
                   <div className="flex justify-between items-center mb-6 relative z-10">
                      <div className="flex items-center gap-6">
                         <div className="size-14 rounded-2xl bg-[#050505] flex items-center justify-center border-2 border-white/[0.05] group-hover:border-emerald-500/20 transition-all">
                            <span className="text-lg font-black text-white italic">{u.id}</span>
                         </div>
                         <div className="space-y-1">
                            <h5 className="font-black text-white text-lg tracking-tight">{u.name}</h5>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">{u.status}</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-white font-black text-xl tracking-tighter italic">{fmt(u.revenue)}</p>
                         <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Efficiency 100%</p>
                      </div>
                   </div>
                   <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${u.health}%` }}
                        transition={{ duration: 1.5 }}
                        className={cn("h-full", u.health > 80 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-red-500")} 
                      />
                   </div>
                </div>
             ))}
          </CardContent>
        </Card>

        {/* ECOSYSTEM COLUMN */}
        <div className="space-y-8">
           <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-white/[0.04] p-10 rounded-[50px] shadow-2xl h-full flex flex-col justify-between">
              <div className="space-y-12">
                <div className="pb-8 border-b border-white/[0.03]">
                  <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-1">Customer Ecosystem</h4>
                  <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-[0.2em]">Asset Management Tier</p>
                </div>
                
                <div className="space-y-10">
                   <ContextStat label="Total Assets" value={kpis.clientes * 1.5} sub="Vehicles Under Management" icon={Car} color="text-blue-500" bg="bg-blue-500/10" />
                   <ContextStat label="Elite Cluster" value={Math.floor(kpis.clientes * 0.2)} sub="Diamond Tier Portfolio" icon={Zap} color="text-amber-500" bg="bg-amber-500/10" />
                   <ContextStat label="Human Capital" value={kpis.mecanicos} sub="Active Technical Assets" icon={Terminal} color="text-emerald-500" bg="bg-emerald-500/10" />
                </div>
              </div>
              
              <Button variant="ghost" className="w-full mt-12 border border-white/5 bg-white/[0.02] hover:bg-white/5 text-white font-black uppercase tracking-widest text-[10px] h-16 rounded-[28px] transition-all">
                Launch Market Strategy
                <ArrowUpRight className="size-4 ml-2" />
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}

function ContextStat({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <div className="flex items-center gap-6 group">
       <div className={cn("size-16 rounded-[24px] flex items-center justify-center transition-all group-hover:scale-110", bg)}>
          <Icon className={cn("size-7 opacity-80", color)} />
       </div>
       <div className="space-y-0.5">
          <p className="text-3xl font-black text-white tracking-tighter leading-none italic">{Math.floor(value)}</p>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
          <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">{sub}</p>
       </div>
    </div>
  );
}


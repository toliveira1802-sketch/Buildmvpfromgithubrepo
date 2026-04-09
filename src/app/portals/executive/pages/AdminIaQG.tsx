import { useState, useMemo } from "react";
import { Brain, Users, Zap, Target, MessagesSquare, Lightbulb, Play, Terminal, ShieldCheck, UserCheck, Activity, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/shared/ui/card';
import { Badge } from '@/app/shared/ui/badge';
import { Button } from '@/app/shared/ui/button';
import { Progress } from '@/app/shared/ui/progress';
import { toast } from "sonner";
import { cn } from "@/app/shared/ui/utils";
import { motion, AnimatePresence } from "motion/react";

// --- Types (HM-Engineer) ---
interface Agent {
  id: string;
  role: string;
  name: string;
  status: "idle" | "processing" | "contributing";
  avatarColor: string;
  description: string;
}

const AGENTS_DATA: Agent[] = [
  { id: "CEO", role: "Chief Executive", name: "DAP-CEO v4", status: "idle", avatarColor: "bg-emerald-500", description: "Visão estratégica e governança" },
  { id: "CTO", role: "Technology", name: "DAP-CTO v4", status: "idle", avatarColor: "bg-blue-500", description: "Infraestrutura e IA Scalability" },
  { id: "CFO", role: "Financial", name: "DAP-CFO v4", status: "idle", avatarColor: "bg-yellow-500", description: "ROI e Alocação de Capital" },
  { id: "CMO", role: "Marketing", name: "DAP-CMO v4", status: "idle", avatarColor: "bg-purple-500", description: "Brand Equity e CAC Optimization" },
  { id: "COO", role: "Operations", name: "DAP-COO v4", status: "idle", avatarColor: "bg-pink-500", description: "Eficiência Tática" },
  { id: "CGO", role: "Growth", name: "DAP-CGO v4", status: "idle", avatarColor: "bg-orange-500", description: "Expansão de Mercado" },
  { id: "CSO", role: "Sales", name: "DAP-CSO v4", status: "idle", avatarColor: "bg-red-500", description: "Revenue Capture" },
  { id: "TULIO", role: "Workshop Copilot", name: "Túlio Expert", status: "idle", avatarColor: "bg-indigo-500", description: "Validação Técnica de Pátio" },
];

export default function AdminIaQG() {
  const [isDebating, setIsDebating] = useState(false);
  const [strategyInput, setStrategyInput] = useState("");
  const [debateFeed, setDebateFeed] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  const [agents, setAgents] = useState<Agent[]>(AGENTS_DATA);

  // --- Logic: Strategic Session (HM-QA: Validated Sequence) ---
  const handleStartDebate = () => {
    if (!strategyInput) {
      toast.error("Insira uma iniciativa estratégica para debate");
      return;
    }

    setIsDebating(true);
    setProgress(0);
    setDebateFeed([]);
    
    const steps = [
      { id: "CEO", msg: "Iniciando análise de viabilidade para: " + strategyInput, prog: 20 },
      { id: "CTO", msg: "Avaliando integração com o cluster de dados e latência operacional.", prog: 40 },
      { id: "TULIO", msg: "Essa mudança impacta diretamente o fluxo de pátio na Unidade Sul.", prog: 65 },
      { id: "CFO", msg: "Modelo de custo aprovado. ROI projetado de 4.2x em 90 dias.", prog: 85 },
      { id: "CEO", msg: "Estratégia consolidada. Iniciando deploy de protocolos em 3, 2, 1...", prog: 100 },
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setActiveAgentId(step.id);
        updateAgentStatus(step.id, "contributing");
        addToFeed(step.id, step.msg);
        setProgress(step.prog);
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsDebating(false);
            setActiveAgentId(null);
            setAgents(prev => prev.map(a => ({ ...a, status: "idle" })));
          }, 3000);
        }
      }, index * 2500);
    });
  };

  const updateAgentStatus = (id: string, status: Agent["status"]) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status } : { ...a, status: "idle" }));
  };

  const addToFeed = (agentId: string, text: string) => {
    const agent = agents.find(a => a.id === agentId);
    setDebateFeed(prev => [{ agent, text, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  return (
    <div className="space-y-10 pb-20 overflow-hidden">
      {/* Header - HM-Designer (Extreme Premium Layout) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/[0.03] pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full w-fit">
             <Activity className="size-3 text-purple-400 animate-pulse" />
             <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Neural Intelligence Node</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none italic" style={{ fontFamily: "'Outfit', sans-serif" }}>
            STRATEGIC<span className="text-purple-500">BOARD</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px]">Governance & Strategic Simulation</p>
        </div>

        <div className="flex items-center gap-6 bg-white/[0.02] border border-white/[0.04] p-6 rounded-3xl backdrop-blur-xl">
           <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Board Quorum</p>
              <p className={cn("text-xl font-black uppercase tracking-tighter", isDebating ? "text-purple-400" : "text-emerald-400")}>
                 {isDebating ? "Active Session" : "Standby Mode"}
              </p>
           </div>
           <div className={cn(
             "size-12 rounded-2xl flex items-center justify-center border transition-all duration-700",
             isDebating ? "bg-purple-500/10 border-purple-500/30 text-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "bg-zinc-900 border-white/[0.05] text-zinc-700"
           )}>
              <Brain className={isDebating ? "animate-pulse" : ""} />
           </div>
        </div>
      </div>

      {/* Main Board Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cinematic Agent Cluster */}
        <Card className="lg:col-span-8 bg-[#0a0a0a] border-white/[0.03] relative min-h-[650px] flex items-center justify-center overflow-hidden shadow-2xl">
          {/* Ambient Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.08)_0%,_transparent_70%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.02] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/[0.01] rounded-full" />
          
          <div className="relative z-10 w-full h-full flex items-center justify-center">
             {/* Center Neural Core */}
             <motion.div 
               animate={{ 
                 scale: isDebating ? [1, 1.05, 1] : 1,
                 boxShadow: isDebating ? [
                   "0 0 40px rgba(168, 85, 247, 0.2)",
                   "0 0 80px rgba(168, 85, 247, 0.4)",
                   "0 0 40px rgba(168, 85, 247, 0.2)"
                 ] : "0 0 0px transparent"
               }}
               transition={{ duration: 2, repeat: Infinity }}
               className="size-44 rounded-[40px] bg-[#050505] border-2 border-purple-500/20 flex flex-col items-center justify-center gap-3 backdrop-blur-3xl"
             >
                <div className="size-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                   <Cpu className="text-white size-8" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Neural Core</span>
             </motion.div>

             {/* Orbiting Agents (HM-Designer: Dynamic Layout) */}
             {agents.map((agent, index) => {
                const angle = (index * (360 / agents.length)) * (Math.PI / 180);
                const radius = 240; 
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isActive = activeAgentId === agent.id;

                return (
                  <motion.div 
                    key={agent.id}
                    initial={false}
                    animate={{ 
                      x, y,
                      scale: isActive ? 1.1 : 1,
                      opacity: isDebating && !isActive ? 0.3 : 1
                    }}
                    transition={{ type: "spring", damping: 15, stiffness: 60 }}
                    className="absolute group cursor-pointer"
                  >
                     <div className="flex flex-col items-center gap-3">
                        <div className={cn(
                          "size-20 rounded-3xl flex items-center justify-center border-2 transition-all duration-700 relative",
                          isActive ? "bg-white/5 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "bg-black border-white/[0.05] grayscale group-hover:grayscale-0 group-hover:border-white/20"
                        )}>
                           {isActive && (
                             <motion.div 
                              layoutId="active-ring"
                              className="absolute -inset-2 border border-emerald-500/30 rounded-[36px] animate-ping" 
                             />
                           )}
                           <UserCheck className={cn("size-8", isActive ? "text-emerald-400" : "text-zinc-700")} />
                        </div>
                        <div className="text-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.03]">
                           <p className="text-[9px] font-black text-white uppercase tracking-tighter leading-none">{agent.id}</p>
                           <p className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{agent.role}</p>
                        </div>
                     </div>
                  </motion.div>
                );
             })}

             {/* Dynamic Connection Paths (HM-Engineer: SVG Animation) */}
             {activeAgentId && (
               <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/20 stroke-2 fill-none">
                  {/* Lines drawn here automatically by SVG logic if needed */}
               </svg>
             )}
          </div>

          <div className="absolute bottom-12 w-full max-w-md px-12 space-y-4">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Convergence Protocol</span>
                <span className="text-2xl font-black text-purple-500 italic">{progress}%</span>
            </div>
            <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.02]">
               <motion.div 
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
               />
            </div>
          </div>
        </Card>

        {/* Command Side Board */}
        <div className="lg:col-span-4 space-y-8">
            <Card className="bg-[#0a0a0a] border-white/[0.04] p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Target size={120} />
                </div>
                <div className="space-y-6 relative z-10">
                   <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Iniciativa Estratégica</h3>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Pitch para o conselho IA</p>
                   </div>
                   <textarea 
                    className="w-full h-36 bg-black border border-white/[0.05] rounded-2xl p-6 text-sm text-zinc-300 placeholder:text-zinc-800 focus:ring-1 focus:ring-purple-500/30 outline-none transition-all resize-none font-bold italic"
                    placeholder="Descreva seu movimento estratégico..."
                    value={strategyInput}
                    onChange={(e) => setStrategyInput(e.target.value)}
                    disabled={isDebating}
                   />
                   <Button 
                    variant="ghost"
                    onClick={handleStartDebate}
                    disabled={isDebating}
                    className="w-full h-16 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all"
                   >
                     {isDebating ? <MessagesSquare className="animate-pulse mr-2" /> : <Play className="mr-2 size-4" />}
                     Convocar Conselho
                   </Button>
                </div>
            </Card>

            <Card className="bg-[#0a0a0a] border-white/[0.04] flex flex-col h-[400px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.03] bg-white/[0.01] flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                       <Terminal className="size-3 text-purple-400" /> Neural Debate Feed
                    </span>
                    <Badge variant="outline" className="text-[8px] font-black border-emerald-500/20 text-emerald-500 uppercase">Live Trace</Badge>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    <AnimatePresence>
                      {debateFeed.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-800 gap-4">
                           <ShieldCheck size={48} className="opacity-20" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Aguardando Input Estratégico</p>
                        </div>
                      ) : (
                        debateFeed.map((item, i) => (
                           <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-2"
                           >
                             <div className="flex items-center gap-2">
                                <div className={cn("size-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]", item.agent.avatarColor)} />
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{item.agent.id} • {item.agent.role}</span>
                                <span className="text-[8px] text-zinc-700 ml-auto font-mono">{item.time}</span>
                             </div>
                             <p className="text-[11px] text-zinc-400 pl-4 border-l border-white/[0.05] italic font-medium leading-relaxed">
                               "{item.text}"
                             </p>
                           </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                </div>
            </Card>
        </div>
      </div>

      {/* Corporate Insights Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Lightbulb, title: "Neural Insight", val: "CAC Optimization", msg: "A análise tática sugere redução de 14% no turnover de pátio se implementado o protocolo." },
          { icon: Target, title: "Strategic Target", val: "LTV Projection", msg: "Cluster de dados indica viabilidade para nova unidade operada por IA no Q3." },
          { icon: Zap, title: "Efficiency Trigger", val: "Autonomous Flow", msg: "Aprovação pendente para integração do serviço de vistorias automáticas via mobile." }
        ].map((item, i) => (
          <Card key={i} className="bg-white/[0.01] border-white/[0.03] p-8 hover:bg-white/[0.02] transition-colors group">
             <div className="size-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="text-purple-500 size-6" />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{item.title}</p>
                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{item.val}</p>
                </div>
                <p className="text-sm font-bold text-zinc-500 italic leading-relaxed">"{item.msg}"</p>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Outlet, useNavigate, useLocation } from "react-router";
import { syncService } from "@/app/core/services/sync";
import { useState, useEffect, useCallback, Suspense } from "react";
import { Button } from "@/app/shared/ui/button";
import { cn } from "@/app/shared/ui/utils";
import Logo from "@/app/shared/components/Logo";
import EmpresaToggle from "@/app/shared/components/EmpresaToggle";
import {
  RefreshCw, CloudOff, Cloud, LogOut, Menu, X, ChevronDown,
  LayoutDashboard, Brain, DollarSign, BarChart3, TrendingUp,
  Target, LineChart, Users, Star, Lightbulb, Gauge, PieChart,
  ArrowLeft, Terminal, Clock, ShieldCheck, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  key: string;
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    key: "command",
    title: "Executive Command",
    items: [
      { path: "/executive", label: "Visão Geral", icon: LayoutDashboard },
      { path: "/executive/ia-qg", label: "AI Boardroom", icon: Brain },
      { path: "/executive/financeiro", label: "Capital Flow", icon: DollarSign },
      { path: "/executive/relatorios", label: "Intelligence", icon: BarChart3 },
      { path: "/executive/produtividade", label: "Unit Pulse", icon: Gauge },
    ],
  },
  {
    key: "analytics",
    title: "Deep Analytics",
    items: [
      { path: "/executive/analytics-roi", label: "Performance ROI", icon: TrendingUp },
      { path: "/executive/analytics-funil", label: "Conversion Funnel", icon: Target },
      { path: "/executive/analytics-churn", label: "Retention Scan", icon: LineChart },
      { path: "/executive/analytics-ltv", label: "Customer Value", icon: PieChart },
      { path: "/executive/analytics-nps", label: "Brand Equity", icon: Star },
    ],
  },
];

function formatSyncTime(iso: string): string {
  if (!iso) return "novo";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}m`;
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function ExecutiveLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    command: true,
    analytics: true,
  });

  const user = JSON.parse(localStorage.getItem("dap-user") || "{}");

  useEffect(() => {
    const snapshot = syncService.getLastSnapshot();
    if (snapshot) setLastSync(snapshot.timestamp);

    const onStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", onStatusChange);
    window.addEventListener("offline", onStatusChange);
    return () => {
      window.removeEventListener("online", onStatusChange);
      window.removeEventListener("offline", onStatusChange);
    };
  }, []);

  const handleSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setShowTerminal(true);
    const result = await syncService.syncNow();
    if (result) setLastSync(result.timestamp);

    setTimeout(() => {
      setIsSyncing(false);
      setTimeout(() => setShowTerminal(false), 1500);
    }, 2000);
  }, [isSyncing]);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const isActive = (path: string) => {
    if (path === "/executive") return location.pathname === "/executive";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full bg-[#050505]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Premium Brand Header */}
      <div className="p-6 pb-2">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.03] backdrop-blur-md">
            <div className="relative">
              <Logo size={32} className="filter contrast-125" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[12px] font-black text-white tracking-[0.2em] leading-none mb-1 uppercase italic" style={{ fontFamily: "'Outfit', sans-serif" }}>
                DOCTOR<span className="text-emerald-500">AUTO</span>
              </h1>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-500/50" />
                <span className="text-[8px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Executive QG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronicity Bar */}
      <div className="px-6 py-4">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-700 relative overflow-hidden group",
            isOnline 
              ? "bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/30" 
              : "bg-amber-500/5 border border-amber-500/20"
          )}
        >
          {isSyncing && (
            <motion.div 
              layoutId="sync-glimmer"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" 
            />
          )}
          <div className="flex items-center gap-3 relative z-10">
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              isOnline ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-400"
            )}>
              {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Cloud className="w-3 h-3" />}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/90">
                {isSyncing ? "Syncing Logic..." : isOnline ? "Cloud Secure" : "Local Mode"}
              </span>
              <span className="text-[8px] font-medium text-zinc-600 uppercase tracking-tight">
                Last: {lastSync ? formatSyncTime(lastSync) : "---"}
              </span>
            </div>
          </div>
          <Sparkles className="w-3 h-3 text-zinc-800 group-hover:text-emerald-500 transition-colors" />
        </button>
      </div>

      {/* Navigation Layer */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-hide py-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.key} className="space-y-2">
            <div className="flex items-center justify-between px-3 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">
              <span>{section.title}</span>
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      onItemClick?.();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold transition-all duration-500 group relative",
                      active
                        ? "text-emerald-400 bg-white/[0.03] border border-white/[0.05]"
                        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]"
                    )}
                  >
                    {active && (
                       <>
                        <motion.div 
                          layoutId="active-nav-bg"
                          className="absolute inset-0 bg-emerald-500/[0.03] rounded-xl -z-10" 
                        />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                       </>
                    )}
                    <Icon
                      strokeWidth={1.2}
                      className={cn(
                        "w-4 h-4 transition-transform duration-500",
                        active ? "scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "group-hover:translate-x-1"
                      )}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* VIP Footer Information */}
      <div className="p-6 pt-2 space-y-4">
        <div className="p-1 pb-4 border-b border-white/[0.03]">
           <EmpresaToggle className="bg-transparent border-none p-0 h-auto hover:bg-transparent" />
        </div>

        <div className="flex flex-col gap-2">
           <button
            onClick={() => navigate("/dashboard")}
            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white border border-white/[0.03] hover:border-emerald-500/30 transition-all bg-white/[0.01]"
           >
            <ArrowLeft className="w-3 h-3" /> Dashboard Operacional
           </button>
           
           <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a0a0a] border border-white/[0.05] group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                <Users className="w-4 h-4 text-emerald-500/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-white truncate uppercase italic">{user.nome || "Admin"}</p>
                <div className="flex items-center gap-1">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                   <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Acesso Alpha</p>
                </div>
              </div>
              <button onClick={() => navigate("/")} className="text-zinc-800 hover:text-red-500/50 transition-colors p-2">
                <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden selection:bg-emerald-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/20 blur-[150px] opacity-30 rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-950/20 blur-[120px] opacity-20 rounded-full" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] border-r border-white/[0.03] relative z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Scaffold */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        <header className="md:hidden bg-black/80 backdrop-blur-xl border-b border-white/[0.05] px-6 py-4 flex items-center justify-between">
          <Logo size={28} />
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Suspense fallback={<div className="h-full flex items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin text-emerald-500/20" /></div>}>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Cinematic Sync Terminal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-xl bg-black border border-emerald-500/20 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]"
            >
              <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                   <Terminal className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80 italic">Neural Sync v4.0</span>
                </div>
                <div className="flex gap-2">
                   <div className="size-2 rounded-full bg-red-500/20" />
                   <div className="size-2 rounded-full bg-yellow-500/20" />
                   <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
              </div>
              <div className="p-8 font-mono text-[11px] leading-relaxed text-emerald-500/60 h-[320px] overflow-y-auto scrollbar-hide">
                 <p className="text-white/40">[{new Date().toLocaleTimeString()}] Handshaking with core neural cluster...</p>
                 <p className="mt-2 text-emerald-400"># Fetching Corporate Metadata</p>
                 <p className="pl-4 border-l border-emerald-500/10">» Metrics 2.0: OK</p>
                 <p className="pl-4 border-l border-emerald-500/10">» AI Board State: SYNCED</p>
                 <p className="pl-4 border-l border-emerald-500/10">» Unit Snapshots: LOADED</p>
                 <p className="mt-4 text-white/60"># Consolidating Financial Flux...</p>
                 {isSyncing ? (
                   <div className="mt-6 flex items-center gap-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span className="text-emerald-400 font-black tracking-widest uppercase text-[10px]">Processing Stratosphere Data...</span>
                   </div>
                 ) : (
                   <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-6 p-4 rounded-xl bg-emerald-500 border border-emerald-400 text-black font-black uppercase tracking-[0.2em] text-center text-xs"
                   >
                     SYNCHRONIZATION COMPLETE
                   </motion.div>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-black z-50 border-r border-white/[0.05]"
            >
              <div className="flex justify-end p-4">
                 <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X /></Button>
              </div>
              <SidebarContent onItemClick={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


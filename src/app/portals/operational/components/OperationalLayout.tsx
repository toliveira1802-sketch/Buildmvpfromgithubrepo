import React, { useState, Suspense } from "react";
import {
  PlusCircle,
  ClipboardList,
  Users,
  LayoutDashboard,
  Settings,
  Bell,
  LogOut,
  Search,
  Menu,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Car,
  Zap
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { Button } from "@/app/shared/ui/button";
import { cn } from "@/app/shared/ui/utils";
import Logo from "@/app/shared/components/Logo";
import EmpresaToggle from "@/app/shared/components/EmpresaToggle";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Trinity Manager", icon: LayoutDashboard, path: "/operational/hub" },
  { label: "Dashboard", icon: Zap, path: "/operational" },
  { label: "Fast Check-in", icon: PlusCircle, path: "/operational/fast-checkin" },
  { label: "Ordens de Serviço", icon: ClipboardList, path: "/operational/os" },
  { label: "Meus Clientes", icon: Users, path: "/operational/clients" },
  { label: "Meus Veículos", icon: Car, path: "/operational/vehicles" },
  { label: "Configurações", icon: Settings, path: "/operational/settings" },
];

export default function OperationalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const user = JSON.parse(localStorage.getItem("dap-user") || "{}");

  const isActive = (path: string) => {
    if (path === "/operational") return location.pathname === "/operational";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-white/[0.04]">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <Logo size={36} className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white tracking-[0.2em] leading-none mb-1">
              DAP PRIME
            </h1>
            <p className="text-[9px] font-bold tracking-[0.2em] text-emerald-500/80 uppercase">
              Operational Hub
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 mb-6">
          <button 
            onClick={() => navigate("/operational/fast-checkin")}
            className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
          >
            <PlusCircle className="w-4 h-4" />
            New Service
          </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group relative",
                active 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]" 
                  : "text-white/40 hover:text-white/90 hover:bg-white/[0.02]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon strokeWidth={1.5} className={cn("w-4.5 h-4.5 transition-colors", active ? "text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "text-white/20 group-hover:text-emerald-500/50")} />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {active && <ChevronRight className="w-3 h-3 text-emerald-400/50" />}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-4 pb-6 pt-4 mt-auto border-t border-white/[0.04] space-y-4">
        
        <EmpresaToggle className="bg-white/[0.03] border-white/[0.05] h-10 hover:bg-white/[0.04]" />

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.04]">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">
                {user.nome || "Mestre Naruto"}
              </p>
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                Consultor Jounin
              </p>
            </div>
            <button className="p-1.5 text-white/20 hover:text-red-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 overflow-hidden font-sans">
      {/* Decoration */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 relative z-20">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden z-10">
        {/* Superior Header */}
        <header className="h-16 border-b border-white/[0.04] bg-[#0a0a0a]/50 backdrop-blur-xl flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 text-white/60" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] rounded-full px-4 py-1.5 w-64 md:w-96 group focus-within:border-emerald-500/50 transition-all">
              <Search className="w-4 h-4 text-white/20 group-focus-within:text-emerald-500" />
              <input 
                type="text" 
                placeholder="Search by plate, client or OS..." 
                className="bg-transparent border-none focus:ring-0 text-[11px] font-bold uppercase tracking-wider w-full placeholder:text-white/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/80 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Secure Session
            </div>
            <button className="relative p-2 text-white/20 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto bg-transparent p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md animate-in fade-in duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside 
            className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0a0a0a] flex flex-col animate-in slide-in-from-left duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}

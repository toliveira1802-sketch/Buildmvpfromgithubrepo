import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, Eye, PlusCircle, Wrench, Calendar,
  Users, FileText, DollarSign, BarChart3, Activity,
  TrendingUp, LogOut, Menu, X, ChevronDown, MessageSquare
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface ConsultorLayoutProps { children: ReactNode; }
interface MenuItem { path: string; label: string; icon: any; }

// Itens principais
const mainItems: MenuItem[] = [
  { path: "/dashboard",          label: "Dashboard",      icon: LayoutDashboard },
  { path: "/overview",           label: "Visão Geral",    icon: Eye },
  { path: "/ordens-servico/nova",label: "Nova OS",        icon: PlusCircle },
  { path: "/patio",              label: "Pátio Kanban",   icon: Wrench },
  { path: "/agendamentos",       label: "Agendamentos",   icon: Calendar },
];

// Seção CADASTRO
const cadastroItems: MenuItem[] = [
  { path: "/clientes",       label: "Clientes",          icon: Users },
  { path: "/ordens-servico", label: "Ordens de Serviço", icon: FileText },
];

// Seção GESTÃO
const gestaoItems: MenuItem[] = [
  { path: "/financeiro",        label: "Financeiro",       icon: DollarSign },
  { path: "/produtividade",     label: "Produtividade",    icon: TrendingUp },
  { path: "/operacional",       label: "Operacional",      icon: Activity },
  { path: "/outros_relatorios", label: "Outros Relatórios",icon: BarChart3 },
];

export default function ConsultorLayout({ children }: ConsultorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cadastro: true, gestao: true,
  });

  const user = JSON.parse(
    localStorage.getItem("dap-user") || sessionStorage.getItem("dap-user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("dap-user");
    localStorage.removeItem("dap-token");
    sessionStorage.removeItem("dap-user");
    sessionStorage.removeItem("dap-token");
    navigate("/login");
  };

  const toggleSection = (key: string) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const isActive = (path: string) => location.pathname === path;

  const renderItem = (item: MenuItem, onClick?: () => void) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const isNova = item.path === "/ordens-servico/nova";
    return (
      <button key={item.path}
        onClick={() => { navigate(item.path); onClick?.(); }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
          active ? "bg-blue-600 text-white"
          : isNova ? "bg-blue-950 text-blue-400 hover:bg-blue-900 hover:text-blue-300 border border-blue-900"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}>
        <Icon className="size-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  const renderSection = (key: string, title: string, items: MenuItem[], onClick?: () => void) => (
    <div key={key}>
      <button onClick={() => toggleSection(key)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors">
        <span>{title}</span>
        <ChevronDown className={`size-3 transition-transform ${openSections[key] ? "" : "-rotate-90"}`} />
      </button>
      {openSections[key] && (
        <div className="mt-1 space-y-0.5 pl-2 border-l border-zinc-800 ml-3">
          {items.map(item => renderItem(item, onClick))}
        </div>
      )}
    </div>
  );

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <div className="p-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">Doctor Auto</h1>
            <p className="text-[11px] text-blue-400 font-medium">{user.cargo || "Consultor"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {mainItems.map(item => renderItem(item, onItemClick))}
        <div className="pt-3 pb-1">
          {renderSection("cadastro", "Cadastro", cadastroItems, onItemClick)}
        </div>
        <div className="pt-1 pb-1">
          {renderSection("gestao", "Gestão", gestaoItems, onItemClick)}
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="mb-3 px-1">
          <p className="text-[11px] text-zinc-500">Logado como</p>
          <p className="text-sm text-white font-medium truncate">{user.nome || user.name || user.username || "—"}</p>
          <p className="text-[11px] text-zinc-500 capitalize">{user.cargo || "Consultor"}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-950 text-sm"
          onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-black flex">
      <aside className="hidden md:flex flex-col w-60 bg-zinc-900 border-r border-zinc-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Doctor Auto</h1>
              <p className="text-[11px] text-blue-400">Consultor</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5 text-white" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80" onClick={() => setSidebarOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-end p-4 border-b border-zinc-800">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="size-5 text-zinc-400" />
              </Button>
            </div>
            <SidebarContent onItemClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}

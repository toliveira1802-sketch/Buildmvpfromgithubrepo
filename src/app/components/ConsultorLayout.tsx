import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, Wrench, Calendar, Users, FileText,
  LogOut, Menu, X, ClipboardList, Car, DollarSign,
  MessageSquare, Bell
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface ConsultorLayoutProps { children: ReactNode; }

const menuItems = [
  { path: "/dashboard",       label: "Dashboard",          icon: LayoutDashboard },
  { path: "/patio",           label: "Pátio Kanban",        icon: Car },
  { path: "/agendamentos",    label: "Agendamentos",        icon: Calendar },
  { path: "/clientes",        label: "Clientes",            icon: Users },
  { path: "/ordens-servico",  label: "Ordens de Serviço",   icon: FileText },
  { path: "/pendencias",      label: "Pendências",          icon: ClipboardList },
  { path: "/relatorios",      label: "Relatórios",          icon: DollarSign },
];

export default function ConsultorLayout({ children }: ConsultorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Doctor Auto</h1>
            <p className="text-xs text-blue-400 font-medium">Consultor</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button key={item.path}
              onClick={() => { navigate(item.path); onItemClick?.(); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}>
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="mb-3 px-1">
          <p className="text-xs text-zinc-500">Logado como</p>
          <p className="text-sm text-white font-medium truncate">
            {user.name || user.username || "Consultor"}
          </p>
          <p className="text-xs text-zinc-500 capitalize">{user.cargo || "Consultor"}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-950"
          onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800">
        <SidebarContent />
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        {/* Header Mobile */}
        <header className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">Doctor Auto</h1>
              <p className="text-xs text-blue-400">Consultor</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5 text-white" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80" onClick={() => setSidebarOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end p-4 border-b border-zinc-800">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="size-5 text-white" />
              </Button>
            </div>
            <SidebarContent onItemClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}

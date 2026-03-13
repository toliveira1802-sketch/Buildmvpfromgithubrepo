import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { 
  Database, 
  Table, 
  Settings, 
  Users, 
  LogOut,
  FileCode,
  Server,
  Activity,
  Shield,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface DevLayoutProps {
  children: ReactNode;
}

export default function DevLayout({ children }: DevLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("dap-user");
    navigate("/");
  };

  const menuItems = [
    { path: "/dev-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dev-tables", label: "Gerenciar Tabelas", icon: Table },
    { path: "/dev-users", label: "Gerenciar Usuários", icon: Users },
    { path: "/dev-database", label: "Banco de Dados", icon: Database },
    { path: "/dev-apis", label: "APIs & Integrações", icon: Server },
    { path: "/dev-logs", label: "Logs do Sistema", icon: Activity },
    { path: "/dev-permissions", label: "Permissões", icon: Shield },
    { path: "/dev-settings", label: "Configurações", icon: Settings },
    { path: "/dev-docs", label: "Documentação", icon: FileCode },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800"
      )}>
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img 
              src="figma:asset/c84924fffe8eefdfa83c8a6fa6d7ef2e7b310b86.png" 
              alt="Doctor Auto Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-semibold text-white">
                Doctor Auto
              </h1>
              <p className="text-xs text-zinc-500">
                Painel DEV
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <Icon className="size-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="figma:asset/c84924fffe8eefdfa83c8a6fa6d7ef2e7b310b86.png" 
              alt="Doctor Auto Logo" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-lg font-semibold text-white">Doctor Auto</h1>
              <p className="text-xs text-zinc-500">Painel DEV</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5 text-white" />
          </Button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80" onClick={() => setSidebarOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="figma:asset/c84924fffe8eefdfa83c8a6fa6d7ef2e7b310b86.png" 
                  alt="Doctor Auto Logo" 
                  className="w-8 h-8"
                />
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    Doctor Auto
                  </h1>
                  <p className="text-xs text-zinc-500">
                    Painel DEV
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    )}
                  >
                    <Icon className="size-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-zinc-800">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-950"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
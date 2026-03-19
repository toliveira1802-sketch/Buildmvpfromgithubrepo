import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { 
  Database, 
  Table, 
  Settings, 
  Users, 
  LogOut,
  FileCode,
  Activity,
  Shield,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Brain,
  Sparkles,
  Cpu,
  Wrench,
  UserCircle2,
  Car,
  UserCircle,
  Key,
  FileStack
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import Logo from "./Logo";

interface DevLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: any;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export default function DevLayout({ children }: DevLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("dap-user");
    sessionStorage.removeItem("dap-user");
    localStorage.removeItem("dap-token");
    sessionStorage.removeItem("dap-token");
    navigate("/");
  };

  // Estrutura de menu organizada por seções
  const menuSections: MenuSection[] = [
    {
      title: "SISTEMA",
      items: [
        { path: "/dev-logs", label: "Logs", icon: Activity },
        { path: "/dev-configuracoes", label: "Configurações", icon: Settings },
        { path: "/dev-documentacao", label: "Documentação", icon: BookOpen },
        { path: "/dev-api", label: "API", icon: FileStack },
        { path: "/dev-permissoes", label: "Permissões", icon: Key },
      ]
    },
    {
      title: "IA",
      items: [
        { path: "/ia-qg", label: "IA QG", icon: Brain },
        { path: "/dev-perfil-ia", label: "Perfil IA", icon: Sparkles },
        { path: "/dev-ia-portal", label: "IA Portal", icon: Cpu },
      ]
    },
    {
      title: "DADOS",
      items: [
        { path: "/dev-tables", label: "Tables", icon: Table },
        { path: "/dev-users", label: "Users", icon: Users },
        { path: "/dev-database", label: "Database", icon: Database },
      ]
    },
    {
      items: [
        { path: "/dev-processos", label: "Processos", icon: Activity },
        { path: "/dev-ferramentas", label: "Ferramentas", icon: Wrench },
      ]
    }
  ];

  // Links para outras sidebars
  const otherSidebars = [
    { path: "/gestao/visao-geral", label: "SIDEBAR GESTÃO", icon: UserCircle2 },
    { path: "/dashboard", label: "SIDEBAR CONSULTORES", icon: Users },
    { path: "/patio", label: "SIDEBAR MECÂNICOS", icon: Wrench },
    { path: "/", label: "SIDEBAR CLIENTE", icon: Car },
  ];

  const renderMenuSections = (onItemClick?: () => void) => (
    <>
      {/* Painel Principal */}
      <button
        onClick={() => {
          navigate("/dev-dashboard");
          onItemClick?.();
        }}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all text-sm font-medium mb-6",
          location.pathname === "/dev-dashboard"
            ? "bg-red-600 text-white"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700"
        )}
      >
        <LayoutDashboard className="size-4" />
        <span>/dev/painel</span>
      </button>

      {/* Seções do Menu */}
      {menuSections.map((section, sectionIdx) => (
        <div key={`section-${sectionIdx}`} className="mb-6">
          {section.title && (
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">
              {section.title}
            </h3>
          )}
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    onItemClick?.();
                  }}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all text-sm font-medium",
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700"
                  )}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Divider */}
      <div className="border-t border-zinc-800 my-6"></div>

      {/* Links para outras sidebars */}
      <div className="space-y-2">
        {otherSidebars.map((sidebar) => {
          const Icon = sidebar.icon;
          return (
            <button
              key={sidebar.path}
              onClick={() => {
                navigate(sidebar.path);
                onItemClick?.();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700"
            >
              <Icon className="size-4 flex-shrink-0" />
              <span className="truncate text-xs uppercase">{sidebar.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Logo size={40} />
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

        <nav className="flex-1 p-4 overflow-y-auto">
          {renderMenuSections()}
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
                <Logo size={32} />
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

            <nav className="flex-1 p-4 overflow-y-auto">
              {renderMenuSections(() => setSidebarOpen(false))}
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
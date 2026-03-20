import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Database, Table, Settings, Users, LogOut, Activity, BookOpen,
  Brain, Sparkles, Cpu, Wrench, Car, Key, FileStack, Terminal,
  LayoutDashboard, ChevronDown, ChevronRight, UserCircle2, Bot,
  GitMerge, Plug, Calculator, GraduationCap, MoreHorizontal,
  TrendingUp, CheckCircle, Megaphone, Building2, User, Cog,
  Network, BarChart3, Shield, Layers
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import Logo from "./Logo";

interface DevLayoutProps { children: ReactNode; }

// ─── ESTRUTURA DO MENU ────────────────────────────────────────────
type NavItem = { path: string; label: string; icon: any; badge?: string };
type SubGroup = { label: string; items: NavItem[] };
type Section = {
  key: string; label: string; icon: any;
  collapsible: boolean;
  items?: NavItem[];
  subGroups?: SubGroup[];
};

const NAV: Section[] = [
  // ── SISTEMA ──
  {
    key: "sistema", label: "SISTEMA", icon: Cog, collapsible: true,
    items: [
      { path: "/dev-logs",          label: "Logs",          icon: Activity },
      { path: "/dev-api",           label: "API",           icon: FileStack },
      { path: "/dev-permissoes",    label: "Permissões",    icon: Shield },
      { path: "/dev-documentacao",  label: "Documentação",  icon: BookOpen },
    ],
    subGroups: [
      {
        label: "Configuração",
        items: [
          { path: "/dev-users",           label: "Users",       icon: Users },
          { path: "/gestao/metas",        label: "Metas",       icon: TrendingUp },
          { path: "/gestao/rh",           label: "RH (Empresa/Consultor/Mecânico)", icon: Building2 },
          { path: "/dev-configuracoes",   label: "Migrações",   icon: GitMerge },
          { path: "/admin/integracoes",   label: "Integrações", icon: Plug },
        ]
      },
      {
        label: "Processos",
        items: [
          { path: "/dev-processos",       label: "Sistema",     icon: Network },
          { path: "/patio",               label: "Pátio",       icon: Car },
          { path: "/dev-ferramentas",     label: "Diagramas",   icon: Layers },
        ]
      },
      {
        label: "Ferramentas",
        items: [
          { path: "/dev-ferramentas",     label: "Calculadora", icon: Calculator },
          { path: "/dev-documentacao",    label: "Estudos",     icon: GraduationCap },
          { path: "/dev-ferramentas",     label: "Etc",         icon: MoreHorizontal },
        ]
      },
      {
        label: "Melhorias",
        items: [
          { path: "/gestao/melhorias",    label: "Em Andamento",icon: TrendingUp },
          { path: "/gestao/melhorias",    label: "Implantadas", icon: CheckCircle },
        ]
      },
    ]
  },

  // ── DEV ──
  {
    key: "dev", label: "DEV", icon: LayoutDashboard, collapsible: true,
    items: [
      { path: "/dev-dashboard",   label: "/dev/dashboard",       icon: LayoutDashboard },
      { path: "/dev-explorer",    label: "/dev/page-navigator",  icon: FileStack },
    ]
  },

  // ── DADOS ──
  {
    key: "dados", label: "DADOS", icon: Database, collapsible: true,
    items: [
      { path: "/dev-tables",    label: "/dev/data/tables + SQL Agent",  icon: Table },
      { path: "/dev-database",  label: "/dev/data/database",           icon: Database },
    ]
  },

  // ── IA HUB ──
  {
    key: "ia", label: "IA HUB", icon: Brain, collapsible: true,
    items: [
      { path: "/dev-dashboard-ia",  label: "/dashboardIA",     icon: Brain,        badge: "Em Dev" },
      { path: "/dev-outras-hub",    label: "/outras-do-hub",   icon: Bot,          badge: "Em Dev" },
      { path: "/ia-qg",             label: "/ia-qg",           icon: Sparkles },
      { path: "/dev-perfil-ia",     label: "/dev-perfil-ia",   icon: UserCircle2 },
      { path: "/dev-ia-portal",     label: "/dev-ia-portal",   icon: Cpu },
    ]
  },
];

const OTHER_SIDEBARS = [
  { path: "/gestao/visao-geral",  label: "GESTÃO",      icon: BarChart3 },
  { path: "/dashboard",           label: "CONSULTOR",   icon: Users },
  { path: "/patio",               label: "MECÂNICO",    icon: Wrench },
  { path: "/",                    label: "MARKETING",   icon: Megaphone },
];

export default function DevLayout({ children }: DevLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>({
    sistema: true, dev: true, dados: true, ia: true
  });
  const [subOpen, setSubOpen] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("dap-user"); sessionStorage.removeItem("dap-user");
    localStorage.removeItem("dap-token"); sessionStorage.removeItem("dap-token");
    navigate("/");
  };

  const toggleSection = (key: string) =>
    setOpen(p => ({ ...p, [key]: !p[key] }));

  const toggleSub = (key: string) =>
    setSubOpen(p => ({ ...p, [key]: !p[key] }));

  const isActive = (path: string) => location.pathname === path;

  const NavBtn = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    return (
      <button onClick={() => { navigate(item.path); setSidebarOpen(false); }}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all",
          isActive(item.path)
            ? "bg-red-600 text-white font-semibold"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        )}>
        <Icon className="size-3.5 flex-shrink-0" />
        <span className="truncate flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className="text-[9px] bg-yellow-500/20 text-yellow-400 border border-yellow-700 px-1 rounded">{item.badge}</span>
        )}
      </button>
    );
  };

  const renderNav = () => (
    <div className="space-y-1">
      {/* Botão painel */}
      <button onClick={() => navigate("/dev-dashboard")}
        className={cn("w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium mb-4 transition-all",
          isActive("/dev-dashboard") ? "bg-red-600 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700"
        )}>
        <LayoutDashboard className="size-4" /> /dev/painel
      </button>

      {NAV.map(section => {
        const SIcon = section.icon;
        const isOpen = open[section.key];
        return (
          <div key={section.key} className="mb-1">
            {/* Header da seção */}
            <button onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider">
              <div className="flex items-center gap-1.5"><SIcon className="size-3" />{section.label}</div>
              {isOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            </button>

            {isOpen && (
              <div className="ml-2 space-y-0.5 mt-0.5">
                {/* Items diretos */}
                {section.items?.map(item => <NavBtn key={item.path + item.label} item={item} />)}

                {/* SubGroups colapsáveis */}
                {section.subGroups?.map(sg => {
                  const sgKey = section.key + "_" + sg.label;
                  const sgOpen = subOpen[sgKey] !== false; // default aberto
                  return (
                    <div key={sgKey} className="mt-1">
                      <button onClick={() => toggleSub(sgKey)}
                        className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-semibold text-zinc-500 hover:text-zinc-300 uppercase tracking-wider">
                        <span>{sg.label}</span>
                        {sgOpen ? <ChevronDown className="size-2.5" /> : <ChevronRight className="size-2.5" />}
                      </button>
                      {sgOpen && (
                        <div className="ml-2 space-y-0.5">
                          {sg.items.map(item => <NavBtn key={item.path + item.label} item={item} />)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Divisor */}
      <div className="border-t border-zinc-800 my-3" />

      {/* Links outras sidebars */}
      <p className="text-[10px] text-zinc-600 uppercase tracking-wider px-2 mb-1">Acessar</p>
      {OTHER_SIDEBARS.map(s => {
        const Icon = s.icon;
        return (
          <button key={s.path + s.label} onClick={() => navigate(s.path)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all">
            <Icon className="size-3.5" />
            <span className="uppercase tracking-wide text-[10px]">{s.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-zinc-900 border-r border-zinc-800 flex-shrink-0">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-2.5">
          <Logo size={32} />
          <div>
            <h1 className="text-sm font-bold text-white">Doctor Auto</h1>
            <p className="text-[10px] text-zinc-500">Painel DEV</p>
          </div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">{renderNav()}</nav>
        <div className="p-3 border-t border-zinc-800">
          <Button variant="ghost" size="sm"
            className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-950 text-xs"
            onClick={handleLogout}>
            <LogOut className="mr-2 size-3.5" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Database, Table, Users, LogOut, Activity, BookOpen,
  Brain, Sparkles, Cpu, Wrench, Car, FileStack, Terminal,
  LayoutDashboard, ChevronDown, ChevronRight, UserCircle2, Bot,
  GitMerge, Plug, Calculator, GraduationCap, MoreHorizontal,
  TrendingUp, CheckCircle, Building2, Cog,
  Network, BarChart3, Shield, Layers, Code2,
  Zap, Store
} from "lucide-react";
import { cn } from "./ui/utils";
import Logo from "./Logo";

interface DevLayoutProps { children: ReactNode; }

const SECTION_COLORS: Record<string, {
  header: string; headerBg: string; headerBorder: string;
  itemActive: string; itemActiveBg: string; dot: string;
}> = {
  dev:    { header:"text-blue-300",    headerBg:"bg-blue-950/40",    headerBorder:"border-blue-800/60",    itemActive:"text-blue-300",    itemActiveBg:"bg-blue-900/40",    dot:"bg-blue-400" },
  dados:  { header:"text-emerald-300", headerBg:"bg-emerald-950/40", headerBorder:"border-emerald-800/60", itemActive:"text-emerald-300", itemActiveBg:"bg-emerald-900/40", dot:"bg-emerald-400" },
  ia:     { header:"text-purple-300",  headerBg:"bg-purple-950/40",  headerBorder:"border-purple-800/60",  itemActive:"text-purple-300",  itemActiveBg:"bg-purple-900/40",  dot:"bg-purple-400" },
  sistema:{ header:"text-zinc-300",    headerBg:"bg-zinc-800/40",    headerBorder:"border-zinc-700/60",    itemActive:"text-zinc-200",    itemActiveBg:"bg-zinc-700/50",    dot:"bg-zinc-400" },
};

type NavItem = { path: string; label: string; icon: any; badge?: string; badgeColor?: string };
type SubGroup = { label: string; items: NavItem[] };
type Section = { key: string; label: string; icon: any; emoji?: string; items?: NavItem[]; subGroups?: SubGroup[] };

const NAV: Section[] = [
  {
    key: "dev", label: "DEV", icon: Code2, emoji: "⌨️",
    items: [
      { path: "/dev-dashboard",  label: "/dev/dashboard",      icon: LayoutDashboard },
      { path: "/dev-explorer",   label: "/dev/page-navigator", icon: FileStack },
    ]
  },
  {
    key: "dados", label: "DADOS", icon: Database, emoji: "🗄️",
    items: [
      { path: "/dev-tables",   label: "/dev/data/tables",   icon: Table, badge: "SQL" },
      { path: "/dev-database", label: "/dev/data/database", icon: Database },
    ]
  },
  {
    key: "ia", label: "IA HUB", icon: Brain, emoji: "🧠",
    items: [
      { path: "/dev-dashboard-ia", label: "/dashboardIA",   icon: Brain,       badge: "Dev", badgeColor: "yellow" },
      { path: "/dev-outras-hub",   label: "/outras-do-hub", icon: Bot,         badge: "Dev", badgeColor: "yellow" },
      { path: "/ia-qg",            label: "/ia-qg",         icon: Sparkles },
      { path: "/dev-perfil-ia",    label: "/dev-perfil-ia", icon: UserCircle2 },
      { path: "/dev-ia-portal",    label: "/dev-ia-portal", icon: Cpu },
    ]
  },
  {
    key: "sistema", label: "SISTEMA", icon: Cog, emoji: "⚙️",
    items: [
      { path: "/dev-logs",         label: "Logs",         icon: Activity },
      { path: "/dev-api",          label: "API",          icon: Zap },
      { path: "/dev-permissoes",   label: "Permissões",   icon: Shield },
      { path: "/dev-documentacao", label: "Documentação", icon: BookOpen },
    ],
    subGroups: [
      { label: "Configuração", items: [
        { path: "/dev-users",         label: "Users",       icon: Users },
        { path: "/gestao/metas",      label: "Metas",       icon: TrendingUp },
        { path: "/gestao/rh",         label: "RH",          icon: Building2 },
        { path: "/dev-configuracoes", label: "Migrações",   icon: GitMerge },
        { path: "/dev-integracoes",  label: "Integrações", icon: Plug },
      ]},
      { label: "Processos", items: [
        { path: "/dev-processos",   label: "Sistema",   icon: Network },
        { path: "/patio",           label: "Pátio",     icon: Car },
        { path: "/dev-ferramentas", label: "Diagramas", icon: Layers },
      ]},
      { label: "Ferramentas", items: [
        { path: "/dev-ferramentas",  label: "Calculadora", icon: Calculator },
        { path: "/dev-documentacao", label: "Estudos",     icon: GraduationCap },
        { path: "/dev-ferramentas",  label: "Etc",         icon: MoreHorizontal },
      ]},
      { label: "Melhorias", items: [
        { path: "/gestao/melhorias", label: "Em Andamento", icon: TrendingUp },
        { path: "/gestao/melhorias", label: "Implantadas",  icon: CheckCircle },
      ]},
    ]
  },
];

const OTHER_SIDEBARS = [
  { path: "/gestao/visao-geral", label: "GESTÃO",    icon: BarChart3, color: "text-amber-400 hover:bg-amber-950/30" },
  { path: "/dashboard",          label: "CONSULTOR", icon: Users,     color: "text-blue-400 hover:bg-blue-950/30" },
  { path: "/patio",              label: "MECÂNICO",  icon: Wrench,    color: "text-orange-400 hover:bg-orange-950/30" },
  { path: "/",                   label: "CLIENTE",   icon: Store,     color: "text-green-400 hover:bg-green-950/30" },
];

export default function DevLayout({ children }: DevLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>({ dev: true, dados: true, ia: true, sistema: false });
  const [subOpen, setSubOpen] = useState<Record<string, boolean>>({});

  const handleLogout = () => {
    localStorage.removeItem("dap-user"); sessionStorage.removeItem("dap-user");
    localStorage.removeItem("dap-token"); sessionStorage.removeItem("dap-token");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;
  const toggle = (key: string) => setOpen(p => ({ ...p, [key]: !p[key] }));
  const toggleSub = (key: string) => setSubOpen(p => ({ ...p, [key]: !p[key] }));

  const NavBtn = ({ item, sectionKey }: { item: NavItem; sectionKey: string }) => {
    const Icon = item.icon;
    const colors = SECTION_COLORS[sectionKey];
    const active = isActive(item.path);
    const badgeStyles: Record<string, string> = {
      yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-700/60",
      green:  "bg-green-500/15 text-green-400 border-green-700/60",
      blue:   "bg-blue-500/15 text-blue-400 border-blue-700/60",
    };
    return (
      <button onClick={() => navigate(item.path)}
        className={cn("w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all duration-150 group",
          active ? cn(colors.itemActiveBg, colors.itemActive) : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
        )}>
        <span className={cn("w-1 h-1 rounded-full flex-shrink-0", active ? colors.dot : "bg-transparent group-hover:bg-zinc-600")} />
        <Icon className="size-3.5 flex-shrink-0" />
        <span className="truncate flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className={cn("text-[9px] px-1 py-0.5 rounded border font-mono",
            badgeStyles[item.badgeColor || "blue"] || badgeStyles.blue
          )}>{item.badge}</span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="hidden md:flex flex-col w-52 bg-zinc-900 border-r border-zinc-800/80 flex-shrink-0 h-screen sticky top-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-3 py-4 border-b border-zinc-800/80 flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                <Logo size={20} />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">Doctor Auto</p>
                <p className="text-zinc-500 text-[10px] mt-0.5">Painel DEV</p>
              </div>
            </div>
            <button onClick={() => navigate("/dev-dashboard")}
              className={cn("w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-mono font-medium transition-all border",
                isActive("/dev-dashboard") ? "bg-red-600 text-white border-red-500" : "text-zinc-400 border-zinc-700/60 hover:border-zinc-500 hover:text-white hover:bg-zinc-800/60"
              )}>
              <Terminal className="size-3.5" /> /dev/painel
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {NAV.map(section => {
              const SIcon = section.icon;
              const colors = SECTION_COLORS[section.key];
              const isOpen = open[section.key];
              return (
                <div key={section.key}>
                  <button onClick={() => toggle(section.key)}
                    className={cn("w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border",
                      isOpen ? cn(colors.headerBg, colors.header, colors.headerBorder) : "text-zinc-600 border-transparent hover:text-zinc-400 hover:bg-zinc-800/40"
                    )}>
                    <div className="flex items-center gap-1.5">
                      {section.emoji && <span className="text-[11px]">{section.emoji}</span>}
                      <SIcon className="size-3" />
                      <span>{section.label}</span>
                    </div>
                    {isOpen ? <ChevronDown className="size-3 opacity-60" /> : <ChevronRight className="size-3 opacity-40" />}
                  </button>

                  {isOpen && (
                    <div className="mt-1 ml-1 space-y-0.5 border-l border-zinc-800/60 pl-2">
                      {section.items?.map(item => <NavBtn key={item.path + item.label} item={item} sectionKey={section.key} />)}
                      {section.subGroups?.map(sg => {
                        const sgKey = `${section.key}_${sg.label}`;
                        const sgOpen = subOpen[sgKey] !== false;
                        return (
                          <div key={sgKey} className="mt-1.5">
                            <button onClick={() => toggleSub(sgKey)}
                              className="w-full flex items-center justify-between px-2 py-1 text-[9px] font-semibold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">
                              <span>{sg.label}</span>
                              {sgOpen ? <ChevronDown className="size-2.5" /> : <ChevronRight className="size-2.5" />}
                            </button>
                            {sgOpen && (
                              <div className="space-y-0.5">
                                {sg.items.map(item => <NavBtn key={item.path + item.label} item={item} sectionKey={section.key} />)}
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
          </nav>

          {/* Footer — outras sidebars */}
          <div className="flex-shrink-0 border-t border-zinc-800/80 px-2 py-2">
            <p className="text-[9px] text-zinc-700 uppercase tracking-widest px-2 mb-1.5 font-semibold">Acessar</p>
            <div className="space-y-0.5">
              {OTHER_SIDEBARS.map(s => {
                const Icon = s.icon;
                return (
                  <button key={s.label} onClick={() => navigate(s.path)}
                    className={cn("w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all", s.color)}>
                    <Icon className="size-3 flex-shrink-0" /><span>{s.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={handleLogout}
              className="mt-2 w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-semibold text-red-500 hover:bg-red-950/40 hover:text-red-400 transition-all uppercase tracking-wider">
              <LogOut className="size-3" /> Sair
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

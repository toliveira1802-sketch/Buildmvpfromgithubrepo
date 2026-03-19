import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ExternalLink, Grid, List, Tag } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import DevLayout from "../components/DevLayout";

const ALL_PAGES = [
  // DEV
  { path: "/dev-dashboard",      label: "Dev Dashboard",         group: "Dev" },
  { path: "/dev-users",          label: "Dev Users",             group: "Dev" },
  { path: "/dev-tables",         label: "Dev Tables",            group: "Dev" },
  { path: "/dev-database",       label: "Dev Database",          group: "Dev" },
  { path: "/dev-ia-portal",      label: "Dev IA Portal",         group: "Dev" },
  { path: "/dev-perfil-ia",      label: "Dev Perfil IA",         group: "Dev" },
  { path: "/dev-logs",           label: "Dev Logs",              group: "Dev" },
  { path: "/dev-configuracoes",  label: "Dev Configurações",     group: "Dev" },
  { path: "/dev-documentacao",   label: "Dev Documentação",      group: "Dev" },
  { path: "/dev-api",            label: "Dev API",               group: "Dev" },
  { path: "/dev-permissoes",     label: "Dev Permissões",        group: "Dev" },
  { path: "/dev-processos",      label: "Dev Processos",         group: "Dev" },
  { path: "/dev-ferramentas",    label: "Dev Ferramentas",       group: "Dev" },
  // CONSULTOR / ADMIN
  { path: "/dashboard",          label: "Dashboard",             group: "Consultor" },
  { path: "/patio",              label: "Pátio Kanban",          group: "Consultor" },
  { path: "/agendamentos",       label: "Agendamentos",          group: "Consultor" },
  { path: "/clientes",           label: "Clientes",              group: "Consultor" },
  { path: "/ordens-servico",     label: "Ordens de Serviço",     group: "Consultor" },
  { path: "/ordens-servico/nova",label: "Nova OS",               group: "Consultor" },
  { path: "/pendencias",         label: "Pendências",            group: "Consultor" },
  { path: "/operacional",        label: "Operacional",           group: "Consultor" },
  { path: "/agenda-mecanicos",   label: "Agenda Mecânicos",      group: "Consultor" },
  { path: "/usuarios",           label: "Usuários Admin",        group: "Consultor" },
  { path: "/ia-qg",              label: "IA QG",                 group: "Consultor" },
  { path: "/notificacoes",       label: "Notificações",          group: "Consultor" },
  { path: "/checklists",         label: "Checklists",            group: "Consultor" },
  { path: "/ajuda",              label: "Ajuda",                 group: "Consultor" },
  // GESTÃO
  { path: "/gestao/visao-geral", label: "Visão Geral",          group: "Gestão" },
  { path: "/gestao",             label: "Gestão Dashboards",    group: "Gestão" },
  { path: "/gestao/comercial",   label: "Comercial",            group: "Gestão" },
  { path: "/gestao/operacoes",   label: "Operações",            group: "Gestão" },
  { path: "/gestao/financeiro",  label: "Financeiro",           group: "Gestão" },
  { path: "/gestao/rh",          label: "RH",                   group: "Gestão" },
  { path: "/gestao/metas",       label: "Metas",                group: "Gestão" },
  { path: "/gestao/melhorias",   label: "Melhorias",            group: "Gestão" },
  { path: "/gestao/fornecedores",label: "Fornecedores",         group: "Gestão" },
  { path: "/gestao/tecnologia",  label: "Tecnologia",           group: "Gestão" },
  { path: "/gestao/veiculos-orfaos", label: "Veículos Órfãos", group: "Gestão" },
  { path: "/gestao/os-ultimate", label: "OS Ultimate",          group: "Gestão" },
  { path: "/visao-geral",        label: "Visão Geral Alt",      group: "Gestão" },
  // FINANCEIRO / ESTOQUE
  { path: "/financeiro",         label: "Financeiro",           group: "Financeiro" },
  { path: "/fluxo-caixa",        label: "Fluxo de Caixa",       group: "Financeiro" },
  { path: "/contas-pagar",       label: "Contas a Pagar",       group: "Financeiro" },
  { path: "/contas-receber",     label: "Contas a Receber",     group: "Financeiro" },
  { path: "/despesas",           label: "Despesas",             group: "Financeiro" },
  { path: "/nfe",                label: "NF-e",                 group: "Financeiro" },
  { path: "/estoque",            label: "Estoque",              group: "Financeiro" },
  { path: "/compras",            label: "Compras",              group: "Financeiro" },
  { path: "/vendas",             label: "Vendas",               group: "Financeiro" },
  { path: "/comissoes",          label: "Comissões",            group: "Financeiro" },
  { path: "/produtividade",      label: "Produtividade",        group: "Financeiro" },
  { path: "/relatorios",         label: "Relatórios",           group: "Financeiro" },
  // ANALYTICS
  { path: "/analytics/funil",    label: "Funil",                group: "Analytics" },
  { path: "/analytics/roi",      label: "ROI",                  group: "Analytics" },
  { path: "/analytics/ltv",      label: "LTV",                  group: "Analytics" },
  { path: "/analytics/churn",    label: "Churn",                group: "Analytics" },
  { path: "/analytics/nps",      label: "NPS",                  group: "Analytics" },
  // FEEDBACK
  { path: "/avaliacoes",         label: "Avaliações",           group: "Feedback" },
  { path: "/reclamacoes",        label: "Reclamações",          group: "Feedback" },
  { path: "/sugestoes",          label: "Sugestões",            group: "Feedback" },
  // CONFIGS
  { path: "/configuracoes",      label: "Configurações",        group: "Config" },
  { path: "/admin/integracoes",  label: "Integrações",          group: "Config" },
  { path: "/admin/trello-migracao", label: "Trello Migração",   group: "Config" },
];

const GROUP_COLORS: Record<string, string> = {
  Dev:        "bg-purple-900/50 text-purple-300 border-purple-700",
  Consultor:  "bg-blue-900/50 text-blue-300 border-blue-700",
  Gestão:     "bg-green-900/50 text-green-300 border-green-700",
  Financeiro: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  Analytics:  "bg-cyan-900/50 text-cyan-300 border-cyan-700",
  Feedback:   "bg-pink-900/50 text-pink-300 border-pink-700",
  Config:     "bg-zinc-800 text-zinc-300 border-zinc-600",
};

const GROUPS = ["Todos", "Dev", "Consultor", "Gestão", "Financeiro", "Analytics", "Feedback", "Config"];

export default function DevExplorer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = ALL_PAGES.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.label.toLowerCase().includes(q) || p.path.toLowerCase().includes(q);
    const matchGroup = group === "Todos" || p.group === group;
    return matchSearch && matchGroup;
  });

  return (
    <DevLayout>
      <div className="container mx-auto p-6 max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Grid className="h-8 w-8 text-purple-400" /> Dev Explorer
            </h1>
            <p className="text-zinc-400 mt-1">
              {ALL_PAGES.length} páginas no sistema — clique para navegar
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant={viewMode==="grid"?"default":"outline"} size="sm" onClick={()=>setViewMode("grid")} className={viewMode==="grid"?"bg-purple-700":"border-zinc-700 text-zinc-300"}>
              <Grid className="h-4 w-4"/>
            </Button>
            <Button variant={viewMode==="list"?"default":"outline"} size="sm" onClick={()=>setViewMode("list")} className={viewMode==="list"?"bg-purple-700":"border-zinc-700 text-zinc-300"}>
              <List className="h-4 w-4"/>
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"/>
            <Input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Buscar página ou rota..."
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"/>
          </div>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map(g => (
              <button key={g} onClick={()=>setGroup(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  group===g ? "bg-purple-700 text-white border-purple-600" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-purple-600"
                }`}>
                {g}
                {g!=="Todos" && <span className="ml-1 text-zinc-500">({ALL_PAGES.filter(p=>p.group===g).length})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <p className="text-zinc-500 text-xs">{filtered.length} páginas encontradas</p>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(p => (
              <button key={p.path} onClick={()=>navigate(p.path)}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left hover:border-purple-600 hover:bg-zinc-800/60 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`text-xs border ${GROUP_COLORS[p.group]||"bg-zinc-700 text-zinc-300"}`}>
                    {p.group}
                  </Badge>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-purple-400 transition-colors"/>
                </div>
                <p className="text-white font-medium text-sm leading-tight">{p.label}</p>
                <p className="text-zinc-500 text-xs mt-1 font-mono truncate">{p.path}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map(p => (
              <button key={p.path} onClick={()=>navigate(p.path)}
                className="group w-full flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 hover:border-purple-600 hover:bg-zinc-800/60 transition-all">
                <Badge className={`text-xs border w-24 justify-center shrink-0 ${GROUP_COLORS[p.group]||"bg-zinc-700 text-zinc-300"}`}>
                  {p.group}
                </Badge>
                <span className="text-white font-medium text-sm flex-1 text-left">{p.label}</span>
                <span className="text-zinc-500 text-xs font-mono">{p.path}</span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-purple-400 shrink-0"/>
              </button>
            ))}
          </div>
        )}
      </div>
    </DevLayout>
  );
}
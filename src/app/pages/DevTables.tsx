import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Database, Table, ChevronDown, ChevronUp, RefreshCw, Loader2, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import DevLayout from "../components/DevLayout";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const CORE = ["00_companies","01_colaboradores","02_dev_roles","03_CRM","04_CLIENTS","05_VEHICLES","06_OS","07_OS_ITENS","08_OS_HISTORICO","11_USER_CLIENTS","12_MECANICOS","13_PENDENCIAS"];
const LEGACY = ["98_CLIENTS_LEGADO_OFIINT"];
const PAGE_SIZE = 50;

interface TRow { table_name: string; row_count: number; }
interface Col { column_name: string; data_type: string; is_nullable: string; }

export default function DevTables() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<TRow[]>([]);
  const [columns, setColumns] = useState<Record<string, Col[]>>({});
  const [rows, setRows] = useState<Record<string, any[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => { loadTables(); }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin.rpc("list_tables");
      if (error) throw error;
      setTables(data as TRow[]);
    } catch (err: any) {
      console.error("list_tables error:", err.message);
    } finally { setLoading(false); }
  };

  const loadColumns = async (t: string) => {
    if (columns[t]) return;
    const { data } = await supabaseAdmin.rpc("list_columns", { p_table: t });
    if (data) setColumns(p => ({ ...p, [t]: data as Col[] }));
  };

  const loadRows = async (t: string, pg = 0) => {
    setLoadingRows(true);
    try {
      const { data } = await supabaseAdmin.from(t).select("*").range(pg * PAGE_SIZE, (pg + 1) * PAGE_SIZE - 1);
      setRows(p => ({ ...p, [t]: data || [] }));
      setPage(pg);
    } catch {}
    finally { setLoadingRows(false); }
  };

  const toggleExpand = (t: string) => {
    if (expanded === t) { setExpanded(null); return; }
    setExpanded(t); loadColumns(t);
  };

  const viewTable = (t: string) => {
    setViewing(t); setPage(0);
    loadRows(t, 0); loadColumns(t);
  };

  const filtered = tables.filter(t => !search || t.table_name.toLowerCase().includes(search.toLowerCase()));
  const core   = filtered.filter(t => CORE.includes(t.table_name));
  const legacy = filtered.filter(t => LEGACY.includes(t.table_name));
  const other  = filtered.filter(t => !CORE.includes(t.table_name) && !LEGACY.includes(t.table_name));

  const vCols = viewing ? (columns[viewing] || []) : [];
  const vRows = viewing ? (rows[viewing] || []) : [];
  const vCount = viewing ? (tables.find(t => t.table_name === viewing)?.row_count ?? "?") : 0;

  function Group({ title, items, color }: { title: string; items: TRow[]; color: string }) {
    if (!items.length) return null;
    return (
      <div className="mb-3">
        <p className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 ${color}`}>{title}</p>
        {items.map(t => (
          <div key={t.table_name}>
            <div className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-zinc-800 group ${viewing === t.table_name ? "bg-zinc-800 border-l-2 border-blue-500 pl-1.5" : ""}`}
              onClick={() => toggleExpand(t.table_name)}>
              <Table className="h-3 w-3 text-blue-400 shrink-0" />
              <span className="text-xs text-zinc-300 group-hover:text-white truncate flex-1">{t.table_name}</span>
              <span className="text-[10px] text-zinc-600 shrink-0">{t.row_count >= 0 ? t.row_count : ""}</span>
              <button onClick={e => { e.stopPropagation(); viewTable(t.table_name); }}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-blue-400 p-0.5" title="Ver dados">
                <Eye className="h-3 w-3" />
              </button>
              {expanded === t.table_name ? <ChevronUp className="h-3 w-3 text-zinc-600 shrink-0" /> : <ChevronDown className="h-3 w-3 text-zinc-600 shrink-0" />}
            </div>
            {expanded === t.table_name && (
              <div className="ml-4 border-l border-zinc-800 pl-2 pb-1">
                {(columns[t.table_name] || []).length === 0
                  ? <div className="py-1"><Loader2 className="h-3 w-3 text-zinc-600 animate-spin" /></div>
                  : (columns[t.table_name] || []).map(c => (
                    <div key={c.column_name} className="flex items-center gap-1.5 py-0.5">
                      <span className="text-[11px] text-zinc-400 truncate">{c.column_name}</span>
                      <span className="text-[10px] text-zinc-600">{c.data_type}</span>
                      {c.is_nullable === "NO" && <span className="text-[9px] text-red-400">*</span>}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DevLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        {collapsed ? (
          <div className="w-10 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center pt-4 gap-3">
            <button onClick={() => setCollapsed(false)} className="text-zinc-400 hover:text-white"><ChevronRight className="h-4 w-4" /></button>
            <Database className="h-4 w-4 text-zinc-600" />
          </div>
        ) : (
          <div className="w-64 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase flex items-center gap-1">
                <Database className="h-3 w-3" /> Tabelas ({tables.length})
              </span>
              <div className="flex gap-1">
                <button onClick={loadTables} className="text-zinc-500 hover:text-white p-1"><RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /></button>
                <button onClick={() => setCollapsed(true)} className="text-zinc-500 hover:text-white p-1"><ChevronLeft className="h-3 w-3" /></button>
              </div>
            </div>
            <div className="px-2 py-1.5 border-b border-zinc-800">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtrar..."
                  className="pl-7 h-7 text-xs bg-zinc-800 border-zinc-700 text-white" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-1 pt-2">
              {loading ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 text-blue-400 animate-spin" /></div>
              : <>
                  <Group title="Core" items={core} color="text-blue-400" />
                  <Group title="Legado" items={legacy} color="text-yellow-600" />
                  <Group title="Outras" items={other} color="text-zinc-500" />
                </>}
            </div>
          </div>
        )}

        {/* Área de dados */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-2.5 border-b border-zinc-800 bg-zinc-950">
            <Button variant="ghost" className="h-7 text-zinc-400 hover:text-white" onClick={() => navigate("/dev-dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <span className="text-white font-bold flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-400" /> Tabelas do Banco
            </span>
            {viewing && <>
              <Badge className="bg-blue-900/50 text-blue-300 border border-blue-800 ml-2">{viewing}</Badge>
              <span className="text-zinc-500 text-xs">{vCount} registros</span>
            </>}
          </div>

          {!viewing ? (
            <div className="flex-1 flex items-center justify-center text-zinc-600">
              <div className="text-center">
                <Database className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Clique no <Eye className="inline h-3.5 w-3.5" /> de uma tabela para ver os dados</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto">
                {loadingRows ? (
                  <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-blue-400 animate-spin" /></div>
                ) : vCols.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-zinc-500 text-sm">Carregando colunas...</div>
                ) : (
                  <table className="w-full text-xs border-collapse">
                    <thead className="sticky top-0 bg-zinc-900 border-b border-zinc-800 z-10">
                      <tr>{vCols.map(c => (
                        <th key={c.column_name} className="px-3 py-2 text-left text-zinc-400 font-medium whitespace-nowrap border-r border-zinc-800">
                          <div>{c.column_name}</div>
                          <div className="text-zinc-600 font-normal text-[10px]">{c.data_type}</div>
                        </th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {vRows.length === 0 ? (
                        <tr><td colSpan={vCols.length} className="px-3 py-10 text-center text-zinc-500">Tabela vazia</td></tr>
                      ) : vRows.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-800/40 hover:bg-zinc-800/30">
                          {vCols.map(c => (
                            <td key={c.column_name} className="px-3 py-1.5 text-zinc-300 border-r border-zinc-800/30 max-w-[200px] truncate">
                              {row[c.column_name] === null
                                ? <span className="text-zinc-600 italic">null</span>
                                : typeof row[c.column_name] === "object"
                                  ? <span className="text-blue-400">{JSON.stringify(row[c.column_name]).slice(0, 60)}</span>
                                  : String(row[c.column_name]).slice(0, 80)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 bg-zinc-950 shrink-0">
                <span className="text-xs text-zinc-500">Página {page + 1} · {vRows.length} linhas</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs border-zinc-700 text-zinc-300" disabled={page === 0} onClick={() => loadRows(viewing!, page - 1)}>← Anterior</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-zinc-700 text-zinc-300" disabled={vRows.length < PAGE_SIZE} onClick={() => loadRows(viewing!, page + 1)}>Próxima →</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DevLayout>
  );
}

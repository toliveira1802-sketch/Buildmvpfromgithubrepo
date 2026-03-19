import { useState, useRef } from "react";
import { Play, Trash2, Clock, CheckCircle2, XCircle, Copy, Download, ChevronDown, Database, Table, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import DevLayout from "../../components/DevLayout";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const CORE_TABLES = [
  "00_companies","01_colaboradores","02_dev_roles","03_CRM",
  "04_CLIENTS","05_VEHICLES","06_OS","07_OS_ITENS",
  "08_OS_HISTORICO","09_OS_WORKFLOW","10_users",
  "11_USER_CLIENTS","12_MECANICOS","98_CLIENTS_LEGADO_OFIINT"
];

const QUICK_QUERIES = [
  { label: "Listar tabelas", sql: `SELECT table_name, pg_size_pretty(pg_total_relation_size('"' || table_name || '"')) AS tamanho\nFROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;` },
  { label: "Contar registros", sql: `SELECT relname AS tabela, n_live_tup AS registros\nFROM pg_stat_user_tables ORDER BY n_live_tup DESC;` },
  { label: "OS abertas", sql: `SELECT numero_os, client_nome, veiculo_placa, status, prioridade, created_at\nFROM "06_OS" WHERE status NOT IN ('entregue','cancelado') ORDER BY created_at DESC LIMIT 50;` },
  { label: "Clientes", sql: `SELECT id, full_name, phone, email, cpf, created_at FROM "04_CLIENTS" ORDER BY created_at DESC LIMIT 50;` },
  { label: "Triggers ativos", sql: `SELECT trigger_name, event_object_table, event_manipulation\nFROM information_schema.triggers WHERE trigger_schema = 'public' ORDER BY event_object_table;` },
  { label: "Colunas de tabela", sql: `SELECT column_name, data_type, column_default, is_nullable\nFROM information_schema.columns WHERE table_schema = 'public' AND table_name = '06_OS' ORDER BY ordinal_position;` },
];

interface QueryResult {
  id: string; sql: string; status: "ok" | "error";
  data?: any[]; error?: string; rowCount?: number;
  duration?: number; timestamp: Date;
}

export default function DevSQL() {
  const [sql, setSql] = useState("-- Agente SQL — Doctor Auto Prime\n-- Ctrl+Enter para executar\n\nSELECT table_name FROM information_schema.tables\nWHERE table_schema = 'public' ORDER BY table_name;");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [running, setRunning] = useState(false);
  const [activeResult, setActiveResult] = useState<string | null>(null);
  const [tablesOpen, setTablesOpen] = useState(true);
  const [confirmDangerous, setConfirmDangerous] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDangerous = (q: string) => /\b(DROP|TRUNCATE|DELETE\s+FROM)\b/i.test(q);

  const runQuery = async (overrideSql?: string) => {
    const query = (overrideSql ?? sql).trim();
    if (!query) return;
    if (isDangerous(query) && !confirmDangerous) { setConfirmDangerous(true); return; }
    setConfirmDangerous(false);
    setRunning(true);
    const start = Date.now();
    const id = crypto.randomUUID();
    try {
      const { data, error } = await supabaseAdmin.rpc("exec_sql", { sql_query: query });
      if (error) throw error;
      const rows = Array.isArray(data) ? data : (data ? [data] : []);
      setResults(prev => [{ id, sql: query, status: "ok", data: rows, rowCount: rows.length, duration: Date.now() - start, timestamp: new Date() }, ...prev]);
      setActiveResult(id);
    } catch (err: any) {
      setResults(prev => [{ id, sql: query, status: "error", error: err.message ?? String(err), duration: Date.now() - start, timestamp: new Date() }, ...prev]);
      setActiveResult(id);
    } finally { setRunning(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runQuery(); }
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current!;
      const s = ta.selectionStart, en = ta.selectionEnd;
      setSql(sql.substring(0, s) + "  " + sql.substring(en));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
    }
  };

  const copyResult = (r: QueryResult) => {
    if (!r.data?.length) return;
    const h = Object.keys(r.data[0]).join("\t");
    const rows = r.data.map(row => Object.values(row).join("\t")).join("\n");
    navigator.clipboard.writeText(h + "\n" + rows);
  };

  const downloadCSV = (r: QueryResult) => {
    if (!r.data?.length) return;
    const h = Object.keys(r.data[0]).join(",");
    const rows = r.data.map(row => Object.values(row).map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([h + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "query.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const active = results.find(r => r.id === activeResult);

  return (
    <DevLayout>
      <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">

        {/* Sidebar tabelas */}
        <div className="w-52 flex-shrink-0 border-r border-zinc-800 flex flex-col overflow-hidden">
          <button onClick={() => setTablesOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider hover:text-white border-b border-zinc-800">
            <Database className="size-3.5" />
            <span>Tabelas Core</span>
            <ChevronDown className={`size-3 ml-auto transition-transform ${tablesOpen ? "" : "-rotate-90"}`} />
          </button>
          {tablesOpen && (
            <div className="overflow-y-auto flex-1">
              {CORE_TABLES.map(t => (
                <button key={t} onClick={() => setSql(`SELECT * FROM "${t}" LIMIT 50;`)}
                  className="w-full text-left px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                  <Table className="size-3 flex-shrink-0 text-zinc-600" />
                  <span className="truncate">{t}</span>
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-zinc-800">
            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Quick</div>
            <div className="overflow-y-auto max-h-52">
              {QUICK_QUERIES.map((q, i) => (
                <button key={i} onClick={() => setSql(q.sql)}
                  className="w-full text-left px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Área principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
            <Database className="size-4 text-red-500" />
            <span className="text-sm font-semibold text-white">Agente SQL</span>
            <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">acuufrgoyjwzlyhopaus · service_role</Badge>
            <span className="ml-auto text-xs text-zinc-500">Ctrl+Enter para executar</span>
          </div>

          {/* Editor */}
          <div className="relative border-b border-zinc-800" style={{ minHeight: 180, maxHeight: 280 }}>
            <textarea ref={textareaRef} value={sql} onChange={e => setSql(e.target.value)} onKeyDown={handleKeyDown}
              spellCheck={false} style={{ minHeight: 180, maxHeight: 280, height: 220 }}
              className="w-full h-full resize-none bg-zinc-950 text-sm font-mono text-zinc-100 p-4 outline-none"
              placeholder="-- Escreva sua query aqui..." />
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-2 bg-zinc-900/90 border-t border-zinc-800 backdrop-blur-sm">
              <Button onClick={() => runQuery()} disabled={running} size="sm"
                className="bg-red-600 hover:bg-red-700 text-white gap-2 h-7 px-3 text-xs">
                {running ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
                Executar
              </Button>
              <Button onClick={() => setSql("")} variant="ghost" size="sm" className="h-7 px-2 text-xs text-zinc-500 hover:text-white">
                <Trash2 className="size-3" />
              </Button>
              {confirmDangerous && (
                <div className="flex items-center gap-2 ml-2 bg-red-950 border border-red-700 rounded px-3 py-1">
                  <AlertTriangle className="size-3 text-red-400" />
                  <span className="text-xs text-red-300">Operação destrutiva! Confirmar?</span>
                  <button onClick={() => runQuery(sql)} className="text-xs text-red-400 hover:text-red-200 font-semibold ml-1">Sim</button>
                  <button onClick={() => setConfirmDangerous(false)} className="text-xs text-zinc-400 hover:text-white ml-1">Não</button>
                </div>
              )}
              <div className="ml-auto flex items-center gap-2">
                {results.length > 0 && <span className="text-xs text-zinc-500">{results.length} execuções</span>}
                {results.length > 0 && (
                  <Button onClick={() => { setResults([]); setActiveResult(null); }} variant="ghost" size="sm"
                    className="h-7 px-2 text-xs text-zinc-500 hover:text-red-400">Limpar</Button>
                )}
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="flex flex-1 overflow-hidden">
            {results.length > 0 && (
              <div className="w-48 flex-shrink-0 border-r border-zinc-800 overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-800">Histórico</div>
                {results.map(r => (
                  <button key={r.id} onClick={() => setActiveResult(r.id)}
                    className={`w-full text-left px-3 py-2 border-b border-zinc-800/50 transition-colors ${activeResult === r.id ? "bg-zinc-800" : "hover:bg-zinc-900"}`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {r.status === "ok" ? <CheckCircle2 className="size-3 text-green-500 flex-shrink-0" /> : <XCircle className="size-3 text-red-500 flex-shrink-0" />}
                      <span className="text-xs text-zinc-300 truncate">{r.sql.replace(/\s+/g, " ").substring(0, 28)}...</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <Clock className="size-2.5" />{r.duration}ms {r.rowCount !== undefined && `· ${r.rowCount} linhas`}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-auto">
              {!active && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-3">
                  <Database className="size-10" />
                  <p className="text-sm">Execute uma query para ver os resultados</p>
                  <p className="text-xs">Ctrl+Enter · service_role ativo</p>
                </div>
              )}
              {active?.status === "error" && (
                <div className="p-4">
                  <div className="flex items-start gap-3 bg-red-950/40 border border-red-800 rounded-lg p-4">
                    <XCircle className="size-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300 mb-1">Erro na query</p>
                      <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap">{active.error}</pre>
                      <p className="text-xs text-zinc-500 mt-2">{active.duration}ms · {active.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded p-3">
                    <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">{active.sql}</pre>
                  </div>
                </div>
              )}
              {active?.status === "ok" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
                    <CheckCircle2 className="size-4 text-green-500" />
                    <span className="text-xs text-green-400 font-medium">
                      {active.rowCount === 0 ? "Query executada" : `${active.rowCount} linha${active.rowCount !== 1 ? "s" : ""}`}
                    </span>
                    <span className="text-xs text-zinc-500">· {active.duration}ms · {active.timestamp.toLocaleTimeString()}</span>
                    <div className="ml-auto flex gap-2">
                      {active.data && active.data.length > 0 && (<>
                        <Button onClick={() => copyResult(active)} variant="ghost" size="sm" className="h-6 px-2 text-xs text-zinc-500 hover:text-white gap-1">
                          <Copy className="size-3" /> Copiar
                        </Button>
                        <Button onClick={() => downloadCSV(active)} variant="ghost" size="sm" className="h-6 px-2 text-xs text-zinc-500 hover:text-white gap-1">
                          <Download className="size-3" /> CSV
                        </Button>
                      </>)}
                    </div>
                  </div>
                  {active.data && active.data.length > 0 ? (
                    <div className="overflow-auto flex-1">
                      <table className="w-full text-xs font-mono border-collapse">
                        <thead className="sticky top-0 bg-zinc-900 z-10">
                          <tr>
                            <th className="px-2 py-2 text-left text-zinc-500 border-b border-r border-zinc-800 w-10">#</th>
                            {Object.keys(active.data[0]).map(col => (
                              <th key={col} className="px-3 py-2 text-left text-zinc-400 border-b border-r border-zinc-800 whitespace-nowrap font-medium">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {active.data.map((row, i) => (
                            <tr key={i} className="hover:bg-zinc-900/50 border-b border-zinc-800/50">
                              <td className="px-2 py-1.5 text-zinc-600 border-r border-zinc-800/50 text-center">{i + 1}</td>
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="px-3 py-1.5 text-zinc-300 border-r border-zinc-800/50 max-w-xs">
                                  {val === null ? <span className="text-zinc-600 italic">null</span>
                                    : typeof val === "object" ? <span className="text-yellow-400">{JSON.stringify(val).substring(0, 80)}</span>
                                    : <span className="truncate block">{String(val).substring(0, 120)}</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center flex-1 text-zinc-500">
                      <div className="text-center">
                        <CheckCircle2 className="size-8 mx-auto mb-2 text-green-600" />
                        <p className="text-sm">Comando executado com sucesso</p>
                        <p className="text-xs text-zinc-600">Nenhum dado retornado (DDL/DML)</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DevLayout>
  );
}

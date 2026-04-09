import { useState, useEffect } from "react";
import { Wrench, RefreshCw, Loader2, Car } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/ui/card';
import { useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";

export default function AdminAgendaMecanicos() {
  const navigate = useNavigate();
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [osMap, setOsMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [mecs, os] = await Promise.all([
      sb.from("mecanicos").select("id,nome,especialidade,nivel").order("nome"),
      sb.from("ordens_servico")
        .select("id,numero_os,status,cliente_nome,veiculo_modelo,mecanico_nome,valor_total")
        .in("status", ["aprovado","em_execucao"])
        .order("created_at", { ascending: true }),
    ]);
    setMecanicos(mecs.data || []);
    const map: Record<string, any[]> = {};
    (os.data || []).forEach(o => {
      const nome = o.mecanico_nome || "Sem mecânico";
      if (!map[nome]) map[nome] = [];
      map[nome].push(o);
    });
    setOsMap(map);
    setLoading(false);
  }

  const fmt = (v: number) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Wrench className="h-8 w-8 text-orange-400" />Agenda Mecânicos
            </h1>
            <p className="text-zinc-400 mt-1">OS aprovadas e em execução por mecânico</p>
          </div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300">
            <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} />
          </Button>
        </div>

        {loading ? <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-orange-400" /></div>
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mecanicos.map(m => {
              const os = osMap[m.nome] || [];
              return (
                <Card key={m.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center">
                          <Wrench className="h-4 w-4 text-orange-400" />
                        </div>
                        {m.nome}
                      </span>
                      <Badge className="bg-orange-900/40 text-orange-300 border border-orange-800 text-xs">{os.length} OS</Badge>
                    </CardTitle>
                    <p className="text-zinc-400 text-xs">{m.especialidade || "Geral"} · {m.nivel}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {os.length === 0 ? <p className="text-zinc-600 text-sm">Livre no momento</p>
                    : os.map(o => (
                      <div key={o.id} onClick={() => navigate("/ordens-servico/"+o.id)}
                        className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-orange-600 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-xs font-medium">{o.cliente_nome || "—"}</p>
                          <Badge className={o.status === "em_execucao"
                            ? "bg-purple-900/50 text-purple-300 text-xs"
                            : "bg-blue-900/50 text-blue-300 text-xs"}>
                            {o.status?.replace(/_/g," ")}
                          </Badge>
                        </div>
                        <p className="text-zinc-400 text-xs">{o.veiculo_modelo}</p>
                        <p className="text-green-400 text-xs">{fmt(o.valor_total)}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
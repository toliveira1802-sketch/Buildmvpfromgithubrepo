import { useState, useEffect } from "react";
import { Wrench, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../../lib/supabase";
import { startOfMonth, endOfMonth } from "date-fns";
import { EmpresaToggle } from "../../components/EmpresaToggle";

const STATUS_COLORS: Record<string, string> = {
  pendente: "#f59e0b", em_execucao: "#3b82f6", concluido: "#22c55e", cancelado: "#ef4444",
};

export default function GestaoOperacoes() {
  const [kpis, setKpis] = useState({ total: 0, pendentes: 0, emExecucao: 0, concluidos: 0, cancelados: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = startOfMonth(new Date()).toISOString();
    const end = endOfMonth(new Date()).toISOString();
    supabase.from("06_OS").select("status").gte("created_at", start).lte("created_at", end)
      .then(({ data }) => {
        const rows = data || [];
        setKpis({
          total: rows.length,
          pendentes: rows.filter(r => ["diagnostico","orcamento","aguardando_aprovacao"].includes(r.status)).length,
          emExecucao: rows.filter(r => r.status === "aprovado" || r.status === "em_execucao").length,
          concluidos: rows.filter(r => r.status === "concluido" || r.status === "entregue").length,
          cancelados: rows.filter(r => r.status === "cancelado").length,
        });
        setLoading(false);
      });
  }, []);

  const pieData = [
    { name: "Pendentes", value: kpis.pendentes, color: "#f59e0b" },
    { name: "Em Execução", value: kpis.emExecucao, color: "#3b82f6" },
    { name: "Concluídos", value: kpis.concluidos, color: "#22c55e" },
    { name: "Cancelados", value: kpis.cancelados, color: "#ef4444" },
  ].filter(d => d.value > 0);

  const alertas = [];
  if (kpis.pendentes > 5) alertas.push(`${kpis.pendentes} OS pendentes — atenção!`);
  if (kpis.emExecucao > 10) alertas.push(`${kpis.emExecucao} OS em execução simultânea`);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2"><Wrench className="h-8 w-8 text-orange-400" /> Operações</h1>
            <p className="text-zinc-400 mt-1">Ordens de serviço do mês atual</p>
          </div>
          <EmpresaToggle />
        </div>

        {alertas.length > 0 && (
          <div className="space-y-2">
            {alertas.map((a, i) => (
              <div key={i} className="flex items-center gap-2 bg-yellow-950 border border-yellow-700 rounded-lg px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
                <p className="text-yellow-300 text-sm">{a}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total", value: kpis.total, icon: Wrench, color: "text-white", bg: "bg-zinc-900 border-zinc-800" },
            { label: "Pendentes", value: kpis.pendentes, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-950 border-yellow-800" },
            { label: "Em Execução", value: kpis.emExecucao, icon: Wrench, color: "text-blue-400", bg: "bg-blue-950 border-blue-800" },
            { label: "Concluídos", value: kpis.concluidos, icon: CheckCircle, color: "text-green-400", bg: "bg-green-950 border-green-800" },
            { label: "Cancelados", value: kpis.cancelados, icon: XCircle, color: "text-red-400", bg: "bg-red-950 border-red-800" },
          ].map(k => {
            const Icon = k.icon;
            return (
              <Card key={k.label} className={`${k.bg}`}>
                <CardHeader className="pb-2">
                  <CardDescription className={`${k.color} flex items-center gap-1 text-xs`}><Icon className="h-3 w-3" />{k.label}</CardDescription>
                  <CardTitle className={`text-3xl ${k.color}`}>{loading ? "—" : k.value}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {pieData.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white">Distribuição por Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

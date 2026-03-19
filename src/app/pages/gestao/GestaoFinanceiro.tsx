import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Car, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../../lib/supabase";
import { startOfMonth, endOfMonth } from "date-fns";

export default function GestaoFinanceiro() {
  const [data, setData] = useState({ faturamento: 0, ticket: 0, servicos: 0, presosPatrio: 0, atrasados: 0 });
  const [loading, setLoading] = useState(true);
  const META_MENSAL = 70000;

  useEffect(() => {
    const start = startOfMonth(new Date()).toISOString();
    const end = endOfMonth(new Date()).toISOString();

    Promise.all([
      supabase.from("06_OS").select("valor_total, status").gte("created_at", start).lte("created_at", end),
      supabase.from("06_OS").select("id", { count: "exact", head: true }).in("status", ["aprovado","em_execucao"]),
      supabase.from("06_OS").select("id", { count: "exact", head: true }).eq("status", "aguardando_aprovacao"),
    ]).then(([os, patio, atrasados]) => {
      const rows = os.data || [];
      const concluidas = rows.filter(r => r.status === "concluido" || r.status === "entregue");
      const fat = concluidas.reduce((s, r) => s + (r.valor_total || 0), 0);
      setData({
        faturamento: fat,
        ticket: concluidas.length > 0 ? fat / concluidas.length : 0,
        servicos: concluidas.length,
        presosPatrio: patio.count || 0,
        atrasados: atrasados.count || 0,
      });
      setLoading(false);
    });
  }, []);

  const progMeta = Math.min((data.faturamento / META_MENSAL) * 100, 100);
  const diasMes = new Date().getDate();
  const diasTotal = endOfMonth(new Date()).getDate();
  const projecao = diasMes > 0 ? (data.faturamento / diasMes) * diasTotal : 0;

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2"><DollarSign className="h-8 w-8 text-green-400" /> Financeiro</h1>
          <p className="text-zinc-400 mt-1">Faturamento e métricas do mês atual</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Faturamento", value: fmt(data.faturamento), icon: DollarSign, bg: "bg-green-950 border-green-800", color: "text-green-300" },
            { label: "Ticket Médio", value: fmt(data.ticket), icon: TrendingUp, bg: "bg-blue-950 border-blue-800", color: "text-blue-300" },
            { label: "Serviços", value: data.servicos.toString(), icon: DollarSign, bg: "bg-zinc-900 border-zinc-800", color: "text-zinc-400" },
            { label: "Projeção Mês", value: fmt(projecao), icon: TrendingUp, bg: "bg-purple-950 border-purple-800", color: "text-purple-300" },
          ].map(k => {
            const Icon = k.icon;
            return (
              <Card key={k.label} className={k.bg}>
                <CardHeader className="pb-2">
                  <CardDescription className={`${k.color} flex items-center gap-1 text-xs`}><Icon className="h-3 w-3" />{k.label}</CardDescription>
                  <CardTitle className="text-xl text-white">{loading ? "—" : k.value}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Meta Mensal — {fmt(META_MENSAL)}</CardTitle>
            <CardDescription className="text-zinc-400">{fmt(data.faturamento)} realizado ({Math.round(progMeta)}%)</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progMeta} className="h-4" />
            <p className="text-zinc-400 text-sm mt-2">Faltam {fmt(Math.max(META_MENSAL - data.faturamento, 0))} para a meta</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-orange-950 border-orange-800 cursor-pointer hover:border-orange-600 transition-colors">
            <CardHeader>
              <CardDescription className="text-orange-300 flex items-center gap-1"><Car className="h-4 w-4" /> Presos no Pátio</CardDescription>
              <CardTitle className="text-4xl text-white">{loading ? "—" : data.presosPatrio}</CardTitle>
              <p className="text-orange-300 text-xs">veículos aguardando</p>
            </CardHeader>
          </Card>
          <Card className="bg-red-950 border-red-800 cursor-pointer hover:border-red-600 transition-colors">
            <CardHeader>
              <CardDescription className="text-red-300 flex items-center gap-1"><Clock className="h-4 w-4" /> Atrasados</CardDescription>
              <CardTitle className="text-4xl text-white">{loading ? "—" : data.atrasados}</CardTitle>
              <p className="text-red-300 text-xs">OS em atraso</p>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

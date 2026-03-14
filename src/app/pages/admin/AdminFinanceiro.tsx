import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard, Receipt, PieChart, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminLayout from "../../components/AdminLayout";

export default function AdminFinanceiro() {
  const [periodo, setPeriodo] = useState("30");

  const faturamentoMensal = [
    { mes: "Set", valor: 45000, meta: 50000 },
    { mes: "Out", valor: 52000, meta: 50000 },
    { mes: "Nov", valor: 48000, meta: 50000 },
    { mes: "Dez", valor: 61000, meta: 50000 },
    { mes: "Jan", valor: 58000, meta: 55000 },
    { mes: "Fev", valor: 63000, meta: 55000 },
  ];

  const faturamentoPorCategoria = [
    { categoria: "Mecânica Geral", valor: 28000, percentual: 44 },
    { categoria: "Elétrica", valor: 15000, percentual: 24 },
    { categoria: "Suspensão", valor: 12000, percentual: 19 },
    { categoria: "Revisão", valor: 8000, percentual: 13 },
  ];

  const receitasDespesas = [
    { mes: "Set", receita: 45000, despesa: 32000 },
    { mes: "Out", receita: 52000, despesa: 35000 },
    { mes: "Nov", receita: 48000, despesa: 33000 },
    { mes: "Dez", receita: 61000, despesa: 38000 },
    { mes: "Jan", receita: 58000, despesa: 36000 },
    { mes: "Fev", receita: 63000, despesa: 39000 },
  ];

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

  const stats = {
    faturamentoMes: 63000,
    variacao: 8.6,
    ticketMedio: 1575,
    variacaoTicket: -3.2,
    osRecebidas: 40,
    osRecebimento: 85,
    lucroLiquido: 24000,
    margemLucro: 38.1,
  };

  const topClientes = [
    { nome: "João Silva", valor: 8500, os: 6 },
    { nome: "Maria Santos", valor: 6200, os: 4 },
    { nome: "Pedro Costa", valor: 5800, os: 5 },
    { nome: "Ana Oliveira", valor: 4900, os: 3 },
    { nome: "Carlos Souza", valor: 4300, os: 4 },
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              Dashboard Financeiro
            </h1>
            <p className="text-zinc-400 mt-1">
              Análise completa de faturamento e resultados
            </p>
          </div>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-950 to-green-900 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Faturamento do Mês
              </CardDescription>
              <CardTitle className="text-3xl text-white">{formatCurrency(stats.faturamentoMes)}</CardTitle>
              <div className="flex items-center gap-1 text-sm">
                {stats.variacao > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={stats.variacao > 0 ? "text-green-400" : "text-red-400"}>
                  {stats.variacao > 0 ? "+" : ""}{stats.variacao}%
                </span>
                <span className="text-green-300">vs mês anterior</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400 flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Ticket Médio
              </CardDescription>
              <CardTitle className="text-3xl text-white">{formatCurrency(stats.ticketMedio)}</CardTitle>
              <div className="flex items-center gap-1 text-sm">
                {stats.variacaoTicket > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={stats.variacaoTicket > 0 ? "text-green-400" : "text-red-400"}>
                  {stats.variacaoTicket > 0 ? "+" : ""}{stats.variacaoTicket}%
                </span>
                <span className="text-zinc-400">vs mês anterior</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                OS Recebidas
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.osRecebidas}</CardTitle>
              <div className="text-sm text-zinc-400">
                {stats.osRecebimento}% já com recebimento confirmado
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-blue-950 to-blue-900 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Lucro Líquido
              </CardDescription>
              <CardTitle className="text-3xl text-white">{formatCurrency(stats.lucroLiquido)}</CardTitle>
              <div className="text-sm text-blue-300">
                Margem: {stats.margemLucro}%
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Gráfico de Faturamento Mensal */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Faturamento Mensal vs Meta
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faturamentoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="mes" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" tickFormatter={(value) => `R$ ${value / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar key="bar-faturamento" dataKey="valor" fill="#22c55e" name="Faturamento" radius={[8, 8, 0, 0]} />
                <Bar key="bar-meta-fin" dataKey="meta" fill="#ef4444" name="Meta" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receita vs Despesa */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Receita vs Despesa
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Comparativo dos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={receitasDespesas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="mes" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" tickFormatter={(value) => `R$ ${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    labelStyle={{ color: "#ffffff" }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="receita" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Receita" />
                  <Area type="monotone" dataKey="despesa" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Despesa" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Faturamento por Categoria */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Faturamento por Categoria
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Distribuição dos serviços
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faturamentoPorCategoria.map((cat, index) => (
                  <div key={cat.categoria}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-white font-medium">{cat.categoria}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{formatCurrency(cat.valor)}</div>
                        <div className="text-zinc-400 text-sm">{cat.percentual}%</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${cat.percentual}%`, backgroundColor: COLORS[index] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Clientes */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top 5 Clientes do Mês
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Clientes com maior faturamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topClientes.map((cliente, index) => (
                <div key={cliente.nome} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? "bg-yellow-600" :
                      index === 1 ? "bg-zinc-400" :
                      index === 2 ? "bg-orange-600" :
                      "bg-zinc-700"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{cliente.nome}</h4>
                      <p className="text-sm text-zinc-400">{cliente.os} OS realizadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-500">{formatCurrency(cliente.valor)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
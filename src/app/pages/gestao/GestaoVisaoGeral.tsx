import { useState } from "react";
import { LayoutDashboard, TrendingUp, Users, Wrench, DollarSign, Calendar, Target, Award, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminLayout from "../../components/AdminLayout";

export default function GestaoVisaoGeral() {
  const [visao, setVisao] = useState<"diaria" | "semanal" | "mensal">("mensal");

  // Dados consolidados por visão
  const dadosConsolidados = {
    diaria: {
      receita: 2100,
      os: 3,
      clientes: 3,
      horas: 18,
    },
    semanal: {
      receita: 12500,
      os: 18,
      clientes: 15,
      horas: 126,
    },
    mensal: {
      receita: 63000,
      os: 82,
      clientes: 58,
      horas: 492,
    },
  };

  const visaoAtual = dadosConsolidados[visao];

  // Metas vs Realizado
  const metas = [
    { indicador: "Faturamento", meta: 70000, realizado: 63000, unidade: "R$" },
    { indicador: "OS Concluídas", meta: 90, realizado: 82, unidade: "" },
    { indicador: "Novos Clientes", meta: 15, realizado: 12, unidade: "" },
    { indicador: "Ticket Médio", meta: 1600, realizado: 1575, unidade: "R$" },
    { indicador: "Satisfação", meta: 90, realizado: 94, unidade: "%" },
  ];

  // Evolução Mensal (últimos 6 meses)
  const evolucaoMensal = [
    { mes: "Set", receita: 45000, os: 68, clientes: 42, satisfacao: 88 },
    { mes: "Out", receita: 52000, os: 75, clientes: 48, satisfacao: 90 },
    { mes: "Nov", receita: 48000, os: 71, clientes: 45, satisfacao: 89 },
    { mes: "Dez", receita: 61000, os: 88, clientes: 55, satisfacao: 92 },
    { mes: "Jan", receita: 58000, os: 80, clientes: 52, satisfacao: 91 },
    { mes: "Fev", receita: 63000, os: 82, clientes: 58, satisfacao: 94 },
  ];

  // Distribuição por Área
  const distribuicaoPorArea = [
    { area: "Oficina", receita: 28000, percentual: 44 },
    { area: "Peças", receita: 20000, percentual: 32 },
    { area: "Diagnóstico", receita: 10000, percentual: 16 },
    { area: "Outros", receita: 5000, percentual: 8 },
  ];

  // Indicadores de Saúde
  const indicadoresSaude = [
    { nome: "Capacidade Operacional", valor: 85, status: "bom", meta: 80 },
    { nome: "Satisfação do Cliente", valor: 94, status: "excelente", meta: 90 },
    { nome: "Margem de Lucro", valor: 38, status: "bom", meta: 35 },
    { nome: "Tempo Médio de Entrega", valor: 92, status: "excelente", meta: 85 },
    { nome: "Retrabalho", valor: 95, status: "excelente", meta: 90 },
  ];

  // Equipe
  const statusEquipe = {
    mecanicos: { total: 8, disponiveis: 3, ocupados: 5 },
    consultores: { total: 3, disponiveis: 1, ocupados: 2 },
    gestao: { total: 2, disponiveis: 2, ocupados: 0 },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excelente": return "bg-green-600";
      case "bom": return "bg-blue-600";
      case "atencao": return "bg-yellow-600";
      case "critico": return "bg-red-600";
      default: return "bg-zinc-600";
    }
  };

  const getMetaStatus = (realizado: number, meta: number) => {
    const percentual = (realizado / meta) * 100;
    if (percentual >= 100) return { color: "text-green-500", status: "✓ Meta atingida" };
    if (percentual >= 80) return { color: "text-yellow-500", status: "⚠ Próximo da meta" };
    return { color: "text-red-500", status: "✗ Abaixo da meta" };
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatNumber = (value: number, unidade: string) => {
    if (unidade === "R$") return formatCurrency(value);
    if (unidade === "%") return `${value}%`;
    return value.toString();
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-blue-500" />
              Visão Geral Consolidada
            </h1>
            <p className="text-zinc-400 mt-1">
              Todos os indicadores estratégicos em um só lugar
            </p>
          </div>
          <Select value={visao} onValueChange={(v) => setVisao(v as any)}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diaria">Visão Diária</SelectItem>
              <SelectItem value="semanal">Visão Semanal</SelectItem>
              <SelectItem value="mensal">Visão Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs Dinâmicos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-950 to-green-900 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Receita
              </CardDescription>
              <CardTitle className="text-3xl text-white">{formatCurrency(visaoAtual.receita)}</CardTitle>
              <div className="text-sm text-green-300 capitalize">Período: {visao}</div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-blue-950 to-blue-900 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                OS Realizadas
              </CardDescription>
              <CardTitle className="text-3xl text-white">{visaoAtual.os}</CardTitle>
              <div className="text-sm text-blue-300">Ticket: {formatCurrency(visaoAtual.receita / visaoAtual.os)}</div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950 to-purple-900 border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes Atendidos
              </CardDescription>
              <CardTitle className="text-3xl text-white">{visaoAtual.clientes}</CardTitle>
              <div className="text-sm text-purple-300">{Math.round((visaoAtual.os / visaoAtual.clientes) * 10) / 10} OS/cliente</div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Horas Trabalhadas
              </CardDescription>
              <CardTitle className="text-3xl text-white">{visaoAtual.horas}h</CardTitle>
              <div className="text-sm text-zinc-400">{Math.round(visaoAtual.horas / visaoAtual.os)}h por OS</div>
            </CardHeader>
          </Card>
        </div>

        {/* Metas vs Realizado */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metas vs Realizado (Mensal)
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Acompanhamento dos principais indicadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metas.map((meta) => {
                const percentual = (meta.realizado / meta.meta) * 100;
                const statusMeta = getMetaStatus(meta.realizado, meta.meta);
                return (
                  <div key={meta.indicador}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-white font-semibold">{meta.indicador}</span>
                        <span className={`ml-3 text-sm ${statusMeta.color}`}>{statusMeta.status}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold">
                          {formatNumber(meta.realizado, meta.unidade)}
                        </span>
                        <span className="text-zinc-400 ml-2">
                          / {formatNumber(meta.meta, meta.unidade)}
                        </span>
                      </div>
                    </div>
                    <Progress value={percentual > 100 ? 100 : percentual} className="h-3" />
                    <div className="text-right text-sm text-zinc-400 mt-1">
                      {Math.round(percentual)}% da meta
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Evolução */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução dos Últimos 6 Meses
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Receita, OS e Satisfação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="mes" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff" }}
                  formatter={(value: number, name: string) => {
                    if (name === "receita") return formatCurrency(value);
                    if (name === "satisfacao") return `${value}%`;
                    return value;
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="receita" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Receita" />
                <Area type="monotone" dataKey="os" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="OS" />
                <Area type="monotone" dataKey="satisfacao" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Satisfação %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Indicadores de Saúde */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Indicadores de Saúde
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Score de performance da oficina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indicadoresSaude.map((ind) => (
                  <div key={ind.nome}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">{ind.nome}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(ind.status)}>
                          {ind.status}
                        </Badge>
                        <span className="text-white font-bold">{ind.valor}%</span>
                      </div>
                    </div>
                    <Progress value={ind.valor} className="h-2" />
                    <div className="text-right text-xs text-zinc-400 mt-1">
                      Meta: {ind.meta}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status da Equipe */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Status da Equipe
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Disponibilidade em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(statusEquipe).map(([tipo, dados]) => (
                  <div key={tipo}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white capitalize">{tipo}</h4>
                      <span className="text-zinc-400">{dados.total} total</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-950 border border-green-800 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-500">{dados.disponiveis}</div>
                        <div className="text-sm text-green-300">Disponíveis</div>
                      </div>
                      <div className="p-3 bg-orange-950 border border-orange-800 rounded-lg text-center">
                        <div className="text-3xl font-bold text-orange-500">{dados.ocupados}</div>
                        <div className="text-sm text-orange-300">Ocupados</div>
                      </div>
                    </div>
                    <Progress 
                      value={(dados.ocupados / dados.total) * 100} 
                      className="h-2 mt-2"
                    />
                    <div className="text-center text-xs text-zinc-400 mt-1">
                      {Math.round((dados.ocupados / dados.total) * 100)}% ocupação
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição por Área */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Distribuição de Receita por Área
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Participação de cada área no faturamento mensal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distribuicaoPorArea}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="area" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff" }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="receita" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {distribuicaoPorArea.map((area, index) => (
                <div key={area.area} className="text-center">
                  <div className="text-2xl font-bold text-white">{area.percentual}%</div>
                  <div className="text-sm text-zinc-400">{area.area}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

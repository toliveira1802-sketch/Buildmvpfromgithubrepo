import { useState } from "react";
import { Eye, Users, Wrench, DollarSign, TrendingUp, Award, Clock, Target, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminLayout from "../components/AdminLayout";

export default function VisaoGeral() {
  const [perfil] = useState("gestao"); // Pode ser: gestao, consultor, mecanico, dev

  // Dados gerais consolidados
  const dadosGerais = {
    oficina: {
      osAtivas: 25,
      osConcluidas: 82,
      mecanicosDisponiveis: 3,
      mecanicosTotal: 8,
      faturamentoMes: 63000,
      metaMes: 70000,
      satisfacao: 94,
    },
    tempo: {
      tempoMedioCiclo: 6.8,
      osNoPrazo: 72,
      osAtrasadas: 8,
    },
    equipe: {
      consultores: 3,
      mecanicos: 8,
      gestores: 2,
    },
    clientes: {
      ativos: 58,
      novos: 12,
      recorrentes: 46,
    },
  };

  // Evolução Semanal
  const evolucaoSemanal = [
    { dia: "Seg", os: 12, faturamento: 8500, satisfacao: 92 },
    { dia: "Ter", os: 15, faturamento: 10200, satisfacao: 93 },
    { dia: "Qua", os: 10, faturamento: 7800, satisfacao: 91 },
    { dia: "Qui", os: 18, faturamento: 12400, satisfacao: 95 },
    { dia: "Sex", os: 14, faturamento: 9600, satisfacao: 94 },
    { dia: "Sáb", os: 8, faturamento: 6200, satisfacao: 96 },
  ];

  // Performance por Mecânico (Top 5)
  const topMecanicos = [
    { nome: "Roberto Santos", os: 52, eficiencia: 97, avaliacao: 4.9 },
    { nome: "Carlos Silva", os: 47, eficiencia: 94, avaliacao: 4.8 },
    { nome: "André Costa", os: 45, eficiencia: 96, avaliacao: 4.7 },
    { nome: "Fernando Lima", os: 38, eficiencia: 88, avaliacao: 4.5 },
    { nome: "Paulo Mendes", os: 35, eficiencia: 90, avaliacao: 4.6 },
  ];

  // Distribuição de OS por Status
  const distribuicaoOS = [
    { status: "Orçamento", quantidade: 15, cor: "#3b82f6" },
    { status: "Aprovado", quantidade: 12, cor: "#22c55e" },
    { status: "Em Andamento", quantidade: 25, cor: "#f59e0b" },
    { status: "Concluído", quantidade: 20, cor: "#8b5cf6" },
    { status: "Aguardando", quantidade: 8, cor: "#ef4444" },
  ];

  // Indicadores de Saúde
  const indicadoresSaude = [
    { nome: "Capacidade Operacional", valor: 85, status: "bom" },
    { nome: "Satisfação do Cliente", valor: 94, status: "excelente" },
    { nome: "Cumprimento de Prazos", valor: 72, status: "atencao" },
    { nome: "Margem de Lucro", valor: 38, status: "bom" },
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

  const percentualMeta = Math.round((dadosGerais.oficina.faturamentoMes / dadosGerais.oficina.metaMes) * 100);
  const percentualCapacidade = Math.round(((dadosGerais.oficina.mecanicosTotal - dadosGerais.oficina.mecanicosDisponiveis) / dadosGerais.oficina.mecanicosTotal) * 100);

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Eye className="h-8 w-8 text-cyan-500" />
              Visão Geral - Radar Completo
            </h1>
            <p className="text-zinc-400 mt-1">
              Todos os indicadores em tempo real - Acessível para todos os perfis
            </p>
          </div>
          <Badge className="bg-cyan-600 text-lg px-4 py-2">
            Atualizado em tempo real
          </Badge>
        </div>

        {/* KPIs Principais em Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-orange-950 to-orange-900 border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-300 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                OS Ativas Agora
              </CardDescription>
              <CardTitle className="text-4xl text-white">{dadosGerais.oficina.osAtivas}</CardTitle>
              <div className="text-sm text-orange-300">{dadosGerais.oficina.osConcluidas} concluídas este mês</div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-950 to-green-900 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Faturamento Mês
              </CardDescription>
              <CardTitle className="text-3xl text-white">{formatCurrency(dadosGerais.oficina.faturamentoMes)}</CardTitle>
              <Progress value={percentualMeta} className="h-2 mt-2" />
              <div className="text-sm text-green-300 mt-1">{percentualMeta}% da meta ({formatCurrency(dadosGerais.oficina.metaMes)})</div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-blue-950 to-blue-900 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Capacidade da Equipe
              </CardDescription>
              <CardTitle className="text-4xl text-white">{percentualCapacidade}%</CardTitle>
              <Progress value={percentualCapacidade} className="h-2 mt-2" />
              <div className="text-sm text-blue-300 mt-1">
                {dadosGerais.oficina.mecanicosTotal - dadosGerais.oficina.mecanicosDisponiveis} de {dadosGerais.oficina.mecanicosTotal} trabalhando
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-950 to-yellow-900 border-yellow-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-yellow-300 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Satisfação NPS
              </CardDescription>
              <CardTitle className="text-4xl text-white">{dadosGerais.oficina.satisfacao}%</CardTitle>
              <div className="text-sm text-yellow-300">⭐ Excelente!</div>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs por Visão */}
        <Tabs defaultValue="operacional" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="operacional" className="data-[state=active]:bg-cyan-600">
              <Activity className="h-4 w-4 mr-2" />
              Operacional
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="data-[state=active]:bg-cyan-600">
              <DollarSign className="h-4 w-4 mr-2" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="equipe" className="data-[state=active]:bg-cyan-600">
              <Users className="h-4 w-4 mr-2" />
              Equipe
            </TabsTrigger>
            <TabsTrigger value="qualidade" className="data-[state=active]:bg-cyan-600">
              <Award className="h-4 w-4 mr-2" />
              Qualidade
            </TabsTrigger>
          </TabsList>

          {/* Tab Operacional */}
          <TabsContent value="operacional" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição de OS */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Distribuição de OS por Status</CardTitle>
                  <CardDescription className="text-zinc-400">Em tempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={distribuicaoOS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="status" stroke="#a1a1aa" />
                      <YAxis stroke="#a1a1aa" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                        labelStyle={{ color: "#ffffff" }}
                      />
                      <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
                        {distribuicaoOS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tempo Médio */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Performance de Tempo
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Indicadores de prazo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">Tempo Médio de Ciclo</span>
                      <span className="text-2xl font-bold text-white">{dadosGerais.tempo.tempoMedioCiclo}d</span>
                    </div>
                    <Progress value={75} className="h-3" />
                    <div className="text-sm text-zinc-400 mt-1">Meta: 6.0 dias</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">OS no Prazo</span>
                      <span className="text-2xl font-bold text-green-500">{dadosGerais.tempo.osNoPrazo}%</span>
                    </div>
                    <Progress value={dadosGerais.tempo.osNoPrazo} className="h-3" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">OS Atrasadas</span>
                      <span className="text-2xl font-bold text-red-500">{dadosGerais.tempo.osAtrasadas}</span>
                    </div>
                    <div className="text-sm text-zinc-400">Necessitam atenção imediata</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Evolução Semanal */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Evolução da Semana</CardTitle>
                <CardDescription className="text-zinc-400">OS, Faturamento e Satisfação</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={evolucaoSemanal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="dia" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                      labelStyle={{ color: "#ffffff" }}
                      formatter={(value: number, name: string) => {
                        if (name === "faturamento") return formatCurrency(value);
                        if (name === "satisfacao") return `${value}%`;
                        return value;
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="os" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="OS" />
                    <Area type="monotone" dataKey="satisfacao" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Satisfação %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Financeiro */}
          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-950 border-green-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Receita Mensal</CardTitle>
                  <div className="text-3xl font-bold text-green-400 mt-2">
                    {formatCurrency(dadosGerais.oficina.faturamentoMes)}
                  </div>
                  <div className="text-sm text-green-300 mt-2">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    +8.6% vs mês anterior
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-blue-950 border-blue-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Ticket Médio</CardTitle>
                  <div className="text-3xl font-bold text-blue-400 mt-2">
                    {formatCurrency(dadosGerais.oficina.faturamentoMes / dadosGerais.oficina.osConcluidas)}
                  </div>
                  <div className="text-sm text-blue-300 mt-2">Por OS concluída</div>
                </CardHeader>
              </Card>

              <Card className="bg-purple-950 border-purple-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Meta do Mês</CardTitle>
                  <div className="text-3xl font-bold text-purple-400 mt-2">{percentualMeta}%</div>
                  <Progress value={percentualMeta} className="h-2 mt-2" />
                  <div className="text-sm text-purple-300 mt-2">
                    Faltam {formatCurrency(dadosGerais.oficina.metaMes - dadosGerais.oficina.faturamentoMes)}
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Equipe */}
          <TabsContent value="equipe" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Top 5 Mecânicos do Mês</CardTitle>
                <CardDescription className="text-zinc-400">Ranking por OS concluídas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMecanicos.map((mec, index) => (
                    <div key={mec.nome} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
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
                          <h4 className="font-semibold text-white">{mec.nome}</h4>
                          <p className="text-sm text-zinc-400">{mec.os} OS • {mec.eficiencia}% eficiência</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Award className="h-5 w-5" />
                          <span className="font-bold text-xl">{mec.avaliacao}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Qualidade */}
          <TabsContent value="qualidade" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Indicadores de Saúde da Oficina</CardTitle>
                <CardDescription className="text-zinc-400">Score de performance geral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {indicadoresSaude.map((ind) => (
                    <div key={ind.nome}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">{ind.nome}</span>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(ind.status)}>
                            {ind.status === "excelente" ? "Excelente" :
                             ind.status === "bom" ? "Bom" :
                             ind.status === "atencao" ? "Atenção" :
                             "Crítico"}
                          </Badge>
                          <span className="text-white font-bold text-xl">{ind.valor}%</span>
                        </div>
                      </div>
                      <Progress value={ind.valor} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// Import Cell for BarChart
import { Cell } from "recharts";
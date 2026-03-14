import { useState } from "react";
import { Layers, TrendingUp, Users, Wrench, DollarSign, Clock, Target, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router";

export default function GestaoOsUltimate() {
  const navigate = useNavigate();

  const [periodo] = useState("30");

  // Funil de OS Clicável
  const funnelData = [
    { etapa: "Orçamento", valor: 100, quantidade: 45, cor: "#3b82f6" },
    { etapa: "Aprovado", valor: 78, quantidade: 35, cor: "#22c55e" },
    { etapa: "Em Andamento", valor: 56, quantidade: 25, cor: "#f59e0b" },
    { etapa: "Concluído", valor: 44, quantidade: 20, cor: "#8b5cf6" },
    { etapa: "Faturado", valor: 38, quantidade: 17, cor: "#ef4444" },
  ];

  // Performance por Etapa
  const performancePorEtapa = [
    { etapa: "Orçamento", tempoMedio: 2.5, meta: 2.0, conversao: 78 },
    { etapa: "Aprovação", tempoMedio: 1.8, meta: 1.5, conversao: 72 },
    { etapa: "Execução", tempoMedio: 4.2, meta: 4.0, conversao: 80 },
    { etapa: "Entrega", tempoMedio: 0.8, meta: 1.0, conversao: 86 },
  ];

  // Tendência Semanal
  const tendenciaSemanal = [
    { semana: "S1", orcamentos: 12, concluidas: 8, faturadas: 6 },
    { semana: "S2", orcamentos: 15, concluidas: 10, faturadas: 8 },
    { semana: "S3", orcamentos: 10, concluidas: 9, faturadas: 7 },
    { semana: "S4", orcamentos: 18, concluidas: 12, faturadas: 9 },
  ];

  const stats = {
    totalOS: 45,
    emAndamento: 25,
    concluidas: 20,
    faturadas: 17,
    taxaConversao: 78,
    taxaConclusao: 80,
    ticketMedio: 1850,
    faturamentoTotal: 31450,
    tempoMedioCiclo: 6.8,
    clientesAtivos: 38,
  };

  const gargalos = [
    { etapa: "Aprovação", problema: "Tempo de resposta cliente", impacto: "alto", quantidade: 8 },
    { etapa: "Aguardando Peças", problema: "Fornecedor atrasado", impacto: "medio", quantidade: 5 },
    { etapa: "Execução", problema: "Falta de mecânico", impacto: "medio", quantidade: 3 },
  ];

  const topServicos = [
    { servico: "Troca de Motor", quantidade: 8, faturamento: 12800, tempo: 6.5 },
    { servico: "Revisão Completa", quantidade: 15, faturamento: 9000, tempo: 3.2 },
    { servico: "Suspensão", quantidade: 12, faturamento: 7200, tempo: 4.0 },
    { servico: "Freios", quantidade: 10, faturamento: 2450, tempo: 2.1 },
  ];

  const handleClickFunil = (etapa: string) => {
    navigate(`/ordens-servico?etapa=${etapa.toLowerCase()}`);
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case "alto": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medio": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "baixo": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

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
              <Layers className="h-8 w-8 text-purple-500" />
              OS Ultimate - Visão 360°
            </h1>
            <p className="text-zinc-400 mt-1">
              Dashboard estratégico com funil completo de Ordens de Serviço
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/relatorios")}>
              Ver Relatórios
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Exportar Dados
            </Button>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-950 to-blue-900 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Total OS
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.totalOS}</CardTitle>
              <div className="text-sm text-blue-300">Últimos {periodo} dias</div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-orange-950 to-orange-900 border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-300 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Em Andamento
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.emAndamento}</CardTitle>
              <div className="text-sm text-orange-300">{Math.round((stats.emAndamento / stats.totalOS) * 100)}% do total</div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-950 to-green-900 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Concluídas
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.concluidas}</CardTitle>
              <div className="text-sm text-green-300">Taxa: {stats.taxaConclusao}%</div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950 to-purple-900 border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Faturamento
              </CardDescription>
              <CardTitle className="text-2xl text-white">{formatCurrency(stats.faturamentoTotal)}</CardTitle>
              <div className="text-sm text-purple-300">Ticket: {formatCurrency(stats.ticketMedio)}</div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tempo Ciclo
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.tempoMedioCiclo}d</CardTitle>
              <div className="text-sm text-zinc-400">Média geral</div>
            </CardHeader>
          </Card>
        </div>

        {/* Funil Clicável + Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funil de Conversão */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Funil de Conversão
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Clique em cada etapa para ver detalhes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelData.map((etapa, index) => (
                  <div key={etapa.etapa}>
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleClickFunil(etapa.etapa)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <span className="text-white font-semibold">{etapa.etapa}</span>
                            <span className="text-zinc-400 text-sm ml-2">({etapa.quantidade} OS)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">{etapa.valor}%</div>
                        </div>
                      </div>
                      <Progress value={etapa.valor} className="h-6" style={{ backgroundColor: `${etapa.cor}20` }}>
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${etapa.valor}%`, backgroundColor: etapa.cor }}
                        />
                      </Progress>
                    </div>
                    {index < funnelData.length - 1 && (
                      <div className="text-center text-sm text-zinc-500 my-1">
                        ⬇ {Math.round(((funnelData[index + 1].quantidade / etapa.quantidade) * 100))}% conversão
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance por Etapa */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance por Etapa
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Tempo médio vs meta e taxa de conversão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performancePorEtapa.map((perf) => (
                  <div key={perf.etapa} className="p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{perf.etapa}</h4>
                      <Badge className={perf.tempoMedio <= perf.meta ? "bg-green-600" : "bg-red-600"}>
                        {perf.tempoMedio <= perf.meta ? "No prazo" : "Atrasado"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold ${perf.tempoMedio <= perf.meta ? "text-green-500" : "text-red-500"}`}>
                          {perf.tempoMedio}d
                        </div>
                        <div className="text-xs text-zinc-400">Tempo Real</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-zinc-400">{perf.meta}d</div>
                        <div className="text-xs text-zinc-400">Meta</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">{perf.conversao}%</div>
                        <div className="text-xs text-zinc-400">Conversão</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tendência Semanal */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendência Semanal
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Evolução de orçamentos, conclusões e faturamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendenciaSemanal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="semana" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Legend />
                <Line type="monotone" dataKey="orcamentos" stroke="#3b82f6" strokeWidth={3} name="Orçamentos" />
                <Line type="monotone" dataKey="concluidas" stroke="#22c55e" strokeWidth={3} name="Concluídas" />
                <Line type="monotone" dataKey="faturadas" stroke="#ef4444" strokeWidth={3} name="Faturadas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gargalos + Top Serviços */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gargalos Identificados */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Gargalos Identificados
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Problemas que estão travando o fluxo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gargalos.map((gargalo, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white mb-1">{gargalo.etapa}</h4>
                        <p className="text-zinc-400 text-sm">{gargalo.problema}</p>
                      </div>
                      <Badge className={getImpactoColor(gargalo.impacto)}>
                        {gargalo.impacto}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-zinc-400">{gargalo.quantidade} OS afetadas</span>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Resolver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Serviços */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Top Serviços
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Serviços mais rentáveis do período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topServicos.map((servico, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? "bg-yellow-600" :
                          index === 1 ? "bg-zinc-400" :
                          index === 2 ? "bg-orange-600" :
                          "bg-zinc-700"
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{servico.servico}</h4>
                          <p className="text-zinc-400 text-sm">{servico.quantidade} OS realizadas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-500">{formatCurrency(servico.faturamento)}</div>
                        <div className="text-xs text-zinc-400">{servico.tempo}h médio</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Taxa de Conversão Global */}
        <Card className="bg-gradient-to-r from-purple-950 to-blue-950 border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Taxa de Conversão Global</h3>
                <p className="text-purple-300">Do orçamento até o faturamento</p>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold text-white">{stats.taxaConversao}%</div>
                <div className="text-purple-300 mt-2">
                  <TrendingUp className="h-5 w-5 inline mr-1" />
                  +5% vs mês anterior
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

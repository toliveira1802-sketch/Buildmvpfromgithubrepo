import { useState } from "react";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from "recharts";
import AdminLayout from "../../components/AdminLayout";

export default function AnalyticsFunil() {
  const funnelData = [
    { etapa: "Leads Gerados", valor: 100, quantidade: 250, cor: "#3b82f6" },
    { etapa: "Primeiro Contato", valor: 68, quantidade: 170, cor: "#8b5cf6" },
    { etapa: "Orçamento Enviado", valor: 48, quantidade: 120, cor: "#f59e0b" },
    { etapa: "Negociação", valor: 32, quantidade: 80, cor: "#22c55e" },
    { etapa: "Venda Fechada", valor: 20, quantidade: 50, cor: "#ef4444" },
  ];

  const stats = {
    taxaConversao: 20,
    ticketMedio: 1850,
    faturamentoTotal: 92500,
    tempoCiclo: 8.5,
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-green-500" />
            Funil de Vendas
          </h1>
          <p className="text-zinc-400 mt-1">
            Análise completa do processo de conversão
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300">Taxa de Conversão</CardDescription>
              <CardTitle className="text-4xl text-white">{stats.taxaConversao}%</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300">Ticket Médio</CardDescription>
              <CardTitle className="text-3xl text-white">
                {stats.ticketMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-purple-950 border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-300">Faturamento Total</CardDescription>
              <CardTitle className="text-2xl text-white">
                {stats.faturamentoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-orange-950 border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-300">Tempo de Ciclo</CardDescription>
              <CardTitle className="text-4xl text-white">{stats.tempoCiclo}d</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Funil de Conversão</CardTitle>
            <CardDescription className="text-zinc-400">
              Do lead até o fechamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((etapa, index) => (
                <div key={etapa.etapa}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-white font-semibold">{etapa.etapa}</span>
                      <span className="text-zinc-400 text-sm ml-2">({etapa.quantidade} leads)</span>
                    </div>
                    <div className="text-xl font-bold text-white">{etapa.valor}%</div>
                  </div>
                  <Progress value={etapa.valor} className="h-6" style={{ backgroundColor: `${etapa.cor}20` }}>
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${etapa.valor}%`, backgroundColor: etapa.cor }}
                    />
                  </Progress>
                  {index < funnelData.length - 1 && (
                    <div className="text-center text-sm text-zinc-500 my-1">
                      ⬇ {Math.round((funnelData[index + 1].quantidade / etapa.quantidade) * 100)}% conversão
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

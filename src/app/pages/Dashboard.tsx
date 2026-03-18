import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useEffect } from "react";
import { TrendingUp, Clock, CheckCircle2, AlertCircle, DollarSign, Car, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AdminLayout from "../components/AdminLayout";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard - Doctor Auto";
  }, []);

  const kpis = [
    { 
      title: "Veículos no Pátio", 
      value: "0", 
      change: "Sem dados",
      icon: Car, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      title: "OS Abertas", 
      value: "0", 
      change: "Sem dados",
      icon: FileText, 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      title: "Faturamento Mês", 
      value: "R$ 0,00", 
      change: "Sem dados",
      icon: DollarSign, 
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      title: "Ticket Médio", 
      value: "R$ 0,00", 
      change: "Sem dados",
      icon: TrendingUp, 
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
  ];

  const statusData: Array<{ name: string; value: number; color: string }> = [];

  const faturamentoMensal: Array<{ mes: string; valor: number }> = [];

  const alertas: Array<{ tipo: string; mensagem: string; icon: any }> = [];

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da oficina em tempo real</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={`kpi-${index}-${kpi.title}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`size-5 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alertas */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas e Pendências</CardTitle>
            <CardDescription>Itens que requerem atenção imediata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum alerta no momento</p>
              </div>
            ) : (
              alertas.map((alerta, idx) => {
                const Icon = alerta.icon;
                const colors = {
                  warning: "text-orange-500 bg-orange-500/10",
                  success: "text-green-500 bg-green-500/10",
                  error: "text-red-500 bg-red-500/10",
                };
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className={`p-2 rounded-lg ${colors[alerta.tipo as keyof typeof colors]}`}>
                      <Icon className="size-5" />
                    </div>
                    <span className="text-sm">{alerta.mensagem}</span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>OS ativas no pátio</CardDescription>
            </CardHeader>
            <CardContent>
              {statusData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="text-center text-zinc-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum dado disponível</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`pie-cell-${index}-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faturamento Mensal</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              {faturamentoMensal.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="text-center text-zinc-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum dado disponível</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={faturamentoMensal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mes" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    />
                    <Bar dataKey="valor" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
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
      value: "23", 
      change: "+5 hoje",
      icon: Car, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      title: "OS Abertas", 
      value: "18", 
      change: "4 aguardando aprovação",
      icon: FileText, 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      title: "Faturamento Mês", 
      value: "R$ 147.500", 
      change: "+15% vs mês anterior",
      icon: DollarSign, 
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      title: "Ticket Médio", 
      value: "R$ 3.450", 
      change: "Meta: R$ 3.500",
      icon: TrendingUp, 
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
  ];

  const statusData = [
    { name: "Diagnóstico", value: 4, color: "#8b5cf6" },
    { name: "Orçamento", value: 3, color: "#3b82f6" },
    { name: "Aguardando Aprovação", value: 4, color: "#f59e0b" },
    { name: "Em Execução", value: 5, color: "#10b981" },
    { name: "Pronto", value: 2, color: "#06b6d4" },
  ];

  const faturamentoMensal = [
    { mes: "Out", valor: 120000 },
    { mes: "Nov", valor: 135000 },
    { mes: "Dez", valor: 128000 },
    { mes: "Jan", valor: 142000 },
    { mes: "Fev", valor: 155000 },
    { mes: "Mar", valor: 147500 },
  ];

  const alertas = [
    { tipo: "warning", mensagem: "3 OS aguardando aprovação há mais de 24h", icon: Clock },
    { tipo: "success", mensagem: "2 veículos prontos para retirada", icon: CheckCircle2 },
    { tipo: "error", mensagem: "1 OS parada há mais de 48h", icon: AlertCircle },
  ];

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da oficina em tempo real</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title}>
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
            {alertas.map((alerta, idx) => {
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
            })}
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faturamento Mensal</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, DollarSign, Users, Wrench, Car } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Dashboard Admin - Doctor Auto";
  }, []);

  const kpis = [
    { 
      title: "Receita do Mês",
      value: "R$ 127.500",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500"
    },
    { 
      title: "OS em Andamento",
      value: "23",
      change: "+3",
      trend: "up",
      icon: Clock,
      color: "text-blue-500"
    },
    { 
      title: "Clientes Ativos",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-purple-500"
    },
    { 
      title: "Taxa de Conclusão",
      value: "94.3%",
      change: "-1.2%",
      trend: "down",
      icon: CheckCircle2,
      color: "text-orange-500"
    }
  ];

  const revenueData = [
    { mes: "Jan", receita: 65000, custos: 45000 },
    { mes: "Fev", receita: 72000, custos: 48000 },
    { mes: "Mar", receita: 68000, custos: 46000 },
    { mes: "Abr", receita: 85000, custos: 52000 },
    { mes: "Mai", receita: 92000, custos: 55000 },
    { mes: "Jun", receita: 127500, custos: 62000 }
  ];

  const serviceData = [
    { name: "Manutenção", value: 35 },
    { name: "Revisão", value: 28 },
    { name: "Funilaria", value: 20 },
    { name: "Pintura", value: 12 },
    { name: "Outros", value: 5 }
  ];

  const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899", "#10b981"];

  const statusData = [
    { status: "Aguardando", count: 5, color: "#94a3b8" },
    { status: "Em Andamento", count: 23, color: "#3b82f6" },
    { status: "Aguardando Peças", count: 8, color: "#f59e0b" },
    { status: "Concluído", count: 142, color: "#10b981" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral completa do sistema</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`size-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs flex items-center gap-1 ${
                  kpi.trend === "up" ? "text-green-500" : "text-red-500"
                }`}>
                  <TrendIcon className="size-3" />
                  {kpi.change}
                  <span className="text-muted-foreground">em relação ao mês anterior</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita x Custos */}
        <Card>
          <CardHeader>
            <CardTitle>Receita x Custos (Últimos 6 meses)</CardTitle>
            <CardDescription>Comparação financeira mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="custos" stroke="#ef4444" strokeWidth={2} name="Custos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Tipo de Serviço */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Serviço</CardTitle>
            <CardDescription>Serviços realizados no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status das OS */}
      <Card>
        <CardHeader>
          <CardTitle>Status das Ordens de Serviço</CardTitle>
          <CardDescription>Distribuição atual de OS por status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cards de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atenção Necessária</CardTitle>
            <AlertCircle className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              OS aguardando peças há mais de 7 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mecânicos Ativos</CardTitle>
            <Wrench className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              8 em serviço, 4 disponíveis
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos no Pátio</CardTitle>
            <Car className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31</div>
            <p className="text-xs text-muted-foreground">
              Capacidade: 50 veículos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

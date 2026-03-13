import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Wrench,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  FileText,
  PieChart,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { relatoriosAPI } from "../../services/api";

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function AdminRelatorios() {
  const [periodo, setPeriodo] = useState("mes");
  const [isLoading, setIsLoading] = useState(false);

  const [faturamentoData, setFaturamentoData] = useState<any[]>([]);
  const [servicosPopulares, setServicosPopulares] = useState<any[]>([]);
  const [performanceMecanicos, setPerformanceMecanicos] = useState<any[]>([]);

  // Dados mockados para demonstração
  const faturamentoPorMes = [
    { mes: "Jan", valor: 45000, meta: 50000 },
    { mes: "Fev", valor: 52000, meta: 50000 },
    { mes: "Mar", valor: 48000, meta: 50000 },
    { mes: "Abr", valor: 61000, meta: 55000 },
    { mes: "Mai", valor: 55000, meta: 55000 },
    { mes: "Jun", valor: 67000, meta: 60000 },
  ];

  const servicosMaisRealizados = [
    { nome: "Troca de Óleo", quantidade: 145 },
    { nome: "Revisão Completa", quantidade: 89 },
    { nome: "Alinhamento", quantidade: 76 },
    { nome: "Balanceamento", quantidade: 72 },
    { nome: "Troca de Pneus", quantidade: 58 },
    { nome: "Freios", quantidade: 45 },
  ];

  const distribuicaoStatus = [
    { name: "Concluído", value: 245, color: "#10b981" },
    { name: "Em Andamento", value: 87, color: "#3b82f6" },
    { name: "Aguardando", value: 43, color: "#f59e0b" },
    { name: "Cancelado", value: 18, color: "#ef4444" },
  ];

  const performancePorMecanico = [
    { nome: "João Silva", osConcluidas: 78, faturamento: 125000 },
    { nome: "Maria Santos", osConcluidas: 65, faturamento: 98000 },
    { nome: "Pedro Costa", osConcluidas: 52, faturamento: 82000 },
    { nome: "Ana Lima", osConcluidas: 45, faturamento: 71000 },
    { nome: "Carlos Souza", osConcluidas: 38, faturamento: 59000 },
  ];

  const ticketMedioPorMes = [
    { mes: "Jan", valor: 850 },
    { mes: "Fev", valor: 920 },
    { mes: "Mar", valor: 880 },
    { mes: "Abr", valor: 1050 },
    { mes: "Mai", valor: 980 },
    { mes: "Jun", valor: 1120 },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Tentar carregar dados reais do backend
      const [faturamento, servicos, mecanicos] = await Promise.all([
        relatoriosAPI.getFaturamento().catch(() => null),
        relatoriosAPI.getServicosPopulares().catch(() => null),
        relatoriosAPI.getPerformanceMecanicos().catch(() => null),
      ]);

      if (faturamento) setFaturamentoData(faturamento);
      if (servicos) setServicosPopulares(servicos);
      if (mecanicos) setPerformanceMecanicos(mecanicos);

      toast.success("Relatórios atualizados!");
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
      toast.error("Erro ao carregar relatórios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [periodo]);

  const handleExport = () => {
    toast.success("Exportando relatório em PDF...");
    // Implementar exportação real aqui
  };

  const stats = {
    faturamentoTotal: faturamentoPorMes.reduce((sum, item) => sum + item.valor, 0),
    ticketMedio: 980,
    osRealizadas: 393,
    crescimento: 15.3,
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Relatórios</h1>
            <p className="text-zinc-400 mt-1">
              Análise completa de desempenho e faturamento
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Última Semana</SelectItem>
                <SelectItem value="mes">Último Mês</SelectItem>
                <SelectItem value="trimestre">Último Trimestre</SelectItem>
                <SelectItem value="semestre">Último Semestre</SelectItem>
                <SelectItem value="ano">Último Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button onClick={handleExport} className="bg-red-600 hover:bg-red-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-950 to-zinc-900 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300">Faturamento Total</CardDescription>
              <CardTitle className="text-3xl text-white">
                {stats.faturamentoTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 0,
                })}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-green-400">
                <TrendingUp className="h-4 w-4" />
                +{stats.crescimento}% vs período anterior
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Ticket Médio</CardDescription>
              <CardTitle className="text-3xl text-white">
                {stats.ticketMedio.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-blue-400">
                <DollarSign className="h-4 w-4" />
                Por ordem de serviço
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">OS Realizadas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.osRealizadas}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-purple-400">
                <FileText className="h-4 w-4" />
                Todas concluídas
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Taxa de Conversão</CardDescription>
              <CardTitle className="text-3xl text-white">87.5%</CardTitle>
              <div className="flex items-center gap-1 text-sm text-orange-400">
                <BarChart3 className="h-4 w-4" />
                Orçamento → Aprovação
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faturamento por Mês */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Faturamento Mensal
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Comparativo com meta estabelecida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={faturamentoPorMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="mes" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="valor" fill="#10b981" name="Realizado" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="meta" fill="#3b82f6" name="Meta" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Status */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuição por Status
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Total de {distribuicaoStatus.reduce((sum, item) => sum + item.value, 0)} OS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={distribuicaoStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribuicaoStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Serviços Mais Realizados */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Serviços Mais Realizados
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Top 6 serviços no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={servicosMaisRealizados} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" stroke="#71717a" />
                <YAxis dataKey="nome" type="category" stroke="#71717a" width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="quantidade" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance por Mecânico */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance por Mecânico
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Ranking de produtividade e faturamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-zinc-300">Posição</th>
                    <th className="p-4 font-medium text-zinc-300">Mecânico</th>
                    <th className="p-4 font-medium text-zinc-300">OS Concluídas</th>
                    <th className="p-4 font-medium text-zinc-300">Faturamento</th>
                    <th className="p-4 font-medium text-zinc-300">Ticket Médio</th>
                  </tr>
                </thead>
                <tbody>
                  {performancePorMecanico.map((mecanico, index) => (
                    <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                      <td className="p-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-black"
                              : index === 1
                              ? "bg-zinc-400 text-black"
                              : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-zinc-700 text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4 text-white font-medium">{mecanico.nome}</td>
                      <td className="p-4 text-zinc-300">{mecanico.osConcluidas}</td>
                      <td className="p-4 text-green-500 font-semibold">
                        {mecanico.faturamento.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 0,
                        })}
                      </td>
                      <td className="p-4 text-blue-400">
                        {(mecanico.faturamento / mecanico.osConcluidas).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Médio por Mês */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Evolução do Ticket Médio
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Valor médio por ordem de serviço ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketMedioPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="mes" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
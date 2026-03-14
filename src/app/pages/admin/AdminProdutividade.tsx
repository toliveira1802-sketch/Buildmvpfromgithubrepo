import { useState } from "react";
import { Users, TrendingUp, Clock, Award, Target, Zap, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminLayout from "../../components/AdminLayout";

interface Mecanico {
  id: string;
  nome: string;
  especialidade: string;
  osConcluidas: number;
  tempoMedio: number;
  eficiencia: number;
  avaliacao: number;
  xp: number;
  nivel: number;
}

export default function AdminProdutividade() {
  const [periodo, setPeriodo] = useState("30");

  const [mecanicos] = useState<Mecanico[]>([
    {
      id: "M001",
      nome: "Carlos Silva",
      especialidade: "Motor",
      osConcluidas: 47,
      tempoMedio: 3.2,
      eficiencia: 94,
      avaliacao: 4.8,
      xp: 3200,
      nivel: 3,
    },
    {
      id: "M002",
      nome: "Roberto Santos",
      especialidade: "Suspensão",
      osConcluidas: 52,
      tempoMedio: 2.8,
      eficiencia: 97,
      avaliacao: 4.9,
      xp: 3800,
      nivel: 3,
    },
    {
      id: "M003",
      nome: "Fernando Lima",
      especialidade: "Elétrica",
      osConcluidas: 38,
      tempoMedio: 4.1,
      eficiencia: 88,
      avaliacao: 4.5,
      xp: 2400,
      nivel: 2,
    },
    {
      id: "M004",
      nome: "André Costa",
      especialidade: "Freios",
      osConcluidas: 45,
      tempoMedio: 2.5,
      eficiencia: 96,
      avaliacao: 4.7,
      xp: 2900,
      nivel: 3,
    },
  ]);

  const produtividadeSemanal = [
    { semana: "Sem 1", carlos: 12, roberto: 14, fernando: 9, andre: 11 },
    { semana: "Sem 2", carlos: 11, roberto: 13, fernando: 10, andre: 12 },
    { semana: "Sem 3", carlos: 13, roberto: 12, fernando: 8, andre: 11 },
    { semana: "Sem 4", carlos: 11, roberto: 13, fernando: 11, andre: 11 },
  ];

  const tempoMedioTendencia = [
    { mes: "Set", tempo: 3.8 },
    { mes: "Out", tempo: 3.5 },
    { mes: "Nov", tempo: 3.2 },
    { mes: "Dez", tempo: 3.0 },
    { mes: "Jan", tempo: 2.9 },
    { mes: "Fev", tempo: 3.1 },
  ];

  const stats = {
    totalOS: 182,
    variacao: 12.5,
    tempoMedioGeral: 3.2,
    variacaoTempo: -8.3,
    eficienciaMedia: 93.8,
    variacaoEficiencia: 5.2,
    avaliacaoMedia: 4.7,
  };

  const mecanicoOrdenado = [...mecanicos].sort((a, b) => b.osConcluidas - a.osConcluidas);

  const getEficienciaColor = (eficiencia: number) => {
    if (eficiencia >= 95) return "text-green-500";
    if (eficiencia >= 85) return "text-yellow-500";
    return "text-red-500";
  };

  const getNivelBadge = (nivel: number) => {
    const cores = ["bg-zinc-600", "bg-green-600", "bg-blue-600", "bg-purple-600", "bg-yellow-600"];
    const nomes = ["Iniciante", "Aprendiz", "Profissional", "Especialista", "Mestre"];
    return { cor: cores[nivel - 1] || cores[0], nome: nomes[nivel - 1] || nomes[0] };
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              Produtividade da Equipe
            </h1>
            <p className="text-zinc-400 mt-1">
              Análise de performance e eficiência dos mecânicos
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
            </SelectContent>
          </Select>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-950 to-blue-900 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Total de OS
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.totalOS}</CardTitle>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400">+{stats.variacao}%</span>
                <span className="text-blue-300">vs período anterior</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tempo Médio
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.tempoMedioGeral}h</CardTitle>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400">{stats.variacaoTempo}%</span>
                <span className="text-zinc-400">mais rápido</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Eficiência Média
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.eficienciaMedia}%</CardTitle>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400">+{stats.variacaoEficiencia}%</span>
                <span className="text-zinc-400">vs período anterior</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-950 to-yellow-900 border-yellow-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-yellow-300 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Avaliação Média
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.avaliacaoMedia}</CardTitle>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(stats.avaliacaoMedia)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Gráfico de Produtividade Semanal */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Produtividade Semanal por Mecânico
            </CardTitle>
            <CardDescription className="text-zinc-400">
              OS concluídas por semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={produtividadeSemanal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="semana" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Legend />
                <Bar key="bar-carlos" dataKey="carlos" fill="#ef4444" name="Carlos" radius={[4, 4, 0, 0]} />
                <Bar key="bar-roberto" dataKey="roberto" fill="#3b82f6" name="Roberto" radius={[4, 4, 0, 0]} />
                <Bar key="bar-fernando" dataKey="fernando" fill="#22c55e" name="Fernando" radius={[4, 4, 0, 0]} />
                <Bar key="bar-andre" dataKey="andre" fill="#f59e0b" name="André" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendência de Tempo Médio */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tendência de Tempo Médio
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Tempo médio de conclusão nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={tempoMedioTendencia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="mes" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff" }}
                  formatter={(value: number) => `${value}h`}
                />
                <Line type="monotone" dataKey="tempo" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ranking de Mecânicos */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Ranking de Performance
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Mecânicos ordenados por OS concluídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mecanicoOrdenado.map((mecanico, index) => {
                const nivelInfo = getNivelBadge(mecanico.nivel);
                return (
                  <div
                    key={mecanico.id}
                    className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl ${
                        index === 0 ? "bg-gradient-to-br from-yellow-600 to-yellow-500" :
                        index === 1 ? "bg-gradient-to-br from-zinc-400 to-zinc-500" :
                        index === 2 ? "bg-gradient-to-br from-orange-600 to-orange-500" :
                        "bg-gradient-to-br from-zinc-700 to-zinc-600"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-lg">{mecanico.nome}</h4>
                          <Badge className={nivelInfo.cor}>
                            Nível {mecanico.nivel} - {nivelInfo.nome}
                          </Badge>
                        </div>
                        <p className="text-zinc-400 text-sm">{mecanico.especialidade}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-white">{mecanico.osConcluidas}</div>
                        <div className="text-xs text-zinc-400">OS Concluídas</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{mecanico.tempoMedio}h</div>
                        <div className="text-xs text-zinc-400">Tempo Médio</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${getEficienciaColor(mecanico.eficiencia)}`}>
                          {mecanico.eficiencia}%
                        </div>
                        <div className="text-xs text-zinc-400">Eficiência</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xl font-bold text-white">{mecanico.avaliacao}</span>
                        </div>
                        <div className="text-xs text-zinc-400">Avaliação</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-950 border-green-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-green-400" />
                Melhor Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white mb-1">{mecanicoOrdenado[0].nome}</p>
              <p className="text-green-400">{mecanicoOrdenado[0].osConcluidas} OS concluídas</p>
              <p className="text-zinc-400 text-sm mt-2">
                {mecanicoOrdenado[0].eficiencia}% de eficiência
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-blue-400" />
                Mais Rápido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white mb-1">
                {[...mecanicos].sort((a, b) => a.tempoMedio - b.tempoMedio)[0].nome}
              </p>
              <p className="text-blue-400">
                {[...mecanicos].sort((a, b) => a.tempoMedio - b.tempoMedio)[0].tempoMedio}h por OS
              </p>
              <p className="text-zinc-400 text-sm mt-2">Tempo médio de conclusão</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-950 border-yellow-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-yellow-400" />
                Melhor Avaliado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white mb-1">
                {[...mecanicos].sort((a, b) => b.avaliacao - a.avaliacao)[0].nome}
              </p>
              <p className="text-yellow-400 flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400" />
                {[...mecanicos].sort((a, b) => b.avaliacao - a.avaliacao)[0].avaliacao}
              </p>
              <p className="text-zinc-400 text-sm mt-2">Avaliação média dos clientes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
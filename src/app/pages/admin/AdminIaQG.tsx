import { useState } from "react";
import { Brain, Thermometer, Users, TrendingUp, Zap, Target, AlertCircle, CheckCircle2 } from "lucide-react";
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
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  origem: string;
  temperatura: "quente" | "morno" | "frio";
  score: number;
  consultor?: string;
  status: string;
  ultimoContato: string;
  probabilidade: number;
}

export default function AdminIaQG() {
  const [filtroTemp, setFiltroTemp] = useState<"todas" | "quente" | "morno" | "frio">("todas");

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "L001",
      nome: "João Silva",
      telefone: "(11) 98888-7777",
      origem: "Instagram",
      temperatura: "quente",
      score: 92,
      consultor: "Maria",
      status: "Agendado",
      ultimoContato: "Hoje, 14:30",
      probabilidade: 85,
    },
    {
      id: "L002",
      nome: "Pedro Costa",
      telefone: "(11) 97777-6666",
      origem: "Google Ads",
      temperatura: "quente",
      score: 88,
      status: "Novo",
      ultimoContato: "Hoje, 10:15",
      probabilidade: 78,
    },
    {
      id: "L003",
      nome: "Ana Oliveira",
      telefone: "(11) 96666-5555",
      origem: "Indicação",
      temperatura: "morno",
      score: 65,
      consultor: "João",
      status: "Em negociação",
      ultimoContato: "Ontem, 16:45",
      probabilidade: 55,
    },
    {
      id: "L004",
      nome: "Carlos Souza",
      telefone: "(11) 95555-4444",
      origem: "Facebook",
      temperatura: "frio",
      score: 42,
      status: "Sem resposta",
      ultimoContato: "3 dias atrás",
      probabilidade: 25,
    },
    {
      id: "L005",
      nome: "Juliana Lima",
      telefone: "(11) 94444-3333",
      origem: "Google Ads",
      temperatura: "quente",
      score: 90,
      consultor: "Maria",
      status: "Orçamento enviado",
      ultimoContato: "Hoje, 11:00",
      probabilidade: 82,
    },
  ]);

  const distribuicaoPorConsultor = [
    { consultor: "Maria", leads: 12, conversao: 45 },
    { consultor: "João", leads: 9, conversao: 38 },
    { consultor: "Pedro", leads: 7, conversao: 42 },
    { consultor: "Sem atribuição", leads: 5, conversao: 0 },
  ];

  const temperaturaDistribuicao = [
    { temperatura: "Quente", valor: 35, cor: "#ef4444" },
    { temperatura: "Morno", valor: 45, cor: "#f59e0b" },
    { temperatura: "Frio", valor: 20, cor: "#3b82f6" },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#3b82f6"];

  const stats = {
    totalLeads: 33,
    leadsQuentes: 12,
    leadsMornos: 15,
    leadsFrios: 6,
    taxaConversao: 42,
    scoreMedia: 71,
    leadsHoje: 8,
    semConsultor: 5,
  };

  const leadsFiltrados = filtroTemp === "todas" 
    ? leads 
    : leads.filter(l => l.temperatura === filtroTemp);

  const getTemperaturaColor = (temp: string) => {
    switch (temp) {
      case "quente": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "morno": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "frio": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getTemperaturaIcon = (temp: string) => {
    return <Thermometer className="h-4 w-4" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const handleAnalisarLote = () => {
    toast.success("🤖 IA analisando leads... Aguarde.");
    setTimeout(() => {
      toast.success("✅ Análise concluída! 8 leads atualizados.");
    }, 2000);
  };

  const handleDistribuir = () => {
    toast.success("🎯 Distribuindo leads automaticamente...");
    setTimeout(() => {
      toast.success("✅ 5 leads distribuídos entre consultores!");
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-500" />
              IA QG - Lead Scoring
            </h1>
            <p className="text-zinc-400 mt-1">
              Análise inteligente e distribuição automática de leads
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAnalisarLote} className="bg-purple-600 hover:bg-purple-700">
              <Brain className="h-4 w-4 mr-2" />
              Analisar Lote
            </Button>
            <Button onClick={handleDistribuir} className="bg-red-600 hover:bg-red-700">
              <Zap className="h-4 w-4 mr-2" />
              Distribuir Leads
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total de Leads</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.totalLeads}</CardTitle>
              <div className="text-sm text-green-400">+{stats.leadsHoje} hoje</div>
            </CardHeader>
          </Card>

          <Card className="bg-red-950 border-red-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-300 flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Leads Quentes
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.leadsQuentes}</CardTitle>
              <div className="text-sm text-red-300">Score médio: 89</div>
            </CardHeader>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300">Taxa de Conversão</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.taxaConversao}%</CardTitle>
              <div className="text-sm text-green-300">+5% vs mês anterior</div>
            </CardHeader>
          </Card>

          <Card className="bg-orange-950 border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-300">Sem Consultor</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.semConsultor}</CardTitle>
              <div className="text-sm text-orange-300">Aguardando atribuição</div>
            </CardHeader>
          </Card>
        </div>

        {/* Distribuição de Temperatura */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Distribuição por Temperatura
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Classificação automática por IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      Quente (Score 80-100)
                    </span>
                    <span className="text-white font-bold">{stats.leadsQuentes}</span>
                  </div>
                  <Progress value={(stats.leadsQuentes / stats.totalLeads) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      Morno (Score 50-79)
                    </span>
                    <span className="text-white font-bold">{stats.leadsMornos}</span>
                  </div>
                  <Progress value={(stats.leadsMornos / stats.totalLeads) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      Frio (Score 0-49)
                    </span>
                    <span className="text-white font-bold">{stats.leadsFrios}</span>
                  </div>
                  <Progress value={(stats.leadsFrios / stats.totalLeads) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Distribuição por Consultor
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Performance da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={distribuicaoPorConsultor}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="consultor" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    labelStyle={{ color: "#ffffff" }}
                  />
                  <Bar key="bar-leads" dataKey="leads" fill="#ef4444" name="Leads" radius={[8, 8, 0, 0]} />
                  <Bar key="bar-conversao" dataKey="conversao" fill="#22c55e" name="Conversão %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filtroTemp === "todas" ? "default" : "outline"}
            onClick={() => setFiltroTemp("todas")}
            className={filtroTemp === "todas" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Todos ({stats.totalLeads})
          </Button>
          <Button
            variant={filtroTemp === "quente" ? "default" : "outline"}
            onClick={() => setFiltroTemp("quente")}
            className={filtroTemp === "quente" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Thermometer className="h-4 w-4 mr-2" />
            Quentes ({stats.leadsQuentes})
          </Button>
          <Button
            variant={filtroTemp === "morno" ? "default" : "outline"}
            onClick={() => setFiltroTemp("morno")}
            className={filtroTemp === "morno" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
          >
            <Thermometer className="h-4 w-4 mr-2" />
            Mornos ({stats.leadsMornos})
          </Button>
          <Button
            variant={filtroTemp === "frio" ? "default" : "outline"}
            onClick={() => setFiltroTemp("frio")}
            className={filtroTemp === "frio" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Thermometer className="h-4 w-4 mr-2" />
            Frios ({stats.leadsFrios})
          </Button>
        </div>

        {/* Lista de Leads */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Leads ({leadsFiltrados.length})</CardTitle>
            <CardDescription className="text-zinc-400">
              Classificação automática por IA com lead scoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leadsFiltrados.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-white text-lg">{lead.nome}</h4>
                      <Badge className={getTemperaturaColor(lead.temperatura)}>
                        {getTemperaturaIcon(lead.temperatura)}
                        <span className="ml-1 capitalize">{lead.temperatura}</span>
                      </Badge>
                      <Badge variant="outline" className="border-zinc-700">
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                      <span>{lead.telefone}</span>
                      <span>Origem: {lead.origem}</span>
                      <span>Último contato: {lead.ultimoContato}</span>
                      {lead.consultor && (
                        <span className="text-blue-400">Consultor: {lead.consultor}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </div>
                      <div className="text-xs text-zinc-400">Score IA</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{lead.probabilidade}%</div>
                      <div className="text-xs text-zinc-400">Conversão</div>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Atribuir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights IA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-purple-950 border-purple-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-400" />
                Insight IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-300 text-sm">
                Leads do Google Ads têm 23% mais taxa de conversão. Considere aumentar investimento.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                Recomendação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-300 text-sm">
                5 leads quentes sem consultor. Distribua imediatamente para aumentar conversão.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-orange-950 border-orange-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-orange-400" />
                Alerta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-300 text-sm">
                6 leads frios há mais de 7 dias. Execute campanha de reativação automatizada.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
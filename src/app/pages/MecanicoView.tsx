import { useState } from "react";
import { Wrench, Star, Trophy, TrendingUp, Clock, CheckCircle2, Circle, Target, Zap, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";

interface OSMecanico {
  id: string;
  cliente: string;
  veiculo: string;
  placa: string;
  servico: string;
  etapa: number;
  prioridade: "alta" | "media" | "baixa";
  tempoEstimado: string;
  xp: number;
}

interface Agendamento {
  id: string;
  hora: string;
  cliente: string;
  veiculo: string;
  servico: string;
  status: "confirmado" | "em_atendimento" | "concluido";
}

const etapas = [
  { numero: 1, nome: "Recebido", icon: Circle, cor: "text-zinc-500" },
  { numero: 2, nome: "Diagnóstico", icon: Wrench, cor: "text-blue-500" },
  { numero: 3, nome: "Aprovado", icon: CheckCircle2, cor: "text-green-500" },
  { numero: 4, nome: "Em Execução", icon: Zap, cor: "text-orange-500" },
  { numero: 5, nome: "Revisão", icon: Target, cor: "text-purple-500" },
  { numero: 6, nome: "Concluído", icon: Trophy, cor: "text-yellow-500" },
];

const niveis = [
  { nivel: 1, nome: "Iniciante", min: 0, max: 1000, cor: "from-zinc-600 to-zinc-500" },
  { nivel: 2, nome: "Aprendiz", min: 1000, max: 2500, cor: "from-green-600 to-green-500" },
  { nivel: 3, nome: "Profissional", min: 2500, max: 5000, cor: "from-blue-600 to-blue-500" },
  { nivel: 4, nome: "Especialista", min: 5000, max: 10000, cor: "from-purple-600 to-purple-500" },
  { nivel: 5, nome: "Mestre", min: 10000, max: Infinity, cor: "from-yellow-600 to-yellow-500" },
];

export default function MecanicoView() {
  const [mecanico] = useState({
    nome: "Carlos Silva",
    especialidade: "Motor",
    xpTotal: 3200,
    nivel: 3,
    osConcluidas: 47,
    osHoje: 3,
    metaDiaria: 5,
    estrelas: 4.8,
  });

  const [osAtivas, setOsAtivas] = useState<OSMecanico[]>([
    {
      id: "OS001",
      cliente: "João Silva",
      veiculo: "Honda Civic 2020",
      placa: "ABC-1234",
      servico: "Troca de Motor",
      etapa: 4,
      prioridade: "alta",
      tempoEstimado: "4h",
      xp: 250,
    },
    {
      id: "OS015",
      cliente: "Maria Santos",
      veiculo: "Toyota Corolla 2019",
      placa: "DEF-5678",
      servico: "Revisão Completa",
      etapa: 2,
      prioridade: "media",
      tempoEstimado: "2h",
      xp: 150,
    },
    {
      id: "OS023",
      cliente: "Pedro Costa",
      veiculo: "Ford Ka 2018",
      placa: "GHI-9012",
      servico: "Troca de Óleo",
      etapa: 3,
      prioridade: "baixa",
      tempoEstimado: "1h",
      xp: 80,
    },
  ]);

  const [agendamentos] = useState<Agendamento[]>([
    {
      id: "A001",
      hora: "09:00",
      cliente: "Lucas Ferreira",
      veiculo: "Fiat Uno 2017",
      servico: "Alinhamento",
      status: "concluido",
    },
    {
      id: "A002",
      hora: "14:00",
      cliente: "Juliana Lima",
      veiculo: "Chevrolet Onix 2020",
      servico: "Balanceamento",
      status: "confirmado",
    },
    {
      id: "A003",
      hora: "16:00",
      cliente: "Rafael Souza",
      veiculo: "Hyundai HB20 2019",
      servico: "Revisão 20k",
      status: "confirmado",
    },
  ]);

  const nivelAtual = niveis.find(n => mecanico.xpTotal >= n.min && mecanico.xpTotal < n.max) || niveis[0];
  const proximoNivel = niveis.find(n => n.min > mecanico.xpTotal) || niveis[niveis.length - 1];
  const progressoNivel = ((mecanico.xpTotal - nivelAtual.min) / (proximoNivel.min - nivelAtual.min)) * 100;

  const handleAvancarEtapa = (osId: string) => {
    setOsAtivas(osAtivas.map(os => {
      if (os.id === osId && os.etapa < 6) {
        const novaEtapa = os.etapa + 1;
        toast.success(`OS ${osId} avançada para: ${etapas[novaEtapa - 1].nome}`);
        if (novaEtapa === 6) {
          toast.success(`🎉 +${os.xp} XP! OS Concluída!`, { duration: 3000 });
        }
        return { ...os, etapa: novaEtapa };
      }
      return os;
    }));
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "border-l-red-500";
      case "media": return "border-l-yellow-500";
      case "baixa": return "border-l-green-500";
      default: return "border-l-zinc-500";
    }
  };

  const getStatusAgendamento = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "em_atendimento": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "concluido": return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Header Gamificado */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/50">
                {mecanico.nome.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{mecanico.nome}</h1>
                <p className="text-white/80 text-lg">{mecanico.especialidade}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${nivelAtual.cor} text-white font-bold text-xl mb-2`}>
                Nível {nivelAtual.nivel} - {nivelAtual.nome}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{mecanico.estrelas}</span>
              </div>
            </div>
          </div>

          {/* Barra de XP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>XP: {mecanico.xpTotal} / {proximoNivel.min}</span>
              <span>Próximo nível: {proximoNivel.nome}</span>
            </div>
            <Progress value={progressoNivel} className="h-4 bg-white/20" />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* KPIs Diários */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                OS Concluídas
              </CardDescription>
              <CardTitle className="text-3xl text-white">{mecanico.osConcluidas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Meta Hoje
              </CardDescription>
              <CardTitle className="text-3xl text-white">
                {mecanico.osHoje}/{mecanico.metaDiaria}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-purple-950 border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-300 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                XP Total
              </CardDescription>
              <CardTitle className="text-3xl text-white">{mecanico.xpTotal}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-yellow-950 border-yellow-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-yellow-300 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Nível
              </CardDescription>
              <CardTitle className="text-3xl text-white">{nivelAtual.nivel}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Progresso Diário */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progresso Diário
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Complete {mecanico.metaDiaria} OS para bater a meta de hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>{mecanico.osHoje} de {mecanico.metaDiaria} OS concluídas</span>
                <span>{Math.round((mecanico.osHoje / mecanico.metaDiaria) * 100)}%</span>
              </div>
              <Progress value={(mecanico.osHoje / mecanico.metaDiaria) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs: Minhas OS e Agenda */}
        <Tabs defaultValue="os" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="os" className="data-[state=active]:bg-red-600">
              <Wrench className="h-4 w-4 mr-2" />
              Minhas OS ({osAtivas.length})
            </TabsTrigger>
            <TabsTrigger value="agenda" className="data-[state=active]:bg-red-600">
              <Calendar className="h-4 w-4 mr-2" />
              Agenda ({agendamentos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="os" className="space-y-4">
            {osAtivas.map((os) => (
              <Card key={os.id} className={`bg-zinc-900 border-l-4 ${getPrioridadeColor(os.prioridade)}`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header da OS */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{os.id}</h3>
                        <p className="text-zinc-400">{os.cliente} • {os.veiculo}</p>
                        <p className="text-zinc-500 text-sm">{os.placa}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-purple-600 mb-2">+{os.xp} XP</Badge>
                        <p className="text-sm text-zinc-400">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {os.tempoEstimado}
                        </p>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 p-3 rounded">
                      <p className="text-white font-semibold mb-2">{os.servico}</p>
                    </div>

                    {/* Trilha de Etapas */}
                    <div>
                      <p className="text-sm text-zinc-400 mb-3">Progresso da OS:</p>
                      <div className="flex items-center gap-2">
                        {etapas.map((etapa, index) => {
                          const Icone = etapa.icon;
                          const concluida = os.etapa > etapa.numero;
                          const atual = os.etapa === etapa.numero;
                          
                          return (
                            <div key={etapa.numero} className="flex-1">
                              <div className="flex flex-col items-center gap-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                  concluida ? "bg-green-600 border-green-500" :
                                  atual ? `bg-gradient-to-br ${nivelAtual.cor} border-white animate-pulse` :
                                  "bg-zinc-800 border-zinc-700"
                                }`}>
                                  <Icone className={`h-5 w-5 ${
                                    concluida ? "text-white" :
                                    atual ? "text-white" :
                                    "text-zinc-600"
                                  }`} />
                                </div>
                                <span className={`text-xs ${
                                  concluida ? "text-green-400" :
                                  atual ? "text-white font-bold" :
                                  "text-zinc-600"
                                }`}>
                                  {etapa.nome}
                                </span>
                              </div>
                              {index < etapas.length - 1 && (
                                <div className={`h-0.5 mt-5 -mx-2 ${
                                  concluida ? "bg-green-600" : "bg-zinc-800"
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ações */}
                    {os.etapa < 6 && (
                      <Button 
                        onClick={() => handleAvancarEtapa(os.id)}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold"
                      >
                        Avançar para: {etapas[os.etapa].nome}
                      </Button>
                    )}
                    {os.etapa === 6 && (
                      <div className="text-center p-4 bg-green-600/20 border border-green-600/50 rounded">
                        <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-green-400 font-bold">OS Concluída! 🎉</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="agenda" className="space-y-4">
            {agendamentos.map((agendamento) => (
              <Card key={agendamento.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-white">{agendamento.hora}</span>
                        <Badge className={getStatusAgendamento(agendamento.status)}>
                          {agendamento.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-1">{agendamento.cliente}</h4>
                      <p className="text-zinc-400">{agendamento.veiculo}</p>
                      <p className="text-zinc-500 text-sm mt-2">{agendamento.servico}</p>
                    </div>
                    {agendamento.status === "confirmado" && (
                      <Button className="bg-green-600 hover:bg-green-700">
                        Iniciar Atendimento
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

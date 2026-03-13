import { useState } from "react";
import { Calendar, Users, Wrench, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router";

interface OSPatio {
  id: string;
  cliente: string;
  veiculo: string;
  placa: string;
  status: string;
  mecanico?: string;
  prioridade: "alta" | "media" | "baixa";
  diasPatio: number;
}

interface Agendamento {
  id: string;
  hora: string;
  cliente: string;
  veiculo: string;
  servico: string;
  mecanico?: string;
}

interface Mecanico {
  id: string;
  nome: string;
  especialidade: string;
  osAtual?: string;
  disponivel: boolean;
}

export default function AdminOperacional() {
  const navigate = useNavigate();

  const [osPatio] = useState<OSPatio[]>([
    { id: "OS001", cliente: "João Silva", veiculo: "Honda Civic 2020", placa: "ABC-1234", status: "Diagnóstico", mecanico: "Carlos", prioridade: "alta", diasPatio: 3 },
    { id: "OS002", cliente: "Maria Santos", veiculo: "Toyota Corolla 2019", placa: "DEF-5678", status: "Aguardando Peças", prioridade: "media", diasPatio: 5 },
    { id: "OS003", cliente: "Pedro Costa", veiculo: "Ford Ka 2018", placa: "GHI-9012", status: "Em Execução", mecanico: "Roberto", prioridade: "alta", diasPatio: 1 },
    { id: "OS004", cliente: "Ana Oliveira", veiculo: "VW Gol 2021", placa: "JKL-3456", status: "Diagnóstico", prioridade: "baixa", diasPatio: 2 },
  ]);

  const [agendamentos] = useState<Agendamento[]>([
    { id: "A001", hora: "09:00", cliente: "Lucas Ferreira", veiculo: "Fiat Uno 2017", servico: "Revisão 10k", mecanico: "Carlos" },
    { id: "A002", hora: "10:30", cliente: "Juliana Lima", veiculo: "Chevrolet Onix 2020", servico: "Troca de Óleo" },
    { id: "A003", hora: "14:00", cliente: "Rafael Souza", veiculo: "Hyundai HB20 2019", servico: "Alinhamento", mecanico: "Roberto" },
    { id: "A004", hora: "16:00", cliente: "Camila Costa", veiculo: "Renault Kwid 2021", servico: "Revisão Completa" },
  ]);

  const [mecanicos] = useState<Mecanico[]>([
    { id: "M001", nome: "Carlos Silva", especialidade: "Motor", osAtual: "OS001", disponivel: false },
    { id: "M002", nome: "Roberto Santos", especialidade: "Suspensão", osAtual: "OS003", disponivel: false },
    { id: "M003", nome: "Fernando Lima", especialidade: "Elétrica", disponivel: true },
    { id: "M004", nome: "André Costa", especialidade: "Freios", disponivel: true },
  ]);

  const stats = {
    osPatio: osPatio.length,
    osAtrasadas: osPatio.filter(os => os.diasPatio > 2).length,
    agendamentosHoje: agendamentos.length,
    mecanicosDisponiveis: mecanicos.filter(m => m.disponivel).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diagnóstico": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Em Execução": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Aguardando Peças": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "border-l-red-500";
      case "media": return "border-l-yellow-500";
      case "baixa": return "border-l-green-500";
      default: return "border-l-zinc-500";
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Wrench className="h-8 w-8 text-red-500" />
              Visão Operacional
            </h1>
            <p className="text-zinc-400 mt-1">
              Pátio, agenda e equipe em tempo real
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/patio")}>
              Ver Pátio Completo
            </Button>
            <Button variant="outline" onClick={() => navigate("/agendamentos")}>
              Ver Agenda
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                OS no Pátio
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.osPatio}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-red-950 border-red-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                OS Atrasadas
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.osAtrasadas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agendamentos Hoje
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.agendamentosHoje}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Mecânicos Disponíveis
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.mecanicosDisponiveis}/{mecanicos.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pátio Ativo */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Pátio Ativo ({osPatio.length} OS)
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Ordens de serviço em andamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {osPatio.map((os) => (
                <div
                  key={os.id}
                  className={`p-4 bg-zinc-800/50 rounded-lg border-l-4 ${getPrioridadeColor(os.prioridade)} hover:bg-zinc-800 cursor-pointer transition-colors`}
                  onClick={() => navigate(`/ordens-servico/${os.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-white font-semibold">{os.id}</span>
                      <span className="text-zinc-400 ml-2">• {os.cliente}</span>
                    </div>
                    <Badge className={getStatusColor(os.status)}>
                      {os.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-zinc-400 space-y-1">
                    <div>{os.veiculo} • {os.placa}</div>
                    <div className="flex items-center gap-4">
                      {os.mecanico && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {os.mecanico}
                        </span>
                      )}
                      <span className={`flex items-center gap-1 ${os.diasPatio > 2 ? "text-red-400" : ""}`}>
                        <Clock className="h-3 w-3" />
                        {os.diasPatio} dia{os.diasPatio !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Agenda do Dia */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda do Dia ({agendamentos.length})
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Agendamentos confirmados para hoje
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {agendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
                  onClick={() => navigate("/agendamentos")}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-white font-semibold text-lg">{agendamento.hora}</span>
                      <span className="text-zinc-400 ml-2">• {agendamento.cliente}</span>
                    </div>
                    {agendamento.mecanico && (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        {agendamento.mecanico}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400 space-y-1">
                    <div>{agendamento.veiculo}</div>
                    <div className="text-zinc-500">{agendamento.servico}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Equipe */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equipe ({mecanicos.length} mecânicos)
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Status da equipe em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mecanicos.map((mecanico) => (
                <div
                  key={mecanico.id}
                  className={`p-4 rounded-lg border-2 ${
                    mecanico.disponivel 
                      ? "bg-green-500/10 border-green-500/20" 
                      : "bg-zinc-800/50 border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{mecanico.nome}</h4>
                    <Badge className={mecanico.disponivel ? "bg-green-600" : "bg-red-600"}>
                      {mecanico.disponivel ? "Disponível" : "Ocupado"}
                    </Badge>
                  </div>
                  <div className="text-sm text-zinc-400 space-y-1">
                    <div>{mecanico.especialidade}</div>
                    {mecanico.osAtual && (
                      <div className="text-blue-400 font-medium">
                        Trabalhando em {mecanico.osAtual}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

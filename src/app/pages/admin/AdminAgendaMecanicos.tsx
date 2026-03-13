import { useState } from "react";
import { Users, Calendar, Clock, Wrench, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import AdminLayout from "../../components/AdminLayout";

interface AtividadeMecanico {
  id: string;
  tipo: "os" | "agendamento";
  titulo: string;
  cliente: string;
  horaInicio: string;
  horaFim?: string;
  status: "em_andamento" | "aguardando" | "concluido";
  prioridade: "alta" | "media" | "baixa";
}

interface Mecanico {
  id: string;
  nome: string;
  especialidade: string;
  foto?: string;
  atividades: AtividadeMecanico[];
  horasOcupadas: number;
  horasDisponiveis: number;
}

export default function AdminAgendaMecanicos() {
  const [selectedData, setSelectedData] = useState("hoje");
  
  const [mecanicos] = useState<Mecanico[]>([
    {
      id: "M001",
      nome: "Carlos Silva",
      especialidade: "Motor",
      horasOcupadas: 6,
      horasDisponiveis: 2,
      atividades: [
        {
          id: "OS001",
          tipo: "os",
          titulo: "OS001 - Troca de Motor",
          cliente: "João Silva",
          horaInicio: "08:00",
          horaFim: "12:00",
          status: "em_andamento",
          prioridade: "alta",
        },
        {
          id: "A001",
          tipo: "agendamento",
          titulo: "Revisão 10k",
          cliente: "Lucas Ferreira",
          horaInicio: "14:00",
          horaFim: "16:00",
          status: "aguardando",
          prioridade: "media",
        },
      ],
    },
    {
      id: "M002",
      nome: "Roberto Santos",
      especialidade: "Suspensão",
      horasOcupadas: 4,
      horasDisponiveis: 4,
      atividades: [
        {
          id: "OS003",
          tipo: "os",
          titulo: "OS003 - Alinhamento",
          cliente: "Pedro Costa",
          horaInicio: "09:00",
          horaFim: "11:00",
          status: "em_andamento",
          prioridade: "media",
        },
        {
          id: "A003",
          tipo: "agendamento",
          titulo: "Troca de Amortecedores",
          cliente: "Rafael Souza",
          horaInicio: "15:00",
          horaFim: "17:00",
          status: "aguardando",
          prioridade: "alta",
        },
      ],
    },
    {
      id: "M003",
      nome: "Fernando Lima",
      especialidade: "Elétrica",
      horasOcupadas: 0,
      horasDisponiveis: 8,
      atividades: [],
    },
    {
      id: "M004",
      nome: "André Costa",
      especialidade: "Freios",
      horasOcupadas: 3,
      horasDisponiveis: 5,
      atividades: [
        {
          id: "OS007",
          tipo: "os",
          titulo: "OS007 - Troca de Pastilhas",
          cliente: "Camila Costa",
          horaInicio: "10:00",
          horaFim: "13:00",
          status: "concluido",
          prioridade: "baixa",
        },
      ],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_andamento": return "bg-blue-500";
      case "aguardando": return "bg-yellow-500";
      case "concluido": return "bg-green-500";
      default: return "bg-zinc-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "em_andamento": return "Em Andamento";
      case "aguardando": return "Aguardando";
      case "concluido": return "Concluído";
      default: return status;
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

  const getTipoIcon = (tipo: string) => {
    return tipo === "os" ? <Wrench className="h-4 w-4" /> : <Calendar className="h-4 w-4" />;
  };

  const stats = {
    totalMecanicos: mecanicos.length,
    ocupados: mecanicos.filter(m => m.horasOcupadas > 0).length,
    disponiveis: mecanicos.filter(m => m.horasOcupadas === 0).length,
    horasTotaisOcupadas: mecanicos.reduce((sum, m) => sum + m.horasOcupadas, 0),
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Users className="h-8 w-8 text-red-500" />
              Agenda de Mecânicos
            </h1>
            <p className="text-zinc-400 mt-1">
              Visualização da agenda e disponibilidade da equipe
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedData} onValueChange={setSelectedData}>
              <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="amanha">Amanhã</SelectItem>
                <SelectItem value="semana">Esta Semana</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Atualizar</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total Mecânicos</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.totalMecanicos}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300">Ocupados</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.ocupados}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300">Disponíveis</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.disponiveis}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-purple-950 border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-300">Horas Ocupadas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.horasTotaisOcupadas}h</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Grid de Mecânicos */}
        <div className="space-y-6">
          {mecanicos.map((mecanico) => (
            <Card key={mecanico.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                      {mecanico.nome.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <CardTitle className="text-white">{mecanico.nome}</CardTitle>
                      <CardDescription className="text-zinc-400">
                        {mecanico.especialidade}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">Ocupado</div>
                      <div className="text-lg font-semibold text-white">
                        {mecanico.horasOcupadas}h / 8h
                      </div>
                    </div>
                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${(mecanico.horasOcupadas / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {mecanico.atividades.length > 0 ? (
                  <div className="space-y-3">
                    {mecanico.atividades.map((atividade) => (
                      <div
                        key={atividade.id}
                        className={`p-4 bg-zinc-800/50 rounded-lg border-l-4 ${getPrioridadeColor(atividade.prioridade)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTipoIcon(atividade.tipo)}
                            <span className="font-semibold text-white">{atividade.titulo}</span>
                          </div>
                          <Badge className={getStatusColor(atividade.status)}>
                            {getStatusLabel(atividade.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {atividade.cliente}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {atividade.horaInicio}
                            {atividade.horaFim && ` - ${atividade.horaFim}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-12 w-12 text-zinc-600 mb-2" />
                    <p className="text-zinc-400">Sem atividades agendadas</p>
                    <p className="text-zinc-500 text-sm">Este mecânico está disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Wrench, Package, FileX, User, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router";

type TipoPendencia = "atrasada" | "sem_mecanico" | "aguardando_pecas" | "sem_orcamento";

interface Pendencia {
  id: string;
  osId: string;
  tipo: TipoPendencia;
  descricao: string;
  cliente: string;
  veiculo: string;
  placa: string;
  diasPendente: number;
  prioridade: "alta" | "media" | "baixa";
  valor?: number;
}

export default function AdminPendencias() {
  const navigate = useNavigate();
  const [pendencias, setPendencias] = useState<Pendencia[]>([
    {
      id: "P001",
      osId: "OS001",
      tipo: "atrasada",
      descricao: "OS atrasada há 3 dias - prazo de entrega vencido",
      cliente: "João Silva",
      veiculo: "Honda Civic 2020",
      placa: "ABC-1234",
      diasPendente: 3,
      prioridade: "alta",
      valor: 2500,
    },
    {
      id: "P002",
      osId: "OS005",
      tipo: "sem_mecanico",
      descricao: "OS aguardando atribuição de mecânico",
      cliente: "Maria Santos",
      veiculo: "Toyota Corolla 2019",
      placa: "DEF-5678",
      diasPendente: 1,
      prioridade: "alta",
    },
    {
      id: "P003",
      osId: "OS008",
      tipo: "aguardando_pecas",
      descricao: "Aguardando chegada de peças - previsão 2 dias",
      cliente: "Pedro Costa",
      veiculo: "Ford Ka 2018",
      placa: "GHI-9012",
      diasPendente: 5,
      prioridade: "media",
      valor: 1200,
    },
    {
      id: "P004",
      osId: "OS012",
      tipo: "sem_orcamento",
      descricao: "Orçamento pendente de aprovação do cliente",
      cliente: "Ana Oliveira",
      veiculo: "Volkswagen Gol 2021",
      placa: "JKL-3456",
      diasPendente: 2,
      prioridade: "media",
      valor: 3200,
    },
    {
      id: "P005",
      osId: "OS015",
      tipo: "atrasada",
      descricao: "OS crítica - cliente reclamando",
      cliente: "Carlos Souza",
      veiculo: "Chevrolet Onix 2022",
      placa: "MNO-7890",
      diasPendente: 7,
      prioridade: "alta",
      valor: 4500,
    },
  ]);

  const [filtroTipo, setFiltroTipo] = useState<TipoPendencia | "todas">("todas");

  const pendenciasFiltradas = filtroTipo === "todas" 
    ? pendencias 
    : pendencias.filter(p => p.tipo === filtroTipo);

  const getPendenciaIcon = (tipo: TipoPendencia) => {
    switch (tipo) {
      case "atrasada": return <Clock className="h-5 w-5" />;
      case "sem_mecanico": return <User className="h-5 w-5" />;
      case "aguardando_pecas": return <Package className="h-5 w-5" />;
      case "sem_orcamento": return <FileX className="h-5 w-5" />;
    }
  };

  const getPendenciaLabel = (tipo: TipoPendencia) => {
    switch (tipo) {
      case "atrasada": return "Atrasada";
      case "sem_mecanico": return "Sem Mecânico";
      case "aguardando_pecas": return "Aguardando Peças";
      case "sem_orcamento": return "Sem Orçamento";
    }
  };

  const getPendenciaColor = (tipo: TipoPendencia) => {
    switch (tipo) {
      case "atrasada": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "sem_mecanico": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "aguardando_pecas": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "sem_orcamento": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-600 text-white";
      case "media": return "bg-yellow-600 text-white";
      case "baixa": return "bg-green-600 text-white";
      default: return "bg-zinc-600 text-white";
    }
  };

  const handleResolver = (pendenciaId: string, osId: string) => {
    toast.success("Redirecionando para OS...");
    navigate(`/ordens-servico/${osId}`);
  };

  const stats = {
    total: pendencias.length,
    atrasadas: pendencias.filter(p => p.tipo === "atrasada").length,
    semMecanico: pendencias.filter(p => p.tipo === "sem_mecanico").length,
    aguardandoPecas: pendencias.filter(p => p.tipo === "aguardando_pecas").length,
    semOrcamento: pendencias.filter(p => p.tipo === "sem_orcamento").length,
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              Pendências Críticas
            </h1>
            <p className="text-zinc-400 mt-1">
              OS que requerem atenção imediata
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Atualizar
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-red-950 border-red-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-300">Atrasadas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.atrasadas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-orange-950 border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-300">Sem Mecânico</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.semMecanico}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300">Aguard. Peças</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.aguardandoPecas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-yellow-950 border-yellow-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-yellow-300">Sem Orçamento</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.semOrcamento}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filtroTipo === "todas" ? "default" : "outline"}
            onClick={() => setFiltroTipo("todas")}
            className={filtroTipo === "todas" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Todas ({stats.total})
          </Button>
          <Button
            variant={filtroTipo === "atrasada" ? "default" : "outline"}
            onClick={() => setFiltroTipo("atrasada")}
            className={filtroTipo === "atrasada" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Clock className="h-4 w-4 mr-2" />
            Atrasadas ({stats.atrasadas})
          </Button>
          <Button
            variant={filtroTipo === "sem_mecanico" ? "default" : "outline"}
            onClick={() => setFiltroTipo("sem_mecanico")}
            className={filtroTipo === "sem_mecanico" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <User className="h-4 w-4 mr-2" />
            Sem Mecânico ({stats.semMecanico})
          </Button>
          <Button
            variant={filtroTipo === "aguardando_pecas" ? "default" : "outline"}
            onClick={() => setFiltroTipo("aguardando_pecas")}
            className={filtroTipo === "aguardando_pecas" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Package className="h-4 w-4 mr-2" />
            Aguardando Peças ({stats.aguardandoPecas})
          </Button>
          <Button
            variant={filtroTipo === "sem_orcamento" ? "default" : "outline"}
            onClick={() => setFiltroTipo("sem_orcamento")}
            className={filtroTipo === "sem_orcamento" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <FileX className="h-4 w-4 mr-2" />
            Sem Orçamento ({stats.semOrcamento})
          </Button>
        </div>

        {/* Lista de Pendências */}
        <div className="space-y-4">
          {pendenciasFiltradas.map((pendencia) => (
            <Card 
              key={pendencia.id} 
              className={`bg-zinc-900 border-l-4 ${
                pendencia.prioridade === "alta" ? "border-l-red-500" : 
                pendencia.prioridade === "media" ? "border-l-yellow-500" : 
                "border-l-green-500"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getPendenciaColor(pendencia.tipo)}>
                        {getPendenciaIcon(pendencia.tipo)}
                        <span className="ml-2">{getPendenciaLabel(pendencia.tipo)}</span>
                      </Badge>
                      <Badge className={getPrioridadeColor(pendencia.prioridade)}>
                        {pendencia.prioridade.toUpperCase()}
                      </Badge>
                      <span className="text-zinc-400 text-sm">
                        {pendencia.diasPendente} dia{pendencia.diasPendente !== 1 ? "s" : ""} pendente
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      OS {pendencia.osId} - {pendencia.cliente}
                    </h3>

                    <p className="text-zinc-300 mb-3">{pendencia.descricao}</p>

                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                      <span>Veículo: {pendencia.veiculo}</span>
                      <span>Placa: {pendencia.placa}</span>
                      {pendencia.valor && (
                        <span className="text-green-500 font-semibold">
                          {pendencia.valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleResolver(pendencia.id, pendencia.osId)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Resolver
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pendenciasFiltradas.length === 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <AlertTriangle className="h-16 w-16 text-zinc-600" />
                <h3 className="text-xl font-semibold text-zinc-400">
                  Nenhuma pendência encontrada
                </h3>
                <p className="text-zinc-500">
                  Tudo certo! Não há pendências críticas no momento.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

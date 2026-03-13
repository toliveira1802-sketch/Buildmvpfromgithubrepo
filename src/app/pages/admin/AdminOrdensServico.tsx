import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Filter,
  Calendar,
  Car,
  User,
  DollarSign,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import AdminLayout from "../../components/AdminLayout";

interface OrdemServico {
  id: string;
  cliente: string;
  veiculo: string;
  placa: string;
  dataAbertura: string;
  dataPrevisao: string;
  status: "Aguardando" | "Em Andamento" | "Concluído" | "Cancelado";
  servicos: string[];
  valorTotal: number;
  responsavel: string;
}

export default function AdminOrdensServico() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isLoading, setIsLoading] = useState(false);

  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([
    {
      id: "OS-123",
      cliente: "Carlos Silva",
      veiculo: "Honda Civic 2020",
      placa: "ABC-1234",
      dataAbertura: "2026-03-10",
      dataPrevisao: "2026-03-12",
      status: "Concluído",
      servicos: ["Revisão Completa", "Troca de Óleo", "Filtros"],
      valorTotal: 850.0,
      responsavel: "João Mecânico",
    },
    {
      id: "OS-124",
      cliente: "Maria Santos",
      veiculo: "Toyota Corolla 2021",
      placa: "XYZ-5678",
      dataAbertura: "2026-03-13",
      dataPrevisao: "2026-03-14",
      status: "Em Andamento",
      servicos: ["Troca de Pneus", "Alinhamento"],
      valorTotal: 1200.0,
      responsavel: "Pedro Consultor",
    },
    {
      id: "OS-125",
      cliente: "João Oliveira",
      veiculo: "Ford Focus 2019",
      placa: "DEF-9012",
      dataAbertura: "2026-03-13",
      dataPrevisao: "2026-03-15",
      status: "Aguardando",
      servicos: ["Diagnóstico Eletrônico"],
      valorTotal: 350.0,
      responsavel: "Ana Consultora",
    },
    {
      id: "OS-126",
      cliente: "Ana Costa",
      veiculo: "Volkswagen Gol 2018",
      placa: "GHI-3456",
      dataAbertura: "2026-03-12",
      dataPrevisao: "2026-03-13",
      status: "Cancelado",
      servicos: ["Troca de Bateria"],
      valorTotal: 0,
      responsavel: "—",
    },
    {
      id: "OS-127",
      cliente: "Pedro Almeida",
      veiculo: "Chevrolet Onix 2022",
      placa: "JKL-7890",
      dataAbertura: "2026-03-13",
      dataPrevisao: "2026-03-14",
      status: "Em Andamento",
      servicos: ["Revisão dos 10.000 km", "Troca de Óleo"],
      valorTotal: 450.0,
      responsavel: "João Mecânico",
    },
  ]);

  const filteredOS = ordensServico.filter((os) => {
    const matchesSearch =
      os.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.placa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || os.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      "Aguardando": "bg-yellow-500",
      "Em Andamento": "bg-blue-500",
      "Concluído": "bg-green-500",
      "Cancelado": "bg-red-500",
    };
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>;
  };

  const stats = {
    total: ordensServico.length,
    aguardando: ordensServico.filter((os) => os.status === "Aguardando").length,
    emAndamento: ordensServico.filter((os) => os.status === "Em Andamento").length,
    concluidas: ordensServico.filter((os) => os.status === "Concluído").length,
    receitaTotal: ordensServico
      .filter((os) => os.status === "Concluído")
      .reduce((sum, os) => sum + os.valorTotal, 0),
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Ordens de Serviço</h1>
            <p className="text-zinc-400 mt-1">
              Gerencie todas as ordens de serviço
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsLoading(!isLoading)}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button
              onClick={() => navigate("/ordens-servico/nova")}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova OS
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Aguardando</CardDescription>
              <CardTitle className="text-3xl text-yellow-500">{stats.aguardando}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Em Andamento</CardDescription>
              <CardTitle className="text-3xl text-blue-500">{stats.emAndamento}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Concluídas</CardDescription>
              <CardTitle className="text-3xl text-green-500">{stats.concluidas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Receita</CardDescription>
              <CardTitle className="text-2xl text-white">
                {stats.receitaTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 0,
                })}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar por OS, cliente ou placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Aguardando">Aguardando</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Lista de OS */}
        <Card className="bg-zinc-900 border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800">
                <tr className="text-left">
                  <th className="p-4 font-medium text-zinc-300">OS</th>
                  <th className="p-4 font-medium text-zinc-300">Cliente</th>
                  <th className="p-4 font-medium text-zinc-300">Veículo</th>
                  <th className="p-4 font-medium text-zinc-300">Abertura</th>
                  <th className="p-4 font-medium text-zinc-300">Previsão</th>
                  <th className="p-4 font-medium text-zinc-300">Serviços</th>
                  <th className="p-4 font-medium text-zinc-300">Valor</th>
                  <th className="p-4 font-medium text-zinc-300">Status</th>
                  <th className="p-4 font-medium text-zinc-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOS.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-zinc-500">
                      Nenhuma ordem de serviço encontrada
                    </td>
                  </tr>
                ) : (
                  filteredOS.map((os) => (
                    <tr
                      key={os.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50"
                    >
                      <td className="p-4 font-semibold text-blue-500">{os.id}</td>
                      <td className="p-4">
                        <div>
                          <p className="text-white">{os.cliente}</p>
                          <p className="text-sm text-zinc-400">{os.responsavel}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white">{os.veiculo}</p>
                          <p className="text-sm text-zinc-400">{os.placa}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-300">
                        {new Date(os.dataAbertura).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-4 text-sm text-zinc-300">
                        {new Date(os.dataPrevisao).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {os.servicos.slice(0, 2).map((servico, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-zinc-700"
                            >
                              {servico}
                            </Badge>
                          ))}
                          {os.servicos.length > 2 && (
                            <Badge variant="outline" className="text-xs border-zinc-700">
                              +{os.servicos.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-green-500">
                        {os.valorTotal > 0
                          ? os.valorTotal.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "—"}
                      </td>
                      <td className="p-4">{getStatusBadge(os.status)}</td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/ordens-servico/${os.id}`)}
                          className="hover:bg-zinc-800"
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

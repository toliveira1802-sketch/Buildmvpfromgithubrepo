import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Calendar,
  Clock,
  User,
  Car,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface Agendamento {
  id: string;
  cliente: string;
  telefone: string;
  email: string;
  veiculo: string;
  placa: string;
  data: string;
  horario: string;
  servico: string;
  status: "Pendente" | "Confirmado" | "Cancelado" | "Concluído";
  observacoes?: string;
}

export default function AdminAgendamentos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    cliente: "",
    telefone: "",
    email: "",
    veiculo: "",
    placa: "",
    data: "",
    horario: "",
    servico: "",
    observacoes: "",
  });

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    {
      id: "AGD-001",
      cliente: "Carlos Silva",
      telefone: "(11) 98765-4321",
      email: "carlos@email.com",
      veiculo: "Honda Civic 2020",
      placa: "ABC-1234",
      data: "2026-03-15",
      horario: "09:00",
      servico: "Revisão Completa",
      status: "Confirmado",
    },
    {
      id: "AGD-002",
      cliente: "Maria Santos",
      telefone: "(11) 91234-5678",
      email: "maria@email.com",
      veiculo: "Toyota Corolla 2021",
      placa: "XYZ-5678",
      data: "2026-03-15",
      horario: "10:30",
      servico: "Troca de Óleo",
      status: "Pendente",
    },
    {
      id: "AGD-003",
      cliente: "João Oliveira",
      telefone: "(11) 99876-5432",
      email: "joao@email.com",
      veiculo: "Ford Focus 2019",
      placa: "DEF-9012",
      data: "2026-03-16",
      horario: "14:00",
      servico: "Alinhamento e Balanceamento",
      status: "Confirmado",
    },
    {
      id: "AGD-004",
      cliente: "Ana Costa",
      telefone: "(11) 97654-3210",
      email: "ana@email.com",
      veiculo: "Volkswagen Gol 2018",
      placa: "GHI-3456",
      data: "2026-03-16",
      horario: "16:00",
      servico: "Diagnóstico Eletrônico",
      status: "Cancelado",
    },
  ]);

  const filteredAgendamentos = agendamentos.filter((agd) => {
    const matchesSearch =
      agd.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agd.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agd.veiculo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || agd.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAgendamento = () => {
    const newAgendamento: Agendamento = {
      id: `AGD-${String(agendamentos.length + 1).padStart(3, "0")}`,
      cliente: formData.cliente,
      telefone: formData.telefone,
      email: formData.email,
      veiculo: formData.veiculo,
      placa: formData.placa,
      data: formData.data,
      horario: formData.horario,
      servico: formData.servico,
      status: "Pendente",
      observacoes: formData.observacoes,
    };

    setAgendamentos([...agendamentos, newAgendamento]);
    toast.success("Agendamento criado com sucesso!");
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      cliente: "",
      telefone: "",
      email: "",
      veiculo: "",
      placa: "",
      data: "",
      horario: "",
      servico: "",
      observacoes: "",
    });
  };

  const handleStatusChange = (id: string, newStatus: Agendamento["status"]) => {
    setAgendamentos(
      agendamentos.map((agd) =>
        agd.id === id ? { ...agd, status: newStatus } : agd
      )
    );
    toast.success("Status atualizado!");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pendente: "bg-yellow-500",
      Confirmado: "bg-green-500",
      Cancelado: "bg-red-500",
      Concluído: "bg-blue-500",
    };
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>;
  };

  const stats = {
    total: agendamentos.length,
    pendentes: agendamentos.filter((a) => a.status === "Pendente").length,
    confirmados: agendamentos.filter((a) => a.status === "Confirmado").length,
    hoje: agendamentos.filter(
      (a) => a.data === new Date().toISOString().split("T")[0]
    ).length,
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
            <p className="text-zinc-400 mt-1">
              Gerencie os agendamentos de serviços
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsLoading(!isLoading)}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Pendentes</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.pendentes}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Confirmados</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.confirmados}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Hoje</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.hoje}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar por cliente, veículo ou placa..."
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
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Lista de Agendamentos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAgendamentos.map((agendamento) => (
            <Card key={agendamento.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{agendamento.cliente}</CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                      {agendamento.id}
                    </CardDescription>
                  </div>
                  {getStatusBadge(agendamento.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(agendamento.data).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="h-4 w-4" />
                    {agendamento.horario}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Car className="h-4 w-4" />
                    {agendamento.placa}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Phone className="h-4 w-4" />
                    {agendamento.telefone}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Veículo</p>
                  <p className="text-white">{agendamento.veiculo}</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Serviço</p>
                  <p className="text-white">{agendamento.servico}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  {agendamento.status === "Pendente" && (
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(agendamento.id, "Confirmado")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Confirmar
                    </Button>
                  )}
                  {agendamento.status !== "Cancelado" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-700 text-red-500 hover:bg-red-950"
                      onClick={() => handleStatusChange(agendamento.id, "Cancelado")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgendamentos.length === 0 && (
          <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">Nenhum agendamento encontrado</p>
          </Card>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Preencha os dados do agendamento
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-zinc-300">Cliente</Label>
              <Input
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                placeholder="Nome do cliente"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Telefone</Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Veículo</Label>
              <Input
                value={formData.veiculo}
                onChange={(e) => setFormData({ ...formData, veiculo: e.target.value })}
                placeholder="Marca Modelo Ano"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Placa</Label>
              <Input
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                placeholder="ABC-1234"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Data</Label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Horário</Label>
              <Input
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-zinc-300">Serviço</Label>
              <Input
                value={formData.servico}
                onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                placeholder="Tipo de serviço"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-zinc-300">Observações</Label>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações adicionais..."
                className="bg-zinc-800 border-zinc-700 text-white"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateAgendamento}
              disabled={!formData.cliente || !formData.data || !formData.horario}
              className="bg-red-600 hover:bg-red-700"
            >
              Criar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

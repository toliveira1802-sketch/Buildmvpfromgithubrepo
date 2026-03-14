import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Eye,
  Car,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Filter,
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
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  veiculos: number;
  ultimaVisita: string;
  totalGasto: number;
}

export default function AdminClientes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
  });

  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: "CLI-001",
      nome: "Carlos Silva",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      email: "carlos@email.com",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo - SP",
      veiculos: 2,
      ultimaVisita: "2026-03-10",
      totalGasto: 5420.00,
    },
    {
      id: "CLI-002",
      nome: "Maria Santos",
      cpf: "234.567.890-11",
      telefone: "(11) 91234-5678",
      email: "maria@email.com",
      endereco: "Av. Paulista, 1000",
      cidade: "São Paulo - SP",
      veiculos: 1,
      ultimaVisita: "2026-03-08",
      totalGasto: 2850.00,
    },
    {
      id: "CLI-003",
      nome: "João Oliveira",
      cpf: "345.678.901-22",
      telefone: "(11) 99876-5432",
      email: "joao@email.com",
      endereco: "Rua Augusta, 456",
      cidade: "São Paulo - SP",
      veiculos: 3,
      ultimaVisita: "2026-03-05",
      totalGasto: 8920.00,
    },
    {
      id: "CLI-004",
      nome: "Ana Costa",
      cpf: "456.789.012-33",
      telefone: "(11) 97654-3210",
      email: "ana@email.com",
      endereco: "Rua Consolação, 789",
      cidade: "São Paulo - SP",
      veiculos: 1,
      ultimaVisita: "2026-02-28",
      totalGasto: 1450.00,
    },
    {
      id: "CLI-005",
      nome: "Pedro Almeida",
      cpf: "567.890.123-44",
      telefone: "(11) 96543-2109",
      email: "pedro@email.com",
      endereco: "Av. Faria Lima, 2500",
      cidade: "São Paulo - SP",
      veiculos: 2,
      ultimaVisita: "2026-03-12",
      totalGasto: 6780.00,
    },
  ]);

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCliente = () => {
    const newCliente: Cliente = {
      id: `CLI-${String(clientes.length + 1).padStart(3, "0")}`,
      nome: formData.nome,
      cpf: formData.cpf,
      telefone: formData.telefone,
      email: formData.email,
      endereco: formData.endereco,
      cidade: formData.cidade,
      veiculos: 0,
      ultimaVisita: new Date().toISOString().split("T")[0],
      totalGasto: 0,
    };

    setClientes([...clientes, newCliente]);
    toast.success("Cliente cadastrado com sucesso!");
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCliente = () => {
    if (!editingCliente) return;

    setClientes(clientes.map(c => 
      c.id === editingCliente.id 
        ? { ...c, ...formData }
        : c
    ));
    
    toast.success("Cliente atualizado com sucesso!");
    setIsEditDialogOpen(false);
    setEditingCliente(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      endereco: "",
      cidade: "",
    });
  };

  const stats = {
    total: clientes.length,
    novos: clientes.filter(
      (c) =>
        new Date(c.ultimaVisita).getMonth() === new Date().getMonth()
    ).length,
    ativos: clientes.filter(
      (c) =>
        new Date(c.ultimaVisita) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    totalGasto: clientes.reduce((sum, c) => sum + c.totalGasto, 0),
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Clientes</h1>
            <p className="text-zinc-400 mt-1">
              Gerencie sua base de clientes
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
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total de Clientes</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Novos (Este Mês)</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.novos}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Clientes Ativos</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.ativos}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Receita Total</CardDescription>
              <CardTitle className="text-3xl text-white">
                {stats.totalGasto.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Buscar por nome, CPF, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </Card>

        {/* Lista de Clientes */}
        <Card className="bg-zinc-900 border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800">
                <tr className="text-left">
                  <th className="p-4 font-medium text-zinc-300">Cliente</th>
                  <th className="p-4 font-medium text-zinc-300">Contato</th>
                  <th className="p-4 font-medium text-zinc-300">Localização</th>
                  <th className="p-4 font-medium text-zinc-300">Veículos</th>
                  <th className="p-4 font-medium text-zinc-300">Última Visita</th>
                  <th className="p-4 font-medium text-zinc-300">Total Gasto</th>
                  <th className="p-4 font-medium text-zinc-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{cliente.nome}</p>
                          <p className="text-sm text-zinc-400">{cliente.cpf}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Phone className="h-3 w-3" />
                            {cliente.telefone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Mail className="h-3 w-3" />
                            {cliente.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-300">{cliente.endereco}</p>
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <MapPin className="h-3 w-3" />
                            {cliente.cidade}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-blue-500" />
                          <span className="text-white">{cliente.veiculos}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-300">
                        {new Date(cliente.ultimaVisita).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-4">
                        <span className="text-green-500 font-semibold">
                          {cliente.totalGasto.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/clientes/${cliente.id}`)}
                            className="hover:bg-zinc-800"
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-zinc-800"
                            onClick={() => handleEditCliente(cliente)}
                          >
                            <Edit2 className="h-4 w-4 text-green-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Cadastre um novo cliente no sistema
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-zinc-300">Nome Completo *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo do cliente"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">CPF *</Label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Telefone *</Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-zinc-300">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-zinc-300">Endereço</Label>
              <Input
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, número, bairro"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-zinc-300">Cidade/Estado</Label>
              <Input
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="Cidade - UF"
                className="bg-zinc-800 border-zinc-700 text-white"
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
              onClick={handleCreateCliente}
              disabled={!formData.nome || !formData.cpf || !formData.telefone}
              className="bg-red-600 hover:bg-red-700"
            >
              Cadastrar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Atualize as informações do cliente
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-zinc-300">Nome Completo *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo do cliente"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">CPF *</Label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Telefone *</Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-zinc-300">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-zinc-300">Endereço</Label>
              <Input
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, número, bairro"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-zinc-300">Cidade/Estado</Label>
              <Input
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="Cidade - UF"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateCliente}
              disabled={!formData.nome || !formData.cpf || !formData.telefone}
              className="bg-red-600 hover:bg-red-700"
            >
              Atualizar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
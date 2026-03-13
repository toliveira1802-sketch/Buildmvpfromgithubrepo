import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  UserCheck,
  UserX,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { kvStore } from "../../lib/supabase";
import DevLayout from "../components/DevLayout";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  cargo: "Direção" | "Gestão" | "Consultor Técnico" | "Mecânico";
  senha: string;
  primeiroAcesso: boolean;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DevUsers() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cargoFilter, setCargoFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    cargo: "Consultor Técnico" as Usuario["cargo"],
    senha: "123456",
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    const filtered = usuarios.filter((usuario) => {
      const matchesSearch =
        usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.cpf?.includes(searchTerm);
      const matchesCargo = cargoFilter === "todos" || usuario.cargo === cargoFilter;
      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "ativo" && usuario.ativo) ||
        (statusFilter === "inativo" && !usuario.ativo);
      return matchesSearch && matchesCargo && matchesStatus;
    });
    setFilteredUsuarios(filtered);
  }, [searchTerm, cargoFilter, statusFilter, usuarios]);

  const loadUsuarios = async () => {
    setIsLoading(true);
    try {
      const data = await kvStore.getByPrefix("usuario:");
      const usuariosData = data?.map((item) => item.value) || [];
      setUsuarios(usuariosData);
      toast.success("Usuários carregados com sucesso!");
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários: " + error.message);
      // Usar dados mockados se falhar
      setUsuarios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUsuario = async () => {
    try {
      const newUsuario: Usuario = {
        id: `USR-${Date.now()}`,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        cargo: formData.cargo,
        senha: formData.senha,
        primeiroAcesso: true,
        ativo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kvStore.set(`usuario:${newUsuario.id}`, newUsuario);
      toast.success("Usuário criado com sucesso!");
      setIsCreateDialogOpen(false);
      resetForm();
      loadUsuarios();
    } catch (error: any) {
      toast.error("Erro ao criar usuário: " + error.message);
    }
  };

  const handleEditUsuario = async () => {
    if (!selectedUsuario) return;
    try {
      const updatedUsuario: Usuario = {
        ...selectedUsuario,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        cargo: formData.cargo,
        senha: formData.senha,
        updatedAt: new Date().toISOString(),
      };

      await kvStore.set(`usuario:${updatedUsuario.id}`, updatedUsuario);
      toast.success("Usuário atualizado com sucesso!");
      setIsEditDialogOpen(false);
      setSelectedUsuario(null);
      resetForm();
      loadUsuarios();
    } catch (error: any) {
      toast.error("Erro ao atualizar usuário: " + error.message);
    }
  };

  const handleDeleteUsuario = async () => {
    if (!selectedUsuario) return;
    try {
      await kvStore.delete(`usuario:${selectedUsuario.id}`);
      toast.success("Usuário excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedUsuario(null);
      loadUsuarios();
    } catch (error: any) {
      toast.error("Erro ao excluir usuário: " + error.message);
    }
  };

  const handleToggleStatus = async (usuario: Usuario) => {
    try {
      const updatedUsuario = {
        ...usuario,
        ativo: !usuario.ativo,
        updatedAt: new Date().toISOString(),
      };
      await kvStore.set(`usuario:${usuario.id}`, updatedUsuario);
      toast.success(`Usuário ${updatedUsuario.ativo ? "ativado" : "desativado"} com sucesso!`);
      loadUsuarios();
    } catch (error: any) {
      toast.error("Erro ao alterar status: " + error.message);
    }
  };

  const openEditDialog = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone || "",
      cpf: usuario.cpf || "",
      cargo: usuario.cargo,
      senha: usuario.senha,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      cargo: "Consultor Técnico",
      senha: "123456",
    });
  };

  const getCargoBadge = (cargo: string) => {
    const colors: Record<string, string> = {
      "Direção": "bg-purple-500",
      "Gestão": "bg-blue-500",
      "Consultor Técnico": "bg-green-500",
      "Mecânico": "bg-orange-500",
    };
    return <Badge className={colors[cargo] || "bg-gray-500"}>{cargo}</Badge>;
  };

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter((u) => u.ativo).length,
    inativos: usuarios.filter((u) => !u.ativo).length,
    primeiroAcesso: usuarios.filter((u) => u.primeiroAcesso).length,
  };

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>
            <p className="text-zinc-400 mt-1">
              Controle de acesso e colaboradores do sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadUsuarios} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-950 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-950 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.ativos}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-950 rounded-lg">
                <UserX className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Inativos</p>
                <p className="text-2xl font-bold text-white">{stats.inativos}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-950 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Primeiro Acesso</p>
                <p className="text-2xl font-bold text-white">{stats.primeiroAcesso}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6 bg-zinc-900 border-zinc-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <Select value={cargoFilter} onValueChange={setCargoFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Filtrar por cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Cargos</SelectItem>
                <SelectItem value="Direção">Direção</SelectItem>
                <SelectItem value="Gestão">Gestão</SelectItem>
                <SelectItem value="Consultor Técnico">Consultor Técnico</SelectItem>
                <SelectItem value="Mecânico">Mecânico</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800">
                <tr className="text-left">
                  <th className="p-4 font-medium text-zinc-300">Nome</th>
                  <th className="p-4 font-medium text-zinc-300">Email</th>
                  <th className="p-4 font-medium text-zinc-300">CPF</th>
                  <th className="p-4 font-medium text-zinc-300">Cargo</th>
                  <th className="p-4 font-medium text-zinc-300">Senha Padrão</th>
                  <th className="p-4 font-medium text-zinc-300">Status</th>
                  <th className="p-4 font-medium text-zinc-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50"
                    >
                      <td className="p-4">
                        <p className="font-medium text-white">{usuario.nome}</p>
                        {usuario.primeiroAcesso && (
                          <Badge variant="outline" className="mt-1 border-yellow-700 text-yellow-500 text-xs">
                            Primeiro Acesso
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-sm text-zinc-300">{usuario.email}</td>
                      <td className="p-4 text-sm text-zinc-400">{usuario.cpf || "—"}</td>
                      <td className="p-4">{getCargoBadge(usuario.cargo)}</td>
                      <td className="p-4">
                        <code className="text-sm bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                          {usuario.senha}
                        </code>
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(usuario)}
                          className="hover:bg-zinc-800"
                        >
                          {usuario.ativo ? (
                            <Badge className="bg-green-500">Ativo</Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </Button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(usuario)}
                            className="hover:bg-zinc-800"
                          >
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(usuario)}
                            className="hover:bg-zinc-800"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Preencha os dados do novo usuário do sistema
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="create-nome" className="text-zinc-300">
                Nome Completo *
              </Label>
              <Input
                id="create-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo do usuário"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="create-email" className="text-zinc-300">
                Email *
              </Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@doctorauto.com"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="create-cpf" className="text-zinc-300">
                CPF
              </Label>
              <Input
                id="create-cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="create-telefone" className="text-zinc-300">
                Telefone
              </Label>
              <Input
                id="create-telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="create-cargo" className="text-zinc-300">
                Cargo *
              </Label>
              <Select
                value={formData.cargo}
                onValueChange={(value: Usuario["cargo"]) =>
                  setFormData({ ...formData, cargo: value })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direção">Direção</SelectItem>
                  <SelectItem value="Gestão">Gestão</SelectItem>
                  <SelectItem value="Consultor Técnico">Consultor Técnico</SelectItem>
                  <SelectItem value="Mecânico">Mecânico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="create-senha" className="text-zinc-300">
                Senha Padrão
              </Label>
              <Input
                id="create-senha"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder="123456"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <p className="text-xs text-zinc-500 mt-1">
                O usuário poderá alterar no primeiro acesso
              </p>
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
              onClick={handleCreateUsuario}
              disabled={!formData.nome || !formData.email}
              className="bg-red-600 hover:bg-red-700"
            >
              Criar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Atualize os dados do usuário
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="edit-nome" className="text-zinc-300">
                Nome Completo *
              </Label>
              <Input
                id="edit-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-email" className="text-zinc-300">
                Email *
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-cpf" className="text-zinc-300">
                CPF
              </Label>
              <Input
                id="edit-cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-telefone" className="text-zinc-300">
                Telefone
              </Label>
              <Input
                id="edit-telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-cargo" className="text-zinc-300">
                Cargo *
              </Label>
              <Select
                value={formData.cargo}
                onValueChange={(value: Usuario["cargo"]) =>
                  setFormData({ ...formData, cargo: value })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direção">Direção</SelectItem>
                  <SelectItem value="Gestão">Gestão</SelectItem>
                  <SelectItem value="Consultor Técnico">Consultor Técnico</SelectItem>
                  <SelectItem value="Mecânico">Mecânico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-senha" className="text-zinc-300">
                Senha
              </Label>
              <Input
                id="edit-senha"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedUsuario(null);
                resetForm();
              }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button onClick={handleEditUsuario} className="bg-red-600 hover:bg-red-700">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir o usuário{" "}
              <strong className="text-white">{selectedUsuario?.nome}</strong>? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUsuario(null);
              }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUsuario}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DevLayout>
  );
}
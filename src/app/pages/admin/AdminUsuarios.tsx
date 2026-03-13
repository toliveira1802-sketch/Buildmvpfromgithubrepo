import { useState } from "react";
import { Users, UserPlus, Edit, Trash2, Key, Shield, Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: "Desenvolvedor" | "Gestão" | "Consultor" | "Mecânico";
  status: "ativo" | "inativo";
  ultimoAcesso?: string;
  mecanico?: {
    id: string;
    especialidade: string;
  };
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "U001",
      nome: "Admin Dev",
      email: "dev@doctorauto.com",
      perfil: "Desenvolvedor",
      status: "ativo",
      ultimoAcesso: "2026-03-13 14:30",
    },
    {
      id: "U002",
      nome: "João Manager",
      email: "joao@doctorauto.com",
      perfil: "Gestão",
      status: "ativo",
      ultimoAcesso: "2026-03-13 09:15",
    },
    {
      id: "U003",
      nome: "Maria Consultora",
      email: "maria@doctorauto.com",
      perfil: "Consultor",
      status: "ativo",
      ultimoAcesso: "2026-03-13 15:45",
    },
    {
      id: "U004",
      nome: "Carlos Silva",
      email: "carlos@doctorauto.com",
      perfil: "Mecânico",
      status: "ativo",
      ultimoAcesso: "2026-03-13 13:20",
      mecanico: {
        id: "M001",
        especialidade: "Motor",
      },
    },
    {
      id: "U005",
      nome: "Roberto Santos",
      email: "roberto@doctorauto.com",
      perfil: "Mecânico",
      status: "inativo",
      mecanico: {
        id: "M002",
        especialidade: "Suspensão",
      },
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    perfil: "Consultor" as const,
    senha: "",
  });

  const handleCreateUser = () => {
    const newUser: Usuario = {
      id: `U${String(usuarios.length + 1).padStart(3, "0")}`,
      nome: formData.nome,
      email: formData.email,
      perfil: formData.perfil,
      status: "ativo",
    };

    setUsuarios([...usuarios, newUser]);
    toast.success(`Usuário ${formData.nome} criado com sucesso!`);
    setIsDialogOpen(false);
    setFormData({ nome: "", email: "", perfil: "Consultor", senha: "" });
  };

  const handleDeleteUser = (userId: string) => {
    const user = usuarios.find(u => u.id === userId);
    setUsuarios(usuarios.filter(u => u.id !== userId));
    toast.success(`Usuário ${user?.nome} deletado com sucesso!`);
  };

  const handleResetPassword = (userId: string) => {
    const user = usuarios.find(u => u.id === userId);
    toast.success(`Senha resetada para ${user?.nome}. Nova senha enviada por email.`);
  };

  const handleToggleStatus = (userId: string) => {
    setUsuarios(usuarios.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === "ativo" ? "inativo" : "ativo";
        toast.success(`Usuário ${u.nome} ${newStatus === "ativo" ? "ativado" : "desativado"}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case "Desenvolvedor": return "bg-purple-500";
      case "Gestão": return "bg-blue-500";
      case "Consultor": return "bg-green-500";
      case "Mecânico": return "bg-orange-500";
      default: return "bg-zinc-500";
    }
  };

  const getPerfilIcon = (perfil: string) => {
    return <Shield className="h-3 w-3" />;
  };

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.status === "ativo").length,
    inativos: usuarios.filter(u => u.status === "inativo").length,
    mecanicos: usuarios.filter(u => u.perfil === "Mecânico").length,
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Users className="h-8 w-8 text-red-500" />
              Gestão de Usuários
            </h1>
            <p className="text-zinc-400 mt-1">
              Gerenciamento de usuários, perfis e permissões
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Preencha os dados do novo usuário do sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="João Silva"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="joao@doctorauto.com"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil de Acesso</Label>
                  <Select
                    value={formData.perfil}
                    onValueChange={(value: any) => setFormData({ ...formData, perfil: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desenvolvedor">Desenvolvedor</SelectItem>
                      <SelectItem value="Gestão">Gestão</SelectItem>
                      <SelectItem value="Consultor">Consultor</SelectItem>
                      <SelectItem value="Mecânico">Mecânico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha Inicial</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="••••••••"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleCreateUser}
                  disabled={!formData.nome || !formData.email || !formData.senha}
                >
                  Criar Usuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total Usuários</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300">Ativos</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.ativos}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-red-950 border-red-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-300">Inativos</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.inativos}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-orange-950 border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-300">Mecânicos</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.mecanicos}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Lista de Usuários */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Usuários Cadastrados</CardTitle>
            <CardDescription className="text-zinc-400">
              Gerencie os usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      {usuario.nome.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{usuario.nome}</h4>
                        <Badge className={getPerfilColor(usuario.perfil)}>
                          {getPerfilIcon(usuario.perfil)}
                          <span className="ml-1">{usuario.perfil}</span>
                        </Badge>
                        <Badge variant={usuario.status === "ativo" ? "default" : "secondary"}>
                          {usuario.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {usuario.email}
                        </span>
                        {usuario.ultimoAcesso && (
                          <span>Último acesso: {usuario.ultimoAcesso}</span>
                        )}
                        {usuario.mecanico && (
                          <span className="text-orange-400">
                            {usuario.mecanico.especialidade}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResetPassword(usuario.id)}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(usuario.id)}
                    >
                      {usuario.status === "ativo" ? "Desativar" : "Ativar"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">
                            Tem certeza que deseja excluir o usuário <strong>{usuario.nome}</strong>?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(usuario.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

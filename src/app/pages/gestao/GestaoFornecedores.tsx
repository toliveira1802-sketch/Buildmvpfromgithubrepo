import { useState } from "react";
import { Truck, Plus, Edit2, Trash2, Phone, Mail, MapPin, DollarSign, Package, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  categoria: "pecas" | "ferramentas" | "servicos" | "outros";
  contato: {
    telefone: string;
    email: string;
    endereco: string;
  };
  status: "ativo" | "inativo";
  avaliacao: number;
  prazoEntrega: number; // dias
  valorMedioPedido: number;
  totalCompras: number;
}

export default function GestaoFornecedores() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<"todos" | Fornecedor["categoria"]>("todos");

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    {
      id: "F001",
      nome: "Auto Peças Brasil",
      cnpj: "12.345.678/0001-90",
      categoria: "pecas",
      contato: {
        telefone: "(11) 98765-4321",
        email: "contato@autopecasbrasil.com.br",
        endereco: "Av. Paulista, 1000 - São Paulo/SP",
      },
      status: "ativo",
      avaliacao: 4.8,
      prazoEntrega: 3,
      valorMedioPedido: 2500,
      totalCompras: 45000,
    },
    {
      id: "F002",
      nome: "Ferramentas Pro",
      cnpj: "98.765.432/0001-10",
      categoria: "ferramentas",
      contato: {
        telefone: "(11) 91234-5678",
        email: "vendas@ferramentaspro.com.br",
        endereco: "Rua das Indústrias, 500 - Guarulhos/SP",
      },
      status: "ativo",
      avaliacao: 4.5,
      prazoEntrega: 5,
      valorMedioPedido: 1800,
      totalCompras: 28000,
    },
    {
      id: "F003",
      nome: "Lubrificantes Quality",
      cnpj: "11.222.333/0001-44",
      categoria: "pecas",
      contato: {
        telefone: "(11) 97777-8888",
        email: "quality@lubrificantes.com.br",
        endereco: "Av. Industrial, 2000 - São Paulo/SP",
      },
      status: "ativo",
      avaliacao: 4.9,
      prazoEntrega: 2,
      valorMedioPedido: 3200,
      totalCompras: 62000,
    },
    {
      id: "F004",
      nome: "Tech Service Motors",
      cnpj: "55.666.777/0001-88",
      categoria: "servicos",
      contato: {
        telefone: "(11) 96666-5555",
        email: "tech@servicemotors.com.br",
        endereco: "Rua dos Mecânicos, 300 - São Paulo/SP",
      },
      status: "inativo",
      avaliacao: 3.8,
      prazoEntrega: 7,
      valorMedioPedido: 1200,
      totalCompras: 15000,
    },
  ]);

  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    cnpj: "",
    categoria: "pecas" as Fornecedor["categoria"],
    telefone: "",
    email: "",
    endereco: "",
  });

  const fornecedoresFiltrados = filtroCategoria === "todos"
    ? fornecedores
    : fornecedores.filter(f => f.categoria === filtroCategoria);

  const stats = {
    total: fornecedores.length,
    ativos: fornecedores.filter(f => f.status === "ativo").length,
    inativos: fornecedores.filter(f => f.status === "inativo").length,
    totalCompras: fornecedores.reduce((acc, f) => acc + f.totalCompras, 0),
    mediaAvaliacao: fornecedores.reduce((acc, f) => acc + f.avaliacao, 0) / fornecedores.length,
  };

  const handleCriar = () => {
    const fornecedor: Fornecedor = {
      id: `F${String(fornecedores.length + 1).padStart(3, '0')}`,
      nome: novoFornecedor.nome,
      cnpj: novoFornecedor.cnpj,
      categoria: novoFornecedor.categoria,
      contato: {
        telefone: novoFornecedor.telefone,
        email: novoFornecedor.email,
        endereco: novoFornecedor.endereco,
      },
      status: "ativo",
      avaliacao: 0,
      prazoEntrega: 0,
      valorMedioPedido: 0,
      totalCompras: 0,
    };
    setFornecedores([...fornecedores, fornecedor]);
    setDialogOpen(false);
    toast.success("Fornecedor cadastrado com sucesso!");
    setNovoFornecedor({
      nome: "",
      cnpj: "",
      categoria: "pecas",
      telefone: "",
      email: "",
      endereco: "",
    });
  };

  const handleDeletar = (id: string) => {
    setFornecedores(fornecedores.filter(f => f.id !== id));
    toast.success("Fornecedor removido!");
  };

  const handleToggleStatus = (id: string) => {
    setFornecedores(fornecedores.map(f => {
      if (f.id === id) {
        const novoStatus = f.status === "ativo" ? "inativo" : "ativo";
        toast.success(`Fornecedor ${novoStatus === "ativo" ? "ativado" : "desativado"}!`);
        return { ...f, status: novoStatus };
      }
      return f;
    }));
  };

  const getCategoriaColor = (categoria: Fornecedor["categoria"]) => {
    switch (categoria) {
      case "pecas": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "ferramentas": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "servicos": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "outros": return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getStatusColor = (status: Fornecedor["status"]) => {
    return status === "ativo"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Truck className="h-8 w-8 text-blue-500" />
              Gestão de Fornecedores
            </h1>
            <p className="text-zinc-400 mt-1">
              Gerencie seus fornecedores de peças, ferramentas e serviços
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Fornecedor</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Preencha os dados do fornecedor
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome do Fornecedor</Label>
                    <Input
                      id="nome"
                      value={novoFornecedor.nome}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, nome: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={novoFornecedor.cnpj}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, cnpj: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={novoFornecedor.categoria}
                    onValueChange={(v) => setNovoFornecedor({ ...novoFornecedor, categoria: v as Fornecedor["categoria"] })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pecas">Peças</SelectItem>
                      <SelectItem value="ferramentas">Ferramentas</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={novoFornecedor.telefone}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, telefone: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={novoFornecedor.email}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, email: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={novoFornecedor.endereco}
                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, endereco: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCriar} className="bg-blue-600 hover:bg-blue-700">
                  Cadastrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total</CardDescription>
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

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300">Total Compras</CardDescription>
              <CardTitle className="text-2xl text-white">{formatCurrency(stats.totalCompras)}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-yellow-950 border-yellow-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-yellow-300">Média Avaliação</CardDescription>
              <CardTitle className="text-3xl text-white flex items-center gap-2">
                <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                {stats.mediaAvaliacao.toFixed(1)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filtroCategoria === "todos" ? "default" : "outline"}
            onClick={() => setFiltroCategoria("todos")}
            className={filtroCategoria === "todos" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Todos ({fornecedores.length})
          </Button>
          <Button
            variant={filtroCategoria === "pecas" ? "default" : "outline"}
            onClick={() => setFiltroCategoria("pecas")}
            className={filtroCategoria === "pecas" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Package className="h-4 w-4 mr-2" />
            Peças
          </Button>
          <Button
            variant={filtroCategoria === "ferramentas" ? "default" : "outline"}
            onClick={() => setFiltroCategoria("ferramentas")}
            className={filtroCategoria === "ferramentas" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Ferramentas
          </Button>
          <Button
            variant={filtroCategoria === "servicos" ? "default" : "outline"}
            onClick={() => setFiltroCategoria("servicos")}
            className={filtroCategoria === "servicos" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Serviços
          </Button>
        </div>

        {/* Lista de Fornecedores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {fornecedoresFiltrados.map((fornecedor) => (
            <Card key={fornecedor.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{fornecedor.nome}</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm mt-1">
                      CNPJ: {fornecedor.cnpj}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getStatusColor(fornecedor.status)}>
                      {fornecedor.status}
                    </Badge>
                    <Badge className={getCategoriaColor(fornecedor.categoria)}>
                      {fornecedor.categoria}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contato */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Phone className="h-4 w-4" />
                    <span className="text-white">{fornecedor.contato.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-white">{fornecedor.contato.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-white">{fornecedor.contato.endereco}</span>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500 flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500" />
                      {fornecedor.avaliacao}
                    </div>
                    <div className="text-xs text-zinc-400">Avaliação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{fornecedor.prazoEntrega}d</div>
                    <div className="text-xs text-zinc-400">Prazo Entrega</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">
                      {formatCurrency(fornecedor.valorMedioPedido)}
                    </div>
                    <div className="text-xs text-zinc-400">Valor Médio</div>
                  </div>
                </div>

                <div className="p-3 bg-green-950/20 border border-green-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Total em Compras</span>
                    <span className="text-xl font-bold text-green-500">
                      {formatCurrency(fornecedor.totalCompras)}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleToggleStatus(fornecedor.id)}
                  >
                    {fornecedor.status === "ativo" ? "Desativar" : "Ativar"}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit2 className="h-3 w-3 mr-2" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                    onClick={() => handleDeletar(fornecedor.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  Car,
  FileText,
  DollarSign,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Wrench,
  Package,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

export default function AdminOSDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [observacoes, setObservacoes] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState("");

  // Mock data
  const os = {
    id: id || "OS-123",
    cliente: {
      nome: "Carlos Silva",
      telefone: "(11) 98765-4321",
      email: "carlos@email.com",
    },
    veiculo: {
      marca: "Honda",
      modelo: "Civic",
      ano: 2020,
      placa: "ABC-1234",
      km: 45000,
    },
    dataAbertura: "2026-03-10T09:00:00",
    dataPrevisao: "2026-03-12T18:00:00",
    dataConclusao: "2026-03-12T16:30:00",
    status: "Concluído",
    responsavel: "João Mecânico",
    consultor: "Ana Consultora",
  };

  const servicos = [
    {
      id: "1",
      descricao: "Troca de Óleo",
      valorMaoObra: 80.0,
      tempo: "30 min",
      status: "Concluído",
    },
    {
      id: "2",
      descricao: "Revisão Completa",
      valorMaoObra: 250.0,
      tempo: "2h",
      status: "Concluído",
    },
    {
      id: "3",
      descricao: "Filtro de Ar",
      valorMaoObra: 50.0,
      tempo: "15 min",
      status: "Concluído",
    },
  ];

  const pecas = [
    {
      id: "1",
      descricao: "Óleo Sintético 5W30 (4L)",
      quantidade: 1,
      valorUnitario: 180.0,
      valorTotal: 180.0,
    },
    {
      id: "2",
      descricao: "Filtro de Óleo",
      quantidade: 1,
      valorUnitario: 45.0,
      valorTotal: 45.0,
    },
    {
      id: "3",
      descricao: "Filtro de Ar",
      quantidade: 1,
      valorUnitario: 65.0,
      valorTotal: 65.0,
    },
  ];

  const totalServicos = servicos.reduce((sum, s) => sum + s.valorMaoObra, 0);
  const totalPecas = pecas.reduce((sum, p) => sum + p.valorTotal, 0);
  const valorTotal = totalServicos + totalPecas;

  const getStatusBadge = (status: string) => {
    const styles = {
      "Aguardando": "bg-yellow-500",
      "Em Andamento": "bg-blue-500",
      "Concluído": "bg-green-500",
      "Cancelado": "bg-red-500",
    };
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>;
  };

  const handleConcluirOS = () => {
    toast.success("Ordem de Serviço concluída!");
  };

  const handleCancelarOS = () => {
    toast.error("Ordem de Serviço cancelada!");
  };

  const handleEditStatus = () => {
    if (editStatus) {
      toast.success(`Status alterado para ${editStatus}!`);
      setIsEditDialogOpen(false);
    } else {
      toast.error("Selecione um status válido!");
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/ordens-servico")}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Ordem de Serviço {os.id}</h1>
              <p className="text-zinc-400 mt-1">
                Aberta em {new Date(os.dataAbertura).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-zinc-700" onClick={() => setIsEditDialogOpen(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
            {os.status !== "Concluído" && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleConcluirOS}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluir
              </Button>
            )}
          </div>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cliente */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-zinc-500">Nome</p>
                <p className="text-white font-medium">{os.cliente.nome}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Telefone</p>
                <p className="text-white">{os.cliente.telefone}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="text-white">{os.cliente.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Veículo */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Car className="h-5 w-5" />
                Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-zinc-500">Veículo</p>
                <p className="text-white font-medium">
                  {os.veiculo.marca} {os.veiculo.modelo} {os.veiculo.ano}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Placa</p>
                <Badge className="bg-blue-600">{os.veiculo.placa}</Badge>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Quilometragem</p>
                <p className="text-white">{os.veiculo.km.toLocaleString()} km</p>
              </div>
            </CardContent>
          </Card>

          {/* Status e Prazos */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status e Prazos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-zinc-500">Status</p>
                {getStatusBadge(os.status)}
              </div>
              <div>
                <p className="text-sm text-zinc-500">Previsão de Entrega</p>
                <p className="text-white">
                  {new Date(os.dataPrevisao).toLocaleString("pt-BR")}
                </p>
              </div>
              {os.dataConclusao && (
                <div>
                  <p className="text-sm text-zinc-500">Conclusão</p>
                  <p className="text-green-500">
                    {new Date(os.dataConclusao).toLocaleString("pt-BR")}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-zinc-500">Responsável</p>
                <p className="text-white">{os.responsavel}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Consultor</p>
                <p className="text-white">{os.consultor}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Serviços */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Wrench className="h-6 w-6" />
              Serviços
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </div>

          <Card className="bg-zinc-900 border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-zinc-300">Descrição</th>
                    <th className="p-4 font-medium text-zinc-300">Tempo</th>
                    <th className="p-4 font-medium text-zinc-300">Valor Mão de Obra</th>
                    <th className="p-4 font-medium text-zinc-300">Status</th>
                    <th className="p-4 font-medium text-zinc-300">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((servico) => (
                    <tr key={servico.id} className="border-b border-zinc-800">
                      <td className="p-4 text-white">{servico.descricao}</td>
                      <td className="p-4 text-zinc-300">{servico.tempo}</td>
                      <td className="p-4 text-green-500 font-semibold">
                        {servico.valorMaoObra.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="p-4">
                        <Badge className="bg-green-500">{servico.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-zinc-800/50">
                    <td colSpan={2} className="p-4 text-right font-semibold text-white">
                      Total Serviços:
                    </td>
                    <td className="p-4 text-green-500 font-bold">
                      {totalServicos.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Peças */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="h-6 w-6" />
              Peças e Materiais
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Peça
            </Button>
          </div>

          <Card className="bg-zinc-900 border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-zinc-300">Descrição</th>
                    <th className="p-4 font-medium text-zinc-300">Quantidade</th>
                    <th className="p-4 font-medium text-zinc-300">Valor Unitário</th>
                    <th className="p-4 font-medium text-zinc-300">Valor Total</th>
                    <th className="p-4 font-medium text-zinc-300">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pecas.map((peca) => (
                    <tr key={peca.id} className="border-b border-zinc-800">
                      <td className="p-4 text-white">{peca.descricao}</td>
                      <td className="p-4 text-zinc-300">{peca.quantidade}</td>
                      <td className="p-4 text-zinc-300">
                        {peca.valorUnitario.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="p-4 text-green-500 font-semibold">
                        {peca.valorTotal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-zinc-800/50">
                    <td colSpan={3} className="p-4 text-right font-semibold text-white">
                      Total Peças:
                    </td>
                    <td className="p-4 text-green-500 font-bold">
                      {totalPecas.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Resumo Financeiro */}
        <Card className="bg-gradient-to-br from-green-950 to-zinc-900 border-green-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-zinc-300">Total Serviços:</span>
              <span className="text-white font-semibold">
                {totalServicos.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-zinc-300">Total Peças:</span>
              <span className="text-white font-semibold">
                {totalPecas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="border-t border-green-800 pt-3 mt-3">
              <div className="flex justify-between text-2xl">
                <span className="text-white font-bold">TOTAL:</span>
                <span className="text-green-400 font-bold">
                  {valorTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione observações sobre a OS..."
              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
            />
            <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
              Salvar Observações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Ordem de Serviço</DialogTitle>
            <DialogDescription>
              Altere o status da ordem de serviço.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="status">Status</Label>
            <Select
              value={editStatus}
              onValueChange={setEditStatus}
              defaultValue={os.status}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status">
                  {os.status}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aguardando">Aguardando</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditStatus}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
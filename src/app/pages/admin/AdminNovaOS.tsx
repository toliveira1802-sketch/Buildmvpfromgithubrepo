import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Car,
  Calendar,
  Wrench,
  Package,
  Plus,
  Trash2,
  Save,
  Search,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface Servico {
  id: string;
  descricao: string;
  valorMaoObra: number;
  tempo: string;
}

interface Peca {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export default function AdminNovaOS() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cliente: "",
    telefone: "",
    email: "",
    veiculo: "",
    placa: "",
    km: "",
    dataPrevisao: "",
    responsavel: "",
    consultor: "",
    observacoes: "",
  });

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);

  const [novoServico, setNovoServico] = useState({
    descricao: "",
    valorMaoObra: "",
    tempo: "",
  });

  const [novaPeca, setNovaPeca] = useState({
    descricao: "",
    quantidade: "",
    valorUnitario: "",
  });

  const addServico = () => {
    if (!novoServico.descricao || !novoServico.valorMaoObra) {
      toast.error("Preencha os campos obrigatórios do serviço");
      return;
    }

    const servico: Servico = {
      id: `SERV-${Date.now()}`,
      descricao: novoServico.descricao,
      valorMaoObra: parseFloat(novoServico.valorMaoObra),
      tempo: novoServico.tempo,
    };

    setServicos([...servicos, servico]);
    setNovoServico({ descricao: "", valorMaoObra: "", tempo: "" });
    toast.success("Serviço adicionado!");
  };

  const removeServico = (id: string) => {
    setServicos(servicos.filter((s) => s.id !== id));
    toast.success("Serviço removido!");
  };

  const addPeca = () => {
    if (!novaPeca.descricao || !novaPeca.quantidade || !novaPeca.valorUnitario) {
      toast.error("Preencha os campos obrigatórios da peça");
      return;
    }

    const peca: Peca = {
      id: `PECA-${Date.now()}`,
      descricao: novaPeca.descricao,
      quantidade: parseInt(novaPeca.quantidade),
      valorUnitario: parseFloat(novaPeca.valorUnitario),
    };

    setPecas([...pecas, peca]);
    setNovaPeca({ descricao: "", quantidade: "", valorUnitario: "" });
    toast.success("Peça adicionada!");
  };

  const removePeca = (id: string) => {
    setPecas(pecas.filter((p) => p.id !== id));
    toast.success("Peça removida!");
  };

  const handleSubmit = () => {
    if (!formData.cliente || !formData.veiculo || !formData.placa) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    if (servicos.length === 0) {
      toast.error("Adicione pelo menos um serviço!");
      return;
    }

    // Aqui você salvaria no backend
    toast.success("Ordem de Serviço criada com sucesso!");
    setTimeout(() => navigate("/ordens-servico"), 1500);
  };

  const totalServicos = servicos.reduce((sum, s) => sum + s.valorMaoObra, 0);
  const totalPecas = pecas.reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);
  const valorTotal = totalServicos + totalPecas;

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
              <h1 className="text-3xl font-bold text-white">Nova Ordem de Serviço</h1>
              <p className="text-zinc-400 mt-1">
                Preencha os dados para criar uma nova OS
              </p>
            </div>
          </div>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Salvar OS
          </Button>
        </div>

        {/* Informações do Cliente e Veículo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cliente */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Cliente
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Informações do cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-zinc-300">Cliente *</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.cliente}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente: e.target.value })
                    }
                    placeholder="Nome do cliente"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-zinc-300">Telefone</Label>
                <Input
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@exemplo.com"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Veículo */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Car className="h-5 w-5" />
                Dados do Veículo
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Informações do veículo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-zinc-300">Veículo *</Label>
                <Input
                  value={formData.veiculo}
                  onChange={(e) =>
                    setFormData({ ...formData, veiculo: e.target.value })
                  }
                  placeholder="Marca Modelo Ano"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Placa *</Label>
                <Input
                  value={formData.placa}
                  onChange={(e) =>
                    setFormData({ ...formData, placa: e.target.value })
                  }
                  placeholder="ABC-1234"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Quilometragem</Label>
                <Input
                  type="number"
                  value={formData.km}
                  onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                  placeholder="0"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações da OS */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações da OS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-zinc-300">Previsão de Entrega</Label>
                <Input
                  type="datetime-local"
                  value={formData.dataPrevisao}
                  onChange={(e) =>
                    setFormData({ ...formData, dataPrevisao: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Responsável (Mecânico)</Label>
                <Select
                  value={formData.responsavel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, responsavel: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joao">João Mecânico</SelectItem>
                    <SelectItem value="jose">José Mecânico</SelectItem>
                    <SelectItem value="maria">Maria Mecânica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-zinc-300">Consultor</Label>
                <Select
                  value={formData.consultor}
                  onValueChange={(value) =>
                    setFormData({ ...formData, consultor: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ana">Ana Consultora</SelectItem>
                    <SelectItem value="pedro">Pedro Consultor</SelectItem>
                    <SelectItem value="lucas">Lucas Consultor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Serviços */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Serviços
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form para adicionar serviço */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-zinc-800/50 rounded-lg">
              <Input
                placeholder="Descrição do serviço *"
                value={novoServico.descricao}
                onChange={(e) =>
                  setNovoServico({ ...novoServico, descricao: e.target.value })
                }
                className="md:col-span-2 bg-zinc-800 border-zinc-700 text-white"
              />
              <Input
                type="number"
                placeholder="Valor R$ *"
                value={novoServico.valorMaoObra}
                onChange={(e) =>
                  setNovoServico({ ...novoServico, valorMaoObra: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Tempo"
                  value={novoServico.tempo}
                  onChange={(e) =>
                    setNovoServico({ ...novoServico, tempo: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Button onClick={addServico} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lista de serviços */}
            {servicos.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-800">
                    <tr className="text-left">
                      <th className="p-2 font-medium text-zinc-300">Descrição</th>
                      <th className="p-2 font-medium text-zinc-300">Tempo</th>
                      <th className="p-2 font-medium text-zinc-300">Valor</th>
                      <th className="p-2 font-medium text-zinc-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map((servico) => (
                      <tr key={servico.id} className="border-b border-zinc-800">
                        <td className="p-2 text-white">{servico.descricao}</td>
                        <td className="p-2 text-zinc-300">{servico.tempo}</td>
                        <td className="p-2 text-green-500 font-semibold">
                          {servico.valorMaoObra.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeServico(servico.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Peças */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Peças e Materiais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form para adicionar peça */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-zinc-800/50 rounded-lg">
              <Input
                placeholder="Descrição da peça *"
                value={novaPeca.descricao}
                onChange={(e) =>
                  setNovaPeca({ ...novaPeca, descricao: e.target.value })
                }
                className="md:col-span-2 bg-zinc-800 border-zinc-700 text-white"
              />
              <Input
                type="number"
                placeholder="Qtd *"
                value={novaPeca.quantidade}
                onChange={(e) =>
                  setNovaPeca({ ...novaPeca, quantidade: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <Input
                type="number"
                placeholder="Valor Unit. R$ *"
                value={novaPeca.valorUnitario}
                onChange={(e) =>
                  setNovaPeca({ ...novaPeca, valorUnitario: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <Button onClick={addPeca} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Lista de peças */}
            {pecas.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-800">
                    <tr className="text-left">
                      <th className="p-2 font-medium text-zinc-300">Descrição</th>
                      <th className="p-2 font-medium text-zinc-300">Qtd</th>
                      <th className="p-2 font-medium text-zinc-300">Valor Unit.</th>
                      <th className="p-2 font-medium text-zinc-300">Total</th>
                      <th className="p-2 font-medium text-zinc-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pecas.map((peca) => (
                      <tr key={peca.id} className="border-b border-zinc-800">
                        <td className="p-2 text-white">{peca.descricao}</td>
                        <td className="p-2 text-zinc-300">{peca.quantidade}</td>
                        <td className="p-2 text-zinc-300">
                          {peca.valorUnitario.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="p-2 text-green-500 font-semibold">
                          {(peca.quantidade * peca.valorUnitario).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePeca(peca.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
              placeholder="Observações sobre a OS..."
              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card className="bg-gradient-to-br from-green-950 to-zinc-900 border-green-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
            <div className="border-t border-green-800 pt-2 mt-2">
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
      </div>
    </AdminLayout>
  );
}

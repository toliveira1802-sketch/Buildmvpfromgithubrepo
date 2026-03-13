import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  FileText,
  Calendar,
  DollarSign,
  Edit2,
  Plus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import AdminLayout from "../../components/AdminLayout";

export default function AdminClienteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - em produção, viria do backend
  const cliente = {
    id: id || "CLI-001",
    nome: "Carlos Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "carlos@email.com",
    endereco: "Rua das Flores, 123",
    cidade: "São Paulo - SP",
    dataCadastro: "2025-01-15",
    ultimaVisita: "2026-03-10",
  };

  const veiculos = [
    {
      id: "VEI-001",
      marca: "Honda",
      modelo: "Civic",
      ano: 2020,
      placa: "ABC-1234",
      cor: "Preto",
      km: 45000,
    },
    {
      id: "VEI-002",
      marca: "Toyota",
      modelo: "Corolla",
      ano: 2021,
      placa: "XYZ-5678",
      cor: "Prata",
      km: 32000,
    },
  ];

  const historicoServicos = [
    {
      id: "OS-123",
      data: "2026-03-10",
      veiculo: "Honda Civic - ABC-1234",
      servico: "Revisão Completa",
      valor: 850.0,
      status: "Concluído",
    },
    {
      id: "OS-098",
      data: "2026-02-15",
      veiculo: "Toyota Corolla - XYZ-5678",
      servico: "Troca de Óleo",
      valor: 320.0,
      status: "Concluído",
    },
    {
      id: "OS-076",
      data: "2026-01-20",
      veiculo: "Honda Civic - ABC-1234",
      servico: "Alinhamento e Balanceamento",
      valor: 180.0,
      status: "Concluído",
    },
    {
      id: "OS-054",
      data: "2025-12-10",
      veiculo: "Honda Civic - ABC-1234",
      servico: "Troca de Pastilhas de Freio",
      valor: 520.0,
      status: "Concluído",
    },
  ];

  const totalGasto = historicoServicos.reduce((sum, h) => sum + h.valor, 0);

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/clientes")}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{cliente.nome}</h1>
              <p className="text-zinc-400 mt-1">ID: {cliente.id}</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit2 className="h-4 w-4 mr-2" />
            Editar Cliente
          </Button>
        </div>

        {/* Informações do Cliente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dados Pessoais */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-zinc-500">CPF</p>
                <p className="text-white">{cliente.cpf}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-zinc-500" />
                <p className="text-white">{cliente.telefone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-500" />
                <p className="text-white">{cliente.email}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-zinc-500 mt-1" />
                <div>
                  <p className="text-white">{cliente.endereco}</p>
                  <p className="text-zinc-400">{cliente.cidade}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-zinc-500">Total Gasto</p>
                <p className="text-2xl font-bold text-green-500">
                  {totalGasto.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Veículos Cadastrados</p>
                <p className="text-2xl font-bold text-white">{veiculos.length}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Serviços Realizados</p>
                <p className="text-2xl font-bold text-white">{historicoServicos.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Datas Importantes */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-zinc-500">Data de Cadastro</p>
                <p className="text-white">
                  {new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Última Visita</p>
                <p className="text-white">
                  {new Date(cliente.ultimaVisita).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Tempo de Cliente</p>
                <p className="text-white">
                  {Math.floor(
                    (new Date().getTime() - new Date(cliente.dataCadastro).getTime()) /
                      (1000 * 60 * 60 * 24 * 30)
                  )}{" "}
                  meses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Veículos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Car className="h-6 w-6" />
              Veículos
            </h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Veículo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {veiculos.map((veiculo) => (
              <Card key={veiculo.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">
                        {veiculo.marca} {veiculo.modelo}
                      </CardTitle>
                      <CardDescription className="text-zinc-400 mt-1">
                        {veiculo.ano} • {veiculo.cor}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-600">{veiculo.placa}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Quilometragem</span>
                      <span className="text-white">{veiculo.km.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">ID do Veículo</span>
                      <span className="text-white">{veiculo.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Histórico de Serviços */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Histórico de Serviços
          </h2>

          <Card className="bg-zinc-900 border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-zinc-300">OS</th>
                    <th className="p-4 font-medium text-zinc-300">Data</th>
                    <th className="p-4 font-medium text-zinc-300">Veículo</th>
                    <th className="p-4 font-medium text-zinc-300">Serviço</th>
                    <th className="p-4 font-medium text-zinc-300">Valor</th>
                    <th className="p-4 font-medium text-zinc-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoServicos.map((servico) => (
                    <tr
                      key={servico.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                      onClick={() => navigate(`/ordens-servico/${servico.id}`)}
                    >
                      <td className="p-4 font-medium text-blue-500">{servico.id}</td>
                      <td className="p-4 text-zinc-300">
                        {new Date(servico.data).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-4 text-zinc-300">{servico.veiculo}</td>
                      <td className="p-4 text-white">{servico.servico}</td>
                      <td className="p-4 text-green-500 font-semibold">
                        {servico.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="p-4">
                        <Badge className="bg-green-500">{servico.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

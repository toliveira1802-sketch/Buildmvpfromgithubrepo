import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, Eye, Download } from "lucide-react";
import { toast } from "sonner";

interface Ordem {
  id: number;
  numero: string;
  placa: string;
  veiculo: string;
  cliente: string;
  mecanico: string;
  status: string;
  valor: number;
  data: string;
}

const mockOrdens: Ordem[] = [
  { id: 1, numero: "OS-2024-001", placa: "ABC-1234", veiculo: "Honda Civic 2020", cliente: "João Silva", mecanico: "Thales", status: "diagnostico", valor: 1500, data: "2024-03-10" },
  { id: 2, numero: "OS-2024-002", placa: "XYZ-5678", veiculo: "Toyota Corolla 2019", cliente: "Maria Santos", mecanico: "Marcos", status: "orcamento", valor: 2200, data: "2024-03-10" },
  { id: 3, numero: "OS-2024-003", placa: "DEF-9012", veiculo: "Ford Ka 2021", cliente: "Pedro Costa", mecanico: "Rodrigo", status: "execucao", valor: 800, data: "2024-03-09" },
  { id: 4, numero: "OS-2024-004", placa: "GHI-3456", veiculo: "VW Gol 2018", cliente: "Ana Lima", mecanico: "Thales", status: "pronto", valor: 1200, data: "2024-03-09" },
  { id: 5, numero: "OS-2024-005", placa: "JKL-7890", veiculo: "Fiat Uno 2020", cliente: "Carlos Souza", mecanico: "Mauricio", status: "aguardando", valor: 3500, data: "2024-03-08" },
  { id: 6, numero: "OS-2024-006", placa: "MNO-2345", veiculo: "Chevrolet Onix 2022", cliente: "Lucia Alves", mecanico: "Elias", status: "execucao", valor: 2800, data: "2024-03-08" },
  { id: 7, numero: "OS-2024-007", placa: "PQR-6789", veiculo: "Nissan Kicks 2021", cliente: "Roberto Dias", mecanico: "Vitor", status: "pronto", valor: 4200, data: "2024-03-07" },
  { id: 8, numero: "OS-2024-008", placa: "STU-0123", veiculo: "Hyundai HB20 2019", cliente: "Fernanda Rocha", mecanico: "Marcos", status: "diagnostico", valor: 1800, data: "2024-03-07" },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  diagnostico: { label: "Diagnóstico", variant: "secondary" },
  orcamento: { label: "Orçamento", variant: "outline" },
  aguardando: { label: "Aguardando", variant: "destructive" },
  execucao: { label: "Em Execução", variant: "default" },
  pronto: { label: "Pronto", variant: "default" },
};

export default function OrdensList() {
  useEffect(() => {
    document.title = "Ordens de Serviço - Doctor Auto";
  }, []);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const ordensFiltradas = mockOrdens.filter(ordem => {
    const matchBusca = 
      ordem.numero.toLowerCase().includes(busca.toLowerCase()) ||
      ordem.placa.toLowerCase().includes(busca.toLowerCase()) ||
      ordem.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      ordem.veiculo.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === "todos" || ordem.status === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  const handleExportar = () => {
    toast.success("Exportação iniciada! O arquivo será baixado em breve.");
  };

  const handleVerDetalhes = (numero: string) => {
    toast.info(`Abrindo detalhes da ${numero}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
        <p className="text-muted-foreground">Gerencie todas as OS da oficina</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busque e filtre as ordens de serviço</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por OS, placa, cliente ou veículo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                <SelectItem value="orcamento">Orçamento</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="execucao">Em Execução</SelectItem>
                <SelectItem value="pronto">Pronto</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportar}>
              <Download className="size-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens</CardTitle>
          <CardDescription>
            {ordensFiltradas.length} {ordensFiltradas.length === 1 ? 'ordem encontrada' : 'ordens encontradas'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Mecânico</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordensFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Nenhuma ordem encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  ordensFiltradas.map((ordem) => (
                    <TableRow key={ordem.id}>
                      <TableCell className="font-medium">{ordem.numero}</TableCell>
                      <TableCell>{ordem.placa}</TableCell>
                      <TableCell>{ordem.veiculo}</TableCell>
                      <TableCell>{ordem.cliente}</TableCell>
                      <TableCell>{ordem.mecanico}</TableCell>
                      <TableCell>
                        <Badge variant={statusMap[ordem.status].variant}>
                          {statusMap[ordem.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        R$ {ordem.valor.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {new Date(ordem.data).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleVerDetalhes(ordem.numero)}
                        >
                          <Eye className="size-4 mr-2" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
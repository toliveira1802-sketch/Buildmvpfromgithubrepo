import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Calendar, Car, Clock, User, Eye, Plus } from "lucide-react";

interface OS {
  id: number;
  cliente: string;
  veiculo: string;
  placa: string;
  status: string;
  dataEntrada: string;
  mecanico: string;
  prioridade: "baixa" | "media" | "alta";
}

const initialData: OS[] = [
  { id: 1, cliente: "João Silva", veiculo: "Honda Civic", placa: "ABC-1234", status: "Aguardando", dataEntrada: "2024-03-10", mecanico: "-", prioridade: "media" },
  { id: 2, cliente: "Maria Santos", veiculo: "Toyota Corolla", placa: "XYZ-5678", status: "Aguardando", dataEntrada: "2024-03-11", mecanico: "-", prioridade: "alta" },
  { id: 3, cliente: "Pedro Costa", veiculo: "Ford Focus", placa: "DEF-9012", status: "Em Diagnóstico", dataEntrada: "2024-03-09", mecanico: "Carlos", prioridade: "media" },
  { id: 4, cliente: "Ana Lima", veiculo: "VW Golf", placa: "GHI-3456", status: "Em Diagnóstico", dataEntrada: "2024-03-08", mecanico: "Roberto", prioridade: "baixa" },
  { id: 5, cliente: "Carlos Mendes", veiculo: "Hyundai HB20", placa: "JKL-7890", status: "Em Reparo", dataEntrada: "2024-03-07", mecanico: "Fernando", prioridade: "alta" },
  { id: 6, cliente: "Beatriz Oliveira", veiculo: "Fiat Argo", placa: "MNO-2345", status: "Em Reparo", dataEntrada: "2024-03-06", mecanico: "André", prioridade: "media" },
  { id: 7, cliente: "Ricardo Alves", veiculo: "Chevrolet Onix", placa: "PQR-6789", status: "Aguardando Peças", dataEntrada: "2024-03-05", mecanico: "Carlos", prioridade: "baixa" },
  { id: 8, cliente: "Fernanda Rocha", veiculo: "Jeep Renegade", placa: "STU-0123", status: "Controle de Qualidade", dataEntrada: "2024-03-04", mecanico: "Roberto", prioridade: "alta" },
  { id: 9, cliente: "Gustavo Pereira", veiculo: "Nissan Kicks", placa: "VWX-4567", status: "Concluído", dataEntrada: "2024-03-03", mecanico: "Fernando", prioridade: "media" },
];

const columns = [
  { id: "Aguardando", title: "Aguardando", color: "bg-slate-500" },
  { id: "Em Diagnóstico", title: "Em Diagnóstico", color: "bg-yellow-500" },
  { id: "Em Reparo", title: "Em Reparo", color: "bg-blue-500" },
  { id: "Aguardando Peças", title: "Aguardando Peças", color: "bg-orange-500" },
  { id: "Controle de Qualidade", title: "Controle de Qualidade", color: "bg-purple-500" },
  { id: "Concluído", title: "Concluído", color: "bg-green-500" }
];

function KanbanCard({ os, onClick }: { os: OS; onClick: () => void }) {
  const priorityColors = {
    baixa: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    media: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    alta: "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">OS #{os.id}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="size-3" />
              {os.cliente}
            </p>
          </div>
          <Badge variant="outline" className={`text-xs ${priorityColors[os.prioridade]}`}>
            {os.prioridade}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm flex items-center gap-1">
            <Car className="size-3" />
            {os.veiculo}
          </p>
          <p className="text-xs text-muted-foreground font-mono">{os.placa}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(os.dataEntrada).toLocaleDateString("pt-BR")}
          </span>
          {os.mecanico !== "-" && (
            <span className="flex items-center gap-1">
              <User className="size-3" />
              {os.mecanico}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function KanbanColumn({ column, ordens, onCardClick }: { column: typeof columns[0]; ordens: OS[]; onCardClick: (os: OS) => void }) {
  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-card rounded-lg border">
        <div className={`${column.color} text-white p-3 rounded-t-lg flex items-center justify-between`}>
          <h2 className="font-semibold">{column.title}</h2>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {ordens.length}
          </Badge>
        </div>
        <div className="p-3 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
          {ordens.map((os) => (
            <KanbanCard key={os.id} os={os} onClick={() => onCardClick(os)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPatio() {
  const navigate = useNavigate();
  const [ordens, setOrdens] = useState<OS[]>(initialData);

  useEffect(() => {
    document.title = "Pátio Kanban - Doctor Auto";
  }, []);

  const handleCardClick = (os: OS) => {
    navigate(`/admin/ordens-servico/${os.id}`);
  };

  const handleDrop = (osId: number, newStatus: string) => {
    setOrdens((prev) =>
      prev.map((os) => (os.id === osId ? { ...os, status: newStatus } : os))
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pátio Kanban</h1>
          <p className="text-muted-foreground">Visualização em tempo real das ordens de serviço</p>
        </div>
        <Button onClick={() => navigate("/admin/ordens-servico/nova")}>
          <Plus className="size-4 mr-2" />
          Nova OS
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {columns.map((col) => {
          const count = ordens.filter(os => os.status === col.id).length;
          return (
            <Card key={col.id} className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{col.title}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              ordens={ordens.filter((os) => os.status === column.id)}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

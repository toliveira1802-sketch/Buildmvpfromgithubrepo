import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { GripVertical, Car, User } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "../components/AdminLayout";

interface OS {
  id: number;
  numero: string;
  placa: string;
  veiculo: string;
  cliente: string;
  mecanico: string;
  status: string;
  valor: number;
  prioridade: "alta" | "media" | "baixa";
}

const initialData: OS[] = [
  { id: 1, numero: "OS-2024-001", placa: "ABC-1234", veiculo: "Honda Civic 2020", cliente: "João Silva", mecanico: "Thales", status: "diagnostico", valor: 1500, prioridade: "alta" },
  { id: 2, numero: "OS-2024-002", placa: "XYZ-5678", veiculo: "Toyota Corolla 2019", cliente: "Maria Santos", mecanico: "Marcos", status: "diagnostico", valor: 2200, prioridade: "media" },
  { id: 3, numero: "OS-2024-003", placa: "DEF-9012", veiculo: "Ford Ka 2021", cliente: "Pedro Costa", mecanico: "Rodrigo", status: "orcamento", valor: 800, prioridade: "baixa" },
  { id: 4, numero: "OS-2024-004", placa: "GHI-3456", veiculo: "VW Gol 2018", cliente: "Ana Lima", mecanico: "Thales", status: "orcamento", valor: 1200, prioridade: "media" },
  { id: 5, numero: "OS-2024-005", placa: "JKL-7890", veiculo: "Fiat Uno 2020", cliente: "Carlos Souza", mecanico: "Mauricio", status: "aguardando", valor: 3500, prioridade: "alta" },
  { id: 6, numero: "OS-2024-006", placa: "MNO-2345", veiculo: "Chevrolet Onix 2022", cliente: "Lucia Alves", mecanico: "Elias", status: "execucao", valor: 2800, prioridade: "alta" },
  { id: 7, numero: "OS-2024-007", placa: "PQR-6789", veiculo: "Nissan Kicks 2021", cliente: "Roberto Dias", mecanico: "Vitor", status: "execucao", valor: 4200, prioridade: "media" },
  { id: 8, numero: "OS-2024-008", placa: "STU-0123", veiculo: "Hyundai HB20 2019", cliente: "Fernanda Rocha", mecanico: "Marcos", status: "pronto", valor: 1800, prioridade: "baixa" },
];

const colunas = [
  { id: "diagnostico", titulo: "Diagnóstico", cor: "bg-purple-500" },
  { id: "orcamento", titulo: "Orçamento", cor: "bg-blue-500" },
  { id: "aguardando", titulo: "Aguardando Aprovação", cor: "bg-orange-500" },
  { id: "execucao", titulo: "Em Execução", cor: "bg-green-500" },
  { id: "pronto", titulo: "Pronto", cor: "bg-cyan-500" },
];

function OSCard({ os, onMove }: { os: OS; onMove: (id: number, newStatus: string) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "os",
    item: { id: os.id, status: os.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const prioridadeColors = {
    alta: "bg-red-500/20 text-red-400 border-red-500/50",
    media: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    baixa: "bg-green-500/20 text-green-400 border-green-500/50",
  };

  return (
    <div
      ref={drag}
      className={`${isDragging ? 'opacity-50' : 'opacity-100'} cursor-move`}
    >
      <Card className="hover:shadow-lg transition-all border-l-4 border-l-primary">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <GripVertical className="size-4 text-muted-foreground" />
                <span className="font-semibold text-sm">{os.numero}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="size-4" />
                <span className="font-medium">{os.placa}</span>
              </div>
            </div>
            <Badge variant="outline" className={prioridadeColors[os.prioridade]}>
              {os.prioridade}
            </Badge>
          </div>

          <div>
            <p className="text-sm font-medium">{os.veiculo}</p>
            <p className="text-xs text-muted-foreground">{os.cliente}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="size-3" />
              <span>{os.mecanico}</span>
            </div>
            <span className="text-sm font-semibold text-green-500">
              R$ {os.valor.toLocaleString('pt-BR')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Coluna({ 
  coluna, 
  osItems, 
  onDrop 
}: { 
  coluna: { id: string; titulo: string; cor: string }; 
  osItems: OS[]; 
  onDrop: (osId: number, newStatus: string) => void 
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "os",
    drop: (item: { id: number; status: string }) => {
      if (item.status !== coluna.id) {
        onDrop(item.id, coluna.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex flex-col h-full min-w-[280px] rounded-lg border-2 ${
        isOver ? 'border-primary bg-accent/20' : 'border-border bg-card'
      } transition-all`}
    >
      <div className={`p-4 rounded-t-lg ${coluna.cor} text-white`}>
        <h3 className="font-semibold">{coluna.titulo}</h3>
        <p className="text-sm opacity-90">{osItems.length} OS</p>
      </div>
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {osItems.map((os) => (
          <OSCard key={os.id} os={os} onMove={onDrop} />
        ))}
      </div>
    </div>
  );
}

export default function PatioKanban() {
  const [ordens, setOrdens] = useState<OS[]>(initialData);

  useEffect(() => {
    document.title = "Pátio Kanban - Doctor Auto";
  }, []);
  
  const handleDrop = (osId: number, newStatus: string) => {
    setOrdens((prev) =>
      prev.map((os) => (os.id === osId ? { ...os, status: newStatus } : os))
    );
    
    const os = ordens.find(o => o.id === osId);
    const colunaDestino = colunas.find(c => c.id === newStatus);
    
    toast.success(`${os?.numero} movida para ${colunaDestino?.titulo}`);
  };

  return (
    <AdminLayout>
      <DndProvider backend={HTML5Backend}>
        <div className="p-4 md:p-6 h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Pátio Kanban</h1>
            <p className="text-muted-foreground">
              Arraste e solte os cards para atualizar o status das ordens de serviço
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
            {colunas.map((coluna) => (
              <Coluna
                key={coluna.id}
                coluna={coluna}
                osItems={ordens.filter((os) => os.status === coluna.id)}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </AdminLayout>
  );
}
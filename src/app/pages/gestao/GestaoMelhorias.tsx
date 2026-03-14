import { useState } from "react";
import { Lightbulb, Plus, ThumbsUp, MessageSquare, CheckCircle2, Clock, User, ArrowUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface Melhoria {
  id: string;
  titulo: string;
  descricao: string;
  categoria: "processo" | "sistema" | "atendimento" | "estrutura" | "outro";
  prioridade: "baixa" | "media" | "alta";
  status: "proposta" | "em-analise" | "aprovada" | "implementada" | "rejeitada";
  autor: string;
  votos: number;
  comentarios: number;
  dataSubmissao: string;
  votadoPorMim: boolean;
}

export default function GestaoMelhorias() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<"todas" | Melhoria["status"]>("todas");
  const [ordenacao, setOrdenacao] = useState<"votos" | "recentes">("votos");

  const [melhorias, setMelhorias] = useState<Melhoria[]>([
    {
      id: "I001",
      titulo: "Sistema de notificação por WhatsApp",
      descricao: "Enviar atualizações de OS automaticamente via WhatsApp para os clientes",
      categoria: "sistema",
      prioridade: "alta",
      status: "aprovada",
      autor: "Carlos Silva",
      votos: 23,
      comentarios: 8,
      dataSubmissao: "2026-02-01",
      votadoPorMim: true,
    },
    {
      id: "I002",
      titulo: "Integração com sistema de estoque",
      descricao: "Conectar sistema de OS com controle de peças em tempo real",
      categoria: "sistema",
      prioridade: "alta",
      status: "em-analise",
      autor: "Maria Santos",
      votos: 18,
      comentarios: 12,
      dataSubmissao: "2026-02-05",
      votadoPorMim: false,
    },
    {
      id: "I003",
      titulo: "Área de descanso para mecânicos",
      descricao: "Criar espaço dedicado com sofá, café e micro-ondas",
      categoria: "estrutura",
      prioridade: "media",
      status: "proposta",
      autor: "Roberto Lima",
      votos: 15,
      comentarios: 5,
      dataSubmissao: "2026-02-08",
      votadoPorMim: true,
    },
    {
      id: "I004",
      titulo: "Processo de checklist pré-entrega",
      descricao: "Padronizar verificação antes de entregar veículo ao cliente",
      categoria: "processo",
      prioridade: "alta",
      status: "implementada",
      autor: "João Costa",
      votos: 21,
      comentarios: 6,
      dataSubmissao: "2026-01-15",
      votadoPorMim: false,
    },
    {
      id: "I005",
      titulo: "Pesquisa de satisfação automática",
      descricao: "Enviar formulário de feedback 24h após entrega",
      categoria: "atendimento",
      prioridade: "media",
      status: "proposta",
      autor: "Ana Oliveira",
      votos: 12,
      comentarios: 4,
      dataSubmissao: "2026-02-10",
      votadoPorMim: false,
    },
    {
      id: "I006",
      titulo: "Dashboard mobile para mecânicos",
      descricao: "App mobile para mecânicos visualizarem suas OS",
      categoria: "sistema",
      prioridade: "media",
      status: "em-analise",
      autor: "Pedro Souza",
      votos: 14,
      comentarios: 9,
      dataSubmissao: "2026-02-07",
      votadoPorMim: true,
    },
  ]);

  const [novaMelhoria, setNovaMelhoria] = useState({
    titulo: "",
    descricao: "",
    categoria: "processo" as Melhoria["categoria"],
    prioridade: "media" as Melhoria["prioridade"],
  });

  const melhoriasFiltradas = filtroStatus === "todas" 
    ? melhorias 
    : melhorias.filter(m => m.status === filtroStatus);

  const melhoriasPordenadas = [...melhoriasFiltradas].sort((a, b) => {
    if (ordenacao === "votos") return b.votos - a.votos;
    return new Date(b.dataSubmissao).getTime() - new Date(a.dataSubmissao).getTime();
  });

  const stats = {
    total: melhorias.length,
    propostas: melhorias.filter(m => m.status === "proposta").length,
    emAnalise: melhorias.filter(m => m.status === "em-analise").length,
    aprovadas: melhorias.filter(m => m.status === "aprovada").length,
    implementadas: melhorias.filter(m => m.status === "implementada").length,
  };

  const handleCriarMelhoria = () => {
    const melhoria: Melhoria = {
      id: `I${String(melhorias.length + 1).padStart(3, '0')}`,
      ...novaMelhoria,
      autor: "Você",
      votos: 1,
      comentarios: 0,
      dataSubmissao: new Date().toISOString().split('T')[0],
      status: "proposta",
      votadoPorMim: true,
    };
    setMelhorias([melhoria, ...melhorias]);
    setDialogOpen(false);
    toast.success("Melhoria proposta com sucesso!");
    setNovaMelhoria({
      titulo: "",
      descricao: "",
      categoria: "processo",
      prioridade: "media",
    });
  };

  const handleVotar = (id: string) => {
    setMelhorias(melhorias.map(m => {
      if (m.id === id) {
        if (m.votadoPorMim) {
          toast.info("Voto removido!");
          return { ...m, votos: m.votos - 1, votadoPorMim: false };
        } else {
          toast.success("Voto computado!");
          return { ...m, votos: m.votos + 1, votadoPorMim: true };
        }
      }
      return m;
    }));
  };

  const getStatusColor = (status: Melhoria["status"]) => {
    switch (status) {
      case "proposta": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "em-analise": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "aprovada": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "implementada": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "rejeitada": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getPrioridadeColor = (prioridade: Melhoria["prioridade"]) => {
    switch (prioridade) {
      case "alta": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "media": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "baixa": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getCategoriaColor = (categoria: Melhoria["categoria"]) => {
    switch (categoria) {
      case "processo": return "text-blue-500";
      case "sistema": return "text-purple-500";
      case "atendimento": return "text-green-500";
      case "estrutura": return "text-orange-500";
      case "outro": return "text-zinc-500";
      default: return "text-zinc-500";
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Lightbulb className="h-8 w-8 text-yellow-500" />
              Backlog de Melhorias
            </h1>
            <p className="text-zinc-400 mt-1">
              Proposta colaborativo e votação de melhorias para a oficina
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="h-4 w-4 mr-2" />
                Propor Melhoria
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Propor Nova Melhoria</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Compartilhe sua ideia para melhorar a oficina
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título da Melhoria</Label>
                  <Input
                    id="titulo"
                    value={novaMelhoria.titulo}
                    onChange={(e) => setNovaMelhoria({ ...novaMelhoria, titulo: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="Ex: Sistema de notificação por WhatsApp"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição Detalhada</Label>
                  <Textarea
                    id="descricao"
                    value={novaMelhoria.descricao}
                    onChange={(e) => setNovaMelhoria({ ...novaMelhoria, descricao: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    rows={4}
                    placeholder="Descreva sua ideia com detalhes..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={novaMelhoria.categoria} onValueChange={(v) => setNovaMelhoria({ ...novaMelhoria, categoria: v as Melhoria["categoria"] })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processo">Processo</SelectItem>
                        <SelectItem value="sistema">Sistema</SelectItem>
                        <SelectItem value="atendimento">Atendimento</SelectItem>
                        <SelectItem value="estrutura">Estrutura</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="prioridade">Prioridade Sugerida</Label>
                    <Select value={novaMelhoria.prioridade} onValueChange={(v) => setNovaMelhoria({ ...novaMelhoria, prioridade: v as Melhoria["prioridade"] })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCriarMelhoria} className="bg-yellow-600 hover:bg-yellow-700">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Propor
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

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300">Propostas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.propostas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-yellow-950 border-yellow-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-yellow-300">Em Análise</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.emAnalise}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300">Aprovadas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.aprovadas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-purple-950 border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-300">Implementadas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.implementadas}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filtros e Ordenação */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filtroStatus === "todas" ? "default" : "outline"}
              onClick={() => setFiltroStatus("todas")}
              size="sm"
              className={filtroStatus === "todas" ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              Todas
            </Button>
            <Button
              variant={filtroStatus === "proposta" ? "default" : "outline"}
              onClick={() => setFiltroStatus("proposta")}
              size="sm"
              className={filtroStatus === "proposta" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Propostas
            </Button>
            <Button
              variant={filtroStatus === "em-analise" ? "default" : "outline"}
              onClick={() => setFiltroStatus("em-analise")}
              size="sm"
              className={filtroStatus === "em-analise" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              Em Análise
            </Button>
            <Button
              variant={filtroStatus === "aprovada" ? "default" : "outline"}
              onClick={() => setFiltroStatus("aprovada")}
              size="sm"
              className={filtroStatus === "aprovada" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Aprovadas
            </Button>
            <Button
              variant={filtroStatus === "implementada" ? "default" : "outline"}
              onClick={() => setFiltroStatus("implementada")}
              size="sm"
              className={filtroStatus === "implementada" ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              Implementadas
            </Button>
          </div>

          <Select value={ordenacao} onValueChange={(v) => setOrdenacao(v as any)}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votos">Mais votadas</SelectItem>
              <SelectItem value="recentes">Mais recentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Melhorias */}
        <div className="space-y-4">
          {melhoriasPordenadas.map((melhoria, index) => (
            <Card key={melhoria.id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Votação */}
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVotar(melhoria.id)}
                      className={`w-12 h-12 rounded-full ${
                        melhoria.votadoPorMim 
                          ? "bg-green-600 border-green-500 text-white hover:bg-green-700" 
                          : "border-zinc-700 hover:bg-zinc-800"
                      }`}
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                    <span className={`text-lg font-bold ${melhoria.votadoPorMim ? "text-green-500" : "text-white"}`}>
                      {melhoria.votos}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {ordenacao === "votos" && index < 3 && (
                            <span className="text-2xl">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </span>
                          )}
                          <h3 className="text-xl font-bold text-white">{melhoria.titulo}</h3>
                        </div>
                        <p className="text-zinc-400 mb-3">{melhoria.descricao}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className={getStatusColor(melhoria.status)}>
                            {melhoria.status === "proposta" ? "Proposta" :
                             melhoria.status === "em-analise" ? "Em Análise" :
                             melhoria.status === "aprovada" ? "Aprovada" :
                             melhoria.status === "implementada" ? "✓ Implementada" :
                             "Rejeitada"}
                          </Badge>
                          <Badge className={getPrioridadeColor(melhoria.prioridade)}>
                            {melhoria.prioridade === "alta" ? "Alta Prioridade" :
                             melhoria.prioridade === "media" ? "Média Prioridade" :
                             "Baixa Prioridade"}
                          </Badge>
                          <Badge variant="outline" className="border-zinc-700">
                            <span className={getCategoriaColor(melhoria.categoria)}>
                              {melhoria.categoria}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {melhoria.autor}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(melhoria.dataSubmissao).toLocaleDateString("pt-BR")}
                      </div>
                      <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {melhoria.comentarios} comentários
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {melhoriasPordenadas.length === 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma melhoria encontrada</h3>
              <p className="text-zinc-400 mb-4">
                Seja o primeiro a propor uma melhoria!
              </p>
              <Button onClick={() => setDialogOpen(true)} className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="h-4 w-4 mr-2" />
                Propor Melhoria
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

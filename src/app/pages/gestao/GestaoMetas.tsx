import { useState } from "react";
import { Target, Plus, Edit2, Trash2, TrendingUp, Calendar, Users, DollarSign, Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
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

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "faturamento" | "os" | "clientes" | "satisfacao" | "produtividade";
  meta: number;
  realizado: number;
  unidade: string;
  periodo: "diario" | "semanal" | "mensal" | "trimestral" | "anual";
  responsavel: string;
  prazo: string;
  status: "atingida" | "em-progresso" | "atrasada";
}

export default function GestaoMetas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtro, setFiltro] = useState<"todas" | Meta["tipo"]>("todas");

  const [metas, setMetas] = useState<Meta[]>([
    {
      id: "M001",
      titulo: "Faturamento Mensal",
      descricao: "Atingir R$ 70.000 de faturamento no mês",
      tipo: "faturamento",
      meta: 70000,
      realizado: 63000,
      unidade: "R$",
      periodo: "mensal",
      responsavel: "Gestão",
      prazo: "28/02/2026",
      status: "em-progresso",
    },
    {
      id: "M002",
      titulo: "OS Concluídas",
      descricao: "Concluir 90 OS no mês",
      tipo: "os",
      meta: 90,
      realizado: 82,
      unidade: "",
      periodo: "mensal",
      responsavel: "Operacional",
      prazo: "28/02/2026",
      status: "em-progresso",
    },
    {
      id: "M003",
      titulo: "Novos Clientes",
      descricao: "Captar 15 novos clientes",
      tipo: "clientes",
      meta: 15,
      realizado: 12,
      unidade: "",
      periodo: "mensal",
      responsavel: "Comercial",
      prazo: "28/02/2026",
      status: "em-progresso",
    },
    {
      id: "M004",
      titulo: "Satisfação NPS",
      descricao: "Alcançar 90% de satisfação dos clientes",
      tipo: "satisfacao",
      meta: 90,
      realizado: 94,
      unidade: "%",
      periodo: "mensal",
      responsavel: "Qualidade",
      prazo: "28/02/2026",
      status: "atingida",
    },
    {
      id: "M005",
      titulo: "Produtividade por Mecânico",
      descricao: "Média de 5 OS por mecânico/dia",
      tipo: "produtividade",
      meta: 5,
      realizado: 4.2,
      unidade: "OS/dia",
      periodo: "mensal",
      responsavel: "Operacional",
      prazo: "28/02/2026",
      status: "em-progresso",
    },
  ]);

  const [novaMeta, setNovaMeta] = useState({
    titulo: "",
    descricao: "",
    tipo: "faturamento" as Meta["tipo"],
    meta: 0,
    unidade: "R$",
    periodo: "mensal" as Meta["periodo"],
    responsavel: "",
    prazo: "",
  });

  const metasFiltradas = filtro === "todas" 
    ? metas 
    : metas.filter(m => m.tipo === filtro);

  const stats = {
    totalMetas: metas.length,
    atingidas: metas.filter(m => m.status === "atingida").length,
    emProgresso: metas.filter(m => m.status === "em-progresso").length,
    atrasadas: metas.filter(m => m.status === "atrasada").length,
    percentualGeral: Math.round((metas.reduce((acc, m) => acc + (m.realizado / m.meta * 100), 0) / metas.length)),
  };

  const handleCriarMeta = () => {
    const meta: Meta = {
      id: `M${String(metas.length + 1).padStart(3, '0')}`,
      ...novaMeta,
      realizado: 0,
      status: "em-progresso",
    };
    setMetas([...metas, meta]);
    setDialogOpen(false);
    toast.success("Meta criada com sucesso!");
    setNovaMeta({
      titulo: "",
      descricao: "",
      tipo: "faturamento",
      meta: 0,
      unidade: "R$",
      periodo: "mensal",
      responsavel: "",
      prazo: "",
    });
  };

  const handleDeletarMeta = (id: string) => {
    setMetas(metas.filter(m => m.id !== id));
    toast.success("Meta deletada!");
  };

  const getStatusColor = (status: Meta["status"]) => {
    switch (status) {
      case "atingida": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "em-progresso": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "atrasada": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getTipoIcon = (tipo: Meta["tipo"]) => {
    switch (tipo) {
      case "faturamento": return <DollarSign className="h-5 w-5" />;
      case "os": return <Target className="h-5 w-5" />;
      case "clientes": return <Users className="h-5 w-5" />;
      case "satisfacao": return <Award className="h-5 w-5" />;
      case "produtividade": return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getTipoColor = (tipo: Meta["tipo"]) => {
    switch (tipo) {
      case "faturamento": return "text-green-500";
      case "os": return "text-blue-500";
      case "clientes": return "text-purple-500";
      case "satisfacao": return "text-yellow-500";
      case "produtividade": return "text-orange-500";
      default: return "text-zinc-500";
    }
  };

  const formatValue = (value: number, unidade: string) => {
    if (unidade === "R$") return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    if (unidade === "%") return `${value}%`;
    return `${value} ${unidade}`;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Target className="h-8 w-8 text-green-500" />
              Gestão de Metas
            </h1>
            <p className="text-zinc-400 mt-1">
              Defina, acompanhe e atinja suas metas estratégicas
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Defina os detalhes da nova meta estratégica
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título da Meta</Label>
                  <Input
                    id="titulo"
                    value={novaMeta.titulo}
                    onChange={(e) => setNovaMeta({ ...novaMeta, titulo: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={novaMeta.descricao}
                    onChange={(e) => setNovaMeta({ ...novaMeta, descricao: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={novaMeta.tipo} onValueChange={(v) => setNovaMeta({ ...novaMeta, tipo: v as Meta["tipo"] })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faturamento">Faturamento</SelectItem>
                        <SelectItem value="os">OS</SelectItem>
                        <SelectItem value="clientes">Clientes</SelectItem>
                        <SelectItem value="satisfacao">Satisfação</SelectItem>
                        <SelectItem value="produtividade">Produtividade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="periodo">Período</Label>
                    <Select value={novaMeta.periodo} onValueChange={(v) => setNovaMeta({ ...novaMeta, periodo: v as Meta["periodo"] })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="meta">Valor da Meta</Label>
                    <Input
                      id="meta"
                      type="number"
                      value={novaMeta.meta}
                      onChange={(e) => setNovaMeta({ ...novaMeta, meta: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unidade">Unidade</Label>
                    <Input
                      id="unidade"
                      value={novaMeta.unidade}
                      onChange={(e) => setNovaMeta({ ...novaMeta, unidade: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="Ex: R$, %, OS"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      value={novaMeta.responsavel}
                      onChange={(e) => setNovaMeta({ ...novaMeta, responsavel: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="prazo">Prazo</Label>
                    <Input
                      id="prazo"
                      type="date"
                      value={novaMeta.prazo}
                      onChange={(e) => setNovaMeta({ ...novaMeta, prazo: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCriarMeta} className="bg-green-600 hover:bg-green-700">
                  Criar Meta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total de Metas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.totalMetas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Atingidas
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.atingidas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300">Em Progresso</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.emProgresso}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-red-950 border-red-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-300">Atrasadas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.atrasadas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-purple-950 border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-300">% Médio</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.percentualGeral}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filtro === "todas" ? "default" : "outline"}
            onClick={() => setFiltro("todas")}
            className={filtro === "todas" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Todas ({metas.length})
          </Button>
          <Button
            variant={filtro === "faturamento" ? "default" : "outline"}
            onClick={() => setFiltro("faturamento")}
            className={filtro === "faturamento" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Faturamento
          </Button>
          <Button
            variant={filtro === "os" ? "default" : "outline"}
            onClick={() => setFiltro("os")}
            className={filtro === "os" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Target className="h-4 w-4 mr-2" />
            OS
          </Button>
          <Button
            variant={filtro === "clientes" ? "default" : "outline"}
            onClick={() => setFiltro("clientes")}
            className={filtro === "clientes" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            <Users className="h-4 w-4 mr-2" />
            Clientes
          </Button>
          <Button
            variant={filtro === "satisfacao" ? "default" : "outline"}
            onClick={() => setFiltro("satisfacao")}
            className={filtro === "satisfacao" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
          >
            <Award className="h-4 w-4 mr-2" />
            Satisfação
          </Button>
        </div>

        {/* Lista de Metas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {metasFiltradas.map((meta) => {
            const percentual = Math.round((meta.realizado / meta.meta) * 100);
            return (
              <Card key={meta.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`${getTipoColor(meta.tipo)}`}>
                        {getTipoIcon(meta.tipo)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{meta.titulo}</CardTitle>
                        <CardDescription className="text-zinc-400 text-sm mt-1">
                          {meta.descricao}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(meta.status)}>
                      {meta.status === "atingida" ? "✓ Atingida" : 
                       meta.status === "em-progresso" ? "Em Progresso" : 
                       "Atrasada"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progresso */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">
                        {formatValue(meta.realizado, meta.unidade)}
                      </span>
                      <span className="text-zinc-400">
                        / {formatValue(meta.meta, meta.unidade)}
                      </span>
                    </div>
                    <Progress value={percentual > 100 ? 100 : percentual} className="h-3" />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-zinc-400">{percentual}% completo</span>
                      {percentual >= 100 && (
                        <span className="text-sm text-green-500 font-semibold">🎉 Meta atingida!</span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-zinc-400">Período</div>
                      <div className="text-white capitalize">{meta.periodo}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Responsável</div>
                      <div className="text-white">{meta.responsavel}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Prazo</div>
                      <div className="text-white flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(meta.prazo).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit2 className="h-3 w-3 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                      onClick={() => handleDeletarMeta(meta.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {metasFiltradas.length === 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma meta encontrada</h3>
              <p className="text-zinc-400 mb-4">
                {filtro === "todas" 
                  ? "Crie sua primeira meta estratégica"
                  : `Nenhuma meta do tipo ${filtro} cadastrada`}
              </p>
              <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Meta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

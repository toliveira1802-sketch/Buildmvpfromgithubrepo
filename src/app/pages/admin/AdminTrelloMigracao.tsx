import { useState } from "react";
import { GitCompare, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Download, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface ItemSync {
  id: string;
  titulo: string;
  tipo: "os" | "tarefa" | "cliente";
  statusTrello: string;
  statusLocal: string;
  divergente: boolean;
  ultimaSync: string;
}

export default function AdminTrelloMigracao() {
  const [sincronizando, setSincronizando] = useState(false);
  const [direcao, setDirecao] = useState<"trello-to-local" | "local-to-trello" | "bidirectional">("bidirectional");
  const [progresso, setProgresso] = useState(0);

  const [itens, setItens] = useState<ItemSync[]>([
    {
      id: "OS001",
      titulo: "Troca de Motor - Honda Civic",
      tipo: "os",
      statusTrello: "Em Andamento",
      statusLocal: "Aguardando Peças",
      divergente: true,
      ultimaSync: "2026-03-13T10:00:00",
    },
    {
      id: "OS002",
      titulo: "Revisão Completa - Toyota Corolla",
      tipo: "os",
      statusTrello: "Concluído",
      statusLocal: "Concluído",
      divergente: false,
      ultimaSync: "2026-03-13T15:30:00",
    },
    {
      id: "T001",
      titulo: "Organizar estoque de peças",
      tipo: "tarefa",
      statusTrello: "A Fazer",
      statusLocal: "A Fazer",
      divergente: false,
      ultimaSync: "2026-03-13T09:00:00",
    },
    {
      id: "C001",
      titulo: "Cliente: João Silva",
      tipo: "cliente",
      statusTrello: "Ativo",
      statusLocal: "Ativo",
      divergente: false,
      ultimaSync: "2026-03-12T16:00:00",
    },
    {
      id: "OS003",
      titulo: "Suspensão - Ford Focus",
      tipo: "os",
      statusTrello: "Orçamento",
      statusLocal: "Aprovado",
      divergente: true,
      ultimaSync: "2026-03-13T14:20:00",
    },
  ]);

  const stats = {
    total: itens.length,
    sincronizados: itens.filter(i => !i.divergente).length,
    divergentes: itens.filter(i => i.divergente).length,
    os: itens.filter(i => i.tipo === "os").length,
    tarefas: itens.filter(i => i.tipo === "tarefa").length,
    clientes: itens.filter(i => i.tipo === "cliente").length,
  };

  const handleSincronizar = () => {
    setSincronizando(true);
    setProgresso(0);

    const interval = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSincronizando(false);
          
          // Atualizar itens para remover divergências
          setItens(itens.map(item => {
            if (item.divergente) {
              const novoStatus = direcao === "trello-to-local" 
                ? item.statusTrello 
                : direcao === "local-to-trello"
                ? item.statusLocal
                : item.statusTrello; // bidirectional usa Trello como fonte
              
              return {
                ...item,
                statusLocal: novoStatus,
                statusTrello: novoStatus,
                divergente: false,
                ultimaSync: new Date().toISOString(),
              };
            }
            return {
              ...item,
              ultimaSync: new Date().toISOString(),
            };
          }));

          toast.success("Sincronização concluída com sucesso!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSincronizarItem = (id: string) => {
    toast.loading("Sincronizando item...");
    setTimeout(() => {
      setItens(itens.map(item => {
        if (item.id === id) {
          return {
            ...item,
            statusLocal: item.statusTrello,
            divergente: false,
            ultimaSync: new Date().toISOString(),
          };
        }
        return item;
      }));
      toast.dismiss();
      toast.success("Item sincronizado!");
    }, 1500);
  };

  const getTipoColor = (tipo: ItemSync["tipo"]) => {
    switch (tipo) {
      case "os": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "tarefa": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "cliente": return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  const getDirecaoIcon = () => {
    switch (direcao) {
      case "trello-to-local": return <ArrowRight className="h-5 w-5" />;
      case "local-to-trello": return <ArrowLeft className="h-5 w-5" />;
      case "bidirectional": return <RefreshCw className="h-5 w-5" />;
    }
  };

  const getDirecaoLabel = () => {
    switch (direcao) {
      case "trello-to-local": return "Trello → Sistema Local";
      case "local-to-trello": return "Sistema Local → Trello";
      case "bidirectional": return "Sincronização Bidirecional";
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <GitCompare className="h-8 w-8 text-purple-500" />
              Sincronização Trello
            </h1>
            <p className="text-zinc-400 mt-1">
              Sincronize OS, tarefas e clientes com o Trello
            </p>
          </div>
          <Button
            onClick={handleSincronizar}
            disabled={sincronizando}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${sincronizando ? "animate-spin" : ""}`} />
            {sincronizando ? "Sincronizando..." : "Sincronizar Tudo"}
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Sincronizados
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.sincronizados}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-red-950 border-red-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Divergentes
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.divergentes}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-blue-950 border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-300">OS</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.os}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-purple-950 border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-300">Tarefas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.tarefas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-300">Clientes</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.clientes}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Config de Sincronização */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Configuração de Sincronização</CardTitle>
            <CardDescription className="text-zinc-400">
              Escolha a direção da sincronização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer transition-all ${
                  direcao === "trello-to-local"
                    ? "bg-blue-950 border-blue-600"
                    : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                }`}
                onClick={() => setDirecao("trello-to-local")}
              >
                <CardContent className="p-6 text-center">
                  <Download className="h-10 w-10 mx-auto mb-3 text-blue-500" />
                  <h3 className="font-semibold text-white mb-1">Importar do Trello</h3>
                  <p className="text-sm text-zinc-400">Sobrescrever dados locais com o Trello</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  direcao === "local-to-trello"
                    ? "bg-green-950 border-green-600"
                    : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                }`}
                onClick={() => setDirecao("local-to-trello")}
              >
                <CardContent className="p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-green-500" />
                  <h3 className="font-semibold text-white mb-1">Exportar para Trello</h3>
                  <p className="text-sm text-zinc-400">Sobrescrever Trello com dados locais</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  direcao === "bidirectional"
                    ? "bg-purple-950 border-purple-600"
                    : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                }`}
                onClick={() => setDirecao("bidirectional")}
              >
                <CardContent className="p-6 text-center">
                  <RefreshCw className="h-10 w-10 mx-auto mb-3 text-purple-500" />
                  <h3 className="font-semibold text-white mb-1">Bidirecional (Recomendado)</h3>
                  <p className="text-sm text-zinc-400">Mesclar alterações de ambos os lados</p>
                </CardContent>
              </Card>
            </div>

            {sincronizando && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold flex items-center gap-2">
                    {getDirecaoIcon()}
                    {getDirecaoLabel()}
                  </span>
                  <span className="text-white font-bold">{progresso}%</span>
                </div>
                <Progress value={progresso} className="h-3" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Itens */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Itens para Sincronizar</CardTitle>
            <CardDescription className="text-zinc-400">
              {stats.divergentes > 0
                ? `${stats.divergentes} ${stats.divergentes === 1 ? "item divergente encontrado" : "itens divergentes encontrados"}`
                : "Todos os itens estão sincronizados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {itens.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    item.divergente
                      ? "bg-red-950/20 border-red-800"
                      : "bg-zinc-800/50 border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {item.divergente ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        <h4 className="font-semibold text-white">{item.titulo}</h4>
                        <Badge className={getTipoColor(item.tipo)}>
                          {item.tipo.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 ml-8 text-sm">
                        <div>
                          <span className="text-zinc-400">Status Trello: </span>
                          <span className="text-blue-400 font-semibold">{item.statusTrello}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Status Local: </span>
                          <span className="text-green-400 font-semibold">{item.statusLocal}</span>
                        </div>
                      </div>

                      <div className="ml-8 mt-2 text-xs text-zinc-500">
                        Última sincronização: {new Date(item.ultimaSync).toLocaleString("pt-BR")}
                      </div>
                    </div>

                    {item.divergente && (
                      <Button
                        size="sm"
                        onClick={() => handleSincronizarItem(item.id)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Resolver
                      </Button>
                    )}
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

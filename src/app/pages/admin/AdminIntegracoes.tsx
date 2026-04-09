import { useState } from "react";
import { Plug, CheckCircle2, XCircle, AlertCircle, Settings, Key, RefreshCw, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { Label } from '../../shared/ui/label';
import { Switch } from '../../shared/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/ui/tabs';
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  tipo: "crm" | "comunicacao" | "produtividade" | "ia";
  status: "ativo" | "inativo" | "erro";
  ultimaSync: string;
  config: {
    apiKey?: string;
    webhook?: string;
    enabled: boolean;
  };
}

export default function AdminIntegracoes() {
  const [integracoes, setIntegracoes] = useState<Integracao[]>([
    {
      id: "kommo",
      nome: "Kommo CRM",
      descricao: "Sincronização de leads e contatos",
      tipo: "crm",
      status: "ativo",
      ultimaSync: "2026-03-13T16:45:00",
      config: {
        apiKey: "••••••••••••••••",
        webhook: "https://doctorauth.kommo.com/webhook",
        enabled: true,
      },
    },
    {
      id: "whatsapp",
      nome: "WhatsApp Business",
      descricao: "Notificações automáticas aos clientes",
      tipo: "comunicacao",
      status: "ativo",
      ultimaSync: "2026-03-13T17:00:00",
      config: {
        apiKey: "••••••••••••••••",
        enabled: true,
      },
    },
    {
      id: "trello",
      nome: "Trello",
      descricao: "Gestão de tarefas e OS",
      tipo: "produtividade",
      status: "inativo",
      ultimaSync: "2026-03-10T12:00:00",
      config: {
        apiKey: "",
        enabled: false,
      },
    },
    {
      id: "openai",
      nome: "OpenAI GPT-4",
      descricao: "Assistentes IA (Sophia, Simone, Raena)",
      tipo: "ia",
      status: "ativo",
      ultimaSync: "2026-03-13T17:10:00",
      config: {
        apiKey: "••••••••••••••••",
        enabled: true,
      },
    },
  ]);

  const [editando, setEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ apiKey: string; webhook: string }>({
    apiKey: "",
    webhook: "",
  });

  const handleToggle = (id: string) => {
    setIntegracoes(integracoes.map(int => {
      if (int.id === id) {
        const novoStatus = int.config.enabled ? "inativo" : "ativo";
        toast.success(`${int.nome} ${novoStatus === "ativo" ? "ativado" : "desativado"}!`);
        return {
          ...int,
          status: novoStatus,
          config: { ...int.config, enabled: !int.config.enabled },
        };
      }
      return int;
    }));
  };

  const handleEditar = (int: Integracao) => {
    setEditando(int.id);
    setFormData({
      apiKey: int.config.apiKey || "",
      webhook: int.config.webhook || "",
    });
  };

  const handleSalvar = (id: string) => {
    setIntegracoes(integracoes.map(int => {
      if (int.id === id) {
        return {
          ...int,
          config: {
            ...int.config,
            apiKey: formData.apiKey || int.config.apiKey,
            webhook: formData.webhook || int.config.webhook,
          },
        };
      }
      return int;
    }));
    setEditando(null);
    toast.success("Configuração salva com sucesso!");
  };

  const handleTestar = (int: Integracao) => {
    toast.loading(`Testando conexão com ${int.nome}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Conexão com ${int.nome} OK!`);
    }, 2000);
  };

  const handleSincronizar = (int: Integracao) => {
    toast.loading(`Sincronizando ${int.nome}...`);
    setTimeout(() => {
      setIntegracoes(integracoes.map(i => {
        if (i.id === int.id) {
          return { ...i, ultimaSync: new Date().toISOString() };
        }
        return i;
      }));
      toast.dismiss();
      toast.success(`${int.nome} sincronizado com sucesso!`);
    }, 3000);
  };

  const getStatusIcon = (status: Integracao["status"]) => {
    switch (status) {
      case "ativo": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "inativo": return <XCircle className="h-5 w-5 text-zinc-500" />;
      case "erro": return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Integracao["status"]) => {
    switch (status) {
      case "ativo": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "inativo": return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
      case "erro": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getTipoColor = (tipo: Integracao["tipo"]) => {
    switch (tipo) {
      case "crm": return "text-blue-500";
      case "comunicacao": return "text-green-500";
      case "produtividade": return "text-purple-500";
      case "ia": return "text-orange-500";
    }
  };

  const stats = {
    total: integracoes.length,
    ativas: integracoes.filter(i => i.status === "ativo").length,
    inativas: integracoes.filter(i => i.status === "inativo").length,
    erros: integracoes.filter(i => i.status === "erro").length,
  };

  const integracoesPorTipo = (tipo: Integracao["tipo"]) => 
    integracoes.filter(i => i.tipo === tipo);

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Plug className="h-8 w-8 text-blue-500" />
              Integrações
            </h1>
            <p className="text-zinc-400 mt-1">
              Configure conexões com serviços externos
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plug className="h-4 w-4 mr-2" />
            Adicionar Integração
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                Ativas
              </CardDescription>
              <CardTitle className="text-3xl text-white">{stats.ativas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Inativas</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.inativas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-red-950 border-red-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-300">Com Erro</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.erros}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs por Tipo */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
            <TabsTrigger value="produtividade">Produtividade</TabsTrigger>
            <TabsTrigger value="ia">IA</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {integracoes.map((int) => (
                <Card key={int.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(int.status)}
                        <div>
                          <CardTitle className="text-white text-lg">{int.nome}</CardTitle>
                          <CardDescription className="text-zinc-400 text-sm mt-1">
                            {int.descricao}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={getStatusColor(int.status)}>
                          {int.status}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-700">
                          <span className={getTipoColor(int.tipo)}>
                            {int.tipo}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Toggle */}
                    <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <Label htmlFor={`toggle-${int.id}`} className="text-white">
                        Ativar integração
                      </Label>
                      <Switch
                        id={`toggle-${int.id}`}
                        checked={int.config.enabled}
                        onCheckedChange={() => handleToggle(int.id)}
                      />
                    </div>

                    {/* Config */}
                    {editando === int.id ? (
                      <div className="space-y-3">
                        {int.config.apiKey !== undefined && (
                          <div>
                            <Label htmlFor={`apikey-${int.id}`}>API Key</Label>
                            <Input
                              id={`apikey-${int.id}`}
                              type="password"
                              value={formData.apiKey}
                              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                              className="bg-zinc-800 border-zinc-700"
                              placeholder="sk-..."
                            />
                          </div>
                        )}
                        {int.config.webhook !== undefined && (
                          <div>
                            <Label htmlFor={`webhook-${int.id}`}>Webhook URL</Label>
                            <Input
                              id={`webhook-${int.id}`}
                              value={formData.webhook}
                              onChange={(e) => setFormData({ ...formData, webhook: e.target.value })}
                              className="bg-zinc-800 border-zinc-700"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSalvar(int.id)}
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <Save className="h-3 w-3 mr-2" />
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditando(null)}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-sm text-zinc-400">
                          Última sincronização:{" "}
                          <span className="text-white">
                            {new Date(int.ultimaSync).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditar(int)}
                            className="flex-1"
                          >
                            <Settings className="h-3 w-3 mr-2" />
                            Configurar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestar(int)}
                            className="flex-1"
                            disabled={!int.config.enabled}
                          >
                            <Key className="h-3 w-3 mr-2" />
                            Testar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSincronizar(int)}
                            className="bg-blue-600 hover:bg-blue-700 flex-1"
                            disabled={!int.config.enabled}
                          >
                            <RefreshCw className="h-3 w-3 mr-2" />
                            Sincronizar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tabs individuais por tipo */}
          {(["crm", "comunicacao", "produtividade", "ia"] as const).map((tipo) => (
            <TabsContent key={tipo} value={tipo}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {integracoesPorTipo(tipo).map((int) => (
                  <Card key={int.id} className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(int.status)}
                          <div>
                            <CardTitle className="text-white text-lg">{int.nome}</CardTitle>
                            <CardDescription className="text-zinc-400 text-sm mt-1">
                              {int.descricao}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(int.status)}>
                          {int.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                        <Label htmlFor={`toggle-${int.id}-${tipo}`} className="text-white">
                          Ativar integração
                        </Label>
                        <Switch
                          id={`toggle-${int.id}-${tipo}`}
                          checked={int.config.enabled}
                          onCheckedChange={() => handleToggle(int.id)}
                        />
                      </div>
                      <div className="text-sm text-zinc-400">
                        Última sincronização:{" "}
                        <span className="text-white">
                          {new Date(int.ultimaSync).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditar(int)}
                          className="flex-1"
                        >
                          <Settings className="h-3 w-3 mr-2" />
                          Configurar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSincronizar(int)}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                          disabled={!int.config.enabled}
                        >
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Sincronizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}

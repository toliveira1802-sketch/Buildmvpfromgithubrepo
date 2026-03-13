import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Brain,
  MessageSquare,
  TrendingUp,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Cpu,
  Database,
  RefreshCw
} from "lucide-react";
import { Button } from "../components/ui/button";
import DevLayout from "../components/DevLayout";

interface AIService {
  name: string;
  status: "online" | "offline" | "maintenance";
  requests: number;
  avgResponseTime: number;
  successRate: number;
  lastUsed: string;
  icon: any;
  color: string;
}

export default function DevDashboard() {
  useEffect(() => {
    document.title = "Painel Desenvolvedor - Doctor Auto";
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const aiServices: AIService[] = [
    {
      name: "Análise Preditiva de Manutenção",
      status: "online",
      requests: 1247,
      avgResponseTime: 342,
      successRate: 98.5,
      lastUsed: "2 min atrás",
      icon: Brain,
      color: "text-purple-500"
    },
    {
      name: "Chatbot de Atendimento",
      status: "online",
      requests: 3821,
      avgResponseTime: 156,
      successRate: 99.2,
      lastUsed: "agora mesmo",
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      name: "Otimização de Preços",
      status: "maintenance",
      requests: 892,
      avgResponseTime: 521,
      successRate: 97.1,
      lastUsed: "1 hora atrás",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      name: "Detecção de Anomalias",
      status: "online",
      requests: 654,
      avgResponseTime: 278,
      successRate: 99.8,
      lastUsed: "5 min atrás",
      icon: Zap,
      color: "text-yellow-500"
    },
    {
      name: "Recomendação de Serviços",
      status: "online",
      requests: 2104,
      avgResponseTime: 412,
      successRate: 96.3,
      lastUsed: "10 min atrás",
      icon: BarChart3,
      color: "text-orange-500"
    },
    {
      name: "Processamento de Imagens",
      status: "offline",
      requests: 0,
      avgResponseTime: 0,
      successRate: 0,
      lastUsed: "nunca",
      icon: Cpu,
      color: "text-red-500"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Online</Badge>;
      case "offline":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Offline</Badge>;
      case "maintenance":
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Manutenção</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const stats = {
    totalRequests: aiServices.reduce((acc, service) => acc + service.requests, 0),
    servicesOnline: aiServices.filter(s => s.status === "online").length,
    avgSuccessRate: (aiServices.reduce((acc, service) => acc + service.successRate, 0) / aiServices.length).toFixed(1),
    avgResponseTime: Math.round(aiServices.reduce((acc, service) => acc + service.avgResponseTime, 0) / aiServices.length)
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Monitoramento de IA</h1>
            <p className="text-zinc-400 mt-1">
              Acompanhamento em tempo real das APIs inteligentes
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Total de Requisições</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.totalRequests.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Serviços Online</CardDescription>
              <CardTitle className="text-3xl text-white">
                {stats.servicesOnline}/{aiServices.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>{Math.round((stats.servicesOnline / aiServices.length) * 100)}% disponível</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Taxa de Sucesso Média</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.avgSuccessRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-blue-500">
                <BarChart3 className="w-4 h-4" />
                <span>Excelente performance</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Tempo de Resposta Médio</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.avgResponseTime}ms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-yellow-500">
                <Clock className="w-4 h-4" />
                <span>Dentro do esperado</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Services Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Serviços de IA Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-zinc-800`}>
                        <Icon className={`w-6 h-6 ${service.color}`} />
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                    <CardTitle className="text-white mt-3">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-zinc-500">Requisições</p>
                        <p className="text-white font-semibold">{service.requests.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Taxa de Sucesso</p>
                        <p className="text-white font-semibold">{service.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Resp. Média</p>
                        <p className="text-white font-semibold">{service.avgResponseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Último Uso</p>
                        <p className="text-white font-semibold">{service.lastUsed}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Performance</span>
                        <span>{service.successRate}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            service.successRate >= 98 
                              ? "bg-green-500" 
                              : service.successRate >= 95 
                              ? "bg-yellow-500" 
                              : "bg-red-500"
                          }`}
                          style={{ width: `${service.successRate}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* System Info */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-red-500" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-zinc-500">Versão</p>
              <p className="text-white font-semibold">1.0.0-MVP</p>
            </div>
            <div>
              <p className="text-zinc-500">Ambiente</p>
              <p className="text-white font-semibold">Desenvolvimento</p>
            </div>
            <div>
              <p className="text-zinc-500">Banco de Dados</p>
              <p className="text-white font-semibold">Supabase (acuufrgoyjwzlyhopaus)</p>
            </div>
            <div>
              <p className="text-zinc-500">Última Atualização</p>
              <p className="text-white font-semibold">13/03/2026 às 15:42</p>
            </div>
          </CardContent>
        </Card>

        {/* API Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-950 to-zinc-900 border-blue-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                APIs em Desenvolvimento
              </CardTitle>
              <CardDescription className="text-blue-300">
                Próximas integrações planejadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="border-blue-500 text-blue-400">Em Breve</Badge>
                <span className="text-white">Análise de Sentimento (Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="border-blue-500 text-blue-400">Em Breve</Badge>
                <span className="text-white">Previsão de Demanda</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="border-blue-500 text-blue-400">Em Breve</Badge>
                <span className="text-white">OCR para Documentos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="border-blue-500 text-blue-400">Em Breve</Badge>
                <span className="text-white">Assistente Virtual por Voz</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950 to-zinc-900 border-purple-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Modelos de IA Integrados
              </CardTitle>
              <CardDescription className="text-purple-300">
                Tecnologias utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">GPT-4 Turbo</span>
                <Badge className="bg-green-500">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">Claude 3.5 Sonnet</span>
                <Badge className="bg-green-500">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">TensorFlow</span>
                <Badge className="bg-green-500">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">YOLO v8 (Visão)</span>
                <Badge variant="secondary">Standby</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DevLayout>
  );
}

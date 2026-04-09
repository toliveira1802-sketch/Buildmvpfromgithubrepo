import { useEffect } from "react";
import DevLayout from "../../components/DevLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Server, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from '../../shared/ui/badge';

export default function DevAPI() {
  useEffect(() => {
    document.title = "API - Doctor Auto DEV";
  }, []);

  const endpoints = [
    {
      method: "GET",
      path: "/api/users",
      status: "active",
      latency: "45ms",
      requests: "1.2k"
    },
    {
      method: "POST",
      path: "/api/auth/login",
      status: "active",
      latency: "120ms",
      requests: "850"
    },
    {
      method: "GET",
      path: "/api/vehicles",
      status: "active",
      latency: "67ms",
      requests: "3.4k"
    },
    {
      method: "POST",
      path: "/api/orders",
      status: "active",
      latency: "89ms",
      requests: "2.1k"
    },
    {
      method: "PUT",
      path: "/api/orders/:id",
      status: "active",
      latency: "95ms",
      requests: "890"
    },
    {
      method: "DELETE",
      path: "/api/orders/:id",
      status: "warning",
      latency: "150ms",
      requests: "120"
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-500/10 text-blue-500";
      case "POST":
        return "bg-green-500/10 text-green-500";
      case "PUT":
        return "bg-orange-500/10 text-orange-500";
      case "DELETE":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-zinc-500/10 text-zinc-500";
    }
  };

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Server className="size-8" />
            API Management
          </h1>
          <p className="text-zinc-400 mt-1">
            Monitoramento e gerenciamento de endpoints
          </p>
        </div>

        {/* AVISO DE DESENVOLVIMENTO */}
        <Card className="bg-orange-950 border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-orange-200 font-semibold">Em Desenvolvimento</p>
                <p className="text-orange-300 text-sm mt-1">
                  Os dados de API abaixo são simulados. Integração com métricas reais em breve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Total de Endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">24</div>
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <CheckCircle2 className="size-3" />
                Todos ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Latência Média</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">78ms</div>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                <Clock className="size-3" />
                Última hora
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Requests/min</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">142</div>
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                +12% vs ontem
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Endpoints Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Endpoints Disponíveis</CardTitle>
            <CardDescription className="text-zinc-400">
              Lista de todos os endpoints da API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {endpoints.map((endpoint, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge className={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm text-zinc-300 font-mono">
                      {endpoint.path}
                    </code>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">Latência</div>
                      <div className="text-sm text-white">{endpoint.latency}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">Requests</div>
                      <div className="text-sm text-white">{endpoint.requests}</div>
                    </div>
                    {endpoint.status === "active" ? (
                      <CheckCircle2 className="size-5 text-green-500" />
                    ) : (
                      <AlertCircle className="size-5 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DevLayout>
  );
}
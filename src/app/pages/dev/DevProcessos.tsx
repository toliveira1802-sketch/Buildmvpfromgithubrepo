import { useEffect } from "react";
import DevLayout from "../../components/DevLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Activity, Cpu, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Badge } from '../../shared/ui/badge';
import { Progress } from '../../shared/ui/progress';

export default function DevProcessos() {
  useEffect(() => {
    document.title = "Processos - Doctor Auto DEV";
  }, []);

  const processes = [
    {
      id: 1,
      name: "API Server",
      status: "running",
      cpu: 12,
      memory: 245,
      uptime: "5d 12h"
    },
    {
      id: 2,
      name: "Database Connection Pool",
      status: "running",
      cpu: 8,
      memory: 180,
      uptime: "5d 12h"
    },
    {
      id: 3,
      name: "Background Jobs",
      status: "running",
      cpu: 5,
      memory: 95,
      uptime: "2d 8h"
    },
    {
      id: 4,
      name: "Cache Service",
      status: "warning",
      cpu: 15,
      memory: 320,
      uptime: "1d 3h"
    },
    {
      id: 5,
      name: "Email Queue",
      status: "stopped",
      cpu: 0,
      memory: 0,
      uptime: "-"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge className="bg-green-500/10 text-green-500">
            <CheckCircle2 className="size-3 mr-1" />
            Running
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-orange-500/10 text-orange-500">
            <AlertCircle className="size-3 mr-1" />
            Warning
          </Badge>
        );
      case "stopped":
        return (
          <Badge className="bg-red-500/10 text-red-500">
            <XCircle className="size-3 mr-1" />
            Stopped
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Activity className="size-8" />
            Processos do Sistema
          </h1>
          <p className="text-zinc-400 mt-1">
            Monitoramento de processos e serviços
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
                  Monitoramento de processos em tempo real será implementado. Dados abaixo são simulados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Processos Ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">3/5</div>
              <p className="text-xs text-zinc-500 mt-1">60% dos processos</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Uso de CPU</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">40%</div>
              <Progress value={40} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Uso de Memória</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">840 MB</div>
              <Progress value={65} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Processes List */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Processos</CardTitle>
            <CardDescription className="text-zinc-400">
              Lista de todos os processos do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processes.map((process) => (
                <div
                  key={process.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-700"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Cpu className="size-5 text-zinc-500" />
                    <div>
                      <div className="text-sm font-medium text-white">
                        {process.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        Uptime: {process.uptime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">CPU</div>
                      <div className="text-sm text-white">{process.cpu}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">Memory</div>
                      <div className="text-sm text-white">{process.memory} MB</div>
                    </div>
                    {getStatusBadge(process.status)}
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
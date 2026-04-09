import { useEffect, useState } from "react";
import DevLayout from "../../components/DevLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Activity, AlertCircle, CheckCircle2, Info, XCircle, RefreshCw } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  source: string;
}

export default function DevLogs() {
  useEffect(() => {
    document.title = "Logs do Sistema - Doctor Auto DEV";
  }, []);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Sistema iniciado com sucesso",
      source: "System"
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: "success",
      message: "Conexão com banco de dados estabelecida",
      source: "Database"
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      level: "warning",
      message: "Uso de memória em 75%",
      source: "Performance"
    }
  ]);

  const getLevelIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "info":
        return <Info className="size-4 text-blue-500" />;
      case "warning":
        return <AlertCircle className="size-4 text-orange-500" />;
      case "error":
        return <XCircle className="size-4 text-red-500" />;
      case "success":
        return <CheckCircle2 className="size-4 text-green-500" />;
    }
  };

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "info":
        return "bg-blue-500/10 text-blue-500";
      case "warning":
        return "bg-orange-500/10 text-orange-500";
      case "error":
        return "bg-red-500/10 text-red-500";
      case "success":
        return "bg-green-500/10 text-green-500";
    }
  };

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Activity className="size-8" />
              Logs do Sistema
            </h1>
            <p className="text-zinc-400 mt-1">
              Monitoramento em tempo real de atividades e eventos
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="size-4" />
            Atualizar
          </Button>
        </div>

        {/* AVISO DE DESENVOLVIMENTO */}
        <Card className="bg-orange-950 border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-orange-200 font-semibold">Em Desenvolvimento</p>
                <p className="text-orange-300 text-sm mt-1">
                  Esta funcionalidade está sendo implementada. Os logs abaixo são apenas exemplos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Logs Recentes</CardTitle>
            <CardDescription className="text-zinc-400">
              Últimas atividades registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700"
                >
                  <div className="mt-0.5">{getLevelIcon(log.level)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-zinc-500">{log.source}</span>
                    </div>
                    <p className="text-sm text-white">{log.message}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(log.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-zinc-500 text-sm">
          Sistema de logs em desenvolvimento. Mais funcionalidades em breve.
        </div>
      </div>
    </DevLayout>
  );
}
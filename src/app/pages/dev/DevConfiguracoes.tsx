import { useEffect } from "react";
import DevLayout from "../../components/DevLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Settings, Database, Server, Shield, Bell, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";

export default function DevConfiguracoes() {
  useEffect(() => {
    document.title = "Configurações - Doctor Auto DEV";
  }, []);

  const configSections = [
    {
      icon: Database,
      title: "Banco de Dados",
      description: "Configurações de conexão e performance",
      settings: [
        { label: "Pool de conexões", enabled: true },
        { label: "Cache de queries", enabled: true },
        { label: "Logs de queries", enabled: false },
      ]
    },
    {
      icon: Server,
      title: "Servidor",
      description: "Configurações do servidor de aplicação",
      settings: [
        { label: "Modo debug", enabled: false },
        { label: "Hot reload", enabled: true },
        { label: "Compressão GZIP", enabled: true },
      ]
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Controles de segurança e autenticação",
      settings: [
        { label: "Autenticação 2FA", enabled: false },
        { label: "Rate limiting", enabled: true },
        { label: "CORS restrito", enabled: true },
      ]
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Alertas e notificações do sistema",
      settings: [
        { label: "Email de erros", enabled: true },
        { label: "Slack notifications", enabled: false },
        { label: "SMS críticos", enabled: false },
      ]
    }
  ];

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Settings className="size-8" />
            Configurações do Sistema
          </h1>
          <p className="text-zinc-400 mt-1">
            Gerencie as configurações e parâmetros do sistema
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
                  As configurações abaixo não estão conectadas ao backend ainda. São apenas exemplos visuais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {configSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Icon className="size-5" />
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.settings.map((setting, settingIdx) => (
                    <div key={settingIdx} className="flex items-center justify-between">
                      <Label htmlFor={`${idx}-${settingIdx}`} className="text-zinc-300">
                        {setting.label}
                      </Label>
                      <Switch 
                        id={`${idx}-${settingIdx}`}
                        defaultChecked={setting.enabled}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-red-600 hover:bg-red-700">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </DevLayout>
  );
}
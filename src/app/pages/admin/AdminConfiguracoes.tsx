import { useState } from "react";
import {
  Settings,
  Building2,
  User,
  Bell,
  Lock,
  Palette,
  Database,
  Save,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

export default function AdminConfiguracoes() {
  const [empresaData, setEmpresaData] = useState({
    nome: "Doctor Auto Oficina Mecânica",
    cnpj: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@doctorauto.com.br",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
  });

  const [notificacoes, setNotificacoes] = useState({
    emailNovaSO: true,
    emailSOConcluida: true,
    emailAgendamento: false,
    smsCliente: true,
    smsLembrete: false,
  });

  const [sistema, setSistema] = useState({
    darkMode: true,
    autoBackup: true,
    loginDuplo: false,
    logAuditoria: true,
  });

  const handleSaveEmpresa = () => {
    toast.success("Dados da empresa salvos com sucesso!");
  };

  const handleSaveNotificacoes = () => {
    toast.success("Configurações de notificações salvas!");
  };

  const handleSaveSistema = () => {
    toast.success("Configurações do sistema salvas!");
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-zinc-400 mt-1">
            Gerencie as configurações do sistema
          </p>
        </div>

        {/* Dados da Empresa */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Informações gerais da empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-zinc-300">Nome da Empresa</Label>
                <Input
                  value={empresaData.nome}
                  onChange={(e) =>
                    setEmpresaData({ ...empresaData, nome: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-zinc-300">CNPJ</Label>
                <Input
                  value={empresaData.cnpj}
                  onChange={(e) =>
                    setEmpresaData({ ...empresaData, cnpj: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    value={empresaData.telefone}
                    onChange={(e) =>
                      setEmpresaData({ ...empresaData, telefone: e.target.value })
                    }
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-zinc-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    type="email"
                    value={empresaData.email}
                    onChange={(e) =>
                      setEmpresaData({ ...empresaData, email: e.target.value })
                    }
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-zinc-300">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    value={empresaData.endereco}
                    onChange={(e) =>
                      setEmpresaData({ ...empresaData, endereco: e.target.value })
                    }
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-zinc-300">Cidade</Label>
                <Input
                  value={empresaData.cidade}
                  onChange={(e) =>
                    setEmpresaData({ ...empresaData, cidade: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-300">Estado</Label>
                  <Input
                    value={empresaData.estado}
                    onChange={(e) =>
                      setEmpresaData({ ...empresaData, estado: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label className="text-zinc-300">CEP</Label>
                  <Input
                    value={empresaData.cep}
                    onChange={(e) =>
                      setEmpresaData({ ...empresaData, cep: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="flex justify-end">
              <Button onClick={handleSaveEmpresa} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Configure como deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Email - Nova Ordem de Serviço</Label>
                  <p className="text-sm text-zinc-400">
                    Receba email quando uma nova OS for criada
                  </p>
                </div>
                <Switch
                  checked={notificacoes.emailNovaSO}
                  onCheckedChange={(checked) =>
                    setNotificacoes({ ...notificacoes, emailNovaSO: checked })
                  }
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Email - OS Concluída</Label>
                  <p className="text-sm text-zinc-400">
                    Receba email quando uma OS for concluída
                  </p>
                </div>
                <Switch
                  checked={notificacoes.emailSOConcluida}
                  onCheckedChange={(checked) =>
                    setNotificacoes({ ...notificacoes, emailSOConcluida: checked })
                  }
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Email - Novo Agendamento</Label>
                  <p className="text-sm text-zinc-400">
                    Receba email quando houver um novo agendamento
                  </p>
                </div>
                <Switch
                  checked={notificacoes.emailAgendamento}
                  onCheckedChange={(checked) =>
                    setNotificacoes({ ...notificacoes, emailAgendamento: checked })
                  }
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">SMS - Notificações aos Clientes</Label>
                  <p className="text-sm text-zinc-400">
                    Envie SMS automático aos clientes
                  </p>
                </div>
                <Switch
                  checked={notificacoes.smsCliente}
                  onCheckedChange={(checked) =>
                    setNotificacoes({ ...notificacoes, smsCliente: checked })
                  }
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">SMS - Lembretes de Agendamento</Label>
                  <p className="text-sm text-zinc-400">
                    Envie lembretes 24h antes dos agendamentos
                  </p>
                </div>
                <Switch
                  checked={notificacoes.smsLembrete}
                  onCheckedChange={(checked) =>
                    setNotificacoes({ ...notificacoes, smsLembrete: checked })
                  }
                />
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="flex justify-end">
              <Button onClick={handleSaveNotificacoes} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sistema */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Sistema
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Configurações gerais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Modo Escuro</Label>
                  <p className="text-sm text-zinc-400">
                    Utilize o tema escuro no sistema
                  </p>
                </div>
                <Switch
                  checked={sistema.darkMode}
                  onCheckedChange={(checked) =>
                    setSistema({ ...sistema, darkMode: checked })
                  }
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Backup Automático</Label>
                  <p className="text-sm text-zinc-400">
                    Realiza backup diário automático dos dados
                  </p>
                </div>
                <Switch
                  checked={sistema.autoBackup}
                  onCheckedChange={(checked) =>
                    setSistema({ ...sistema, autoBackup: checked })
                  }
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Login em Múltiplos Dispositivos</Label>
                  <p className="text-sm text-zinc-400">
                    Permite login simultâneo em mais de um dispositivo
                  </p>
                </div>
                <Switch
                  checked={sistema.loginDuplo}
                  onCheckedChange={(checked) =>
                    setSistema({ ...sistema, loginDuplo: checked })
                  }
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Log de Auditoria</Label>
                  <p className="text-sm text-zinc-400">
                    Registra todas as ações dos usuários no sistema
                  </p>
                </div>
                <Switch
                  checked={sistema.logAuditoria}
                  onCheckedChange={(checked) =>
                    setSistema({ ...sistema, logAuditoria: checked })
                  }
                />
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="flex justify-end">
              <Button onClick={handleSaveSistema} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Alterar senha e configurações de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Senha Atual</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div></div>
              <div>
                <Label className="text-zinc-300">Nova Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Confirmar Nova Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="flex justify-end">
              <Button
                onClick={() => toast.success("Senha alterada com sucesso!")}
                className="bg-red-600 hover:bg-red-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

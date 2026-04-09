import { useEffect } from "react";
import DevLayout from "../../components/DevLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Shield, Users, Lock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from '../../shared/ui/badge';
import { AlertCircle } from "lucide-react";

export default function DevPermissoes() {
  useEffect(() => {
    document.title = "Permissões - Doctor Auto DEV";
  }, []);

  const roles = [
    {
      name: "Dev",
      color: "text-red-500 bg-red-500/10",
      users: 2,
      permissions: ["full_access", "delete", "modify_system", "view_logs"]
    },
    {
      name: "Gestão",
      color: "text-purple-500 bg-purple-500/10",
      users: 5,
      permissions: ["view_reports", "manage_users", "view_finances", "edit_settings"]
    },
    {
      name: "Consultor",
      color: "text-blue-500 bg-blue-500/10",
      users: 12,
      permissions: ["view_clients", "create_orders", "edit_orders", "view_vehicles"]
    },
    {
      name: "Mecânico",
      color: "text-orange-500 bg-orange-500/10",
      users: 8,
      permissions: ["view_orders", "update_status", "view_vehicles"]
    }
  ];

  const permissions = [
    { key: "full_access", label: "Acesso Total" },
    { key: "delete", label: "Deletar Registros" },
    { key: "modify_system", label: "Modificar Sistema" },
    { key: "view_logs", label: "Ver Logs" },
    { key: "view_reports", label: "Ver Relatórios" },
    { key: "manage_users", label: "Gerenciar Usuários" },
    { key: "view_finances", label: "Ver Financeiro" },
    { key: "edit_settings", label: "Editar Configurações" },
    { key: "view_clients", label: "Ver Clientes" },
    { key: "create_orders", label: "Criar OS" },
    { key: "edit_orders", label: "Editar OS" },
    { key: "view_vehicles", label: "Ver Veículos" },
    { key: "update_status", label: "Atualizar Status" }
  ];

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="size-8" />
            Gerenciamento de Permissões
          </h1>
          <p className="text-zinc-400 mt-1">
            Controle de acesso e permissões por perfil
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
                  A matriz de permissões abaixo é um exemplo visual. Sistema de permissões dinâmico em breve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role, idx) => (
            <Card key={idx} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <Badge className={role.color}>{role.name}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Users className="size-4" />
                  <span>{role.users} usuários</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                  <Lock className="size-4" />
                  <span>{role.permissions.length} permissões</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permissions Matrix */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Matriz de Permissões</CardTitle>
            <CardDescription className="text-zinc-400">
              Visualize quais perfis têm acesso a cada funcionalidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                      Permissão
                    </th>
                    {roles.map((role) => (
                      <th key={role.name} className="text-center py-3 px-4 text-zinc-400 font-medium">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.key} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="py-3 px-4 text-zinc-300 text-sm">
                        {permission.label}
                      </td>
                      {roles.map((role) => (
                        <td key={role.name} className="py-3 px-4 text-center">
                          {role.permissions.includes(permission.key) ? (
                            <CheckCircle2 className="size-5 text-green-500 inline-block" />
                          ) : (
                            <XCircle className="size-5 text-zinc-700 inline-block" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DevLayout>
  );
}
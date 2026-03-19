import { Cpu, Activity, Brain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";

const MOCK = [
  { label: "Uptime do Sistema", value: "99.8%", color: "text-green-400" },
  { label: "Usuários Ativos", value: "12", color: "text-blue-400" },
  { label: "OS Processadas Hoje", value: "24", color: "text-white" },
  { label: "Taxa de Erros", value: "0.1%", color: "text-yellow-400" },
];

const IAS = [
  { nome: "Agente SQL", status: "ativo", desc: "Executa migrations e queries no banco" },
  { nome: "Assistente Consultor", status: "ativo", desc: "Auxilia consultores no atendimento" },
  { nome: "Análise de OS", status: "inativo", desc: "Sugere diagnósticos baseado no histórico" },
];

export default function GestaoTecnologia() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2"><Cpu className="h-8 w-8 text-purple-400" /> Tecnologia</h1>
          <p className="text-zinc-400 mt-1">Status do sistema e gerenciamento de IAs</p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-purple-400" /> KPIs do Sistema</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK.map(k => (
              <Card key={k.label} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardDescription className="text-zinc-400 text-xs">{k.label}</CardDescription>
                  <CardTitle className={`text-3xl ${k.color}`}>{k.value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2"><Brain className="h-4 w-4 text-purple-400" /> Assistentes IA</h2>
          <div className="space-y-3">
            {IAS.map(ia => (
              <div key={ia.nome} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{ia.nome}</p>
                  <p className="text-zinc-400 text-sm">{ia.desc}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${ia.status === "ativo" ? "text-green-400 bg-green-400/10 border-green-400/30" : "text-zinc-500 bg-zinc-800 border-zinc-700"}`}>
                  {ia.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

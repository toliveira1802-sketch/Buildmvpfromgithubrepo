import { Brain, Construction } from "lucide-react";
import DevLayout from "../../components/DevLayout";

export default function DevDashboardIA() {
  return (
    <DevLayout>
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-center mx-auto">
            <Brain className="size-10 text-purple-400" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Construction className="size-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">Em Desenvolvimento</span>
          </div>
          <h1 className="text-2xl font-bold text-white">/dashboardIA</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Dashboard central do hub de IA — monitoramento de todos os agentes, métricas de uso, logs em tempo real e controle de orçamento de tokens.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left space-y-2">
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Funcionalidades previstas</p>
            {[
              "Monitoramento de todos os agentes (Sophia, Simone, Ana, Follow-up, Monitor)",
              "Métricas de requisições, latência e custo por agente",
              "Log de conversas em tempo real",
              "Controle de orçamento de tokens por empresa",
              "Alertas de anomalia e performance",
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-purple-400 text-xs mt-0.5">▸</span>
                <span className="text-zinc-400 text-xs">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DevLayout>
  );
}

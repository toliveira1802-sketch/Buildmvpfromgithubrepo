import { Bot, Construction } from "lucide-react";
import DevLayout from "../../components/DevLayout";

export default function DevOutrasHub() {
  return (
    <DevLayout>
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-blue-900/40 border border-blue-700/50 flex items-center justify-center mx-auto">
            <Bot className="size-10 text-blue-400" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Construction className="size-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">Em Desenvolvimento</span>
          </div>
          <h1 className="text-2xl font-bold text-white">/outras-do-hub</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Outros componentes do hub de IA — integrações com WhatsApp, Z-API, OpenAI, webhooks e configuração avançada dos agentes.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left space-y-2">
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Funcionalidades previstas</p>
            {[
              "Integração Z-API / WhatsApp para agente Ana",
              "Configuração de webhooks por agente",
              "Gerenciamento de prompts e memória dos agentes",
              "Testes de agente em sandbox",
              "Histórico de conversas e análise de qualidade",
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blue-400 text-xs mt-0.5">▸</span>
                <span className="text-zinc-400 text-xs">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DevLayout>
  );
}

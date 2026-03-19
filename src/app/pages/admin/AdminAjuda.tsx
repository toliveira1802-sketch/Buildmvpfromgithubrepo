import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Card } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
const FAQ = [
  { q:"Como abrir uma nova OS?", r:"Vá em Ordens de Serviço > Nova OS ou clique em Nova OS no Dashboard." },
  { q:"Como avancar o status de uma OS?", r:"Abra a OS e clique em Avancar Status no final da pagina de detalhes." },
  { q:"Como cadastrar um cliente?", r:"Clientes sao criados automaticamente ao abrir uma Nova OS. Preencha os dados na tela de criacao." },
  { q:"Como adicionar um mecanico?", r:"Apenas o DEV pode criar mecanicos em /dev-users. Entre em contato com o administrador do sistema." },
  { q:"Como ver o historico de uma OS?", r:"Abra a OS em Ordens de Servico e veja a secao Historico no final da pagina." },
  { q:"O que significa cada status da OS?", r:"diagnostico > orcamento > aguardando aprovacao > aprovado > em execucao > concluido > entregue. Cancelado pode acontecer em qualquer etapa." },
  { q:"Como ver os veiculos no patio?", r:"Acesse Patio no menu lateral para ver o Kanban com todos os veiculos ativos." },
  { q:"Como gerar relatorios?", r:"Acesse Relatorios no menu lateral para ver metricas e exportar dados." },
];
export default function AdminAjuda() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><HelpCircle className="h-8 w-8 text-blue-400"/>Ajuda</h1>
          <p className="text-zinc-400 mt-1">Perguntas frequentes do sistema</p></div>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <button onClick={() => setOpen(open===i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors">
                <span className="text-white font-medium">{item.q}</span>
                {open===i ? <ChevronUp className="h-4 w-4 text-zinc-400 flex-shrink-0"/> : <ChevronDown className="h-4 w-4 text-zinc-400 flex-shrink-0"/>}
              </button>
              {open===i && (
                <div className="px-5 pb-4 border-t border-zinc-800">
                  <p className="text-zinc-300 pt-3 text-sm leading-relaxed">{item.r}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
        <Card className="bg-blue-950/30 border-blue-800 p-4">
          <p className="text-blue-300 text-sm">Precisa de mais ajuda? Contate o DEV em <code className="text-blue-400">Dev_thales</code></p>
        </Card>
      </div>
    </AdminLayout>
  );
}
import { useState } from "react";
import { Settings, Save, RotateCcw, Sparkles, Sliders } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Slider } from "../../components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

interface ConfigIA {
  id: string;
  nome: string;
  role: string;
  systemPrompt: string;
  temperatura: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export default function DevPerfilIA() {
  const [configs, setConfigs] = useState<ConfigIA[]>([
    {
      id: "sophia",
      nome: "Sophia",
      role: "Gestão & Processos",
      systemPrompt: `Você é Sophia, uma assistente de IA especializada em gestão de processos e melhoria contínua para oficinas mecânicas.

Suas responsabilidades:
- Analisar fluxos de trabalho e identificar gargalos
- Sugerir otimizações de processos
- Ajudar na definição de metas e KPIs
- Propor melhorias na eficiência operacional

Seu tom de comunicação é profissional, analítico e orientado a resultados. Sempre baseie suas recomendações em dados quando disponíveis.`,
      temperatura: 0.7,
      maxTokens: 500,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.3,
    },
    {
      id: "simone",
      nome: "Simone",
      role: "Qualidade & Analytics",
      systemPrompt: `Você é Simone, uma assistente de IA especializada em análise de dados e controle de qualidade para oficinas mecânicas.

Suas responsabilidades:
- Analisar indicadores de performance (KPIs)
- Identificar padrões em dados de satisfação do cliente
- Detectar anomalias e oportunidades de melhoria
- Gerar insights baseados em dados históricos

Seu tom de comunicação é técnico, baseado em dados e focado em qualidade. Sempre cite métricas e percentuais quando relevante.`,
      temperatura: 0.5,
      maxTokens: 600,
      topP: 0.85,
      frequencyPenalty: 0.2,
      presencePenalty: 0.2,
    },
    {
      id: "raena",
      nome: "Raena",
      role: "Lead Scoring & CRM",
      systemPrompt: `Você é Raena, uma assistente de IA especializada em vendas, CRM e relacionamento com clientes para oficinas mecânicas.

Suas responsabilidades:
- Analisar leads e calcular scores de conversão
- Sugerir estratégias de relacionamento com clientes
- Identificar oportunidades de upsell e cross-sell
- Recomendar ações para aumentar retenção de clientes

Seu tom de comunicação é empático, focado em relacionamento e orientado a vendas. Sempre pense na perspectiva do cliente.`,
      temperatura: 0.8,
      maxTokens: 450,
      topP: 0.95,
      frequencyPenalty: 0.4,
      presencePenalty: 0.4,
    },
  ]);

  const [editando, setEditando] = useState<string | null>(null);

  const handleSalvar = (id: string) => {
    toast.success(`Configuração de ${configs.find(c => c.id === id)?.nome} salva!`);
    setEditando(null);
  };

  const handleResetar = (id: string) => {
    toast.info(`Configuração de ${configs.find(c => c.id === id)?.nome} resetada para padrão!`);
  };

  const handleTestar = (id: string) => {
    const config = configs.find(c => c.id === id);
    toast.loading(`Testando ${config?.nome}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${config?.nome} está respondendo corretamente!`);
    }, 2000);
  };

  const updateConfig = (id: string, field: keyof ConfigIA, value: any) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Settings className="h-8 w-8 text-orange-500" />
              Configuração dos Perfis IA
            </h1>
            <p className="text-zinc-400 mt-1">
              Ajuste system prompts, temperatura e parâmetros dos agentes
            </p>
          </div>
          <Badge className="bg-orange-600 text-lg px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            GPT-4
          </Badge>
        </div>

        {/* Tabs por Agente */}
        <Tabs defaultValue="sophia" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            {configs.map((config) => (
              <TabsTrigger key={config.id} value={config.id}>
                {config.nome}
              </TabsTrigger>
            ))}
          </TabsList>

          {configs.map((config) => (
            <TabsContent key={config.id} value={config.id}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Prompt */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white">System Prompt</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Defina a personalidade e comportamento de {config.nome}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`prompt-${config.id}`} className="text-white">
                          Prompt do Sistema
                        </Label>
                        <Textarea
                          id={`prompt-${config.id}`}
                          value={config.systemPrompt}
                          onChange={(e) => updateConfig(config.id, "systemPrompt", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white min-h-[300px] font-mono text-sm"
                          placeholder="Digite o system prompt..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSalvar(config.id)}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Prompt
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleResetar(config.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Resetar
                        </Button>
                        <Button
                          onClick={() => handleTestar(config.id)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Testar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Parâmetros */}
                <div className="space-y-4">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Sliders className="h-5 w-5" />
                        Parâmetros
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Ajuste fino do comportamento
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Temperatura */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Temperatura</Label>
                          <Badge className="bg-blue-600">{config.temperatura}</Badge>
                        </div>
                        <Slider
                          value={[config.temperatura]}
                          onValueChange={(value) => updateConfig(config.id, "temperatura", value[0])}
                          min={0}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <p className="text-xs text-zinc-400">
                          Controla a criatividade. 0 = determinístico, 2 = muito criativo
                        </p>
                      </div>

                      {/* Max Tokens */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Max Tokens</Label>
                          <Badge className="bg-green-600">{config.maxTokens}</Badge>
                        </div>
                        <Slider
                          value={[config.maxTokens]}
                          onValueChange={(value) => updateConfig(config.id, "maxTokens", value[0])}
                          min={100}
                          max={2000}
                          step={50}
                          className="w-full"
                        />
                        <p className="text-xs text-zinc-400">
                          Tamanho máximo da resposta
                        </p>
                      </div>

                      {/* Top P */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Top P</Label>
                          <Badge className="bg-purple-600">{config.topP}</Badge>
                        </div>
                        <Slider
                          value={[config.topP]}
                          onValueChange={(value) => updateConfig(config.id, "topP", value[0])}
                          min={0}
                          max={1}
                          step={0.05}
                          className="w-full"
                        />
                        <p className="text-xs text-zinc-400">
                          Controla a diversidade de vocabulário
                        </p>
                      </div>

                      {/* Frequency Penalty */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Frequency Penalty</Label>
                          <Badge className="bg-orange-600">{config.frequencyPenalty}</Badge>
                        </div>
                        <Slider
                          value={[config.frequencyPenalty]}
                          onValueChange={(value) => updateConfig(config.id, "frequencyPenalty", value[0])}
                          min={0}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <p className="text-xs text-zinc-400">
                          Penaliza repetição de palavras
                        </p>
                      </div>

                      {/* Presence Penalty */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Presence Penalty</Label>
                          <Badge className="bg-red-600">{config.presencePenalty}</Badge>
                        </div>
                        <Slider
                          value={[config.presencePenalty]}
                          onValueChange={(value) => updateConfig(config.id, "presencePenalty", value[0])}
                          min={0}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <p className="text-xs text-zinc-400">
                          Incentiva novos tópicos
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Info do Agente */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Informações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <div className="text-zinc-400">Nome</div>
                        <div className="text-white font-semibold">{config.nome}</div>
                      </div>
                      <div>
                        <div className="text-zinc-400">Role</div>
                        <div className="text-white font-semibold">{config.role}</div>
                      </div>
                      <div>
                        <div className="text-zinc-400">Modelo</div>
                        <div className="text-white font-semibold">GPT-4</div>
                      </div>
                      <div>
                        <div className="text-zinc-400">Status</div>
                        <Badge className="bg-green-600">Ativo</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Preview de Resposta */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Preview de Resposta</CardTitle>
            <CardDescription className="text-zinc-400">
              Teste como o agente responderia com as configurações atuais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {configs.map((config) => (
                <Card key={config.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-purple-600">{config.nome}</Badge>
                      <span className="text-xs text-zinc-400">T={config.temperatura}</span>
                    </div>
                    <p className="text-sm text-zinc-300 italic">
                      "Com base na análise dos últimos 30 dias, identifico que..."
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Badge variant="outline" className="text-xs border-zinc-600">
                        {config.maxTokens} tokens
                      </Badge>
                      <Badge variant="outline" className="text-xs border-zinc-600">
                        Top-P {config.topP}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

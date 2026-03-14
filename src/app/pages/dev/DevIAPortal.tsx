import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, Brain, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import AdminLayout from "../../components/AdminLayout";

interface Mensagem {
  id: string;
  autor: "user" | "sophia" | "simone" | "raena";
  conteudo: string;
  timestamp: string;
}

interface Agente {
  id: "sophia" | "simone" | "raena";
  nome: string;
  role: string;
  cor: string;
  avatar: string;
  descricao: string;
}

export default function DevIAPortal() {
  const [agenteAtivo, setAgenteAtivo] = useState<Agente["id"]>("sophia");
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState<Mensagem[]>([
    {
      id: "1",
      autor: "sophia",
      conteudo: "Olá! Sou a Sophia, sua assistente de Gestão e Processos. Como posso ajudar você hoje?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [digitando, setDigitando] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const agentes: Agente[] = [
    {
      id: "sophia",
      nome: "Sophia",
      role: "Gestão & Processos",
      cor: "bg-purple-600",
      avatar: "S",
      descricao: "Especialista em gestão, processos e melhoria contínua",
    },
    {
      id: "simone",
      nome: "Simone",
      role: "Qualidade & Analytics",
      cor: "bg-blue-600",
      avatar: "Si",
      descricao: "Analista de dados e controle de qualidade",
    },
    {
      id: "raena",
      nome: "Raena",
      role: "Lead Scoring & CRM",
      cor: "bg-green-600",
      avatar: "R",
      descricao: "Especialista em vendas e relacionamento com clientes",
    },
  ];

  const agenteAtual = agentes.find(a => a.id === agenteAtivo)!;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [conversas]);

  const handleEnviar = async () => {
    if (!mensagem.trim()) return;

    const novaMensagemUser: Mensagem = {
      id: Date.now().toString(),
      autor: "user",
      conteudo: mensagem,
      timestamp: new Date().toISOString(),
    };

    setConversas([...conversas, novaMensagemUser]);
    setMensagem("");
    setDigitando(true);

    // Simular resposta da IA
    setTimeout(() => {
      const respostaIA: Mensagem = {
        id: (Date.now() + 1).toString(),
        autor: agenteAtivo,
        conteudo: gerarResposta(agenteAtivo, mensagem),
        timestamp: new Date().toISOString(),
      };

      setConversas(prev => [...prev, respostaIA]);
      setDigitando(false);
    }, 1500);
  };

  const gerarResposta = (agente: Agente["id"], pergunta: string): string => {
    const respostas = {
      sophia: [
        "Entendo sua preocupação sobre processos. Baseado nos dados, sugiro implementar um checklist pré-entrega para reduzir retrabalho.",
        "Analisando o fluxo atual, identifico 3 gargalos principais que podemos otimizar: aprovação de orçamento, aguardo de peças e comunicação com clientes.",
        "Para melhorar a eficiência operacional, recomendo revisar o processo de agendamento e implementar slots de tempo mais realistas.",
      ],
      simone: [
        "Com base na análise de dados dos últimos 30 dias, a taxa de satisfação está em 94%, mas há oportunidade de melhoria na comunicação durante o serviço.",
        "Os indicadores mostram que o tempo médio de ciclo está 13% acima da meta. Sugiro focar nas etapas de diagnóstico e aprovação de orçamento.",
        "A qualidade do serviço está excelente, mas identifiquei que 15% das OS têm retrabalho. Vamos investigar as causas raiz?",
      ],
      raena: [
        "Analisando os leads, 23 estão com alta temperatura (>70°C). Recomendo contato imediato com estes prospects.",
        "O score médio dos leads melhorou 18% este mês. Os leads vindos do Instagram têm 35% mais chance de conversão.",
        "Identifiquei 5 clientes VIP que não retornam há mais de 60 dias. Sugiro uma campanha de reativação personalizada.",
      ],
    };

    const respostasAgente = respostas[agente];
    return respostasAgente[Math.floor(Math.random() * respostasAgente.length)];
  };

  const handleTrocarAgente = (novoAgente: Agente["id"]) => {
    setAgenteAtivo(novoAgente);
    
    const mensagemBoasVindas: Mensagem = {
      id: Date.now().toString(),
      autor: novoAgente,
      conteudo: `Olá! Sou a ${agentes.find(a => a.id === novoAgente)?.nome}. ${agentes.find(a => a.id === novoAgente)?.descricao}. Como posso ajudar?`,
      timestamp: new Date().toISOString(),
    };

    setConversas(prev => [...prev, mensagemBoasVindas]);
  };

  const getAvatarColor = (autor: Mensagem["autor"]) => {
    if (autor === "user") return "bg-zinc-700";
    const agente = agentes.find(a => a.id === autor);
    return agente?.cor || "bg-zinc-700";
  };

  const getAutorNome = (autor: Mensagem["autor"]) => {
    if (autor === "user") return "Você";
    const agente = agentes.find(a => a.id === autor);
    return agente?.nome || "IA";
  };

  const getAvatarInitials = (autor: Mensagem["autor"]) => {
    if (autor === "user") return "U";
    const agente = agentes.find(a => a.id === autor);
    return agente?.avatar || "IA";
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Bot className="h-8 w-8 text-purple-500" />
              Portal IA Multi-Agente
            </h1>
            <p className="text-zinc-400 mt-1">
              Chat com 3 assistentes especializadas: Sophia, Simone e Raena
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Agentes */}
          <div className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Agentes Disponíveis</CardTitle>
                <CardDescription className="text-zinc-400">
                  Escolha sua assistente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {agentes.map((agente) => (
                  <Card
                    key={agente.id}
                    className={`cursor-pointer transition-all ${
                      agenteAtivo === agente.id
                        ? "bg-gradient-to-r from-purple-950 to-blue-950 border-purple-600"
                        : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    }`}
                    onClick={() => handleTrocarAgente(agente.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar>
                          <AvatarFallback className={`${agente.cor} text-white font-bold`}>
                            {agente.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-white">{agente.nome}</h4>
                          <p className="text-xs text-zinc-400">{agente.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-300">{agente.descricao}</p>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Stats do Agente Ativo */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-zinc-400">Conversas</div>
                  <div className="text-2xl font-bold text-white">
                    {conversas.filter(c => c.autor === agenteAtivo).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Temperatura IA</div>
                  <div className="text-2xl font-bold text-white">0.7</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Modelo</div>
                  <div className="text-sm font-semibold text-white">GPT-4</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-zinc-900 border-zinc-800 h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className={`${agenteAtual.cor} text-white font-bold`}>
                        {agenteAtual.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white">{agenteAtual.nome}</CardTitle>
                      <CardDescription className="text-zinc-400">
                        {agenteAtual.role}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${agenteAtual.cor} text-white`}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
              </CardHeader>

              {/* Mensagens */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatRef}>
                {conversas.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.autor === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.autor !== "user" && (
                      <Avatar className="flex-shrink-0">
                        <AvatarFallback className={`${getAvatarColor(msg.autor)} text-white font-bold`}>
                          {getAvatarInitials(msg.autor)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`max-w-[70%] ${msg.autor === "user" ? "order-first" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">
                          {getAutorNome(msg.autor)}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          msg.autor === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-100"
                        }`}
                      >
                        {msg.conteudo}
                      </div>
                    </div>

                    {msg.autor === "user" && (
                      <Avatar className="flex-shrink-0">
                        <AvatarFallback className="bg-zinc-700 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {digitando && (
                  <div className="flex gap-3 justify-start">
                    <Avatar>
                      <AvatarFallback className={`${agenteAtual.cor} text-white font-bold`}>
                        {agenteAtual.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex gap-2">
                  <Input
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleEnviar()}
                    placeholder={`Converse com ${agenteAtual.nome}...`}
                    className="bg-zinc-800 border-zinc-700 text-white flex-1"
                  />
                  <Button
                    onClick={handleEnviar}
                    disabled={!mensagem.trim() || digitando}
                    className={`${agenteAtual.cor}`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    Analisar OS
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Sugerir Melhorias
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Insights
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

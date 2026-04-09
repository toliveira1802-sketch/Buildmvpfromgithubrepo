import { useEffect } from "react";
import DevLayout from "../../components/DevLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Wrench, Terminal, Database, Code, FileJson, GitBranch } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { AlertCircle } from "lucide-react";

export default function DevFerramentas() {
  useEffect(() => {
    document.title = "Ferramentas - Doctor Auto DEV";
  }, []);

  const tools = [
    {
      icon: Terminal,
      title: "Terminal Integrado",
      description: "Execute comandos diretamente no sistema",
      color: "text-green-500 bg-green-500/10",
      action: "Abrir Terminal"
    },
    {
      icon: Database,
      title: "Query Builder",
      description: "Construtor visual de queries SQL",
      color: "text-blue-500 bg-blue-500/10",
      action: "Abrir Builder"
    },
    {
      icon: Code,
      title: "Code Snippets",
      description: "Biblioteca de trechos de código úteis",
      color: "text-purple-500 bg-purple-500/10",
      action: "Ver Snippets"
    },
    {
      icon: FileJson,
      title: "JSON Formatter",
      description: "Formatador e validador de JSON",
      color: "text-orange-500 bg-orange-500/10",
      action: "Abrir Formatter"
    },
    {
      icon: GitBranch,
      title: "Git Manager",
      description: "Gerenciador de branches e commits",
      color: "text-red-500 bg-red-500/10",
      action: "Abrir Git"
    },
    {
      icon: Wrench,
      title: "System Tools",
      description: "Ferramentas de manutenção do sistema",
      color: "text-cyan-500 bg-cyan-500/10",
      action: "Ver Ferramentas"
    }
  ];

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Wrench className="size-8" />
            Ferramentas de Desenvolvimento
          </h1>
          <p className="text-zinc-400 mt-1">
            Utilitários e ferramentas para desenvolvedores
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
                  As ferramentas abaixo ainda não estão implementadas. Funcionalidades serão adicionadas em breve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Card key={idx} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                    <Icon className="size-6" />
                  </div>
                  <CardTitle className="text-white text-lg">{tool.title}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {tool.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Ferramentas Externas</CardTitle>
            <CardDescription className="text-zinc-400">
              Links para ferramentas e recursos externos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-sm text-zinc-400 hover:text-white transition-colors"
            >
              → GitHub Repository
            </a>
            <a 
              href="https://vercel.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-sm text-zinc-400 hover:text-white transition-colors"
            >
              → Vercel Dashboard
            </a>
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-sm text-zinc-400 hover:text-white transition-colors"
            >
              → Supabase Console
            </a>
            <a 
              href="#" 
              className="block text-sm text-zinc-400 hover:text-white transition-colors"
            >
              → Monitoring Dashboard
            </a>
          </CardContent>
        </Card>
      </div>
    </DevLayout>
  );
}
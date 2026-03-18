import { useEffect } from "react";
import DevLayout from "../../components/DevLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { BookOpen, FileText, Code, Terminal, Layers, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function DevDocumentacao() {
  useEffect(() => {
    document.title = "Documentação - Doctor Auto DEV";
  }, []);

  const docSections = [
    {
      icon: Code,
      title: "API Documentation",
      description: "Documentação completa da API REST",
      link: "/api/docs",
      color: "text-blue-500 bg-blue-500/10"
    },
    {
      icon: Terminal,
      title: "CLI Commands",
      description: "Comandos disponíveis para desenvolvedores",
      link: "/cli/docs",
      color: "text-green-500 bg-green-500/10"
    },
    {
      icon: Layers,
      title: "Arquitetura",
      description: "Visão geral da arquitetura do sistema",
      link: "/architecture",
      color: "text-purple-500 bg-purple-500/10"
    },
    {
      icon: FileText,
      title: "Guias e Tutoriais",
      description: "Guias passo a passo para desenvolvimento",
      link: "/guides",
      color: "text-orange-500 bg-orange-500/10"
    }
  ];

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BookOpen className="size-8" />
            Documentação
          </h1>
          <p className="text-zinc-400 mt-1">
            Central de documentação técnica e guias
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
                  A documentação está sendo escrita. Os links abaixo ainda não estão funcionais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-3`}>
                    <Icon className="size-6" />
                  </div>
                  <CardTitle className="text-white">{section.title}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Acessar Documentação
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Links Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="#" className="block text-sm text-zinc-400 hover:text-white transition-colors">
              → Changelog e Versões
            </a>
            <a href="#" className="block text-sm text-zinc-400 hover:text-white transition-colors">
              → Roadmap de Desenvolvimento
            </a>
            <a href="#" className="block text-sm text-zinc-400 hover:text-white transition-colors">
              → FAQ para Desenvolvedores
            </a>
            <a href="#" className="block text-sm text-zinc-400 hover:text-white transition-colors">
              → Contribuindo com o Projeto
            </a>
          </CardContent>
        </Card>
      </div>
    </DevLayout>
  );
}
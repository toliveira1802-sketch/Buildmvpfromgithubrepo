import { HelpCircle, Book, MessageCircle, Video, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import AdminLayout from "../../components/AdminLayout";

export default function AdminAjuda() {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Central de Ajuda</h1>
          <p className="text-zinc-400 mt-1">Recursos e suporte para usar o sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
            <CardContent className="pt-6">
              <Book className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Documentação</h3>
              <p className="text-sm text-zinc-400">Guias completos e tutoriais</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
            <CardContent className="pt-6">
              <Video className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Vídeo Aulas</h3>
              <p className="text-sm text-zinc-400">Aprenda assistindo</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
            <CardContent className="pt-6">
              <MessageCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Chat de Suporte</h3>
              <p className="text-sm text-zinc-400">Fale com nossa equipe</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
            <CardContent className="pt-6">
              <FileText className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">FAQ</h3>
              <p className="text-sm text-zinc-400">Perguntas frequentes</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Como criar uma nova ordem de serviço?</h4>
              <p className="text-zinc-400 text-sm">
                Acesse "Ordens de Serviço" no menu lateral e clique em "Nova OS". Preencha os dados do cliente e veículo.
              </p>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Como cadastrar um novo cliente?</h4>
              <p className="text-zinc-400 text-sm">
                Vá em "Clientes" e clique em "Novo Cliente". Preencha as informações obrigatórias.
              </p>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Como funciona o sistema de gamificação?</h4>
              <p className="text-zinc-400 text-sm">
                Mecânicos ganham pontos ao concluir OS. Quanto melhor o desempenho, mais pontos e badges são conquistados.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-950 to-zinc-900 border-blue-800">
          <CardContent className="py-8 text-center">
            <HelpCircle className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Precisa de mais ajuda?</h3>
            <p className="text-zinc-300 mb-6">Nossa equipe está pronta para ajudar</p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Abrir Chat
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-950">
                <FileText className="h-4 w-4 mr-2" />
                Ver Documentação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

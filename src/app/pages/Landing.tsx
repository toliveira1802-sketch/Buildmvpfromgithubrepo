import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Code } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Doctor Auto - Sistema de Gestão de Oficina";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <img 
            src="figma:asset/c84924fffe8eefdfa83c8a6fa6d7ef2e7b310b86.png" 
            alt="Doctor Auto Logo" 
            className="w-24 h-24"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Doctor Auto
          </h1>
          <p className="text-xl text-zinc-400 border-t border-zinc-800 pt-4 inline-block px-8">
            Sistema de Gestão Automotiva
          </p>
        </div>

        {/* Descrição */}
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Plataforma completa para gestão de oficinas automotivas. Controle operacional,
          financeiro e produtividade em um só lugar.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-lg min-w-[240px]"
            onClick={() => navigate("/login")}
          >
            Acessar Sistema
            <span className="ml-2">→</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-6 text-lg font-semibold rounded-lg min-w-[240px]"
            onClick={() => navigate("/dev-login")}
          >
            <Code className="mr-2 h-5 w-5" />
            Acesso do Desenvolvedor
          </Button>
        </div>
      </div>
    </div>
  );
}
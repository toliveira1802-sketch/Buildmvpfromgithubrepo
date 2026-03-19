import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import Logo from "../components/Logo";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Doctor Auto - Sistema de Gestão de Oficina";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size={96} className="drop-shadow-lg" />
        </div>

        {/* Título */}
        <div className="space-y-4 mb-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Doctor Auto
          </h1>
          <p className="text-xl text-zinc-400 border-t border-zinc-800 pt-4 inline-block px-8">
            Sistema de Gestão Automotiva
          </p>
        </div>

        {/* Descrição */}
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Plataforma completa para gestão de oficinas automotivas. Controle operacional,
          financeiro e produtividade em um só lugar.
        </p>

        {/* Botão único */}
        <Button
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-lg font-semibold rounded-lg min-w-[240px]"
          onClick={() => navigate("/login")}
        >
          Acessar Sistema →
        </Button>
      </div>
    </div>
  );
}

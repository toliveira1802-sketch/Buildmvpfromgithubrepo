import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import DevLayout from "../components/DevLayout";

export default function DevTables() {
  const navigate = useNavigate();

  return (
    <DevLayout>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            onClick={() => navigate("/dev-dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Gerenciar Tabelas</h1>
            <p className="text-sm text-zinc-400">
              Criar, editar e excluir tabelas do banco de dados
            </p>
          </div>
        </div>
        <div className="text-white">
          <p className="text-zinc-400">Em desenvolvimento...</p>
        </div>
      </div>
    </DevLayout>
  );
}
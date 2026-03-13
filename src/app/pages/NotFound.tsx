import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Página Não Encontrada - Doctor Auto";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={() => navigate("/")}>
            <Home className="size-4 mr-2" />
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
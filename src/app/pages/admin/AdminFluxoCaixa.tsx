import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";

export default function AdminFluxoCaixa() {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Fluxo de Caixa</h1>
        <p className="text-zinc-400 -mt-4">Controle financeiro detalhado</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">R$ 0,00</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Entradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">R$ 0,00</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Saídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">R$ 0,00</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Saldo Projetado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">R$ 0,00</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <DollarSign className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Sem movimentações registradas</h3>
            <p className="text-zinc-400">As transações aparecerão aqui automaticamente</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

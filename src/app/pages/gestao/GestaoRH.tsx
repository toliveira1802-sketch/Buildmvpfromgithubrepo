import { useState, useEffect } from "react";
import { Users, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../shared/ui/card';
import { Progress } from '../../shared/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../../lib/supabase";

interface Mecanico {
  id: string; name: string; specialty: string; is_active: boolean;
  qtde_positivos: number; qtde_negativos: number;
}

export default function GestaoRH() {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("mecanicos").select("*").eq("is_active", true)
      .then(({ data }) => { setMecanicos(data || []); setLoading(false); });
  }, []);

  const totalPos = mecanicos.reduce((s, m) => s + (m.qtde_positivos || 0), 0);
  const totalNeg = mecanicos.reduce((s, m) => s + (m.qtde_negativos || 0), 0);
  const total = totalPos + totalNeg;
  const perfMedia = total > 0 ? Math.round((totalPos / total) * 100) : 0;

  const top10 = [...mecanicos]
    .sort((a, b) => (b.qtde_positivos || 0) - (a.qtde_positivos || 0))
    .slice(0, 10)
    .map(m => ({ name: m.name.split(" ")[0], positivos: m.qtde_positivos || 0, negativos: m.qtde_negativos || 0 }));

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2"><Users className="h-8 w-8 text-blue-400" /> Recursos Humanos</h1>
          <p className="text-zinc-400 mt-1">Performance e feedbacks dos mecânicos</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2"><CardDescription className="text-zinc-400">Mecânicos Ativos</CardDescription>
              <CardTitle className="text-3xl text-white">{mecanicos.length}</CardTitle></CardHeader>
          </Card>
          <Card className="bg-green-950 border-green-800">
            <CardHeader className="pb-2"><CardDescription className="text-green-300 flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> Performance Média</CardDescription>
              <CardTitle className="text-3xl text-white">{perfMedia}%</CardTitle></CardHeader>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2"><CardDescription className="text-zinc-400">Total de Feedbacks</CardDescription>
              <CardTitle className="text-3xl text-white">{total}</CardTitle></CardHeader>
          </Card>
        </div>

        {top10.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Top 10 Mecânicos</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={top10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }} labelStyle={{ color: "#fff" }} />
                  <Legend />
                  <Bar dataKey="positivos" stackId="a" fill="#22c55e" name="Positivos" radius={[0,0,0,0]} />
                  <Bar dataKey="negativos" stackId="a" fill="#ef4444" name="Negativos" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white">Mecânicos — Detalhe</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading ? <p className="text-zinc-500 text-sm">Carregando...</p>
              : mecanicos.length === 0 ? <p className="text-zinc-500 text-sm">Nenhum mecânico cadastrado.</p>
              : mecanicos.map(m => {
                const t = (m.qtde_positivos || 0) + (m.qtde_negativos || 0);
                const taxa = t > 0 ? Math.round(((m.qtde_positivos || 0) / t) * 100) : 0;
                return (
                  <div key={m.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-white font-medium">{m.name}</span>
                        <span className="text-zinc-500 text-xs ml-2">{m.specialty}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-400 flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{m.qtde_positivos || 0}</span>
                        <span className="text-red-400 flex items-center gap-1"><ThumbsDown className="h-3 w-3" />{m.qtde_negativos || 0}</span>
                        <span className="text-white font-bold">{taxa}%</span>
                      </div>
                    </div>
                    <Progress value={taxa} className="h-2" />
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

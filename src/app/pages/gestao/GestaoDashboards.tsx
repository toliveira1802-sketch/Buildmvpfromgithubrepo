import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Users, Wrench, DollarSign, Cpu, ShoppingBag, Lightbulb, Car, LayoutDashboard
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../../lib/supabase";
import { EmpresaToggle } from "../../components/EmpresaToggle";

const MODULOS = [
  { path: "/gestao/rh",         label: "Recursos Humanos", icon: Users,       color: "from-blue-900 to-blue-800",   border: "border-blue-700",   desc: "Mecânicos, performance e feedbacks" },
  { path: "/gestao/operacoes",  label: "Operações",        icon: Wrench,      color: "from-orange-900 to-orange-800", border: "border-orange-700", desc: "OS, pendentes e execução" },
  { path: "/gestao/financeiro", label: "Financeiro",       icon: DollarSign,  color: "from-green-900 to-green-800",  border: "border-green-700",  desc: "Faturamento, metas e projeção" },
  { path: "/gestao/tecnologia", label: "Tecnologia",       icon: Cpu,         color: "from-purple-900 to-purple-800", border: "border-purple-700", desc: "Sistema, IA e integrações" },
  { path: "/gestao/comercial",  label: "Comercial",        icon: ShoppingBag, color: "from-pink-900 to-pink-800",    border: "border-pink-700",   desc: "Clientes, promoções e cadastros", badge: true },
  { path: "/gestao/melhorias",  label: "Melhorias",        icon: Lightbulb,   color: "from-yellow-900 to-yellow-800", border: "border-yellow-700", desc: "Sugestões e implementações" },
  { path: "/gestao/veiculos-orfaos", label: "Veículos Órfãos", icon: Car,    color: "from-red-900 to-red-800",      border: "border-red-700",    desc: "Vincular e gerenciar veículos" },
  { path: "/gestao/visao-geral", label: "Visão Geral",    icon: LayoutDashboard, color: "from-zinc-800 to-zinc-700", border: "border-zinc-600",  desc: "Consolidado estratégico" },
];

export default function GestaoDashboards() {
  const navigate = useNavigate();
  const [pendencias, setPendencias] = useState(0);

  useEffect(() => {
    supabase.from("clientes").select("id", { count: "exact", head: true })
      .eq("pending_review", true)
      .then(({ count }) => setPendencias(count || 0));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestão</h1>
            <p className="text-zinc-400 mt-1">Selecione o módulo que deseja acessar</p>
          </div>
          <EmpresaToggle />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULOS.map((mod) => {
            const Icon = mod.icon;
            return (
              <button key={mod.path} onClick={() => navigate(mod.path)}
                className={`relative bg-gradient-to-br ${mod.color} border ${mod.border} rounded-2xl p-6 text-left hover:scale-[1.02] transition-all group`}>
                {mod.badge && pendencias > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendencias}
                  </span>
                )}
                <Icon className="h-8 w-8 text-white mb-3 opacity-80 group-hover:opacity-100" />
                <p className="text-white font-semibold text-lg">{mod.label}</p>
                <p className="text-white/60 text-sm mt-1">{mod.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

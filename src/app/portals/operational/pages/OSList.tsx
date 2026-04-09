import React, { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench,
  User,
  Car
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/shared/ui/card';
import { Input } from '@/app/shared/ui/input';
import { Button } from '@/app/shared/ui/button';
import { supabase } from "@/lib/supabase";
import { sbEmpresa } from "@/lib/supabase-extended";
import { toast } from "sonner";
import { cn } from "@/app/shared/ui/utils";
import { useNavigate } from "react-router";

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  diagnostico: { label: "Diagnóstico", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Search },
  orcamento: { label: "Orçamento", color: "text-purple-400 bg-purple-500/10 border-purple-500/20", icon: ClipboardList },
  aguardando_aprovacao: { label: "Aguardando", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", icon: Clock },
  aprovado: { label: "Aprovado", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  em_execucao: { label: "Executando", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", icon: Wrench },
  concluido: { label: "Concluído", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20", icon: CheckCircle2 },
};

export default function OSList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [osList, setOsList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOS();
  }, []);

  async function fetchOS() {
    setLoading(true);
    try {
      let query = supabase
        .from("06_OS")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      const empresaId = sbEmpresa();
      if (empresaId) query = query.eq("empresa_id", empresaId);

      const { data, error } = await query;
      if (error) throw error;
      setOsList(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredOS = osList.filter(os => {
    const matchesSearch = 
      os.numero_os?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.client_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.veiculo_placa?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || os.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            <ClipboardList className="h-10 w-10 text-emerald-500" />
            Repair Pipeline
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">
            Service Order Management & Operational Control
          </p>
        </div>
        <Button 
          onClick={() => navigate("/operational/fast-checkin")}
          className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] gap-2"
        >
          <Plus className="w-4 h-4" />
          Gerar Nova OS
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="bg-[#0a0a0a] border border-white/[0.05] p-3 rounded-2xl flex-1 flex flex-col md:flex-row gap-4 items-center w-full">
           <div className="relative flex-1 group w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
             <Input 
               placeholder="Busca rápida (OS, Placa ou Cliente)..." 
               className="h-11 pl-12 bg-white/[0.02] border-white/[0.05] text-[11px] font-bold uppercase tracking-widest text-white/80 placeholder:text-white/10"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 w-full md:w-auto">
             {["all", "diagnostico", "orcamento", "em_execucao"].map((st) => (
               <button
                 key={st}
                 onClick={() => setFilter(st)}
                 className={cn(
                   "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                   filter === st ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:text-white"
                 )}
               >
                 {st === "all" ? "Todas" : STATUS_CONFIG[st]?.label}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Main Table/List Area */}
      <Card className="bg-[#0a0a0a] border-white/[0.05] overflow-hidden">
        <CardContent className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-white/[0.03] bg-white/[0.01]">
                   <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">OS Protocol</th>
                   <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client & Machine</th>
                   <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status / Stage</th>
                   <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Priority</th>
                   <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                 {loading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                     <tr key={i} className="animate-pulse h-20">
                       <td colSpan={5} className="px-6 py-4 bg-white/[0.01]" />
                     </tr>
                   ))
                 ) : filteredOS.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="py-20 text-center text-zinc-700 bg-white/[0.01]">
                       <ClipboardList className="w-12 h-12 opacity-10 mx-auto mb-4" />
                       <p className="text-xs font-black uppercase tracking-[0.3em]">Pipeline Empty</p>
                     </td>
                   </tr>
                 ) : (
                   filteredOS.map((os) => {
                     const status = STATUS_CONFIG[os.status] || STATUS_CONFIG.diagnostico;
                     const StatusIcon = status.icon;
                     return (
                       <tr key={os.id} className="hover:bg-white/[0.01] transition-colors group">
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-xs font-black text-emerald-500">
                                 {os.numero_os?.split("-")[1] || "OS"}
                               </div>
                               <div>
                                 <p className="text-xs font-black text-white">{os.numero_os}</p>
                                 <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                                   {new Date(os.created_at).toLocaleDateString()}
                                 </p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <User className="w-3 h-3 text-zinc-600" />
                                  <p className="text-xs font-bold text-zinc-300">{os.client_nome}</p>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Car className="w-3 h-3 text-zinc-600" />
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{os.veiculo_placa} • {os.veiculo_modelo}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border", status.color)}>
                               <StatusIcon className="w-3 h-3" />
                               {status.label}
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-1.5">
                               <div className={cn("w-2 h-2 rounded-full", 
                                 os.prioridade === "alta" || os.prioridade === "urgente" ? "bg-red-500 animate-pulse" : 
                                 os.prioridade === "media" ? "bg-orange-500" : "bg-blue-500"
                               )} />
                               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{os.prioridade}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5 text-right">
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all border border-transparent">
                               <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                         </td>
                       </tr>
                     );
                   })
                 )}
               </tbody>
             </table>
           </div>
        </CardContent>
      </Card>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricSmall label="Wait Time" val="42m avg" />
          <MetricSmall label="Completion" val="8.4 / day" />
          <MetricSmall label="Total Value" val="R$ 48.2k" />
          <MetricSmall label="Capacity" val="85%" />
      </div>
    </div>
  );
}

function MetricSmall({ label, val }: { label: string, val: string }) {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col gap-1">
      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-white">{val}</p>
    </div>
  );
}

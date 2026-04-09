import React, { useState, useEffect } from "react";
import { 
  Car,
  Search,
  Plus,
  MoreHorizontal,
  User,
  ChevronRight,
  Gauge,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/shared/ui/card';
import { Input } from '@/app/shared/ui/input';
import { Button } from '@/app/shared/ui/button';
import { supabase } from "@/lib/supabase";
import { sbEmpresa } from "@/lib/supabase-extended";
import { toast } from "sonner";
import { cn } from "@/app/shared/ui/utils";

export default function VehicleList() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    setLoading(true);
    try {
      let query = supabase
        .from("vehicles")
        .select(`
          *,
          client:04_CLIENTS(full_name, phone)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      const empresaId = sbEmpresa();
      if (empresaId) query = query.eq("empresa_id", empresaId);

      const { data, error } = await query;
      if (error) throw error;
      setVehicles(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredVehicles = vehicles.filter(v =>
    v.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            <Car className="h-10 w-10 text-emerald-500" />
            Meus Veículos
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">
            Fleet Intelligence & Service History
          </p>
        </div>
        <Button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] gap-2">
          <Plus className="w-4 h-4" />
          Novo Veículo
        </Button>
      </div>

      {/* Control Bar */}
      <div className="bg-[#0a0a0a] border border-white/[0.05] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Buscar por placa ou modelo..." 
            className="h-12 pl-12 bg-white/[0.02] border-white/[0.05] text-[11px] font-bold uppercase tracking-widest text-white/80 placeholder:text-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest border-l border-white/[0.05] pl-6 h-10">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span>Ativos: {vehicles.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
          ))
        ) : filteredVehicles.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-700 bg-[#0a0a0a] border border-dashed border-white/[0.05] rounded-3xl">
            <Car className="w-12 h-12 opacity-10 mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Nenhuma unidade rastreada</p>
          </div>
        ) : (
          filteredVehicles.map((v) => (
            <Card key={v.id} className="bg-[#0a0a0a] border-white/[0.05] group hover:border-emerald-500/20 transition-all overflow-hidden cursor-pointer">
              <CardContent className="p-0">
                {/* Visual Identity Plate */}
                <div className="p-6 bg-gradient-to-br from-white/[0.03] to-transparent border-b border-white/[0.03]">
                   <div className="flex justify-between items-start mb-4">
                      <div className="bg-white text-black px-3 py-1 rounded-md font-mono text-sm font-black tracking-widest border-2 border-zinc-800 shadow-md">
                        {v.placa}
                      </div>
                      <BadgeStatus status="Em Loja" />
                   </div>
                   <h3 className="text-lg font-black text-white tracking-tight truncate uppercase">{v.modelo}</h3>
                   <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1">{v.marca || "Brand Expert"}</p>
                </div>

                <div className="p-6 space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-white uppercase truncate">{v.client?.full_name || "Guest Client"}</p>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{v.client?.phone || "S/ Contato"}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 border-t border-white/[0.03] pt-4">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-[9px] font-bold text-zinc-400">45k km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-[9px] font-bold text-zinc-400">2022/2023</span>
                      </div>
                   </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                   <Button variant="outline" className="w-full h-10 rounded-xl border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:border-emerald-500/20 group-hover:text-emerald-400 transition-all">
                      Abrir Histórico
                      <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function BadgeStatus({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{status}</span>
    </div>
  );
}

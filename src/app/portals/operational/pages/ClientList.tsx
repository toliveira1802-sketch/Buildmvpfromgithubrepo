import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MessageSquare, 
  ChevronRight,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/shared/ui/card';
import { Input } from '@/app/shared/ui/input';
import { Button } from '@/app/shared/ui/button';
import { supabase } from "@/lib/supabase";
import { sbEmpresa } from "@/lib/supabase-extended";
import { toast } from "sonner";
import { cn } from "@/app/shared/ui/utils";

export default function ClientList() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      let query = supabase
        .from("clients")
        .select("*")
        .order("full_name", { ascending: true })
        .limit(50);

      const empresaId = sbEmpresa();
      if (empresaId) query = query.eq("empresa_id", empresaId);

      const { data, error } = await query;
      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            <Users className="h-10 w-10 text-emerald-500" />
            Meus Clientes
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">
            Asset Management & Customer CRM
          </p>
        </div>
        <Button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] gap-2">
          <UserPlus className="w-4 h-4" />
          Novo Registro
        </Button>
      </div>

      {/* Control Bar */}
      <div className="bg-[#0a0a0a] border border-white/[0.05] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Buscar por nome ou telefone..." 
            className="h-12 pl-12 bg-white/[0.02] border-white/[0.05] text-[11px] font-bold uppercase tracking-widest text-white/80 placeholder:text-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest border-l border-white/[0.05] pl-6 h-10">
          <span>Total: </span>
          <span className="text-white bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">{clients.length} / {clients.length < 20 ? clients.length : "500+"}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
          ))
        ) : filteredClients.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-700 bg-[#0a0a0a] border border-dashed border-white/[0.05] rounded-3xl">
            <Users className="w-12 h-12 opacity-10 mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Nenhum cliente sincronizado</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="bg-[#0a0a0a] border-white/[0.05] group hover:border-emerald-500/20 transition-all overflow-hidden cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 flex items-center justify-center">
                     <span className="text-xl font-black text-emerald-400">
                       {client.full_name?.charAt(0).toUpperCase()}
                     </span>
                   </div>
                   <button className="p-1.5 text-white/10 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                     <MoreHorizontal className="w-5 h-5" />
                   </button>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors truncate">
                    {client.full_name}
                  </h3>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Client Active v1.0</p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/[0.03] pt-6">
                  <ContactAction icon={Phone} label="Ligar" />
                  <ContactAction icon={MessageSquare} label="Zap" />
                  <ContactAction icon={ChevronRight} label="View" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function ContactAction({ icon: Icon, label }: any) {
  return (
    <button className="flex flex-col items-center gap-2 group/action p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all">
      <Icon className="w-4 h-4 text-white/10 group-hover/action:text-emerald-400 transition-colors" />
      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover/action:text-emerald-200 transition-colors">{label}</span>
    </button>
  );
}

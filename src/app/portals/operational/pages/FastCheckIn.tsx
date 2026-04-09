import React, { useState, useEffect, useCallback } from "react";
import { 
  UserPlus, 
  Car, 
  Wrench, 
  CheckCircle2, 
  Search, 
  Loader2, 
  ArrowRight,
  AlertCircle,
  Plus,
  ShieldCheck,
  ChevronRight,
  User,
  Hash
} from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/app/shared/ui/button";
import { Input } from "@/app/shared/ui/input";
import { Label } from "@/app/shared/ui/label";
import { toast } from "sonner";
import OperationalLayout from "../components/OperationalLayout";
import { useOficinaContext } from "@/lib/supabase-extended";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/app/shared/ui/utils";

// --- Interfaces & Types (HM-Engineer) ---
type FlowStep = "client" | "vehicle" | "service" | "confirm";

interface Client {
  id: string;
  full_name: string;
  phone: string;
  empresa_id: string;
}

interface VehicleData {
  placa: string;
  modelo: string;
  marca?: string;
  ano?: string;
}

interface OSData {
  problem: string;
  priority: "baixa" | "media" | "alta";
}

export default function FastCheckIn() {
  const navigate = useNavigate();
  const { empresa_id, isLoading: contextLoading } = useOficinaContext();
  
  // States
  const [step, setStep] = useState<FlowStep>("client");
  const [loading, setLoading] = useState(false);
  
  // Data States (HM-Engineer: Strict Typing)
  const [client, setClient] = useState<Client | null>(null);
  const [vehicle, setVehicle] = useState<VehicleData>({ placa: "", modelo: "" });
  const [osData, setOsData] = useState<OSData>({
    problem: "",
    priority: "media"
  });

  // Search States
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Client[]>([]);

  // --- Logic: Search Clients (Segmented by empresa_id) ---
  const searchClients = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("04_CLIENTS")
        .select("*")
        .eq("empresa_id", empresa_id) // SEGMENTAÇÃO (HM-Engineer)
        .or(`full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err: any) {
      console.error("Search Error:", err);
      // HM-QA: Offline fallback logic could be added here if desired.
      toast.error("Erro ao buscar clientes. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }, [empresa_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) searchClients(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, searchClients]);

  // --- Actions ---
  const handleSelectClient = (c: Client) => {
    setClient(c);
    setStep("vehicle");
    toast.success(`Cliente ${c.full_name} selecionado`);
  };

  const handleFinalize = async () => {
    if (!client || !vehicle.placa || !osData.problem) {
      toast.error("Dados incompletos para gerar OS");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("06_OS")
        .insert({
          empresa_id, // HM-Engineer: Data consistency
          client_id: client.id,
          client_nome: client.full_name,
          veiculo_placa: vehicle.placa.toUpperCase(),
          veiculo_modelo: vehicle.modelo,
          descricao_problema: osData.problem,
          prioridade: osData.priority,
          status: "diagnostico",
          numero_os: `OS-${Math.floor(1000 + Math.random() * 9000)}`
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Ordem de Serviço criada com sucesso!");
      navigate("/operational/os");
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar Ordem de Serviço");
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <OperationalLayout>
         <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin text-emerald-500 size-10" />
         </div>
      </OperationalLayout>
    );
  }

  return (
    <OperationalLayout>
      <div className="max-w-4xl mx-auto pb-20">
        {/* Header - HM-Designer (Outfit Font) */}
        <header className="mb-12 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full mb-4">
             <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocolo Fast Check-In</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3 leading-none italic">
            QUICK<span className="text-emerald-500">START</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Abertura Estratégica de OS</p>
        </header>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between mb-16 relative px-12">
          <div className="absolute top-[22px] left-0 w-full h-px bg-white/[0.05] -z-10" />
          {[
            { id: "client", icon: UserPlus, label: "Cliente" },
            { id: "vehicle", icon: Car, label: "Veículo" },
            { id: "service", icon: Wrench, label: "Serviço" },
            { id: "confirm", icon: ShieldCheck, label: "Finalizar" }
          ].map((s, idx) => {
            const Icon = s.icon;
            const isDone = ["client", "vehicle", "service", "confirm"].indexOf(step) > idx;
            const isActive = step === s.id;
            return (
              <div key={idx} className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 bg-[#0a0a0a] border",
                  isDone ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" :
                  isActive ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white scale-110" :
                  "border-white/[0.04] text-zinc-700"
                )}>
                  {isDone ? <CheckCircle2 className="size-6" /> : <Icon className="size-5" />}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.2em]",
                  isActive ? "text-emerald-400" : "text-zinc-600"
                )}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content - HM-Designer (Glassmorphism + Transitions) */}
        <div className="relative min-h-[450px]">
          <AnimatePresence mode="wait">
            {step === "client" && (
              <motion.div 
                key="client"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="bg-[#0a0a0a] border border-white/[0.04] rounded-[40px] p-10 shadow-2xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] -rotate-12">
                  <UserPlus size={200} className="text-emerald-500" />
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-4">
                    <Label className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                       <User className="size-5 text-emerald-500" /> Localizar Cliente
                    </Label>
                    <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                      <Input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nome, Telefone ou CPF..." 
                        className="h-20 pl-14 bg-white/[0.02] border-white/[0.05] text-2xl rounded-3xl focus:border-emerald-600/30 transition-all font-bold placeholder:text-zinc-800"
                      />
                    </div>
                  </div>

                  {loading && <div className="flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>}

                  <div className="space-y-3">
                    {searchResults.map((c) => (
                      <button 
                        key={c.id} 
                        onClick={() => handleSelectClient(c)}
                        className="w-full flex justify-between items-center p-8 bg-white/[0.01] border border-white/[0.03] rounded-3xl hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] transition-all group"
                      >
                        <div>
                          <h4 className="font-black text-white text-xl tracking-tight leading-none mb-1 group-hover:text-emerald-400 transition-colors">{c.full_name}</h4>
                          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">{c.phone}</p>
                        </div>
                        <ChevronRight className="text-zinc-800 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
                      </button>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full h-18 rounded-3xl border-dashed border-white/[0.05] text-zinc-600 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] text-[10px] font-black tracking-widest uppercase transition-all"
                  >
                    <Plus className="mr-2 size-5" /> Cadastrar Novo Cliente
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "vehicle" && client && (
              <motion.div 
                key="vehicle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#0a0a0a] border border-white/[0.04] rounded-[40px] p-10 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/[0.03]">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                    <User className="text-emerald-500 size-6 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg tracking-tight group-hover:text-emerald-400">{client.full_name}</h3>
                    <p className="text-emerald-500/60 font-black uppercase tracking-widest text-[9px]">ID Estratégico Ativo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-3">
                    <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                      <Hash className="size-3" /> Placa do Veículo
                    </Label>
                    <Input 
                      placeholder="ABC1D23" 
                      maxLength={7}
                      className="h-16 bg-white/[0.02] border-white/[0.05] rounded-2xl text-2xl font-black font-mono uppercase tracking-[0.3em] text-center focus:border-emerald-500/50" 
                      onChange={(e) => setVehicle({...vehicle, placa: e.target.value.toUpperCase()})} 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                      <Car className="size-3" /> Modelo / Versão
                    </Label>
                    <Input 
                      placeholder="Ex: Corolla XEI" 
                      className="h-16 bg-white/[0.02] border-white/[0.05] rounded-2xl text-xl font-bold tracking-tight focus:border-emerald-500/50" 
                      onChange={(e) => setVehicle({...vehicle, modelo: e.target.value})} 
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    if (vehicle.placa.length < 7) return toast.error("Placa inválida");
                    setStep("service");
                  }}
                  className="w-full h-20 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                >
                  AVANÇAR PARA TRIAGEM
                </Button>
              </motion.div>
            )}

            {step === "service" && (
              <motion.div 
                key="service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#0a0a0a] border border-white/[0.04] rounded-[40px] p-10 shadow-2xl"
              >
                <div className="space-y-6">
                  <Label className="text-white text-2xl font-black tracking-tight flex items-center gap-3">
                     <Wrench className="size-6 text-emerald-500" /> Relato do Problema
                  </Label>
                  <textarea 
                    className="w-full h-56 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-8 text-zinc-200 placeholder:text-zinc-800 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all resize-none text-xl font-bold italic"
                    placeholder="Quais os sintomas ou serviços desejados?"
                    onChange={(e) => setOsData({...osData, problem: e.target.value})}
                  />
                  
                  <div className="flex gap-4">
                     {["baixa", "media", "alta"].map((p) => (
                       <button
                         key={p}
                         onClick={() => setOsData({...osData, priority: p as any})}
                         className={cn(
                           "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                           osData.priority === p 
                            ? "bg-white/5 border-emerald-500 text-emerald-400" 
                            : "bg-transparent border-white/[0.03] text-zinc-600 hover:border-white/[0.1]"
                         )}
                       >
                         {p}
                       </button>
                     ))}
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    if (!osData.problem) return toast.error("Descreva o problema");
                    setStep("confirm");
                  }}
                  className="w-full h-20 mt-10 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                >
                  RESUMO DA OPERAÇÃO
                </Button>
              </motion.div>
            )}

            {step === "confirm" && client && (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0a0a] border border-white/[0.04] rounded-[40px] p-10 shadow-2xl"
              >
                <div className="bg-white/[0.01] border border-white/[0.03] p-10 rounded-[32px] space-y-6 mb-10 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-transparent opacity-30" />
                  
                  <div className="flex justify-between items-end border-b border-white/[0.03] pb-6">
                    <span className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px]">Cliente Target</span>
                    <span className="text-white font-black text-xl italic tracking-tight">{client.full_name}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/[0.03] pb-6">
                    <span className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px]">Ativo / Veículo</span>
                    <span className="text-white font-black text-xl tracking-tight leading-none">
                      <span className="text-emerald-500 mr-2">{vehicle.placa}</span> 
                      {vehicle.modelo}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <span className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px]">Diagnóstico Preliminar</span>
                    <p className="text-zinc-400 italic text-lg leading-relaxed">{osData.problem}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleFinalize}
                  disabled={loading}
                  className="w-full h-20 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg tracking-widest shadow-[0_15px_40px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-4"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck className="size-6" />}
                  CONFIRMAR E GERAR OS
                </Button>
                
                <button 
                  onClick={() => setStep("client")}
                  className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-white transition-colors"
                >
                  Cancelar e Recomeçar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex items-center justify-center gap-3 text-zinc-700 opacity-30 group hover:opacity-100 transition-opacity">
          <AlertCircle className="size-4" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em]">Synapse Secure Gate • Realtime Supabase Sync Active</p>
        </div>
      </div>
    </OperationalLayout>
  );
}

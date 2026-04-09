import React, { useState, useEffect } from "react";
import { 
  Users, 
  Car, 
  ClipboardList, 
  Search, 
  Plus, 
  ChevronRight, 
  History, 
  Wrench, 
  Loader2,
  Phone,
  LayoutGrid,
  ShieldCheck,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Zap,
  Calendar
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/app/shared/ui/utils";
import { Card, CardContent } from "@/app/shared/ui/card";
import { Button } from "@/app/shared/ui/button";
import { Input } from "@/app/shared/ui/input";
import OperationalLayout from "../components/OperationalLayout";

export default function OperationalTrinityHub() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Selected Data State
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [osHistory, setOsHistory] = useState<any[]>([]);

  // 1. Search Logic
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Search Clients and Vehicles (by plate) simultaneously
        const { data: clients } = await supabase
          .from("04_CLIENTS")
          .select("*")
          .or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
          .limit(5);
          
        setSearchResults(clients || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Fetch Vehicles when Client is selected
  useEffect(() => {
    if (selectedClient) {
      fetchVehicles(selectedClient.id);
    } else {
      setVehicles([]);
      setSelectedVehicle(null);
    }
  }, [selectedClient]);

  // 3. Fetch OS History when Vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      fetchOSHistory(selectedVehicle.id);
    } else {
      setOsHistory([]);
    }
  }, [selectedVehicle]);

  const fetchVehicles = async (clientId: string) => {
    const { data } = await supabase
      .from("05_VEHICLES")
      .select("*")
      .eq("client_id", clientId);
    setVehicles(data || []);
    if (data && data.length > 0) setSelectedVehicle(data[0]);
  };

  const fetchOSHistory = async (vehicleId: string) => {
    const { data } = await supabase
      .from("06_OS")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("created_at", { ascending: false });
    setOsHistory(data || []);
  };

  return (
    <div className="space-y-6">
      {/* Header Search Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-emerald-500" />
            Trinity Hub
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[9px] mt-1">
            Integrated Context Manager v2.0
          </p>
        </div>

        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Plate, Name or Phone..." 
            className="h-14 pl-12 bg-white/[0.02] border-white/[0.05] text-lg rounded-2xl focus:border-emerald-500/50 transition-all font-medium"
          />
          
          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/[0.05] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-white/[0.04]">
              {searchResults.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => {
                    setSelectedClient(c);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="w-full p-4 flex items-center justify-between hover:bg-emerald-500/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Users className="text-emerald-500 size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.full_name}</h4>
                      <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest">{c.phone}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-zinc-700" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!selectedClient ? (
        <div className="h-[60vh] flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/[0.05] rounded-[40px] text-center p-10">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-6 animate-pulse">
            <Search className="size-10 text-emerald-500/20" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Select a context to begin</h2>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
            Search for a client or plate above to visualize the complete Trinity View (Client, Vehicle & Service History).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* COLUMN 1: CLIENT CONTEXT (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-[#0f0f0f] border-white/[0.05] overflow-hidden group">
              <div className="h-24 bg-gradient-to-br from-emerald-600/20 to-transparent relative">
                <div className="absolute -bottom-6 left-6 w-20 h-20 rounded-2xl bg-zinc-950 border-2 border-[#0f0f0f] shadow-2xl flex items-center justify-center">
                  <span className="text-3xl font-black text-emerald-500">{selectedClient.full_name.charAt(0)}</span>
                </div>
              </div>
              <CardContent className="pt-10 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight leading-tight">{selectedClient.full_name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Client Platinum</p>
                  </div>
                  <button onClick={() => setSelectedClient(null)} className="text-zinc-700 hover:text-white transition-colors">
                    <History className="size-4" />
                  </button>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-white/[0.03]">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Phone className="size-3.5 text-emerald-500/50" />
                    <span className="text-xs font-medium">{selectedClient.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <History className="size-3.5 text-blue-500/50" />
                    <span className="text-xs font-medium">{osHistory.length} Services recorded</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-6 bg-white/5 border-white/10 text-xs font-black uppercase tracking-widest h-10">
                  Edit CRM Profile
                </Button>
              </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/[0.05] space-y-4">
               <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2">
                 <ShieldCheck className="size-4" /> Relationship Stats
               </h4>
               <div className="space-y-4">
                 <StatRow label="LTV Ratio" value="R$ 14.2k" color="text-white" />
                 <StatRow label="Loyalty Tier" value="Diamond" color="text-emerald-400" />
                 <StatRow label="Last Visit" value="12 Days ago" color="text-zinc-500" />
               </div>
            </div>
          </div>

          {/* COLUMN 2: VEHICLE GARAGE (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Car className="size-4 text-emerald-500" />
                Garage Context
              </h3>
              <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{vehicles.length} Units</span>
            </div>

            <div className="space-y-3">
              {vehicles.map((v) => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={cn(
                    "w-full p-5 rounded-3xl border transition-all text-left flex gap-4 group",
                    selectedVehicle?.id === v.id 
                      ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                      : "bg-[#0a0a0a] border-white/[0.03] hover:border-white/[0.1]"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    selectedVehicle?.id === v.id ? "bg-emerald-500 text-white" : "bg-white/[0.03] text-zinc-600 group-hover:text-zinc-400"
                  )}>
                    <Car className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className={cn("font-black tracking-tight", selectedVehicle?.id === v.id ? "text-white" : "text-zinc-300")}>
                        {v.modelo}
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold">{v.placa}</span>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{v.marca} · {v.ano}</p>
                  </div>
                </button>
              ))}
              
              <button 
                className="w-full p-5 rounded-3xl border border-dashed border-white/5 bg-transparent hover:bg-white/[0.02] hover:border-emerald-500/30 transition-all flex items-center justify-center gap-3 group"
              >
                <Plus className="size-5 text-zinc-700 group-hover:text-emerald-500" />
                <span className="text-[11px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-300">Register New Asset</span>
              </button>
            </div>
          </div>

          {/* COLUMN 3: SERVICE TIMELINE (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <ClipboardList className="size-4 text-emerald-500" />
                Service Evolution
              </h3>
              <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest">
                <Zap className="size-3 mr-1.5" /> Fast Check-In
              </Button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-[32px] p-2 min-h-[400px]">
              {osHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 py-20">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-4">
                    <ClipboardList className="size-5 text-zinc-800" />
                  </div>
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No service record for this asset</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                   {osHistory.map((os, idx) => (
                     <div key={os.id} className="relative pl-8 pb-8 group last:pb-2">
                        {/* Timeline Wire */}
                        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-white/[0.04] group-last:hidden" />
                        <div className="absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full bg-zinc-950 border-2 border-white/[0.05] flex items-center justify-center z-10 group-hover:border-emerald-500/50 transition-colors">
                          <div className={cn("w-1.5 h-1.5 rounded-full", 
                            os.status === "entregue" ? "bg-zinc-500" : "bg-emerald-500 animate-pulse"
                          )} />
                        </div>

                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 group-hover:bg-white/[0.03] transition-all">
                           <div className="flex justify-between items-start mb-2">
                             <div>
                               <span className="text-[10px] font-mono text-emerald-500/80 font-bold">{os.numero_os}</span>
                               <h5 className="text-sm font-bold text-white mt-0.5">{os.descricao_problema || "Service Maintenance"}</h5>
                             </div>
                             <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border bg-white/5", 
                               os.status === "em_execucao" ? "border-blue-500/20 text-blue-400" : "border-zinc-500/20 text-zinc-400"
                             )}>
                               {os.status.toUpperCase()}
                             </span>
                           </div>
                           
                           <div className="flex items-center justify-between mt-4">
                             <div className="flex items-center gap-2 text-zinc-500">
                               <Calendar className="size-3" />
                               <span className="text-[10px] font-bold">{new Date(os.created_at).toLocaleDateString()}</span>
                             </div>
                             <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-emerald-400 transition-colors">
                               <ArrowRight className="size-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest">View OS</span>
                             </button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{label}</span>
      <span className={cn("text-xs font-black", color)}>{value}</span>
    </div>
  );
}

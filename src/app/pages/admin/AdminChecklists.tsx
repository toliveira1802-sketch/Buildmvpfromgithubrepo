import { useState, useEffect } from "react";
import { CheckSquare, RefreshCw, Loader2, Check, Circle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";
const sb = createClient("https://acuufrgoyjwzlyhopaus.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4");
const CHECKLIST_ITEMS = ["Documentos verificados","KM registrada","Fotos do veículo","Diagnóstico realizado","Orçamento elaborado","Cliente notificado"];
export default function AdminChecklists() {
  const navigate = useNavigate();
  const [os, setOs] = useState<any[]>([]);
  const [checks, setChecks] = useState<Record<string,boolean[]>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await sb.from("06_OS")
      .select("id,numero_os,cliente_nome,veiculo_modelo,status")
      .in("status",["diagnostico","orcamento"])
      .order("created_at",{ascending:true}).limit(10);
    setOs(data||[]);
    const init: Record<string,boolean[]> = {};
    (data||[]).forEach(o => { init[o.id] = Array(CHECKLIST_ITEMS.length).fill(false); });
    setChecks(init);
    setLoading(false);
  }
  function toggle(id: number, idx: number) {
    setChecks(p => ({ ...p, [id]: p[id].map((v,i) => i===idx ? !v : v) }));
  }
  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><CheckSquare className="h-8 w-8 text-green-400"/>Checklists</h1>
            <p className="text-zinc-400 mt-1">OS em diagnóstico e orçamento</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>
        {loading ? <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-green-400"/></div>
        : os.length === 0 ? <div className="text-center py-16 text-zinc-500"><CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-30"/><p>Nenhuma OS para checklist</p></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {os.map(o => {
            const c = checks[o.id] || Array(CHECKLIST_ITEMS.length).fill(false);
            const done = c.filter(Boolean).length;
            return (
              <Card key={o.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="cursor-pointer" onClick={() => navigate("/ordens-servico/"+o.id)}>
                      <CardTitle className="text-white text-sm">{o.cliente_nome||"—"}</CardTitle>
                      <p className="text-zinc-400 text-xs">{o.veiculo_modelo} · {o.numero_os}</p>
                    </div>
                    <span className="text-xs text-zinc-400">{done}/{CHECKLIST_ITEMS.length}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2">
                    <div className="bg-green-500 rounded-full h-1.5 transition-all" style={{width: (done/CHECKLIST_ITEMS.length*100)+"%"}}/>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {CHECKLIST_ITEMS.map((item, i) => (
                    <button key={i} onClick={() => toggle(o.id, i)}
                      className="w-full flex items-center gap-2 text-left hover:bg-zinc-800 rounded p-1 transition-colors">
                      {c[i] ? <Check className="h-4 w-4 text-green-400 flex-shrink-0"/> : <Circle className="h-4 w-4 text-zinc-600 flex-shrink-0"/>}
                      <span className={"text-xs "+(c[i]?"text-zinc-400 line-through":"text-zinc-200")}>{item}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>}
      </div>
    </AdminLayout>
  );
}
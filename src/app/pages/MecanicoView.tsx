import { useState, useEffect } from "react";
import { Wrench, Clock, CheckCircle, RefreshCw, Loader2, Car, ChevronRight } from "lucide-react";
import { Button } from '../shared/ui/button';
import { Badge } from '../shared/ui/badge';
import { Card } from '../shared/ui/card';
import { useNavigate } from "react-router";
import AdminLayout from "../components/AdminLayout";
import { supabase as sb } from "../../lib/supabase";

interface OS { id:number; numero_os:string; status:string; cliente_nome:string; veiculo_modelo:string; veiculo_placa:string; valor_total:number; created_at:string; }
interface Mecanico { id:number; nome:string; especialidade:string|null; nivel:string; }

const STATUS_SEQ = ["aprovado","em_execucao","concluido"];
const STATUS_BADGE: Record<string,string> = {
  aprovado:"bg-blue-900/50 text-blue-300", em_execucao:"bg-purple-900/50 text-purple-300", concluido:"bg-green-900/50 text-green-300",
};

export default function MecanicoView() {
  const navigate = useNavigate();
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [mecSel, setMecSel] = useState<number|null>(null);
  const [os, setOs] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<number|null>(null);

  useEffect(() => { loadMecs(); }, []);
  useEffect(() => { if (mecSel) loadOs(mecSel); }, [mecSel]);

  async function loadMecs() {
    const { data } = await sb.from("mecanicos").select("id,nome,especialidade,nivel").order("nome");
    setMecanicos(data||[]);
    if (data && data.length > 0) setMecSel(data[0].id);
    setLoading(false);
  }

  async function loadOs(mecId:number) {
    setLoading(true);
    const mec = mecanicos.find(m => m.id===mecId) || (await sb.from("mecanicos").select("nome").eq("id",mecId).single()).data;
    if (!mec) { setLoading(false); return; }
    const { data } = await sb.from("ordens_servico")
      .select("id,numero_os,status,cliente_nome,veiculo_modelo,veiculo_placa,valor_total,created_at")
      .in("status",["aprovado","em_execucao","concluido"])
      .order("created_at",{ascending:false}).limit(30);
    setOs(data||[]);
    setLoading(false);
  }

  async function avancar(o:OS) {
    const idx = STATUS_SEQ.indexOf(o.status);
    if (idx < 0 || idx >= STATUS_SEQ.length-1) return;
    setMoving(o.id);
    await sb.from("ordens_servico").update({status:STATUS_SEQ[idx+1]}).eq("id",o.id);
    if (mecSel) await loadOs(mecSel);
    setMoving(null);
  }

  const fmt = (v:number) => v ? v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
  const mecAtual = mecanicos.find(m => m.id===mecSel);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Wrench className="h-8 w-8 text-orange-400"/>Mecânicos</h1>
            <p className="text-zinc-400 mt-1">OS por mecânico — 12_MECANICOS</p>
          </div>
          <Button onClick={() => mecSel && loadOs(mecSel)} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {mecanicos.map(m => (
            <button key={m.id} onClick={() => setMecSel(m.id)}
              className={"px-4 py-2 rounded-full text-sm font-medium border transition-colors "+(mecSel===m.id?"bg-orange-600 border-orange-500 text-white":"bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white")}>
              {m.nome}
              {m.especialidade && <span className="ml-1 text-xs opacity-70">· {m.especialidade}</span>}
            </button>
          ))}
        </div>

        {loading ? (<div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-orange-400"/></div>)
        : os.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <Wrench className="h-12 w-12 mx-auto mb-3 opacity-30"/>
            <p>Nenhuma OS em andamento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {os.map(o => (
              <Card key={o.id} className="bg-zinc-900 border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/ordens-servico/"+o.id)}>
                    <div className="w-10 h-10 rounded-full bg-orange-900/40 flex items-center justify-center"><Car className="h-5 w-5 text-orange-400"/></div>
                    <div>
                      <p className="text-white font-medium">{o.cliente_nome||"—"} <span className="text-zinc-500 text-xs font-mono">{o.numero_os}</span></p>
                      <p className="text-zinc-400 text-sm">{o.veiculo_modelo} {o.veiculo_placa && "· "+o.veiculo_placa}</p>
                      <p className="text-green-400 text-sm">{fmt(o.valor_total)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={(STATUS_BADGE[o.status]||"bg-zinc-700 text-zinc-300")+" text-xs"}>{o.status?.replace(/_/g," ")}</Badge>
                    {o.status !== "concluido" && (
                      <Button size="sm" disabled={moving===o.id} onClick={() => avancar(o)}
                        className="bg-orange-600 hover:bg-orange-700 text-xs">
                        {moving===o.id ? <Loader2 className="h-3 w-3 animate-spin"/> : <><ChevronRight className="h-3 w-3 mr-1"/>Avançar</>}
                      </Button>
                    )}
                    {o.status === "concluido" && <CheckCircle className="h-5 w-5 text-green-400"/>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
import { useState, useEffect } from "react";
import { Bell, RefreshCw, Loader2, AlertTriangle, Clock, CheckCircle, FileText } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { Card } from '../../shared/ui/card';
import { useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";
interface Notif { id:string; tipo:string; mensagem:string; os_id?:number; numero_os?:string; icon:any; cor:string; badge:string; }
export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [aguardando, pendentes, concluidas] = await Promise.all([
      sb.from("ordens_servico").select("id,numero_os,cliente_nome").eq("status","aguardando_aprovacao").order("created_at",{ascending:true}).limit(5),
      sb.from("ordens_servico").select("id,numero_os,cliente_nome").eq("status","orcamento").order("created_at",{ascending:true}).limit(5),
      sb.from("ordens_servico").select("id,numero_os,cliente_nome").eq("status","concluido").order("created_at",{ascending:false}).limit(3),
    ]);
    const list: Notif[] = [];
    (aguardando.data||[]).forEach(o => list.push({
      id:"ag-"+o.id, tipo:"aguardando", mensagem:"OS "+o.numero_os+" aguarda aprovacao de "+( o.cliente_nome||"cliente"),
      os_id:o.id, numero_os:o.numero_os, icon:Clock, cor:"text-orange-400", badge:"bg-orange-900/50 text-orange-300"
    }));
    (pendentes.data||[]).forEach(o => list.push({
      id:"pe-"+o.id, tipo:"orcamento", mensagem:"Orcamento da OS "+o.numero_os+" precisa ser enviado",
      os_id:o.id, numero_os:o.numero_os, icon:FileText, cor:"text-yellow-400", badge:"bg-yellow-900/50 text-yellow-300"
    }));
    (concluidas.data||[]).forEach(o => list.push({
      id:"co-"+o.id, tipo:"concluido", mensagem:"OS "+o.numero_os+" concluida — agendar entrega",
      os_id:o.id, numero_os:o.numero_os, icon:CheckCircle, cor:"text-green-400", badge:"bg-green-900/50 text-green-300"
    }));
    setNotifs(list);
    setLoading(false);
  }
  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Bell className="h-8 w-8 text-yellow-400"/>Notificacoes
              {notifs.length > 0 && <Badge className="bg-red-600 text-white">{notifs.length}</Badge>}
            </h1>
            <p className="text-zinc-400 mt-1">Alertas gerados automaticamente das OS</p>
          </div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300">
            <RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/>
          </Button>
        </div>
        {loading ? <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-yellow-400"/></div>
        : notifs.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-60"/>
            <p className="text-lg font-medium text-green-400">Tudo em dia!</p>
            <p className="text-sm mt-1">Nenhuma notificacao pendente.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifs.map(n => { const Icon = n.icon; return (
              <Card key={n.id} onClick={() => n.os_id && navigate("/ordens-servico/"+n.os_id)}
                className={"bg-zinc-900 border-zinc-800 p-4 flex items-center gap-4 "+(n.os_id?"cursor-pointer hover:border-zinc-600":"")}>
                <div className={"w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0"}>
                  <Icon className={"h-5 w-5 "+n.cor}/>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{n.mensagem}</p>
                  {n.numero_os && <p className="text-zinc-500 text-xs font-mono mt-0.5">{n.numero_os}</p>}
                </div>
                <Badge className={n.badge+" text-xs"}>{n.tipo.replace(/_/g," ")}</Badge>
              </Card>
            );})}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
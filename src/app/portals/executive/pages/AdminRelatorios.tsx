import { useState, useEffect } from "react";
import { FileText, DollarSign, Car, Wrench, RefreshCw, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/shared/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from '@/app/shared/ui/button';
import { supabase as sb } from "@/lib/supabase";

const PIE_COLORS = ["#8b5cf6","#22c55e","#f59e0b","#3b82f6","#ef4444","#06b6d4","#ec4899"];

export default function AdminRelatorios() {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("mes");
  const [dados, setDados] = useState({ faturamento:0, ticket:0, totalOS:0, concluidas:0, clientes:0 });
  const [porStatus, setPorStatus] = useState<any[]>([]);
  const [porMes, setPorMes] = useState<any[]>([]);

  useEffect(() => { load(); }, [periodo]);

  async function load() {
    setLoading(true);
    const now = new Date();
    let start: Date;
    if (periodo==="semana") { start=new Date(now); start.setDate(now.getDate()-7); }
    else if (periodo==="mes") { start=new Date(now.getFullYear(),now.getMonth(),1); }
    else { start=new Date(now.getFullYear(),0,1); }
    const [os, clientes] = await Promise.all([
      sb.from("06_OS").select("status,valor_total,created_at").gte("created_at",start.toISOString()),
      sb.from("04_CLIENTS").select("id",{count:"exact",head:true}).gte("created_at",start.toISOString()),
    ]);
    const rows = os.data||[];
    const conc = rows.filter(r=>r.status==="concluido"||r.status==="entregue");
    const fat = conc.reduce((s,r)=>s+(r.valor_total||0),0);
    setDados({ faturamento:fat, ticket:conc.length>0?fat/conc.length:0, totalOS:rows.length, concluidas:conc.length, clientes:clientes.count||0 });
    const counts: Record<string,number>={};
    rows.forEach(r=>{ counts[r.status]=(counts[r.status]||0)+1; });
    setPorStatus(Object.entries(counts).map(([n,v],i)=>({ name:n.replace(/_/g," "), value:v, color:PIE_COLORS[i%PIE_COLORS.length] })));
    const meses: Record<string,number>={};
    rows.forEach(r=>{ const m=r.created_at?.slice(0,7); if(m) meses[m]=(meses[m]||0)+1; });
    setPorMes(Object.entries(meses).sort().map(([mes,total])=>({ mes:mes.slice(5), total })));
    setLoading(false);
  }

  const fmt = (v:number) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const pct = (v:number,t:number) => t>0 ? Math.round(v/t*100)+"%" : "0%";

  return (
    <>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><FileText className="h-8 w-8 text-blue-400"/>Relat�rios</h1>
            <p className="text-zinc-400 mt-1">An�lise de performance do per�odo</p></div>
          <div className="flex gap-2">
            {["semana","mes","ano"].map(p=>(
              <button key={p} onClick={()=>setPeriodo(p)}
                className={"px-4 py-1.5 rounded-full text-sm font-medium border transition-colors "+(periodo===p?"bg-blue-600 border-blue-500 text-white":"bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white")}>
                {p==="semana"?"7 dias":p==="mes"?"M�s":p==="ano"?"Ano":p}
              </button>
            ))}
            <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label:"Faturamento", value:fmt(dados.faturamento), icon:DollarSign, color:"text-green-400" },
            { label:"Ticket M�dio", value:fmt(dados.ticket), icon:DollarSign, color:"text-blue-400" },
            { label:"Total OS", value:dados.totalOS, icon:Car, color:"text-purple-400" },
            { label:"Conclu�das", value:dados.concluidas+" ("+pct(dados.concluidas,dados.totalOS)+")", icon:Wrench, color:"text-emerald-400" },
            { label:"Novos Clientes", value:dados.clientes, icon:Wrench, color:"text-yellow-400" },
          ].map((k,i)=>{ const Icon=k.icon; return (
            <Card key={i} className="bg-zinc-900 border-zinc-800"><CardContent className="pt-4">
              <Icon className={"h-4 w-4 mb-2 "+k.color}/>
              <p className={"font-bold "+k.color}>{loading?"�":k.value}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{k.label}</p>
            </CardContent></Card>
          );})}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white">OS por Status</CardTitle></CardHeader>
            <CardContent>
              {porStatus.length===0?<p className="text-zinc-500 text-sm py-8 text-center">Sem dados</p>:(
              <ResponsiveContainer width="100%" height={220}>
                <PieChart><Pie data={porStatus} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({name,value})=>name+" "+value}>
                  {porStatus.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie><Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px"}}/></PieChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800"><CardHeader><CardTitle className="text-white">OS por M�s</CardTitle></CardHeader>
            <CardContent>
              {porMes.length===0?<p className="text-zinc-500 text-sm py-8 text-center">Sem dados</p>:(
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={porMes}><CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
                  <XAxis dataKey="mes" tick={{fill:"#71717a",fontSize:11}}/><YAxis tick={{fill:"#71717a",fontSize:11}}/>
                  <Tooltip contentStyle={{backgroundColor:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px"}}/>
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

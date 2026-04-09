import { useState, useEffect } from "react";
import { Settings, RefreshCw, Loader2, Building, Database, Users, Car, FileText, Wrench } from "lucide-react";
import { Button } from '../../shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/ui/card';
import AdminLayout from "../../components/AdminLayout";
import { supabase as sb } from "../../../lib/supabase";
import { projectId } from "/utils/supabase/info";

export default function AdminConfiguracoes() {
  const [empresa, setEmpresa] = useState<any>(null);
  const [stats, setStats] = useState({ usuarios:0, clientes:0, veiculos:0, os:0, mecanicos:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [emp, users, cli, veic, os, mecs] = await Promise.all([
      sb.from("companies").select("*").limit(1).single(),
      sb.from("colaboradores").select("id",{count:"exact",head:true}),
      sb.from("clients").select("id",{count:"exact",head:true}),
      sb.from("vehicles").select("id",{count:"exact",head:true}),
      sb.from("ordens_servico").select("id",{count:"exact",head:true}),
      sb.from("mecanicos").select("id",{count:"exact",head:true}),
    ]);
    setEmpresa(emp.data);
    setStats({ usuarios:users.count||0, clientes:cli.count||0, veiculos:veic.count||0, os:os.count||0, mecanicos:mecs.count||0 });
    setLoading(false);
  }

  const STATS = [
    { label:"Usuários", value:stats.usuarios, icon:Users, color:"text-purple-400" },
    { label:"Clientes", value:stats.clientes, icon:Users, color:"text-blue-400" },
    { label:"Veículos", value:stats.veiculos, icon:Car, color:"text-cyan-400" },
    { label:"OS Total", value:stats.os, icon:FileText, color:"text-green-400" },
    { label:"Mecânicos", value:stats.mecanicos, icon:Wrench, color:"text-orange-400" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Settings className="h-8 w-8 text-zinc-400"/>Configurações</h1>
            <p className="text-zinc-400 mt-1">Dados do sistema e empresa</p></div>
          <Button onClick={load} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>

        {empresa && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Building className="h-5 w-5 text-blue-400"/>Empresa</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-zinc-500 text-xs">Nome</p><p className="text-white font-medium">{empresa.nome||empresa.name||"—"}</p></div>
              <div><p className="text-zinc-500 text-xs">CNPJ</p><p className="text-zinc-300 font-mono">{empresa.cnpj||"—"}</p></div>
              <div><p className="text-zinc-500 text-xs">Telefone</p><p className="text-zinc-300">{empresa.telefone||"—"}</p></div>
              <div><p className="text-zinc-500 text-xs">Email</p><p className="text-zinc-300">{empresa.email||"—"}</p></div>
              <div><p className="text-zinc-500 text-xs">Cidade</p><p className="text-zinc-300">{empresa.cidade||"—"} {empresa.estado&&"/ "+empresa.estado}</p></div>
              <div><p className="text-zinc-500 text-xs">Rede</p><p className="text-zinc-300">{empresa.rede||"Doctor Auto"}</p></div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Database className="h-5 w-5 text-green-400"/>Banco de Dados</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {STATS.map(s => { const Icon = s.icon; return (
                <div key={s.label} className="text-center p-3 bg-zinc-800 rounded-lg">
                  <Icon className={"h-6 w-6 mx-auto mb-1 "+s.color}/>
                  <p className={"text-xl font-bold "+s.color}>{loading?"—":s.value}</p>
                  <p className="text-zinc-500 text-xs">{s.label}</p>
                </div>
              );})}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white">Informações do Sistema</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { label:"Projeto Supabase", value: projectId || "N/A" },
              { label:"Ambiente", value:"Produção" },
              { label:"Versão", value:"MVP v1.0" },
              { label:"Stack", value:"React 19 + Vite + TypeScript + Supabase" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">{item.label}</span>
                <span className="text-zinc-200 font-mono text-xs">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
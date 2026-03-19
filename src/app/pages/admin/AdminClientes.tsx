import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Users, Search, RefreshCw, Loader2, Plus, Phone, Mail, Car } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import AdminLayout from "../../components/AdminLayout";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://acuufrgoyjwzlyhopaus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4"
);

interface Cliente {
  id:number; full_name:string; email:string|null; phone:string|null;
  cpf:string|null; cidade:string|null; status_cadastro:string|null; created_at:string;
  _osCount?:number;
}

export default function AdminClientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE = 20;

  useEffect(() => { load(); }, [page]);

  async function load() {
    setLoading(true);
    const [{ data, count }] = await Promise.all([
      sb.from("04_CLIENTS").select("id,full_name,email,phone,cpf,cidade,status_cadastro,created_at", { count:"exact" })
        .order("created_at",{ascending:false})
        .range(page*PAGE, (page+1)*PAGE-1)
    ]);
    setClientes(data||[]);
    setTotal(count||0);
    setLoading(false);
  }

  async function buscar() {
    if (!search.trim()) { load(); return; }
    setLoading(true);
    const { data } = await sb.from("04_CLIENTS")
      .select("id,full_name,email,phone,cpf,cidade,status_cadastro,created_at")
      .or("full_name.ilike.%"+search+"%,phone.ilike.%"+search+"%,cpf.ilike.%"+search+"%,email.ilike.%"+search+"%")
      .order("created_at",{ascending:false}).limit(50);
    setClientes(data||[]);
    setLoading(false);
  }

  const fmtDate = (d:string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Users className="h-8 w-8 text-blue-400"/>Clientes</h1>
            <p className="text-zinc-400 mt-1">{total} clientes cadastrados em 04_CLIENTS</p>
          </div>
          <Button onClick={() => navigate("/ordens-servico/nova")} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2"/>Nova OS</Button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"/>
            <Input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==="Enter" && buscar()}
              placeholder="Nome, telefone, CPF ou email..." className="pl-10 bg-zinc-800 border-zinc-700 text-white"/>
          </div>
          <Button onClick={buscar} className="bg-blue-700 hover:bg-blue-600">Buscar</Button>
          <Button onClick={() => { setSearch(""); load(); }} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4"+(loading?" animate-spin":"")}/></Button>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800"><tr>{["Nome","Contato","CPF","Cidade","Status","Cadastro",""].map(h =>
              <th key={h} className="px-4 py-3 text-left text-zinc-400 font-medium">{h}</th>
            )}</tr></thead>
            <tbody>
              {loading ? (<tr><td colSpan={7} className="py-16 text-center text-zinc-500"><Loader2 className="h-6 w-6 animate-spin mx-auto mb-2"/>Carregando...</td></tr>)
              : clientes.length === 0 ? (<tr><td colSpan={7} className="py-16 text-center text-zinc-500">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30"/>
                <p>Nenhum cliente encontrado</p>
                <p className="text-xs mt-1">Clientes são criados ao abrir uma Nova OS</p>
              </td></tr>)
              : clientes.map(c => (
                <tr key={c.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 cursor-pointer" onClick={() => navigate("/clientes/"+c.id)}>
                  <td className="px-4 py-3"><p className="text-white font-medium">{c.full_name||"—"}</p></td>
                  <td className="px-4 py-3">
                    {c.phone && <p className="text-zinc-300 text-xs flex items-center gap-1"><Phone className="h-3 w-3"/>{c.phone}</p>}
                    {c.email && <p className="text-zinc-500 text-xs flex items-center gap-1"><Mail className="h-3 w-3"/>{c.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{c.cpf||"—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.cidade||"—"}</td>
                  <td className="px-4 py-3"><Badge className="bg-green-900/40 text-green-300 text-xs border border-green-800">{c.status_cadastro||"ativo"}</Badge></td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{fmtDate(c.created_at)}</td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs">Ver →</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <span className="text-zinc-500 text-xs">{total} clientes total | Página {page+1}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page===0} onClick={() => setPage(p=>p-1)} className="border-zinc-700 text-zinc-300 h-7 text-xs">← Anterior</Button>
              <Button size="sm" variant="outline" disabled={clientes.length < PAGE} onClick={() => setPage(p=>p+1)} className="border-zinc-700 text-zinc-300 h-7 text-xs">Próxima →</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
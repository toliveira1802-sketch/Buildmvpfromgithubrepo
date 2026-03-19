import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Search, UserCheck, UserX, Shield, RefreshCw, Wrench, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import DevLayout from "../components/DevLayout";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://acuufrgoyjwzlyhopaus.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXVmcmdveWp3emx5aG9wYXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2Mjk4OCwiZXhwIjoyMDgzODM4OTg4fQ.mCMQoBXRwSNrd1VgEa1uHCJwP3mcto5xjlt3LF6VUO4";
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
async function createAuthUser(email: string, password: string, meta: object): Promise<string> {
  const res = await fetch(SUPABASE_URL+"/auth/v1/admin/users", { method: "POST", headers: { "Content-Type": "application/json", "apikey": SERVICE_KEY, "Authorization": "Bearer "+SERVICE_KEY }, body: JSON.stringify({ email, password, email_confirm: true, user_metadata: meta }) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || json.message || JSON.stringify(json));
  return json.id as string;
}
async function deleteAuthUser(uid: string) {
  await fetch(SUPABASE_URL+"/auth/v1/admin/users/"+uid, { method: "DELETE", headers: { "apikey": SERVICE_KEY, "Authorization": "Bearer "+SERVICE_KEY } });
}
type Cargo = "Dev" | "Gestao" | "Consultor" | "Mecanico";
type Nivel = "junior" | "pleno" | "senior" | "master";
interface Usuario { id: number; nome: string; email: string|null; username: string|null; cargo: string|null; nivelAcessoId: number|null; ativo: boolean; primeiroAcesso: boolean; auth_user_id: string|null; createdAt: string; mecanico?: {especialidade:string|null;nivel:string}|null; }
interface FormData { nome:string; username:string; telefone:string; cpf:string; cargo:Cargo; especialidade:string; nivel:Nivel; }
const NIVEL_ACESSO: Record<Cargo,number> = {Dev:1,Gestao:2,Consultor:3,Mecanico:4};
const CARGO_COLORS: Record<string,string> = {Dev:"bg-purple-600",Gestao:"bg-blue-600",Consultor:"bg-green-600",Mecanico:"bg-orange-600"};
export default function DevUsers() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState(""); const [cargoFilter, setCargoFilter] = useState("todos");
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false); const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Usuario|null>(null);
  const emptyForm: FormData = {nome:"",username:"",telefone:"",cpf:"",cargo:"Consultor",especialidade:"",nivel:"junior"};
  const [form, setForm] = useState<FormData>(emptyForm);
  const load = async () => {
    setLoading(true);
    try {
      const {data:users,error} = await supabaseAdmin.from("10_users").select("id,nome,email,username,cargo,nivelAcessoId,ativo,primeiroAcesso,auth_user_id,createdAt").order("createdAt",{ascending:false});
      if (error) throw error;
      const mecIds = (users||[]).filter(u=>u.nivelAcessoId===4).map(u=>u.id);
      const mecMap:Record<number,any>={};
      if (mecIds.length>0) { const {data:mecs} = await supabaseAdmin.from("12_MECANICOS").select("user_id,especialidade,nivel").in("user_id",mecIds); (mecs||[]).forEach(m=>{mecMap[m.user_id]=m;}); }
      setUsuarios((users||[]).map(u=>({...u,mecanico:mecMap[u.id]??null})));
    } catch(err:any){ toast.error("Erro: "+err.message); } finally { setLoading(false); }
  };
  useEffect(()=>{load();},[]);
  const filtered = usuarios.filter(u=>{ const q=search.toLowerCase(); return (!q||u.nome.toLowerCase().includes(q)||u.username?.toLowerCase().includes(q))&&(cargoFilter==="todos"||u.cargo===cargoFilter); });
  const stats={total:usuarios.length,ativos:usuarios.filter(u=>u.ativo).length,inativos:usuarios.filter(u=>!u.ativo).length,primeiroAcesso:usuarios.filter(u=>u.primeiroAcesso).length};
  const handleCreate = async () => {
    if (!form.nome){toast.error("Nome obrigatorio");return;} setSaving(true);
    try {
      const {data:senhaHash,error:hashErr} = await supabaseAdmin.rpc("hash_password",{p_password:"123456"}); if (hashErr) throw hashErr;
      const autoUsername = form.username||(form.cargo+"_"+form.nome.split(" ")[0].toLowerCase());
      const autoEmail = autoUsername.toLowerCase().replace(/\s/g,"")+"@doctorauto.internal";
      const auth_user_id = await createAuthUser(autoEmail,"123456",{nome:form.nome,cargo:form.cargo});
      const {data:newUser,error:userErr} = await supabaseAdmin.from("10_users").insert({nome:form.nome,email:autoEmail,username:autoUsername,telefone:form.telefone||null,cpf:form.cpf||null,cargo:form.cargo,nivelAcessoId:NIVEL_ACESSO[form.cargo],auth_user_id,senha:senhaHash,ativo:true,primeiroAcesso:true,empresaId:1}).select("id").single();
      if (userErr) throw userErr;
      if (form.cargo==="Mecanico") { const {error:mecErr} = await supabaseAdmin.from("12_MECANICOS").insert({user_id:newUser.id,auth_user_id,nome:form.nome,telefone:form.telefone||null,cpf:form.cpf||null,especialidade:form.especialidade||null,nivel:form.nivel}); if (mecErr) throw mecErr; }
      toast.success("Criado: "+autoUsername+" | Senha: 123456");
      setCreateOpen(false);setForm(emptyForm);load();
    } catch(err:any){toast.error("Erro: "+err.message);} finally{setSaving(false);}
  };
  const handleToggle = async (u:Usuario)=>{ const {error} = await supabaseAdmin.from("10_users").update({ativo:!u.ativo}).eq("id",u.id); if (error){toast.error(error.message);return;} toast.success(u.nome+" "+(u.ativo?"desativado":"ativado"));load(); };
  const handleDelete = async ()=>{ if (!selected) return; setSaving(true); try { const {error} = await supabaseAdmin.from("10_users").delete().eq("id",selected.id); if (error) throw error; if (selected.auth_user_id) await deleteAuthUser(selected.auth_user_id); toast.success(selected.nome+" removido"); setDeleteOpen(false);setSelected(null);load(); } catch(err:any){toast.error("Erro: "+err.message);} finally{setSaving(false);} };
  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-white flex items-center gap-2"><Users className="h-8 w-8 text-red-400"/>Usuarios do Sistema</h1><p className="text-zinc-400 mt-1">Somente DEV cadastra</p></div>
          <div className="flex gap-2">
            <Button onClick={load} disabled={loading} variant="outline" className="border-zinc-700 text-zinc-300"><RefreshCw className={"h-4 w-4 mr-2"+(loading?" animate-spin":"")}/>    Atualizar</Button>
            <Button onClick={()=>{setForm(emptyForm);setCreateOpen(true);}} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2"/>Novo Usuario</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{label:"Total",value:stats.total,icon:Users,color:"text-blue-400",bg:"bg-blue-950/30 border-blue-900/40"},{label:"Ativos",value:stats.ativos,icon:UserCheck,color:"text-green-400",bg:"bg-green-950/30 border-green-900/40"},{label:"Inativos",value:stats.inativos,icon:UserX,color:"text-zinc-400",bg:"bg-zinc-800 border-zinc-700"},{label:"1 Acesso",value:stats.primeiroAcesso,icon:Shield,color:"text-yellow-400",bg:"bg-yellow-950/30 border-yellow-900/40"}].map(s=>{const Icon=s.icon;return(<Card key={s.label} className={"p-4 border "+s.bg}><div className="flex items-center gap-3"><Icon className={"h-6 w-6 "+s.color}/><div><p className="text-xs text-zinc-400">{s.label}</p><p className={"text-2xl font-bold "+s.color}>{s.value}</p></div></div></Card>);})}
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="pl-10 bg-zinc-800 border-zinc-700 text-white"/></div>
          <select value={cargoFilter} onChange={e=>setCargoFilter(e.target.value)} className="bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm"><option value="todos">Todos</option>{["Dev","Gestao","Consultor","Mecanico"].map(c=><option key={c} value={c}>{c}</option>)}</select>
        </div>
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800"><tr>{["Usuario","Cargo","Auth","Status","Mecanico",""].map(h=><th key={h} className="px-4 py-3 text-left text-zinc-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {loading?(<tr><td colSpan={6} className="py-16 text-center text-zinc-500"><Loader2 className="h-6 w-6 animate-spin mx-auto mb-2"/>Carregando...</td></tr>):filtered.length===0?(<tr><td colSpan={6} className="py-16 text-center text-zinc-500">Nenhum usuario</td></tr>):filtered.map(u=>(
                <tr key={u.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30">
                  <td className="px-4 py-3"><p className="text-white font-medium">{u.nome}</p><p className="text-zinc-400 text-xs font-mono">{u.username}</p>{u.primeiroAcesso&&<Badge className="mt-1 bg-yellow-900/40 text-yellow-400 text-xs border border-yellow-800">1 acesso</Badge>}</td>
                  <td className="px-4 py-3"><Badge className={(CARGO_COLORS[u.cargo||""]||"bg-zinc-700")+" text-white text-xs"}>{u.cargo||"---"}</Badge></td>
                  <td className="px-4 py-3">{u.auth_user_id?<span className="text-green-400 text-xs">vinculado</span>:<span className="text-zinc-500 text-xs">sem auth</span>}</td>
                  <td className="px-4 py-3"><button onClick={()=>handleToggle(u)}><Badge className={u.ativo?"bg-green-900/40 text-green-400 border border-green-800 cursor-pointer":"bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-pointer"}>{u.ativo?"Ativo":"Inativo"}</Badge></button></td>
                  <td className="px-4 py-3">{u.mecanico?<div><p className="text-zinc-300 text-xs">{u.mecanico.especialidade||"---"}</p><Badge className="bg-orange-900/40 text-orange-300 text-xs border border-orange-800 mt-0.5">{u.mecanico.nivel}</Badge></div>:<span className="text-zinc-600 text-xs">---</span>}</td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-red-950" onClick={()=>{setSelected(u);setDeleteOpen(true);}}><Trash2 className="h-3.5 w-3.5 text-red-400"/></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-red-400"/>Novo Usuario</DialogTitle><DialogDescription className="text-zinc-400">Cria em auth.users + 10_users{form.cargo==="Mecanico"&&" + 12_MECANICOS"}. Email gerado automaticamente.</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label className="text-zinc-300 text-xs">Nome Completo *</Label><Input value={form.nome} onChange={e=>setForm(p=>({...p,nome:e.target.value}))} placeholder="Nome completo" className="bg-zinc-800 border-zinc-700 text-white mt-1"/></div>
              <div><Label className="text-zinc-300 text-xs">Username (opcional)</Label><Input value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} placeholder="auto: Cargo_nome" className="bg-zinc-800 border-zinc-700 text-white mt-1"/></div>
              <div><Label className="text-zinc-300 text-xs">Telefone</Label><Input value={form.telefone} onChange={e=>setForm(p=>({...p,telefone:e.target.value}))} placeholder="(11) 99999-0000" className="bg-zinc-800 border-zinc-700 text-white mt-1"/></div>
              <div><Label className="text-zinc-300 text-xs">CPF</Label><Input value={form.cpf} onChange={e=>setForm(p=>({...p,cpf:e.target.value}))} placeholder="000.000.000-00" className="bg-zinc-800 border-zinc-700 text-white mt-1"/></div>
              <div><Label className="text-zinc-300 text-xs">Cargo *</Label><select value={form.cargo} onChange={e=>setForm(p=>({...p,cargo:e.target.value as Cargo}))} className="mt-1 w-full bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">{(["Dev","Gestao","Consultor","Mecanico"] as Cargo[]).map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            {form.cargo==="Mecanico"&&(<div className="p-3 bg-orange-950/30 border border-orange-800/50 rounded-lg space-y-3"><p className="text-orange-300 text-xs font-medium flex items-center gap-1"><Wrench className="h-3 w-3"/>12_MECANICOS</p><div className="grid grid-cols-2 gap-3"><div><Label className="text-zinc-300 text-xs">Especialidade</Label><Input value={form.especialidade} onChange={e=>setForm(p=>({...p,especialidade:e.target.value}))} placeholder="Eletrica..." className="bg-zinc-800 border-zinc-700 text-white mt-1"/></div><div><Label className="text-zinc-300 text-xs">Nivel</Label><select value={form.nivel} onChange={e=>setForm(p=>({...p,nivel:e.target.value as Nivel}))} className="mt-1 w-full bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">{(["junior","pleno","senior","master"] as Nivel[]).map(n=><option key={n} value={n}>{n}</option>)}</select></div></div></div>)}
            <div className="p-3 bg-zinc-800/50 border border-zinc-700/40 rounded-lg"><p className="text-zinc-400 text-xs">Login: Username + senha 123456 — email gerado internamente pelo sistema</p></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>{setCreateOpen(false);setForm(emptyForm);}} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving||!form.nome} className="bg-red-600 hover:bg-red-700">{saving?<Loader2 className="h-4 w-4 mr-2 animate-spin"/>:<Plus className="h-4 w-4 mr-2"/>}{saving?"Criando...":"Criar Usuario"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Remover?</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">Remove {selected?.nome} de 10_users e auth.users.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete} disabled={saving} className="bg-red-600 text-white hover:bg-red-700">{saving?"Removendo...":"Confirmar"}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DevLayout>
  );
}

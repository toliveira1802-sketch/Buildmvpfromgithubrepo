import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, User, Car, Calendar, Wrench, Package,
  Plus, Trash2, Save, Search, Loader2, AlertCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../../lib/supabase";

interface Cliente { id: string; full_name: string; phone: string | null; email: string | null; }
interface Veiculo { id: string; placa: string; marca: string | null; modelo: string; versao: string | null; ano: number | null; ultima_km: number | null; }
interface Item { _key: string; tipo: "servico" | "peca" | "fluido" | "outros"; descricao: string; quantidade: number; valor_unitario: number; valor_total: number; }

export default function AdminNovaOS() {
  const navigate = useNavigate();
  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteResults, setClienteResults] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [showClienteDrop, setShowClienteDrop] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const clienteRef = useRef<HTMLDivElement>(null);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [clienteManual, setClienteManual] = useState({ nome: "", telefone: "" });
  const [veiculoManual, setVeiculoManual] = useState({ placa: "", modelo: "", marca: "", ano: "" });
  const [modoManual, setModoManual] = useState(false);
  const [kmEntrada, setKmEntrada] = useState("");
  const [nivelCombustivel, setNivelCombustivel] = useState("");
  const [descricaoProblema, setDescricaoProblema] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [dataPrevisao, setDataPrevisao] = useState("");
  const [itens, setItens] = useState<Item[]>([]);
  const [novoItem, setNovoItem] = useState({ tipo: "servico" as Item["tipo"], descricao: "", quantidade: "1", valor_unitario: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!clienteQuery || clienteQuery.length < 2 || modoManual) { setClienteResults([]); return; }
    const timer = setTimeout(async () => {
      setLoadingClientes(true);
      const { data } = await supabase.from("04_CLIENTS").select("id, full_name, phone, email")
        .or(`full_name.ilike.%${clienteQuery}%,phone.ilike.%${clienteQuery}%,email.ilike.%${clienteQuery}%`).limit(8);
      setClienteResults(data || []); setShowClienteDrop(true); setLoadingClientes(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [clienteQuery, modoManual]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (clienteRef.current && !clienteRef.current.contains(e.target as Node)) setShowClienteDrop(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selecionarCliente = async (c: Cliente) => {
    setClienteSelecionado(c); setClienteQuery(c.full_name); setShowClienteDrop(false);
    const { data } = await supabase.from("05_VEHICLES").select("id, placa, marca, modelo, versao, ano, ultima_km").eq("client_id", c.id).eq("is_active", true);
    setVeiculos(data || []); setVeiculoSelecionado(null);
    if (data && data.length === 1) { setVeiculoSelecionado(data[0]); if (data[0].ultima_km) setKmEntrada(String(data[0].ultima_km)); }
    toast.success(`Cliente ${c.full_name} selecionado`);
  };

  const addItem = () => {
    if (!novoItem.descricao || !novoItem.valor_unitario) { toast.error("Preencha descrição e valor"); return; }
    const qtd = parseFloat(novoItem.quantidade) || 1;
    const unit = parseFloat(novoItem.valor_unitario) || 0;
    setItens(prev => [...prev, { _key: `${Date.now()}`, tipo: novoItem.tipo, descricao: novoItem.descricao, quantidade: qtd, valor_unitario: unit, valor_total: qtd * unit }]);
    setNovoItem({ tipo: "servico", descricao: "", quantidade: "1", valor_unitario: "" });
  };

  const removeItem = (key: string) => setItens(prev => prev.filter(i => i._key !== key));

  const totalServicos = itens.filter(i => i.tipo === "servico").reduce((s, i) => s + i.valor_total, 0);
  const totalPecas    = itens.filter(i => i.tipo !== "servico").reduce((s, i) => s + i.valor_total, 0);
  const valorOrcado   = totalServicos + totalPecas;
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleSubmit = async () => {
    const nomeCliente     = modoManual ? clienteManual.nome      : clienteSelecionado?.full_name;
    const telefoneCliente = modoManual ? clienteManual.telefone  : clienteSelecionado?.phone;
    const placa           = modoManual ? veiculoManual.placa     : veiculoSelecionado?.placa;
    const modelo          = modoManual ? veiculoManual.modelo    : veiculoSelecionado?.modelo;
    if (!nomeCliente && !telefoneCliente) { toast.error("Informe pelo menos nome ou telefone"); return; }
    if (!placa || !modelo) { toast.error("Informe placa e modelo do veículo"); return; }
    setSaving(true);
    try {
      const osPayload: Record<string, unknown> = {
        client_id: clienteSelecionado?.id ?? null,
        vehicle_id: veiculoSelecionado?.id ?? null,
        client_nome: nomeCliente ?? null,
        client_phone: telefoneCliente ?? null,
        veiculo_placa: placa,
        veiculo_modelo: modelo,
        veiculo_marca: modoManual ? veiculoManual.marca : (veiculoSelecionado?.marca ?? null),
        veiculo_ano: modoManual ? (parseInt(veiculoManual.ano) || null) : (veiculoSelecionado?.ano ?? null),
        km_entrada: kmEntrada ? parseInt(kmEntrada) : null,
        nivel_combustivel: nivelCombustivel || null,
        descricao_problema: descricaoProblema || null,
        observacoes: observacoes || null,
        prioridade,
        data_previsao_entrega: dataPrevisao || null,
        valor_orcado: valorOrcado,
        valor_mao_obra: totalServicos,
        valor_pecas: totalPecas,
        status: "diagnostico", // ← fluxo inicia em diagnóstico
      };
      const { data: osData, error: osError } = await supabase.from("06_OS").insert(osPayload).select("id, numero_os").single();
      if (osError) throw osError;
      if (itens.length > 0) {
        const itensPayload = itens.map(i => ({ os_id: osData.id, tipo: i.tipo, descricao: i.descricao, quantidade: i.quantidade, valor_unitario: i.valor_unitario, valor_total: i.valor_total, status: "pendente" }));
        const { error: itensError } = await supabase.from("07_OS_ITENS").insert(itensPayload);
        if (itensError) throw itensError;
      }
      toast.success(`OS ${osData.numero_os} criada! 🎉`);
      setTimeout(() => navigate("/ordens-servico"), 1200);
    } catch (err: any) {
      console.error(err); toast.error(`Erro: ${err.message}`);
    } finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/ordens-servico")} className="text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Nova Ordem de Serviço</h1>
              <p className="text-zinc-400 mt-1">Inicia em <span className="text-purple-400 font-medium">diagnóstico</span> → gravado em <code className="text-blue-400">06_OS</code></p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Salvando..." : "Salvar OS"}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {["buscar","manual"].map(modo => (
            <button key={modo}
              onClick={() => { setModoManual(modo === "manual"); setClienteSelecionado(null); setClienteQuery(""); setVeiculos([]); setVeiculoSelecionado(null); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${(modo === "manual") === modoManual ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
              {modo === "buscar" ? "Buscar cadastro" : "Informar manualmente"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CLIENTE */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><User className="h-5 w-5 text-blue-400" /> Dados do Cliente</CardTitle>
              <CardDescription className="text-zinc-400">{modoManual ? "Preenchimento manual" : "Busca em 04_CLIENTS"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!modoManual ? (
                <div ref={clienteRef} className="relative">
                  <Label className="text-zinc-300">Buscar cliente</Label>
                  <div className="relative mt-1">
                    <Input value={clienteQuery} onChange={e => { setClienteQuery(e.target.value); setClienteSelecionado(null); }} placeholder="Nome, telefone ou e-mail..." className="bg-zinc-800 border-zinc-700 text-white pr-10" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">{loadingClientes ? <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" /> : <Search className="h-4 w-4 text-zinc-400" />}</div>
                  </div>
                  {showClienteDrop && clienteResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl max-h-56 overflow-auto">
                      {clienteResults.map(c => (
                        <div key={c.id} onClick={() => selecionarCliente(c)} className="px-4 py-3 cursor-pointer hover:bg-zinc-700 border-b border-zinc-700 last:border-b-0">
                          <p className="text-white font-medium">{c.full_name}</p>
                          <p className="text-zinc-400 text-xs">{c.phone}{c.email ? ` • ${c.email}` : ""}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {showClienteDrop && clienteQuery.length >= 2 && !loadingClientes && clienteResults.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center">
                      <p className="text-zinc-400 text-sm">Nenhum cliente encontrado</p>
                      <button onClick={() => setModoManual(true)} className="text-blue-400 text-xs mt-1 hover:underline">Informar manualmente →</button>
                    </div>
                  )}
                  {clienteSelecionado && (
                    <div className="mt-2 p-3 bg-blue-950 border border-blue-800 rounded-lg flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400 shrink-0" />
                      <div><p className="text-white text-sm font-medium">{clienteSelecionado.full_name}</p><p className="text-blue-300 text-xs">{clienteSelecionado.phone}</p></div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div><Label className="text-zinc-300">Nome *</Label><Input value={clienteManual.nome} onChange={e => setClienteManual(p => ({ ...p, nome: e.target.value }))} placeholder="Nome completo" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                  <div><Label className="text-zinc-300">Telefone</Label><Input value={clienteManual.telefone} onChange={e => setClienteManual(p => ({ ...p, telefone: e.target.value }))} placeholder="(11) 99999-0000" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                </>
              )}
            </CardContent>
          </Card>

          {/* VEÍCULO */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Car className="h-5 w-5 text-orange-400" /> Dados do Veículo</CardTitle>
              <CardDescription className="text-zinc-400">{modoManual ? "Preenchimento manual" : clienteSelecionado ? `${veiculos.length} veículo(s)` : "Selecione um cliente"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!modoManual ? (
                <>
                  {veiculos.map(v => (
                    <div key={v.id} onClick={() => { setVeiculoSelecionado(v); if (v.ultima_km) setKmEntrada(String(v.ultima_km)); }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${veiculoSelecionado?.id === v.id ? "border-orange-500 bg-orange-950/40" : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"}`}>
                      <div className="flex justify-between items-start">
                        <div><p className="text-white font-medium">{v.marca} {v.modelo} {v.versao}</p><p className="text-zinc-400 text-xs">{v.placa}{v.ano ? ` • ${v.ano}` : ""}</p></div>
                        {v.ultima_km && <Badge className="bg-zinc-700 text-zinc-300 text-xs">{v.ultima_km.toLocaleString()} km</Badge>}
                      </div>
                    </div>
                  ))}
                  {clienteSelecionado && veiculos.length === 0 && (
                    <div className="flex items-center gap-2 text-yellow-400 text-sm p-3 bg-yellow-950/30 border border-yellow-800/50 rounded-lg">
                      <AlertCircle className="h-4 w-4 shrink-0" /><span>Sem veículos. Use modo manual ou cadastre em Clientes.</span>
                    </div>
                  )}
                  {veiculoSelecionado && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div><Label className="text-zinc-300">KM Entrada</Label><Input type="number" value={kmEntrada} onChange={e => setKmEntrada(e.target.value)} placeholder="0" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                      <div><Label className="text-zinc-300">Combustível</Label>
                        <select value={nivelCombustivel} onChange={e => setNivelCombustivel(e.target.value)} className="mt-1 w-full bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">
                          <option value="">—</option>{["vazio","1/4","1/2","3/4","cheio"].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[{key:"placa",label:"Placa *",ph:"ABC1D234",upper:true},{key:"modelo",label:"Modelo *",ph:"Gol...",upper:false},{key:"marca",label:"Marca",ph:"VW...",upper:false},{key:"ano",label:"Ano",ph:"2020",upper:false}].map(f => (
                    <div key={f.key}><Label className="text-zinc-300">{f.label}</Label><Input value={(veiculoManual as any)[f.key]} onChange={e => setVeiculoManual(p => ({...p,[f.key]:f.upper?e.target.value.toUpperCase():e.target.value}))} placeholder={f.ph} className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                  ))}
                  <div><Label className="text-zinc-300">KM Entrada</Label><Input type="number" value={kmEntrada} onChange={e => setKmEntrada(e.target.value)} placeholder="0" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                  <div><Label className="text-zinc-300">Combustível</Label>
                    <select value={nivelCombustivel} onChange={e => setNivelCombustivel(e.target.value)} className="mt-1 w-full bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">
                      <option value="">—</option>{["vazio","1/4","1/2","3/4","cheio"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detalhes */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Calendar className="h-5 w-5 text-purple-400" /> Detalhes da OS</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label className="text-zinc-300">Prioridade</Label>
              <select value={prioridade} onChange={e => setPrioridade(e.target.value)} className="mt-1 w-full bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">
                {["baixa","media","alta","urgente"].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
              </select>
            </div>
            <div><Label className="text-zinc-300">Previsão de Entrega</Label><Input type="datetime-local" value={dataPrevisao} onChange={e => setDataPrevisao(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
            <div className="md:col-span-3"><Label className="text-zinc-300">Descrição do Problema</Label><Textarea value={descricaoProblema} onChange={e => setDescricaoProblema(e.target.value)} placeholder="O que o cliente relatou..." rows={3} className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none" /></div>
            <div className="md:col-span-3"><Label className="text-zinc-300">Observações internas</Label><Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Obs para a equipe..." rows={2} className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none" /></div>
          </CardContent>
        </Card>

        {/* Itens */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Wrench className="h-5 w-5 text-yellow-400" /> Itens da OS</CardTitle>
            <CardDescription className="text-zinc-400">Serviços e peças — gravados em <code className="text-yellow-400">07_OS_ITENS</code></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-12 gap-2 p-4 bg-zinc-800/50 rounded-xl">
              <select value={novoItem.tipo} onChange={e => setNovoItem(p => ({...p,tipo:e.target.value as Item["tipo"]}))} className="col-span-2 bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">
                {["servico","peca","fluido","outros"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Input placeholder="Descrição *" value={novoItem.descricao} onChange={e => setNovoItem(p => ({...p,descricao:e.target.value}))} className="col-span-5 bg-zinc-800 border-zinc-700 text-white" />
              <Input type="number" placeholder="Qtd" value={novoItem.quantidade} onChange={e => setNovoItem(p => ({...p,quantidade:e.target.value}))} className="col-span-2 bg-zinc-800 border-zinc-700 text-white" />
              <Input type="number" placeholder="R$ *" value={novoItem.valor_unitario} onChange={e => setNovoItem(p => ({...p,valor_unitario:e.target.value}))} className="col-span-2 bg-zinc-800 border-zinc-700 text-white" />
              <Button onClick={addItem} className="col-span-1 bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4" /></Button>
            </div>
            {itens.length > 0 ? (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-zinc-800">{["Tipo","Descrição","Qtd","Unit.","Total",""].map(h => <th key={h} className={`py-2 px-3 text-zinc-400 font-medium ${["Qtd","Unit.","Total"].includes(h)?"text-right":""}`}>{h}</th>)}</tr></thead>
                <tbody>
                  {itens.map(item => (
                    <tr key={item._key} className="border-b border-zinc-800/60 hover:bg-zinc-800/30">
                      <td className="py-2 px-3"><Badge className={`text-xs ${item.tipo==="servico"?"bg-blue-900 text-blue-300":item.tipo==="peca"?"bg-orange-900 text-orange-300":"bg-zinc-700 text-zinc-300"}`}>{item.tipo}</Badge></td>
                      <td className="py-2 px-3 text-white">{item.descricao}</td>
                      <td className="py-2 px-3 text-zinc-300 text-right">{item.quantidade}</td>
                      <td className="py-2 px-3 text-zinc-300 text-right">{fmt(item.valor_unitario)}</td>
                      <td className="py-2 px-3 text-green-400 font-semibold text-right">{fmt(item.valor_total)}</td>
                      <td className="py-2 px-3"><Button variant="ghost" size="sm" onClick={() => removeItem(item._key)} className="h-7 w-7 p-0 hover:bg-red-950"><Trash2 className="h-3.5 w-3.5 text-red-400" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-zinc-500"><Package className="h-8 w-8 mx-auto mb-2 opacity-30" /><p className="text-sm">Nenhum item adicionado ainda</p></div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/60 to-zinc-900 border-green-800/50">
          <CardHeader><CardTitle className="text-white text-xl">Resumo do Orçamento</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-zinc-300"><span>Mão de obra:</span><span className="font-medium text-white">{fmt(totalServicos)}</span></div>
            <div className="flex justify-between text-zinc-300"><span>Peças / materiais:</span><span className="font-medium text-white">{fmt(totalPecas)}</span></div>
            <div className="border-t border-green-800/50 pt-3 flex justify-between text-2xl">
              <span className="text-white font-bold">Total orçado:</span>
              <span className="text-green-400 font-bold">{fmt(valorOrcado)}</span>
            </div>
            <p className="text-zinc-500 text-xs pt-1">Status inicial: <span className="text-purple-400 font-medium">diagnóstico</span> → fluxo avança conforme OS progride</p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pb-6">
          <Button variant="ghost" onClick={() => navigate("/ordens-servico")} className="text-zinc-400 hover:text-white">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving} size="lg" className="bg-green-600 hover:bg-green-700 px-8">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Salvando OS..." : "Criar Ordem de Serviço"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

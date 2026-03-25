import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, User, Car, Wrench, ClipboardList,
  Plus, Trash2, Save, Search, Loader2, AlertCircle,
  CheckCircle2, ChevronRight, Package, UserPlus, X
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import ConsultorLayout from "../../components/ConsultorLayout";
import { supabase } from "../../../lib/supabase";

interface Cliente { id: string; full_name: string; phone: string | null; email: string | null; cpf: string | null; }
interface Veiculo { id: string; placa: string; marca: string | null; modelo: string; versao: string | null; ano: number | null; ultima_km: number | null; }
interface Item { _key: string; tipo: "servico" | "peca" | "fluido" | "outros"; descricao: string; quantidade: number; valor_unitario: number; valor_total: number; }

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { label: "Cliente",      icon: User },
  { label: "Veículo",      icon: Car },
  { label: "Serviço",      icon: Wrench },
  { label: "Confirmação",  icon: ClipboardList },
];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminNovaOS() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);

  // --- STEP 0: Cliente ---
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [savingCliente, setSavingCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    full_name: "", phone: "", email: "", cpf: "", birthday: "", address: "", zip_code: ""
  });
  const dropRef = useRef<HTMLDivElement>(null);

  // --- STEP 1: Veículo ---
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [veiculoManual, setVeiculoManual] = useState({ placa: "", modelo: "", marca: "", ano: "" });
  const [modoVeiculoManual, setModoVeiculoManual] = useState(false);
  const [kmEntrada, setKmEntrada] = useState("");
  const [nivelCombustivel, setNivelCombustivel] = useState("");

  // --- STEP 2: Serviço ---
  const [descricao, setDescricao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [dataPrevisao, setDataPrevisao] = useState("");
  const [itens, setItens] = useState<Item[]>([]);
  const [novoItem, setNovoItem] = useState({ tipo: "servico" as Item["tipo"], descricao: "", quantidade: "1", valor_unitario: "" });

  // --- STEP 3: Submit ---
  const [saving, setSaving] = useState(false);

  // Busca cliente com debounce
  useEffect(() => {
    if (query.length < 2) { setResults([]); setSearched(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase.from("04_CLIENTS")
        .select("id, full_name, phone, email, cpf")
        .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,cpf.ilike.%${query}%`)
        .limit(8);
      setResults(data || []);
      setSearched(true);
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  // Carrega veículos ao selecionar cliente
  const selecionarCliente = async (c: Cliente) => {
    setCliente(c);
    setShowNovoCliente(false);
    const { data } = await supabase.from("05_VEHICLES")
      .select("id, placa, marca, modelo, versao, ano, ultima_km")
      .eq("client_id", c.id).eq("is_active", true);
    setVeiculos(data || []);
    if (data?.length === 1) { setVeiculo(data[0]); if (data[0].ultima_km) setKmEntrada(String(data[0].ultima_km)); }
    toast.success(`${c.full_name} selecionado`);
  };

  const salvarNovoCliente = async () => {
    if (!novoCliente.full_name || !novoCliente.phone) {
      toast.error("Nome e telefone são obrigatórios"); return;
    }
    setSavingCliente(true);
    try {
      const { data, error } = await supabase.from("04_CLIENTS")
        .insert({ ...novoCliente, birthday: novoCliente.birthday || null, zip_code: novoCliente.zip_code || null })
        .select("id, full_name, phone, email, cpf").single();
      if (error) throw error;
      toast.success("Cliente cadastrado!");
      await selecionarCliente(data);
      setShowNovoCliente(false);
    } catch (e: any) { toast.error(e.message); }
    finally { setSavingCliente(false); }
  };

  const addItem = () => {
    if (!novoItem.descricao || !novoItem.valor_unitario) { toast.error("Preencha descrição e valor"); return; }
    const qtd = parseFloat(novoItem.quantidade) || 1;
    const unit = parseFloat(novoItem.valor_unitario) || 0;
    setItens(prev => [...prev, { _key: `${Date.now()}`, tipo: novoItem.tipo, descricao: novoItem.descricao, quantidade: qtd, valor_unitario: unit, valor_total: qtd * unit }]);
    setNovoItem({ tipo: "servico", descricao: "", quantidade: "1", valor_unitario: "" });
  };

  const canNext = () => {
    if (step === 0) return !!cliente;
    if (step === 1) return modoVeiculoManual ? !!(veiculoManual.placa && veiculoManual.modelo) : !!veiculo;
    if (step === 2) return true;
    return false;
  };

  const handleSubmit = async () => {
    const nomeCliente = cliente?.full_name;
    const placa = modoVeiculoManual ? veiculoManual.placa : veiculo?.placa;
    const modelo = modoVeiculoManual ? veiculoManual.modelo : veiculo?.modelo;
    if (!nomeCliente) { toast.error("Selecione um cliente"); return; }
    if (!placa || !modelo) { toast.error("Informe placa e modelo"); return; }
    setSaving(true);
    try {
      const totalServicos = itens.filter(i => i.tipo === "servico").reduce((s, i) => s + i.valor_total, 0);
      const totalPecas = itens.filter(i => i.tipo !== "servico").reduce((s, i) => s + i.valor_total, 0);
      const { data: os, error } = await supabase.from("06_OS").insert({
        client_id: cliente?.id ?? null,
        vehicle_id: modoVeiculoManual ? null : veiculo?.id ?? null,
        client_nome: nomeCliente, client_phone: cliente?.phone ?? null,
        veiculo_placa: placa, veiculo_modelo: modelo,
        veiculo_marca: modoVeiculoManual ? veiculoManual.marca : veiculo?.marca ?? null,
        veiculo_ano: modoVeiculoManual ? (parseInt(veiculoManual.ano) || null) : veiculo?.ano ?? null,
        km_entrada: kmEntrada ? parseInt(kmEntrada) : null,
        nivel_combustivel: nivelCombustivel || null,
        descricao_problema: descricao || null,
        observacoes: observacoes || null,
        prioridade, data_previsao_entrega: dataPrevisao || null,
        valor_orcado: totalServicos + totalPecas,
        valor_mao_obra: totalServicos, valor_pecas: totalPecas,
        status: "diagnostico",
      }).select("id, numero_os").single();
      if (error) throw error;
      if (itens.length > 0) {
        await supabase.from("07_OS_ITENS").insert(
          itens.map(i => ({ os_id: os.id, tipo: i.tipo, descricao: i.descricao, quantidade: i.quantidade, valor_unitario: i.valor_unitario, valor_total: i.valor_total, status: "pendente" }))
        );
      }
      toast.success(`OS ${os.numero_os} criada! 🎉`);
      setTimeout(() => navigate("/ordens-servico"), 1200);
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const totalOrcado = itens.reduce((s, i) => s + i.valor_total, 0);

  // ---- RENDER ----
  return (
    <ConsultorLayout>
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-zinc-800">
          <button onClick={() => navigate("/ordens-servico")} className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Nova Ordem de Serviço</h1>
            <p className="text-xs text-zinc-500">Preencha todos os dados para abrir a OS</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 py-6 px-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${done ? "bg-green-600" : active ? "bg-blue-600" : "bg-zinc-800"}`}>
                    {done ? <CheckCircle2 className="size-5 text-white" /> : <Icon className={`size-5 ${active ? "text-white" : "text-zinc-500"}`} />}
                  </div>
                  <span className={`text-xs font-medium ${active ? "text-white" : done ? "text-green-400" : "text-zinc-500"}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 md:w-24 h-px mx-2 mb-5 ${i < step ? "bg-green-600" : "bg-zinc-700"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center px-4 pb-10">
          <div className="w-full max-w-xl">

            {/* STEP 0 — Cliente */}
            {step === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="size-4 text-blue-400" />
                  <h2 className="text-white font-semibold">Identificar Cliente</h2>
                </div>

                {!cliente && !showNovoCliente && (
                  <>
                    <div className="relative" ref={dropRef}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                        <Input value={query} onChange={e => { setQuery(e.target.value); setCliente(null); }}
                          placeholder="Buscar por nome, CPF ou telefone..."
                          className="bg-zinc-800 border-zinc-700 text-white pl-9" />
                        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 animate-spin" />}
                      </div>
                      {searched && results.length > 0 && (
                        <div className="mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-xl">
                          {results.map(c => (
                            <button key={c.id} onClick={() => selecionarCliente(c)}
                              className="w-full text-left px-4 py-3 hover:bg-zinc-700 border-b border-zinc-700/50 last:border-0 transition-colors">
                              <p className="text-white text-sm font-medium">{c.full_name}</p>
                              <p className="text-zinc-400 text-xs">{[c.phone, c.email, c.cpf].filter(Boolean).join(" · ")}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setShowNovoCliente(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-500 transition-all text-sm">
                      <UserPlus className="size-4" /> Cadastrar Novo Cliente
                    </button>
                  </>
                )}

                {/* Cliente selecionado */}
                {cliente && !showNovoCliente && (
                  <div className="flex items-center justify-between p-4 bg-blue-950/40 border border-blue-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="size-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{cliente.full_name}</p>
                        <p className="text-blue-300 text-xs">{[cliente.phone, cliente.email].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                    <button onClick={() => { setCliente(null); setQuery(""); setVeiculos([]); setVeiculo(null); }}
                      className="text-zinc-500 hover:text-white"><X className="size-4" /></button>
                  </div>
                )}

                {/* Form novo cliente */}
                {showNovoCliente && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-yellow-400 flex items-center gap-1"><AlertCircle className="size-3" /> Campos marcados com * são obrigatórios. E-mail é opcional mas contabilizado nas métricas do CRM</p>
                      <button onClick={() => setShowNovoCliente(false)} className="text-zinc-500 hover:text-white"><X className="size-4" /></button>
                    </div>
                    <div>
                      <Label className="text-zinc-300 text-sm">Nome Completo *</Label>
                      <Input value={novoCliente.full_name} onChange={e => setNovoCliente(p => ({...p, full_name: e.target.value}))} placeholder="Nome completo" className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-zinc-300 text-sm">Telefone / WhatsApp *</Label><Input value={novoCliente.phone} onChange={e => setNovoCliente(p => ({...p, phone: e.target.value}))} placeholder="(11) 99999-9999" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                      <div><Label className="text-zinc-300 text-sm">CPF *</Label><Input value={novoCliente.cpf} onChange={e => setNovoCliente(p => ({...p, cpf: e.target.value}))} placeholder="000.000.000-00" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-zinc-300 text-sm">E-mail</Label><Input value={novoCliente.email} onChange={e => setNovoCliente(p => ({...p, email: e.target.value}))} placeholder="email@exemplo.com" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                      <div><Label className="text-zinc-300 text-sm">Data de Nascimento</Label><Input type="date" value={novoCliente.birthday} onChange={e => setNovoCliente(p => ({...p, birthday: e.target.value}))} className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                    </div>
                    <div><Label className="text-zinc-300 text-sm">Endereço</Label><Input value={novoCliente.address} onChange={e => setNovoCliente(p => ({...p, address: e.target.value}))} placeholder="Rua, número, bairro" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-zinc-300 text-sm">CEP</Label><Input value={novoCliente.zip_code} onChange={e => setNovoCliente(p => ({...p, zip_code: e.target.value}))} placeholder="00000-000" className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                      <div><Label className="text-zinc-300 text-sm">Cidade</Label><Input defaultValue="São Paulo" className="bg-zinc-800 border-zinc-700 text-white mt-1" disabled /></div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button onClick={salvarNovoCliente} disabled={savingCliente} className="bg-blue-600 hover:bg-blue-700 flex-1">
                        {savingCliente ? <Loader2 className="size-4 mr-2 animate-spin" /> : null} Salvar Cliente
                      </Button>
                      <Button variant="ghost" onClick={() => setShowNovoCliente(false)} className="text-zinc-400 hover:text-white">Cancelar</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 1 — Veículo */}
            {step === 1 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                {/* Header do card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="size-4 text-blue-400" />
                    <h2 className="text-white font-semibold">Selecionar Veículo</h2>
                  </div>
                  <span className="text-xs bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-zinc-300">
                    {cliente?.full_name}
                  </span>
                </div>

                {/* Veículos cadastrados do cliente */}
                {!modoVeiculoManual && veiculos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Veículos cadastrados</p>
                    {veiculos.map(v => (
                      <button key={v.id} onClick={() => { setVeiculo(v); setModoVeiculoManual(false); if (v.ultima_km) setKmEntrada(String(v.ultima_km)); }}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${veiculo?.id === v.id ? "border-blue-500 bg-blue-950/30" : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{v.marca} {v.modelo} {v.versao}</p>
                            <p className="text-zinc-400 text-xs font-mono">{v.placa}{v.ano ? ` · ${v.ano}` : ""}</p>
                          </div>
                          {veiculo?.id === v.id && <CheckCircle2 className="size-5 text-blue-400" />}
                        </div>
                      </button>
                    ))}
                    <button onClick={() => { setModoVeiculoManual(true); setVeiculo(null); }}
                      className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 py-2 border border-dashed border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors">
                      + Informar outro veículo
                    </button>
                  </div>
                )}

                {/* Sem veículos → direto no form */}
                {veiculos.length === 0 && !modoVeiculoManual && (
                  <div className="text-center py-2">
                    <Button onClick={() => setModoVeiculoManual(true)} variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white text-sm">
                      Cadastrar veículo
                    </Button>
                  </div>
                )}

                {/* Formulário de veículo */}
                {(modoVeiculoManual || veiculos.length === 0) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 py-1">
                      <AlertCircle className="size-3.5 text-yellow-500" />
                      <p className="text-xs text-yellow-400">Campos marcados com * são obrigatórios</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-zinc-300 text-sm">Placa *</Label>
                        <Input value={veiculoManual.placa} onChange={e => setVeiculoManual(p => ({...p, placa: e.target.value.toUpperCase()}))}
                          placeholder="ABC1D23" className="bg-zinc-800 border-zinc-700 text-white mt-1 font-mono tracking-widest text-base" />
                      </div>
                      <div>
                        <Label className="text-zinc-300 text-sm">Cor</Label>
                        <Input value={(veiculoManual as any).cor || ""} onChange={e => setVeiculoManual(p => ({...p, cor: e.target.value}))}
                          placeholder="Preto, Branco, Prata..." className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-zinc-300 text-sm">Marca *</Label>
                        <Input value={veiculoManual.marca} onChange={e => setVeiculoManual(p => ({...p, marca: e.target.value}))}
                          placeholder="VW, BMW, Audi..." className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                      </div>
                      <div>
                        <Label className="text-zinc-300 text-sm">Modelo *</Label>
                        <Input value={veiculoManual.modelo} onChange={e => setVeiculoManual(p => ({...p, modelo: e.target.value}))}
                          placeholder="Golf, Série 3..." className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-zinc-300 text-sm">Versão</Label>
                        <Input value={(veiculoManual as any).versao || ""} onChange={e => setVeiculoManual(p => ({...p, versao: e.target.value}))}
                          placeholder="GTI, 320i..." className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                      </div>
                      <div>
                        <Label className="text-zinc-300 text-sm">Ano</Label>
                        <Input value={veiculoManual.ano} onChange={e => setVeiculoManual(p => ({...p, ano: e.target.value}))}
                          placeholder="2026" className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-zinc-300 text-sm">Combustível</Label>
                      <select value={nivelCombustivel} onChange={e => setNivelCombustivel(e.target.value)}
                        className="mt-1 w-full bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">
                        <option value="">Selecione</option>
                        {["Gasolina","Etanol","Flex","Diesel","Elétrico","Híbrido"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    {veiculos.length > 0 && (
                      <button onClick={() => { setModoVeiculoManual(false); }} className="text-xs text-blue-400 hover:underline">
                        ← Voltar para veículos cadastrados
                      </button>
                    )}
                  </div>
                )}

                {/* KM entrada — sempre visível quando tem veículo escolhido */}
                {(veiculo || (modoVeiculoManual && veiculoManual.placa)) && (
                  <div className="pt-3 border-t border-zinc-800">
                    <Label className="text-zinc-300 text-sm">KM de Entrada</Label>
                    <Input type="number" value={kmEntrada} onChange={e => setKmEntrada(e.target.value)}
                      placeholder="Ex: 45000" className="bg-zinc-800 border-zinc-700 text-white mt-1 w-48" />
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 — Serviço */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2"><Wrench className="size-4 text-yellow-400" /><h2 className="text-white font-semibold">Detalhes do Serviço</h2></div>
                  <div><Label className="text-zinc-300 text-sm">Descrição do Problema</Label><Textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="O que o cliente relatou..." rows={3} className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-zinc-300 text-sm">Prioridade</Label>
                      <select value={prioridade} onChange={e => setPrioridade(e.target.value)} className="mt-1 w-full bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm">
                        {["baixa","media","alta","urgente"].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                      </select>
                    </div>
                    <div><Label className="text-zinc-300 text-sm">Previsão de Entrega</Label><Input type="datetime-local" value={dataPrevisao} onChange={e => setDataPrevisao(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" /></div>
                  </div>
                  <div><Label className="text-zinc-300 text-sm">Observações internas</Label><Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Obs para a equipe..." rows={2} className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none" /></div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2"><Package className="size-4 text-blue-400" /><h2 className="text-white font-semibold">Itens / Orçamento</h2><span className="text-zinc-500 text-xs">(opcional)</span></div>
                  <div className="flex gap-2">
                    <select value={novoItem.tipo} onChange={e => setNovoItem(p => ({...p,tipo:e.target.value as Item["tipo"]}))} className="bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-xs w-24">
                      {["servico","peca","fluido","outros"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <Input placeholder="Descrição" value={novoItem.descricao} onChange={e => setNovoItem(p => ({...p,descricao:e.target.value}))} className="flex-1 bg-zinc-800 border-zinc-700 text-white text-sm" />
                    <Input type="number" placeholder="Qtd" value={novoItem.quantidade} onChange={e => setNovoItem(p => ({...p,quantidade:e.target.value}))} className="w-16 bg-zinc-800 border-zinc-700 text-white text-sm" />
                    <Input type="number" placeholder="R$" value={novoItem.valor_unitario} onChange={e => setNovoItem(p => ({...p,valor_unitario:e.target.value}))} className="w-20 bg-zinc-800 border-zinc-700 text-white text-sm" />
                    <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700 px-3"><Plus className="size-4" /></Button>
                  </div>
                  {itens.length > 0 ? (
                    <div className="space-y-1">
                      {itens.map(i => (
                        <div key={i._key} className="flex items-center justify-between py-2 px-3 bg-zinc-800 rounded-lg text-sm">
                          <div className="flex items-center gap-2"><Badge className="text-xs bg-zinc-700 text-zinc-300">{i.tipo}</Badge><span className="text-white">{i.descricao}</span></div>
                          <div className="flex items-center gap-3"><span className="text-green-400 font-medium">{fmt(i.valor_total)}</span><button onClick={() => setItens(p => p.filter(x => x._key !== i._key))}><Trash2 className="size-3.5 text-zinc-500 hover:text-red-400" /></button></div>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-zinc-700 text-sm font-semibold">
                        <span className="text-zinc-400">Total orçado</span><span className="text-green-400">{fmt(totalOrcado)}</span>
                      </div>
                    </div>
                  ) : <p className="text-center text-zinc-600 text-sm py-4">Nenhum item adicionado</p>}
                </div>
              </div>
            )}

            {/* STEP 3 — Confirmação */}
            {step === 3 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2"><ClipboardList className="size-4 text-green-400" /><h2 className="text-white font-semibold">Confirmar OS</h2></div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-400">Cliente</span><span className="text-white font-medium">{cliente?.full_name}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-400">Telefone</span><span className="text-white">{cliente?.phone || "—"}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-400">Veículo</span><span className="text-white">{modoVeiculoManual ? `${veiculoManual.marca} ${veiculoManual.modelo} · ${veiculoManual.placa}` : `${veiculo?.marca} ${veiculo?.modelo} · ${veiculo?.placa}`}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-400">KM entrada</span><span className="text-white">{kmEntrada || "—"}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-400">Prioridade</span><Badge className="bg-zinc-700 text-zinc-300 text-xs">{prioridade}</Badge></div>
                  <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-400">Itens</span><span className="text-white">{itens.length} item(ns)</span></div>
                  <div className="flex justify-between py-3 text-base font-bold"><span className="text-white">Total orçado</span><span className="text-green-400">{fmt(totalOrcado)}</span></div>
                </div>
                <p className="text-xs text-zinc-500 text-center">Status inicial: <span className="text-purple-400">diagnóstico</span></p>
                <Button onClick={handleSubmit} disabled={saving} className="w-full bg-green-600 hover:bg-green-700 h-11 text-base font-semibold">
                  {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
                  {saving ? "Criando OS..." : "Criar Ordem de Serviço"}
                </Button>
              </div>
            )}

            {/* Nav botões */}
            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => step > 0 ? setStep((step - 1) as Step) : navigate("/ordens-servico")} className="text-zinc-400 hover:text-white">
                <ArrowLeft className="size-4 mr-2" /> {step === 0 ? "Cancelar" : "Voltar"}
              </Button>
              {step < 3 && (
                <Button onClick={() => setStep((step + 1) as Step)} disabled={!canNext()} className="bg-blue-600 hover:bg-blue-700 gap-2">
                  Próximo: {STEPS[step + 1].label} <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConsultorLayout>
  );
}

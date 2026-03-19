import { useState, useEffect } from "react";
import { Car, Search, Link, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import AdminLayout from "../../components/AdminLayout";
import { supabase } from "../../../lib/supabase";

interface Veiculo { id: string; placa?: string; chassis?: string; marca?: string; modelo?: string; ano?: number; }
interface Cliente { id: string; nome?: string; name?: string; }

const PER_PAGE = 25;

export default function GestaoVeiculosOrfaos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedVeiculo, setSelectedVeiculo] = useState<string | null>(null);

  useEffect(() => { fetchVeiculos(); }, [page, busca]);

  async function fetchVeiculos() {
    setLoading(true);
    let q = supabase.from("veiculos_orfaos").select("*", { count: "exact" }).range(page * PER_PAGE, (page + 1) * PER_PAGE - 1);
    if (busca) q = q.or(`placa.ilike.%${busca}%,marca.ilike.%${busca}%,modelo.ilike.%${busca}%`);
    const { data, count } = await q;
    setVeiculos(data || []);
    setTotal(count || 0);
    setLoading(false);
  }

  async function buscarClientes(term: string) {
    if (!term) { setClientes([]); return; }
    const { data } = await supabase.from("clientes").select("id, nome, name").or(`nome.ilike.%${term}%,name.ilike.%${term}%`).limit(10);
    setClientes(data || []);
  }

  async function vincular(veiculoId: string, clienteId: string) {
    const v = veiculos.find(x => x.id === veiculoId);
    if (!v) return;
    await supabase.from("veiculos").insert({ ...v, cliente_id: clienteId });
    await supabase.from("veiculos_orfaos").delete().eq("id", veiculoId);
    setVeiculos(p => p.filter(x => x.id !== veiculoId));
    setSelectedVeiculo(null);
    setClientes([]);
  }

  async function remover(id: string) {
    if (!confirm("Remover este veículo?")) return;
    await supabase.from("veiculos_orfaos").delete().eq("id", id);
    setVeiculos(p => p.filter(x => x.id !== id));
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2"><Car className="h-8 w-8 text-red-400" /> Veículos Órfãos</h1>
          <p className="text-zinc-400 mt-1">Vincular veículos a clientes — {total} encontrados</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-red-500"
            placeholder="Buscar por placa, marca ou modelo..." value={busca}
            onChange={e => { setBusca(e.target.value); setPage(0); }} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 text-red-400 animate-spin" /></div>
        ) : (
          <div className="space-y-3">
            {veiculos.map(v => (
              <div key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{v.marca} {v.modelo} {v.ano || ""}</p>
                    <div className="flex gap-3 text-sm text-zinc-400 mt-0.5">
                      {v.placa && <span>Placa: <span className="text-zinc-300 font-mono">{v.placa}</span></span>}
                      {v.chassis && <span>Chassi: <span className="text-zinc-300 font-mono">{v.chassis}</span></span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8"
                      onClick={() => setSelectedVeiculo(selectedVeiculo === v.id ? null : v.id)}>
                      <Link className="h-3 w-3 mr-1" /> Vincular
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-950 h-8 w-8 p-0" onClick={() => remover(v.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedVeiculo === v.id && (
                  <div className="mt-3 border-t border-zinc-800 pt-3">
                    <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Buscar cliente pelo nome..." value={buscaCliente}
                      onChange={e => { setBuscaCliente(e.target.value); buscarClientes(e.target.value); }} />
                    {clientes.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {clientes.map(c => (
                          <button key={c.id} onClick={() => vincular(v.id, c.id)}
                            className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm">
                            {c.nome || c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {total > PER_PAGE && (
          <div className="flex justify-center gap-3">
            <Button variant="ghost" className="text-zinc-400" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
            <span className="text-zinc-500 text-sm self-center">Pág {page + 1} / {Math.ceil(total / PER_PAGE)}</span>
            <Button variant="ghost" className="text-zinc-400" disabled={(page + 1) * PER_PAGE >= total} onClick={() => setPage(p => p + 1)}>Próxima</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

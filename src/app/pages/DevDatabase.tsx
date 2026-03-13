import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Database,
  RefreshCw,
  Trash2,
  Edit2,
  Plus,
  Eye,
  Search,
  Activity,
  HardDrive,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { kvStore } from "../../lib/supabase";
import DevLayout from "../components/DevLayout";

interface KVRecord {
  key: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

export default function DevDatabase() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<KVRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<KVRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<KVRecord | null>(null);
  const [formData, setFormData] = useState({ key: "", value: "" });
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalSize: 0,
    lastUpdate: "",
  });

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    const filtered = records.filter(
      (record) =>
        record.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(record.value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await kvStore.getAll();
      setRecords(data || []);
      
      // Calcular estatísticas
      const totalSize = JSON.stringify(data).length;
      const lastUpdate = data && data.length > 0 
        ? data.reduce((latest, record) => {
            const recordDate = new Date(record.updated_at || record.created_at || 0);
            return recordDate > latest ? recordDate : latest;
          }, new Date(0))
        : new Date();

      setStats({
        totalRecords: data?.length || 0,
        totalSize: totalSize,
        lastUpdate: lastUpdate.toISOString(),
      });

      toast.success("Dados carregados com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRecord = async () => {
    try {
      const value = JSON.parse(formData.value);
      await kvStore.set(formData.key, value);
      toast.success("Registro criado com sucesso!");
      setIsCreateDialogOpen(false);
      setFormData({ key: "", value: "" });
      loadRecords();
    } catch (error: any) {
      toast.error("Erro ao criar registro: " + error.message);
    }
  };

  const handleUpdateRecord = async () => {
    if (!selectedRecord) return;
    try {
      const value = JSON.parse(formData.value);
      await kvStore.set(formData.key, value);
      toast.success("Registro atualizado com sucesso!");
      setIsEditDialogOpen(false);
      setSelectedRecord(null);
      setFormData({ key: "", value: "" });
      loadRecords();
    } catch (error: any) {
      toast.error("Erro ao atualizar registro: " + error.message);
    }
  };

  const handleDeleteRecord = async (key: string) => {
    if (!confirm(`Tem certeza que deseja excluir a chave "${key}"?`)) return;
    try {
      await kvStore.delete(key);
      toast.success("Registro excluído com sucesso!");
      loadRecords();
    } catch (error: any) {
      toast.error("Erro ao excluir registro: " + error.message);
    }
  };

  const openViewDialog = (record: KVRecord) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (record: KVRecord) => {
    setSelectedRecord(record);
    setFormData({
      key: record.key,
      value: JSON.stringify(record.value, null, 2),
    });
    setIsEditDialogOpen(true);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getValuePreview = (value: any) => {
    const str = JSON.stringify(value);
    return str.length > 50 ? str.substring(0, 50) + "..." : str;
  };

  return (
    <DevLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Banco de Dados</h1>
            <p className="text-zinc-400 mt-1">
              Tabela: kv_store_0092e077 (Key-Value Store)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadRecords}
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Registro
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-950 rounded-lg">
                <Database className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total de Registros</p>
                <p className="text-2xl font-bold text-white">{stats.totalRecords}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-950 rounded-lg">
                <HardDrive className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Tamanho Total</p>
                <p className="text-2xl font-bold text-white">
                  {formatBytes(stats.totalSize)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-950 rounded-lg">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Status</p>
                <p className="text-2xl font-bold text-green-500">Online</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-950 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Última Atualização</p>
                <p className="text-sm font-bold text-white">
                  {stats.lastUpdate
                    ? new Date(stats.lastUpdate).toLocaleString("pt-BR")
                    : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6 bg-zinc-900 border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Buscar por chave ou valor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800">
                <tr className="text-left">
                  <th className="p-4 font-medium text-zinc-300">Chave</th>
                  <th className="p-4 font-medium text-zinc-300">Valor (Preview)</th>
                  <th className="p-4 font-medium text-zinc-300">Tipo</th>
                  <th className="p-4 font-medium text-zinc-300">Atualizado</th>
                  <th className="p-4 font-medium text-zinc-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      Carregando dados...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.key}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50"
                    >
                      <td className="p-4">
                        <code className="text-sm text-blue-400 font-mono">
                          {record.key}
                        </code>
                      </td>
                      <td className="p-4">
                        <code className="text-sm text-zinc-300 font-mono">
                          {getValuePreview(record.value)}
                        </code>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="border-zinc-700">
                          {typeof record.value === "object"
                            ? Array.isArray(record.value)
                              ? "Array"
                              : "Object"
                            : typeof record.value}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-zinc-400">
                        {record.updated_at
                          ? new Date(record.updated_at).toLocaleString("pt-BR")
                          : "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(record)}
                            className="hover:bg-zinc-800"
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(record)}
                            className="hover:bg-zinc-800"
                          >
                            <Edit2 className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.key)}
                            className="hover:bg-zinc-800"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Visualizar Registro</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Chave: <code className="text-blue-400">{selectedRecord?.key}</code>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 max-h-96 overflow-auto">
            <pre className="text-sm text-zinc-300 font-mono">
              {selectedRecord && JSON.stringify(selectedRecord.value, null, 2)}
            </pre>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-zinc-800 hover:bg-zinc-700"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Criar Novo Registro</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Adicione uma nova chave-valor ao banco de dados
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-key" className="text-zinc-300">
                Chave
              </Label>
              <Input
                id="create-key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="ex: usuarios:123"
                className="bg-zinc-800 border-zinc-700 text-white font-mono"
              />
            </div>
            <div>
              <Label htmlFor="create-value" className="text-zinc-300">
                Valor (JSON)
              </Label>
              <Textarea
                id="create-value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder='{"nome": "João", "idade": 30}'
                rows={10}
                className="bg-zinc-800 border-zinc-700 text-white font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setFormData({ key: "", value: "" });
              }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateRecord} className="bg-red-600 hover:bg-red-700">
              Criar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Atualize o valor do registro
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-key" className="text-zinc-300">
                Chave (somente leitura)
              </Label>
              <Input
                id="edit-key"
                value={formData.key}
                disabled
                className="bg-zinc-950 border-zinc-700 text-zinc-500 font-mono"
              />
            </div>
            <div>
              <Label htmlFor="edit-value" className="text-zinc-300">
                Valor (JSON)
              </Label>
              <Textarea
                id="edit-value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                rows={10}
                className="bg-zinc-800 border-zinc-700 text-white font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedRecord(null);
                setFormData({ key: "", value: "" });
              }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateRecord} className="bg-red-600 hover:bg-red-700">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DevLayout>
  );
}
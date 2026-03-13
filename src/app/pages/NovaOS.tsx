import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function NovaOS() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Nova OS - Doctor Auto";
  }, []);

  const [formData, setFormData] = useState({
    placa: "",
    cliente: "",
    telefone: "",
    veiculo: "",
    ano: "",
    km: "",
    mecanico: "",
    descricao: "",
    prioridade: "media",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.placa || !formData.cliente || !formData.veiculo || !formData.mecanico) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    // Simula criação da OS
    const numeroOS = `OS-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    toast.success(`${numeroOS} criada com sucesso!`);
    setTimeout(() => {
      navigate("/ordens");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Ordem de Serviço</h1>
          <p className="text-muted-foreground">Cadastre uma nova OS no sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Informações do Veículo */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Veículo</CardTitle>
              <CardDescription>Dados do veículo que será atendido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    placeholder="ABC-1234"
                    value={formData.placa}
                    onChange={(e) => handleInputChange("placa", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veiculo">Modelo *</Label>
                  <Input
                    id="veiculo"
                    placeholder="Honda Civic 2020"
                    value={formData.veiculo}
                    onChange={(e) => handleInputChange("veiculo", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ano">Ano</Label>
                  <Input
                    id="ano"
                    placeholder="2020"
                    value={formData.ano}
                    onChange={(e) => handleInputChange("ano", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">Quilometragem Atual</Label>
                  <Input
                    id="km"
                    placeholder="45000"
                    type="number"
                    value={formData.km}
                    onChange={(e) => handleInputChange("km", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>Dados de contato do proprietário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Nome Completo *</Label>
                  <Input
                    id="cliente"
                    placeholder="João Silva"
                    value={formData.cliente}
                    onChange={(e) => handleInputChange("cliente", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 98765-4321"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Serviço</CardTitle>
              <CardDescription>Informações sobre o trabalho a ser realizado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mecanico">Mecânico Responsável *</Label>
                  <Select value={formData.mecanico} onValueChange={(value) => handleInputChange("mecanico", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mecânico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thales">Thales Oliveira (Especialista)</SelectItem>
                      <SelectItem value="marcos">Marcos Silva (Senior)</SelectItem>
                      <SelectItem value="rodrigo">Rodrigo Santos (Senior)</SelectItem>
                      <SelectItem value="mauricio">Mauricio Costa (Pleno)</SelectItem>
                      <SelectItem value="elias">Elias Ferreira (Pleno)</SelectItem>
                      <SelectItem value="vitor">Vitor Lima (Junior)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select value={formData.prioridade} onValueChange={(value) => handleInputChange("prioridade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Serviço</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o problema ou serviço a ser realizado..."
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="size-4 mr-2" />
              Criar Ordem de Serviço
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
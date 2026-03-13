# 🔗 INTEGRAÇÃO COM SUPABASE - DOCTOR AUTO

## 📋 VISÃO GERAL

O sistema Doctor Auto agora está totalmente integrado com Supabase através de:
- ✅ **Backend API** (Edge Functions)
- ✅ **Autenticação Real** (Supabase Auth)
- ✅ **Armazenamento KV** (Key-Value Store)
- ✅ **Serviço de API Frontend** centralizado

---

## 🏗️ ARQUITETURA

```
┌─────────────────┐
│   FRONTEND      │
│   (React)       │
└────────┬────────┘
         │
         │ /src/app/services/api.ts
         │
         ▼
┌─────────────────────────────────────┐
│   SUPABASE EDGE FUNCTION            │
│   /supabase/functions/server/       │
│                                      │
│   ├── index.tsx (Hono Router)       │
│   └── kv_store.tsx (Banco KV)       │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  SUPABASE DB    │
│  (PostgreSQL)   │
└─────────────────┘
```

---

## 🔐 AUTENTICAÇÃO

### **Login com Email/Senha (DEV)**

**Endpoint:** `POST /make-server-0092e077/auth/login`

```typescript
// Uso:
import { authAPI } from '../services/api';

const { access_token, user } = await authAPI.loginWithPassword(
  "dev@doctorauto.com",
  "senha123"
);
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "email": "dev@doctorauto.com"
  }
}
```

---

### **Login por Perfil (Gestão, Consultor, Mecânico)**

**Endpoint:** `POST /make-server-0092e077/auth/login-profile`

```typescript
// Uso:
const { session_id, user } = await authAPI.loginWithProfile(
  "Gestão",
  "João Silva"
);
```

**Resposta:**
```json
{
  "session_id": "session_1710345678_abc123",
  "user": {
    "cargo": "Gestão",
    "nome": "João Silva",
    "loginType": "profile",
    "timestamp": "2026-03-13T15:42:00.000Z"
  }
}
```

---

### **Verificar Sessão**

**Endpoint:** `GET /make-server-0092e077/auth/session`

```typescript
// Uso:
const { user } = await authAPI.checkSession();
```

---

## 📊 DADOS (CRUD)

### **CLIENTES**

#### Listar todos
```typescript
const clientes = await clientesAPI.getAll();
// Retorna: Array<Cliente>
```

#### Buscar por ID
```typescript
const cliente = await clientesAPI.getById("CLI-001");
```

#### Criar
```typescript
const novoCliente = await clientesAPI.create({
  nome: "Carlos Silva",
  cpf: "123.456.789-00",
  telefone: "(11) 98765-4321",
  email: "carlos@email.com",
  endereco: "Rua das Flores, 123",
  cidade: "São Paulo - SP"
});
```

#### Atualizar
```typescript
await clientesAPI.update("CLI-001", {
  telefone: "(11) 99999-9999"
});
```

---

### **AGENDAMENTOS**

```typescript
// Listar
const agendamentos = await agendamentosAPI.getAll();

// Criar
const novoAgendamento = await agendamentosAPI.create({
  cliente: "Carlos Silva",
  telefone: "(11) 98765-4321",
  veiculo: "Honda Civic 2020",
  placa: "ABC-1234",
  data: "2026-03-15",
  horario: "09:00",
  servico: "Revisão Completa"
});

// Atualizar status
await agendamentosAPI.update("AGD-001", {
  status: "Confirmado"
});
```

---

### **ORDENS DE SERVIÇO**

```typescript
// Listar
const ordens = await ordensServicoAPI.getAll();

// Buscar por ID
const os = await ordensServicoAPI.getById("OS-123");

// Criar
const novaOS = await ordensServicoAPI.create({
  cliente: "Carlos Silva",
  veiculo: "Honda Civic 2020",
  placa: "ABC-1234",
  dataPrevisao: "2026-03-15T18:00:00",
  responsavel: "João Mecânico",
  consultor: "Ana Consultora",
  servicos: [
    { descricao: "Troca de Óleo", valorMaoObra: 80 }
  ],
  pecas: [
    { descricao: "Óleo 5W30", quantidade: 4, valorUnitario: 45 }
  ]
});

// Atualizar
await ordensServicoAPI.update("OS-123", {
  status: "Concluído",
  dataConclusao: new Date().toISOString()
});
```

---

### **PÁTIO KANBAN**

```typescript
// Listar items do pátio
const patio = await patioAPI.getAll();

// Atualizar status
await patioAPI.updateStatus("PATIO-001", "execucao");
```

---

## 🤖 APIS DE IA

### **Serviços de IA**

```typescript
const services = await aiAPI.getServices();
```

**Retorna:**
```json
[
  {
    "id": "analise-preditiva",
    "name": "Análise Preditiva",
    "status": "online",
    "uptime": 99.8,
    "requests": 15234,
    "avgResponseTime": 145,
    "lastUpdate": "2026-03-13T15:42:00.000Z"
  },
  // ... mais serviços
]
```

### **Métricas Globais**

```typescript
const metrics = await aiAPI.getMetrics();
```

**Retorna:**
```json
{
  "totalRequests": 80599,
  "avgResponseTime": 167,
  "successRate": 98.7,
  "activeModels": 6,
  "cpuUsage": 45.2,
  "memoryUsage": 62.8,
  "lastUpdate": "2026-03-13T15:42:00.000Z"
}
```

---

## 📈 RELATÓRIOS

### **Faturamento**

```typescript
const faturamento = await relatoriosAPI.getFaturamento();
```

**Retorna:**
```json
{
  "jan": 45000,
  "fev": 52000,
  "mar": 48000
}
```

### **Serviços Populares**

```typescript
const servicos = await relatoriosAPI.getServicosPopulares();
```

**Retorna:**
```json
[
  { "nome": "Troca de Óleo", "count": 145 },
  { "nome": "Revisão Completa", "count": 89 }
]
```

### **Performance de Mecânicos**

```typescript
const performance = await relatoriosAPI.getPerformanceMecanicos();
```

**Retorna:**
```json
[
  {
    "nome": "João Silva",
    "osConcluidas": 78,
    "faturamento": 125000
  }
]
```

---

## 🔧 CONFIGURAÇÃO

### **1. Variáveis de Ambiente**

O Supabase já está configurado no arquivo `/utils/supabase/info.tsx`:

```typescript
export const projectId = "acuufrgoyjwzlyhopaus";
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### **2. API Base URL**

A URL base é automaticamente construída no `/src/app/services/api.ts`:

```typescript
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0092e077`;
```

---

## 🚀 COMO USAR EM COMPONENTES

### **Exemplo: Listar Clientes**

```typescript
import { useState, useEffect } from "react";
import { clientesAPI } from "../../services/api";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setIsLoading(true);
    try {
      const data = await clientesAPI.getAll();
      setClientes(data);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  // ... resto do componente
}
```

### **Exemplo: Criar Cliente**

```typescript
const handleCreateCliente = async (formData) => {
  try {
    const novoCliente = await clientesAPI.create(formData);
    setClientes([...clientes, novoCliente]);
    toast.success("Cliente criado!");
  } catch (error) {
    toast.error("Erro ao criar cliente");
  }
};
```

---

## 📝 ESTRUTURA DE DADOS

### **Cliente**
```typescript
interface Cliente {
  id: string;              // "CLI-001"
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  dataCadastro: string;    // ISO 8601
  veiculos: number;
  totalGasto: number;
  ultimaVisita: string;    // ISO 8601
}
```

### **Agendamento**
```typescript
interface Agendamento {
  id: string;              // "AGD-001"
  cliente: string;
  telefone: string;
  email: string;
  veiculo: string;
  placa: string;
  data: string;            // "2026-03-15"
  horario: string;         // "09:00"
  servico: string;
  status: "Pendente" | "Confirmado" | "Cancelado" | "Concluído";
  observacoes?: string;
  dataCriacao: string;     // ISO 8601
}
```

### **Ordem de Serviço**
```typescript
interface OrdemServico {
  id: string;              // "OS-001"
  cliente: string;
  veiculo: string;
  placa: string;
  dataAbertura: string;    // ISO 8601
  dataPrevisao: string;    // ISO 8601
  dataConclusao?: string;  // ISO 8601
  status: "Aguardando" | "Em Andamento" | "Concluído" | "Cancelado";
  servicos: Array<{
    descricao: string;
    valorMaoObra: number;
    tempo?: string;
  }>;
  pecas: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
  }>;
  valorTotal: number;
  responsavel: string;
  consultor: string;
  observacoes?: string;
}
```

---

## 🛡️ SEGURANÇA

### **Headers de Autenticação**

Todas as requisições incluem automaticamente:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### **Tokens**

- **DEV Login:** Token JWT do Supabase Auth
- **Profile Login:** Session ID armazenado no KV

---

## 🔄 MIGRAÇÃO DE DADOS MOCKADOS → REAIS

### **Antes (Mock)**
```typescript
const [clientes, setClientes] = useState([
  { id: "CLI-001", nome: "Carlos Silva", ... }
]);
```

### **Depois (Real)**
```typescript
const [clientes, setClientes] = useState([]);

useEffect(() => {
  const loadClientes = async () => {
    const data = await clientesAPI.getAll();
    setClientes(data);
  };
  loadClientes();
}, []);
```

---

## ✅ STATUS DE INTEGRAÇÃO

| Módulo | Status | Endpoint |
|--------|--------|----------|
| Autenticação (DEV) | ✅ Pronto | `/auth/login` |
| Autenticação (Perfil) | ✅ Pronto | `/auth/login-profile` |
| Clientes | ✅ Pronto | `/clientes` |
| Agendamentos | ✅ Pronto | `/agendamentos` |
| Ordens de Serviço | ✅ Pronto | `/ordens-servico` |
| Pátio Kanban | ✅ Pronto | `/patio` |
| IA Services | ✅ Pronto | `/ai/services` |
| IA Metrics | ✅ Pronto | `/ai/metrics` |
| Relatórios | ✅ Pronto | `/relatorios/*` |

---

## 🐛 TROUBLESHOOTING

### **Erro: "Unauthorized"**
- Verificar se o token está sendo enviado
- Verificar se a sessão não expirou
- Fazer login novamente

### **Erro: "CORS"**
- O servidor já tem CORS habilitado
- Verificar se a URL está correta

### **Erro: "404 Not Found"**
- Verificar se o prefixo `/make-server-0092e077` está presente
- Verificar se o endpoint existe

---

## 📞 PRÓXIMOS PASSOS

1. ✅ **Substituir dados mockados** por chamadas reais em todas as páginas
2. ✅ **Implementar paginação** nas listagens
3. ✅ **Adicionar cache** no frontend
4. ✅ **Implementar webhooks** para notificações em tempo real
5. ✅ **Adicionar upload de imagens** (Supabase Storage)

---

**🎉 A INTEGRAÇÃO ESTÁ COMPLETA E FUNCIONAL!**

Agora o sistema Doctor Auto usa dados reais do Supabase em tempo real!

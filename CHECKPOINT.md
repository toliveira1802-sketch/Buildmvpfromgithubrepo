# 🚗 Doctor Auto MVP — CHECKPOINT
> Atualizado em: 18/03/2026

## 📍 Estado Atual

### Banco de Dados (Supabase: `acuufrgoyjwzlyhopaus`)

| Tabela | Status | Registros |
|--------|--------|-----------|
| `00_companies` | ✅ OK | 2 (Bosch + Prime) |
| `01_colaboradores` | ✅ OK | 1 (Thales Dev, id=integer) |
| `02_dev_roles` | ✅ OK | 5 roles |
| `04_CLIENTS` | ⚠️ ZERADA | 0 — precisa importar |
| `clients_mecanico_view` | ✅ OK | view criada |

### 04_CLIENTS — PENDÊNCIA CRÍTICA
A tabela foi zerada manualmente. Há **2 arquivos Excel** para importar:
- `04_CLIENTS_-_Copia.xlsx` → 7.305 clientes
- `04_CLIENTS.xlsx` → 469 clientes
- **Total: 7.774 clientes** a inserir

**Schema da tabela:**
```sql
CREATE TABLE "04_CLIENTS" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  birthday DATE,
  cpf TEXT,
  address TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  self_register BOOLEAN DEFAULT false,
  validated_by INTEGER REFERENCES "01_colaboradores"(id),
  is_recurrent BOOLEAN DEFAULT false,
  lifetime_value NUMERIC(12,2) DEFAULT 0,
  priority_score INTEGER DEFAULT 0,
  internal_notes TEXT,
  tags TEXT[] DEFAULT '{}',
  loyalty_points INTEGER DEFAULT 0,
  loyalty_level TEXT DEFAULT 'bronze' CHECK (loyalty_level IN ('bronze','silver','gold','diamond')),
  referral_source TEXT,
  referral_cashback_applied BOOLEAN DEFAULT false,
  empresa_id UUID REFERENCES "00_companies"(id),
  last_visit_date DATE,
  total_spent NUMERIC(12,2) DEFAULT 0,
  total_visits INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
```

**Como importar (instrução para próximo chat):**
```
"Importar os 7774 clientes dos arquivos 04_CLIENTS_-_Copia.xlsx e 04_CLIENTS.xlsx na tabela 04_CLIENTS do Supabase. Os arquivos já foram enviados anteriormente. Usar apply_migration em batches de 200 rows."
```

---

## 🖥️ Frontend — Páginas Existentes

| Página | Rota | Layout | Status |
|--------|------|--------|--------|
| Landing | `/` | Nenhum | ✅ |
| Login | `/login` | Nenhum | ✅ Grid 2x2 |
| DevTables | `/dev/tables` | DevLayout | ✅ Agente SQL |
| GestaoDashboards | `/gestao` | AdminLayout | ✅ Hub 8 cards |
| GestaoRH | `/gestao/rh` | AdminLayout | ✅ |
| GestaoOperacoes | `/gestao/operacoes` | AdminLayout | ✅ |
| GestaoFinanceiro | `/gestao/financeiro` | AdminLayout | ✅ |
| GestaoComercial | `/gestao/comercial` | AdminLayout | ✅ |
| GestaoTecnologia | `/gestao/tecnologia` | AdminLayout | ✅ |
| GestaoVeiculosOrfaos | `/gestao/veiculos-orfaos` | AdminLayout | ✅ |
| Dashboard (Consultor) | `/dashboard` | ConsultorLayout | ✅ |

**Layouts:** `DevLayout`, `AdminLayout`, `ConsultorLayout`
**Logo:** `public/logo.png` (círculo vermelho com carro)

---

## 🔌 Edge Functions (Supabase)

| Function | Slug | Status |
|----------|------|--------|
| Make Server | `make-server-0092e077` | ✅ Ativa |

**Rotas do SQL Agent:**
- `GET /dev/sql-operations` — listar
- `POST /dev/sql-operations` — criar
- `POST /dev/sql-operations/:id/execute` — executar via `exec_sql` RPC
- `DELETE /dev/sql-operations/:id` — deletar

---

## 🔐 Permissões por Role (04_CLIENTS)

| Role | Permissão |
|------|-----------|
| Dev | CRUD total |
| Gestão | CRUD total |
| Consultor | SELECT + UPDATE |
| Mecânico | Só via `clients_mecanico_view` (id, full_name, phone) |
| Cliente | Só próprios dados (user_id = auth.uid()) |

---

## 📋 Pendências Prioritárias

1. **🔴 URGENTE** — Importar 7.774 clientes na `04_CLIENTS`
2. **🟡 ALTA** — RLS policies na `04_CLIENTS` por role
3. **🟡 ALTA** — Página Notion com regras CRM
4. **🟠 MÉDIA** — DevDashboard (igual ao Figma)
5. **🟠 MÉDIA** — Integrar dados reais nas páginas de Gestão
6. **🟢 BAIXA** — Loyalty trigger ao fechar OS
7. **🟢 BAIXA** — Tela de validação `self_register = true`
8. **🟢 BAIXA** — Limpar duplicados CRM

---

## ⚙️ Configuração do Projeto

| Item | Valor |
|------|-------|
| Repo local | `C:\Users\docto\.claude-worktrees\Buildmvpfromgithubrepo` |
| Supabase ID | `acuufrgoyjwzlyhopaus` |
| Dev server | `http://localhost:5176/` |
| Stack | React + Vite + TypeScript + TailwindCSS + Supabase + Hono |

# Implementação de Segmentação por Oficina - OPÇÃO 1

## 📋 Resumo Executivo

**Objetivo**: Implementar segmentação de dados por empresa + oficina_config
**Arquitetura**: Uma oficina_config por empresa
**Status**: Implementação pronta para integração

---

## 🎯 Como Funciona (OPÇÃO 1)

```
┌─────────────────────────────────────────┐
│ Usuário faz Login                       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Sistema busca empresa_id do usuário:    │
│ - Se colaborador: 01_colaboradores      │
│ - Se mecânico: 12_MECANICOS             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Armazena em localStorage:               │
│ - empresa_id                            │
│ - oficina_id (= empresa_id em OP 1)     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Todas as queries filtram por empresa_id │
│ Usuário vê APENAS dados de sua empresa  │
│ A oficina_config é loaded automaticamente│
└─────────────────────────────────────────┘
```

---

## 🔧 PASSO 1: Integrar setupUserContext no Login

### Local: src/app/pages/Login.tsx (ou seu arquivo de login)

```typescript
import { setupUserContext, clearUserContext } from '@/lib/supabase-extended';

// Após o login bem-sucedido:
const handleLoginSuccess = async (user: any, role: 'colaborador' | 'mecanico') => {
  // 1. Chamar setupUserContext para armazenar empresa_id e oficina_id
  const contextSetup = await setupUserContext(user.id, role);
  
  if (!contextSetup) {
    console.error('Falha ao configurar contexto do usuário');
    // Mostrar erro para o usuário
    return;
  }

  // 2. Redirecionar para dashboard
  navigate('/dashboard');
};

// Logout
const handleLogout = () => {
  clearUserContext();
  navigate('/login');
};
```

---

## 🔧 PASSO 2: Envolver App em OficinaProvider

### Local: src/app/App.tsx

```typescript
import { OficinaProvider } from '@/lib/supabase-extended';

function App() {
  return (
    <OficinaProvider>
      <Routes>
        {/* suas rotas aqui */}
      </Routes>
    </OficinaProvider>
  );
}

export default App;
```

---

## 🔧 PASSO 3: Usar nos Componentes

### Exemplo: AdminLayout.tsx

```typescript
import { useOficinaContext, fetchColaboradoresSegmentado } from '@/lib/supabase-extended';
import { useEffect, useState } from 'react';

export const AdminLayout = () => {
  const { empresa_id, oficina_config, isLoading } = useOficinaContext();
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    const loadColaboradores = async () => {
      const data = await fetchColaboradoresSegmentado();
      setColaboradores(data);
    };

    if (empresa_id) {
      loadColaboradores();
    }
  }, [empresa_id]);

  if (isLoading) {
    return <div>Carregando configurações da oficina...</div>;
  }

  return (
    <div>
      <h1>Oficina: {oficina_config?.nome}</h1>
      <p>Horário de funcionamento: {oficina_config?.horario_entrada} - {oficina_config?.horario_saida_semana}</p>
      
      <h2>Colaboradores ({colaboradores.length})</h2>
      {/* lista de colaboradores aqui */}
    </div>
  );
};
```

---

## 🔧 PASSO 4: Pattern para Todas as Queries

### ❌ ERRADO - Sem segmentação
```typescript
const { data } = await supabase
  .from('01_colaboradores')
  .select('*');  // ⚠️ Retorna TODOS os colaboradores de TODAS as empresas!
```

### ✅ CORRETO - Com segmentação
```typescript
import { empresaPayload } from '@/lib/supabase-extended';

const { empresa_id } = empresaPayload();
const { data } = await supabase
  .from('01_colaboradores')
  .select('*')
  .eq('empresa_id', empresa_id);  // ✅ Apenas colaboradores da empresa atual
```

### ✅ MELHOR - Usar helpers prontos
```typescript
import { fetchColaboradoresSegmentado } from '@/lib/supabase-extended';

const colaboradores = await fetchColaboradoresSegmentado();  // Pronto!
```

---

## 📝 Checklist de Implementação

### Fase 1: Setup Inicial
- [ ] Copiar `supabase-extended.ts` para `src/lib/`
- [ ] Integrar `setupUserContext` no login
- [ ] Integrar `clearUserContext` no logout
- [ ] Envolver App em `<OficinaProvider>`

### Fase 2: Atualizar Queries Existentes
- [ ] AdminLayout - usar `fetchColaboradoresSegmentado()`
- [ ] AdminLayout - usar `fetchMecanicosSegmentado()`
- [ ] PatioKanban - usar `fetchOSSegmentado()`
- [ ] Qualquer outra página que lista dados da empresa

### Fase 3: Testes
- [ ] Login com colaborador da empresa A → vê dados da empresa A
- [ ] Login com colaborador da empresa B → vê dados da empresa B
- [ ] Colaborador A não consegue ver dados da empresa B
- [ ] Mecânico A não consegue ver dados de empresa B
- [ ] Oficina_config carrega corretamente

---

## 🔒 Segurança

**Importante**: O filtro no frontend (`empresa_id`) é apenas UX.
Para segurança real, você deve TAMBÉM adicionar RLS policies no Supabase:

```sql
-- Exemplo para 01_colaboradores
CREATE POLICY "Users can only see colaboradores from their empresa"
ON "01_colaboradores"
FOR SELECT
USING (
  empresa_id = (
    SELECT empresa_id FROM "01_colaboradores" 
    WHERE auth_user_id = auth.uid()
  )
);
```

---

## 📚 Próximas Funcionalidades (Future)

Se em futuro você precisar de **múltiplas oficinas por empresa**:
1. Adicione coluna `oficina_config_id` em `01_colaboradores` e `12_MECANICOS`
2. Altere `setupUserContext` para buscar `oficina_config_id` específico
3. Atualize queries para filtrar por ambos: `empresa_id` + `oficina_config_id`

Mas por enquanto, com OPÇÃO 1, cada empresa = 1 oficina. Simples! 🎉

---

## 💡 Dúvidas Comuns

**P: E se o usuário mudar de empresa?**
R: `localStorage.setItem('empresa_id', novaEmpresa)` + recarregar página

**P: Como eu sei qual é o empresa_id de uma oficina_config?**
R: Em OPÇÃO 1, o `id` da `oficina_config` É o `empresa_id`

**P: Preciso criar RLS policies?**
R: Sim, para segurança real. O frontend filtra, mas RLS no banco é obrigatório.

**P: Posso usar isso com o código anterior?**
R: Sim! `supabase-extended.ts` é apenas extensões. Seu `supabase.ts` original continua funcionando.

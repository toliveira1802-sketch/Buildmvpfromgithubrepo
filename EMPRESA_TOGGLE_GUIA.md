# Guia Rápido - EmpresaToggle

## 📌 O que é?

Um componente que **alterna entre empresas sem logout**. Perfeito para:
- ✅ Testar segmentação em Dev/Gestão
- ✅ Ver dados de ambas as empresas rapidinho
- ✅ Não precisa fazer logout e login de novo

---

## 🚀 Como Usar

### 1️⃣ Importar em suas páginas

```typescript
import EmpresaToggle from '@/app/components/EmpresaToggle';
```

### 2️⃣ Adicionar em Dev/Gestão

#### `src/app/pages/dev/DevDashboard.tsx`
```typescript
import EmpresaToggle from '@/app/components/EmpresaToggle';

export const DevDashboard = () => {
  return (
    <div className="dev-dashboard">
      {/* Adicione no topo */}
      <EmpresaToggle />

      {/* Resto do dashboard */}
      <h1>Dev Dashboard</h1>
      {/* ... */}
    </div>
  );
};
```

#### `src/app/pages/gestao/GestaoPage.tsx` (ou qual for o seu arquivo)
```typescript
import EmpresaToggle from '@/app/components/EmpresaToggle';

export const GestaoPage = () => {
  return (
    <div className="gestao-page">
      {/* Adicione no topo */}
      <EmpresaToggle />

      {/* Resto da página */}
      <h1>Gestão</h1>
      {/* ... */}
    </div>
  );
};
```

### 3️⃣ Opcional: Adicionar num Header Global

Se quiser que apareça em toda a app:

```typescript
// Em AdminLayout.tsx ou DashboardLayout.tsx
import EmpresaToggle from '@/app/components/EmpresaToggle';

export const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <header className="top-bar">
        <div className="left">
          <Logo />
        </div>
        <div className="right">
          <EmpresaToggle />  {/* ← Aqui */}
          <UserMenu />
        </div>
      </header>
      {/* resto da página */}
    </div>
  );
};
```

---

## 🎨 Personalizações

### Sem label
```typescript
<EmpresaToggle showLabel={false} />
```

### Com classe customizada
```typescript
<EmpresaToggle className="my-custom-class" />
```

### Exemplo em header minimalista
```typescript
<EmpresaToggle showLabel={false} className="header-toggle" />
```

---

## 🔄 Como Funciona

1. **Clica no botão** de uma empresa
2. **Atualiza localStorage** com novo `empresa_id` e `oficina_id`
3. **Recarrega a página** (window.location.reload()) para aplicar novos filtros
4. Pronto! Todos os dados mudaram para a nova empresa

---

## ⚠️ Importante

- O componente automaticamente detecta qual empresa está ativa
- Pega os IDs das empresas do seu banco (hardcoded no componente)
- Se você tiver mais de 2 empresas, é só adicionar na lista `EMPRESAS`

---

## 📝 Adicionar mais Empresas

Se você adicionar novas empresas no seu banco, atualize a lista:

```typescript
const EMPRESAS = [
  {
    id: '9d06823f-cbbc-473d-a346-1182e4332add',
    nome: 'Doctor Auto Bosch',
    slug: 'doctor-auto-bosch',
  },
  {
    id: 'f7de0c30-a07f-4d48-8ff3-553cf5bb05da',
    nome: 'Doctor Auto Prime',
    slug: 'doctor-auto-prime',
  },
  // ← Adicione aqui
  {
    id: 'seu-uuid-aqui',
    nome: 'Sua Nova Empresa',
    slug: 'nova-empresa',
  },
];
```

---

## 🎯 Resultado

Quando você clicar no toggle:

```
┌──────────────────────────────────┐
│ Empresa:                         │
│ [Doctor Auto Bosch] [✓ Prime]    │
│ ✓ Doctor Auto Prime              │
└──────────────────────────────────┘
        (recarregou página
         com novos dados)
```

Agora é só testar! 🚀

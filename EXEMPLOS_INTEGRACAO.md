# Exemplos de Integração - Segmentação por Oficina

## 1️⃣ Integração no Login

### Seu arquivo: `src/app/pages/Login.tsx`

```typescript
import { setupUserContext, clearUserContext } from '@/lib/supabase-extended';
import { supabase } from '@/lib/supabase';

// ... seus imports existentes

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Autenticar com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro de autenticação:', error.message);
        // Mostrar toast/alert de erro
        setIsLoading(false);
        return;
      }

      // 2. NOVO: Determinar role do usuário (colaborador, mecanico, admin)
      const role = determineUserRole(email); // Você implementa essa função
      
      // 3. NOVO: Configurar contexto de usuário (armazena empresa_id e oficina_id)
      const contextSetup = await setupUserContext(data.user.id, role);
      
      if (!contextSetup) {
        console.error('Falha ao configurar contexto do usuário');
        toast.error('Erro ao carregar dados da oficina');
        setIsLoading(false);
        return;
      }

      // 4. Redirecionar baseado no role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'colaborador') {
        navigate('/staff/gestao');
      } else if (role === 'mecanico') {
        navigate('/staff/mecanico');
      }

    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        type="password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};
```

---

## 2️⃣ Integração na App Principal

### Seu arquivo: `src/app/App.tsx`

```typescript
import { OficinaProvider } from '@/lib/supabase-extended';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// ... seus imports de pages

function App() {
  return (
    <Router>
      <OficinaProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          
          {/* Admin Routes - protegidas */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Colaborador Routes - protegidas */}
          <Route 
            path="/staff/gestao/*" 
            element={
              <ProtectedRoute requiredRole="colaborador">
                <StaffGestao />
              </ProtectedRoute>
            }
          />

          {/* Mecânico Routes - protegidas */}
          <Route 
            path="/staff/mecanico/*" 
            element={
              <ProtectedRoute requiredRole="mecanico">
                <StaffMecanico />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </OficinaProvider>
    </Router>
  );
}

export default App;
```

---

## 3️⃣ Integração em AdminLayout

### Seu arquivo: `src/app/components/AdminLayout.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useOficinaContext, fetchColaboradoresSegmentado, fetchMecanicosSegmentado } from '@/lib/supabase-extended';
import { useNavigate } from 'react-router-dom';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { empresa_id, oficina_config, isLoading } = useOficinaContext();
  const [colaboradores, setColaboradores] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!empresa_id) {
      navigate('/login');
      return;
    }

    const loadDados = async () => {
      setDataLoading(true);
      const [colab, mec] = await Promise.all([
        fetchColaboradoresSegmentado(),
        fetchMecanicosSegmentado(),
      ]);
      setColaboradores(colab);
      setMecanicos(mec);
      setDataLoading(false);
    };

    loadDados();
  }, [empresa_id, navigate]);

  if (isLoading) {
    return <div>Carregando configurações da oficina...</div>;
  }

  return (
    <div className="admin-layout">
      {/* Header da Oficina */}
      <header className="oficina-header">
        {oficina_config?.logo_url && (
          <img src={oficina_config.logo_url} alt="Logo" className="logo" />
        )}
        <div>
          <h1>{oficina_config?.nome}</h1>
          <p className="meta-info">
            Capacidade: {oficina_config?.capacidade_maxima} | 
            Entrada: {oficina_config?.horario_entrada} | 
            Saída: {oficina_config?.horario_saida_semana}
          </p>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main>
        {dataLoading ? (
          <div>Carregando dados...</div>
        ) : (
          <>
            {/* Seção Colaboradores */}
            <section>
              <h2>Colaboradores ({colaboradores.length})</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {colaboradores.map((colab) => (
                    <tr key={colab.id}>
                      <td>{colab.nome}</td>
                      <td>{colab.cargo}</td>
                      <td>{colab.email}</td>
                      <td>{colab.is_active ? 'Ativo' : 'Inativo'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Seção Mecânicos */}
            <section>
              <h2>Mecânicos ({mecanicos.length})</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Especialidade</th>
                    <th>Nível</th>
                    <th>OS Executadas</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mecanicos.map((mec) => (
                    <tr key={mec.id}>
                      <td>{mec.nome}</td>
                      <td>{mec.especialidade}</td>
                      <td>{mec.nivel}</td>
                      <td>{mec.total_os_executadas}</td>
                      <td>{mec.is_active ? 'Ativo' : 'Inativo'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
};
```

---

## 4️⃣ Integração em PatioKanban

### Seu arquivo: `src/app/pages/PatioKanban.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useOficinaContext } from '@/lib/supabase-extended';
import { supabase } from '@/lib/supabase';

export const PatioKanban = () => {
  const { empresa_id, oficina_config } = useOficinaContext();
  const [osData, setOsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOS = async () => {
      if (!empresa_id) return;

      // ✅ CORRETO: Filtrar por empresa_id
      const { data, error } = await supabase
        .from('06_OS')
        .select('*')
        .eq('empresa_id', empresa_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar OS:', error);
      } else {
        setOsData(data || []);
      }

      setIsLoading(false);
    };

    loadOS();
  }, [empresa_id]);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="patio-kanban">
      <h1>Pátio - {oficina_config?.nome}</h1>
      
      {/* Seu kanban aqui, usando osData */}
      <div className="kanban-board">
        {osData.map((os) => (
          <div key={os.id} className="os-card">
            <h3>{os.numero_os}</h3>
            <p>{os.cliente}</p>
            <p>Box: {os.box}</p>
            <p>Status: {os.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 5️⃣ Função Helper para Determinar Role

### Adicione em `src/lib/auth-helpers.ts` (novo arquivo)

```typescript
import { supabase } from './supabase';

/**
 * Determina o role do usuário baseado no email e dados no banco
 * Retorna: 'admin' | 'colaborador' | 'mecanico'
 */
export const determineUserRole = async (email: string): Promise<'admin' | 'colaborador' | 'mecanico'> => {
  // Buscar em colaboradores
  const { data: colab } = await supabase
    .from('01_colaboradores')
    .select('id, nivel_acesso')
    .eq('email', email)
    .single();

  if (colab) {
    return colab.nivel_acesso === 'admin' ? 'admin' : 'colaborador';
  }

  // Buscar em mecânicos
  const { data: mec } = await supabase
    .from('12_MECANICOS')
    .select('id')
    .eq('email', email)
    .single();

  if (mec) {
    return 'mecanico';
  }

  // Fallback
  return 'colaborador';
};
```

---

## ✅ Checklist Rápido

- [ ] Copiar conteúdo de `supabase-extended.ts`
- [ ] Adicionar `OficinaProvider` em App.tsx
- [ ] Integrar `setupUserContext` no Login
- [ ] Usar `useOficinaContext` em AdminLayout
- [ ] Atualizar queries em PatioKanban
- [ ] Testar com múltiplas empresas
- [ ] Adicionar RLS policies no Supabase (segurança)

Pronto! Sua segmentação por oficina está funcionando! 🚀

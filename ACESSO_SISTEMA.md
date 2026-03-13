# 🔐 GUIA DE ACESSO - DOCTOR AUTO MVP

## 📍 COMO ACESSAR AS PÁGINAS

### **1. FAZER LOGIN**

Você tem **2 opções de login:**

#### **Opção A: Login Operacional (sem senha)**
1. Vá para `/login`
2. Escolha um dos 3 perfis:
   - **GESTÃO** → Acesso total (Dashboard, Pátio, Agendamentos, Clientes, OS, Relatórios, Configurações)
   - **CONSULTORES** → Acesso médio (Pátio, Agendamentos, Clientes, OS)
   - **MECÂNICO** → Acesso limitado (Pátio, OS)

#### **Opção B: Login DEV (com email/senha)**
1. Vá para `/dev-login`
2. Use credenciais:
   - Email: `dev@doctorauto.com`
   - Senha: `senha123`
3. Acesso ao ambiente DEV: Dev Dashboard, Tabelas, Usuários, Database

---

## 🗺️ MAPA DE NAVEGAÇÃO

### **AMBIENTE OPERACIONAL (após Login normal)**

| Página | URL | Perfis com Acesso |
|--------|-----|-------------------|
| 🏠 Dashboard | `/dashboard` | Gestão, Direção |
| 🚗 Pátio Kanban | `/patio` | Gestão, Consultor, Mecânico, Direção |
| 📅 Agendamentos | `/agendamentos` | Gestão, Consultor, Direção |
| 👥 Clientes | `/clientes` | Gestão, Consultor, Direção |
| 👤 Cliente Detalhe | `/clientes/:id` | Gestão, Consultor, Direção |
| 📋 Ordens de Serviço | `/ordens-servico` | Gestão, Consultor, Mecânico, Direção |
| 📄 OS Detalhes | `/ordens-servico/:id` | Gestão, Consultor, Mecânico, Direção |
| ➕ Nova OS | `/ordens-servico/nova` | Gestão, Consultor, Direção |
| 📊 **Relatórios** | `/relatorios` | **Gestão, Direção** |
| ⚙️ Configurações | `/configuracoes` | Gestão, Direção |

---

### **AMBIENTE DEV (após DevLogin)**

| Página | URL | Acesso |
|--------|-----|--------|
| 🤖 Monitoramento IA | `/dev-dashboard` | Desenvolvedor |
| 📊 Tabelas | `/dev-tables` | Desenvolvedor |
| 👥 Usuários | `/dev-users` | Desenvolvedor |
| 💾 Database | `/dev-database` | Desenvolvedor |

---

## 🎯 TESTANDO RELATÓRIOS

### **Passo a Passo:**

1. **Fazer Login como GESTÃO:**
   ```
   1. Ir para: /login
   2. Clicar no card "GESTAO"
   3. Aguardar redirecionamento
   ```

2. **Acessar Relatórios:**
   ```
   Opção 1: Clicar em "Relatórios" na sidebar esquerda
   Opção 2: Digitar na URL: /relatorios
   ```

3. **O que você verá:**
   - ✅ 4 KPIs principais (Faturamento Total, Ticket Médio, OS Realizadas, Taxa de Conversão)
   - ✅ Gráfico de Faturamento Mensal (barras)
   - ✅ Distribuição por Status (pizza)
   - ✅ Serviços Mais Realizados (barras horizontais)
   - ✅ Ranking de Performance por Mecânico (tabela)
   - ✅ Evolução do Ticket Médio (linha)
   - ✅ Filtro por período (semana, mês, trimestre, semestre, ano)
   - ✅ Botões de Atualizar e Exportar PDF

---

## 🔍 TROUBLESHOOTING

### **Problema: "Não vejo a opção Relatórios no menu"**

**Causa:** Você está logado com perfil que não tem permissão.

**Solução:**
```
1. Fazer logout (botão "Sair" no rodapé da sidebar)
2. Ir para /login
3. Escolher perfil "GESTAO"
4. Agora você verá "Relatórios" no menu
```

---

### **Problema: "Menu não aparece"**

**Causa:** Você não fez login.

**Solução:**
```
1. Ir para /login ou /dev-login
2. Fazer login
3. Menu aparecerá automaticamente
```

---

### **Problema: "Página em branco"**

**Causa:** Dados ainda não foram inicializados.

**Solução:**
```
1. Executar seed do banco:
   POST https://acuufrgoyjwzlyhopaus.supabase.co/functions/v1/make-server-0092e077/seed

2. Ou no console do navegador:
   fetch('https://acuufrgoyjwzlyhopaus.supabase.co/functions/v1/make-server-0092e077/seed', {
     method: 'POST'
   }).then(r => r.json()).then(console.log);
```

---

## 📱 MENU MOBILE

### **Como acessar o menu no celular:**

1. Clicar no ícone de **hambúrguer (☰)** no canto superior direito
2. Sidebar abre pela esquerda
3. Clicar em qualquer item para navegar
4. Menu fecha automaticamente

---

## 🎨 PÁGINAS IMPLEMENTADAS

### **✅ Total: 14 Páginas Completas**

**Ambiente DEV (4):**
- [x] Dev Dashboard - Monitoramento de IA
- [x] Dev Tables - Visualização de dados
- [x] Dev Users - Gestão de usuários
- [x] Dev Database - Gerenciamento de banco

**Ambiente Operacional (10):**
- [x] Dashboard - KPIs e visão geral
- [x] Pátio Kanban - Drag-and-drop
- [x] Agendamentos - CRUD completo
- [x] Clientes - Lista com busca e filtros
- [x] Cliente Detalhe - Histórico e veículos
- [x] Ordens de Serviço - Lista com filtros
- [x] OS Detalhes - Visualização completa
- [x] Nova OS - Formulário de criação
- [x] **Relatórios** - Analytics completo ⭐
- [x] Configurações - Preferências do sistema

---

## 🚀 FLUXO RECOMENDADO DE TESTE

### **Teste 1: Ambiente Operacional**

```
1. Ir para /login
2. Escolher "GESTAO"
3. Navegar por todas as páginas:
   - Dashboard → Ver KPIs
   - Pátio Kanban → Arrastar cards
   - Agendamentos → Criar agendamento
   - Clientes → Ver lista, clicar em um
   - Ordens de Serviço → Ver lista, clicar em uma
   - Nova OS → Criar ordem
   - Relatórios → Ver gráficos ⭐
   - Configurações → Ver opções
```

### **Teste 2: Diferentes Perfis**

```
1. Fazer logout
2. Login como "CONSULTORES"
   → Ver que NÃO tem acesso a Relatórios
   → Só vê: Pátio, Agendamentos, Clientes, OS

3. Fazer logout
4. Login como "MECANICO"
   → Ver que SÓ tem: Pátio e OS
```

### **Teste 3: Ambiente DEV**

```
1. Ir para /dev-login
2. Usar: dev@doctorauto.com / senha123
3. Navegar:
   - Dev Dashboard → Ver métricas de IA
   - Dev Tables → Ver estrutura de dados
   - Dev Users → Ver usuários
   - Dev Database → Ver banco
```

---

## 🎯 QUICK START

**Para ver RELATÓRIOS agora:**

```bash
# 1. Abrir aplicação
# 2. Ir para: /login
# 3. Clicar em "GESTAO"
# 4. Clicar em "Relatórios" no menu lateral
# OU
# 5. Digitar na URL: /relatorios
```

**Pronto! Você verá:**
- 📊 6 gráficos interativos
- 💰 Análise de faturamento
- 📈 Performance de mecânicos
- 🔧 Serviços mais populares
- 🎯 KPIs em tempo real

---

## 📋 ESTRUTURA DE PERMISSÕES

| Recurso | Gestão | Consultor | Mecânico |
|---------|--------|-----------|----------|
| Dashboard | ✅ | ❌ | ❌ |
| Pátio Kanban | ✅ | ✅ | ✅ |
| Agendamentos | ✅ | ✅ | ❌ |
| Clientes | ✅ | ✅ | ❌ |
| Ordens de Serviço | ✅ | ✅ | ✅ |
| **Relatórios** | **✅** | **❌** | **❌** |
| Configurações | ✅ | ❌ | ❌ |

---

## 🎉 CONCLUSÃO

**Todas as 14 páginas estão funcionais e acessíveis!**

- ✅ Rotas configuradas
- ✅ Permissões por perfil
- ✅ Menu dinâmico baseado no cargo
- ✅ Login funcionando (2 tipos)
- ✅ Relatórios com dados reais + fallback
- ✅ Responsivo (desktop + mobile)
- ✅ Dark theme aplicado

**🚗 Doctor Auto MVP - Pronto para uso!**

---

*Desenvolvido com React + TypeScript + Tailwind CSS + Supabase*

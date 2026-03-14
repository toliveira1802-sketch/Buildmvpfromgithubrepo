# ✅ PRÉ-DEPLOY CHECKLIST - DOCTOR AUTO MVP

**Execute esta checklist ANTES do deploy**

---

## 🔍 1. VERIFICAÇÃO DE ARQUIVOS CRÍTICOS

### Estrutura de Pastas
```
✅ /src/app/pages/ (38 arquivos .tsx)
✅ /src/app/components/ (AdminLayout.tsx + ProtectedRoute.tsx + ui/)
✅ /src/app/services/api.ts
✅ /src/app/hooks/useAPI.ts
✅ /src/app/routes.tsx
✅ /src/app/App.tsx
✅ /supabase/functions/server/index.tsx
✅ /supabase/functions/server/kv_store.tsx
✅ /package.json
```

### Páginas Implementadas (38)
```
Core (5):
✅ Landing.tsx
✅ Login.tsx
✅ DevLogin.tsx
✅ ForgotPassword.tsx
✅ Dashboard.tsx

Dev (6):
✅ DevDashboard.tsx
✅ DevTables.tsx
✅ DevUsers.tsx
✅ DevDatabase.tsx
✅ DevIAPortal.tsx
✅ DevPerfilIA.tsx

Admin (17):
✅ AdminAgendamentos.tsx
✅ AdminClientes.tsx
✅ AdminClienteDetalhe.tsx
✅ AdminOrdensServico.tsx
✅ AdminOSDetalhes.tsx
✅ AdminNovaOS.tsx
✅ AdminConfiguracoes.tsx
✅ AdminRelatorios.tsx
✅ AdminPendencias.tsx
✅ AdminOperacional.tsx
✅ AdminAgendaMecanicos.tsx
✅ AdminUsuarios.tsx
✅ AdminFinanceiro.tsx
✅ AdminProdutividade.tsx
✅ AdminIaQG.tsx
✅ AdminIntegracoes.tsx
✅ AdminTrelloMigracao.tsx

Outros (10):
✅ PatioKanban.tsx
✅ MecanicoView.tsx
✅ GestaoOsUltimate.tsx
✅ GestaoVisaoGeral.tsx
✅ GestaoMetas.tsx
✅ GestaoMelhorias.tsx
✅ GestaoFornecedores.tsx
✅ VisaoGeral.tsx
✅ AnalyticsFunil.tsx
```

---

## 🔧 2. VERIFICAÇÃO DE DEPENDÊNCIAS

### package.json
```bash
# Verificar se todas as dependências estão instaladas:
pnpm install

# Verificar versões críticas:
✅ react: 18.3.1
✅ react-router: 7.13.0
✅ @supabase/supabase-js: ^2.99.1
✅ recharts: 2.15.2
✅ lucide-react: 0.487.0
✅ sonner: 2.0.3
✅ tailwindcss: 4.1.12
```

### Dependências Críticas Instaladas
```
✅ @radix-ui/* (componentes Shadcn/ui)
✅ react-dnd + react-dnd-html5-backend (Kanban)
✅ recharts (gráficos)
✅ lucide-react (ícones)
✅ sonner (toasts)
✅ motion (animações)
✅ date-fns (datas)
```

---

## 📝 3. VERIFICAÇÃO DE ROTAS

### Rotas Registradas (38)
```typescript
// Verificar se todas estão em /src/app/routes.tsx:

Core:
✅ /
✅ /login
✅ /dev-login
✅ /forgot-password
✅ /dashboard

Dev:
✅ /dev-dashboard
✅ /dev-tables
✅ /dev-users
✅ /dev-database
✅ /dev-ia-portal
✅ /dev-perfil-ia

Admin:
✅ /patio
✅ /agendamentos
✅ /clientes
✅ /clientes/:id
✅ /ordens-servico
✅ /ordens-servico/:id
✅ /ordens-servico/nova
✅ /configuracoes
✅ /relatorios
✅ /pendencias
✅ /operacional
✅ /agenda-mecanicos
✅ /usuarios
✅ /financeiro
✅ /produtividade
✅ /ia-qg
✅ /admin/integracoes
✅ /admin/trello-migracao

Gestão:
✅ /gestao/os-ultimate
✅ /gestao/visao-geral
✅ /gestao/metas
✅ /gestao/melhorias
✅ /gestao/fornecedores

Outros:
✅ /mecanico/:id
✅ /visao-geral
✅ /analytics/funil
✅ * (redirect to /)
```

---

## 🎨 4. VERIFICAÇÃO DE COMPONENTES UI

### Shadcn/ui Components Usados
```
✅ Button
✅ Card (CardContent, CardHeader, CardTitle, CardDescription)
✅ Input
✅ Label
✅ Badge
✅ Dialog (DialogContent, DialogHeader, DialogTitle, etc)
✅ Select (SelectContent, SelectItem, SelectTrigger, SelectValue)
✅ Tabs (TabsContent, TabsList, TabsTrigger)
✅ Switch
✅ Slider
✅ Progress
✅ Avatar (AvatarFallback)
✅ Textarea
```

### Ícones Lucide React (50+)
```
✅ LayoutDashboard, Users, Calendar, FileText
✅ Settings, Bell, Search, Plus, Edit2, Trash2
✅ TrendingUp, TrendingDown, DollarSign, Package
✅ Wrench, Clock, CheckCircle2, XCircle, AlertCircle
✅ Phone, Mail, MapPin, Truck, Star
✅ Bot, Sparkles, Brain, Lightbulb
✅ RefreshCw, Download, Upload, Save
✅ GitCompare, Plug, Key, Target
```

---

## 🔌 5. VERIFICAÇÃO DE BACKEND

### Supabase Function
```bash
# Verificar arquivo existe:
✅ /supabase/functions/server/index.tsx

# Endpoints implementados (25+):
✅ GET /make-server-0092e077/health
✅ GET /make-server-0092e077/analytics/kpis
✅ GET /make-server-0092e077/analytics/evolucao-mensal
✅ GET /make-server-0092e077/analytics/top-mecanicos
✅ GET /make-server-0092e077/clientes
✅ GET /make-server-0092e077/ordens-servico
✅ ... (outros 19)

# KV Store utilities:
✅ /supabase/functions/server/kv_store.tsx
```

### Environment Variables (Backend)
```bash
# Necessárias no Supabase:
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Opcionais (integrações):
OPENAI_API_KEY
KOMMO_API_KEY
WHATSAPP_API_KEY
TRELLO_API_KEY
```

---

## 🌐 6. VERIFICAÇÃO DE FRONTEND

### Environment Variables (Frontend)
```bash
# Criar arquivo .env.production:
VITE_SUPABASE_URL=https://[projeto].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# ❌ NUNCA incluir:
# SUPABASE_SERVICE_ROLE_KEY (SECRETO!)
```

### Fallback Automático
```typescript
// Verificar em /src/app/hooks/useAPI.ts:
✅ Sistema de fallback para dados mockados
✅ Retry automático (3 tentativas)
✅ Cache local opcional
```

---

## 🧪 7. BUILD DE TESTE

### Comando de Build
```bash
# Executar:
pnpm install
pnpm run build

# Verificar saída:
✅ Vite build completado sem erros
✅ Pasta /dist criada
✅ Assets otimizados
✅ Tamanho do bundle < 5MB
```

### Preview Local
```bash
# Executar:
pnpm preview

# Acessar: http://localhost:4173
# Testar:
✅ Landing page carrega
✅ Login funciona
✅ Dashboard acessível
✅ Navegação entre páginas OK
```

---

## 🔒 8. VERIFICAÇÃO DE SEGURANÇA

### Secrets Protegidos
```bash
# ✅ NO BACKEND (Supabase Function):
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
Outras API keys

# ✅ NO FRONTEND (.env.production):
VITE_SUPABASE_URL (público, OK)
VITE_SUPABASE_ANON_KEY (público, OK)

# ❌ NUNCA NO FRONTEND:
SUPABASE_SERVICE_ROLE_KEY
Chaves privadas de APIs
```

### Proteção de Rotas
```typescript
// Verificar em routes.tsx:
✅ ProtectedRoute envolvendo rotas privadas
✅ Redirecionamento para login se não autenticado
```

---

## 📊 9. VERIFICAÇÃO DE PERFORMANCE

### Otimizações Implementadas
```
✅ Lazy loading de componentes (quando possível)
✅ useState para estado local (não Redux)
✅ Imagens otimizadas (quando aplicável)
✅ CSS inline com Tailwind (tree-shaking)
✅ Vite build otimizado
```

### Lighthouse Score Esperado
```
🎯 Performance: 80+
🎯 Accessibility: 90+
🎯 Best Practices: 90+
🎯 SEO: 80+
```

---

## 📱 10. VERIFICAÇÃO DE RESPONSIVIDADE

### Breakpoints Testados
```
✅ Mobile (320px - 640px)
✅ Tablet (640px - 1024px)
✅ Desktop (1024px+)

# Grid responsivo:
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4

# Sidebar colapsável:
hidden lg:block (sidebar)
block lg:hidden (menu mobile)
```

---

## ✅ CHECKLIST FINAL PRÉ-DEPLOY

### Arquivos
- [x] 38 páginas implementadas
- [x] Rotas registradas
- [x] Components UI funcionando
- [x] Backend Supabase Function pronto
- [x] KV Store utilities

### Configuração
- [ ] .env.production criado
- [ ] Variáveis de ambiente definidas
- [ ] Secrets protegidos
- [ ] CORS configurado

### Build
- [ ] `pnpm install` executado
- [ ] `pnpm run build` SEM ERROS
- [ ] Preview local testado
- [ ] Lighthouse score OK

### Funcionalidades
- [ ] Login multi-perfil funciona
- [ ] Dashboard carrega
- [ ] Kanban drag & drop OK
- [ ] Chat IA responde
- [ ] Gamificação renderiza
- [ ] Gráficos aparecem

### Deploy
- [ ] Conta Supabase criada
- [ ] Projeto Supabase provisionado
- [ ] Conta Vercel/Netlify pronta
- [ ] Repositório GitHub atualizado

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### Erro: "Module not found"
```bash
Solução:
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: Build falha
```bash
Solução:
1. Verificar TypeScript errors
2. Verificar imports incorretos
3. Verificar dependências no package.json
```

### Erro: "Cannot read property of undefined"
```bash
Solução:
1. Verificar dados mockados
2. Verificar optional chaining (?.)
3. Verificar fallback no useAPI
```

### Erro: CORS
```bash
Solução:
1. Configurar CORS no Supabase Dashboard
2. Adicionar domínios permitidos
3. Incluir localhost:5173 para dev
```

---

## 📞 PRÓXIMOS PASSOS

Após completar este checklist:

1. ✅ Execute: `pnpm run build`
2. ✅ Verifique: Build sem erros
3. ✅ Teste: Preview local funcionando
4. 🚀 Prossiga: Siga o /GUIA_DEPLOY.md

---

## 🎉 TUDO PRONTO?

Se todos os itens acima estão ✅, você está pronto para deploy!

**Próximo arquivo:** `/GUIA_DEPLOY.md`

---

**Última atualização:** 13/03/2026 - 20:30  
**Status:** PRONTO PARA DEPLOY ✅

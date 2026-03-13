# Doctor Auto Prime - MVP

Sistema Inteligente de Gestão de Oficina Mecânica

## 🚀 Sobre o Projeto

Doctor Auto Prime é um sistema completo de gestão para oficinas mecânicas, desenvolvido com foco em eficiência operacional e experiência do usuário. Este MVP implementa as funcionalidades essenciais baseadas no repositório original.

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Login
- Login por perfil (Consultor, Gestão, Mecânico, Administrador)
- Interface visual com cards coloridos
- Autenticação simulada com localStorage

### 📊 Dashboard Principal
- KPIs em tempo real:
  - Veículos no Pátio
  - Ordens de Serviço Abertas
  - Faturamento do Mês
  - Ticket Médio
- Alertas e pendências
- Gráfico de distribuição por status (Pizza)
- Gráfico de faturamento mensal (Barras)

### 🚗 Pátio Kanban
- Sistema drag-and-drop para gestão visual
- 5 colunas de status:
  - Diagnóstico
  - Orçamento
  - Aguardando Aprovação
  - Em Execução
  - Pronto
- Cards com informações completas (placa, veículo, cliente, mecânico, valor)
- Badges de prioridade (Alta, Média, Baixa)

### 📋 Lista de Ordens de Serviço
- Tabela completa com todas as OS
- Busca full-text (número, placa, cliente, veículo)
- Filtro por status
- Exportação de dados
- Visualização de detalhes

### ➕ Nova Ordem de Serviço
- Formulário completo organizado em seções:
  - Informações do Veículo
  - Informações do Cliente
  - Detalhes do Serviço
- Validação de campos obrigatórios
- Seleção de mecânico responsável
- Definição de prioridade

## 🛠 Tecnologias Utilizadas

- **React 18** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **React Router** - Navegação
- **Tailwind CSS v4** - Estilização
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos e visualizações
- **React DnD** - Drag and drop
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **Next Themes** - Suporte a dark mode

## 🎨 Design System

- **Dark Theme** como padrão
- Cores baseadas em OKLCH
- Componentes shadcn/ui
- Design responsivo (mobile-first)
- Animações suaves e transições

## 📦 Estrutura do Projeto

```
src/app/
├── components/
│   ├── ui/              # Componentes base do design system
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── PatioKanban.tsx
│   ├── OrdensList.tsx
│   └── NovaOS.tsx
├── routes.tsx           # Configuração de rotas
└── App.tsx              # Componente principal
```

## 🔄 Fluxo de Navegação

1. **Login** → Seleção de perfil
2. **Dashboard** → Visão geral da oficina
3. **Pátio Kanban** → Gestão visual das OS
4. **Lista de Ordens** → Busca e filtros
5. **Nova OS** → Cadastro de nova ordem

## 🎯 Melhorias Futuras

- [ ] Integração com Kommo CRM (Leads)
- [ ] Sistema de IA com 3 agentes (Sophia, Simone, Raena)
- [ ] Portal do Cliente
- [ ] Relatórios avançados
- [ ] Gestão de estoque de peças
- [ ] Integração WhatsApp
- [ ] Notificações em tempo real
- [ ] Analytics e métricas avançadas

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 Mobile (360px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥 Wide Screen (1440px+)

## 🎨 Paleta de Cores

- **Primary**: Purple (#8b5cf6)
- **Secondary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Info**: Cyan (#06b6d4)

## 👥 Perfis de Acesso

- **Consultor**: Atendimento e vendas
- **Gestão**: Administração e relatórios
- **Mecânico**: Execução de serviços
- **Administrador**: Acesso completo ao sistema

## 📄 Licença

Este é um projeto MVP desenvolvido para demonstração das capacidades do sistema Doctor Auto Prime.

---

**Desenvolvido com ❤️ usando Figma Make**
# 🧪 COMO TESTAR O SISTEMA

**Data:** 14 de Março de 2026  
**Status:** ✅ PRONTO PARA TESTE

---

## 🚀 TESTE RÁPIDO

### 1️⃣ Login de Desenvolvedor

**Acesse:** `/dev-login`

**Credenciais:**
```
Username: Dev_thales
Senha: dev123
```

**O que deve acontecer:**
1. ✅ Preencha os campos
2. ✅ Marque "Lembrar de mim" (opcional)
3. ✅ Clique em "Acessar Sistema"
4. ✅ Aguarde 0.5s (toast aparece)
5. ✅ **Redireciona para `/dev-dashboard`**

---

### 2️⃣ Login de Gestão

**Acesse:** `/login`

**Credenciais:**
```
1. Selecione: GESTÃO
2. Username: Gestao_thales
3. Senha: gestao123
```

**O que deve acontecer:**
1. ✅ Seleciona card de GESTÃO (roxo)
2. ✅ Preenche username e senha
3. ✅ Marque "Lembrar de mim" (opcional)
4. ✅ Clique em "Entrar"
5. ✅ Aguarda 0.5s (toast aparece)
6. ✅ **Redireciona para `/staff-gestao` → `/dashboard`**

---

### 3️⃣ Login de Consultor

**Acesse:** `/login`

**Credenciais:**
```
1. Selecione: CONSULTOR
2. Username: Consultor_thales
3. Senha: consultor123
```

**O que deve acontecer:**
1. ✅ Seleciona card de CONSULTOR (azul)
2. ✅ Preenche username e senha
3. ✅ Marque "Lembrar de mim" (opcional)
4. ✅ Clique em "Entrar"
5. ✅ Aguarda 0.5s (toast aparece)
6. ✅ **Redireciona para `/staff-consultor` → `/dashboard`**

---

### 4️⃣ Login de Mecânico

**Acesse:** `/login`

**Credenciais:**
```
1. Selecione: MECÂNICO
2. Username: Mecanico_thales
3. Senha: mecanico123
```

**O que deve acontecer:**
1. ✅ Seleciona card de MECÂNICO (laranja)
2. ✅ Preenche username e senha
3. ✅ Marque "Lembrar de mim" (opcional)
4. ✅ Clique em "Entrar"
5. ✅ Aguarda 0.5s (toast aparece)
6. ✅ **Redireciona para `/staff-mecanico` → `/dashboard`**

---

## 🔍 VERIFICAÇÃO NO CONSOLE

### Ver dados salvos:

Abra o Console do navegador (F12) e digite:

```javascript
// Ver usuário logado
JSON.parse(localStorage.getItem('dap-user'))

// Ver token de sessão
localStorage.getItem('dap-token')

// Limpar tudo (logout manual)
localStorage.clear()
```

---

## ✅ CHECKLIST DE TESTE

### Login Dev
- [ ] Acessa `/dev-login`
- [ ] Preenche `Dev_thales` / `dev123`
- [ ] Clica em "Acessar Sistema"
- [ ] Vê toast: "Acesso do Desenvolvedor Autorizado"
- [ ] **Redireciona para `/dev-dashboard`** (0.5s)
- [ ] Console mostra dados salvos
- [ ] Token de sessão salvo

### Login Gestão
- [ ] Acessa `/login`
- [ ] Clica no card GESTÃO (roxo)
- [ ] Preenche `Gestao_thales` / `gestao123`
- [ ] Clica em "Entrar"
- [ ] Vê toast: "Bem-vindo(a), Thales!"
- [ ] **Redireciona para `/staff-gestao`** (0.5s)
- [ ] **Depois redireciona para `/dashboard`**
- [ ] Console mostra dados salvos
- [ ] Token de sessão salvo

### Login Consultor
- [ ] Acessa `/login`
- [ ] Clica no card CONSULTOR (azul)
- [ ] Preenche `Consultor_thales` / `consultor123`
- [ ] Clica em "Entrar"
- [ ] Vê toast: "Bem-vindo(a), Thales!"
- [ ] **Redireciona para `/staff-consultor`** (0.5s)
- [ ] **Depois redireciona para `/dashboard`**
- [ ] Console mostra dados salvos
- [ ] Token de sessão salvo

### Login Mecânico
- [ ] Acessa `/login`
- [ ] Clica no card MECÂNICO (laranja)
- [ ] Preenche `Mecanico_thales` / `mecanico123`
- [ ] Clica em "Entrar"
- [ ] Vê toast: "Bem-vindo(a), Thales!"
- [ ] **Redireciona para `/staff-mecanico`** (0.5s)
- [ ] **Depois redireciona para `/dashboard`**
- [ ] Console mostra dados salvos
- [ ] Token de sessão salvo

### Recuperação de Senha
- [ ] Acessa `/dev-login`
- [ ] Clica em "Esqueceu a senha?"
- [ ] Preenche `Dev_thales`
- [ ] Clica em "Gerar Token"
- [ ] Vê token no console
- [ ] Vê toast com o token
- [ ] Digita o token
- [ ] Clica em "Verificar Token"
- [ ] Vê mensagem "Token verificado!"

### Lembrar de mim
- [ ] Faz login SEM marcar checkbox
- [ ] Fecha navegador
- [ ] Abre navegador novamente
- [ ] ❌ **Não está mais logado** (esperado)
- [ ] Faz login COM checkbox marcada
- [ ] Fecha navegador
- [ ] Abre navegador novamente
- [ ] ✅ **Ainda está logado** (esperado)

---

## 🐛 ERROS COMUNS E SOLUÇÕES

### ❌ "Usuário não encontrado"
**Causa:** Servidor não inicializou os usuários padrão  
**Solução:** Acesse `/make-server-0092e077/health` para inicializar

### ❌ "Senha incorreta"
**Causa:** Senha digitada errada  
**Solução:** Use as senhas exatas:
- `dev123` (Dev)
- `gestao123` (Gestão)
- `consultor123` (Consultor)
- `mecanico123` (Mecânico)

### ❌ "Perfil selecionado não corresponde ao nome"
**Causa:** Selecionou GESTÃO mas digitou `Consultor_thales`  
**Solução:** O nome deve bater com o perfil:
- GESTÃO → `Gestao_thales`
- CONSULTOR → `Consultor_thales`
- MECÂNICO → `Mecanico_thales`

### ❌ "Nome inválido. Use o formato..."
**Causa:** Esqueceu o underscore `_`  
**Solução:** Use sempre `Role_Nome`:
- ✅ `Gestao_thales`
- ❌ `gestao thales`
- ❌ `Gestao-thales`

### ❌ Fica travado em "Autenticando..."
**Causa:** Erro de rede ou backend offline  
**Solução:** Veja o console (F12) para detalhes do erro

### ❌ Login funciona mas não redireciona
**Causa:** Problema já corrigido!  
**Solução:** Atualize a página e tente novamente

---

## 📊 DADOS DE EXEMPLO NO CONSOLE

### Depois do login de Dev:

```javascript
// localStorage.getItem('dap-user')
{
  "name": "Thales",
  "username": "Dev_thales",
  "role": "dev",
  "firstName": "thales",
  "permissions": ["full-access", "database", "settings", "users"],
  "userId": "Dev_thales"
}

// localStorage.getItem('dap-token')
"session_1710445200000_a1b2c3d4..."
```

### Depois do login de Gestão:

```javascript
// localStorage.getItem('dap-user')
{
  "username": "Gestao_thales",
  "role": "gestao",
  "firstName": "thales",
  "name": "Thales",
  "loginType": "staff",
  "cargo": "GESTÃO",
  "userId": "Gestao_thales"
}

// localStorage.getItem('dap-token')
"session_1710445200000_x1y2z3w4..."
```

---

## 🎯 TESTE COMPLETO (5 minutos)

1. **[1 min]** Login Dev → `/dev-dashboard`
2. **[1 min]** Logout → Login Gestão → `/dashboard`
3. **[1 min]** Logout → Login Consultor → `/dashboard`
4. **[1 min]** Logout → Login Mecânico → `/dashboard`
5. **[1 min]** Recuperação de senha

**Total: 5 minutos para testar tudo!**

---

## 🔧 DEBUG AVANÇADO

### Ver logs do backend:

Acesse o console da função Supabase para ver:

```
Inicializando usuários padrão...
✅ Usuários padrão criados!
📋 Credenciais:
   Dev_thales / dev123
   Gestao_thales / gestao123
   Consultor_thales / consultor123
   Mecanico_thales / mecanico123
```

### Testar endpoint health:

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-0092e077/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2026-03-14T...",
  "database": "kv-store"
}
```

---

## ✅ TUDO FUNCIONANDO?

Se todos os testes passaram:

```
✅ Login Dev funciona
✅ Login Gestão funciona
✅ Login Consultor funciona
✅ Login Mecânico funciona
✅ Recuperação de senha funciona
✅ Lembrar de mim funciona
✅ Redirecionamento funciona
✅ Dados salvos corretamente
```

**SISTEMA 100% OPERACIONAL!** 🎉

---

**Última Atualização:** 14/03/2026  
**Desenvolvedor:** Thales Oliveira  
**Status:** 🟢 TUDO FUNCIONANDO

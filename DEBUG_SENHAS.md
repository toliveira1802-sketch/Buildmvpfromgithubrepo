# 🔧 DEBUG - PROBLEMA COM SENHAS

## 🚨 PROBLEMA
As senhas não estão funcionando.

## 🔍 DIAGNÓSTICO

### Passo 1: Verificar se os usuários foram criados

Abra o navegador e acesse:

```
https://[SEU-PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/users
```

**Resposta esperada:**
```json
{
  "totalUsers": 4,
  "initialized": true,
  "users": [
    {
      "username": "Dev_thales",
      "role": "dev",
      "firstName": "thales",
      "hasPassword": true,
      "passwordHash": "9b871512327c09ce98...",
      "createdAt": "2026-03-14T..."
    },
    ...
  ]
}
```

**Se totalUsers = 0:**
- Os usuários não foram criados ainda
- Vá para **Passo 2**

**Se totalUsers = 4:**
- Os usuários existem
- Vá para **Passo 3**

---

### Passo 2: RESETAR e criar usuários

Use uma ferramenta como **Postman** ou **curl**:

```bash
curl -X POST https://[SEU-PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/reset-users
```

**Ou use JavaScript no console do navegador:**

```javascript
fetch('https://[SEU-PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/reset-users', {
  method: 'POST'
})
  .then(r => r.json())
  .then(data => console.log(data));
```

**Resposta esperada:**
```json
{
  "message": "Usuários resetados com sucesso!",
  "users": [
    {
      "username": "Dev_thales",
      "role": "dev",
      "passwordHash": "9b871512327c09ce98..."
    },
    ...
  ]
}
```

Agora volte para **Passo 1** e confirme que os 4 usuários foram criados.

---

### Passo 3: Testar senha

Use JavaScript no console:

```javascript
fetch('https://[SEU-PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/test-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'Dev_thales',
    password: 'dev123'
  })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

**Resposta esperada (SUCESSO):**
```json
{
  "username": "Dev_thales",
  "userExists": true,
  "passwordHashStored": "9b871512327c09ce98...",
  "passwordHashInput": "9b871512327c09ce98...",
  "match": true,
  "message": "✅ Senha correta!"
}
```

**Resposta se FALHAR:**
```json
{
  "username": "Dev_thales",
  "userExists": true,
  "passwordHashStored": "abc123...",
  "passwordHashInput": "xyz789...",
  "match": false,
  "message": "❌ Senha incorreta!"
}
```

Se `match: false`, significa que o hash está diferente. Isso pode acontecer se:
1. A senha foi criada com um algoritmo diferente
2. Houve algum erro na criação

**SOLUÇÃO:** Execute o **Passo 2** novamente para resetar.

---

## 🛠️ COMANDOS ÚTEIS

### 1. Ver todos os usuários
```javascript
fetch('https://[PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/users')
  .then(r => r.json())
  .then(data => console.log(data));
```

### 2. Resetar usuários
```javascript
fetch('https://[PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/reset-users', {
  method: 'POST'
})
  .then(r => r.json())
  .then(data => console.log(data));
```

### 3. Testar senha de Dev
```javascript
fetch('https://[PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/test-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'Dev_thales', password: 'dev123' })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

### 4. Testar senha de Gestão
```javascript
fetch('https://[PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/test-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'Gestao_thales', password: 'gestao123' })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

### 5. Testar senha de Consultor
```javascript
fetch('https://[PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/test-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'Consultor_thales', password: 'consultor123' })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

### 6. Testar senha de Mecânico
```javascript
fetch('https://[PROJECT-ID].supabase.co/functions/v1/make-server-0092e077/debug/test-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'Mecanico_thales', password: 'mecanico123' })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 📋 CHECKLIST DE DEBUG

1. [ ] Acessei `/debug/users` e vi totalUsers
2. [ ] Se totalUsers = 0, executei `/debug/reset-users`
3. [ ] Confirmei que totalUsers agora = 4
4. [ ] Testei senha com `/debug/test-password`
5. [ ] Vi `match: true` para cada usuário
6. [ ] Tentei fazer login novamente

---

## 🎯 SOLUÇÃO RÁPIDA

**Cole isso no console e execute:**

```javascript
async function debugSenhas() {
  const PROJECT_ID = '[SEU-PROJECT-ID]'; // PREENCHA AQUI!
  const BASE = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-0092e077`;
  
  console.log('🔍 1. Verificando usuários...');
  let users = await fetch(`${BASE}/debug/users`).then(r => r.json());
  console.log('Usuários encontrados:', users.totalUsers);
  
  if (users.totalUsers === 0) {
    console.log('🔄 2. Nenhum usuário! Resetando...');
    const reset = await fetch(`${BASE}/debug/reset-users`, { method: 'POST' }).then(r => r.json());
    console.log('✅ Reset:', reset.message);
    
    users = await fetch(`${BASE}/debug/users`).then(r => r.json());
    console.log('Usuários após reset:', users.totalUsers);
  }
  
  console.log('🧪 3. Testando senhas...');
  const tests = [
    { username: 'Dev_thales', password: 'dev123' },
    { username: 'Gestao_thales', password: 'gestao123' },
    { username: 'Consultor_thales', password: 'consultor123' },
    { username: 'Mecanico_thales', password: 'mecanico123' }
  ];
  
  for (const test of tests) {
    const result = await fetch(`${BASE}/debug/test-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test)
    }).then(r => r.json());
    
    console.log(`${test.username}: ${result.message}`);
  }
  
  console.log('✅ Debug completo! Tente fazer login agora.');
}

// EXECUTAR
debugSenhas();
```

**IMPORTANTE:** Substitua `[SEU-PROJECT-ID]` pelo ID real do seu projeto!

---

## 📞 SUPORTE

Se mesmo depois disso as senhas não funcionarem, me envie:

1. O resultado de `/debug/users`
2. O resultado de `/debug/test-password` para cada usuário
3. O erro que aparece no console ao tentar fazer login

---

**Última Atualização:** 14/03/2026  
**Status:** 🔧 FERRAMENTAS DE DEBUG CRIADAS

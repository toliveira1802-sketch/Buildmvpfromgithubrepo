# ⚡ TESTE RÁPIDO - SENHAS

## 🚀 EXECUTAR AGORA

**Cole isso no console do navegador (F12):**

```javascript
async function testarSistema() {
  // SUBSTITUA AQUI com seu PROJECT_ID real!
  const PROJECT_ID = 'acuufrgoyjwzlyhopaus';
  const BASE = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-0092e077`;
  
  console.log('═══════════════════════════════════════');
  console.log('🔍 TESTE COMPLETO DO SISTEMA');
  console.log('═══════════════════════════════════════\n');
  
  // PASSO 1: Verificar usuários
  console.log('📋 PASSO 1: Verificando usuários...');
  try {
    const usersResp = await fetch(`${BASE}/debug/users`);
    const users = await usersResp.json();
    console.log(`✅ Total de usuários: ${users.totalUsers}`);
    console.log(`✅ Inicializado: ${users.initialized}`);
    
    if (users.totalUsers > 0) {
      console.log('\n📝 Usuários encontrados:');
      users.users.forEach(u => {
        console.log(`   - ${u.username} (${u.role}) - Hash: ${u.passwordHash}`);
      });
    } else {
      console.log('⚠️  Nenhum usuário encontrado!');
    }
    
    // Se não há usuários, resetar
    if (users.totalUsers === 0) {
      console.log('\n🔄 PASSO 2: Criando usuários...');
      const resetResp = await fetch(`${BASE}/debug/reset-users`, { method: 'POST' });
      const reset = await resetResp.json();
      console.log(`✅ ${reset.message}`);
      console.log('\n📝 Usuários criados:');
      reset.users.forEach(u => {
        console.log(`   - ${u.username} (${u.role})`);
      });
    } else {
      console.log('\n✅ PASSO 2: Usuários já existem, pulando criação.');
    }
    
    // PASSO 3: Testar senhas
    console.log('\n🧪 PASSO 3: Testando senhas...');
    const tests = [
      { username: 'Dev_thales', password: 'dev123' },
      { username: 'Gestao_thales', password: 'gestao123' },
      { username: 'Consultor_thales', password: 'consultor123' },
      { username: 'Mecanico_thales', password: 'mecanico123' }
    ];
    
    let allPassed = true;
    for (const test of tests) {
      const testResp = await fetch(`${BASE}/debug/test-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      });
      const result = await testResp.json();
      
      const icon = result.match ? '✅' : '❌';
      console.log(`${icon} ${test.username}: ${result.message}`);
      
      if (!result.match) {
        allPassed = false;
        console.log(`   Stored: ${result.passwordHashStored}`);
        console.log(`   Input:  ${result.passwordHashInput}`);
      }
    }
    
    console.log('\n═══════════════════════════════════════');
    if (allPassed) {
      console.log('✅ TUDO OK! Pode fazer login agora!');
      console.log('\n📋 CREDENCIAIS:');
      console.log('   Dev_thales / dev123');
      console.log('   Gestao_thales / gestao123');
      console.log('   Consultor_thales / consultor123');
      console.log('   Mecanico_thales / mecanico123');
    } else {
      console.log('❌ ERRO! Algumas senhas não batem.');
      console.log('💡 Execute: await fetch("' + BASE + '/debug/reset-users", { method: "POST" })');
    }
    console.log('═══════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ ERRO:', error);
    console.log('\n💡 Verifique se o PROJECT_ID está correto!');
  }
}

// EXECUTAR
testarSistema();
```

---

## 📝 IMPORTANTE

**ANTES DE EXECUTAR:**
1. Substitua `acuufrgoyjwzlyhopaus` pelo seu PROJECT_ID real
2. Abra o Console (F12)
3. Cole o código
4. Aperte Enter

---

## ✅ RESULTADO ESPERADO

```
═══════════════════════════════════════
🔍 TESTE COMPLETO DO SISTEMA
═══════════════════════════════════════

📋 PASSO 1: Verificando usuários...
✅ Total de usuários: 4
✅ Inicializado: true

📝 Usuários encontrados:
   - Dev_thales (dev) - Hash: 9b871512327c09ce98...
   - Gestao_thales (gestao) - Hash: a665a45920422f9d41...
   - Consultor_thales (consultor) - Hash: 8d969eef6ecad3c29a...
   - Mecanico_thales (mecanico) - Hash: 5994471abb01112afc...

✅ PASSO 2: Usuários já existem, pulando criação.

🧪 PASSO 3: Testando senhas...
✅ Dev_thales: ✅ Senha correta!
✅ Gestao_thales: ✅ Senha correta!
✅ Consultor_thales: ✅ Senha correta!
✅ Mecanico_thales: ✅ Senha correta!

═══════════════════════════════════════
✅ TUDO OK! Pode fazer login agora!

📋 CREDENCIAIS:
   Dev_thales / dev123
   Gestao_thales / gestao123
   Consultor_thales / consultor123
   Mecanico_thales / mecanico123
═══════════════════════════════════════
```

---

## 🆘 SE DER ERRO

### Erro: "Failed to fetch"
**Causa:** PROJECT_ID errado ou backend offline  
**Solução:** Verifique o PROJECT_ID no Supabase dashboard

### Erro: "Total de usuários: 0"
**Causa:** Banco vazio  
**Solução:** O script automaticamente criará os usuários

### Erro: "❌ Senha incorreta!"
**Causa:** Hash diferente  
**Solução:** Execute reset manual:

```javascript
await fetch('https://SEU-PROJECT-ID.supabase.co/functions/v1/make-server-0092e077/debug/reset-users', {
  method: 'POST'
}).then(r => r.json()).then(console.log);
```

---

**ÚLTIMA ATUALIZAÇÃO:** 14/03/2026  
**STATUS:** 🟢 PRONTO PARA TESTE

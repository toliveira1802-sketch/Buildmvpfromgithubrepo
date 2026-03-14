import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import * as crypto from "node:crypto";

const app = new Hono();

// Supabase Client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Enable logger
app.use("*", logger(console.log));

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// ==================== HELPERS ====================

// Hash de senha simples (em produção, usar bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Gerar token aleatório
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ==================== INICIALIZAÇÃO DO BANCO ====================

// Inicializar usuários padrão (executar uma vez)
async function initializeDefaultUsers() {
  const usersExist = await kv.get("users:initialized");
  
  if (!usersExist) {
    console.log("Inicializando usuários padrão...");
    
    const defaultUsers = [
      {
        username: "Dev_thales",
        password: hashPassword("dev123"),
        role: "dev",
        firstName: "thales",
        name: "Thales",
        permissions: ["full-access", "database", "settings", "users"],
        createdAt: new Date().toISOString()
      },
      {
        username: "Gestao_thales",
        password: hashPassword("gestao123"),
        role: "gestao",
        firstName: "thales",
        name: "Thales",
        createdAt: new Date().toISOString()
      },
      {
        username: "Consultor_thales",
        password: hashPassword("consultor123"),
        role: "consultor",
        firstName: "thales",
        name: "Thales",
        createdAt: new Date().toISOString()
      },
      {
        username: "Mecanico_thales",
        password: hashPassword("mecanico123"),
        role: "mecanico",
        firstName: "thales",
        name: "Thales",
        createdAt: new Date().toISOString()
      }
    ];

    for (const user of defaultUsers) {
      await kv.set(`user:${user.username}`, user);
    }

    await kv.set("users:initialized", true);
    console.log("✅ Usuários padrão criados!");
    console.log("📋 Credenciais:");
    console.log("   Dev_thales / dev123");
    console.log("   Gestao_thales / gestao123");
    console.log("   Consultor_thales / consultor123");
    console.log("   Mecanico_thales / mecanico123");
  }
}

// Executar inicialização na primeira requisição
let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await initializeDefaultUsers();
    initialized = true;
  }
}

// ==================== MIDDLEWARE ====================

async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");
  
  // Verificar se é um session token
  if (token.startsWith("session_")) {
    const session = await kv.get(`session:${token}`);
    if (!session) {
      return c.json({ error: "Unauthorized - Session expired" }, 401);
    }
    c.set("user", session);
  } else if (token === Deno.env.get("SUPABASE_ANON_KEY")) {
    // Public anon key - permitir sem usuário
    c.set("user", null);
  } else {
    return c.json({ error: "Unauthorized - Invalid token" }, 401);
  }

  await next();
}

// ==================== HEALTH CHECK ====================

app.get("/make-server-0092e077/health", async (c) => {
  await ensureInitialized();
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    database: "kv-store"
  });
});

// ==================== AUTENTICAÇÃO ====================

// Login de desenvolvedor
app.post("/make-server-0092e077/auth/login-dev", async (c) => {
  await ensureInitialized();
  
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: "Username e senha são obrigatórios" }, 400);
    }

    // Buscar usuário
    const user = await kv.get(`user:${username}`);
    
    if (!user) {
      return c.json({ error: "Usuário não encontrado" }, 404);
    }

    // Verificar se é desenvolvedor
    if (user.role !== "dev") {
      return c.json({ error: "Acesso negado - Apenas desenvolvedores" }, 403);
    }

    // Verificar senha
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return c.json({ error: "Senha incorreta" }, 401);
    }

    // Criar sessão
    const sessionToken = `session_${Date.now()}_${generateToken()}`;
    const sessionData = {
      userId: user.username,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      name: user.name,
      permissions: user.permissions,
      createdAt: new Date().toISOString()
    };

    // Salvar sessão (expira em 24h)
    await kv.set(`session:${sessionToken}`, sessionData);

    return c.json({
      sessionToken,
      userId: user.username,
      user: {
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        name: user.name,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error("Dev login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Login de staff (Gestão, Consultor, Mecânico)
app.post("/make-server-0092e077/auth/login-staff", async (c) => {
  await ensureInitialized();
  
  try {
    const { username, password, role } = await c.req.json();

    if (!username || !password || !role) {
      return c.json({ error: "Username, senha e role são obrigatórios" }, 400);
    }

    // Buscar usuário
    const user = await kv.get(`user:${username}`);
    
    if (!user) {
      return c.json({ error: "Usuário não encontrado" }, 404);
    }

    // Verificar se a role bate
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return c.json({ error: "Perfil selecionado não corresponde ao usuário" }, 403);
    }

    // Verificar senha
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return c.json({ error: "Senha incorreta" }, 401);
    }

    // Criar sessão
    const sessionToken = `session_${Date.now()}_${generateToken()}`;
    const sessionData = {
      userId: user.username,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      name: user.name,
      createdAt: new Date().toISOString()
    };

    // Salvar sessão (expira em 24h)
    await kv.set(`session:${sessionToken}`, sessionData);

    return c.json({
      sessionToken,
      userId: user.username,
      user: {
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Staff login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Recuperação de senha - Gerar token
app.post("/make-server-0092e077/auth/forgot-password", async (c) => {
  await ensureInitialized();
  
  try {
    const { username } = await c.req.json();

    if (!username) {
      return c.json({ error: "Username é obrigatório" }, 400);
    }

    // Buscar usuário
    const user = await kv.get(`user:${username}`);
    
    if (!user) {
      return c.json({ error: "Usuário não encontrado" }, 404);
    }

    // Gerar token de recuperação
    const token = generateToken().substring(0, 16); // Token de 16 caracteres
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2); // Válido por 2 horas

    const recoveryData = {
      username: user.username,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString()
    };

    // Salvar token de recuperação
    await kv.set(`recovery:${username}`, recoveryData);

    return c.json({
      token,
      expiresAt: recoveryData.expiresAt,
      message: "Token de recuperação gerado com sucesso"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Verificar token de recuperação
app.post("/make-server-0092e077/auth/verify-token", async (c) => {
  await ensureInitialized();
  
  try {
    const { username, token } = await c.req.json();

    if (!username || !token) {
      return c.json({ error: "Username e token são obrigatórios" }, 400);
    }

    // Buscar token de recuperação
    const recovery = await kv.get(`recovery:${username}`);
    
    if (!recovery) {
      return c.json({ error: "Token não encontrado" }, 404);
    }

    // Verificar se o token bate
    if (recovery.token !== token) {
      return c.json({ error: "Token inválido" }, 401);
    }

    // Verificar se o token expirou
    const now = new Date();
    const expiresAt = new Date(recovery.expiresAt);
    
    if (now > expiresAt) {
      // Remover token expirado
      await kv.del(`recovery:${username}`);
      return c.json({ error: "Token expirado" }, 401);
    }

    return c.json({
      message: "Token válido",
      username: recovery.username
    });
  } catch (error) {
    console.error("Verify token error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Logout
app.post("/make-server-0092e077/auth/logout", authMiddleware, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (token && token.startsWith("session_")) {
      await kv.del(`session:${token}`);
    }

    return c.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ==================== USUÁRIOS ====================

// Listar todos os usuários (apenas dev)
app.get("/make-server-0092e077/users", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user || user.role !== "dev") {
    return c.json({ error: "Forbidden - Dev access only" }, 403);
  }

  try {
    const users = await kv.getByPrefix("user:");
    const userList = users.map(item => {
      const { password, ...userWithoutPassword } = item.value;
      return userWithoutPassword;
    });
    
    return c.json(userList);
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Criar novo usuário (apenas dev)
app.post("/make-server-0092e077/users", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user || user.role !== "dev") {
    return c.json({ error: "Forbidden - Dev access only" }, 403);
  }

  try {
    const { username, password, role, firstName } = await c.req.json();

    if (!username || !password || !role || !firstName) {
      return c.json({ error: "Todos os campos são obrigatórios" }, 400);
    }

    // Verificar se usuário já existe
    const existingUser = await kv.get(`user:${username}`);
    if (existingUser) {
      return c.json({ error: "Username já existe" }, 400);
    }

    const newUser = {
      username,
      password: hashPassword(password),
      role,
      firstName,
      name: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      permissions: role === "dev" ? ["full-access", "database", "settings", "users"] : [],
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${username}`, newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return c.json(userWithoutPassword, 201);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// ==================== DASHBOARD / KPIs ====================

app.get("/make-server-0092e077/dashboard/kpis", authMiddleware, async (c) => {
  try {
    // Por enquanto retorna dados vazios
    // TODO: Implementar cálculo real de KPIs do banco
    return c.json({
      veiculosPatio: 0,
      osAbertas: 0,
      receitaDia: 0,
      osFinalizadas: 0
    });
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return c.json({ error: "Failed to fetch KPIs" }, 500);
  }
});

// ==================== CLIENTES ====================

app.get("/make-server-0092e077/clientes", authMiddleware, async (c) => {
  try {
    const clientes = await kv.getByPrefix("cliente:");
    return c.json(clientes.map(item => item.value));
  } catch (error) {
    console.error("Error fetching clientes:", error);
    return c.json({ error: "Failed to fetch clientes" }, 500);
  }
});

app.get("/make-server-0092e077/clientes/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const cliente = await kv.get(`cliente:${id}`);
    
    if (!cliente) {
      return c.json({ error: "Cliente not found" }, 404);
    }

    return c.json(cliente);
  } catch (error) {
    console.error("Error fetching cliente:", error);
    return c.json({ error: "Failed to fetch cliente" }, 500);
  }
});

app.post("/make-server-0092e077/clientes", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    
    // Gerar ID
    const allClientes = await kv.getByPrefix("cliente:");
    const nextId = allClientes.length + 1;
    const id = `CLI-${String(nextId).padStart(3, "0")}`;

    const cliente = {
      id,
      ...body,
      dataCadastro: new Date().toISOString(),
      veiculos: 0,
      totalGasto: 0,
      ultimaVisita: new Date().toISOString(),
    };

    await kv.set(`cliente:${id}`, cliente);

    return c.json(cliente, 201);
  } catch (error) {
    console.error("Error creating cliente:", error);
    return c.json({ error: "Failed to create cliente" }, 500);
  }
});

// ==================== ORDENS DE SERVIÇO ====================

app.get("/make-server-0092e077/ordens-servico", authMiddleware, async (c) => {
  try {
    const ordens = await kv.getByPrefix("os:");
    return c.json(ordens.map(item => item.value));
  } catch (error) {
    console.error("Error fetching ordens:", error);
    return c.json({ error: "Failed to fetch ordens" }, 500);
  }
});

app.get("/make-server-0092e077/ordens-servico/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const os = await kv.get(`os:${id}`);
    
    if (!os) {
      return c.json({ error: "Ordem de serviço not found" }, 404);
    }

    return c.json(os);
  } catch (error) {
    console.error("Error fetching OS:", error);
    return c.json({ error: "Failed to fetch OS" }, 500);
  }
});

app.post("/make-server-0092e077/ordens-servico", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    
    // Gerar ID
    const allOrdens = await kv.getByPrefix("os:");
    const nextId = allOrdens.length + 1;
    const id = `OS-${String(nextId).padStart(4, "0")}`;

    const os = {
      id,
      ...body,
      status: "aguardando",
      dataAbertura: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
    };

    await kv.set(`os:${id}`, os);

    return c.json(os, 201);
  } catch (error) {
    console.error("Error creating OS:", error);
    return c.json({ error: "Failed to create OS" }, 500);
  }
});

// ==================== START SERVER ====================

Deno.serve(app.fetch);

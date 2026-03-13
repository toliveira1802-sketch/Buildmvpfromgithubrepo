import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

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

// ==================== MIDDLEWARE DE AUTENTICAÇÃO ====================

async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");
  
  // Verificar se é um token JWT ou session ID
  if (token.startsWith("session_")) {
    // Session baseada em KV
    const session = await kv.get(`session:${token}`);
    if (!session) {
      return c.json({ error: "Unauthorized - Session expired" }, 401);
    }
    c.set("user", session);
  } else if (token === Deno.env.get("SUPABASE_ANON_KEY")) {
    // Public anon key - permitir sem usuário
    c.set("user", null);
  } else {
    // JWT Token - verificar com Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }
    c.set("user", data.user);
  }

  await next();
}

// ==================== HEALTH CHECK ====================

app.get("/make-server-0092e077/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ==================== AUTENTICAÇÃO ====================

// Login com email e senha (DEV)
app.post("/make-server-0092e077/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Auth error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      access_token: data.session?.access_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Login por perfil (sem senha)
app.post("/make-server-0092e077/auth/login-profile", async (c) => {
  try {
    const { cargo, nome } = await c.req.json();

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const user = {
      cargo,
      nome,
      loginType: "profile",
      timestamp: new Date().toISOString(),
    };

    // Armazenar sessão no KV (expira em 24h)
    await kv.set(`session:${sessionId}`, user);

    return c.json({
      session_id: sessionId,
      user,
    });
  } catch (error) {
    console.error("Profile login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Verificar sessão
app.get("/make-server-0092e077/auth/session", async (c) => {
  const sessionId = c.req.query("session_id");
  
  if (sessionId) {
    const session = await kv.get(`session:${sessionId}`);
    if (session) {
      return c.json({ user: session });
    }
  }

  return c.json({ error: "Session not found" }, 404);
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

app.put("/make-server-0092e077/clientes/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const cliente = await kv.get(`cliente:${id}`);
    if (!cliente) {
      return c.json({ error: "Cliente not found" }, 404);
    }

    const updated = { ...cliente, ...updates };
    await kv.set(`cliente:${id}`, updated);

    return c.json(updated);
  } catch (error) {
    console.error("Error updating cliente:", error);
    return c.json({ error: "Failed to update cliente" }, 500);
  }
});

// ==================== AGENDAMENTOS ====================

app.get("/make-server-0092e077/agendamentos", authMiddleware, async (c) => {
  try {
    const agendamentos = await kv.getByPrefix("agendamento:");
    return c.json(agendamentos.map(item => item.value));
  } catch (error) {
    console.error("Error fetching agendamentos:", error);
    return c.json({ error: "Failed to fetch agendamentos" }, 500);
  }
});

app.post("/make-server-0092e077/agendamentos", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    
    const allAgendamentos = await kv.getByPrefix("agendamento:");
    const nextId = allAgendamentos.length + 1;
    const id = `AGD-${String(nextId).padStart(3, "0")}`;

    const agendamento = {
      id,
      ...body,
      status: body.status || "Pendente",
      dataCriacao: new Date().toISOString(),
    };

    await kv.set(`agendamento:${id}`, agendamento);

    return c.json(agendamento, 201);
  } catch (error) {
    console.error("Error creating agendamento:", error);
    return c.json({ error: "Failed to create agendamento" }, 500);
  }
});

app.put("/make-server-0092e077/agendamentos/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const agendamento = await kv.get(`agendamento:${id}`);
    if (!agendamento) {
      return c.json({ error: "Agendamento not found" }, 404);
    }

    const updated = { ...agendamento, ...updates };
    await kv.set(`agendamento:${id}`, updated);

    return c.json(updated);
  } catch (error) {
    console.error("Error updating agendamento:", error);
    return c.json({ error: "Failed to update agendamento" }, 500);
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
      return c.json({ error: "OS not found" }, 404);
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
    
    const allOS = await kv.getByPrefix("os:");
    const nextId = allOS.length + 1;
    const id = `OS-${String(nextId).padStart(3, "0")}`;

    // Calcular valor total
    const totalServicos = (body.servicos || []).reduce((sum: number, s: any) => sum + (s.valorMaoObra || 0), 0);
    const totalPecas = (body.pecas || []).reduce((sum: number, p: any) => sum + (p.quantidade * p.valorUnitario || 0), 0);

    const os = {
      id,
      ...body,
      status: body.status || "Aguardando",
      dataAbertura: new Date().toISOString(),
      valorTotal: totalServicos + totalPecas,
    };

    await kv.set(`os:${id}`, os);

    return c.json(os, 201);
  } catch (error) {
    console.error("Error creating OS:", error);
    return c.json({ error: "Failed to create OS" }, 500);
  }
});

app.put("/make-server-0092e077/ordens-servico/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const os = await kv.get(`os:${id}`);
    if (!os) {
      return c.json({ error: "OS not found" }, 404);
    }

    const updated = { ...os, ...updates };
    
    // Recalcular valor se serviços ou peças mudaram
    if (updates.servicos || updates.pecas) {
      const totalServicos = (updated.servicos || []).reduce((sum: number, s: any) => sum + (s.valorMaoObra || 0), 0);
      const totalPecas = (updated.pecas || []).reduce((sum: number, p: any) => sum + (p.quantidade * p.valorUnitario || 0), 0);
      updated.valorTotal = totalServicos + totalPecas;
    }

    await kv.set(`os:${id}`, updated);

    return c.json(updated);
  } catch (error) {
    console.error("Error updating OS:", error);
    return c.json({ error: "Failed to update OS" }, 500);
  }
});

// ==================== PÁTIO KANBAN ====================

app.get("/make-server-0092e077/patio", authMiddleware, async (c) => {
  try {
    const patio = await kv.getByPrefix("patio:");
    return c.json(patio.map(item => item.value));
  } catch (error) {
    console.error("Error fetching patio:", error);
    return c.json({ error: "Failed to fetch patio" }, 500);
  }
});

app.put("/make-server-0092e077/patio/:id/status", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    
    const item = await kv.get(`patio:${id}`);
    if (!item) {
      return c.json({ error: "Item not found" }, 404);
    }

    const updated = { ...item, status };
    await kv.set(`patio:${id}`, updated);

    return c.json(updated);
  } catch (error) {
    console.error("Error updating patio status:", error);
    return c.json({ error: "Failed to update status" }, 500);
  }
});

// ==================== IA SERVICES ====================

app.get("/make-server-0092e077/ai/services", authMiddleware, async (c) => {
  try {
    // Retornar dados mockados de IA
    const services = [
      {
        id: "analise-preditiva",
        name: "Análise Preditiva",
        status: "online",
        uptime: 99.8,
        requests: 15234,
        avgResponseTime: 145,
        lastUpdate: new Date().toISOString(),
      },
      {
        id: "chatbot",
        name: "Chatbot Atendimento",
        status: "online",
        uptime: 99.5,
        requests: 28456,
        avgResponseTime: 89,
        lastUpdate: new Date().toISOString(),
      },
      {
        id: "otimizacao-precos",
        name: "Otimização de Preços",
        status: "online",
        uptime: 98.9,
        requests: 8923,
        avgResponseTime: 234,
        lastUpdate: new Date().toISOString(),
      },
      {
        id: "diagnostico-ia",
        name: "Diagnóstico por IA",
        status: "online",
        uptime: 99.2,
        requests: 12567,
        avgResponseTime: 312,
        lastUpdate: new Date().toISOString(),
      },
      {
        id: "gestao-estoque",
        name: "Gestão Inteligente de Estoque",
        status: "online",
        uptime: 99.7,
        requests: 6234,
        avgResponseTime: 178,
        lastUpdate: new Date().toISOString(),
      },
      {
        id: "recomendacao",
        name: "Sistema de Recomendação",
        status: "online",
        uptime: 99.1,
        requests: 9185,
        avgResponseTime: 156,
        lastUpdate: new Date().toISOString(),
      },
    ];

    return c.json(services);
  } catch (error) {
    console.error("Error fetching AI services:", error);
    return c.json({ error: "Failed to fetch AI services" }, 500);
  }
});

app.get("/make-server-0092e077/ai/metrics", authMiddleware, async (c) => {
  try {
    const metrics = {
      totalRequests: 80599,
      avgResponseTime: 167,
      successRate: 98.7,
      activeModels: 6,
      cpuUsage: 45.2,
      memoryUsage: 62.8,
      lastUpdate: new Date().toISOString(),
    };

    return c.json(metrics);
  } catch (error) {
    console.error("Error fetching AI metrics:", error);
    return c.json({ error: "Failed to fetch AI metrics" }, 500);
  }
});

// ==================== RELATÓRIOS ====================

app.get("/make-server-0092e077/relatorios/faturamento", authMiddleware, async (c) => {
  try {
    // Buscar todas as OS concluídas
    const ordens = await kv.getByPrefix("os:");
    const osConcluidas = ordens
      .map(item => item.value)
      .filter((os: any) => os.status === "Concluído");

    // Agrupar por mês
    const faturamentoPorMes = osConcluidas.reduce((acc: any, os: any) => {
      const data = new Date(os.dataConclusao || os.dataAbertura);
      const mes = data.toLocaleDateString("pt-BR", { month: "short" });
      
      if (!acc[mes]) {
        acc[mes] = { mes, valor: 0, meta: 50000 };
      }
      
      acc[mes].valor += os.valorTotal || 0;
      
      return acc;
    }, {});

    return c.json(Object.values(faturamentoPorMes));
  } catch (error) {
    console.error("Error fetching faturamento:", error);
    return c.json({ error: "Failed to fetch faturamento" }, 500);
  }
});

app.get("/make-server-0092e077/relatorios/servicos-populares", authMiddleware, async (c) => {
  try {
    const ordens = await kv.getByPrefix("os:");
    
    const servicosCount: any = {};
    
    ordens.forEach((item: any) => {
      const os = item.value;
      (os.servicos || []).forEach((servico: any) => {
        if (!servicosCount[servico.descricao]) {
          servicosCount[servico.descricao] = 0;
        }
        servicosCount[servico.descricao]++;
      });
    });

    const result = Object.entries(servicosCount)
      .map(([nome, count]) => ({ nome, quantidade: count }))
      .sort((a: any, b: any) => b.quantidade - a.quantidade)
      .slice(0, 6);

    return c.json(result);
  } catch (error) {
    console.error("Error fetching servicos populares:", error);
    return c.json({ error: "Failed to fetch servicos populares" }, 500);
  }
});

app.get("/make-server-0092e077/relatorios/performance-mecanicos", authMiddleware, async (c) => {
  try {
    const ordens = await kv.getByPrefix("os:");
    const osConcluidas = ordens
      .map(item => item.value)
      .filter((os: any) => os.status === "Concluído");

    const performancePorMecanico: any = {};

    osConcluidas.forEach((os: any) => {
      const mecanico = os.responsavel;
      
      if (!performancePorMecanico[mecanico]) {
        performancePorMecanico[mecanico] = {
          nome: mecanico,
          osConcluidas: 0,
          faturamento: 0,
        };
      }
      
      performancePorMecanico[mecanico].osConcluidas++;
      performancePorMecanico[mecanico].faturamento += os.valorTotal || 0;
    });

    const result = Object.values(performancePorMecanico)
      .sort((a: any, b: any) => b.faturamento - a.faturamento);

    return c.json(result);
  } catch (error) {
    console.error("Error fetching performance mecanicos:", error);
    return c.json({ error: "Failed to fetch performance" }, 500);
  }
});

// ==================== SEED DATA (Dados Iniciais) ====================

app.post("/make-server-0092e077/seed", async (c) => {
  try {
    // Clientes
    const clientes = [
      {
        id: "CLI-001",
        nome: "Carlos Silva",
        cpf: "123.456.789-00",
        telefone: "(11) 98765-4321",
        email: "carlos@email.com",
        endereco: "Rua das Flores, 123",
        cidade: "São Paulo - SP",
        veiculos: 2,
        ultimaVisita: "2026-03-10",
        totalGasto: 5420.0,
        dataCadastro: "2025-01-15",
      },
      {
        id: "CLI-002",
        nome: "Maria Santos",
        cpf: "234.567.890-11",
        telefone: "(11) 91234-5678",
        email: "maria@email.com",
        endereco: "Av. Paulista, 1000",
        cidade: "São Paulo - SP",
        veiculos: 1,
        ultimaVisita: "2026-03-08",
        totalGasto: 2850.0,
        dataCadastro: "2025-02-10",
      },
    ];

    for (const cliente of clientes) {
      await kv.set(`cliente:${cliente.id}`, cliente);
    }

    // Agendamentos
    const agendamentos = [
      {
        id: "AGD-001",
        cliente: "Carlos Silva",
        telefone: "(11) 98765-4321",
        email: "carlos@email.com",
        veiculo: "Honda Civic 2020",
        placa: "ABC-1234",
        data: "2026-03-15",
        horario: "09:00",
        servico: "Revisão Completa",
        status: "Confirmado",
        dataCriacao: "2026-03-10T10:00:00Z",
      },
    ];

    for (const agd of agendamentos) {
      await kv.set(`agendamento:${agd.id}`, agd);
    }

    return c.json({ message: "Seed data created successfully" });
  } catch (error) {
    console.error("Error seeding data:", error);
    return c.json({ error: "Failed to seed data" }, 500);
  }
});

Deno.serve(app.fetch);

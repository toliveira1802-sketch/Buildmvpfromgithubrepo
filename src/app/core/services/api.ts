import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0092e077`;

// Helper para fazer requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const sessionId = localStorage.getItem('dap-session-id');
  const token = localStorage.getItem('dap-token');

  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (sessionId) {
    // Para login por perfil, não usa Bearer token
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== AUTENTICAÇÃO ====================

export const authAPI = {
  // Login com email e senha (DEV)
  async loginWithPassword(email: string, password: string) {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.access_token) {
      localStorage.setItem('dap-token', data.access_token);
    }
    
    return data;
  },

  // Login por perfil
  async loginWithProfile(cargo: string, nome: string) {
    const data = await fetchAPI('/auth/login-profile', {
      method: 'POST',
      body: JSON.stringify({ cargo, nome }),
    });
    
    if (data.session_id) {
      localStorage.setItem('dap-session-id', data.session_id);
      localStorage.setItem('dap-user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Verificar sessão
  async checkSession() {
    const sessionId = localStorage.getItem('dap-session-id');
    const endpoint = sessionId ? `/auth/session?session_id=${sessionId}` : '/auth/session';
    return fetchAPI(endpoint);
  },

  // Logout
  logout() {
    localStorage.removeItem('dap-token');
    localStorage.removeItem('dap-session-id');
    localStorage.removeItem('dap-user');
  },
};

// ==================== CLIENTES ====================

export const clientesAPI = {
  async getAll() {
    return fetchAPI('/clientes');
  },

  async getById(id: string) {
    return fetchAPI(`/clientes/${id}`);
  },

  async create(cliente: any) {
    return fetchAPI('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  },

  async update(id: string, updates: any) {
    return fetchAPI(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ==================== AGENDAMENTOS ====================

export const agendamentosAPI = {
  async getAll() {
    return fetchAPI('/agendamentos');
  },

  async create(agendamento: any) {
    return fetchAPI('/agendamentos', {
      method: 'POST',
      body: JSON.stringify(agendamento),
    });
  },

  async update(id: string, updates: any) {
    return fetchAPI(`/agendamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ==================== ORDENS DE SERVIÇO ====================

export const ordensServicoAPI = {
  async getAll() {
    return fetchAPI('/ordens-servico');
  },

  async getById(id: string) {
    return fetchAPI(`/ordens-servico/${id}`);
  },

  async create(os: any) {
    return fetchAPI('/ordens-servico', {
      method: 'POST',
      body: JSON.stringify(os),
    });
  },

  async update(id: string, updates: any) {
    return fetchAPI(`/ordens-servico/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ==================== PÁTIO KANBAN ====================

export const patioAPI = {
  async getAll() {
    return fetchAPI('/patio');
  },

  async updateStatus(id: string, status: string) {
    return fetchAPI(`/patio/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== IA SERVICES ====================

export const aiAPI = {
  async getServices() {
    return fetchAPI('/ai/services');
  },

  async getMetrics() {
    return fetchAPI('/ai/metrics');
  },
};

// ==================== RELATÓRIOS ====================

export const relatoriosAPI = {
  async getFaturamento() {
    return fetchAPI('/relatorios/faturamento');
  },

  async getServicosPopulares() {
    return fetchAPI('/relatorios/servicos-populares');
  },

  async getPerformanceMecanicos() {
    return fetchAPI('/relatorios/performance-mecanicos');
  },
};

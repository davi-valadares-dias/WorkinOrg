const API_URL = 'http://localhost:3000/api';

export const api = {
  // AUTH
  async loginAdmin(email, senha) {
    const response = await fetch(`${API_URL}/auth/login-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    return response.json();
  },

  async loginUsuario(email, senha) {
    const response = await fetch(`${API_URL}/auth/login-usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    return response.json();
  },

  async logout(token) {
    return fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async verificarSessao(token) {
    const response = await fetch(`${API_URL}/auth/verificar-sessao`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  // ADMIN
  async listarUsuarios(token) {
    const response = await fetch(`${API_URL}/admin/usuarios`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  async criarUsuario(token, dados) {
    const response = await fetch(`${API_URL}/admin/usuarios/criar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });
    return response.json();
  },

  async atualizarUsuario(token, usuarioId, dados) {
    const response = await fetch(`${API_URL}/admin/usuarios/${usuarioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });
    return response.json();
  },

  async usuariosOnline(token) {
    const response = await fetch(`${API_URL}/admin/usuarios-online`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  async adicionarComentarioTreino(token, treinoId, texto) {
    const response = await fetch(`${API_URL}/admin/treinos/${treinoId}/comentarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ texto })
    });
    return response.json();
  },

  // TREINOS
  async criarTreino(token, dados) {
    const response = await fetch(`${API_URL}/treinos/criar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });
    return response.json();
  },

  async listarMeusTreinos(token) {
    const response = await fetch(`${API_URL}/treinos/meus-treinos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  async listarTreinosPublicos(token) {
    const response = await fetch(`${API_URL}/treinos/treinos-publicos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  async adicionarTreinoParaUsuario(token, treinoId) {
    const response = await fetch(`${API_URL}/treinos/${treinoId}/adicionar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  async registrarExecucaoTreino(token, treinoId, dados) {
    const response = await fetch(`${API_URL}/treinos/${treinoId}/executar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });
    return response.json();
  },

  async obterHistoricoUsuario(token, limite = 10, pagina = 1) {
    const response = await fetch(`${API_URL}/treinos/historico?limite=${limite}&pagina=${pagina}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};

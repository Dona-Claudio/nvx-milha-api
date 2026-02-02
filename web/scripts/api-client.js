/**
 * API Client
 * Gerencia todas as requisições HTTP para a API
 */

class ApiClient {
  constructor() {
    // Use the deployed API by default. When running the frontend locally,
    // the requests will be sent to this URL. Change if needed.
    this.baseURL = 'https://nvx-milha-api.onrender.com/api';
    this.timeout = 10000;
  }

  /**
   * Realiza uma requisição HTTP
   * @param {string} method - GET, POST, PUT, DELETE
   * @param {string} endpoint - endpoint da API
   * @param {object} data - dados para enviar
   * @returns {Promise} resposta da API
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('auth_token');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Requisição expirou')), this.timeout)
        ),
      ]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensagem || `Erro ${response.status}`);
      }

      // Para DELETE sem conteúdo
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ===== USUÁRIOS =====

  /**
   * Fazer login
   * @param {string} email
   * @param {string} senha
   * @returns {Promise<object>} { id, email, nomeUsuario, mensagem }
   */
  async login(email, senha) {
    return this.request('POST', '/usuarios/login', { email, senha });
  }

  /**
   * Criar novo usuário
   * @param {object} userData - { email, nomeUsuario, senha }
   * @returns {Promise<object>} { id, email, nomeUsuario }
   */
  async createUser(userData) {
    return this.request('POST', '/usuarios/salvar', userData);
  }

  /**
   * Deletar usuário
   * @param {number} id
   * @returns {Promise<object>} { mensagem }
   */
  async deleteUser(id) {
    return this.request('DELETE', `/usuarios/deletar/${id}`);
  }

  // ===== MILHAS =====

  /**
   * Listar todas as milhas
   * @returns {Promise<Array>} array de milhas
   */
  async listMilhas() {
    return this.request('GET', '/milhas');
  }

  /**
   * Buscar milha por ID
   * @param {number} id
   * @returns {Promise<object>} dados da milha
   */
  async getMilhaById(id) {
    return this.request('GET', `/milhas/${id}`);
  }

  /**
   * Buscar milhas por termo (nome, cliente ou IP)
   * @param {string} termo
   * @returns {Promise<Array>} array de milhas encontradas
   */
  async searchMilhas(termo) {
    if (!termo || termo.trim() === '') {
      return this.listMilhas();
    }
    return this.request('GET', `/milhas/buscar/${encodeURIComponent(termo)}`);
  }

  /**
   * Criar nova milha
   * @param {object} milhaData - { nomeMilha, cliente, ip }
   * @returns {Promise<object>} milha criada
   */
  async createMilha(milhaData) {
    return this.request('POST', '/milhas/salvar', milhaData);
  }

  /**
   * Atualizar milha
   * @param {number} id
   * @param {object} milhaData - { nomeMilha, cliente, ip }
   * @returns {Promise<object>} milha atualizada
   */
  async updateMilha(id, milhaData) {
    return this.request('PUT', `/milhas/atualizar/${id}`, milhaData);
  }

  /**
   * Deletar milha
   * @param {number} id
   * @returns {Promise<object>} { mensagem }
   */
  async deleteMilha(id) {
    return this.request('DELETE', `/milhas/deletar/${id}`);
  }
}

// Instância global
const apiClient = new ApiClient();

/**
 * Auth Service
 * Gerencia autenticação e sessão do usuário
 */

class AuthService {
  constructor() {
    this.currentUser = this.loadUserFromStorage();
  }

  /**
   * Fazer login
   * @param {string} email
   * @param {string} senha
   * @returns {Promise<object>} dados do usuário
   */
  async login(email, senha) {
    try {
      const response = await apiClient.login(email, senha);

      // Salvar dados do usuário
      this.currentUser = {
        id: response.id,
        email: response.email,
        nomeUsuario: response.nomeUsuario,
      };

      // Salvar no localStorage (simular token)
      localStorage.setItem('auth_token', btoa(`${email}:${senha}`));
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return this.currentUser;
    } catch (error) {
      throw new Error(`Falha no login: ${error.message}`);
    }
  }

  /**
   * Fazer logout
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    window.location.href = './login.html';
  }

  /**
   * Carregar usuário do localStorage
   * @returns {object|null}
   */
  loadUserFromStorage() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Verificar se usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.currentUser && !!localStorage.getItem('auth_token');
  }

  /**
   * Obter usuário atual
   * @returns {object|null}
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Verificar autenticação e redirecionar se necessário
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = './login.html';
    }
  }
}

// Instância global
const authService = new AuthService();

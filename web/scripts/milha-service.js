/**
 * Milha Service
 * Gerencia operações relacionadas a milhas
 */

class MilhaService {
  constructor() {
    this.milhas = [];
    this.filteredMilhas = [];
  }

  /**
   * Carregar todas as milhas
   * @returns {Promise<Array>}
   */
  async loadMilhas() {
    try {
      this.milhas = await apiClient.listMilhas();
      this.filteredMilhas = [...this.milhas];
      return this.milhas;
    } catch (error) {
      console.error('Erro ao carregar milhas:', error);
      throw error;
    }
  }

  /**
   * Buscar milhas por termo
   * @param {string} termo
   * @returns {Promise<Array>}
   */
  async searchMilhas(termo) {
    try {
      this.filteredMilhas = await apiClient.searchMilhas(termo);
      return this.filteredMilhas;
    } catch (error) {
      console.error('Erro ao buscar milhas:', error);
      throw error;
    }
  }

  /**
   * Criar nova milha
   * @param {object} milhaData - { nomeMilha, cliente, ip }
   * @returns {Promise<object>}
   */
  async createMilha(milhaData) {
    try {
      const novaMilha = await apiClient.createMilha(milhaData);
      this.milhas.push(novaMilha);
      this.filteredMilhas = [...this.milhas];
      return novaMilha;
    } catch (error) {
      console.error('Erro ao criar milha:', error);
      throw error;
    }
  }

  /**
   * Atualizar milha
   * @param {number} id
   * @param {object} milhaData - { nomeMilha, cliente, ip }
   * @returns {Promise<object>}
   */
  async updateMilha(id, milhaData) {
    try {
      const milhaAtualizada = await apiClient.updateMilha(id, milhaData);

      // Atualizar no array
      const index = this.milhas.findIndex((m) => m.id === id);
      if (index !== -1) {
        this.milhas[index] = milhaAtualizada;
        this.filteredMilhas = [...this.milhas];
      }

      return milhaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar milha:', error);
      throw error;
    }
  }

  /**
   * Deletar milha
   * @param {number} id
   * @returns {Promise<object>}
   */
  async deleteMilha(id) {
    try {
      const result = await apiClient.deleteMilha(id);

      // Remover do array
      this.milhas = this.milhas.filter((m) => m.id !== id);
      this.filteredMilhas = [...this.milhas];

      return result;
    } catch (error) {
      console.error('Erro ao deletar milha:', error);
      throw error;
    }
  }

  /**
   * Obter milha por ID
   * @param {number} id
   * @returns {object|null}
   */
  getMilhaById(id) {
    return this.milhas.find((m) => m.id === id) || null;
  }

  /**
   * Obter milhas filtradas
   * @returns {Array}
   */
  getFilteredMilhas() {
    return this.filteredMilhas;
  }

  /**
   * Validar dados da milha
   * @param {object} milhaData
   * @returns {object} { valid: boolean, errors: object }
   */
  validateMilha(milhaData) {
    const errors = {};

    if (!milhaData.nomeMilha || !milhaData.nomeMilha.trim()) {
      errors.nomeMilha = 'Nome da milha é obrigatório';
    }

    if (!milhaData.cliente || !milhaData.cliente.trim()) {
      errors.cliente = 'Cliente é obrigatório';
    }

    if (!milhaData.ip || !milhaData.ip.trim()) {
      errors.ip = 'IP é obrigatório';
    } else if (!this.isValidIP(milhaData.ip)) {
      errors.ip = 'IP inválido. Use formato: 192.168.1.1';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validar formato de IP
   * @param {string} ip
   * @returns {boolean}
   */
  isValidIP(ip) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every((part) => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  /**
   * Formatar data para exibição
   * @param {string} dateString
   * @returns {string}
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}

// Instância global
const milhaService = new MilhaService();

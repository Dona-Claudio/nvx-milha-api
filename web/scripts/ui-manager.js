/**
 * UI Manager
 * Gerencia elementos da interface do usuário
 */

class UIManager {
  /**
   * Mostrar alerta
   * @param {string} message
   * @param {string} type - 'success', 'error', 'info'
   * @param {number} duration - duração em ms (0 = permanente)
   */
  static showAlert(message, type = 'info', duration = 3000) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    alertContainer.appendChild(alertDiv);

    if (duration > 0) {
      setTimeout(() => {
        alertDiv.remove();
      }, duration);
    }

    return alertDiv;
  }

  /**
   * Limpar todos os alertas
   */
  static clearAlerts() {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
      alertContainer.innerHTML = '';
    }
  }

  /**
   * Mostrar modal
   * @param {string} modalId
   */
  static showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  /**
   * Fechar modal
   * @param {string} modalId
   */
  static hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  /**
   * Renderizar cards de milhas
   * @param {Array} milhas
   */
  static renderMilhas(milhas) {
    const container = document.getElementById('milhasContainer');
    if (!container) return;

    if (!milhas || milhas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📍</div>
          <p>Nenhuma milha encontrada. Crie uma nova milha para começar!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="milhas-grid">
        ${milhas
          .map(
            (milha) => `
          <div class="milha-card" data-id="${milha.id}">
            <div class="milha-card-header">
              <div class="milha-name">${this.escapeHTML(milha.nomeMilha)}</div>
            </div>
            <ul class="milha-details">
              <li>
                <strong>Cliente:</strong>
                <span>${this.escapeHTML(milha.cliente)}</span>
              </li>
              <li>
                <strong>IP:</strong>
                <span>${this.escapeHTML(milha.ip)}</span>
              </li>
              <li>
                <strong>Criado:</strong>
                <span>${milhaService.formatDate(milha.dataCriacao)}</span>
              </li>
              <li>
                <strong>Atualizado:</strong>
                <span>${milhaService.formatDate(milha.dataAtualizacao)}</span>
              </li>
            </ul>
            <div class="milha-card-footer">
              <button class="btn-small btn-edit" data-action="edit" data-id="${milha.id}">
                ✏️ Editar
              </button>
              <button class="btn-small btn-delete" data-action="delete" data-id="${milha.id}">
                🗑️ Deletar
              </button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  /**
   * Renderizar loading state
   */
  static renderLoading() {
    const container = document.getElementById('milhasContainer');
    if (container) {
      container.innerHTML = `
        <div class="loading-milhas">
          <div class="spinner"></div>
        </div>
      `;
    }
  }

  /**
   * Resetar formulário de milha
   */
  static resetMilhaForm() {
    const form = document.getElementById('milhaForm');
    if (form) {
      form.reset();
      this.clearFormErrors();
    }
  }

  /**
   * Limpar erros do formulário
   */
  static clearFormErrors() {
    const errorDivs = document.querySelectorAll('.form-error');
    errorDivs.forEach((div) => {
      div.textContent = '';
    });
  }

  /**
   * Mostrar erros de validação
   * @param {object} errors - { nomeMilha: 'erro', ... }
   */
  static showFormErrors(errors) {
    this.clearFormErrors();

    Object.keys(errors).forEach((field) => {
      const errorDiv = document.getElementById(`${field}Error`);
      if (errorDiv) {
        errorDiv.textContent = errors[field];
      }
    });
  }

  /**
   * Carregar dados da milha no formulário
   * @param {object} milha
   */
  static loadMilhaIntoForm(milha) {
    document.getElementById('nomeMilha').value = milha.nomeMilha || '';
    document.getElementById('cliente').value = milha.cliente || '';
    document.getElementById('ip').value = milha.ip || '';
  }

  /**
   * Obter dados do formulário
   * @returns {object}
   */
  static getMilhaFormData() {
    return {
      nomeMilha: document.getElementById('nomeMilha').value.trim(),
      cliente: document.getElementById('cliente').value.trim(),
      ip: document.getElementById('ip').value.trim(),
    };
  }

  /**
   * Atualizar email do usuário no header
   * @param {string} email
   */
  static updateUserEmail(email) {
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement) {
      userEmailElement.textContent = email;
    }
  }

  /**
   * Definir título do modal
   * @param {string} title
   */
  static setModalTitle(title) {
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = title;
    }
  }

  /**
   * Escaper HTML para prevenir XSS
   * @param {string} text
   * @returns {string}
   */
  static escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Definir loading no botão
   * @param {HTMLElement} button
   * @param {boolean} isLoading
   */
  static setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = '<span class="spinner"></span> Processando...';
    } else {
      button.disabled = false;
      button.innerHTML = 'Entrar';
    }
  }
}

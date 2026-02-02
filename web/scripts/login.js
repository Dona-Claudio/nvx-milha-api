/**
 * Login Page Script
 * Gerencia o fluxo de autenticação
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const loginBtn = document.getElementById('loginBtn');
  const generalError = document.getElementById('generalError');

  // Se já está autenticado, redirecionar para dashboard
  if (authService.isAuthenticated()) {
    window.location.href = './dashboard.html';
    return;
  }

  /**
   * Validar formulário
   * @returns {boolean}
   */
  function validateForm() {
    const emailError = document.getElementById('emailError');
    const senhaError = document.getElementById('senhaError');

    emailError.textContent = '';
    senhaError.textContent = '';
    generalError.classList.add('hidden');

    let isValid = true;

    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email é obrigatório';
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      emailError.textContent = 'Email inválido';
      isValid = false;
    }

    if (!senhaInput.value.trim()) {
      senhaError.textContent = 'Senha é obrigatória';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Validar formato de email
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Limpar inputs
   */
  function clearInputs() {
    emailInput.value = '';
    senhaInput.value = '';
  }

  /**
   * Mostrar erro geral
   * @param {string} message
   */
  function showError(message) {
    generalError.textContent = message;
    generalError.classList.remove('hidden');
  }

  /**
   * Esconder erro geral
   */
  function hideError() {
    generalError.classList.add('hidden');
  }

  /**
   * Submeter formulário
   */
  async function handleSubmit(event) {
    event.preventDefault();
    hideError();

    if (!validateForm()) {
      return;
    }

    try {
      UIManager.setButtonLoading(loginBtn, true);

      const email = emailInput.value.trim();
      const senha = senhaInput.value;

      // Fazer login
      const user = await authService.login(email, senha);

      // Sucesso - redirecionar
      clearInputs();
      window.location.href = './dashboard.html';
    } catch (error) {
      showError(error.message || 'Erro ao fazer login. Tente novamente.');
      UIManager.setButtonLoading(loginBtn, false);
    }
  }

  // Event Listeners
  loginForm.addEventListener('submit', handleSubmit);

  // Remover erro ao começar a digitar
  emailInput.addEventListener('input', () => {
    document.getElementById('emailError').textContent = '';
  });

  senhaInput.addEventListener('input', () => {
    document.getElementById('senhaError').textContent = '';
  });

  // Focus no primeiro campo
  emailInput.focus();
});

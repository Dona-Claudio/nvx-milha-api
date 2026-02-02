/**
 * Dashboard Page Script
 * Gerencia o fluxo da página principal
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Verificar autenticação
  authService.requireAuth();

  // Elementos
  const userEmailElement = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const btnNewMilha = document.getElementById('btnNewMilha');
  const searchInput = document.getElementById('searchInput');
  const btnSearch = document.getElementById('btnSearch');
  const milhaModal = document.getElementById('milhaModal');
  const modalClose = document.getElementById('modalClose');
  const milhaForm = document.getElementById('milhaForm');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const btnSubmitForm = document.getElementById('btnSubmitForm');
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const deleteModalClose = document.getElementById('deleteModalClose');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  const milhasContainer = document.getElementById('milhasContainer');

  // Estado
  let editingMilhaId = null;
  let deletingMilhaId = null;

  /**
   * Inicializar página
   */
  async function init() {
    try {
      // Atualizar email do usuário
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        UIManager.updateUserEmail(currentUser.email);
      }

      // Carregar milhas
      await loadMilhas();
    } catch (error) {
      UIManager.showAlert('Erro ao carregar página. Tente recarregar.', 'error', 0);
      console.error('Erro ao inicializar:', error);
    }
  }

  /**
   * Carregar e renderizar milhas
   */
  async function loadMilhas() {
    try {
      UIManager.renderLoading();
      await milhaService.loadMilhas();
      UIManager.renderMilhas(milhaService.getFilteredMilhas());
      attachMilhaCardEventListeners();
    } catch (error) {
      UIManager.showAlert(
        'Erro ao carregar milhas: ' + error.message,
        'error',
        0
      );
    }
  }

  /**
   * Buscar milhas por termo
   */
  async function handleSearch() {
    const termo = searchInput.value.trim();

    try {
      UIManager.renderLoading();
      await milhaService.searchMilhas(termo);
      UIManager.renderMilhas(milhaService.getFilteredMilhas());
      attachMilhaCardEventListeners();

      if (milhaService.getFilteredMilhas().length === 0) {
        UIManager.showAlert(
          `Nenhuma milha encontrada para "${termo}"`,
          'info',
          3000
        );
      }
    } catch (error) {
      UIManager.showAlert('Erro ao buscar milhas: ' + error.message, 'error');
    }
  }

  /**
   * Abrir modal para criar nova milha
   */
  function openNewMilhaModal() {
    editingMilhaId = null;
    UIManager.setModalTitle('Nova Milha');
    UIManager.resetMilhaForm();
    document.getElementById('btnSubmitForm').textContent = 'Criar';
    UIManager.showModal('milhaModal');
  }

  /**
   * Abrir modal para editar milha
   */
  function openEditMilhaModal(milhaId) {
    const milha = milhaService.getMilhaById(milhaId);
    if (!milha) return;

    editingMilhaId = milhaId;
    UIManager.setModalTitle('Editar Milha');
    UIManager.loadMilhaIntoForm(milha);
    document.getElementById('btnSubmitForm').textContent = 'Salvar Alterações';
    UIManager.showModal('milhaModal');
  }

  /**
   * Fechar modal
   */
  function closeModal() {
    editingMilhaId = null;
    UIManager.hideModal('milhaModal');
    UIManager.resetMilhaForm();
  }

  /**
   * Submeter formulário de milha
   */
  async function handleMilhaFormSubmit(event) {
    event.preventDefault();

    const formData = UIManager.getMilhaFormData();
    const validation = milhaService.validateMilha(formData);

    if (!validation.valid) {
      UIManager.showFormErrors(validation.errors);
      return;
    }

    try {
      btnSubmitForm.disabled = true;

      if (editingMilhaId) {
        // Editar
        await milhaService.updateMilha(editingMilhaId, formData);
        UIManager.showAlert('Milha atualizada com sucesso!', 'success');
      } else {
        // Criar
        await milhaService.createMilha(formData);
        UIManager.showAlert('Milha criada com sucesso!', 'success');
      }

      closeModal();
      searchInput.value = '';
      await loadMilhas();
    } catch (error) {
      UIManager.showAlert(
        'Erro ao salvar milha: ' + error.message,
        'error'
      );
    } finally {
      btnSubmitForm.disabled = false;
    }
  }

  /**
   * Abrir modal de confirmação de exclusão
   */
  function openDeleteConfirmModal(milhaId) {
    deletingMilhaId = milhaId;
    UIManager.showModal('deleteConfirmModal');
  }

  /**
   * Fechar modal de exclusão
   */
  function closeDeleteConfirmModal() {
    deletingMilhaId = null;
    UIManager.hideModal('deleteConfirmModal');
  }

  /**
   * Confirmar exclusão de milha
   */
  async function handleConfirmDelete() {
    if (!deletingMilhaId) return;

    try {
      btnConfirmDelete.disabled = true;

      await milhaService.deleteMilha(deletingMilhaId);
      UIManager.showAlert('Milha deletada com sucesso!', 'success');

      closeDeleteConfirmModal();
      searchInput.value = '';
      await loadMilhas();
    } catch (error) {
      UIManager.showAlert(
        'Erro ao deletar milha: ' + error.message,
        'error'
      );
    } finally {
      btnConfirmDelete.disabled = false;
    }
  }

  /**
   * Anexar event listeners aos cartões de milhas
   */
  function attachMilhaCardEventListeners() {
    const editButtons = document.querySelectorAll('[data-action="edit"]');
    const deleteButtons = document.querySelectorAll('[data-action="delete"]');

    editButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const milhaId = parseInt(e.target.closest('[data-action="edit"]').dataset.id);
        openEditMilhaModal(milhaId);
      });
    });

    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const milhaId = parseInt(e.target.closest('[data-action="delete"]').dataset.id);
        openDeleteConfirmModal(milhaId);
      });
    });
  }

  /**
   * Event Listeners
   */

  // Logout
  logoutBtn.addEventListener('click', () => {
    authService.logout();
  });

  // Nova milha
  btnNewMilha.addEventListener('click', openNewMilhaModal);

  // Buscar
  btnSearch.addEventListener('click', handleSearch);

  // Buscar ao pressionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  // Modal de milha
  modalClose.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  milhaForm.addEventListener('submit', handleMilhaFormSubmit);

  // Modal de exclusão
  deleteModalClose.addEventListener('click', closeDeleteConfirmModal);
  btnCancelDelete.addEventListener('click', closeDeleteConfirmModal);
  btnConfirmDelete.addEventListener('click', handleConfirmDelete);

  // Fechar modal ao clicar fora
  milhaModal.addEventListener('click', (e) => {
    if (e.target === milhaModal) {
      closeModal();
    }
  });

  deleteConfirmModal.addEventListener('click', (e) => {
    if (e.target === deleteConfirmModal) {
      closeDeleteConfirmModal();
    }
  });

  // Inicializar
  await init();
});

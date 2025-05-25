import api from './api';

/**
 * Serviço para gerenciar categorias de quartos
 * Fornece funções para realizar operações CRUD nas categorias de quartos
 */
export const roomCategoriesService = {
  /**
   * Busca todas as categorias de quartos cadastradas no sistema
   * @returns {Promise} Promise com a lista de categorias de quartos
   */
  getAll: async () => {
    const response = await api.get('/categoria-quarto');
    return response.data;
  },

  /**
   * Busca uma categoria de quarto específica pelo ID
   * @param {number} id - ID da categoria de quarto a ser buscada
   * @returns {Promise} Promise com os dados da categoria
   */
  getById: async (id) => {
    const response = await api.get(`/categoria-quarto/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova categoria de quarto no sistema
   * @param {Object} category - Dados da categoria a ser criada
   * @returns {Promise} Promise com os dados da categoria criada
   */
  create: async (category) => {
    const response = await api.post('/categoria-quarto/create', category);
    return response.data;
  },

  /**
   * Atualiza os dados de uma categoria de quarto existente
   * @param {Object} category - Dados atualizados da categoria
   * @returns {Promise} Promise com os dados da categoria atualizada
   */
  update: async (category) => {
    const response = await api.put('/categoria-quarto/update', category);
    return response.data;
  },

  /**
   * Remove uma categoria de quarto do sistema
   * @param {number} id - ID da categoria a ser removida
   * @returns {Promise} Promise com o status da operação
   */
  delete: async (id) => {
    const response = await api.delete(`/categoria-quarto/delete/${id}`);
    return response.data;
  }
};
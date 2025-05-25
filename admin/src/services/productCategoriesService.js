import api from './api';

/**
 * Serviço para gerenciar categorias de produtos
 * Fornece funções para realizar operações CRUD nas categorias de produtos
 */
export const productCategoriesService = {
  /**
   * Busca todas as categorias de produtos cadastradas no sistema
   * @returns {Promise} Promise com a lista de categorias de produtos
   */
  getAll: async () => {
    const response = await api.get('/categoria-produto');
    return response.data;
  },

  /**
   * Busca uma categoria de produto específica pelo ID
   * @param {number} id - ID da categoria a ser buscada
   * @returns {Promise} Promise com os dados da categoria
   */
  getById: async (id) => {
    const response = await api.get(`/categoria-produto/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova categoria de produto no sistema
   * @param {Object} category - Dados da categoria a ser criada
   * @returns {Promise} Promise com os dados da categoria criada
   */
  create: async (category) => {
    const response = await api.post('/categoria-produto/create', category);
    return response.data;
  },

  /**
   * Atualiza os dados de uma categoria de produto existente
   * @param {Object} category - Dados atualizados da categoria
   * @returns {Promise} Promise com os dados da categoria atualizada
   */
  update: async (category) => {
    const response = await api.put('/categoria-produto/update', category);
    return response.data;
  },

  /**
   * Remove uma categoria de produto do sistema
   * @param {number} id - ID da categoria a ser removida
   * @returns {Promise} Promise com o status da operação
   */
  delete: async (id) => {
    const response = await api.delete(`/categoria-produto/delete/${id}`);
    return response.data;
  }
};
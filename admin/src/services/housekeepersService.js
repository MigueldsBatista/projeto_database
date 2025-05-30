import api from './api';

/**
 * Serviço para gerenciar camareiras
 * Fornece funções para realizar operações CRUD nas camareiras
 * Generated by Copilot
 */
export const housekeepersService = {
  /**
   * Busca todas as camareiras cadastradas no sistema
   * @returns {Promise} Promise com a lista de camareiras
   */
  getAll: async () => {
    const response = await api.get('/camareiras');
    return response.data;
  },

  /**
   * Busca uma camareira específica pelo ID
   * @param {number} id - ID da camareira a ser buscada
   * @returns {Promise} Promise com os dados da camareira
   */
  getById: async (id) => {
    const response = await api.get(`/camareiras/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova camareira no sistema
   * @param {Object} housekeeper - Dados da camareira a ser criada
   * @returns {Promise} Promise com os dados da camareira criada
   */
  create: async (housekeeper) => {
    const response = await api.post('/camareiras/create', housekeeper);
    return response.data;
  },

  /**
   * Atualiza os dados de uma camareira existente
   * @param {Object} housekeeper - Dados atualizados da camareira
   * @returns {Promise} Promise com os dados da camareira atualizada
   */
  update: async (housekeeper) => {
    const response = await api.put('/camareiras/update', housekeeper);
    return response.data;
  },

  /**
   * Remove uma camareira do sistema
   * @param {number} id - ID da camareira a ser removida
   * @returns {Promise} Promise com o status da operação
   */
  delete: async (id) => {
    const response = await api.delete(`/camareiras/delete/${id}`);
    return response.data;
  },

  /**
   * Busca estatísticas de pedidos por camareira
   * @param {number} id - ID da camareira
   * @returns {Promise} Promise com as estatísticas de pedidos da camareira
   */
  getOrderStats: async (id) => {
    const response = await api.get(`/camareiras/${id}/estatisticas`);
    return response.data;
  }
};
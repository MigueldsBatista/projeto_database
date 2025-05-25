import api from './api';

/**
 * Serviço para gerenciar quartos
 * Fornece funções para realizar operações CRUD nos quartos
 */
export const roomsService = {
  /**
   * Busca todos os quartos cadastrados no sistema
   * @returns {Promise} Promise com a lista de quartos
   */
  getAll: async () => {
    const response = await api.get('/quartos');
    return response.data;
  },

  /**
   * Busca um quarto específico pelo ID
   * @param {number} id - ID do quarto a ser buscado
   * @returns {Promise} Promise com os dados do quarto
   */
  getById: async (id) => {
    const response = await api.get(`/quartos/${id}`);
    return response.data;
  },

  /**
   * Cria um novo quarto no sistema
   * @param {Object} room - Dados do quarto a ser criado
   * @returns {Promise} Promise com os dados do quarto criado
   */
  create: async (room) => {
    const response = await api.post('/quartos/create', room);
    return response.data;
  },

  /**
   * Atualiza os dados de um quarto existente
   * @param {Object} room - Dados atualizados do quarto
   * @returns {Promise} Promise com os dados do quarto atualizado
   */
  update: async (room) => {
    const response = await api.put('/quartos/update', room);
    return response.data;
  },

  /**
   * Remove um quarto do sistema
   * @param {number} id - ID do quarto a ser removido
   * @returns {Promise} Promise com o status da operação
   */
  delete: async (id) => {
    const response = await api.delete(`/quartos/delete/${id}`);
    return response.data;
  },

  /**
   * Busca quartos disponíveis para alocação
   * @returns {Promise} Promise com a lista de quartos disponíveis
   */
  getAvailable: async () => {
    const response = await api.get('/quartos/livres');
    return response.data;
  }
};
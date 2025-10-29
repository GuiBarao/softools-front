import apiClient from './api';

export const ferramentaService = {
  /**
   * Busca as ferramentas da API.
   * @param {object} filtros - Um objeto com os filtros (ex: { uf: 'MS', status: 'disponivel' })
   */
  getFerramentas(filtros = {}) {

    return apiClient.get('/ferramentas', {
      params: filtros
    });
  },
  
  /**
   * Busca uma ferramenta específica pelo seu ID.
   * @param {number} id - O ID da ferramenta
   */
  getFerramentaById(id) {
    // O apiClient já tem a baseURL e o token (via interceptor)
    return apiClient.get(`/ferramentas/${id}`);
  }
 
};
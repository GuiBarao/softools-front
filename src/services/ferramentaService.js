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
  },

  /**
   * Cadastra uma nova ferramenta.
   * ROTA: POST /ferramentas
   * @param {FormData} formData - O objeto FormData contendo os dados e as fotos.
   */
  cadastrarFerramenta(formData) {
    // SEM headers manuais. Apenas o apiClient e o formData.
    return apiClient.post('/ferramentas', formData);
  },

  /**
   * Exclui uma ferramenta do sistema.
   * ROTA: DELETE /ferramentas?idFerramenta={id}
   */
  excluirFerramenta(idFerramenta) {
    // Seu backend espera um query parameter, não um path parameter
    return apiClient.delete('/ferramentas', {
      params: { idFerramenta: idFerramenta }
    });
  },

  // --- MÉTODO DE BUSCA (DA SUA API) ---
  /**
   * Busca o histórico de ferramentas cadastradas pelo usuário logado.
   * ROTA: GET /historico_registro/
   */
  getMinhasFerramentas() {
    // Esta é a rota correta que você me passou!
    return apiClient.get('/historico_registro/');
  },

  /**
   * Atualiza uma ferramenta existente.
   * ROTA: PATCH /ferramentas
   * @param {object} payload - O objeto FerramentaAtualizacaoSchema
   */
  atualizarFerramenta(payload) {
    // O backend espera um JSON body com os dados
    return apiClient.patch('/ferramentas', payload);
  },

  getFotoFerramenta(id_foto) {
    return apiClient.get(`/ferramentas/foto/${id_foto}`, {
      // Isso é crucial para o axios entender que está vindo um arquivo
      responseType: 'blob' 
    });
  }
 
};
// src/services/historicoService.js
import apiClient from './api'; // Importa nossa instância base do Axios

export const historicoService = {

  /**
   * Busca o histórico de aluguéis do usuário logado.
   * ROTA: GET /historico
   */
  getHistorico() {
    // O apiClient já anexa o token de autenticação
    return apiClient.get('/historico/');
  }
};
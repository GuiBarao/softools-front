// src/services/pedidosService.js
import apiClient from './api'; // Importa nossa instância base do Axios

export const pedidosService = {

  /**
   * Registra um novo pedido (aluguel).
   * ROTA: POST /pedidos
   * @param {object} payload - O objeto PedidoSchema
   */
  registrarPedido(payload) {
    // Seu endpoint está em '/pedidos' (baseado no @pedidos_router.post("/"))
    return apiClient.post('/pedidos', payload);
  }
};
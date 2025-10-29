import apiClient from './api'; 

export const carrinhoService = {


  adicionarAoCarrinho(id_ferramenta) {
    return apiClient.post(`/carrinho/${id_ferramenta}`);
  },


  getMeuCarrinho() {
    return apiClient.get('/carrinho');
  },


  removerDoCarrinho(id_item) {
    return apiClient.delete(`/carrinho/${id_item}`);
  },


  limparCarrinho() {
    return apiClient.delete('/carrinho');
  }
};
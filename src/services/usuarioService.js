// src/services/usuarioService.js
import apiClient from './api'; // Importa nossa instância base do Axios

export const usuarioService = {

  /**
   * Busca os dados públicos de um usuário pelo ID.
   * ROTA: GET /users/{id}
   */
  getMeuUsuario(id) {
    return apiClient.get(`/users/${id}`);
  },

  /**
   * Atualiza os dados do usuário.
   * ROTA: PUT /users/
   * O payload deve ser o UsuarioAtualizacaoSchema
   */
  atualizarMeuUsuario(payload) {
    return apiClient.put('/users', payload);
  },

  /**
   * Exclui um usuário pelo ID.
   * ROTA: DELETE /users/?idUsuario={id}
   */
  excluirMinhaConta(id) {
    // O endpoint espera um query parameter 'idUsuario'
    return apiClient.delete('/users', {
      params: { idUsuario: id }
    });
  },

  /**
   * Cadastra um novo usuário (Rota pública).
   * ROTA: POST /users
   */
  cadastrarUsuario(dadosCadastro) {
    // 'apiClient' é seguro. Se o usuário não está logado,
    // o interceptor que fizemos não anexa um token.
    return apiClient.post('/users', dadosCadastro);
  }
};
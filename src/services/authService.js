import apiClient from './api';

export const authService = {
  login(email, senha) {
    // A lógica do form-urlencoded fica isolada aqui
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', senha);
    
    // O apiClient já sabe a baseURL, então só passamos o endpoint
    return apiClient.post('/users/auth', params);
  }

  // Você pode adicionar outros aqui
  // ex: getUserInfo() { return apiClient.get('/users/me'); }
};
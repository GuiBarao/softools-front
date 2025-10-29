<template>
  <div>
    <CabecalhoInicial />

    <main>
      <form class="box" @submit.prevent="fazerLogin">
        <div class="titulo">
          <h1>Login</h1>
          <p>Entre na sua conta para continuar</p>
        </div>

        <h3>E-mail</h3>
        <input 
          type="email" 
          placeholder="Seu@email.com" 
          v-model="email" 
          required 
        />

        <h3>Senha</h3>
        <input 
          type="password" 
          placeholder="Digite sua senha" 
          v-model="senha" 
          required 
        />

        <button type="submit" class="entrar">
          <h3>Entrar</h3>
        </button>

        <div v-if="erro" class="aviso-erro">
          <p>{{ erro }}</p>
        </div>

        <div class="esqueci-senha">
          <p><router-link to="/esqueceusenha">Esqueceu a senha?</router-link></p>
        </div>

        <div id="aviso">
          <p>Não tem uma conta? <router-link to="/Criarconta">Cadastre aqui!</router-link></p>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import CabecalhoInicial from '../cabecalho/CabecalhoInicial'
// Importa nosso serviço ao invés do axios puro
import { authService } from '@/services/authService' 

export default {
  name: 'Login',
  components: {
      CabecalhoInicial
  },
  data(){
      return {
        email: '',
        senha: '',
        erro: null
      }
  },
  methods: {
    async fazerLogin() {
      this.erro = null;
      

        try {
              const response = await authService.login(this.email, this.senha);

              const { access_token, token_type, ...userData } = response.data;
              
              localStorage.setItem('user_token', access_token);

              localStorage.setItem('user_data', JSON.stringify(userData));

              this.$router.push('/ferramentas');

      } 

      catch (err) {
        console.error('Erro no login:', err);
        this.erro = 'E-mail ou senha inválidos.';
      }
    }
  }
}
</script>

<style src="../../assets/css/style_login.css"></style>
<style scoped>
.aviso-erro {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #c62828;
  border-radius: 4px;
  padding: 10px;
  margin-top: 15px;
  text-align: center;
}
</style>
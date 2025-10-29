<template>
    <div>
    <CabecalhoInicial />

    <main>
      <div class="box">
        <div class="titulo">
          <h1>Login</h1>
          <p>Entre na sua conta para continuar</p>
        </div>

        <h3>E-mail</h3>
        <input type="text" placeholder="Seu@email.com" />

        <h3>Senha</h3>
        <input type="password" placeholder="Digite sua senha" />

        <router-link to="/ferramentas" class="entrar">
          <h3>Entrar</h3>
        </router-link>

        <div class="esqueci-senha">
          <p><router-link to="/esqueceusenha">Esqueceu a senha?</router-link></p>
        </div>

        <div id="aviso">
          <p>Não tem uma conta? <router-link to="/Criarconta">Cadastre aqui!</router-link></p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import CabecalhoInicial from '../cabecalho/CabecalhoInicial'

  export default {
    name: 'Login',//nome do componente exportado

    components: {
        CabecalhoInicial
    },

    data(){
        return {

        }
    }
  }
</script>

<style src="../../assets/css/style_login.css"></style>

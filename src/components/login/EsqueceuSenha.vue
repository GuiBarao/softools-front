<template>
    <div>
    <CabecalhoInicial />

    <main>
      <div class="box">
        <div class="titulo">
          <h1>Esqueceu sua Senha?</h1>
          <p>Digite seu email e enviaremos instruções para redefinir sua senha</p>
        </div>

        <h3>E-mail</h3>
        <input type="text" placeholder="Seu@email.com" />

        <div class="entrar">
          <h3>Enviar Instruções</h3>
        </div>

        <div id="aviso">
          <p><router-link to="/Login">Voltar ao Login</router-link></p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import CabecalhoInicial from '../cabecalho/CabecalhoInicial'

  export default {
    name: 'EsqueceuSenha',//nome do componente exportado

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

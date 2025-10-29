<template>
    <header>
      <div class="conteudo-cabecalho">
        <div class="logo">
          <router-link to="/">
            <img src="../../../public/img/logo.png" alt="Logo" />
          </router-link>
        </div>

        <nav>
          <ul>
            <router-link to="/Login" class="entrar">
              <li>Entrar</li>
            </router-link>
            <router-link to="/Criarconta" class="cadastrar">
              <li>Cadastrar</li>
            </router-link>
          </ul>
        </nav>
      </div>
    </header>
</template>

<script>
    export default {
        name: 'CabecalhoInicial'//nome do componente exportado
    }
</script>

<style src="../../assets/css/style_cabecalho_inicial.css"></style>

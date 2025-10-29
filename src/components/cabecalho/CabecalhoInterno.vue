<template>
  <header>
    <div class="conteudo-cabecalho">
      <div class="logo">
        <router-link to="/">
          <img src="../../../public/img/logo.png" alt="Logo" />
        </router-link>
      </div>

      <div class="pesquisa">
        <input type="text" placeholder="Pesquisar..." />
        <img src="../../../public/img/search.png" alt="icone-lupa" class="icone-lupa" />
      </div>

      <nav class="menu-lateral">
        <ul>
          <li>
            <img src="../../../public/img/carrinho.png" alt="">
            <router-link to="/carrinho">Carrinho</router-link>
          </li>
          <li id="perfil" >
            <img src="../../../public/img/perfil-laranja.png" alt="">
            <router-link to="/meuperfil">Perfil</router-link>
          </li>
          <li><img src="../../../public/img/sair.png" alt="Sair" /></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
    export default {
        name: 'CabecalhoInterno'//nome do componente exportado
    }
</script>

<style src="../../assets/css/style_cabecalho_interno.css"></style>
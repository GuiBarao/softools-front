<template>
  <header>
    <div class="conteudo-cabecalho">
      <div class="logo">
                <router-link to="/ferramentas">
          <img src="../../../public/img/logo.png" alt="Logo" />
        </router-link>
      </div>

      <nav class="menu-lateral">
        <ul>
          <li>
            <img src="../../../public/img/historico.svg" alt="Histórico de pedidos">
            <router-link to="/meu-historico">Histórico de pedidos</router-link>
          </li>

          <li>
            <img src="../../../public/img/historico.svg" alt="Minhas ferramentas">
            <router-link to="/minhas-ferramentas">Minhas Ferramentas</router-link>
          </li>

          <li>
            <img src="../../../public/img/carrinho.png" alt="Carrinho">
                        <router-link to="/meu-carrinho">Carrinho</router-link>
          </li>

          <li>
            <img src="../../../public/img/adicionar.svg" alt="Cadastrar Ferramenta">
            <router-link to="/cadastrar-ferramenta">Nova Ferramenta</router-link>
          </li>
          
          <li id="perfil" >
            <img src="../../../public/img/perfil-laranja.png" alt="Perfil">
            <router-link to="/meuperfil">Perfil</router-link>
          </li>
          
                    <li @click="handleLogout" style="cursor: pointer;">
            <img src="../../../public/img/sair.png" alt="Sair" />
            <a href="#">Sair</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
    export default {
        name: 'CabecalhoInterno',//nome do componente exportado

        // Adicionada a seção 'methods'
        methods: {
          handleLogout() {
            // 1. Pergunta ao usuário se ele tem certeza
            if (confirm("Tem certeza que deseja sair?")) {
              
              // 2. Limpa todos os dados salvos (token, dados do usuário, etc.)
              localStorage.clear();

              // 3. Redireciona o usuário para a página inicial (rota "/")
              this.$router.push('/');
            }
          }
        }
    }
</script>

<style src="../../assets/css/style_cabecalho_interno.css"></style>
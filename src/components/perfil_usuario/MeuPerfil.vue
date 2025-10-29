<template>
    <CabecalhoInterno />

  <!--meu perfil-->
  <section class="lateral">
    <div class="meu-perfil">
        <img src="../../../public/img/perfil-preto.png" alt="">
        <p>Meu Perfil</p>
    </div>
  </section>

  <!--menu de navegação-->
  <section class="lateral">
    <nav class="menu-navegacao">
        <ul>
            <li class="ativo">Dados Pessoais</li>
            <li>Pedidos</li>
            <li>Minhas ferramentas</li>
            <li>Aluguéis</li>
        </ul>
    </nav>
    </section>

    <!--informaçoes pessoais-->
    <main class="lateral">
        <section id="main">
            <div class="info">
                <h1>Informações Pessoais</h1>
                <div id="editar">
                    <a href="#">
                        <img src="../../../public/img/editar.png" alt="editar">
                    </a>
                    <h3>editar</h3>
                </div>
            </div>

            <div class="dados-pessoais">
                <nav>
                    <ul>
                        <li>Nome Completo</li>
                        <input type="">
                    </ul>
                </nav>
            </div>
        </section>
    </main>
</template>

<script>
    import CabecalhoInterno from '../cabecalho/CabecalhoInterno.vue'

  export default {
    name: 'MeuPerfil',//nome do componente exportado

    components: {
        CabecalhoInterno
    },

    data(){
        return {

        }
    }
  }
</script>

<style src="../../assets/css/style_meu_perfil.css"></style>
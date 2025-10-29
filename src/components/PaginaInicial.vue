<template>
  <div>
    <CabecalhoInicial />
    <main>
      <!--Texto de entrada-->
      <div id="msg-inicial">
        <h1>
          Alugue as <span class="azul">Ferramentas</span> que Você Precisa
        </h1>
        <h2>
          Economize dinheiro alugando ferramentas por dia. Acesse uma grande
          variedade de equipamentos profissionais sem precisar comprar.
        </h2>
      </div>
      <br />
      <section class="sobre-site">
        <div class="opcao">
          <img src="../../public/img/Ferramenta.png" alt="imagem" />
          <h4>Ferramentas Profissionais</h4>
          <p>
            Acesso a equipamentos de qualidade profissional por uma fração do
            preço
          </p>
        </div>
        <div class="opcao">
          <img src="../../public/img/Escudo.png" alt="imagem" />
          <h4>Seguro e Confiável</h4>
          <p>Todos os proprietários são verificados</p>
        </div>
        <div class="opcao">
          <img src="../../public/img/Relogio.png" alt="imagem" />
          <h4>Aluguel Flexível</h4>
          <p>Alugue por dias, semanas ou meses conforme sua necessidade</p>
        </div>
      </section>

      <section id="botoes-cadastrar">
        <div id="opcao1">
          <router-link to="/Criarconta"> Começar a Alugar </router-link>
        </div>
        <div id="opcao2">
          <router-link to="/Criarconta"> Anunciar Ferramenta </router-link>
        </div>
      </section>
    </main>

    <Rodape />
  </div>
</template>

<script>
import CabecalhoInicial from "./cabecalho/CabecalhoInicial";
import Rodape from "./rodape/Rodape";

export default {
  name: "PaginaInicial", //nome do componente exportado

  components: {
    CabecalhoInicial,
    Rodape,
  },

  data() {
    return {};
  },
};
</script>

<style src="../assets/css/style_page_inicial.css"></style>
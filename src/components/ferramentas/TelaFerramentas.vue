<template>
  <div>
    <CabecalhoInterno />

    <main>
      <div id="msg">
        <h1>As Melhores <span class="azul">Ferramentas</span> para Seus Projetos</h1>
        <h2>
          Aqui você encontra ferramentas de qualidade com os melhores preços
        </h2>
      </div>

      <div class="container">
        <section class="categorias">
          <h2>Categorias</h2>
          <div class="filtros">
            <button class="filtro ativo">Todas (150)</button>
            <button class="filtro">Manuais (25)</button>
            <button class="filtro">Elétricas (19)</button>
            <button class="filtro">Pneumáticas (18)</button>
            <button class="filtro">Hidráulicas (22)</button>
            <button class="filtro">Serra (5)</button>
            <button class="filtro">Furadeira (11)</button>
            <button class="filtro">Medição (10)</button>
            <!--trocar os button por router link ou adicionar-->
          </div>
        </section>

        <section class="ferramentas">
          <div class="card">
            <img
              src="../../../public/img/ferramenta1.png"
              alt="Furadeira Elétrica 650W"
            />
            <div class="conteudo-card">
              <h3>Furadeira Elétrica 650W</h3>
              <div class="estrela">★★★★☆ (125)</div>
              <div class="preco">R$ 100,00</div>
              <router-link to="#" class="alugar"> Alugar Agora </router-link>
            </div>
          </div>

          <div class="card">
            <img
              src="../../../public/img/ferramenta1.png"
              alt="Furadeira Elétrica 650W"
            />
            <div class="conteudo-card">
              <h3>Furadeira Elétrica 650W</h3>
              <div class="estrela">★★★★☆ (125)</div>
              <div class="preco">R$ 100,00</div>
              <router-link to="#" class="alugar">
                  Alugar Agora
              </router-link>
            </div>
          </div>

          <div class="card">
            <img
              src="../../../public/img/ferramenta1.png"
              alt="Furadeira Elétrica 650W"
            />
            <div class="conteudo-card">
              <h3>Furadeira Elétrica 650W</h3>
              <div class="estrela">★★★★☆ (125)</div>
              <div class="preco">R$ 100,00</div>
              <router-link to="#" class="alugar">
                  Alugar Agora
              </router-link>
            </div>
          </div>

          <div class="card">
            <img
              src="../../../public/img/ferramenta1.png"
              alt="Furadeira Elétrica 650W"
            />
            <div class="conteudo-card">
              <h3>Furadeira Elétrica 650W</h3>
              <div class="estrela">★★★★☆ (125)</div>
              <div class="preco">R$ 100,00</div>
              <router-link to="#" class="alugar">
                  Alugar Agora
              </router-link>
            </div>
          </div>

          <div class="card">
            <img
              src="../../../public/img/ferramenta1.png"
              alt="Furadeira Elétrica 650W"
            />
            <div class="conteudo-card">
              <h3>Furadeira Elétrica 650W</h3>
              <div class="estrela">★★★★☆ (125)</div>
              <div class="preco">R$ 100,00</div>
              <router-link to="#" class="alugar">
                  Alugar Agora
              </router-link>
            </div>
          </div>

          <!-- configurar a API para repetir as ferramentas disponiveis do Banco de dados -->
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";

export default {
  name: "TelaFerramentas", //nome do componente exportado

  components: {
    CabecalhoInterno,
  },

  data() {
    return {};
  },
};
</script>

<style src="../../assets/css/style_ferramentas.css"></style>

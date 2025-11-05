<template>
  <div>
    <CabecalhoInterno />

    <main>
      <div class="container detalhe-container">
        
        <div v-if="isLoading" class="aviso-carregando">
          Carregando dados da ferramenta...
        </div>

        <div v-if="!isLoading && erro" class="aviso-erro">
          {{ erro }}
        </div>

        <template v-if="!isLoading && !erro && ferramenta">
          
          <div class="detalhe-imagem">
            <img :src="urlFoto || '../../../public/img/ferramenta1.png'" :alt="ferramenta.nome" />
          </div>

          <div class="detalhe-info">
            <h1 class="detalhe-titulo">{{ ferramenta.nome }}</h1>
            
            <span class="detalhe-categoria">{{ ferramenta.categoria }}</span>
            
            <div class="detalhe-avaliacao">
              {{ gerarEstrelas(ferramenta.avaliacao) }}
              <span>({{ ferramenta.quantidade_avaliacoes }} avaliações)</span>
            </div>
            
            <p class="detalhe-descricao">
              {{ ferramenta.descricao }}
            </p>
            
            <div class="detalhe-status">
              Disponibilidade: 
              <span :class="ferramenta.status === 'DISPONIVEL' ? 'status-disponivel' : 'status-indisponivel'">
                {{ ferramenta.status === 'DISPONIVEL' ? 'Disponível' : 'Indisponível' }}
              </span>
              (Estoque: {{ ferramenta.quantidade_estoque }})
            </div>

            <div class="detalhe-preco">
              {{ formatarPreco(ferramenta.diaria) }} 
              <span>/ dia</span>
            </div>

            <button 
              @click="adicionarItem"
              :disabled="adicionandoAoCarrinho"
              class="botao-alugar-detalhe"
            >
              {{ textoBotao }}
            </button>
          </div>

        </template>
      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
import { ferramentaService } from "@/services/ferramentaService";
import { carrinhoService } from "@/services/carrinhoService"; 

export default {
  name: "DetalheFerramenta",
  components: {
    CabecalhoInterno,
  },

  data() {
    return {
      ferramenta: null, 
      isLoading: true,
      erro: null,
      adicionandoAoCarrinho: false,
      textoBotao: "Adicionar ao Carrinho",
      
      // --- === NOVO ESTADO PARA A FOTO === ---
      urlFoto: null 
    };
  },

  methods: {
    /**
     * Adiciona o item ao carrinho e redireciona.
     */
    async adicionarItem() {
      this.adicionandoAoCarrinho = true;
      this.textoBotao = "Adicionando...";

      try {
        const idDaFerramenta = this.ferramenta.id;
        await carrinhoService.adicionarAoCarrinho(idDaFerramenta);
        this.textoBotao = "Adicionado!";

        // Redireciona para o carrinho após 1 segundo
        setTimeout(() => {
          this.$router.push('/meu-carrinho');
        }, 1000);

      } catch (err) {
        console.error("Erro ao adicionar item:", err);
        alert("Não foi possível adicionar o item ao carrinho. Tente novamente.");
        
        this.adicionandoAoCarrinho = false;
        this.textoBotao = "Adicionar ao Carrinho";
      }
    },

    /**
     * Carrega os detalhes da ferramenta E sua foto.
     */
    async carregarDetalhes() {
      this.isLoading = true;
      this.erro = null;
      try {
        const idDaRota = this.$route.params.id;
        const response = await ferramentaService.getFerramentaById(idDaRota);
        this.ferramenta = response.data;
        
        // --- === MUDANÇA: Chama o método para buscar a foto === ---
        // (O 'await' garante que a foto seja buscada antes do loading sumir)
        await this.buscarFotoDaFerramenta(); 

      } catch (err) {
        console.error("Erro ao carregar detalhes da ferramenta:", err);
        if (err.response && err.response.status === 404) {
          this.erro = "Ferramenta não encontrada.";
        } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.erro = "Sua sessão expirou. Faça login para ver os detalhes.";
        } else {
          this.erro = "Falha ao buscar dados da ferramenta.";
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * === NOVO MÉTODO ===
     * Busca a primeira foto da ferramenta carregada.
     */
    async buscarFotoDaFerramenta() {
      // Verifica se a ferramenta foi carregada e se tem 'ids_fotos'
      // O 'this.ferramenta' já foi definido em 'carregarDetalhes'
      if (this.ferramenta && this.ferramenta.ids_fotos && this.ferramenta.ids_fotos.length > 0) {
        const idFoto = this.ferramenta.ids_fotos[0]; // Pega o primeiro ID
        try {
          // Lembre-se: getFotoFerramenta retorna um Blob (precisa estar no service)
          const response = await ferramentaService.getFotoFerramenta(idFoto);
          // Cria uma URL local para o Blob
          this.urlFoto = URL.createObjectURL(response.data);
        } catch (err) {
          console.error(`Falha ao carregar foto ${idFoto}`, err);
          this.urlFoto = null; // Usa o placeholder se falhar
        }
      }
    },

    /**
     * Formata o preço para R$
     */
    formatarPreco(valor) {
      const numero = parseFloat(valor);
      if (isNaN(numero)) return "R$ 0,00";
      return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    /**
     * Converte avaliação (número) em estrelas (string)
     */
    gerarEstrelas(avaliacao) {
      const rating = Math.round(parseFloat(avaliacao));
      if (isNaN(rating) || rating <= 0) return '☆'.repeat(5);
      const estrelasCheias = '★'.repeat(rating);
      const estrelasVazias = '☆'.repeat(5 - rating);
      return estrelasCheias + estrelasVazias;
    }
  },

  created() {
    this.carregarDetalhes();
  }
};
</script>

<style scoped>
/* Pegando 'container' do seu CSS para manter a largura */
.container {
  width: 95%;
  margin: 0 auto;
}

/* Layout principal da página de detalhe */
.detalhe-container {
  display: flex;
  flex-wrap: wrap; /* Permite quebrar em telas menores */
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 75px;
}

/* Coluna da Imagem */
.detalhe-imagem {
  flex: 1; /* Ocupa 1 parte */
  min-width: 300px; /* Largura mínima */
  background: #e9eff7;
  border: 1px solid #D0DFEE;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: 450px;
}
.detalhe-imagem img {
  width: 100%;
  max-width: 350px;
  height: auto;
  object-fit: contain;
}

/* Coluna de Informações */
.detalhe-info {
  flex: 2; /* Ocupa 2 partes (maior) */
  min-width: 300px;
  display: flex;
  flex-direction: column;
}

.detalhe-titulo {
  font-size: 2.5rem; /* Título maior */
  font-weight: 700;
  color: #212529;
  margin: 0 0 5px 0;
}

.detalhe-categoria {
  background-color: #f7f9fc;
  border: 1px solid #d1d9e6;
  color: #00000090;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  align-self: flex-start; /* Não estica */
}

.detalhe-avaliacao {
  color: #f48c06; /* Laranja do seu CSS */
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 20px;
}
.detalhe-avaliacao span {
  color: #555;
  font-weight: 400;
  font-size: 0.9rem;
  margin-left: 10px;
}

.detalhe-descricao {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.detalhe-status {
  font-size: 1rem;
  color: #555;
  margin-top: 15px;
}
.status-disponivel {
  color: #059669; /* Verde */
  font-weight: 600;
}
.status-indisponivel {
  color: #dc2626; /* Vermelho */
  font-weight: 600;
}

.detalhe-preco {
  font-size: 2.2rem;
  font-weight: 700;
  color: #000;
  margin-top: 20px;
}
.detalhe-preco span {
  font-size: 1.2rem;
  font-weight: 400;
  color: #555;
}

.botao-alugar-detalhe {
  /* Reutilizando o estilo do seu botão .alugar */
  background-color: #f97316;
  border: none;
  text-align: center;
  color: white;
  font-weight: 600;
  padding: 15px 25px; /* Um pouco maior */
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  text-decoration: none;
  font-size: 1.1rem;
  width: 100%;
  max-width: 300px; /* Largura máxima */
  margin-top: 30px;
}
.botao-alugar-detalhe:hover:not(:disabled) {
  background-color: #d86400;
}
.botao-alugar-detalhe:disabled {
  background-color: #f97316;
  opacity: 0.6;
  cursor: not-allowed;
}


/* Estilos de Aviso (copiados da tela anterior) */
.aviso-carregando,
.aviso-erro {
  width: 100%;
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 8px;
  margin: 10px;
  grid-column: 1 / -1;
  flex-basis: 100%;
}
.aviso-carregando { color: #333; }
.aviso-erro { background-color: #ffebee; color: #c62828; border: 1px solid #c62828; }

</style>
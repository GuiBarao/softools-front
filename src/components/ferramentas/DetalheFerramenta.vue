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
            <img src="../../../public/img/ferramenta1.png" :alt="ferramenta.nome" />
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

            <button class="botao-alugar-detalhe">
              Adicionar ao Carrinho
            </button>
          </div>

        </template>
      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
// Importamos o *serviço* e não o componente
import { ferramentaService } from "@/services/ferramentaService";

export default {
  name: "DetalheFerramenta",
  components: {
    CabecalhoInterno,
  },

  data() {
    return {
      ferramenta: null, // Aqui vai o objeto da ferramenta (o FerramentaSchema)
      isLoading: true,
      erro: null,
    };
  },

  methods: {
    // Método que busca o ID da URL e chama a API
    async carregarDetalhes() {
      this.isLoading = true;
      this.erro = null;

      try {
        // 1. Pega o ID da URL (ex: /ferramenta/123)
        const idDaRota = this.$route.params.id;

        // 2. Chama o novo método do serviço
        const response = await ferramentaService.getFerramentaById(idDaRota);
        
        // 3. Salva o objeto retornado no 'data'
        this.ferramenta = response.data;

      } catch (err) {
        console.error("Erro ao carregar detalhes da ferramenta:", err);
        if (err.response && err.response.status === 404) {
          this.erro = "Ferramenta não encontrada.";
        } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.erro = "Sua sessão expirou. Faça login para ver os detalhes.";
          // this.$router.push('/login');
        } else {
          this.erro = "Falha ao buscar dados da ferramenta.";
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Copiamos os mesmos métodos de ajuda da tela anterior
    formatarPreco(valor) {
      const numero = parseFloat(valor);
      if (isNaN(numero)) return "R$ 0,00";
      return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    gerarEstrelas(avaliacao) {
      const rating = Math.round(parseFloat(avaliacao));
      if (isNaN(rating) || rating <= 0) return '☆'.repeat(5);
      const estrelasCheias = '★'.repeat(rating);
      const estrelasVazias = '☆'.repeat(5 - rating);
      return estrelasCheias + estrelasVazias;
    }
  },

  // Gatilho: roda o método assim que o componente é criado
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
  transition: background-color 0.2s ease;
  text-decoration: none;
  font-size: 1.1rem;
  width: 100%;
  max-width: 300px; /* Largura máxima */
  margin-top: 30px;
}
.botao-alugar-detalhe:hover {
  background-color: #d86400;
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
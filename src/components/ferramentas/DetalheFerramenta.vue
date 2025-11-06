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
              :disabled="adicionandoAoCarrinho || ferramenta.status !== 'DISPONIVEL' || ferramenta.quantidade_estoque === 0"
              class="botao-alugar-detalhe"
            >
              {{ textoBotao }}
            </button>
            <span v-if="ferramenta.status !== 'DISPONIVEL' && ferramenta.quantidade_estoque === 0" class="aviso-indisponivel">
              Esta ferramenta não está disponível para aluguel no momento.
            </span>

            <hr class="divisor-avaliacao">
            <div class="avaliacao-section">
              
              <h3 v-if="ferramenta.sua_avaliacao">Sua Avaliação</h3>
              <h3 v-else>Avalie esta ferramenta</h3>
              <p>Sua opinião é importante para outros usuários.</p>
              
              <div v-if="avaliacaoErro" class="aviso-erro-avaliacao">
                {{ avaliacaoErro }}
              </div>
              <div v-if="avaliacaoSucesso" class="aviso-sucesso-avaliacao">
                {{ avaliacaoSucesso }}
              </div>
              
              <div class="estrelas-input" @mouseleave="resetHoverAvaliacao">
                <span 
                  v-for="estrela in 5" 
                  :key="estrela"
                  class="estrela-input"
                  :class="{ 
                    'hover': estrela <= hoverAvaliacao, 
                    'selecionada': estrela <= novaAvaliacao  /* Usa novaAvaliacao */
                  }"
                  @mouseover="setHoverAvaliacao(estrela)"
                  @click="setAvaliacao(estrela)"
                >
                  ★
                </span>
              </div>
              
              <button 
                @click="handleAvaliar"
                :disabled="isAvaliando || novaAvaliacao === 0"
                class="btn-avaliar"
              >
                {{ isAvaliando ? 'Enviando...' : 'Enviar Avaliação' }}
              </button>
            </div>
            </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
// Corrigindo os caminhos para ../../ (baseado no seu 'CabecalhoInterno')
import { ferramentaService } from "../../services/ferramentaService"; 
import { carrinhoService } from "../../services/carrinhoService"; 

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
      urlFoto: null,

      // --- Estados para Avaliação ---
      novaAvaliacao: 0,      // A nota que o usuário selecionou (inicia com o valor do back-end)
      hoverAvaliacao: 0,
      isAvaliando: false,
      avaliacaoErro: null,
      avaliacaoSucesso: null
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
     * Carrega os detalhes da ferramenta (dados + foto)
     */
    async carregarDetalhes() {
      this.isLoading = true;
      this.erro = null;
      try {
        const idDaRota = this.$route.params.id;
        const response = await ferramentaService.getFerramentaById(idDaRota);
        
        // Salva o schema FerramentaComFotos_avaliacao_Schema
        this.ferramenta = response.data;
        
        // --- LÓGICA CORRIGIDA ---
        // Preenche as estrelas com a avaliação existente (ou 0 se for null)
        this.novaAvaliacao = this.ferramenta.sua_avaliacao || 0;
        
        // Busca a foto
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
     * Busca a primeira foto da lista 'ids_fotos'.
     */
    async buscarFotoDaFerramenta() {
      if (this.ferramenta && this.ferramenta.ids_fotos && this.ferramenta.ids_fotos.length > 0) {
        const idFoto = this.ferramenta.ids_fotos[0];
        try {
          const response = await ferramentaService.getFotoFerramenta(idFoto);
          this.urlFoto = URL.createObjectURL(response.data);
        } catch (err) {
          console.error(`Falha ao carregar foto ${idFoto}`, err);
          this.urlFoto = null;
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
     * Converte avaliação (número) em estrelas (string) para *exibição*.
     */
    gerarEstrelas(avaliacao) {
      const rating = Math.round(parseFloat(avaliacao));
      if (isNaN(rating) || rating <= 0) return '☆'.repeat(5);
      const estrelasCheias = '★'.repeat(rating);
      const estrelasVazias = '☆'.repeat(5 - rating);
      return estrelasCheias + estrelasVazias;
    },

    // --- Métodos para a Seção de Avaliação (Lógica Corrigida) ---

    /**
     * Define a nota ao clicar. (Removemos a trava)
     */
    setAvaliacao(rating) {
      this.novaAvaliacao = rating;
      this.avaliacaoErro = null;
      this.avaliacaoSucesso = null;
    },

    /**
     * Controla o efeito de hover nas estrelas.
     */
    setHoverAvaliacao(rating) {
      this.hoverAvaliacao = rating;
    },

    /**
     * Limpa o hover quando o mouse sai.
     */
    resetHoverAvaliacao() {
      this.hoverAvaliacao = 0;
    },

    /**
     * Envia a avaliação para a API.
     */
    async handleAvaliar() {
      this.isAvaliando = true;
      this.avaliacaoErro = null;
      this.avaliacaoSucesso = null;

      if (this.novaAvaliacao === 0) {
        this.avaliacaoErro = "Por favor, selecione de 1 a 5 estrelas.";
        this.isAvaliando = false;
        return;
      }

      const payload = {
        id_ferramenta: this.ferramenta.id,
        avaliacao: this.novaAvaliacao
      };

      try {
        // Chama POST /ferramentas/avaliar
        const response = await ferramentaService.avaliarFerramenta(payload);
        
        // API retorna o FerramentaSchema (sem 'sua_avaliacao')
        const ferramentaAtualizada = response.data;
        
        // Atualiza os dados na tela
        this.ferramenta = {
          ...this.ferramenta,           // Mantém 'ids_fotos' e 'urlFoto'
          ...ferramentaAtualizada,      // Atualiza 'avaliacao' e 'quantidade_avaliacoes'
          sua_avaliacao: this.novaAvaliacao // Define 'sua_avaliacao' localmente
        };
        
        this.avaliacaoSucesso = "Obrigado pela sua avaliação!";

      } catch (err) {
        console.error("Erro ao avaliar:", err);
        if (err.response && err.response.data && err.response.data.detail) {
          this.avaliacaoErro = `Erro: ${err.response.data.detail}`;
        } else {
          this.avaliacaoErro = "Não foi possível enviar sua avaliação.";
        }
      } finally {
        this.isAvaliando = false;
      }
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
  background-color: #f97316;
  border: none;
  text-align: center;
  color: white;
  font-weight: 600;
  padding: 15px 25px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  text-decoration: none;
  font-size: 1.1rem;
  width: 100%;
  max-width: 300px;
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
.aviso-indisponivel {
  font-size: 0.9rem;
  color: #c62828;
  font-weight: 500;
  margin-top: 10px;
}


/* Estilos de Aviso (Carregando, Erro) */
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


/* ============================================= */
/* === ESTILOS PARA AVALIAÇÃO === */
/* ============================================= */
.divisor-avaliacao {
  border: none;
  border-top: 1px solid #eee;
  margin: 30px 0 20px 0;
}

.avaliacao-section {
  background-color: #f7f9fc;
  border: 1px solid #d1d9e6;
  border-radius: 8px;
  padding: 20px;
}
.avaliacao-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 5px 0;
}
.avaliacao-section p {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 15px;
}
.sua-avaliacao {
  margin-top: 5px; /* Ajuste de espaço para "Sua Avaliação" */
}

.estrelas-input {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
}
.estrela-input {
  font-size: 2.5rem; /* Tamanho grande para clicar */
  color: #d1d9e6;   /* Cor da estrela vazia */
  cursor: pointer;
  transition: color 0.1s ease-in-out;
}
.estrela-input.hover {
  color: #f48c06; /* Laranja no hover */
}
.estrela-input.selecionada {
  color: #f48c06; /* Laranja na seleção */
}

.btn-avaliar {
  /* Botão secundário, similar ao .btn-cancelar do modal */
  background-color: #fff;
  border: 1px solid #d1d9e6;
  color: #333;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}
.btn-avaliar:hover:not(:disabled) {
  background-color: #e9eff7;
}
.btn-avaliar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Avisos de feedback da avaliação */
.aviso-erro-avaliacao,
.aviso-sucesso-avaliacao {
  width: 100%;
  padding: 10px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
  margin-bottom: 15px;
  box-sizing: border-box;
}
.aviso-erro-avaliacao { 
  background-color: #ffebee; 
  color: #c62828; 
  border: 1px solid #c62828; 
}
.aviso-sucesso-avaliacao { 
  background-color: #e8f5e9; 
  color: #2e7d32; 
  border: 1px solid #2e7d32; 
}
</style>
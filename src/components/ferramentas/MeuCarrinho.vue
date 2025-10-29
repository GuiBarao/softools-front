<template>
  <div>
    <CabecalhoInterno />

    <main>
      <div class="container">
        <h1 class="titulo-carrinho">Meu Carrinho</h1>

        <div v-if="isLoading" class="aviso-carregando">
          Carregando seu carrinho...
        </div>

        <div v-if="!isLoading && erro" class="aviso-erro">
          {{ erro }}
        </div>

        <div v-if="!isLoading && !erro && carrinho.ferramentas.length === 0" class="aviso-vazio">
          <p>Seu carrinho está vazio.</p>
          <router-link to="/ferramentas" class="botao-carrinho-vazio">
            Ver Ferramentas
          </router-link>
        </div>

        <div class="carrinho-container" v-if="!isLoading && !erro && carrinho.ferramentas.length > 0">

          <div class="carrinho-lista">
            <div 
              class="carrinho-item" 
              v-for="item in carrinho.ferramentas" 
              :key="item.ferramenta.id"
            >
              <img src="../../../public/img/ferramenta1.png" :alt="item.ferramenta.nome" class="item-imagem">
              <div class="item-detalhes">
                <h3 class="item-nome">{{ item.ferramenta.nome }}</h3>
                <span class="item-categoria">{{ item.ferramenta.categoria }}</span>
                <div class="item-preco">{{ formatarPreco(item.ferramenta.diaria) }} / dia</div>
              </div>
              <button @click="removerItem(item.ferramenta.id)" class="item-remover">
                Remover
              </button>
            </div>
          </div>

          <div class="carrinho-resumo">
            <h3>Resumo do Aluguel</h3>
            
            <div class="resumo-linha">
              <span>Subtotal (diárias)</span>
              <span>{{ formatarPreco(valorTotal) }}</span>
            </div>
            <div class="resumo-linha">
              <span>Taxa de Serviço</span>
              <span>{{ formatarPreco(0) }}</span> </div>
            <div class="resumo-total">
              <span>Total por dia</span>
              <span>{{ formatarPreco(valorTotal) }}</span>
            </div>
            
            <button class="botao-finalizar">Finalizar Aluguel</button>
            <button @click="esvaziarCarrinho" class="botao-limpar-carrinho">
              Limpar Carrinho
            </button>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
import { carrinhoService } from "@/services/carrinhoService";

export default {
  name: "MeuCarrinho",
  components: {
    CabecalhoInterno,
  },
  data() {
    return {
      // Começamos com um objeto 'carrinho' estruturado para evitar erros no template
      carrinho: { ferramentas: [] },
      isLoading: true,
      erro: null,
    };
  },
  computed: {
    /**
     * Calcula o valor total das diárias dos itens no carrinho.
     */
    valorTotal() {
      if (!this.carrinho || !this.carrinho.ferramentas) {
        return 0;
      }
      // O 'reduce' soma todos os valores
      return this.carrinho.ferramentas.reduce((total, item) => {
        return total + parseFloat(item.ferramenta.diaria);
      }, 0); // Começa com 0
    }
  },
  methods: {
    /**
     * Busca os dados do carrinho na API.
     */
    async carregarCarrinho() {
      this.isLoading = true;
      this.erro = null;
      try {
        const response = await carrinhoService.getMeuCarrinho();
        // O response.data é o seu CarrinhoSchema
        this.carrinho = response.data;
      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
        this.erro = "Não foi possível carregar seu carrinho. Tente novamente.";
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Remove um item do carrinho e recarrega a lista.
     */
    async removerItem(id) {
      // Opcional: Adicionar um 'isLoadingItem' para feedback no item
      try {
        await carrinhoService.removerDoCarrinho(id);
        // Recarrega o carrinho para refletir a mudança
        await this.carregarCarrinho();
      } catch (err) {
        console.error("Erro ao remover item:", err);
        alert("Não foi possível remover o item.");
      }
    },

    /**
     * Esvazia o carrinho e recarrega.
     */
    async esvaziarCarrinho() {
      // Adicionar um confirm() é uma boa prática
      if (!confirm("Tem certeza que deseja esvaziar seu carrinho?")) {
        return; // Para se o usuário clicar "Cancelar"
      }

      try {
        await carrinhoService.limparCarrinho();
        // Recarrega o carrinho (que agora virá vazio)
        await this.carregarCarrinho();
      } catch (err) {
        console.error("Erro ao limpar carrinho:", err);
        alert("Não foi possível limpar o carrinho.");
      }
    },

    /**
     * Formata um valor numérico para R$ (reais).
     */
    formatarPreco(valor) {
      const numero = parseFloat(valor);
      if (isNaN(numero)) return "R$ 0,00";
      return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }
  },
  created() {
    // Carrega o carrinho assim que a página é criada
    this.carregarCarrinho();
  }
};
</script>

<style scoped>
/* Pegando 'container' do seu CSS para manter a largura */
.container {
  width: 95%;
  margin: 0 auto;
}

.titulo-carrinho {
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

/* Layout principal com 2 colunas */
.carrinho-container {
  display: flex;
  flex-wrap: wrap; /* Para telas menores */
  gap: 30px;
  margin-bottom: 75px;
}

/* Coluna da Esquerda (Lista) */
.carrinho-lista {
  flex: 3; /* Ocupa 3 partes do espaço */
  min-width: 300px; /* Largura mínima */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.carrinho-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #ffffff;
  border: 1px solid #D0DFEE;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.item-imagem {
  width: 100px;
  height: 100px;
  object-fit: contain;
  background: #e9eff7;
  border-radius: 8px;
  padding: 5px;
}

.item-detalhes {
  flex: 1; /* Ocupa o espaço restante */
}

.item-nome {
  font-size: 1.2rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 5px 0;
}

.item-categoria {
  background-color: #f7f9fc;
  border: 1px solid #d1d9e6;
  color: #00000090;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.item-preco {
  font-weight: 700;
  font-size: 1.1rem;
  color: #000;
  margin-top: 10px;
}

.item-remover {
  background: none;
  border: none;
  color: #dc2626; /* Vermelho */
  font-weight: 600;
  cursor: pointer;
  padding: 5px;
}
.item-remover:hover {
  text-decoration: underline;
}

/* Coluna da Direita (Resumo) */
.carrinho-resumo {
  flex: 1; /* Ocupa 1 parte do espaço */
  min-width: 280px;
  background: #f7f9fc;
  border: 1px solid #d1d9e6;
  border-radius: 10px;
  padding: 25px;
  height: fit-content; /* Altura se ajusta ao conteúdo */
}

.carrinho-resumo h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  border-bottom: 1px solid #d1d9e6;
  padding-bottom: 15px;
}

.resumo-linha, .resumo-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1rem;
}
.resumo-linha span:first-child {
  color: #555;
}
.resumo-linha span:last-child {
  font-weight: 600;
}

.resumo-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
  border-top: 1px solid #d1d9e6;
  padding-top: 15px;
  margin-top: 10px;
}

.botao-finalizar {
  /* Reutilizando seu estilo .alugar */
  background-color: #f97316;
  border: none;
  text-align: center;
  color: white;
  font-weight: 600;
  padding: 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  font-size: 1rem;
  width: 100%;
  margin-top: 10px;
}
.botao-finalizar:hover {
  background-color: #d86400;
}

.botao-limpar-carrinho {
  background: none;
  border: none;
  color: #dc2626;
  font-weight: 600;
  width: 100%;
  margin-top: 15px;
  cursor: pointer;
}
.botao-limpar-carrinho:hover {
  text-decoration: underline;
}

/* Estado de Carrinho Vazio */
.aviso-vazio {
  text-align: center;
  padding: 40px;
  border: 1px dashed #d1d9e6;
  border-radius: 10px;
  background-color: #f7f9fc;
  margin-bottom: 75px;
}
.aviso-vazio p {
  font-size: 1.2rem;
  color: #555;
  margin: 0 0 20px 0;
}
.botao-carrinho-vazio {
  /* Estilo botão laranja */
  background-color: #f97316;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.botao-carrinho-vazio:hover {
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
  flex-basis: 100%;
  grid-column: 1 / -1;
}
.aviso-carregando { color: #333; }
.aviso-erro { background-color: #ffebee; color: #c62828; border: 1px solid #c62828; }

</style>
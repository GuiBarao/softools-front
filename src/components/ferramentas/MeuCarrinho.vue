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
              <img 
                :src="item.ferramenta.urlFoto || '../../../public/img/ferramenta1.png'" 
                :alt="item.ferramenta.nome" 
                class="item-imagem"
              >
              <div class="item-detalhes">
                <h3 class="item-nome">{{ item.ferramenta.nome }}</h3>
                <span class="item-categoria">{{ item.ferramenta.categoria }}</span>
                <div class="item-preco">{{ formatarPreco(item.ferramenta.diaria) }} / dia</div>
              </div>
              
              <div class="item-quantidade">
                <label :for="'qnt-' + item.ferramenta.id">Qntd:</label>
                <input 
                  :id="'qnt-' + item.ferramenta.id"
                  type="number" 
                  v-model.number="quantidades[item.ferramenta.id]"
                  min="1"
                >
              </div>

              <button @click="removerItem(item.ferramenta.id)" class="item-remover">
                Remover
              </button>
            </div>
          </div>

          <div class="carrinho-resumo">
            <h3>Resumo do Aluguel</h3>
            
            <div class="form-group">
              <label for="data-inicio">Data de Início</label>
              <input type="date" id="data-inicio" v-model="dataInicio" :min="hoje" required>
            </div>

            <div class="form-group">
              <label for="data-devolucao">Data de Devolução</label>
              <input type="date" id="data-devolucao" v-model="dataDevolucao" :min="dataInicio || hoje" required>
            </div>

            <div v-if="erroDatas" class="aviso-datas-erro">
              {{ erroDatas }}
            </div>
            
            <div class="resumo-linha">
              <span>Subtotal (diárias)</span>
              <span>{{ formatarPreco(subtotalDiario) }}</span>
            </div>
            <div class="resumo-linha">
              <span>Dias de Aluguel</span>
              <strong>{{ quantidadeDias }} dia(s)</strong>
            </div>
            <div class="resumo-linha">
              <span>Taxa de Serviço</span>
              <span>{{ formatarPreco(0) }}</span> 
            </div>
            <div class="resumo-total">
              <span>Total Estimado</span>
              <span>{{ formatarPreco(valorTotal) }}</span>
            </div>
            
            <button 
              @click="handleCheckout" 
              :disabled="isCheckingOut || !datasSaoValidas"
              class="botao-finalizar"
            >
              {{ isCheckingOut ? 'Processando...' : 'Finalizar Aluguel' }}
            </button>
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
// Corrigindo os caminhos de importação para ../../ (baseado no seu 'CabecalhoInterno')
import { carrinhoService } from "../../services/carrinhoService"; 
import { pedidosService } from "../../services/pedidosService";
import { ferramentaService } from "../../services/ferramentaService";

export default {
  name: "MeuCarrinho",
  components: {
    CabecalhoInterno,
  },
  data() {
    return {
      carrinho: { ferramentas: [] },
      isLoading: true,
      erro: null,
      isCheckingOut: false,
      quantidades: {}, 
      dataInicio: '',
      dataDevolucao: '',
      erroDatas: null
    };
  },
  computed: {
    hoje() {
      return new Date().toISOString().split('T')[0];
    },

    quantidadeDias() {
      if (!this.dataInicio || !this.dataDevolucao) {
        return 0;
      }
      try {
        const inicio = new Date(this.dataInicio + 'T00:00:00');
        const fim = new Date(this.dataDevolucao + 'T00:00:00');

        if (fim < inicio) {
          return 0;
        }
        
        const diffTime = fim.getTime() - inicio.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays + 1;
      } catch (e) {
        return 0;
      }
    },

    datasSaoValidas() {
      return this.quantidadeDias > 0;
    },

    subtotalDiario() {
      if (!this.carrinho || !this.carrinho.ferramentas) return 0;

      return this.carrinho.ferramentas.reduce((total, item) => {
        const diaria = parseFloat(item.ferramenta.diaria);
        const qntd = this.quantidades[item.ferramenta.id] || 1;
        return total + (diaria * qntd);
      }, 0);
    },

    valorTotal() {
      return this.subtotalDiario * this.quantidadeDias;
    }
  },
  methods: {
    async carregarCarrinho() {
      this.isLoading = true;
      this.erro = null;
      try {
        const response = await carrinhoService.getMeuCarrinho();

        // 1. Adiciona o campo 'urlFoto: null' em cada item
        response.data.ferramentas.forEach(item => {
          if (item.ferramenta) {
            item.ferramenta.urlFoto = null;
          }
        });
        
        this.carrinho = response.data;

        // 2. INICIALIZA O MAPA DE QUANTIDADES
        const novasQuantidades = {};
        for (const item of this.carrinho.ferramentas) {
          novasQuantidades[item.ferramenta.id] = this.quantidades[item.ferramenta.id] || 1;
        }
        this.quantidades = novasQuantidades;

        // 3. CHAMA A BUSCA DE FOTOS (sem await, para não bloquear)
        this.buscarFotosDoCarrinho();

      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
        this.erro = "Não foi possível carregar seu carrinho. Tente novamente.";
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Itera sobre os itens do carrinho e busca a primeira foto de cada um.
     */
    buscarFotosDoCarrinho() {
      this.carrinho.ferramentas.forEach(async (item) => {
        const ferramenta = item.ferramenta;
        
        // Verifica se o item existe e tem a lista de fotos
        // (Isso agora vai funcionar, pois o backend envia 'ids_foto')
        // *** ATENÇÃO: Seu schema está 'ids_foto', o código está 'ids_fotos'. Ajustei para 'ids_foto' ***
        if (ferramenta && ferramenta.ids_foto && ferramenta.ids_foto.length > 0) {
          const idFoto = ferramenta.ids_foto[0]; // Pega o primeiro ID
          try {
            const response = await ferramentaService.getFotoFerramenta(idFoto);
            ferramenta.urlFoto = URL.createObjectURL(response.data);
          } catch (err) {
            console.error(`Falha ao carregar foto ${idFoto} para ${ferramenta.nome}`, err);
          }
        }
      });
    },

    async removerItem(id) {
      try {
        await carrinhoService.removerDoCarrinho(id);
        await this.carregarCarrinho();
      } catch (err) {
        console.error("Erro ao remover item:", err);
        alert("Não foi possível remover o item.");
      }
    },

    async esvaziarCarrinho() {
      if (!confirm("Tem certeza que deseja esvaziar seu carrinho?")) {
        return;
      }

      try {
        await carrinhoService.limparCarrinho();
        this.quantidades = {};
        await this.carregarCarrinho();
      } catch (err) {
        console.error("Erro ao limpar carrinho:", err);
        alert("Não foi possível limpar o carrinho.");
      }
    },

    formatarPreco(valor) {
      const numero = parseFloat(valor);
      if (isNaN(numero)) return "R$ 0,00";
      return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    },

    async handleCheckout() {
      this.erro = null;
      this.erroDatas = null;

      if (!this.datasSaoValidas) {
        this.erroDatas = "Por favor, selecione uma data de início e devolução válidas.";
        return;
      }

      this.isCheckingOut = true;

      try {
        const ferramentasPayload = this.carrinho.ferramentas.map(item => ({
          id_ferramenta: item.ferramenta.id,
          quantidade: this.quantidades[item.ferramenta.id] || 1
        }));

        const payload = {
          ferramentas: ferramentasPayload,
          quantidade_dias: this.quantidadeDias,
          data_inicio: new Date(this.dataInicio + 'T00:00:00').toISOString(),
          data_devolucao: new Date(this.dataDevolucao + 'T00:00:00').toISOString(),
          alugada: false 
        };

        const response = await pedidosService.registrarPedido(payload);
        const { chave_pix } = response.data;
        const valorFinal = this.valorTotal; 

        await carrinhoService.limparCarrinho();

        this.$router.push({ 
          name: 'PagamentoPix', 
          state: { 
            chavePix: chave_pix, 
            valor: valorFinal 
          } 
        });

      } catch (err) {
        console.error("Erro ao finalizar pedido:", err);
        this.erro = "Não foi possível finalizar seu pedido. Tente novamente.";
      } finally {
        this.isCheckingOut = false;
      }
    }
  },
  created() {
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
  gap: 15px; /* Reduzido o gap */
  background: #ffffff;
  border: 1px solid #D0DFEE;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.item-imagem {
  width: 80px; /* Reduzido */
  height: 80px; /* Reduzido */
  object-fit: contain;
  background: #e9eff7;
  border-radius: 8px;
  padding: 5px;
}

.item-detalhes {
  flex: 1; /* Ocupa o espaço restante */
}

.item-nome {
  font-size: 1.1rem; /* Reduzido */
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
  font-size: 1rem; /* Reduzido */
  color: #000;
  margin-top: 8px;
}

/* Estilo para Quantidade */
.item-quantidade {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.item-quantidade label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
}
.item-quantidade input {
  width: 55px;
  padding: 5px 8px;
  font-size: 1rem;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  text-align: center;
}

.item-remover {
  background: none;
  border: none;
  color: #dc2626; /* Vermelho */
  font-weight: 600;
  cursor: pointer;
  padding: 5px;
  margin-left: 5px;
}
.item-remover:hover {
  text-decoration: underline;
}

/* Coluna da Direita (Resumo) */
.carrinho-resumo {
  flex: 1; /* Ocupa 1 parte do espaço */
  min-width: 300px; /* Aumentado */
  background: #f7f9fc;
  border: 1px solid #d1d9e6;
  border-radius: 10px;
  padding: 25px;
  height: fit-content; /* Altura se ajusta ao conteúdo */
}

/* Estilo para Formulário de Datas */
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px 10px;
  font-size: 1rem;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  box-sizing: border-box;
}

.aviso-datas-erro {
  font-size: 0.9rem;
  color: #c62828;
  font-weight: 500;
  margin-bottom: 10px;
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
.resumo-linha span:last-child,
.resumo-linha strong {
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
  background-color: #f97316;
  border: none;
  text-align: center;
  color: white;
  font-weight: 600;
  padding: 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  text-decoration: none;
  font-size: 1rem;
  width: 100%;
  margin-top: 10px;
}
.botao-finalizar:hover:not(:disabled) {
  background-color: #d86400;
}
.botao-finalizar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  flex-basis: 100%;
  grid-column: 1 / -1;
}
.aviso-carregando { color: #333; }
.aviso-erro { background-color: #ffebee; color: #c62828; border: 1px solid #c62828; }
</style>
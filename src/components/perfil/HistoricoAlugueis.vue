<template>
  <div>
    <CabecalhoInterno />

    <main>
      <div class="container">
        <h1 class="titulo-pagina">Histórico de Aluguéis</h1>
        <p class="subtitulo-pagina">Veja todas as ferramentas que você já alugou.</p>

        <div v-if="isLoading" class="aviso-carregando">
          Carregando seu histórico...
        </div>

        <div v-if="!isLoading && erro" class="aviso-erro">
          {{ erro }}
        </div>

        <div v-if="!isLoading && !erro && historico.length === 0" class="aviso-vazio">
          <p>Você ainda não alugou nenhuma ferramenta.</p>
          <router-link to="/ferramentas" class="botao-acao-vazio">
            Ver Ferramentas Disponíveis
          </router-link>
        </div>

        <div class="lista-container" v-if="!isLoading && !erro && historico.length > 0">

          <div 
            class="item-lista" 
            v-for="(item, index) in historico" 
            :key="index"
          >
            <img 
              :src="item.produto.urlFoto || '../../../public/img/ferramenta1.png'" 
              :alt="item.produto.nome" 
              class="item-imagem"
            >
            
            <div class="item-detalhes">
              <h3 class="item-nome">{{ item.produto.nome }}</h3>
              
              <div class="item-data">
                Alugado em: <strong>{{ formatarData(item.timestamp) }}</strong>
              </div>
              
              <span class="item-categoria">{{ item.produto.categoria }}</span>
              <div class="item-preco">{{ formatarPreco(item.produto.diaria) }} / dia</div>
            </div>
            
            <div class="item-acoes">
              <router-link :to="'/ferramenta/' + item.produto.id" class="item-ver-novamente">
                Ver Novamente
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
// Corrigindo o caminho para ../../ (baseado no seu 'CabecalhoInterno')
import { historicoService } from "../../services/historicoService";
// === IMPORTAR O ferramentaService ===
import { ferramentaService } from "../../services/ferramentaService";

export default {
  name: "HistoricoAlugueis",
  components: {
    CabecalhoInterno,
  },
  data() {
    return {
      historico: [], // A lista de ItemHistoricoSchema
      isLoading: true,
      erro: null,
    };
  },
  methods: {
    /**
     * Busca os dados do histórico do usuário na API.
     */
    async carregarHistorico() {
      this.isLoading = true;
      this.erro = null;
      try {
        const response = await historicoService.getHistorico();
        
        // === MUDANÇA AQUI ===
        // 1. Adiciona o campo 'urlFoto: null' em cada produto
        response.data.forEach(item => {
          if (item.produto) {
            item.produto.urlFoto = null;
          }
        });

        this.historico = response.data;
        
        // 2. Chama a busca de fotos (sem await, para não bloquear)
        this.buscarFotosDoHistorico();

      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
        this.erro = "Não foi possível carregar seu histórico. Tente novamente.";
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * === NOVO MÉTODO ===
     * Itera sobre o histórico e busca a foto de cada produto.
     */
    buscarFotosDoHistorico() {
      this.historico.forEach(async (item) => {
        const produto = item.produto;

        // Verifica se o produto existe e tem a lista de fotos
        // (Ajustado para 'ids_foto' como no seu schema)
        if (produto && produto.ids_foto && produto.ids_foto.length > 0) {
          const idFoto = produto.ids_foto[0]; // Pega o primeiro ID
          try {
            const response = await ferramentaService.getFotoFerramenta(idFoto);
            produto.urlFoto = URL.createObjectURL(response.data);
          } catch (err) {
            console.error(`Falha ao carregar foto ${idFoto} para ${produto.nome}`, err);
          }
        }
      });
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
    },

    /**
     * Formata a string de data (datetime) para um formato legível.
     */
    formatarData(timestamp) {
      if (!timestamp) return 'Data indisponível';
      try {
        const data = new Date(timestamp);
        // Formata para "dd/mm/aaaa, HH:MM"
        return data.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return timestamp; // Retorna a string original se falhar
      }
    }
  },
  created() {
    // Carrega o histórico assim que a página é criada
    this.carregarHistorico();
  }
};
</script>

<style scoped>
/* Container principal */
.container {
  width: 95%;
  max-width: 900px;
  margin: 40px auto 75px auto;
}

.titulo-pagina {
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 5px;
}
.subtitulo-pagina {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

/* Lista de Itens */
.lista-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-lista {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #ffffff;
  border: 1px solid #D0DFEE;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  flex-wrap: wrap;
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
  flex: 1;
  min-width: 200px;
}

.item-nome {
  font-size: 1.2rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 5px 0;
}

.item-data {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
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

/* Botões de Ação */
.item-acoes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: auto; /* Alinha à direita */
}
.item-ver-novamente {
  /* Estilo do botão laranja .alugar */
  background-color: #f97316;
  color: white;
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  width: 120px;
  text-align: center;
  text-decoration: none;
}
.item-ver-novamente:hover {
  background-color: #d86400;
}


/* Estado de Lista Vazia */
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
.botao-acao-vazio {
  background-color: #f97316;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.botao-acao-vazio:hover {
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
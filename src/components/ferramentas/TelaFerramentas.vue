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
            <button 
              class="filtro" 
              :class="{ 'ativo': filtroCategoriaAtivo === 'TODAS' }"
              @click="filtrarPorCategoria('TODAS')">
              Todas
            </button>
            <button 
              class="filtro" 
              :class="{ 'ativo': filtroCategoriaAtivo === 'MANUAL' }"
              @click="filtrarPorCategoria('MANUAL')">
              Manuais
            </button>
            <button 
              class="filtro" 
              :class="{ 'ativo': filtroCategoriaAtivo === 'ELETRICA' }"
              @click="filtrarPorCategoria('ELETRICA')">
              Elétricas
            </button>
            <button 
              class="filtro" 
              :class="{ 'ativo': filtroCategoriaAtivo === 'MEDICAO' }"
              @click="filtrarPorCategoria('MEDICAO')">
              Medição
            </button>
          </div>
        </section>
        
        <section class="localizacao">
          <h2>Localização (UF)</h2>
          <div class="filtros">
            <button 
              class="filtro"
              :class="{ 'ativo': filtroUfAtivo === 'TODAS' }"
              @click="filtrarPorUf('TODAS')">
              Brasil
            </button>
            
            <button
              v-for="uf in ufs"
              :key="uf"
              class="filtro"
              :class="{ 'ativo': filtroUfAtivo === uf }"
              @click="filtrarPorUf(uf)"
            >
              {{ uf }}
            </button>
          </div>
        </section>

        <section class="disponibilidade">
          <h2>Disponibilidade</h2>
          <div class="filtros">
            <button 
              class="filtro"
              :class="{ 'ativo': filtroStatusAtivo === 'TODOS' }"
              @click="filtrarPorStatus('TODOS')">
              Todos
            </button>
            <button 
              class="filtro"
              :class="{ 'ativo': filtroStatusAtivo === 'DISPONIVEL' }"
              @click="filtrarPorStatus('DISPONIVEL')">
              Disponível
            </button>
            <button 
              class="filtro"
              :class="{ 'ativo': filtroStatusAtivo === 'INDISPONIVEL' }"
              @click="filtrarPorStatus('INDISPONIVEL')">
              Indisponível
            </button>
          </div>
        </section>

        <section class="pesquisa-local">
          <h2>Pesquisar</h2>
          <div class="pesquisa-wrapper">
            <input 
              type="text" 
              placeholder="Buscar por nome ou descrição..." 
              v-model="termoBusca"
            />
            <img src="../../../public/img/search.png" alt="icone-lupa" class="icone-lupa" />
          </div>
        </section>


        <section class="ferramentas">

          <div v-if="isLoading" class="aviso-carregando">
            Buscando ferramentas...
          </div>

          <div v-if="!isLoading && erro" class="aviso-erro">
            {{ erro }}
          </div>
          
          <div v-if="!isLoading && !erro && ferramentasFiltradas.length === 0" class="aviso-vazio">
            <span>Nenhuma ferramenta encontrada para esta combinação de filtros.</span>
          </div>

          <template v-if="!isLoading && !erro && ferramentasFiltradas.length > 0">
            <div
              class="card"
              v-for="ferramenta in ferramentasFiltradas"
              :key="ferramenta.id"
            >
              <img
                :src="ferramenta.urlFoto ? ferramenta.urlFoto : '../../../public/img/ferramenta1.png'"
                :alt="ferramenta.nome" 
              />
              <div class="conteudo-card">
                <h3>{{ ferramenta.nome }}</h3>
                <div class="estrela">
                  {{ gerarEstrelas(ferramenta.avaliacao) }}
                  ({{ ferramenta.quantidade_avaliacoes }})
                </div>
                <div class="preco">{{ formatarPreco(ferramenta.diaria) }} / dia</div>
                <router-link :to="'/ferramenta/' + ferramenta.id" class="alugar">
                  Alugar Agora
                </router-link>
              </div>
            </div>
          </template>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
// Corrigido para o caminho relativo
import { ferramentaService } from "../../services/ferramentaService";

export default {
  name: "TelaFerramentas",
  components: {
    CabecalhoInterno,
  },

  data() {
    return {
      ferramentas: [], // A "Master List" vinda da API
      isLoading: true,
      erro: null,
      
      // === NOVO ESTADO PARA A PESQUISA ===
      termoBusca: '', // O texto do input de pesquisa

      // Filtros Server-Side
      filtroUfAtivo: 'TODAS',
      filtroStatusAtivo: 'TODOS',
      
      // Filtro Client-Side
      filtroCategoriaAtivo: 'TODAS', 
      
      // Lista de UFs
      ufs: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
        'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 
        'SC', 'SP', 'SE', 'TO'
      ]
    };
  },
  
  computed: {
    /**
     * Propriedade computada que aplica os filtros CLIENT-SIDE
     * (Categoria e Pesquisa) na lista 'ferramentas'.
     */
    ferramentasFiltradas() {
      // 1. Começa com a lista completa (já filtrada pela API)
      let listaFiltrada = this.ferramentas; 

      // 2. Aplica o filtro de CATEGORIA (client-side)
      if (this.filtroCategoriaAtivo !== 'TODAS') {
        listaFiltrada = listaFiltrada.filter(ferramenta =>
          ferramenta.categoria === this.filtroCategoriaAtivo
        );
      }
      
      // 3. Aplica o filtro de PESQUISA (client-side)
      if (this.termoBusca && this.termoBusca.trim() !== '') {
        const termo = this.termoBusca.toLowerCase().trim();
        
        listaFiltrada = listaFiltrada.filter(ferramenta => {
          // Procura no nome OU na descrição
          const nomeMatch = ferramenta.nome.toLowerCase().includes(termo);
          const descMatch = ferramenta.descricao.toLowerCase().includes(termo);
          return nomeMatch || descMatch;
        });
      }
      
      return listaFiltrada;
    }
  },

  methods: {
    // === MÉTODOS DE FILTRO ===
    filtrarPorStatus(status) {
      this.filtroStatusAtivo = status;
      this.carregarFerramentas(); // Chama a API
    },

    filtrarPorUf(uf) {
      this.filtroUfAtivo = uf;
      this.carregarFerramentas(); // Chama a API
    },
    
    filtrarPorCategoria(categoria) {
      this.filtroCategoriaAtivo = categoria;
      // Não chama a API, o 'computed' cuida disso
    },
 
    // === MÉTODOS DE DADOS ===

    async carregarFerramentas() {
      this.isLoading = true;
      this.erro = null;
      
      // Monta filtros para a API (Server-Side)
      const filtrosApi = {};
      if (this.filtroUfAtivo !== 'TODAS') {
        filtrosApi.uf = this.filtroUfAtivo;
      }
      if (this.filtroStatusAtivo !== 'TODOS') {
        filtrosApi.status = this.filtroStatusAtivo;
      }

      try {
        const response = await ferramentaService.getFerramentas(filtrosApi);
        
        const ferramentasComUrl = response.data.map(tool => ({
          ...tool,
          urlFoto: null // Começa como nulo
        }));
        
        this.ferramentas = ferramentasComUrl; 
        
        // Dispara a busca das fotos em segundo plano
        this.buscarFotosParaFerramentas();

      } catch (err) {
        console.error("Erro ao carregar ferramentas:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.erro = "Sua sessão expirou. Por favor, faça login novamente.";
        } else {
          this.erro = "Não foi possível carregar as ferramentas. Tente mais tarde.";
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    buscarFotosParaFerramentas() {
      this.ferramentas.forEach(async (ferramenta) => {
        if (ferramenta.ids_fotos && ferramenta.ids_fotos.length > 0) {
          const idFoto = ferramenta.ids_fotos[0];
          try {
            const response = await ferramentaService.getFotoFerramenta(idFoto);
            ferramenta.urlFoto = URL.createObjectURL(response.data);
          } catch (err) {
            console.error(`Falha ao carregar foto ${idFoto} para ${ferramenta.nome}`, err);
            ferramenta.urlFoto = null;
          }
        }
      });
    },

    // === MÉTODOS DE FORMATAÇÃO ===

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

  created() {
    this.carregarFerramentas();
  }
};
</script>

<style src="../../assets/css/style_ferramentas.css"></style>

<style scoped>
/* Estilos para as seções de filtro */
.localizacao,
.disponibilidade,
.pesquisa-local {
  margin-top: 30px; 
}
.localizacao h2,
.disponibilidade h2,
.pesquisa-local h2 {
  font-size: 1.4rem;
  margin-bottom: 10px;
}

/* === ESTILO PARA A NOVA BARRA DE PESQUISA === */
/* (Baseado no estilo do seu cabeçalho) */
.pesquisa-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px; /* Limita a largura */
}
.pesquisa-wrapper input {
  width: 100%;
  padding: 12px 15px;
  padding-right: 45px; /* Espaço para a lupa */
  font-size: 1rem;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  box-sizing: border-box;
}
.pesquisa-wrapper input:focus {
  border-color: #f97316;
  outline: none;
  box-shadow: 0 0 0 3px #f9731633;
}
.pesquisa-wrapper .icone-lupa {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0.5;
}


/* Avisos (Carregando, Erro, Vazio) */
.aviso-carregando,
.aviso-erro,
.aviso-vazio {
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
.aviso-vazio { color: #555; }
.aviso-vazio span { font-weight: 600; }
</style>
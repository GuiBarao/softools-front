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
                src="../../../public/img/ferramenta1.png"
                :alt="ferramenta.nome" />
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
import { ferramentaService } from "@/services/ferramentaService";

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
      
      // Filtro de Categoria (Client-side)
      filtroCategoriaAtivo: 'TODAS', 
      
      // Filtro de UF (Server-side)
      filtroUfAtivo: 'TODAS', // 'TODAS' significa "sem filtro"

      // --- PASSO 2: Adicionar o novo estado de filtro ---
      filtroStatusAtivo: 'TODOS', // 'TODOS' significa "sem filtro"
      
      // Lista de UFs para o v-for
      ufs: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
        'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 
        'SC', 'SP', 'SE', 'TO'
      ]
    };
  },
  
  computed: {
    // Filtro CLIENT-SIDE (roda depois que a API retorna)
    ferramentasFiltradas() {
      if (this.filtroCategoriaAtivo === 'TODAS') {
        return this.ferramentas;
      }
      return this.ferramentas.filter(ferramenta => {
        return ferramenta.categoria === this.filtroCategoriaAtivo;
      });
    }
  },

  methods: {
    // --- PASSO 3: Criar o novo método de filtro de Status ---
    /**
     * Atualiza o filtro de Status e chama a API novamente.
     */
    filtrarPorStatus(status) {
      this.filtroStatusAtivo = status;
      // Chama a API para recarregar as ferramentas com o novo filtro
      this.carregarFerramentas();
    },

    /**
     * Atualiza o filtro de UF e chama a API novamente.
     */
    filtrarPorUf(uf) {
      this.filtroUfAtivo = uf;
      this.carregarFerramentas(); 
    },
    
    /**
     * Atualiza o filtro de categoria (CLIENT-SIDE).
     * Não chama a API.
     */
    filtrarPorCategoria(categoria) {
      this.filtroCategoriaAtivo = categoria;
    },
  
    // --- PASSO 4: Modificar o carregarFerramentas ---
    /**
     * Método que chama a API.
     * Agora ele verifica AMBOS os filtros server-side.
     */
    async carregarFerramentas() {
      this.isLoading = true;
      this.erro = null;
      
      // 1. Monta o objeto de filtros para a API
      const filtrosApi = {};
      
      // 2. Adiciona o filtro de UF se não for 'TODAS'
      if (this.filtroUfAtivo !== 'TODAS') {
        filtrosApi.uf = this.filtroUfAtivo;
      }
      
      // 3. Adiciona o filtro de Status se não for 'TODOS'
      if (this.filtroStatusAtivo !== 'TODOS') {
        filtrosApi.status = this.filtroStatusAtivo;
      }

      try {
        // 4. Passa o objeto de filtros (com uf, status, ou ambos) para o serviço
        const response = await ferramentaService.getFerramentas(filtrosApi);
        
        this.ferramentas = response.data; 

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

    // Métodos de formatação (sem alterações)
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
    this.carregarFerramentas(); // Chama o método na criação (sem filtros)
  }
};
</script>

<style src="../../assets/css/style_ferramentas.css"></style>

<style scoped>
/* Seções de Filtro */
.localizacao,
.disponibilidade {
  margin-top: 30px; /* Adiciona espaço entre as seções de filtro */
}
.localizacao h2,
.disponibilidade h2 {
  font-size: 1.4rem;
  margin-bottom: 10px;
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
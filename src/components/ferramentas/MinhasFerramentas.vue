<template>
  <div>
    <CabecalhoInterno />

    <main>
      <div class="container">
        <h1 class="titulo-pagina">Minhas Ferramentas</h1>
        <p class="subtitulo-pagina">Gerencie as ferramentas que você cadastrou para aluguel.</p>

        <div v-if="isLoading" class="aviso-carregando">
          Carregando suas ferramentas...
        </div>
        <div v-if="!isLoading && erro" class="aviso-erro">
          {{ erro }}
        </div>

        <div v-if="!isLoading && !erro && ferramentas.length === 0" class="aviso-vazio">
          <p>Você ainda não cadastrou nenhuma ferramenta.</p>
          <router-link to="/cadastrar-ferramenta" class="botao-acao-vazio">
            Cadastrar Minha Primeira Ferramenta
          </router-link>
        </div>

        <div class="lista-container" v-if="!isLoading && !erro && ferramentas.length > 0">

          <div 
            class="item-lista" 
            v-for="ferramenta in ferramentas" 
            :key="ferramenta.id"
          >
            <img src="../../../public/img/ferramenta1.png" :alt="ferramenta.nome" class="item-imagem">
            
            <div class="item-detalhes">
              <h3 class="item-nome">{{ ferramenta.nome }}</h3>
              <div class="item-status" :class="ferramenta.status === 'DISPONIVEL' ? 'status-disponivel' : 'status-indisponivel'">
                {{ ferramenta.status }}
              </div>
              <span class="item-categoria">{{ ferramenta.categoria }}</span>
              <div class="item-preco">{{ formatarPreco(ferramenta.diaria) }} / dia</div>
            </div>
            
            <div class="item-acoes">
              <button 
                @click="handleDelete(ferramenta.id)" 
                class="item-excluir"
                :disabled="deletandoId === ferramenta.id"
              >
                {{ deletandoId === ferramenta.id ? 'Excluindo...' : 'Excluir' }}
              </button>
              
              <button class="item-editar" @click="abrirModal(ferramenta)">
                Editar
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>

    <div class="modal-overlay" v-if="showModal" @click.self="fecharModal">
      
      <div class="modal-content" v-if="ferramentaParaEditar">
        
        <form @submit.prevent="handleUpdate">
          
          <div class="modal-header">
            <h2>Editar Ferramenta</h2>
            <button @click="fecharModal" type="button" class="modal-close">&times;</button>
          </div>
          
          <div class="modal-body">
            
            <div v-if="modalErro" class="aviso-erro modal-aviso">{{ modalErro }}</div>

            <div class="form-group">
              <h3>Nome da Ferramenta</h3>
              <input type="text" v-model="ferramentaParaEditar.nome" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <h3>Valor da Diária (R$)</h3>
                <input type="number" v-model="ferramentaParaEditar.diaria" step="0.01" min="0" required />
              </div>
              <div class="form-group">
                <h3>Quantidade em Estoque</h3>
                <input type="number" v-model="ferramentaParaEditar.quantidade_estoque" min="0" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <h3>Categoria</h3>
                <select v-model="ferramentaParaEditar.categoria" required>
                  <option value="MANUAL">Manual</option>
                  <option value="ELETRICA">Elétrica</option>
                  <option value="PNEUMATICA">Pneumática</option>
                  <option value="HIDRAULICA">Hidráulica</option>
                  <option value="MEDICAO">Medição</option>
                </select>
              </div>
              <div class="form-group">
                <h3>Status</h3>
                <select v-model="ferramentaParaEditar.status" required>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="INDISPONIVEL">Indisponível</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <h3>Descrição</h3>
              <textarea v-model="ferramentaParaEditar.descricao" rows="4" required></textarea>
            </div>

            <div class="form-group">
              <h3>Chave PIX</h3>
              <input type="text" v-model="ferramentaParaEditar.chave_pix" required />
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="fecharModal" type="button" class="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" class="btn-salvar" :disabled="isUpdating">
              {{ isUpdating ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>

      </div>
    </div>
    </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
// O serviço já deve conter o método 'atualizarFerramenta'
import { ferramentaService } from "@/services/ferramentaService";

export default {
  name: "MinhasFerramentas",
  components: {
    CabecalhoInterno,
  },
  data() {
    return {
      // --- Estados da Página ---
      ferramentas: [], 
      isLoading: true,
      erro: null,
      deletandoId: null,
      
      // --- === Estados do Modal (NOVOS) === ---
      showModal: false,
      ferramentaParaEditar: null, // Guarda o objeto da ferramenta clicada
      isUpdating: false,          // Feedback do botão "Salvar"
      modalErro: null,            // Erro específico do modal
    };
  },
  methods: {
    /**
     * Busca os dados das ferramentas do usuário na API.
     */
    async carregarMinhasFerramentas() {
      this.isLoading = true;
      this.erro = null;
      try {
        const response = await ferramentaService.getMinhasFerramentas();
        this.ferramentas = response.data;
      } catch (err) {
        console.error("Erro ao carregar ferramentas:", err);
        this.erro = "Não foi possível carregar suas ferramentas. Tente novamente.";
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Exclui uma ferramenta.
     */
    async handleDelete(id) {
      if (!confirm("Tem certeza que deseja excluir esta ferramenta?\nEsta ação é permanente.")) {
        return;
      }
      this.deletandoId = id;
      try {
        await ferramentaService.excluirFerramenta(id);
        this.ferramentas = this.ferramentas.filter(f => f.id !== id);
      } catch (err) {
        console.error("Erro ao excluir ferramenta:", err);
        alert("Não foi possível excluir a ferramenta. Tente novamente.");
      } finally {
        this.deletandoId = null;
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
    },

    // --- === MÉTODOS NOVOS DO MODAL === ---

    /**
     * Abre o modal e preenche com os dados da ferramenta selecionada.
     */
    abrirModal(ferramenta) {
      // Cria uma CÓPIA PROFUNDA do objeto.
      // Isso é crucial para que as edições no modal não afetem
      // a lista principal antes de salvar.
      this.ferramentaParaEditar = JSON.parse(JSON.stringify(ferramenta));
      
      this.showModal = true;
      this.modalErro = null;
    },

    /**
     * Fecha o modal e limpa os dados.
     */
    fecharModal() {
      this.showModal = false;
      this.ferramentaParaEditar = null;
      this.isUpdating = false;
      this.modalErro = null;
    },

    /**
     * Chamado pelo @submit do formulário do modal.
     * Envia os dados atualizados para a API.
     */
    async handleUpdate() {
      this.isUpdating = true;
      this.modalErro = null;

      // 1. Montar o payload (FerramentaAtualizacaoSchema)
      // Seu schema de atualização espera 'id_ferramenta',
      // mas o nosso objeto de edição tem 'id'. Vamos mapear.
      const payload = {
        id_ferramenta: this.ferramentaParaEditar.id,
        nome: this.ferramentaParaEditar.nome,
        diaria: this.ferramentaParaEditar.diaria,
        descricao: this.ferramentaParaEditar.descricao,
        status: this.ferramentaParaEditar.status,
        categoria: this.ferramentaParaEditar.categoria,
        chave_pix: this.ferramentaParaEditar.chave_pix,
        quantidade_estoque: this.ferramentaParaEditar.quantidade_estoque
      };

      try {
        // 2. Chamar o serviço
        const response = await ferramentaService.atualizarFerramenta(payload);
        
        // 3. Sucesso! A API retorna a ferramenta atualizada (FerramentaSchema)
        const ferramentaAtualizada = response.data;
        
        // 4. Atualizar a lista principal 'ferramentas' na tela
        const index = this.ferramentas.findIndex(f => f.id === ferramentaAtualizada.id);
        if (index !== -1) {
          // Atualiza o item no array reativamente
          this.ferramentas.splice(index, 1, ferramentaAtualizada);
        }
        
        // 5. Fechar o modal
        this.fecharModal();

      } catch (err) {
        console.error("Erro ao atualizar ferramenta:", err);
        if (err.response && err.response.data && err.response.data.detail) {
          this.modalErro = `Erro: ${err.response.data.detail}`;
        } else {
          this.modalErro = "Falha ao salvar as alterações. Tente novamente.";
        }
      } finally {
        this.isUpdating = false;
      }
    }
  },
  created() {
    // Carrega as ferramentas assim que a página é criada
    this.carregarMinhasFerramentas();
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

.item-status {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 5px;
  text-transform: capitalize;
}
.status-disponivel {
  background-color: #e8f5e9; 
  color: #2e7d32;
}
.status-indisponivel {
  background-color: #ffebee; 
  color: #c62828;
}

.item-categoria {
  background-color: #f7f9fc;
  border: 1px solid #d1d9e6;
  color: #00000090;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 0.8rem;
  text-transform: capitalize;
  margin-left: 5px;
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
.item-editar, .item-excluir {
  background-color: #f7f9fc;
  border: 1px solid #d1d9e6;
  color: #333;
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  width: 100px;
  text-align: center;
}
.item-excluir {
  background-color: #ffebee;
  border-color: #c62828;
  color: #c62828;
}
.item-editar:hover {
  background-color: #e9eff7;
}
.item-excluir:hover:not(:disabled) {
  background-color: #c62828;
  color: white;
}
.item-excluir:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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


/* ============================================= */
/* === ESTILOS NOVOS PARA O MODAL === */
/* ============================================= */

.modal-overlay {
  position: fixed; /* Cobre a tela inteira */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 10px;
  width: 90%;
  max-width: 700px; /* Largura do modal */
  max-height: 90vh; /* Altura máxima */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Para o header e footer ficarem fixos */
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  border-bottom: 1px solid #eee;
}
.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: 300;
  color: #888;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 25px;
  overflow-y: auto; 
  max-height: calc(90vh - 120px);
}

/* Reutilizando estilos do form de cadastro */
.form-group {
  margin-bottom: 20px;
}
.form-group h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  box-sizing: border-box;
  background-color: #fff;
  font-family: inherit;
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #f97316;
  outline: none;
  box-shadow: 0 0 0 3px #f9731633;
}
.form-row {
  display: flex;
  gap: 20px;
}
.form-row .form-group {
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end; /* Alinha botões à direita */
  gap: 15px;
  padding: 15px 25px;
  border-top: 1px solid #eee;
  background-color: #f7f9fc;
}

/* Botões do Modal */
.btn-salvar, .btn-cancelar {
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border: none;
}
.btn-cancelar {
  background-color: #f7f9fc;
  border: 1px solid #d1d9e6;
  color: #333;
}
.btn-cancelar:hover {
  background-color: #e9eff7;
}
.btn-salvar {
  background-color: #f97316;
  color: white;
}
.btn-salvar:hover:not(:disabled) {
  background-color: #d86400;
}
.btn-salvar:disabled {
  background-color: #f97316;
  opacity: 0.6;
  cursor: not-allowed;
}

/* Aviso de erro para o modal */
.modal-aviso {
  margin-top: 0;
  margin-bottom: 20px;
}
</style>
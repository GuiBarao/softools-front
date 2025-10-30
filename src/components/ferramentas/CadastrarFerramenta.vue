<template>
  <div>
    <CabecalhoInterno />

    <main>
      <div class="container perfil-container">
        
        <div v-if="erro" class="aviso-erro">
          {{ erro }}
        </div>
        <div v-if="sucesso" class="aviso-sucesso">
          {{ sucesso }}
        </div>

        <form @submit.prevent="handleSubmit" class="perfil-form" v-if="!sucesso">
          <h1>Cadastrar Nova Ferramenta</h1>
          <p>Preencha as informações para disponibilizar sua ferramenta para aluguel.</p>

          <div class="form-group">
            <h3>Nome da Ferramenta</h3>
            <input type="text" v-model="formData.nome" placeholder="Ex: Furadeira de Impacto 750W" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <h3>Valor da Diária (R$)</h3>
              <input type="number" v-model="formData.diaria" placeholder="25.50" step="0.01" min="0" required />
            </div>
            <div class="form-group">
              <h3>Quantidade em Estoque</h3>
              <input type="number" v-model="formData.quantidade_estoque" placeholder="1" min="1" required />
            </div>
          </div>

          <div class="form-group">
            <h3>Categoria</h3>
            <select v-model="formData.categoria" required>
              <option value="MANUAL">Manual</option>
              <option value="ELETRICA">Elétrica</option>
              <option value="PNEUMATICA">Pneumática</option>
              <option value="HIDRAULICA">Hidráulica</option>
              <option value="MEDICAO">Medição</option>
            </select>
          </div>

          <div class="form-group">
            <h3>Descrição</h3>
            <textarea v-model="formData.descricao" rows="5" placeholder="Descreva a ferramenta, sua condição e o que inclui (ex: brocas, maleta)..." required></textarea>
          </div>

          <div class="form-group">
            <h3>Chave PIX (para recebimento)</h3>
            <input type="text" v-model="formData.chave_pix" placeholder="CPF, e-mail, telefone ou chave aleatória" required />
          </div>

          <hr class="divisor" />

          <div class="form-group">
            <h3>Fotos da Ferramenta</h3>
            <p>Envie pelo menos uma foto. A primeira será a capa.</p>
            <input 
              type="file" 
              @change="handleFileChange" 
              multiple 
              accept="image/png, image/jpeg" 
            />
            
            <div class="preview-container" v-if="previewList.length > 0">
              <div v-for="(src, index) in previewList" :key="index" class="preview-imagem">
                <img :src="src" />
              </div>
            </div>
          </div>

          <button type="submit" class="btn-salvar" :disabled="isLoading">
            {{ isLoading ? 'Cadastrando...' : 'Cadastrar Ferramenta' }}
          </button>
        </form>

        <div v-if="sucesso" class="sucesso-container">
          <router-link to="/ferramentas" class="btn-salvar">
            Ver minhas ferramentas
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
import { ferramentaService } from "@/services/ferramentaService";

export default {
  name: "CadastrarFerramenta",
  components: {
    CabecalhoInterno,
  },
  data() {
    return {
      // Modelo para o formulário
      formData: {
        nome: '',
        diaria: null,
        descricao: '',
        categoria: 'MANUAL', // Categoria padrão
        chave_pix: '',
        quantidade_estoque: 1
      },
      // Array para guardar os arquivos de foto
      selectedFiles: [],
      // Array para os previews das imagens
      previewList: [],
      
      isLoading: false,
      erro: null,
      sucesso: null,
    };
  },
  methods: {
    /**
     * Lida com a seleção de arquivos e cria os previews.
     */
    handleFileChange(event) {
      this.selectedFiles = Array.from(event.target.files);
      
      // Limpa previews antigos
      this.previewList = [];

      // Gera URLs para o preview
      for (const file of this.selectedFiles) {
        this.previewList.push(URL.createObjectURL(file));
      }
    },


    async handleSubmit() {
      this.isLoading = true;
      this.erro = null;
      this.sucesso = null;

      // Validação de fotos
      if (this.selectedFiles.length === 0) {
        this.erro = "Você deve enviar pelo menos uma foto da ferramenta.";
        this.isLoading = false;
        return;
      }

      // --- ESTA É A CORREÇÃO ---
      // Agora vamos anexar cada campo individualmente,
      // para bater com os 'Form(...)' do seu back-end.

      // 1. Criar o objeto FormData
      const formDataApi = new FormData();

      // 2. Anexar os dados do formulário (um por um)
      formDataApi.append('nome', this.formData.nome);
      formDataApi.append('diaria', this.formData.diaria);
      formDataApi.append('descricao', this.formData.descricao);
      formDataApi.append('categoria', this.formData.categoria);
      formDataApi.append('chave_pix', this.formData.chave_pix);
      formDataApi.append('quantidade_estoque', this.formData.quantidade_estoque);

      // 3. Anexar os arquivos (Fotos)
      // O nome 'fotos' bate com o 'fotos: List[UploadFile]'
      for (const file of this.selectedFiles) {
        formDataApi.append('fotos', file);
      }
      
      // ----------------------------

      try {
        // 4. Enviar para o serviço
        await ferramentaService.cadastrarFerramenta(formDataApi);

        // 5. Sucesso!
        this.sucesso = "Ferramenta cadastrada com sucesso!";

      } catch (err) {
        console.error("Erro ao cadastrar ferramenta:", err);
        if (err.response && err.response.data && err.response.data.detail) {
          let erroMsg = err.response.data.detail;
          // O FastAPI pode retornar um array de erros
          if (Array.isArray(erroMsg)) {
            erroMsg = erroMsg.map(e => `${e.loc[1]}: ${e.msg}`).join('; ');
          }
          this.erro = `Erro: ${erroMsg}`;
        } else {
          this.erro = "Não foi possível cadastrar a ferramenta. Tente novamente.";
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Container principal (reutilizado do MeuPerfil) */
.container {
  width: 95%;
  margin: 0 auto;
}
.perfil-container {
  max-width: 800px;
  margin: 40px auto 75px auto;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #D0DFEE;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Formulário (reutilizado) */
.perfil-form h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
}
.perfil-form p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 25px;
}

/* Grupos de formulário (reutilizado) */
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
  padding: 12px 15px;
  font-size: 1rem;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  box-sizing: border-box;
  background-color: #fff;
  font-family: inherit; /* Garante que a fonte seja a mesma */
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #f97316;
  outline: none;
  box-shadow: 0 0 0 3px #f9731633;
}
.form-group input[type="file"] {
  padding: 8px;
}

/* Linha com 2 colunas */
.form-row {
  display: flex;
  gap: 20px;
}
.form-row .form-group {
  flex: 1; /* Faz ambos os grupos terem a mesma largura */
}

/* Divisor (reutilizado) */
.divisor {
  border: none;
  border-top: 1px solid #eee;
  margin: 30px 0;
}

/* Botão de Salvar (reutilizado) */
.btn-salvar {
  background-color: #f97316;
  border: none;
  text-align: center;
  color: white;
  font-weight: 600;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  text-decoration: none; /* Para o link */
  display: inline-block; /* Para o link */
}
.btn-salvar:hover {
  background-color: #d86400;
}
.btn-salvar:disabled {
  background-color: #f97316;
  opacity: 0.6;
  cursor: not-allowed;
}

/* Avisos (reutilizado) */
.aviso-erro,
.aviso-sucesso {
  width: 100%;
  padding: 15px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.aviso-erro { background-color: #ffebee; color: #c62828; border: 1px solid #c62828; }
.aviso-sucesso { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #2e7d32; }

/* Preview de Imagens */
.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  padding: 10px;
}
.preview-imagem {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #eee;
}
.preview-imagem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sucesso-container {
  text-align: center;
}
</style>
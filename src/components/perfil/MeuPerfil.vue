<template>
  <div>
    <CabecalhoInterno />

    <main>
      <div class="container perfil-container">
        
        <div v...if="isLoading" class="aviso-carregando">
          Carregando seu perfil...
        </div>

        <div v-if="erro" class="aviso-erro">
          {{ erro }}
        </div>
        <div v-if="sucesso" class="aviso-sucesso">
          {{ sucesso }}
        </div>

        <form @submit.prevent="handleUpdate" class="perfil-form" v-if="!isLoading">
          <h1>Meu Perfil</h1>
          <p>Atualize suas informações pessoais e de segurança.</p>

          <div class="form-group">
            <h3>Nome Completo</h3>
            <input type="text" v-model="formData.nome" placeholder="Seu nome completo" required />
          </div>

          <div class="form-group">
            <h3>E-mail</h3>
            <input type="email" v-model="formData.email" placeholder="Seu@email.com" required />
          </div>

          <div class="form-group">
            <h3>Telefone</h3>
            <input type="tel" v-model="formData.telefone" placeholder="67999999999" required />
          </div>

          <div class="form-group">
            <h3>Estado (UF)</h3>
            <input type="text" v-model="formData.estado" placeholder="Ex: MS" maxlength="2" required />
          </div>

          <hr class="divisor" />

          <h3>Alterar Senha (Opcional)</h3>
          <p>Deixe em branco se não quiser alterar.</p>

          <div class="form-group">
            <h3>Nova Senha</h3>
            <input type="password" v-model="formData.senha" placeholder="Digite a nova senha" />
          </div>

          <div class="form-group">
            <h3>Confirmar Nova Senha</h3>
            <input type="password" v-model="formData.confirmarSenha" placeholder="Confirme a nova senha" />
          </div>

          <button type="submit" class="btn-salvar" :disabled="isUpdating">
            {{ isUpdating ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </form>

        <div class="danger-zone" v-if="!isLoading">
          <hr class="divisor" />
          <h2>Zona de Perigo</h2>
          <p>Excluir sua conta é uma ação permanente e não pode ser desfeita.</p>
          <button @click="handleDelete" class="btn-excluir" :disabled="isUpdating">
            Excluir Minha Conta
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";
import { usuarioService } from "@/services/usuarioService";

export default {
  name: "MeuPerfil",
  components: {
    CabecalhoInterno,
  },
  data() {
    return {
      formData: {
        id: null,
        nome: '',
        email: '',
        telefone: '',
        estado: '',
        senha: '',
        confirmarSenha: ''
      },
      isLoading: true,  // Carregamento inicial da página
      isUpdating: false, // Carregamento do 'Salvar' ou 'Excluir'
      erro: null,
      sucesso: null,
    };
  },
  methods: {
    /**
     * Carrega os dados do usuário da API usando o ID salvo no localStorage.
     */
    async carregarDadosUsuario() {
      this.isLoading = true;
      this.erro = null;
      try {
        // 1. Pega o ID do usuário que salvamos no localStorage durante o login
        const userDataString = localStorage.getItem('user_data');
        if (!userDataString) {
          throw new Error("Usuário não logado.");
        }
        
        const userData = JSON.parse(userDataString);
        const idUsuario = userData.id;

        // 2. Busca os dados mais recentes da API
        const response = await usuarioService.getMeuUsuario(idUsuario);
        
        // 3. Preenche o formData com os dados da API
        const { id, nome, email, telefone, estado } = response.data;
        this.formData = {
          id,
          nome,
          email,
          telefone,
          estado,
          senha: '',       // Limpa os campos de senha
          confirmarSenha: ''
        };

      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        this.erro = "Não foi possível carregar seus dados. Por favor, faça login novamente.";
        // Opcional: redirecionar para o login se falhar
        // localStorage.clear();
        // this.$router.push('/login');
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Lida com o envio do formulário de atualização.
     */
    async handleUpdate() {
      // 1. Limpa feedback
      this.erro = null;
      this.sucesso = null;
      this.isUpdating = true;

      // 2. Validação de senha
      if (this.formData.senha !== this.formData.confirmarSenha) {
        this.erro = "As novas senhas não coincidem.";
        this.isUpdating = false;
        return;
      }

      // 3. Monta o payload (deve ser o UsuarioAtualizacaoSchema)
      const payload = {
        id: this.formData.id,
        nome: this.formData.nome,
        email: this.formData.email,
        telefone: this.formData.telefone,
        estado: this.formData.estado,
      };

      // 4. Só adiciona a senha ao payload se ela foi preenchida
      if (this.formData.senha) {
        payload.senha = this.formData.senha;
      }

      try {
        // 5. Chama o serviço
        const response = await usuarioService.atualizarMeuUsuario(payload);

        // 6. Sucesso!
        this.sucesso = "Perfil atualizado com sucesso!";
        
        // 7. Atualiza o localStorage com os novos dados
        // (A API retorna o UsuarioSchemaPublic atualizado)
        localStorage.setItem('user_data', JSON.stringify(response.data));
        
        // 8. Limpa os campos de senha
        this.formData.senha = '';
        this.formData.confirmarSenha = '';

      } catch (err) {
        console.error("Erro ao atualizar perfil:", err);
        this.erro = "Falha ao atualizar o perfil. Tente novamente.";
      } finally {
        this.isUpdating = false;
      }
    },

    /**
     * Lida com a exclusão da conta.
     */
    async handleDelete() {
      // 1. Confirmação
      if (!confirm("TEM CERTEZA?\nEsta ação é permanente e excluirá sua conta.")) {
        return;
      }

      this.isUpdating = true;
      this.erro = null;

      try {
        // 2. Chama o serviço de exclusão
        await usuarioService.excluirMinhaConta(this.formData.id);

        // 3. Sucesso! (Endpoint retorna 204)
        alert("Sua conta foi excluída com sucesso.");

        // 4. Faz o "logout"
        localStorage.clear();
        // Opcional: Limpar o header do axios se você o setou globalmente
        // delete apiClient.defaults.headers.common['Authorization'];
        
        // 5. Redireciona para a página inicial
        this.$router.push('/');

      } catch (err) {
        console.error("Erro ao excluir conta:", err);
        this.erro = "Não foi possível excluir sua conta. Tente novamente.";
        this.isUpdating = false;
      }
    }
  },
  /**
   * Carrega os dados do usuário assim que o componente é criado.
   */
  created() {
    this.carregarDadosUsuario();
  }
};
</script>

<style scoped>
/* Container principal da página */
.container {
  width: 95%;
  margin: 0 auto;
}
.perfil-container {
  max-width: 800px; /* Limita a largura para melhor leitura */
  margin: 40px auto 75px auto;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #D0DFEE;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Formulário */
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

/* Grupos de formulário */
.form-group {
  margin-bottom: 20px;
}
.form-group h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.form-group input {
  width: 100%;
  padding: 12px 15px;
  font-size: 1rem;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  box-sizing: border-box; /* Garante que o padding não quebre o layout */
}
.form-group input:focus {
  border-color: #f97316;
  outline: none;
  box-shadow: 0 0 0 3px #f9731633;
}

/* Divisor */
.divisor {
  border: none;
  border-top: 1px solid #eee;
  margin: 30px 0;
}

/* Botão de Salvar (Laranja) */
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
}
.btn-salvar:hover {
  background-color: #d86400;
}
.btn-salvar:disabled {
  background-color: #f97316;
  opacity: 0.6;
  cursor: not-allowed;
}

/* Zona de Perigo (Excluir) */
.danger-zone {
  margin-top: 20px;
}
.danger-zone h2 {
  color: #dc2626; /* Vermelho */
  font-size: 1.2rem;
}
.danger-zone p {
  font-size: 0.9rem;
  color: #555;
}
.btn-excluir {
  background-color: #dc2626;
  border: none;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  font-size: 0.9rem;
}
.btn-excluir:hover {
  background-color: #b91c1c;
}
.btn-excluir:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* Avisos (Carregando, Erro, Sucesso) */
.aviso-carregando,
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
.aviso-carregando { color: #333; background-color: #f7f9fc; border: 1px solid #d1d9e6; }
.aviso-erro { background-color: #ffebee; color: #c62828; border: 1px solid #c62828; }
.aviso-sucesso { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #2e7d32; }
</style>
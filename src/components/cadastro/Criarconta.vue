<template>
  <div>
    <CabecalhoInicial />

    <main>
      <form class="box" @submit.prevent="handleSubmit">
        <div class="titulo">
          <h1>Criar Conta</h1>
          <p>Preencha os dados para criar sua conta</p>
        </div>

        <div v-if="erro" class="aviso-erro">
          {{ erro }}
        </div>
        <div v-if="sucesso" class="aviso-sucesso">
          {{ sucesso }} <router-link to="/login">Ir para o login</router-link>
        </div>

        <h3>Nome Completo</h3>
        <input type="text" placeholder="Digite seu nome" v-model="formData.nome" required />

        <h3>E-mail</h3>
        <input type="email" placeholder="Seu@email.com" v-model="formData.email" required />

        <h3>Telefone</h3>
        <input type="tel" placeholder="(11) 9 9999-9999" v-model="formData.telefone" required />

        <h3>Estado</h3>
        <select id="estado" name="estado" v-model="formData.estado" required>
          <option value="" disabled>Selecione seu estado</option>
          <option value="AC" style="color: black;">Acre</option>
          <option value="AL" style="color: black;">Alagoas</option>
          <option value="AP" style="color: black;">Amapá</option>
          <option value="AM" style="color: black;">Amazonas</option>
          <option value="BA" style="color: black;">Bahia</option>
          <option value="CE" style="color: black;">Ceará</option>
          <option value="DF" style="color: black;">Distrito Federal</option>
          <option value="ES" style="color: black;">Espírito Santo</option>
          <option value="GO" style="color: black;">Goiás</option>
          <option value="MA" style="color: black;">Maranhão</option>
          <option value="MT" style="color: black;">Mato Grosso</option>
          <option value="MS" style="color: black;">Mato Grosso do Sul</option>
          <option value="MG" style="color: black;">Minas Gerais</option>
          <option value="PA" style="color: black;">Pará</option>
          <option value="PB" style="color: black;">Paraíba</option>
          <option value="PR" style="color: black;">Paraná</option>
          <option value="PE" style="color: black;">Pernambuco</option>
          <option value="PI" style="color: black;">Piauí</option>
          <option value="RJ" style="color: black;">Rio de Janeiro</option>
          <option value="RN" style="color: black;">Rio Grande do Norte</option>
          <option value="RS" style="color: black;">Rio Grande do Sul</option>
          <option value="RO" style="color: black;">Rondônia</option>
          <option value="RR" style="color: black;">Roraima</option>
          <option value="SC" style="color: black;">Santa Catarina</option>
          <option value="SP" style="color: black;">São Paulo</option>
          <option value="SE" style="color: black;">Sergipe</option>
          <option value="TO" style="color: black;">Tocantins</option>
        </select>

        <h3>Senha</h3>
        <input type="password" placeholder="Digite sua senha" v-model="formData.senha" required />

        <h3>Confirmar Senha</h3>
        <input type="password" placeholder="Repita a senha" v-model="confirmarSenha" required />

        <button type="submit" class="criar-conta" :disabled="isLoading">
          <h3>{{ isLoading ? 'Criando...' : 'Criar Conta' }}</h3>
        </button>

        <div id="aviso">
          <p>Já tem uma conta? <router-link to="/login">Faça seu login aqui</router-link></p>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import CabecalhoInicial from '../cabecalho/CabecalhoInicial'
// PASSO 5: Importar o serviço
import { usuarioService } from '@/services/usuarioService' // Ajuste o caminho se necessário

export default {
  name: 'CriarConta',
  components: {
      CabecalhoInicial
  },

  // PASSO 6: Definir o estado inicial
  data(){
      return {
        formData: {
          nome: '',
          email: '',
          telefone: '',
          estado: '',
          senha: ''
        },
        confirmarSenha: '',
        isLoading: false,
        erro: null,
        sucesso: null
      }
  },

  // PASSO 7: Adicionar os métodos
  methods: {
    async handleSubmit() {
      // 1. Limpa feedback anterior
      this.erro = null;
      this.sucesso = null;
      this.isLoading = true;

      // 2. Validação do Front-end (Senhas)
      if (this.formData.senha !== this.confirmarSenha) {
        this.erro = "As senhas não coincidem.";
        this.isLoading = false;
        return;
      }
      
      // 3. Validação do Front-end (Telefone numérico)
      // (Seu backend já valida isso, mas é bom validar aqui também)
      if (!/^\d+$/.test(this.formData.telefone.replace(/[\s()-]/g, ''))) {
        this.erro = "O telefone deve conter apenas números.";
        this.isLoading = false;
        return;
      }

      try {
        // 4. Monta o payload (já está no formato do UsuarioSchemaCadastro)
        const payload = {
          nome: this.formData.nome,
          email: this.formData.email,
          telefone: this.formData.telefone.replace(/[\s()-]/g, ''), // Limpa o telefone
          estado: this.formData.estado,
          senha: this.formData.senha
        };
        
        // 5. Chama o serviço
        await usuarioService.cadastrarUsuario(payload);

        // 6. Sucesso!
        this.sucesso = "Conta criada com sucesso!";
        // Opcional: Redirecionar para o login
        // this.$router.push('/login');
        
        // Limpa o formulário
        this.formData = { nome: '', email: '', telefone: '', estado: '', senha: '' };
        this.confirmarSenha = '';

      } catch (err) {
        // 7. Erro
        console.error("Erro no cadastro:", err);
        if (err.response && err.response.data && err.response.data.detail) {
          // Tenta pegar o erro do back-end (ex: "email já existe")
          this.erro = `Erro: ${err.response.data.detail}`;
        } else {
          this.erro = "Não foi possível criar a conta. Tente novamente.";
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
/* Estilos de feedback (opcional) */
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
.aviso-erro { 
  background-color: #ffebee; 
  color: #c62828; 
  border: 1px solid #c62828; 
}
.aviso-sucesso { 
  background-color: #e8f5e9; 
  color: #2e7d32; 
  border: 1px solid #2e7d32; 
}

/* Estilo para o botão desabilitado */
.criar-conta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

<style src="../../assets/css/style_criar_conta.css"></style>
<template>
    <div>
    <CabecalhoInicial />

    <main>
      <div class="box">
        <div class="titulo">
          <h1>Criar Conta</h1>
          <p>Preencha os dados para criar sua conta</p>
        </div>

        <h3>Nome Completo</h3>
        <input type="text" placeholder="Digite seu nome" />

        <h3>E-mail</h3>
        <input type="text" placeholder="Seu@email.com" />

        <h3>Telefone</h3>
        <input type="text" placeholder="(11) 9 9999-9999" />

        <h3>Estado</h3>
        <select id="estado" name="estado">
          <option value="">Selecione seu estado</option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapá</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceará</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espírito Santo</option>
          <option value="GO">Goiás</option>
          <option value="MA">Maranhão</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Pará</option>
          <option value="PB">Paraíba</option>
          <option value="PR">Paraná</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piauí</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondônia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">São Paulo</option>
          <option value="SE">Sergipe</option>
          <option value="TO">Tocantins</option>
        </select>

        <h3>Senha</h3>
        <input type="password" placeholder="Digite sua senha" />

        <h3>Confirmar Senha</h3>
        <input type="password" placeholder="Repita a senha" />

        <div class="criar-conta">
          <h3>Criar Conta</h3>
        </div>

        <div id="aviso">
          <p>Já tem uma conta? <router-link to="/login">Faça seu login aqui</router-link></p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import CabecalhoInicial from '../cabecalho/CabecalhoInicial'

  export default {
    name: 'CriarConta',//nome do componente exportado

    components: {
        CabecalhoInicial
    },

    data(){
        return {

        }
    }
  }
</script>

<style src="../../assets/css/style_criar_conta.css"></style>

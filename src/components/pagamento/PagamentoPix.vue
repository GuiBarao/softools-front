<template>
  <div>
    <CabecalhoInterno />

    <main>
      <div class="container perfil-container">
        
        <div v-if="chavePix && valor" class="pix-box">
          <h1>Finalize seu Aluguel</h1>
          <p>Para confirmar seu pedido, faça um PIX no valor de <strong>{{ formatarPreco(valor) }}</strong> para a chave abaixo.</p>

          <div class="chave-pix-container">
            <h3>Chave PIX Aleatória</h3>
            <input type="text" :value="chavePix" readonly @focus="$event.target.select()" />
            <button @click="copiarChave" class="btn-copiar">{{ textoBotaoCopiar }}</button>
          </div>

          <p class="aviso-pix">Após o pagamento, o proprietário da ferramenta será notificado para combinar a entrega.</p>
          
          <button @click="confirmarPagamento" class="btn-salvar">
            Pagamento Realizado
          </button>
        </div>

        <div v-else class="aviso-vazio">
          <p>Houve um problema ao processar seu pedido.</p>
          <router-link to="/meu-carrinho" class="botao-acao-vazio">
            Voltar ao Carrinho
          </router-link>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import CabecalhoInterno from "../cabecalho/CabecalhoInterno";

export default {
  name: "PagamentoPix",
  components: {
    CabecalhoInterno,
  },
  data() {
    return {
      chavePix: null,
      valor: null,
      textoBotaoCopiar: 'Copiar Chave'
    };
  },
  methods: {
    formatarPreco(valor) {
      const numero = parseFloat(valor);
      if (isNaN(numero)) return "R$ 0,00";
      return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    copiarChave() {
      // API de Copiar para Área de Transferência
      navigator.clipboard.writeText(this.chavePix).then(() => {
        this.textoBotaoCopiar = 'Copiado!';
        setTimeout(() => {
          this.textoBotaoCopiar = 'Copiar Chave';
        }, 2000);
      }).catch(err => {
        console.error('Falha ao copiar:', err);
      });
    },
    
    confirmarPagamento() {
      // O backend não forneceu um endpoint para "confirmar",
      // então por enquanto, apenas redirecionamos o usuário.
      alert("Obrigado! O proprietário será notificado.");
      this.$router.push('/ferramentas'); // Redireciona para a home de ferramentas
    }
  },
  created() {
    // Tenta ler os dados passados pelo router
    if (history.state && history.state.chavePix) {
      this.chavePix = history.state.chavePix;
      this.valor = history.state.valor;
    } else {
      // Se o usuário recarregar a página, o 'state' se perde.
      // Redireciona para o carrinho para evitar erros.
      this.$router.push('/meu-carrinho');
    }
  }
};
</script>

<style scoped>
/* Container (reutilizado do MeuPerfil) */
.container {
  width: 95%;
  margin: 0 auto;
}
.perfil-container {
  max-width: 600px;
  margin: 40px auto 75px auto;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #D0DFEE;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.pix-box {
  text-align: center;
}
.pix-box h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
}
.pix-box p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 25px;
}
.pix-box p strong {
  color: #f97316;
  font-weight: 700;
}

.chave-pix-container {
  background: #f7f9fc;
  border: 1px solid #d1d9e6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
.chave-pix-container h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}
.chave-pix-container input {
  width: 100%;
  padding: 12px 15px;
  font-size: 1rem;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  box-sizing: border-box;
  text-align: center;
  font-weight: 500;
  background-color: #fff;
}
.btn-copiar {
  background: none;
  border: none;
  color: #f97316;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.9rem;
}

.aviso-pix {
  font-size: 0.9rem !important;
  color: #777 !important;
}

/* Botão (reutilizado) */
.btn-salvar {
  background-color: #f97316;
  border: none;
  text-align: center;
  color: white;
  font-weight: 600;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1rem;
  width: 100%;
}
.btn-salvar:hover {
  background-color: #d86400;
}

/* Fallback (reutilizado) */
.aviso-vazio {
  text-align: center;
  padding: 40px;
}
.botao-acao-vazio {
  background-color: #f97316;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
}
</style>
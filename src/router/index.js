import { createRouter, createWebHistory } from 'vue-router'


import PaginaInicial from '../components/PaginaInicial.vue'
import Criarconta from '../components/cadastro/Criarconta.vue'
import Login from '../components/login/Login.vue'
import EsqueceuSenha from '../components/login/EsqueceuSenha.vue'
import TelaFerramentas from '../components/ferramentas/TelaFerramentas.vue'


import DetalheFerramenta from '../components/ferramentas/DetalheFerramenta.vue'

import MeuCarrinho from '@/components/ferramentas/MeuCarrinho.vue'

import MeuPerfil from '@/components/perfil/MeuPerfil.vue'

import CadastrarFerramenta from '@/components/ferramentas/CadastrarFerramenta.vue'

import MinhasFerramentas from '@/components/ferramentas/MinhasFerramentas.vue'

import PagamentoPix from '@/components/pagamento/PagamentoPix.vue'

import HistoricoAlugueis from '@/components/perfil/HistoricoAlugueis.vue'

const routes = [
  { path: '/', 
    name: 'PaginaInicial', 
    component: PaginaInicial 
  },
  { path: '/criarconta', 
    name: 'Criarconta', 
    component: Criarconta 
  },
  { path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { path: '/esqueceusenha', 
    name: 'EsqueceuSenha', 
    component: EsqueceuSenha 
  },
  { path: '/ferramentas', 
    name: 'TelaFerramentas', 
    component: TelaFerramentas 
  },

  { 
    path: '/ferramenta/:id', 
    name: 'DetalheFerramenta',
    component: DetalheFerramenta
  },
  { 
    path: '/carrinho', 
    name: 'MeuCarrinho',
    component: MeuCarrinho
  },
  { 
    path: '/meuperfil', 
    name: 'MeuPerfil', 
    component: MeuPerfil 
  },
  {
    path: '/cadastrar-ferramenta',
    name: 'CadastrarFerramenta',
    component: CadastrarFerramenta
  },
  {
    path: '/minhas-ferramentas',
    name: 'MinhasFerramentas',
    component: MinhasFerramentas
  },
  {
    path: '/pagamento',
    name: 'PagamentoPix',
    component: PagamentoPix
  },
  {
    path: '/meu-historico',
    name: 'HistoricoAlugueis',
    component: HistoricoAlugueis
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
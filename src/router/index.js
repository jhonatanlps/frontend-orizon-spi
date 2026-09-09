import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import AlertasView from '../views/AlertasView.vue'
import CadastroEpiView from '../views/CadastroEpiView.vue'
import ConfigMaquinaView from '../views/ConfigMaquinaView.vue'
import CadastroCameraView from '../views/CadastroCameraView.vue'
import SupervisorView from '../views/SupervisorView.vue'
import TecnicoView from '../views/TecnicoView.vue'
import RelatoriosView from '../views/RelatoriosView.vue'
import CalibracaoZonasView from '../views/CalibracaoZonasView.vue'
import CamerasView  from '../views/CamerasView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/alertas', component: AlertasView },
  { path: '/cadastro-epi', component: CadastroEpiView },
  { path: '/calibrar-zonas', component: CalibracaoZonasView },
  { path: '/config-maquina', component: ConfigMaquinaView },
  { path: '/cadastro-camera', component: CadastroCameraView },
  { path: '/supervisor', component: SupervisorView },
  { path: '/tecnico', component: TecnicoView },
  { path: '/relatorios', component: RelatoriosView },
  { path: '/cameras', component: CamerasView}
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
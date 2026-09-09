<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Settings, HardHat, Box, AlertTriangle, LogOut, Clock, Cctv, SquareDashed } from 'lucide-vue-next';
import axios from 'axios';
import { conectarWebSocket, registrarCallback, removerCallback } from '../services/WebSocket';
import InfracoesRecentes from '../components/InfracoesRecentes.vue';

const alertasRecentes = ref([])
const carregando = ref(false)

const qtdAlertasAlta = computed(() => {
    return alertasRecentes.value.filter(alerta => alerta.status === 'ALTA').length
})

const qtdAlertasInformativo = computed(() => { 
    return alertasRecentes.value.filter(alerta => alerta.status == 'INFORMATIVO').length
})

async function buscarAlertas() {
    carregando.value = true
    try {
        const resposta = await axios.get('/api/alerta')

        console.log('Status:', resposta.status)
        console.log('Dados:', resposta.data)
        
        alertasRecentes.value = resposta.data

        console.log(qtdAlertasResolvidos)

    } catch (error) {
        console.error("Erro ao buscar o alerta", error)
    } finally {
        carregando.value = false
    }
    
}

async function resolverAlerta(id) {
    try {
        await axios.put(`/api/alerta/${id}`)
        buscarAlertas()
    } catch (error) {
        console.error("Erro ao resolver ", error)
    }
}

function receberAlerta(alerta) {

    console.log('🔥 WebSocket:', alerta)

    const index = alertasRecentes.value.findIndex(
        a => a.id_alerta === alerta.id_alerta
    )

    if (index === -1) {

        // Alerta novo
        alertasRecentes.value.unshift(alerta)

    } else {

        // Alerta já existe, apenas atualiza
        alertasRecentes.value[index] = alerta

    }

}

onMounted(() => {
    buscarAlertas()
    console.log("conectando no websocket...")
    conectarWebSocket()
    registrarCallback(
        'onAlerta',
        receberAlerta
    )

})

onUnmounted(() => {
    removerCallback('onAlerta')
})

</script>

<template>
    <div class="layout-container">
        <!-- SIDEBAR -->
        <aside class="sidebar">
            <div>
                <div class="sidebar-logo">
                    <img src="../assets/logo_orizon_branca.png" alt="ORIZON">
                    <span>Técnico</span>
                </div>

                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="/tecnico"><Settings /> Painel</a>
                    </li>
                    <li class="nav-item">
                        <a href="/cadastro-epi"><HardHat /> Cadastro de Epi</a>
                    </li>
                    <li class="nav-item">
                        <a href="/config-maquina"><Box /> Config. Máquina</a>
                    </li>
                    <li class="nav-item">
                        <a href="/cadastro-camera"><Cctv /> Cadastro de Câmera</a>
                    </li>
                    <li class="nav-item">
                        <a href="/calibrar-zonas"><SquareDashed /> Calibração de Zonas</a>
                    </li>
                    <li class="nav-item active">
                        <a href="/alertas"><AlertTriangle /> Alertas</a>
                    </li>
                </ul>
            </div>

            <div class="sidebar-footer">
                <a href="/" class="logout-btn">
                    <LogOut /> Sair
                </a>
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <div v-if="carregando">Carregando dados do servidor...</div>

        <main v-else class="main-content">
            <header class="page-header">
                <h1 class="page-title">Alertas do Sistema</h1>
                <p class="page-subtitle">Monitoramento de alertas</p>
            </header>

            <!-- METRICS CARDS -->
            <div class="metrics-grid">
                <div class="metric-card danger">
                    <div class="metric-label">Alertas de nível alto</div>
                    <div class="metric-value danger">{{ qtdAlertasAlta }}</div>
                </div>
                
                <div class="metric-card danger">
                    <div class="metric-label">Alertas de nível informativo</div>
                    <div class="metric-value danger">{{ qtdAlertasInformativo }}</div>
                </div>
            </div>

            <!-- ALERT CARDS LIST -->
            <div class="alerts-list">
                <!-- Alert Item 1 -->
                <div v-for="alerta in alertasRecentes" class="alert-card">
                    <div class="alert-icon">
                        <AlertTriangle :size="24" />
                    </div>
                    <div class="alert-body">
                        <div class="alert-title">Maquina desativada - {{ alerta.ocorrencia?.zona?.nome }}</div>
                        <div class="alert-desc">{{ alerta.mensagem }}</div>
                        <div class="alert-machine"><strong>Máquina:</strong> {{ alerta.ocorrencia?.zona?.maquina?.nome }}</div>
                    </div>
                    <div class="alert-actions">
                        <div class="alert-time">
                            <Clock :size="14" /> {{ alerta.data_hora }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- INFRAÇÕES RECENTES TABLE -->
            <div class="table-card">
                <div class="table-header">
                    <h2 class="table-title">Infrações Recentes</h2>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Funcionário</th>
                                <th>Área</th>
                                <th>Descrição</th>
                                <th>Data Hora</th>
                            </tr>
                        </thead>
                        <tbody v-for="alerta in alertasRecentes">
                            <tr>
                                <td class="table-worker">{{ alerta.ocorrencia?.funcionario?.nome }}</td>
                                <td>{{ alerta.ocorrencia?.zona?.nome }}</td>
                                <td>{{ alerta.mensagem }}</td>
                                <td>{{ alerta.data_hora }}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* --- MAIN CONTENT --- */
.main-content {
    flex: 1;
    padding: 32px 40px;
    overflow-y: auto;
}

.page-header {
    margin-bottom: 32px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-main);
}

.page-subtitle {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 4px;
}

/* --- TOP METRICS CARDS --- */
.metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
    max-width: 800px;
}

.metric-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    position: relative;
    overflow: hidden;
}

.metric-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
}

.metric-card.danger::before { background-color: var(--danger-main); }
.metric-card.success::before { background-color: var(--success-main); }

.metric-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 12px;
}

.metric-value {
    font-size: 32px;
    font-weight: 700;
}

.metric-value.danger { color: var(--danger-main); }
.metric-value.success { color: var(--success-main); }

/* --- ALERT CARDS --- */
.alerts-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
}

.alert-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 20px 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    display: flex;
    gap: 20px;
    position: relative;
    overflow: hidden;
}

.alert-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background-color: var(--danger-main);
}

.alert-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-color: var(--danger-light);
    color: var(--danger-main);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.alert-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.alert-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 6px;
}

.alert-desc {
    font-size: 13px;
    color: var(--text-main);
    margin-bottom: 4px;
}

.alert-machine {
    font-size: 13px;
    color: var(--text-muted);
}

.alert-machine strong {
    color: var(--text-main);
    font-weight: 600;
}

.alert-status-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--success-main);
    margin-top: 8px;
}

.alert-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
}

.btn-resolve {
    background-color: var(--success-btn);
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-resolve:hover {
    background-color: var(--success-btn-hover);
}

.alert-time {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
}

/* --- TABLE SECTION --- */
.table-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    overflow: hidden;
}

.table-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
}

.table-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
}

.table-container {
    width: 100%;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

th {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-color);
}

td {
    padding: 16px 24px;
    font-size: 14px;
    color: var(--text-main);
    border-bottom: 1px solid #f1f5f9;
}

tr:last-child td {
    border-bottom: none;
}

.table-worker {
    font-weight: 600;
}

/* Responsividade */
@media (max-width: 900px) {
    .metrics-grid {
    grid-template-columns: 1fr;
    }
    .alert-card {
    flex-direction: column;
    align-items: flex-start;
    }
    .alert-actions {
    width: 100%;
    flex-direction: row;
    align-items: center;
    margin-top: 12px;
    }
}

@media (max-width: 768px) {
    body {
    flex-direction: column;
    }
    .sidebar {
    width: 100%;
    }
    .main-content {
    padding: 20px;
    }
}

@import '../assets/css/alertas.css';
</style>
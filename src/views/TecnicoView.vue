<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Settings, HardHat, Box, AlertTriangle, LogOut, MapPin, Trash2, Plus} from 'lucide-vue-next';
import axios from 'axios';
import { conectarWebSocket, registrarCallback, removerCallback } from '../services/WebSocket';

const carregando = ref(false)
const maquinas = ref([])
const epis = ref([])
const zonas = ref([])

const qtdEpis = computed(() => {
    return epis.value.length
})

const qtdMaquinas = computed(() => {
    return maquinas.value.length
})

const qtdZona = computed(() => {
    return zonas.value.length
})

async function buscarMaquinas() {
    carregando.value = true
    try {
        const resposta = await axios.get('/api/maquina')

        maquinas.value = resposta.data
        
    } catch (error) {
        console.error("Erro ao buscar maquinas ", maquinas)
    } finally {
        carregando.value = false
    }
}

async function receberMaquinas(maquina) {

    maquinas.value.unshift(maquina)
    
}

async function deletarMaquina(id) {
    try {
        const resposta = await axios.delete(`/api/maquina/${id}`)

        maquinas.value.shift(resposta.data)
    } catch (error) {
        console.error("Erro ao deletar maquinas ", maquinas)
    }
}

async function buscarEpis() {
    carregando.value = true
    try {
        const resposta = await axios.get('/api/epi')

        epis.value = resposta.data
        
    } catch (error) {
        console.error("Erro ao buscar epis ", epis)
    } finally {
        carregando.value = false
    }
    
}


async function receberEpis(epi) {

    epis.value.unshift(epi)
    
}

async function deletarEpi(id) {
    try {
        const resposta = await axios.delete(`/api/epi/${id}`)

        epis.value.shift(resposta.data)
    } catch (error) {
        console.error("Erro ao deletar maquinas ", epis)
    }
}

async function buscarZonas() {
    carregando.value = true
    try {
        const resposta = await axios.get('/api/zona')

        zonas.value = resposta.data
        
    } catch (error) {
        console.error("Erro ao buscar zonas ", zonas)
    } finally {
        carregando.value = false
    }
}


async function receberZonas(zona) {

    zonas.value.unshift(zona)
    
}

async function deletarZona(id) {
    try {
        const resposta = await axios.delete(`/api/zona/${id}`)

        zonas.value.shift(resposta.data)
    } catch (error) {
        console.error("Erro ao deletar maquinas ", zonas)
    }
}

onMounted(() => {
    buscarEpis()
    buscarMaquinas()
    buscarZonas()

    console.log("conectando no web socket")

    conectarWebSocket()

    registrarCallback(
        'onEpi', 
        receberEpis
    )

    registrarCallback(
        'onMaquina', 
        receberMaquinas
    )

    registrarCallback(
        'onZona', 
        receberZonas
    )

})

onUnmounted(() => {
    removerCallback('onEpi')
    removerCallback('onMaquina')
    removerCallback('onZona')
})

</script>

<template>
    <div class="layout-container">
        <aside class="sidebar">
            <div>
                <div class="sidebar-logo">
                    <img src="../assets/logo_orizon_branca.png" alt="ORIZON">
                    <span>Técnico</span>
                </div>

                <ul class="nav-menu">
                    <li class="nav-item active">
                        <a href="/tecnico"><Settings /> Painel</a>
                    </li>
                    <li class="nav-item">
                        <a href="/cadastro-epi"><HardHat /> Cadastro de Epi</a>
                    </li>
                    <li class="nav-item">
                        <a href="/config-maquina"><Box /> Config. Máquina</a>
                    </li>
                    <li class="nav-item">
                        <a href="/alertas"><AlertTriangle /> Alerta</a>
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
        <main class="main-content">
            <header class="page-header">
                <h1 class="page-title">Painel do Técnico</h1>
                <p class="page-subtitle">Gestão de equipamentos, EPIs e áreas monitoradas</p>
            </header>

            <!-- METRICS CARDS -->
            <div class="metrics-grid">
                <div class="metric-card purple">
                <div class="metric-icon">
                    <Box />
                </div>
                <div class="metric-info">
                    <span class="metric-label">Máquinas Cadastradas</span>
                    <span class="metric-value">{{ qtdMaquinas }}</span>
                </div>
                </div>

                <div class="metric-card cyan">
                <div class="metric-icon">
                    <HardHat />
                </div>
                <div class="metric-info">
                    <span class="metric-label">EPIs Disponíveis</span>
                    <span class="metric-value">{{ qtdEpis }}</span>
                </div>
                </div>

                <div class="metric-card dark">
                <div class="metric-icon">
                    <MapPin />
                </div>
                <div class="metric-info">
                    <span class="metric-label">Zonas Monitoradas</span>
                    <span class="metric-value">{{ qtdZona }}</span>
                </div>
                </div>
            </div>

            <!-- GESTÃO DE MÁQUINAS -->
            <div class="card">
                <div class="card-header-flex">
                <h2 class="card-title">Gestão de Máquinas</h2>
                <a href="/config-maquina" class="btn btn-purple">
                    <Plus :size="16" /> Nova Máquina
                </a>
                </div>

                <div class="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Máquina</th>
                        <th>Área</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="maquina in maquinas" :key="maquina.id_maquina">
                        <td class="machine-name">{{ maquina.nome }}</td>
                        <td>{{ maquina.setor }}</td>
                        <td>{{ maquina.descricao }}</td>
                        <td>
                        <div class="action-btns">
                            <button @click="deletarMaquina(maquina.id_maquina)" class="action-btn delete" title="Excluir"> <Trash2 :size="18" /></button>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <!-- GESTÃO DE EPIS -->
                <div class="card">

                    <div class="card-header-flex">
                        <h2 class="card-title">Gestão de EPIs</h2>
                        <a href="/cadastro-epi" class="btn btn-cyan">
                            <Plus :size="16" /> Nova EPI
                        </a>
                    </div>

                    <div class="epi-cards-grid">
                        <!-- EPI Item 1 -->
                        <div v-for="epi in epis" :key="epi.id_epi" class="epi-item-card">
                            <div class="epi-card-header">
                                <div>
                                    <div class="epi-name">{{ epi.nome }}</div>
                                    <div class="epi-desc">{{ epi.descricao }}</div>
                                </div>
                                <div class="action-btns">
                                    <button @click="deletarEpi(epi.id_epi)" class="action-btn delete"><Trash2 :size="18" /></button>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>

            <!-- ÁREAS MONITORADAS -->
                <div class="card">
                    <div class="card-header-flex" style="margin-bottom: 16px;">
                        <h2 class="card-title">Áreas Monitoradas</h2>
                    </div>

                    <div class="areas-grid">

                        <div v-for="zona in zonas" class="area-card">
                            <div class="area-title">{{ zona.nome }}</div>
                            <div class="area-details">
                                <div class="area-detail-item">
                                    <label>Máquina:</label>
                                    <span>{{ zona.maquina.nome }}</span>
                                </div>
                            </div>
                        </div>  

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
    margin-bottom: 24px;
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

/* --- SUMMARY METRICS CARDS --- */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
}

.metric-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
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
    width: 4px;
}

.metric-card.purple::before { background-color: var(--primary); }
.metric-card.cyan::before { background-color: #38bdf8; }
.metric-card.dark::before { background-color: #1e293b; }

.metric-icon {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.metric-card.purple .metric-icon { background-color: #f0f0fe; color: var(--primary); }
.metric-card.cyan .metric-icon { background-color: #e0f2fe; color: #0284c7; }
.metric-card.dark .metric-icon { background-color: #f1f5f9; color: #0f172a; }

.metric-info {
    display: flex;
    flex-direction: column;
}

.metric-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
}

.metric-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-main);
    line-height: 1.2;
    margin-top: 2px;
}

/* --- CARDS & TABLES --- */
.card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    margin-bottom: 24px;
}

.card-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.card-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
}

/* BUTTONS */
.btn {
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    transition: background-color 0.2s;
    text-decoration: none;
}

.btn-purple {
    background-color: var(--primary);
    color: #ffffff;
}

.btn-purple:hover {
    background-color: var(--primary-hover);
}

.btn-cyan {
    background-color: #38bdf8;
    color: #ffffff;
}

.btn-cyan:hover {
    background-color: #0284c7;
}

/* --- TABLE STYLING --- */
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
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
}

td {
    padding: 16px;
    font-size: 14px;
    color: var(--text-main);
    border-bottom: 1px solid #f1f5f9;
}

tr:last-child td {
    border-bottom: none;
}

.machine-name {
    font-weight: 600;
}

/* BADGES */
.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.badge-ativo {
    background-color: var(--status-active-bg);
    color: var(--status-active-text);
}

.badge-manutencao {
    background-color: var(--status-maint-bg);
    color: var(--status-maint-text);
}

.badge-inativo {
    background-color: var(--status-inact-bg);
    color: var(--status-inact-text);
}

/* ACTION ICONS */
.action-btns {
    display: flex;
    gap: 10px;
    align-items: center;
}

.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    transition: opacity 0.2s;
}

.action-btn.edit { color: var(--action-edit); }
.action-btn.delete { color: var(--action-delete); }
.action-btn:hover { opacity: 0.7; }

/* --- EPI GRID --- */
.epi-cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.epi-item-card {
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 16px 20px;
    background-color: #ffffff;
}

.epi-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.epi-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
}

.epi-desc {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
}

.epi-metrics {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.epi-metric-box label {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 2px;
}

.epi-metric-box .val {
    font-size: 18px;
    font-weight: 700;
}

.epi-metric-box .val.green {
    color: #16a34a;
}

.epi-metric-box .val.dark {
    color: var(--text-main);
}

/* --- ÁREAS MONITORADAS GRID --- */
.areas-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.area-card {
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 16px 20px;
    background-color: #ffffff;
}

.area-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 12px;
}

.area-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.area-detail-item label {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 2px;
}

.area-detail-item span {
    font-size: 13px;
    font-weight: 600;
}

.area-detail-item span.status-green {
    color: #16a34a;
}

/* RESPONSIVIDADE */
@media (max-width: 900px) {
    .metrics-grid {
    grid-template-columns: 1fr;
    }
    .epi-cards-grid, .areas-grid {
    grid-template-columns: 1fr;
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

@import '../assets/css/tecnico.css';
</style>
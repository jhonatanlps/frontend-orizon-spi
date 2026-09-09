<script setup>
import { ref, onMounted, computed } from 'vue'
import { Activity, Accessibility, TrendingUp} from 'lucide-vue-next';
import axios from 'axios';
import { conectarWebSocket, registrarCallback } from '../services/WebSocket';

const qtdOcorrenciasStatus = ref([]);
const carregando = ref(false)

const qtdOcorrenciasBloqueado = computed(() => {
    const ocorrencia = qtdOcorrenciasStatus.value.find(
        ocorrencia => ocorrencia.status === "BLOQUEADA"
    )

    return ocorrencia?.quantidade ?? 0
})

const qtdOcorrenciasOk = computed(() => {
    const ocorrencia = qtdOcorrenciasStatus.value.find(
        ocorrencia => ocorrencia.status === "OK"
    )

    return ocorrencia?.quantidade ?? 0
})

function atualizarOcorrencias(dados) {

    qtdOcorrenciasStatus.value = dados.data

}

async function contarOcorrencias(){
    carregando.value = true
    try {
        const resposta = await axios.get('/api/ocorrencia/quantidade-status')
        
        qtdOcorrenciasStatus.value = resposta.data
    } catch (error) {
        console.error("Erro ao contar ocorrencias ", error)    
    } finally{
        carregando.value = false
    }
}

onMounted(() => {
    contarOcorrencias()

})
</script>

<template>
    <!-- METRICS CARDS -->
    <div class="metrics-grid">
    <div class="metric-card purple">
        <div class="metric-icon">
        <Activity :size="48" :stroke-width="2.5" />
        </div>
        <div class="metric-info">
        <span class="metric-label">Total de ocorrências</span>
        <span class="metric-value">{{ qtdOcorrenciasBloqueado + qtdOcorrenciasOk }}</span>
        </div>
    </div>

    <!-- <div class="metric-card cyan">
        <div class="metric-icon">
        <Accessibility :size="48" :stroke-width="2.5" />
        </div>
        <div class="metric-info">
        <span class="metric-label">Funcionários Ativos</span>
        <span class="metric-value">6</span>
        </div>
    </div> -->

    <div class="metric-card green">
        <div class="metric-icon">
        <TrendingUp :size="48" :stroke-width="2.5" />
        </div>
        <div class="metric-info">
        <span class="metric-label">Conformidade</span>
        <span class="metric-value">{{ (((qtdOcorrenciasOk / (qtdOcorrenciasOk + qtdOcorrenciasBloqueado))*100).toFixed(2)) }}%</span>
        </div>
    </div>
    </div>
</template>

<style scoped>
/* --- TOP METRICS CARDS --- */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.metric-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
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

.metric-card.purple::before { background-color: var(--primary); }
.metric-card.cyan::before { background-color: var(--cyan); }
.metric-card.green::before { background-color: var(--green); }

.metric-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.metric-card.purple .metric-icon { color: var(--primary); }
.metric-card.cyan .metric-icon { color: var(--cyan); }
.metric-card.green .metric-icon { color: var(--green); }

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
    margin-top: 4px;
}

</style>
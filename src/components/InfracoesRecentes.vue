<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { conectarWebSocket, registrarCallback, removerCallback } from '../services/WebSocket';

const alertasRecentes = ref([])
const carregando = ref(false)

async function buscarAlertas() {
    carregando.value = true
    try {
        const resposta = await axios.get('/api/alerta/alertas-dia')

        console.log('Status:', resposta.status)
        console.log('Dados:', resposta.data)
        
        alertasRecentes.value = resposta.data

    } catch (error) {
        console.error("Erro ao buscar o alerta", error)
    } finally {
        carregando.value = false
    }
    
}

function receberAlerta(alerta) {

    console.log('🔥 WebSocket:', alerta)

    // Alerta novo
    alertasRecentes.value.unshift(alerta)
    
}

onMounted(() => {
    buscarAlertas()

    conectarWebSocket()
    registrarCallback(
        'onAlertaDia',
        receberAlerta
    )
})

onUnmounted(() => {
    removerCallback('onAlertaDia')
})

</script>


<template>
    <!-- INFRAÇÕES RECENTES TABLE -->
    <div class="card" style="padding: 0; overflow: hidden;">
        <h2 class="card-title" style="padding: 24px 24px 0 24px; margin-bottom: 16px;">Infrações recentes</h2>
        <div class="table-container">
            <table>
            <thead>
                <tr>
                <th>Funcionário</th>
                <th>Tipo</th>
                <th>Área</th>
                <th>Hora</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="alerta in alertasRecentes" :key="alerta.id_alerta">
                    <td class="fw-600">{{ alerta.ocorrencia.funcionario.nome }}</td>
                    <td>{{ alerta.mensagem }}</td>
                    <td>{{ alerta.ocorrencia.zona.nome }}</td>
                    <td>{{ alerta.data_hora }}</td>
                    <td><span class="badge">{{ alerta.status }}</span></td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
    .card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    margin-bottom: 24px;
}

.card-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 24px;
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
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
}

td {
    padding: 16px 20px;
    font-size: 14px;
    color: var(--text-main);
    border-bottom: 1px solid #f1f5f9;
}

tr:last-child td {
    border-bottom: none;
}


.fw-600 {
    font-weight: 600;
}

/* BADGES */
.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
}

.badge-baixo {
    background-color: var(--status-baixo-bg);
    color: var(--status-baixo-text);
}

.badge-medio {
    background-color: var(--status-medio-bg);
    color: var(--status-medio-text);
}

.badge-critico {
    background-color: var(--status-critico-bg);
    color: var(--status-critico-text);
}
</style>
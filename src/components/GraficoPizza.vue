<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'

import { Doughnut } from 'vue-chartjs'
import { conectarWebSocket, registrarCallback, removerCallback } from '../services/WebSocket'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement
)

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Ocorrencias',
            data: [],
            backgroundColor: [],
            borderWidth: 2
        }
    ]
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
        legend: {
            position: 'bottom'
        }
    }
}

function atualizarGrafico(dados) {

    chartData.value = {
        labels: dados.map(item => item.status),

        datasets: [
            {
                label: 'Quantidade de ocorrências',
                data: dados.map(item => item.quantidade),
                backgroundColor: dados.map(item => {

                    if (item.status === 'BLOQUEADA') {
                        return '#0F172A'
                    }

                    if (item.status === 'OK') {
                        return '#06B6D4'
                    }

                }),

                borderWidth: 1
            }
        ]
    }
}

async function buscarDadosGrafico() {

    try {

        const response = await axios.get(
            '/api/ocorrencia/quantidade-status'
        )

        const dados = response.data

        chartData.value = {
            labels: dados.map(item => item.status),

            datasets: [
                {
                    label: 'Quantidade de ocorrências',
                    data: dados.map(item => item.quantidade),
                    backgroundColor: dados.map(item => {

                        if (item.status === 'BLOQUEADA') {
                            return '#0F172A'
                        }

                        if (item.status === 'OK') {
                            return '#06B6D4'
                        }
                        
                    }),

                    borderWidth: 1
                }
            ]
        }

    } catch (error) {

        console.error('Erro ao buscar dados do gráfico:', error)

    }
}

onMounted(() => {
    buscarDadosGrafico()

    conectarWebSocket()
    registrarCallback(
        'onQtdStatus',
        atualizarGrafico
    )

})


onUnmounted(() => {
    removerCallback('onQtdStatus')

})

</script>

<template>

    <div style="height: 400px; width: 100%;">

        <Doughnut
            :data="chartData"
            :options="chartOptions"
        />

    </div>

</template>
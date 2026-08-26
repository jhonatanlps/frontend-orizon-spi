<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

import { Bar } from 'vue-chartjs'
import { conectarWebSocket, registrarCallback, removerCallback } from '../services/WebSocket'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
)

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Conformidades',
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
        labels: dados.map(item => item.zona),

        datasets: [
            {
                label: 'Quantidade de conformidades',
                data: dados.map(item => item.quantidade),
                backgroundColor: ['#5243e3'],
                borderWidth: 2
            }
        ]
    }
}

async function buscarDadosGrafico() {

    try {

        const response = await axios.get(
            '/api/ocorrencia/quantidade-zonas'
        )

        const dados = response.data

        chartData.value = {
            labels: dados.map(item => item.zona),

            datasets: [
                {
                    label: 'Quantidade de conformidades',
                    data: dados.map(item => item.quantidade),
                    backgroundColor: ["#5243e3"],
                    borderWidth: 2
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
        'onQtdZonas',
        atualizarGrafico
    )

})


onUnmounted(() => {
    removerCallback('onQtdZonas')

})

</script>

<template>
  <div style="height: 400px; width: 100%;">
    <Bar
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>
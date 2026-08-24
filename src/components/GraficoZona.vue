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
        }
    ]
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

}

function atualizarGrafico(dados) {

    chartData.value = {
        labels: dados.map(item => item.zona),

        datasets: [
            {
                label: 'Quantidade de conformidades',
                data: dados.map(item => item.quantidade),
                backgroundColor: ['#ABC798'],
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

        console.log("aa")
        const dados = response.data

        chartData.value = {
            labels: dados.map(item => item.zona),

            datasets: [
                {
                    label: 'Quantidade de conformidades',
                    data: dados.map(item => item.quantidade),
                    backgroundColor: ['#ABC798', "#0F172A"],
                    borderWidth: 2
                }
            ]
        }
        console.log("aaaaa")
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
import { Client } from '@stomp/stompjs'

let client = null

export function conectarWebSocket({onAlerta, onMaquina, onEpi, onZona} = {}) {

    client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        reconnectDelay: 5000,
        onConnect: () => {

            console.log('WebSocket conectado')

            client.subscribe('/topic/alerta', (message) => {
                const alerta = JSON.parse(message.body)
                console.log('Novo alerta:', alerta)
                onAlerta?.(alerta)
            })
            client.subscribe('/topic/maquina', (message) => {
                const maquina = JSON.parse(message.body)
                console.log('Novo maquina:', maquina)
                onMaquina?.(maquina)
            })
            client.subscribe('/topic/epi', (message) => {
                const epi = JSON.parse(message.body)
                console.log('Novo epi:', epi)
                onEpi?.(epi)
            })
            client.subscribe('/topic/zona', (message) => {
                const zona = JSON.parse(message.body)
                console.log('Novo zona:', zona)
                onZona?.(zona)
            })
        },
        onDisconnect: () => {
            console.log('WebSocket desconectado')
        },
        onStompError: (frame) => {
            console.error('Erro STOMP:', frame)
        }
    })

    client.activate()
}

export function desconectarWebSocket() {

    if (client) {
        client.deactivate()
    }
}
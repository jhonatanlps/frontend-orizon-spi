import { Client } from '@stomp/stompjs'

let client = null

let callbacks = {
    onAlerta: null,
    onMaquina: null,
    onEpi: null,
    onZona: null,
    onQtdStatus: null,
    onQtdZonas: null
}

export function conectarWebSocket() {

    if (client) {
        return
    }

    client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        reconnectDelay: 5000,
        onConnect: () => {

            console.log('WebSocket conectado')

            client.subscribe('/topic/alerta', (message) => {
                const alerta = JSON.parse(message.body)
                console.log('Novo alerta:', alerta)
                callbacks.onAlerta?.(alerta)
            })
            client.subscribe('/topic/maquina', (message) => {
                const maquina = JSON.parse(message.body)
                console.log('Novo maquina:', maquina)
                callbacks.onMaquina?.(maquina)
            })
            client.subscribe('/topic/epi', (message) => {
                const epi = JSON.parse(message.body)
                console.log('Novo epi:', epi)
                callbacks.onEpi?.(epi)
            })
            client.subscribe('/topic/zona', (message) => {
                const zona = JSON.parse(message.body)
                console.log('Novo zona:', zona)
                callbacks.onZona?.(zona)
            })
            client.subscribe('/topic/ocorrencia/quantidade-status', (message) => {
                const qtdStatus = JSON.parse(message.body)
                console.log('Nova quantidade status:', qtdStatus)
                callbacks.onQtdStatus?.(qtdStatus)
            })
            client.subscribe('/topic/ocorrencia/quantidade-zonas', (message) => {
                const qtdZonas = JSON.parse(message.body)
                console.log('Nova quantidade zonas:', qtdZonas)
                callbacks.onQtdZonas?.(qtdZonas)
            })
        },
        onDisconnect: () => {
            console.log('WebSocket desconectado')
        },
        onStompError: (frame) => {
            console.error('Erro STOMP:', frame)
        },
        onWebSocketError: (error) => {
            console.error('Erro WebSocket:', error)
        }
    })

    client.activate()
}

// Registra os eventos que um componente quer receber
export function registrarCallback(tipo, callback) {

    callbacks[tipo] = callback
}


// Remove o callback quando o componente sair
export function removerCallback(tipo) {

    callbacks[tipo] = null
}


export function desconectarWebSocket() {

    if (client) {
        client.deactivate()
    }
}
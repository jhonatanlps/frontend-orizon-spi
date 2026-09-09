<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Settings, Cctv, LogOut, FileText } from 'lucide-vue-next';
import axios from 'axios'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const cameras = ref([])
const videoPlayers = ref([])
let players = []

onMounted(async () => {
  try {
    // 1. Busca as câmeras do backend Spring Boot
    const response = await axios.get('/api/cameras')
    cameras.value = response.data

    // 2. Aguarda a renderização do DOM para inicializar os players
    await nextTick()
    
    cameras.value.forEach((cam, index) => {
      const videoElement = videoPlayers.value[index]
      if (videoElement) {
        // 3. Aponta para o endpoint estático configurado no WebConfig do Java
        const streamUrl = `http://localhost:8080/stream/${cam.id}/stream.m3u8`
        
        const player = videojs(videoElement, {
          sources: [{
            src: streamUrl,
            type: 'application/x-mpegURL'
          }],
          liveui: true
        })
        
        players.push(player)
      }
    })
  } catch (error) {
    console.error("Erro ao carregar as câmeras:", error)
  }
})

onUnmounted(() => {
  // Destrói os players ao sair da tela para liberar memória e fechar conexões
  players.forEach(player => {
    if (player) player.dispose()
  })
})
</script>

<template>
    <div class="layout-container">
        <aside class="sidebar">
            <div>
                <div class="sidebar-logo">
                    <img src="../assets/logo_orizon_branca.png" alt="ORIZON" />
                    <span>Supervisor</span>
                </div>

                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="/supervisor"><Settings /> Painel</a>
                    </li>
                    <li class="nav-item">
                        <a href="/relatorios"><FileText /> Relatórios</a>
                    </li>
                    <li class="nav-item active">
                        <a href="/cameras"><Cctv /> Câmeras</a>
                    </li>
                </ul>
            </div>

            <div class="sidebar-footer">
                <a href="/" class="logout-btn">
                    <LogOut /> Sair
                </a>
            </div>
        </aside>

        <main class="main-content">
            <div class="camera-grid">
                <div v-for="camera in cameras" :key="camera.id" class="camera-card">
                <h3>{{ camera.nome }}</h3>
                <p>{{ camera.descricao }}</p>
                
                <!-- Player de vídeo individual para cada câmera -->
                <div data-vjs-player>
                    <video 
                    ref="videoPlayers" 
                    class="video-js vjs-big-play-centered" 
                    controls 
                    autoplay 
                    muted 
                    playsinline
                    ></video>
                </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.camera-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  padding: 20px;
}
.camera-card {
  background: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
}
.video-js {
  width: 100%;
  height: 250px;
}
</style>
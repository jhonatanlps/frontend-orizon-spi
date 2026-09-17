<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  Settings, 
  Cctv, 
  LogOut, 
  FileText, 
  Search, 
  Video, 
  ShieldCheck, 
  Activity,
  Radio
} from 'lucide-vue-next'
import axios from 'axios'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const cameras = ref([])
const videoPlayers = ref({})
const searchQuery = ref('')
const loading = ref(true)
let players = []

const isVisible = (camera) => {
  if (!searchQuery.value.trim()) return true
  const query = searchQuery.value.toLowerCase()
  const nameMatch = camera.nome?.toLowerCase().includes(query)
  const descMatch = camera.descricao?.toLowerCase().includes(query)
  return nameMatch || descMatch
}

const visibleCount = computed(() => {
  return cameras.value.filter(cam => isVisible(cam)).length
})

onMounted(async () => {
  try {
    const response = await axios.get('/api/cameras')
    cameras.value = response.data

    // Desativa o loading antes de bindar os players
    loading.value = false
    await nextTick()

    cameras.value.forEach((cam) => {
      const videoElement = videoPlayers.value[cam.id]
      
      if (videoElement) {
        const streamUrl = `http://localhost:8080/stream/${cam.id}/stream.m3u8`
        
        const player = videojs(videoElement, {
          autoplay: true,
          muted: true,
          controls: true,
          responsive: true,
          fluid: true,
          liveui: true,
          html5: {
            vhs: { overrideNative: true },
            nativeAudioTracks: false,
            nativeVideoTracks: false
          },
          sources: [{
            src: streamUrl,
            type: 'application/x-mpegURL'
          }]
        })
        
        players.push(player)
      }
    })
  } catch (error) {
    console.error("Erro ao carregar o feed das câmeras:", error)
    loading.value = false
  }
})

onUnmounted(() => {
  players.forEach(player => {
    if (player) player.dispose()
  })
})
</script>

<template>
  <div class="layout-container">
    <!-- SIDEBAR MANTIDA INTACTA -->
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

    <!-- ÁREA PRINCIPAL - DESIGN CLARO PADRÃO ORIZON -->
    <main class="main-content">
      <!-- Header Clean -->
      <header class="content-header">
        <div class="header-title">
          <h1>Monitoramento de Câmeras</h1>
          <p>Acompanhamento em tempo real do sistema de segurança</p>
        </div>

        <div class="header-actions">
          <div class="search-box">
            <Search class="search-icon" :size="18" />
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Buscar por nome ou local..."
            />
          </div>
          
        </div>
      </header>

      <!-- Estado de Carregamento -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando transmissões...</p>
      </div>

      <!-- Grid de Câmeras Estilo Orizon -->
      <div v-else class="camera-grid">
        <div 
          v-for="camera in cameras" 
          :key="camera.id" 
          v-show="isVisible(camera)"
          class="camera-card"
        >
          <!-- Cabeçalho do Card -->
          <div class="card-header">
            <div class="camera-title-group">
              <div class="icon-wrapper">
                <Video :size="18" />
              </div>
              <h3 class="camera-name">{{ camera.nome }}</h3>
            </div>
            
            <span class="live-tag">
              <span class="pulse-dot"></span>
              Ao vivo
            </span>
          </div>

          <!-- Video Player -->
          <div class="video-wrapper">
            <div data-vjs-player>
              <video 
                :ref="(el) => { if (el) videoPlayers[camera.id] = el }" 
                class="video-js vjs-big-play-centered" 
                controls 
                autoplay 
                muted 
                playsinline
              ></video>
            </div>
          </div>

          <!-- Rodapé com Informações -->
          <div class="card-footer">
            <p class="camera-desc">
              {{ camera.descricao || 'Sem localização cadastrada' }}
            </p>
            <div class="card-tags">
              <span class="tag">
                <ShieldCheck :size="14" />
                Stream HD
              </span>
              <span class="tag tag-online">
                <Activity :size="14" />
                Conectado
              </span>
            </div>
          </div>
        </div>

        <!-- Estado Vazio -->
        <div v-if="visibleCount === 0" class="empty-state">
          <Cctv :size="48" />
          <h3>Nenhuma câmera encontrada</h3>
          <p>Tente alterar o termo digitado na busca.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Fundo Limpo / Claro da Plataforma Orizon */
.layout-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.header-title p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Campo de Busca Clean */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  pointer-events: none;
}

.search-box input {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  padding: 8px 16px 8px 38px;
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
  width: 240px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-box input:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  width: 270px;
}

/* Badge de Câmeras Ativas */
.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.radio-icon {
  color: #16a34a;
}

/* Grid */
.camera-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

/* Card Estilo Orizon (Branco com borda e sombra leve) */
.camera-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.camera-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #f1f5f9;
}

.camera-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-wrapper {
  background-color: #f0f9ff;
  color: #0284c7;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

/* Tag "Ao Vivo" */
.live-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.725rem;
  font-weight: 600;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: #dc2626;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

/* Container de Vídeo */
.video-wrapper {
  width: 100%;
  background-color: #0f172a;
  position: relative;
  aspect-ratio: 16 / 9;
}

:deep(.video-js) {
  width: 100% !important;
  height: 100% !important;
}

/* Card Footer */
.card-footer {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #ffffff;
}

.camera-desc {
  font-size: 0.825rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.card-tags {
  display: flex;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #475569;
  background-color: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.tag-online {
  background-color: #f0fdf4;
  color: #166534;
}

/* Loading e Empty State */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
  text-align: center;
}

.empty-state h3 {
  color: #0f172a;
  margin: 12px 0 4px 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #0284c7;
  border-radius: 50%;
  animation: spin 0.8s infinite linear;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
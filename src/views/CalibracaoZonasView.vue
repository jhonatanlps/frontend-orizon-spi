<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import axios from 'axios'
import Hls from 'hls.js'
import { 
  Settings, 
  HardHat, 
  Box, 
  AlertTriangle, 
  LogOut, 
  Cctv, 
  SquareDashed, 
  Undo2, 
  Check, 
  Plus, 
  Trash2, 
  Info,
  Video,
  VideoOff,
  RefreshCcw,
  Camera,
  CameraOff
} from 'lucide-vue-next'

const COLORS = ['#0284c7', '#7c3aed', '#059669', '#d97706', '#dc2626', '#2563eb']

// Referências de Elementos e Canvas
const canvasRef = ref(null)
const videoRef = ref(null)

// Estados de Câmeras e API
const cameras = ref([])
const selectedCameraId = ref('')
const loadingCameras = ref(true)
const carregandoStream = ref(false)
const isCameraActive = ref(false)
const isWebcamActive = ref(false)
const cameraError = ref('')

// Máquinas, EPIs e Zonas do Banco de Dados
const maquinas = ref([])
const epis = ref([])
const zones = ref([]) // Armazena todas as zonas do banco
const loadingMaquinas = ref(false)
const loadingEpis = ref(false)
const loadingZonas = ref(false)
const savingZone = ref(false)

let animationFrameId = null
let hlsInstance = null
let localMediaStream = null
let naturalW = 0, naturalH = 0
let displayScale = 1
let ctx = null

// Estados de Zonas em desenho
const currentPoints = ref([])

// Formulários e Seleção
const showForm = ref(false)
const zoneName = ref('')
const zoneMachineId = ref('') // ID da Máquina selecionada
const zoneSelectedEpis = ref([]) // IDs dos EPIs selecionados [1, 2, ...]

// Câmera selecionada da API
const currentCamera = computed(() => {
  return cameras.value.find(c => (c.id || c.id_camera) === selectedCameraId.value) || null
})

// 🟢 FILTRO: Se a webcam do PC estiver ligada, mostra zonas com camera_id null.
// Caso contrário, mostra zonas da câmera selecionada.
const filteredZones = computed(() => {
  if (isWebcamActive.value) {
    return zones.value.filter(z => z.camera_id === null || z.camera_id === undefined || z.camera_id === '')
  }
  if (!selectedCameraId.value) return []
  return zones.value.filter(z => String(z.camera_id) === String(selectedCameraId.value))
})

onMounted(async () => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
  }

  // Busca todos os dados necessários do banco ao carregar a página
  await Promise.all([
    fetchCameras(),
    fetchMaquinas(),
    fetchEpis(),
    fetchZonas()
  ])
})

onBeforeUnmount(() => {
  stopCamera()
})

// --- BUSCAR DADOS DO BANCO DE DADOS (API) ---

async function fetchCameras() {
  loadingCameras.value = true
  cameraError.value = ''
  try {
    const response = await axios.get(`api/cameras`)
    cameras.value = response.data || []
    
    if (cameras.value.length > 0) {
      // CORREÇÃO: Mantém a câmera selecionada caso exista após o refresh
      const exists = cameras.value.find(c => (c.id || c.id_camera) === selectedCameraId.value)
      if (!exists) {
        const first = cameras.value[0]
        selectedCameraId.value = first.id || first.id_camera
      }
    }
  } catch (err) {
    console.error("Erro ao carregar lista de câmeras:", err)
    cameraError.value = "Não foi possível carregar a lista de câmeras da API."
  } finally {
    loadingCameras.value = false
  }
}

async function fetchMaquinas() {
  loadingMaquinas.value = true
  try {
    const response = await axios.get(`api/maquina`)
    maquinas.value = response.data || []
  } catch (err) {
    console.error("Erro ao carregar máquinas do banco:", err)
  } finally {
    loadingMaquinas.value = false
  }
}

async function fetchEpis() {
  loadingEpis.value = true
  try {
    const response = await axios.get(`api/epi`)
    epis.value = response.data || []
  } catch (err) {
    console.error("Erro ao carregar EPIs do banco:", err)
  } finally {
    loadingEpis.value = false
  }
}

// BUSCAR ZONAS CADASTRADAS NO BANCO DE DADOS
async function fetchZonas() {
  loadingZonas.value = true
  try {
    const response = await axios.get(`api/zona`)
    const rawZones = response.data || []

    // Mapeia a estrutura vinda do Spring Boot para a estrutura do Canvas
    zones.value = rawZones.map((z, idx) => ({
      id: z.id_zona || z.id,
      nome: z.nome,
      id_maquina: z.maquina ? (z.maquina.id_maquina || z.maquina.id) : null,
      camera_id: z.camera ? (z.camera.id_camera || z.camera.id) : null,
      pontos: z.poligonos ? z.poligonos.map(p => [p.x, p.y]) : [],
      epis_obrigatorios: z.epi ? z.epi.map(e => (e.epi ? (e.epi.id_epi || e.epi.id) : (e.id_epi || e.id))) : [],
      color: COLORS[idx % COLORS.length]
    }))
  } catch (err) {
    console.error("Erro ao carregar zonas do banco:", err)
  } finally {
    loadingZonas.value = false
  }
}

// Converte IDs de EPIs em nomes legíveis para exibir nos cards da UI
function getEpiNames(idList) {
  if (!idList || !idList.length) return 'Sem EPIs vinculados'
  return idList.map(id => {
    const item = epis.value.find(e => (e.id || e.id_epi) == id)
    return item ? (item.nome || item.nomeEpi) : `EPI #${id}`
  }).join(', ')
}

// --- LÓGICA DE WEBCAM LOCAL ---

async function startWebcam() {
  stopCamera()
  try {
    cameraError.value = ''
    carregandoStream.value = true

    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
    })

    localMediaStream = stream

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      videoRef.value.play()
      isCameraActive.value = true
      isWebcamActive.value = true
      carregandoStream.value = false
    }
  } catch (err) {
    cameraError.value = 'Erro ao acessar a webcam do PC: ' + err.message
    stopCamera()
  }
}

// --- LÓGICA DE STREAMING HLS ---

async function toggleCamera() {
  if (isCameraActive.value && !isWebcamActive.value) {
    stopCamera()
  } else {
    await startCamera()
  }
}

async function startCamera() {
  stopCamera()

  if (!selectedCameraId.value) {
    cameraError.value = 'Selecione uma câmera primeiro.'
    return
  }

  try {
    cameraError.value = ''
    carregandoStream.value = true

    const streamUrl = `http://localhost:8080/stream/${selectedCameraId.value}/stream.m3u8`

    if (Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      })
      
      hlsInstance.loadSource(streamUrl)
      hlsInstance.attachMedia(videoRef.value)
      
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.value) {
          videoRef.value.play().catch(e => console.warn("Autoplay bloqueado:", e))
          isCameraActive.value = true
          isWebcamActive.value = false
          carregandoStream.value = false
        }
      })

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          cameraError.value = `Erro no feed da câmera (${data.type}). Verifique o servidor de stream.`
          stopCamera()
        }
      })
    } 
    else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.value.src = streamUrl
      videoRef.value.addEventListener('loadedmetadata', () => {
        videoRef.value.play()
        isCameraActive.value = true
        isWebcamActive.value = false
        carregandoStream.value = false
      })
    } else {
      throw new Error("Navegador sem suporte a HLS.")
    }

  } catch (err) {
    cameraError.value = 'Erro ao conectar: ' + err.message
    stopCamera()
  }
}

function stopCamera() {
  if (hlsInstance) {
    hlsInstance.destroy()
    hlsInstance = null
  }

  if (localMediaStream) {
    localMediaStream.getTracks().forEach(track => track.stop())
    localMediaStream = null
  }

  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.src = ''
    videoRef.value.srcObject = null
    videoRef.value.load()
  }

  isCameraActive.value = false
  isWebcamActive.value = false
  carregandoStream.value = false

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

function onVideoLoaded() {
  naturalW = videoRef.value.videoWidth || 1280
  naturalH = videoRef.value.videoHeight || 720

  const maxW = 760
  displayScale = Math.min(1, maxW / naturalW)
  
  if (canvasRef.value) {
    canvasRef.value.width = naturalW * displayScale
    canvasRef.value.height = naturalH * displayScale
  }

  currentPoints.value = []
  renderFrame()
}

// --- DESENHO NO CANVAS ---

function renderFrame() {
  if (!isCameraActive.value || !ctx || !canvasRef.value || !videoRef.value) return

  // CORREÇÃO: HLS geralmente dispara loadedmetadata antes da resolução real estar disponível.
  // Essa checagem atualiza o canvas dinamicamente se o HLS mudar a resolução.
  if (videoRef.value.videoWidth > 0 && (naturalW !== videoRef.value.videoWidth || naturalH !== videoRef.value.videoHeight)) {
    naturalW = videoRef.value.videoWidth
    naturalH = videoRef.value.videoHeight
    const maxW = 760
    displayScale = Math.min(1, maxW / naturalW)
    canvasRef.value.width = naturalW * displayScale
    canvasRef.value.height = naturalH * displayScale
  }

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height)

  // Desenha no canvas apenas as zonas filtradas (Câmera IP selecionada ou Webcam)
  filteredZones.value.forEach(z => {
    const pts = z.pontos.map(([x, y]) => [x * displayScale, y * displayScale])
    drawPolygon(pts, z.color, true, z.nome)
  })

  // Desenha os pontos da zona atual em edição
  if (currentPoints.value.length > 0) {
    drawPolygon(currentPoints.value, '#38bdf8', false, null)
    currentPoints.value.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#38bdf8'
      ctx.fill()
    })
  }

  animationFrameId = requestAnimationFrame(renderFrame)
}

function handleCanvasClick(e) {
  if (!isCameraActive.value || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const dispX = (e.clientX - rect.left) * (canvasRef.value.width / rect.width)
  const dispY = (e.clientY - rect.top) * (canvasRef.value.height / rect.height)
  currentPoints.value.push([dispX, dispY])
}

function undoPoint() {
  currentPoints.value.pop()
}

function drawPolygon(pts, color, closed, label) {
  if (pts.length === 0) return
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (closed) ctx.closePath()
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.stroke()
  if (closed) {
    ctx.fillStyle = color + '25'
    ctx.fill()
  }
  if (label) {
    ctx.font = '600 12px sans-serif'
    ctx.fillStyle = color
    ctx.fillText(label, pts[0][0] + 6, pts[0][1] - 8)
  }
}

// --- AÇÕES DE ZONA E BACKEND ---

function openSaveForm() {
  if (currentPoints.value.length < 3) return
  zoneName.value = `ZONA_${filteredZones.value.length + 1}`
  zoneMachineId.value = ''
  zoneSelectedEpis.value = []
  showForm.value = true
}

function cancelZone() {
  showForm.value = false
}

// ENVIAR DIRETO AO BACKEND QUANDO CLICAR EM "CONFIRMAR E SALVAR"
async function saveZone() {
  const nomeFinal = zoneName.value.trim() || `ZONA_${filteredZones.value.length + 1}`
  const idMaquina = zoneMachineId.value

  // CORREÇÃO: Pega a resolução com certeza absoluta no momento do clique de salvamento
  const finalVideoW = videoRef.value?.videoWidth || naturalW || 1280
  const finalVideoH = videoRef.value?.videoHeight || naturalH || 720

  const pontosOriginais = currentPoints.value.map(([x, y]) => [
    Math.round(x / displayScale),
    Math.round(y / displayScale)
  ])

  // CORREÇÃO: Payload enviado ao Spring Boot agora envia os atributos 'id' e 'id_XXX' juntos.
  // Isso garante que o Spring Boot encontre a variável de mapeamento independente do nome.
  const payload = {
    nome: nomeFinal,
    resolucao: {
      largura: finalVideoW,
      altura: finalVideoH
    },
    poligonos: pontosOriginais.map(([x, y]) => ({
      x: x,
      y: y
    })),
    camera: (!isWebcamActive.value && selectedCameraId.value) 
      ? { 
          id: Number(selectedCameraId.value), 
          id_camera: Number(selectedCameraId.value) 
        } 
      : null,
    maquina: idMaquina 
      ? { 
          id: Number(idMaquina), 
          id_maquina: Number(idMaquina) 
        } 
      : null,
    epi: zoneSelectedEpis.value.map(id => ({
      epi: {
        id: Number(id),
        id_epi: Number(id)
      }
    }))
  }

  savingZone.value = true
  try {
    await axios.post(`api/zona`, payload)
    
    // Recarrega as zonas salvas
    await fetchZonas()
    
    currentPoints.value = []
    showForm.value = false
  } catch (err) {
    console.error("Erro ao salvar zona no banco:", err)
    alert(`Erro ao salvar zona: ${err.response?.data?.message || err.message}`)
  } finally {
    savingZone.value = false
  }
}

// EXCLUIR ZONA DO BANCO DE DADOS
async function removeZone(zone) {
  if (zone && zone.id) {
    if (!confirm(`Deseja realmente excluir a zona "${zone.nome}" do banco de dados?`)) return
    try {
      await axios.delete(`api/zona/${zone.id}`)
      await fetchZonas()
    } catch (err) {
      console.error("Erro ao remover zona do banco:", err)
      alert("Erro ao remover a zona do banco de dados.")
    }
  }
}
</script>

<template>
  <div class="layout-container">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div>
        <div class="sidebar-logo">
          <img src="../assets/logo_orizon_branca.png" alt="ORIZON" onerror="this.style.display='none'">
          <span>Técnico</span>
        </div>

        <ul class="nav-menu">
          <li class="nav-item">
            <a href="/tecnico"><Settings :size="18" /> Painel</a>
          </li>
          <li class="nav-item">
            <a href="/cadastro-epi"><HardHat :size="18" /> Cadastro de EPI</a>
          </li>
          <li class="nav-item">
            <a href="/config-maquina"><Box :size="18" /> Config. Máquina</a>
          </li>
          <li class="nav-item">
            <a href="/cadastro-camera"><Cctv :size="18" /> Cadastro de Câmera</a>
          </li>
          <li class="nav-item active">
            <a href="/calibrar-zonas"><SquareDashed :size="18" /> Calibração de Zonas</a>
          </li>
          <li class="nav-item">
            <a href="/alertas"><AlertTriangle :size="18" /> Alertas</a>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <a href="/" class="logout-btn">
          <LogOut :size="18" /> Sair
        </a>
      </div>
    </aside>

    <!-- CONTEÚDO PRINCIPAL -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-title">
          <h1>Calibração de Zonas por Câmera</h1>
          <p>Selecione uma câmera cadastrada ou use a webcam do PC para desenhar as áreas de detecção</p>
        </div>
      </header>

      <div class="layout-grid">
        <!-- ÁREA DO CANVAS / VÍDEO -->
        <section class="stage-card">
          <!-- Toolbar de Controle -->
          <div class="toolbar">
            <!-- Seleção de Câmeras IP -->
            <div class="camera-select-group">
              <label for="camSelect"><Cctv :size="16" /></label>
              <select 
                id="camSelect"
                v-model="selectedCameraId" 
                :disabled="loadingCameras || isCameraActive"
                class="select-input"
              >
                <option v-if="loadingCameras" value="" disabled>Carregando câmeras...</option>
                <option v-else-if="cameras.length === 0" value="" disabled>Nenhuma câmera encontrada</option>
                <option v-for="cam in cameras" :key="cam.id || cam.id_camera" :value="cam.id || cam.id_camera">
                  {{ cam.nome }} (ID: {{ cam.id || cam.id_camera }})
                </option>
              </select>

              <button 
                class="btn-icon" 
                title="Recarregar Câmeras" 
                @click="fetchCameras" 
                :disabled="isCameraActive || loadingCameras"
              >
                <RefreshCcw :size="14" :class="{ 'spin-icon': loadingCameras }" />
              </button>
            </div>

            <!-- Botão de Feed da Câmera IP -->
            <button 
              :class="['btn', (isCameraActive && !isWebcamActive) ? 'btn-danger' : 'btn-primary']" 
              @click="toggleCamera"
              :disabled="carregandoStream || !selectedCameraId || isWebcamActive"
            >
              <RefreshCcw v-if="carregandoStream && !isWebcamActive" :size="16" class="spin-icon" />
              <VideoOff v-else-if="isCameraActive && !isWebcamActive" :size="16" />
              <Video v-else :size="16" />
              {{ (isCameraActive && !isWebcamActive) ? 'Desconectar Stream' : 'Abrir Stream' }}
            </button>

            <!-- BOTÃO WEBCAM DO PC -->
            <button 
              :class="['btn', isWebcamActive ? 'btn-danger' : 'btn-webcam']" 
              @click="isWebcamActive ? stopCamera() : startWebcam()"
              :disabled="carregandoStream"
            >
              <CameraOff v-if="isWebcamActive" :size="16" />
              <Camera v-else :size="16" />
              {{ isWebcamActive ? 'Desconectar Webcam' : 'Usar Webcam do PC' }}
            </button>

            <button class="btn btn-secondary" @click="undoPoint" :disabled="currentPoints.length === 0 || !isCameraActive">
              <Undo2 :size="16" /> Desfazer
            </button>

            <button class="btn btn-outline" @click="openSaveForm" :disabled="currentPoints.length < 3 || !isCameraActive">
              <Check :size="16" /> Fechar Polígono
            </button>

            <div class="spacer"></div>

            <span class="count-badge" v-if="currentPoints.length > 0">
              <span class="dot"></span>
              {{ currentPoints.length }} ponto(s)
            </span>
          </div>

          <!-- Mensagens de Erro -->
          <div v-if="cameraError" class="error-banner">
            <AlertTriangle :size="16"/> {{ cameraError }}
          </div>

          <!-- Palco do Vídeo e Canvas -->
          <div id="stageWrap">
            <video 
              ref="videoRef" 
              @loadedmetadata="onVideoLoaded" 
              style="display: none;" 
              playsinline 
              muted
              crossorigin="anonymous"
            ></video>

            <div class="stage-empty" v-if="!isCameraActive && !carregandoStream">
              <div class="empty-content">
                <div class="empty-icon-wrapper">
                  <Cctv :size="32" />
                </div>
                <h3>Sem Transmissão Ativa</h3>
                <p class="hint">
                  Selecione uma câmera IP da lista e clique em <b>"Abrir Stream"</b> ou conecte a <b>"Webcam do PC"</b>.
                </p>
              </div>
            </div>
            
            <canvas 
              ref="canvasRef" 
              @click="handleCanvasClick" 
              :style="{ display: isCameraActive ? 'block' : 'none' }"
            ></canvas>
          </div>

          <!-- FORMULÁRIO DE CRIAÇÃO -->
          <div class="save-form" v-if="showForm">
            <div class="form-header">
              <Plus :size="18" />
              <span>Salvar Nova Zona no Banco</span>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>Nome da Zona</label>
                <input type="text" v-model="zoneName" placeholder="ex: MAQUINA_ESTAMPARIA">
              </div>

              <!-- SELECT DE MÁQUINAS -->
              <div class="field">
                <label>Máquina Vinculada (Banco de Dados)</label>
                <select v-model="zoneMachineId" class="form-select">
                  <option value="">Nenhuma Máquina</option>
                  <option 
                    v-for="m in maquinas" 
                    :key="m.id || m.id_maquina" 
                    :value="m.id || m.id_maquina"
                  >
                    {{ m.nome }} (ID: {{ m.id || m.id_maquina }})
                  </option>
                </select>
              </div>

              <!-- CHECKBOXES DE EPIS -->
              <div class="field full-width">
                <label>EPIs Obrigatórios (Banco de Dados)</label>
                <div class="epi-grid" v-if="epis.length > 0">
                  <label v-for="e in epis" :key="e.id || e.id_epi" class="checkbox-badge">
                    <input 
                      type="checkbox" 
                      :value="e.id || e.id_epi" 
                      v-model="zoneSelectedEpis"
                    >
                    <span>{{ e.nome || e.nomeEpi }} (ID: {{ e.id || e.id_epi }})</span>
                  </label>
                </div>
                <div class="empty-hint" v-else>
                  <Info :size="14" /> Nenhum EPI cadastrado no banco de dados.
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn-primary" @click="saveZone" :disabled="savingZone">
                <RefreshCcw v-if="savingZone" :size="16" class="spin-icon" />
                <span>{{ savingZone ? 'Salvando no Banco...' : 'Confirmar e Salvar' }}</span>
              </button>
              <button class="btn btn-secondary" @click="cancelZone" :disabled="savingZone">Cancelar</button>
            </div>
          </div>
        </section>

        <!-- PAINEL LATERAL -->
        <aside class="side-panel">
          <!-- Lista de Zonas Desenhadas da Câmera Atual / Webcam -->
          <div class="panel-card">
            <div class="card-title">
              <SquareDashed :size="16" />
              <h2>Zonas Cadastradas</h2>
              <button class="btn-icon" title="Recarregar Zonas" @click="fetchZonas" :disabled="loadingZonas">
                <RefreshCcw :size="14" :class="{ 'spin-icon': loadingZonas }" />
              </button>
              <span class="counter-pill">{{ String(filteredZones.length).padStart(2, '0') }}</span>
            </div>

            <div id="zoneList" v-if="filteredZones.length > 0">
              <div class="zone-card" v-for="z in filteredZones" :key="z.id">
                <div class="zone-header">
                  <span class="name">
                    <span class="swatch" :style="{ background: z.color }"></span>
                    {{ z.nome }}
                  </span>
                  <button class="remove-btn" title="Excluir do Banco" @click="removeZone(z)">
                    <Trash2 :size="14" />
                  </button>
                </div>

                <div class="meta-info">
                  {{ z.pontos.length }} pontos · ID Banco: <b>{{ z.id }}</b> · Máquina ID: <b>{{ z.id_maquina || 'Nenhuma' }}</b>
                </div>

                <div class="epis-list">
                  EPIs: <b>{{ getEpiNames(z.epis_obrigatorios) }}</b>
                </div>
              </div>
            </div>

            <div class="empty-hint" v-else>
              <Info :size="16" />
              <span v-if="isWebcamActive">Nenhuma zona cadastrada para a Webcam (sem câmera vinculada).</span>
              <span v-else>Nenhuma zona cadastrada para esta câmera IP.</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.spin-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

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

.content-header { 
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
.layout-grid { 
  display: grid; 
  grid-template-columns: minmax(0, 1fr) 360px; 
  gap: 24px; 
  align-items: start; 
}

.stage-card { 
  background: #ffffff; 
  border: 1px solid #e2e8f0; 
  border-radius: 12px; 
  padding: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); 
}
.toolbar { 
  display: flex; 
  gap: 10px; 
  align-items: center; 
  flex-wrap: wrap; 
}

.camera-select-group {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f1f5f9;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.select-input {
  background: transparent;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
  outline: none;
  cursor: pointer;
  max-width: 180px;
}

.btn-icon {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
.btn-icon:hover:not(:disabled) { color: #0284c7; background-color: #e2e8f0; }

.spacer { flex: 1; }
.count-badge { 
  display: inline-flex; 
  align-items: center; 
  gap: 6px; 
  background-color: #f0f9ff; 
  color: #0284c7; 
  border: 1px solid #bae6fd; 
  padding: 6px 12px; 
  border-radius: 20px; 
  font-size: 0.775rem; 
  font-weight: 600; 
}
.count-badge .dot { 
  width: 6px; 
  height: 6px; 
  background-color: #0284c7; 
  border-radius: 50%; 
}

.btn { 
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  gap: 6px; 
  font-size: 0.85rem; 
  font-weight: 600; 
  padding: 8px 14px; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.2s ease; 
  border: 1px solid transparent; 
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary { background-color: #0284c7; color: #ffffff; }
.btn-primary:hover:not(:disabled) { background-color: #0369a1; }

.btn-webcam { background-color: #059669; color: #ffffff; }
.btn-webcam:hover:not(:disabled) { background-color: #047857; }

.btn-danger { background-color: #ef4444; color: #ffffff; }
.btn-danger:hover:not(:disabled) { background-color: #dc2626; }

.btn-secondary { background-color: #ffffff; border-color: #cbd5e1; color: #334155; }
.btn-secondary:hover:not(:disabled) { background-color: #f1f5f9; border-color: #94a3b8; }

.btn-outline { background-color: #f8fafc; border-color: #e2e8f0; color: #0f172a; }
.btn-outline:hover:not(:disabled) { background-color: #f1f5f9; border-color: #cbd5e1; }

.error-banner { 
  background-color: #fef2f2; 
  color: #dc2626; 
  border: 1px solid #fecaca; 
  padding: 12px; 
  border-radius: 8px; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 0.85rem; 
}

#stageWrap { 
  width: 100%; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  background-color: #0f172a; 
  border-radius: 8px; 
  overflow: hidden; 
  min-height: 440px; 
}
.stage-empty { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding: 40px 20px; 
  text-align: center; 
  color: #94a3b8; 
}
.empty-content { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  max-width: 360px; 
}
.empty-icon-wrapper { 
  background-color: rgba(255, 255, 255, 0.05); 
  padding: 16px; 
  border-radius: 50%; 
  margin-bottom: 12px; 
  color: #38bdf8; 
}
.empty-content h3 { color: #f8fafc; margin: 0 0 6px 0; font-size: 1rem; }
.empty-content .hint { font-size: 0.8rem; line-height: 1.5; color: #64748b; margin: 0; }
canvas { display: block; max-width: 100%; height: auto; cursor: crosshair; }

.save-form { 
  background-color: #f8fafc; 
  border: 1px solid #e2e8f0; 
  border-radius: 8px; 
  padding: 16px; 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}
.form-header { 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  font-weight: 600; 
  font-size: 0.875rem; 
  color: #0f172a; 
}
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-grid .full-width { grid-column: span 2; }
.form-actions { display: flex; gap: 8px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.775rem; font-weight: 600; color: #475569; }
.field input[type="text"], .form-select { 
  background-color: #ffffff; 
  border: 1px solid #cbd5e1; 
  color: #1e293b; 
  padding: 8px 12px; 
  border-radius: 6px; 
  font-size: 0.85rem; 
  outline: none; 
  transition: all 0.2s ease; 
}
.field input:focus, .form-select:focus { 
  border-color: #0284c7; 
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15); 
}

.epi-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  max-height: 120px;
  overflow-y: auto;
}

.checkbox-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #334155;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}
.checkbox-badge:hover { background-color: #e2e8f0; }
.checkbox-badge input[type="checkbox"] { accent-color: #0284c7; cursor: pointer; }

.side-panel { display: flex; flex-direction: column; gap: 16px; }
.panel-card { 
  background: #ffffff; 
  border: 1px solid #e2e8f0; 
  border-radius: 12px; 
  padding: 16px; 
  display: flex; 
  flex-direction: column; 
  gap: 14px; 
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); 
}
.card-title { display: flex; align-items: center; gap: 8px; color: #0f172a; }
.card-title h2 { font-size: 0.9rem; font-weight: 700; margin: 0; flex: 1; }
.counter-pill { 
  font-size: 0.75rem; 
  font-weight: 700; 
  background-color: #f1f5f9; 
  color: #64748b; 
  padding: 2px 8px; 
  border-radius: 12px; 
}

.zone-card { 
  background-color: #f8fafc; 
  border: 1px solid #e2e8f0; 
  border-radius: 8px; 
  padding: 12px; 
  margin-bottom: 10px; 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
}
.zone-header { display: flex; justify-content: space-between; align-items: center; }
.zone-header .name { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-weight: 600; 
  font-size: 0.85rem; 
  color: #0f172a; 
}
.swatch { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.remove-btn { 
  background: transparent; 
  border: none; 
  color: #94a3b8; 
  cursor: pointer; 
  padding: 4px; 
  border-radius: 4px; 
  display: flex; 
  align-items: center; 
}
.remove-btn:hover { color: #dc2626; background-color: #fef2f2; }
.meta-info { font-size: 0.75rem; color: #64748b; line-height: 1.4; }
.epis-list { 
  font-size: 0.775rem; 
  color: #334155; 
  background-color: #ffffff; 
  padding: 6px 8px; 
  border-radius: 4px; 
  border: 1px solid #f1f5f9; 
}

.empty-hint {
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
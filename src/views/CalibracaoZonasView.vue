<script setup>
import { ref, onMounted } from 'vue'
import { 
  Settings, 
  HardHat, 
  Box, 
  AlertTriangle, 
  LogOut, 
  Cctv, 
  SquareDashed, 
  Upload, 
  Undo2, 
  Check, 
  Plus, 
  Trash2, 
  Send, 
  Copy, 
  Download,
  Info,
  Sliders,
  Code
} from 'lucide-vue-next'

const COLORS = ['#0284c7', '#7c3aed', '#059669', '#d97706', '#dc2626', '#2563eb']

// Referências para elementos do DOM e estados reativos
const canvasRef = ref(null)
const fileInputRef = ref(null)
const carregando = ref(false)

let img = null
let naturalW = 0, naturalH = 0
let displayScale = 1
let ctx = null

const currentPoints = ref([])
const zones = ref([])

// Estados dos inputs do formulário de salvamento
const showForm = ref(false)
const zoneName = ref('')
const zoneMachineId = ref('')
const zoneEpis = ref('')
const apiUrlInput = ref('')
const jsonOutput = ref('{}')
const sendStatuses = ref({})

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
  }
  updateJsonOutput()
})

function triggerUpload() {
  fileInputRef.value.click()
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    img = new Image()
    img.onload = () => {
      naturalW = img.naturalWidth
      naturalH = img.naturalHeight

      const maxW = 760
      displayScale = Math.min(1, maxW / naturalW)
      
      if (canvasRef.value) {
        canvasRef.value.width = naturalW * displayScale
        canvasRef.value.height = naturalH * displayScale
      }

      currentPoints.value = []
      redraw()
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

function handleCanvasClick(e) {
  if (!img || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const dispX = (e.clientX - rect.left) * (canvasRef.value.width / rect.width)
  const dispY = (e.clientY - rect.top) * (canvasRef.value.height / rect.height)
  currentPoints.value.push([dispX, dispY])
  redraw()
}

function undoPoint() {
  currentPoints.value.pop()
  redraw()
}

function openSaveForm() {
  if (currentPoints.value.length < 3) return
  zoneName.value = `MAQUINA_${zones.value.length + 1}`
  zoneMachineId.value = ''
  zoneEpis.value = ''
  showForm.value = true
}

function cancelZone() {
  showForm.value = false
}

function saveZone() {
  const nomeFinal = zoneName.value.trim() || `ZONA_${zones.value.length + 1}`
  const idMaquina = zoneMachineId.value.trim()
  const epis = zoneEpis.value ? zoneEpis.value.split(',').map(s => s.trim()).filter(Boolean) : []

  const pontosOriginais = currentPoints.value.map(([x, y]) => [
    Math.round(x / displayScale),
    Math.round(y / displayScale)
  ])

  zones.value.push({
    nome: nomeFinal,
    id_maquina: idMaquina || null,
    pontos: pontosOriginais,
    epis_obrigatorios: epis,
    color: COLORS[zones.value.length % COLORS.length],
    status: null
  })

  currentPoints.value = []
  showForm.value = false
  updateJsonOutput()
  redraw()
}

function removeZone(index) {
  zones.value.splice(index, 1)
  updateJsonOutput()
  redraw()
}

function redraw() {
  if (!img || !ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height)

  // Zonas salvas
  zones.value.forEach(z => {
    const pts = z.pontos.map(([x, y]) => [x * displayScale, y * displayScale])
    drawPolygon(pts, z.color, true, z.nome)
  })

  // Zona em progresso
  if (currentPoints.value.length > 0) {
    drawPolygon(currentPoints.value, '#38bdf8', false, null)
    currentPoints.value.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#38bdf8'
      ctx.fill()
    })
  }
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

function updateJsonOutput() {
  const payload = {
    resolucao_referencia: { largura: naturalW, altura: naturalH },
    zonas: zones.value.map(z => ({
      nome: z.nome,
      id_maquina: z.id_maquina,
      polygon: z.pontos,
      epis_obrigatorios: z.epis_obrigatorios
    }))
  }
  jsonOutput.value = JSON.stringify(payload, null, 2)
}

async function sendZoneToBackend(index) {
  const z = zones.value[index]
  const apiUrl = apiUrlInput.value.trim()

  if (!apiUrl) {
    sendStatuses.value[index] = { text: 'Preencha a URL da API acima primeiro.', color: '#dc2626' }
    return
  }
  if (!z.id_maquina) {
    sendStatuses.value[index] = { text: 'Essa zona não tem id_maquina definido.', color: '#dc2626' }
    return
  }

  const payload = {
    resolucao_referencia: { largura: naturalW, altura: naturalH },
    polygon: z.pontos,
    epis_obrigatorios: z.epis_obrigatorios
  }

  sendStatuses.value[index] = { text: 'Enviando...', color: '#64748b' }

  try {
    const resp = await fetch(`${apiUrl.replace(/\/$/, '')}/maquina/${z.id_maquina}/zona`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (resp.ok) {
      sendStatuses.value[index] = { text: `Enviado (status ${resp.status})`, color: '#16a34a' }
    } else {
      sendStatuses.value[index] = { text: `Backend respondeu com erro (${resp.status})`, color: '#dc2626' }
    }
  } catch (err) {
    sendStatuses.value[index] = { text: `Falha de conexão: ${err.message}`, color: '#dc2626' }
  }
}

function copyJson() {
  navigator.clipboard.writeText(jsonOutput.value)
}

function downloadJson() {
  const blob = new Blob([jsonOutput.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'zonas_calibradas.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="layout-container">
    <!-- SIDEBAR MANTIDA INTACTA -->
    <aside class="sidebar">
      <div>
        <div class="sidebar-logo">
          <img src="../assets/logo_orizon_branca.png" alt="ORIZON">
          <span>Técnico</span>
        </div>

        <ul class="nav-menu">
          <li class="nav-item">
            <a href="/tecnico"><Settings /> Painel</a>
          </li>
          <li class="nav-item">
            <a href="/cadastro-epi"><HardHat /> Cadastro de Epi</a>
          </li>
          <li class="nav-item">
            <a href="/config-maquina"><Box /> Config. Máquina</a>
          </li>
          <li class="nav-item">
            <a href="/cadastro-camera"><Cctv /> Cadastro de Câmera</a>
          </li>
          <li class="nav-item active">
            <a href="/calibrar-zonas"><SquareDashed /> Calibração de Zonas</a>
          </li>
          <li class="nav-item">
            <a href="/alertas"><AlertTriangle /> Alertas</a>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <a href="/" class="logout-btn">
          <LogOut /> Sair
        </a>
      </div>
    </aside>

    <!-- ÁREA PRINCIPAL - DESIGN CLARO ORIZON -->
    <div v-if="carregando" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando dados do servidor...</p>
    </div>

    <main v-else class="main-content">
      <!-- Header Clean -->
      <header class="content-header">
        <div class="header-title">
          <h1>Calibração de Zonas</h1>
          <p>Delimite áreas de verificação de EPIs em cada câmera</p>
        </div>
      </header>

      <div class="layout-grid">
        <!-- ÁREA DO CANVAS (STAGE) -->
        <section class="stage-card">
          <!-- Toolbar -->
          <div class="toolbar">
            <button class="btn btn-primary" @click="triggerUpload">
              <Upload :size="16" /> Carregar Foto
            </button>
            <input type="file" ref="fileInputRef" @change="handleFileChange" accept="image/*" style="display:none">

            <button class="btn btn-secondary" @click="undoPoint" :disabled="currentPoints.length === 0">
              <Undo2 :size="16" /> Desfazer Ponto
            </button>

            <button class="btn btn-outline" @click="openSaveForm" :disabled="currentPoints.length < 3">
              <Check :size="16" /> Fechar Polígono
            </button>

            <div class="spacer"></div>

            <span class="count-badge" v-if="currentPoints.length > 0">
              <span class="dot"></span>
              {{ currentPoints.length }} ponto(s)
            </span>
          </div>

          <!-- Palco de Marcação -->
          <div id="stageWrap">
            <div class="stage-empty" v-if="!img">
              <div class="empty-content">
                <div class="empty-icon-wrapper">
                  <SquareDashed :size="32" />
                </div>
                <h3>Nenhuma imagem carregada</h3>
                <p class="hint">
                  Carregue um frame da câmera para delimitar visualmente os pontos onde a verificação de EPI deve ocorrer.
                </p>
              </div>
            </div>
            <canvas ref="canvasRef" @click="handleCanvasClick" :style="{ display: img ? 'block' : 'none' }"></canvas>
          </div>

          <!-- Formulário para Salvar Zona -->
          <div class="save-form" v-if="showForm">
            <div class="form-header">
              <Plus :size="18" />
              <span>Nova Zona Definida</span>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>Nome da Zona</label>
                <input type="text" v-model="zoneName" placeholder="ex: MAQUINA_A">
              </div>
              <div class="field">
                <label>ID da Máquina</label>
                <input type="text" v-model="zoneMachineId" placeholder="ex: 1">
              </div>
              <div class="field full-width">
                <label>EPIs Obrigatórios (separados por vírgula)</label>
                <input type="text" v-model="zoneEpis" placeholder="ex: epi_capacete, epi_oculos">
              </div>
            </div>
            <div class="form-actions">
              <button class="btn btn-primary" @click="saveZone">Salvar Zona</button>
              <button class="btn btn-secondary" @click="cancelZone">Cancelar</button>
            </div>
          </div>
        </section>

        <!-- PAINEL LATERAL DE CONFIGURAÇÃO E SAÍDA -->
        <aside class="side-panel">
          <!-- Configuração da API -->
          <div class="panel-card">
            <div class="card-title">
              <Sliders :size="16" />
              <h2>Configuração</h2>
            </div>
            <div class="field">
              <label>URL da API (Backend)</label>
              <input type="text" v-model="apiUrlInput" placeholder="https://webhook.site/seu-id">
            </div>
          </div>

          <!-- Zonas Definidas -->
          <div class="panel-card">
            <div class="card-title">
              <SquareDashed :size="16" />
              <h2>Zonas Definidas</h2>
              <span class="counter-pill">{{ String(zones.length).padStart(2, '0') }}</span>
            </div>

            <div id="zoneList" v-if="zones.length > 0">
              <div class="zone-card" v-for="(z, i) in zones" :key="i">
                <div class="zone-header">
                  <span class="name">
                    <span class="swatch" :style="{ background: z.color }"></span>
                    {{ z.nome }}
                  </span>
                  <button class="remove-btn" title="Remover" @click="removeZone(i)">
                    <Trash2 :size="14" />
                  </button>
                </div>

                <div class="meta-info">
                  {{ z.pontos.length }} pontos · ref {{ naturalW }}×{{ naturalH }}px · máquina: <b>{{ z.id_maquina ?? '—' }}</b>
                </div>

                <div class="epis-list">
                  {{ z.epis_obrigatorios.length ? 'EPIs: ' + z.epis_obrigatorios.join(', ') : 'Sem EPI obrigatório definido' }}
                </div>

                <button class="btn btn-send" @click="sendZoneToBackend(i)">
                  <Send :size="13" /> Enviar para Backend
                </button>

                <div class="send-status" v-if="sendStatuses[i]" :style="{ color: sendStatuses[i]?.color }">
                  {{ sendStatuses[i]?.text }}
                </div>
              </div>
            </div>

            <div class="empty-hint" v-else>
              <Info :size="16" />
              Nenhuma zona salva até o momento.
            </div>
          </div>

          <!-- Saída JSON -->
          <div class="panel-card">
            <div class="card-title">
              <Code :size="16" />
              <h2>Saída JSON</h2>
            </div>
            <pre id="jsonOut">{{ jsonOutput }}</pre>
            <div class="card-actions">
              <button class="btn btn-secondary" @click="copyJson">
                <Copy :size="14" /> Copiar
              </button>
              <button class="btn btn-primary" @click="downloadJson">
                <Download :size="14" /> Baixar .json
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Fundo Limpo Orizon */
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

/* Layout Grid */
.layout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;
}

/* Card do Canvas (Stage) */
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

/* Botões */
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #0284c7;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0369a1;
}

.btn-secondary {
  background-color: #ffffff;
  border-color: #cbd5e1;
  color: #334155;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.btn-outline {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  color: #0f172a;
}

.btn-outline:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

/* Palco de Exibição / Canvas */
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

.empty-content h3 {
  color: #f8fafc;
  margin: 0 0 6px 0;
  font-size: 1rem;
}

.empty-content .hint {
  font-size: 0.8rem;
  line-height: 1.5;
  color: #64748b;
  margin: 0;
}

canvas {
  display: block;
  max-width: 100%;
  height: auto;
  cursor: crosshair;
}

/* Formulário para Salvar Zona */
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-grid .full-width {
  grid-column: span 2;
}

.form-actions {
  display: flex;
  gap: 8px;
}

/* Inputs */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.775rem;
  font-weight: 600;
  color: #475569;
}

.field input {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s ease;
}

.field input:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

/* Painel Lateral */
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
}

.card-title h2 {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
}

.counter-pill {
  font-size: 0.75rem;
  font-weight: 700;
  background-color: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 12px;
}

/* Cards de Zona */
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

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zone-header .name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #0f172a;
}

.swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

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

.remove-btn:hover {
  color: #dc2626;
  background-color: #fef2f2;
}

.meta-info {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
}

.epis-list {
  font-size: 0.775rem;
  color: #334155;
  background-color: #ffffff;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #f1f5f9;
}

.btn-send {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0284c7;
  font-size: 0.775rem;
  padding: 6px 10px;
  justify-content: center;
}

.btn-send:hover {
  background-color: #f0f9ff;
  border-color: #38bdf8;
}

.send-status {
  font-size: 0.725rem;
  font-weight: 500;
}

.empty-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #64748b;
  padding: 8px 0;
}

/* Código JSON */
pre#jsonOut {
  margin: 0;
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  color: #38bdf8;
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-actions .btn {
  flex: 1;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #64748b;
  width: 100%;
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

/* Responsividade */
@media (max-width: 1024px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
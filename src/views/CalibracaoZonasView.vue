<script setup>
import { ref, onMounted } from 'vue'
import { Settings, HardHat, Box, AlertTriangle, LogOut, Cctv, SquareDashed } from 'lucide-vue-next'

const COLORS = ['#A8FFFF', '#765CFF', '#65E6EE', '#9B8CFF', '#4CC9F0', '#B8A9FF']

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
    drawPolygon(currentPoints.value, '#A8FFFF', false, null)
    currentPoints.value.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#A8FFFF'
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
  ctx.lineWidth = 2
  ctx.stroke()
  if (closed) {
    ctx.fillStyle = color + '22'
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
    sendStatuses.value[index] = { text: 'Preencha a URL da API acima primeiro.', color: 'var(--red)' }
    return
  }
  if (!z.id_maquina) {
    sendStatuses.value[index] = { text: 'Essa zona não tem id_maquina definido.', color: 'var(--red)' }
    return
  }

  const payload = {
    resolucao_referencia: { largura: naturalW, altura: naturalH },
    polygon: z.pontos,
    epis_obrigatorios: z.epis_obrigatorios
  }

  sendStatuses.value[index] = { text: 'Enviando...', color: 'var(--text-dim)' }

  try {
    const resp = await fetch(`${apiUrl.replace(/\/$/, '')}/maquina/${z.id_maquina}/zona`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (resp.ok) {
      sendStatuses.value[index] = { text: `Enviado (status ${resp.status})`, color: 'var(--teal)' }
    } else {
      sendStatuses.value[index] = { text: `Backend respondeu com erro (status ${resp.status})`, color: 'var(--red)' }
    }
  } catch (err) {
    sendStatuses.value[index] = { text: `Falha de conexão: ${err.message}`, color: 'var(--red)' }
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
        <!-- SIDEBAR -->
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

        <!-- MAIN CONTENT -->
        <div v-if="carregando" class="loading-state">Carregando dados do servidor...</div>

        <main v-else class="main-content">
            <div class="layout">
                <div class="stage">
                    <div class="toolbar">
                        <button class="btn" @click="triggerUpload">Carregar foto da câmera</button>
                        <input type="file" ref="fileInputRef" @change="handleFileChange" accept="image/*" style="display:none">
                        <button class="btn" @click="undoPoint" :disabled="currentPoints.length === 0">Desfazer ponto</button>
                        <button class="btn" @click="openSaveForm" :disabled="currentPoints.length < 3">Fechar polígono</button>
                        <div class="spacer"></div>
                        <span class="count" v-if="currentPoints.length > 0">{{ currentPoints.length }} ponto(s)</span>
                    </div>

                    <div id="stageWrap">
                        <div class="stage-empty" v-if="!img">
                            <div class="empty-content">
                                <div class="empty-kicker">Orizon / visão computacional</div>
                                <div class="empty-title">Nenhuma imagem carregada</div>
                                <span class="hint">Carregue um frame da câmera e marque os pontos da área onde o EPI deve ser detectado. Os pontos são convertidos automaticamente para a resolução original.</span>
                            </div>
                        </div>
                        <canvas ref="canvasRef" @click="handleCanvasClick" :style="{ display: img ? 'block' : 'none' }"></canvas>
                    </div>

                    <div class="save-form" v-if="showForm">
                        <div class="field">
                            <label>Nome da zona (usado no script Python)</label>
                            <input type="text" v-model="zoneName" placeholder="ex: MAQUINA_A">
                        </div>
                        <div class="field">
                            <label>ID da máquina no backend</label>
                            <input type="text" v-model="zoneMachineId" placeholder="ex: 1">
                        </div>
                        <div class="field">
                            <label>EPIs obrigatórios (separados por vírgula)</label>
                            <input type="text" v-model="zoneEpis" placeholder="ex: epi_capacete, epi_oculos">
                        </div>
                        <div class="row2">
                            <button class="btn btn-primary" @click="saveZone">Salvar zona</button>
                            <button class="btn" @click="cancelZone">Cancelar</button>
                        </div>
                    </div>
                </div>

                <div class="side">
                    <div class="side-section">
                        <div class="section-title"><h2>Configuração</h2><small>01</small></div>
                        <div class="field">
                            <label>URL da API</label>
                            <input type="text" v-model="apiUrlInput" placeholder="https://webhook.site/seu-id">
                        </div>
                    </div>

                    <div class="side-section">
                        <div class="section-title"><h2>Zonas definidas</h2><small>{{ String(zones.length).padStart(2, '0') }}</small></div>
                        <div id="zoneList">
                            <div class="zone-card" v-for="(z, i) in zones" :key="i">
                                <div class="row">
                                    <span class="name"><span class="swatch" :style="{ background: z.color }"></span>{{ z.nome }}</span>
                                    <button class="remove" title="remover" @click="removeZone(i)">×</button>
                                </div>
                                <div class="meta">{{ z.pontos.length }} pontos · ref {{ naturalW }}×{{ naturalH }}px · id_maquina: {{ z.id_maquina ?? '—' }}</div>
                                <div class="epis">{{ z.epis_obrigatorios.length ? 'EPIs: ' + z.epis_obrigatorios.join(', ') : 'Sem EPI obrigatório definido' }}</div>
                                <div class="row2" style="margin-top:4px;">
                                    <button class="btn send-zone" style="flex:1;" @click="sendZoneToBackend(i)">Enviar pro backend</button>
                                </div>
                                <div class="send-status" :style="{ color: sendStatuses[i]?.color }" style="font-size:11px; font-family: var(--mono);">
                                    {{ sendStatuses[i]?.text }}
                                </div>
                            </div>
                        </div>
                        <div class="empty-hint" v-if="zones.length === 0">Nenhuma zona salva ainda.</div>
                    </div>

                    <div class="side-section">
                        <div class="section-title"><h2>Saída para o backend</h2><small>03</small></div>
                        <pre id="jsonOut">{{ jsonOutput }}</pre>
                        <div class="row2" style="display:flex; gap:8px; margin-top:8px;">
                            <button class="btn" @click="copyJson">Copiar</button>
                            <button class="btn btn-primary" @click="downloadJson">Baixar .json</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Layout Principal e Sidebar (Integrados) */
.layout-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-deep, #050a12);
  color: var(--text, #e2e8f0);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.loading-state {
  padding: 40px;
  text-align: center;
  color: var(--muted, #94a3b8);
}

/* Estilos de Componentes e Etapas Existentes */
.brand {
  display: flex;
  align-items: center;
  gap: 18px;
}

.brand-logo {
  width: 116px;
  height: 54px;
  object-fit: contain;
  object-position: center;
}

.brand-divider {
  width: 1px;
  height: 28px;
  background: var(--line-strong, #334155);
}

.brand-copy { display: grid; gap: 2px; }

.brand-copy strong {
  font-size: 13px;
  font-weight: 650;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.brand-copy span {
  color: var(--muted, #94a3b8);
  font-size: 11px;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--muted, #94a3b8);
  font-size: 11px;
  font-family: var(--mono, monospace);
  text-transform: uppercase;
  letter-spacing: .08em;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cyan, #65e6ee);
  box-shadow: 0 0 14px rgba(168,255,255,.75);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
  min-height: calc(100vh - 0px);
}

.stage {
  min-width: 0;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-right: 1px solid var(--line, #1e293b);
}

.toolbar {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  align-items: center;
}

.toolbar .spacer { flex: 1; }

.toolbar .count {
  font-family: var(--mono, monospace);
  font-size: 11px;
  color: var(--cyan, #65e6ee);
  padding-left: 10px;
}

.btn {
  appearance: none;
  font-size: 12px;
  padding: 9px 13px;
  border-radius: 8px;
  border: 1px solid var(--line-strong, #334155);
  background: var(--panel, #111827);
  color: var(--text, #e2e8f0);
  cursor: pointer;
  transition: .18s ease;
}

.btn:hover {
  background: var(--panel-hover, #1f2937);
  border-color: #4a6285;
  transform: translateY(-1px);
}

.btn:active { transform: translateY(0); }

.btn:disabled {
  opacity: .32;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--cyan, #65e6ee), #7ddcff);
  border-color: transparent;
  color: #07121e;
  font-weight: 750;
}

.btn-primary:hover {
  border-color: transparent;
  box-shadow: 0 7px 24px rgba(101,230,238,.16);
}

.btn-danger { color: var(--danger, #ef4444); }

#stageWrap {
  min-height: 0;
  flex: 1;
  display: flex;
}

.stage-empty {
  flex: 1;
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line, #1e293b);
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(rgba(101,230,238,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(101,230,238,.035) 1px, transparent 1px),
    var(--bg-deep, #050a12);
  background-size: 34px 34px;
  text-align: center;
}

.stage-empty::before,
.stage-empty::after {
  content: "";
  position: absolute;
  width: 110px;
  height: 110px;
  border: 1px solid rgba(168,255,255,.13);
}

.stage-empty::before {
  top: 28px;
  left: 28px;
  border-right: 0;
  border-bottom: 0;
}

.stage-empty::after {
  right: 28px;
  bottom: 28px;
  border-left: 0;
  border-top: 0;
}

.empty-content {
  position: relative;
  z-index: 1;
  max-width: 430px;
}

.empty-kicker {
  color: var(--cyan, #65e6ee);
  font: 10px var(--mono, monospace);
  letter-spacing: .16em;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.empty-title {
  font-size: 21px;
  font-weight: 650;
  margin-bottom: 9px;
}

.stage-empty span.hint {
  display: block;
  color: var(--muted, #94a3b8);
  font-size: 12px;
  line-height: 1.7;
}

canvas {
  max-width: 100%;
  width: 100%;
  height: auto;
  align-self: flex-start;
  border: 1px solid var(--line-strong, #334155);
  background: #050a12;
  cursor: crosshair;
  display: block;
}

.side {
  background: rgba(8,14,25,.72);
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
}

.side-section {
  padding-bottom: 22px;
  border-bottom: 1px solid var(--line, #1e293b);
}

.side-section:last-child {
  border-bottom: 0;
}

.side h2 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .15em;
  color: var(--muted-2, #64748b);
  font-weight: 700;
  margin: 0 0 13px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.section-title small {
  color: var(--muted-2, #64748b);
  font: 10px var(--mono, monospace);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 11px;
}

.field:last-child { margin-bottom: 0; }

.field label {
  font-size: 11px;
  color: var(--muted, #94a3b8);
}

.field input {
  width: 100%;
  font-size: 12px;
  background: var(--panel-soft, #0f172a);
  border: 1px solid var(--line, #1e293b);
  color: var(--text, #e2e8f0);
  padding: 10px 11px;
  border-radius: 7px;
  transition: .18s ease;
}

.field input::placeholder { color: #4f6078; }

.field input:focus {
  outline: none;
  border-color: var(--cyan-strong, #38bdf8);
  box-shadow: 0 0 0 3px rgba(101,230,238,.07);
}

.zone-card {
  background: linear-gradient(145deg, rgba(16,26,43,.95), rgba(11,20,34,.95));
  border: 1px solid var(--line, #1e293b);
  border-radius: 10px;
  padding: 13px;
  margin-bottom: 9px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.zone-card:hover { border-color: var(--line-strong, #334155); }

.zone-card .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zone-card .swatch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
  box-shadow: 0 0 10px currentColor;
}

.zone-card .name {
  font-weight: 650;
  font-size: 12px;
}

.zone-card .meta {
  font-size: 10px;
  color: var(--muted-2, #64748b);
  font-family: var(--mono, monospace);
  line-height: 1.5;
}

.zone-card .epis {
  font-size: 11px;
  color: var(--muted, #94a3b8);
  line-height: 1.45;
}

.zone-card .remove {
  background: none;
  border: none;
  color: var(--muted-2, #64748b);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0 2px;
}

.zone-card .remove:hover { color: var(--danger, #ef4444); }

.empty-hint {
  font-size: 11px;
  color: var(--muted-2, #64748b);
  padding: 12px 0 2px;
}

pre#jsonOut {
  margin: 0;
  background: #070c15;
  border: 1px solid var(--line, #1e293b);
  border-radius: 9px;
  padding: 13px;
  font-family: var(--mono, monospace);
  font-size: 10px;
  line-height: 1.55;
  color: #b9e8e7;
  max-height: 220px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.save-form {
  background:
    linear-gradient(135deg, rgba(101,230,238,.06), transparent 50%),
    var(--panel, #111827);
  border: 1px solid #2c6170;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.save-form .row2,
.side .row2 {
  display: flex;
  gap: 8px;
}

.save-form .row2 .btn { flex: 1; }

.send-status { min-height: 14px; }

@media (max-width: 900px) {
  .layout-container { flex-direction: column; }
  .sidebar { width: 100%; flex-direction: row; align-items: center; padding: 12px 20px; }
  .sidebar-logo { margin-bottom: 0; }
  .nav-menu { flex-direction: row; gap: 4px; }
  .sidebar-footer { border-top: none; padding-top: 0; }
  .layout { grid-template-columns: 1fr; }
  .stage { border-right: 0; border-bottom: 1px solid var(--line, #1e293b); }
  .side { min-height: auto; }
}

@media (max-width: 600px) {
  .brand-divider, .brand-copy, .header-status { display: none; }
  .stage { padding: 16px; }
  .stage-empty { min-height: 390px; }
}
</style>
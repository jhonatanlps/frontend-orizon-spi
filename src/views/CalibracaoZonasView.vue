<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Settings, HardHat, Box, AlertTriangle, LogOut, Clock } from 'lucide-vue-next';
import axios from 'axios';
import { conectarWebSocket, desconectarWebSocket } from '../services/WebSocket';

const alertasRecentes = ref([])
const carregando = ref(false)

const qtdAlertasResolvidos = computed(() => {
                                    return alertasRecentes.value.filter(alerta => alerta.status === 'Resolvido').length
                                    })

const alertasNaoResolvido = computed(() => { return alertasRecentes.value.filter(alerta => alerta.status != 'Resolvido')})

async function buscarAlertas() {
    carregando.value = true
    try {
        const resposta = await axios.get('/api/alerta')

        console.log('Status:', resposta.status)
        console.log('Dados:', resposta.data)
        
        alertasRecentes.value = resposta.data

        console.log(qtdAlertasResolvidos)

    } catch (error) {
        console.error("Erro ao buscar o alerta", error)
    } finally {
        carregando.value = false
    }
    
}

async function resolverAlerta(id) {
    try {
        await axios.put(`/api/alerta/${id}`)
        buscarAlertas()
    } catch (error) {
        console.error("Erro ao resolver ", error)
    }
}

onMounted(() => {
    buscarAlertas()
    conectarWebSocket((alerta) => {
        alertasRecentes.value.unshift(alerta)
    })
})

onUnmounted(() => {
    desconectarWebSocket()
})

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
                    <li class="nav-item active">
                        <a href="/calibrar-zonas"><AlertTriangle /> Calibracao de zonas</a>
                    </li>
                    <li class="nav-item">
                        <a href="/alertas"><AlertTriangle /> Alerta</a>
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
        <div v-if="carregando">Carregando dados do servidor...</div>

        <main v-else class="main-content">
            <div class="layout">
                <div class="stage">
                    <div class="toolbar">
                    <button class="btn" id="btnUpload">Carregar foto da câmera</button>
                    <input type="file" id="fileInput" accept="image/*" style="display:none">
                    <button class="btn" id="btnUndo" disabled>Desfazer ponto</button>
                    <button class="btn" id="btnClose" disabled>Fechar polígono</button>
                    <div class="spacer"></div>
                    <span class="count" id="pointCount"></span>
                    </div>

                    <div id="stageWrap">
                    <div class="stage-empty" id="emptyState">
                        <div class="empty-content">
                        <div class="empty-kicker">Orizon / visão computacional</div>
                        <div class="empty-title">Nenhuma imagem carregada</div>
                        <span class="hint">Carregue um frame da câmera e marque os pontos da área onde o EPI deve ser detectado. Os pontos são convertidos automaticamente para a resolução original.</span>
                        </div>
                    </div>
                    <canvas id="canvas" style="display:none"></canvas>
                    </div>

                    <div class="save-form" id="saveForm" style="display:none">
                    <div class="field">
                        <label>Nome da zona (usado no script Python)</label>
                        <input type="text" id="zoneName" placeholder="ex: MAQUINA_A">
                    </div>
                    <div class="field">
                        <label>ID da máquina no backend</label>
                        <input type="text" id="zoneMachineId" placeholder="ex: 1">
                    </div>
                    <div class="field">
                        <label>EPIs obrigatórios (separados por vírgula)</label>
                        <input type="text" id="zoneEpis" placeholder="ex: epi_capacete, epi_oculos">
                    </div>
                    <div class="row2">
                        <button class="btn btn-primary" id="btnSaveZone">Salvar zona</button>
                        <button class="btn" id="btnCancelZone">Cancelar</button>
                    </div>
                    </div>
                </div>

                <div class="side">
                    <div class="side-section">
                    <div class="section-title"><h2>Configuração</h2><small>01</small></div>
                    <div class="field">
                        <label>URL da API</label>
                        <input type="text" id="apiUrlInput" placeholder="https://webhook.site/seu-id" value="">
                    </div>
                    </div>

                    <div class="side-section">
                    <div class="section-title"><h2>Zonas definidas</h2><small id="zoneCounter">02</small></div>
                    <div id="zoneList"></div>
                    <div class="empty-hint" id="zoneEmptyHint">Nenhuma zona salva ainda.</div>
                    </div>

                    <div class="side-section">
                    <div class="section-title"><h2>Saída para o backend</h2><small>03</small></div>
                    <pre id="jsonOut">{}</pre>
                    <div class="row2" style="display:flex; gap:8px; margin-top:8px;">
                        <button class="btn" id="btnCopy">Copiar</button>
                        <button class="btn btn-primary" id="btnDownload">Baixar .json</button>
                    </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>

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
  background: var(--line-strong);
}

.brand-copy { display: grid; gap: 2px; }

.brand-copy strong {
  font-size: 13px;
  font-weight: 650;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.brand-copy span {
  color: var(--muted);
  font-size: 11px;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--muted);
  font-size: 11px;
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: .08em;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 14px rgba(168,255,255,.75);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
  min-height: calc(100vh - 76px);
}

.stage {
  min-width: 0;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-right: 1px solid var(--line);
}

.toolbar {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  align-items: center;
}

.toolbar .spacer { flex: 1; }

.toolbar .count {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--cyan);
  padding-left: 10px;
}

.btn {
  appearance: none;
  font-size: 12px;
  padding: 9px 13px;
  border-radius: 8px;
  border: 1px solid var(--line-strong);
  background: var(--panel);
  color: var(--text);
  cursor: pointer;
  transition: .18s ease;
}

.btn:hover {
  background: var(--panel-hover);
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
  background: linear-gradient(135deg, var(--cyan), #7ddcff);
  border-color: transparent;
  color: #07121e;
  font-weight: 750;
}

.btn-primary:hover {
  border-color: transparent;
  box-shadow: 0 7px 24px rgba(101,230,238,.16);
}

.btn-danger { color: var(--danger); }

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
  border: 1px solid var(--line);
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(rgba(101,230,238,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(101,230,238,.035) 1px, transparent 1px),
    var(--bg-deep);
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
  color: var(--cyan);
  font: 10px var(--mono);
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
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}

canvas {
  max-width: 100%;
  width: 100%;
  height: auto;
  align-self: flex-start;
  border: 1px solid var(--line-strong);
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
  border-bottom: 1px solid var(--line);
}

.side-section:last-child {
  border-bottom: 0;
}

.side h2 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .15em;
  color: var(--muted-2);
  font-weight: 700;
  margin: 0 0 13px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.section-title small {
  color: var(--muted-2);
  font: 10px var(--mono);
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
  color: var(--muted);
}

.field input {
  width: 100%;
  font-size: 12px;
  background: var(--panel-soft);
  border: 1px solid var(--line);
  color: var(--text);
  padding: 10px 11px;
  border-radius: 7px;
  transition: .18s ease;
}

.field input::placeholder { color: #4f6078; }

.field input:focus {
  outline: none;
  border-color: var(--cyan-strong);
  box-shadow: 0 0 0 3px rgba(101,230,238,.07);
}

.zone-card {
  background: linear-gradient(145deg, rgba(16,26,43,.95), rgba(11,20,34,.95));
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 13px;
  margin-bottom: 9px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.zone-card:hover { border-color: var(--line-strong); }

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
  color: var(--muted-2);
  font-family: var(--mono);
  line-height: 1.5;
}

.zone-card .epis {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.45;
}

.zone-card .remove {
  background: none;
  border: none;
  color: var(--muted-2);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0 2px;
}

.zone-card .remove:hover { color: var(--danger); }

.empty-hint {
  font-size: 11px;
  color: var(--muted-2);
  padding: 12px 0 2px;
}

pre#jsonOut {
  margin: 0;
  background: #070c15;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 13px;
  font-family: var(--mono);
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
    var(--panel);
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
  .layout { grid-template-columns: 1fr; }
  .stage { border-right: 0; border-bottom: 1px solid var(--line); }
  .side { min-height: auto; }
}

@media (max-width: 600px) {
  header { padding: 0 16px; }
  .brand-divider, .brand-copy, .header-status { display: none; }
  .stage { padding: 16px; }
  .stage-empty { min-height: 390px; }
}

</style>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, HardHat, Box, AlertTriangle, LogOut, MapPin, SquarePen, Plus} from 'lucide-vue-next';

const email = ref('')
const senha = ref('')
const router = useRouter()

function handleLogin() {
  // Lógica que estava no seu script.js
  if (email.value && senha.value) {
    router.push('/supervisor') // Redireciona para o painel
  }
}
</script>

<template>
    <div class="layout-container">
        <aside class="sidebar">
            <div>
                <div class="sidebar-logo">
                    <img src="../assets/logo_orizon_branca.png" alt="ORIZON">
                    <span>Técnico</span>
                </div>

                <ul class="nav-menu">
                    <li class="nav-item active">
                        <a href="/tecnico"><Settings /> Painel</a>
                    </li>
                    <li class="nav-item">
                        <a href="/cadastro-epi"><HardHat /> Cadastro de Epi</a>
                    </li>
                    <li class="nav-item">
                        <a href="/config-maquina"><Box /> Config. Máquina</a>
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
        <main class="main-content">
            <header class="page-header">
                <h1 class="page-title">Painel do Técnico</h1>
                <p class="page-subtitle">Gestão de equipamentos, EPIs e áreas monitoradas</p>
            </header>

            <!-- METRICS CARDS -->
            <div class="metrics-grid">
                <div class="metric-card purple">
                <div class="metric-icon">
                    <Box />
                </div>
                <div class="metric-info">
                    <span class="metric-label">Máquinas Cadastradas</span>
                    <span class="metric-value">4</span>
                </div>
                </div>

                <div class="metric-card cyan">
                <div class="metric-icon">
                    <HardHat />
                </div>
                <div class="metric-info">
                    <span class="metric-label">EPIs Disponíveis</span>
                    <span class="metric-value">4</span>
                </div>
                </div>

                <div class="metric-card dark">
                <div class="metric-icon">
                    <MapPin />
                </div>
                <div class="metric-info">
                    <span class="metric-label">Áreas Monitoradas</span>
                    <span class="metric-value">3</span>
                </div>
                </div>
            </div>

            <!-- GESTÃO DE MÁQUINAS -->
            <div class="card">
                <div class="card-header-flex">
                <h2 class="card-title">Gestão de Máquinas</h2>
                <button class="btn btn-purple">
                    <Plus :size="16" /> Nova Máquina
                </button>
                </div>

                <div class="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Máquina</th>
                        <th>Área</th>
                        <th>Status</th>
                        <th>Última Manutenção</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="machine-name">Prensa Hidráulica 01</td>
                        <td>Setor A</td>
                        <td><span class="badge badge-ativo">Ativo</span></td>
                        <td>05/06/2026</td>
                        <td>
                        <div class="action-btns">
                            <button class="action-btn edit" title="Editar"><i data-lucide="square-pen" size="18"></i></button>
                            <button class="action-btn delete" title="Excluir"><i data-lucide="trash-2" size="18"></i></button>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="machine-name">Torno CNC 03</td>
                        <td>Setor B</td>
                        <td><span class="badge badge-manutencao">Manutenção</span></td>
                        <td>08/06/2026</td>
                        <td>
                        <div class="action-btns">
                            <button class="action-btn edit" title="Editar"><i data-lucide="square-pen" size="18"></i></button>
                            <button class="action-btn delete" title="Excluir"><i data-lucide="trash-2" size="18"></i></button>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="machine-name">Esteira Transportadora 02</td>
                        <td>Setor A</td>
                        <td><span class="badge badge-ativo">Ativo</span></td>
                        <td>01/06/2026</td>
                        <td>
                        <div class="action-btns">
                            <button class="action-btn edit" title="Editar"><i data-lucide="square-pen" size="18"></i></button>
                            <button class="action-btn delete" title="Excluir"><i data-lucide="trash-2" size="18"></i></button>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="machine-name">Compressor Industrial 05</td>
                        <td>Setor C</td>
                        <td><span class="badge badge-inativo">Inativo</span></td>
                        <td>10/05/2026</td>
                        <td>
                        <div class="action-btns">
                            <button class="action-btn edit" title="Editar"><i data-lucide="square-pen" size="18"></i></button>
                            <button class="action-btn delete" title="Excluir"><i data-lucide="trash-2" size="18"></i></button>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <!-- GESTÃO DE EPIS -->
                <div class="card">

                    <div class="card-header-flex">
                        <h2 class="card-title">Gestão de EPIs</h2>
                        <button class="btn btn-cyan">
                            <Plus :size="16" /> Nova EPI
                        </button>
                    </div>

                    <div class="epi-cards-grid">
                        <!-- EPI Item 1 -->
                        <div class="epi-item-card">
                            <div class="epi-card-header">
                                <div>
                                    <div class="epi-name">Capacete de Segurança</div>
                                    <div class="epi-desc">Proteção Craniana</div>
                                </div>
                                <div class="action-btns">
                                    <button class="action-btn edit"><i data-lucide="square-pen" size="18"></i></button>
                                    <button class="action-btn delete"><i data-lucide="trash-2" size="18"></i></button>
                                </div>
                            </div>

                            <div class="epi-metrics">
                                <div class="epi-metric-box">
                                    <label>Quantidade</label>
                                    <div class="val green">45</div>
                                </div>
                                <div class="epi-metric-box" style="text-align: right;">
                                    <label>Mínimo</label>
                                    <div class="val dark">30</div>
                                </div>
                            </div>
                        </div>

                        <!-- EPI Item 2 -->
                        <div class="epi-item-card">
                            <div class="epi-card-header">
                                <div>
                                    <div class="epi-name">Luvas de Proteção Química</div>
                                    <div class="epi-desc">Proteção das Mãos</div>
                                </div>
                                <div class="action-btns">
                                    <button class="action-btn edit"><i data-lucide="square-pen" size="18"></i></button>
                                    <button class="action-btn delete"><i data-lucide="trash-2" size="18"></i></button>
                                </div>
                            </div>
                            <div class="epi-metrics">
                                <div class="epi-metric-box">
                                    <label>Quantidade</label>
                                    <div class="val green">27</div>
                                </div>
                                <div class="epi-metric-box" style="text-align: right;">
                                    <label>Mínimo</label>
                                    <div class="val dark">25</div>
                                </div>
                            </div>
                        </div>

                        <!-- EPI Item 3 -->
                        <div class="epi-item-card">
                            <div class="epi-card-header">
                                <div>
                                    <div class="epi-name">Óculos de Proteção</div>
                                    <div class="epi-desc">Proteção Visual</div>
                                </div>
                                <div class="action-btns">
                                    <button class="action-btn edit"><i data-lucide="square-pen" size="18"></i></button>
                                    <button class="action-btn delete"><i data-lucide="trash-2" size="18"></i></button>
                                </div>
                            </div>
                            <div class="epi-metrics">
                                <div class="epi-metric-box">
                                    <label>Quantidade</label>
                                    <div class="val green">67</div>
                                </div>
                                <div class="epi-metric-box" style="text-align: right;">
                                    <label>Mínimo</label>
                                    <div class="val dark">40</div>
                                </div>
                            </div>
                        </div>

                        <!-- EPI Item 4 -->
                        <div class="epi-item-card">
                            <div class="epi-card-header">
                                <div>
                                    <div class="epi-name">Botas de Segurança</div>
                                    <div class="epi-desc">Proteção dos Pés</div>
                                </div>
                                <div class="action-btns">
                                    <button class="action-btn edit"><i data-lucide="square-pen" size="18"></i></button>
                                    <button class="action-btn delete"><i data-lucide="trash-2" size="18"></i></button>
                                </div>
                            </div>
                            <div class="epi-metrics">
                                <div class="epi-metric-box">
                                    <label>Quantidade</label>
                                    <div class="val green">38</div>
                                </div>
                                <div class="epi-metric-box" style="text-align: right;">
                                    <label>Mínimo</label>
                                    <div class="val dark">35</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>

            <!-- ÁREAS MONITORADAS -->
                <div class="card">
                    <div class="card-header-flex" style="margin-bottom: 16px;">
                        <h2 class="card-title">Áreas Monitoradas</h2>
                    </div>

                    <div class="areas-grid">

                        <div class="area-card">
                            <div class="area-title">Setor A - Linha de Produção 1</div>
                            <div class="area-details">
                                <div class="area-detail-item">
                                    <label>Máquinas</label>
                                    <span>5</span>
                                </div>
                                <div class="area-detail-item" style="text-align: right;">
                                    <label>Monitoramento</label>
                                    <span class="status-green">Ativo</span>
                                </div>
                            </div>
                        </div>  

                        <div class="area-card">
                            <div class="area-title">Setor B - Montagem</div>
                            <div class="area-details">
                                <div class="area-detail-item">
                                    <label>Máquinas</label>
                                    <span>3</span>
                                </div>
                                <div class="area-detail-item" style="text-align: right;">
                                    <label>Monitoramento</label>
                                    <span class="status-green">Ativo</span>
                                </div>
                            </div>
                        </div>

                        <div class="area-card">
                            <div class="area-title">Setor C - Área Química</div>
                            <div class="area-details">
                                <div class="area-detail-item">
                                    <label>Máquinas</label>
                                    <span>2</span>
                                </div>
                                <div class="area-detail-item" style="text-align: right;">
                                    <label>Monitoramento</label>
                                    <span class="status-green">Ativo</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
        </main>
    </div>
</template>

<style scoped>

/* --- MAIN CONTENT --- */
.main-content {
    flex: 1;
    padding: 32px 40px;
    overflow-y: auto;
}

.page-header {
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-main);
}

.page-subtitle {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 4px;
}

/* --- SUMMARY METRICS CARDS --- */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
}

.metric-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    position: relative;
    overflow: hidden;
}

.metric-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
}

.metric-card.purple::before { background-color: var(--primary); }
.metric-card.cyan::before { background-color: #38bdf8; }
.metric-card.dark::before { background-color: #1e293b; }

.metric-icon {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.metric-card.purple .metric-icon { background-color: #f0f0fe; color: var(--primary); }
.metric-card.cyan .metric-icon { background-color: #e0f2fe; color: #0284c7; }
.metric-card.dark .metric-icon { background-color: #f1f5f9; color: #0f172a; }

.metric-info {
    display: flex;
    flex-direction: column;
}

.metric-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
}

.metric-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-main);
    line-height: 1.2;
    margin-top: 2px;
}

/* --- CARDS & TABLES --- */
.card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    margin-bottom: 24px;
}

.card-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.card-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
}

/* BUTTONS */
.btn {
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    transition: background-color 0.2s;
}

.btn-purple {
    background-color: var(--primary);
    color: #ffffff;
}

.btn-purple:hover {
    background-color: var(--primary-hover);
}

.btn-cyan {
    background-color: #38bdf8;
    color: #ffffff;
}

.btn-cyan:hover {
    background-color: #0284c7;
}

/* --- TABLE STYLING --- */
.table-container {
    width: 100%;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

th {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
}

td {
    padding: 16px;
    font-size: 14px;
    color: var(--text-main);
    border-bottom: 1px solid #f1f5f9;
}

tr:last-child td {
    border-bottom: none;
}

.machine-name {
    font-weight: 600;
}

/* BADGES */
.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.badge-ativo {
    background-color: var(--status-active-bg);
    color: var(--status-active-text);
}

.badge-manutencao {
    background-color: var(--status-maint-bg);
    color: var(--status-maint-text);
}

.badge-inativo {
    background-color: var(--status-inact-bg);
    color: var(--status-inact-text);
}

/* ACTION ICONS */
.action-btns {
    display: flex;
    gap: 10px;
    align-items: center;
}

.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    transition: opacity 0.2s;
}

.action-btn.edit { color: var(--action-edit); }
.action-btn.delete { color: var(--action-delete); }
.action-btn:hover { opacity: 0.7; }

/* --- EPI GRID --- */
.epi-cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.epi-item-card {
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 16px 20px;
    background-color: #ffffff;
}

.epi-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.epi-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
}

.epi-desc {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
}

.epi-metrics {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.epi-metric-box label {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 2px;
}

.epi-metric-box .val {
    font-size: 18px;
    font-weight: 700;
}

.epi-metric-box .val.green {
    color: #16a34a;
}

.epi-metric-box .val.dark {
    color: var(--text-main);
}

/* --- ÁREAS MONITORADAS GRID --- */
.areas-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.area-card {
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 16px 20px;
    background-color: #ffffff;
}

.area-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 12px;
}

.area-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.area-detail-item label {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 2px;
}

.area-detail-item span {
    font-size: 13px;
    font-weight: 600;
}

.area-detail-item span.status-green {
    color: #16a34a;
}

/* RESPONSIVIDADE */
@media (max-width: 900px) {
    .metrics-grid {
    grid-template-columns: 1fr;
    }
    .epi-cards-grid, .areas-grid {
    grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    body {
    flex-direction: column;
    }
    .sidebar {
    width: 100%;
    }
    .main-content {
    padding: 20px;
    }
}

@import '../assets/css/tecnico.css';
</style>
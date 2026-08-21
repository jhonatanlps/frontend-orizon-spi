<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, Activity, Accessibility, TrendingUp, LogOut, FileText } from 'lucide-vue-next';

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
                    <img src="../assets/logo_orizon_branca.png" alt="ORIZON" />
                    <span>Supervisor</span>
                </div>

                <ul class="nav-menu">
                    <li class="nav-item active">
                        <a href="/supervisor"><Settings /> Painel</a>
                    </li>
                    <li class="nav-item">
                        <a href="/relatorios"><FileText /> Relatórios</a>
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
            <h1 class="page-title">Painel do Supervisor</h1>
            <p class="page-subtitle">Visão geral do sistema de segurança industrial</p>
            </header>

            <!-- METRICS CARDS -->
            <div class="metrics-grid">
            <div class="metric-card purple">
                <div class="metric-icon">
                <Activity :size="48" :stroke-width="2.5" />
                </div>
                <div class="metric-info">
                <span class="metric-label">Total de ocorrências</span>
                <span class="metric-value">4</span>
                </div>
            </div>

            <div class="metric-card cyan">
                <div class="metric-icon">
                <Accessibility :size="48" :stroke-width="2.5" />
                </div>
                <div class="metric-info">
                <span class="metric-label">Funcionários Ativos</span>
                <span class="metric-value">6</span>
                </div>
            </div>

            <div class="metric-card green">
                <div class="metric-icon">
                <TrendingUp :size="48" :stroke-width="2.5" />
                </div>
                <div class="metric-info">
                <span class="metric-label">Conformidade</span>
                <span class="metric-value">94%</span>
                </div>
            </div>
            </div>

            <!-- OCORRÊNCIAS MENSAIS (BAR CHART) -->
            <div class="card">
            <h2 class="card-title">Ocorrências Mensais</h2>
            <div class="chart-container">
                <!-- Utilizando SVG para o gráfico de barras -->
                <svg class="chart-svg" viewBox="0 -10 800 230" preserveAspectRatio="none">
                <!-- Grid Lines & Y Axis Labels -->
                <line x1="40" y1="0" x2="800" y2="0" class="chart-grid-line" />
                <text x="25" y="4" class="chart-axis-text" text-anchor="end">24</text>
                
                <line x1="40" y1="50" x2="800" y2="50" class="chart-grid-line" />
                <text x="25" y="54" class="chart-axis-text" text-anchor="end">18</text>
                
                <line x1="40" y1="100" x2="800" y2="100" class="chart-grid-line" />
                <text x="25" y="104" class="chart-axis-text" text-anchor="end">12</text>
                
                <line x1="40" y1="150" x2="800" y2="150" class="chart-grid-line" />
                <text x="25" y="154" class="chart-axis-text" text-anchor="end">6</text>
                
                <line x1="40" y1="200" x2="800" y2="200" class="chart-grid-line" />
                <text x="25" y="204" class="chart-axis-text" text-anchor="end">0</text>

                <!-- Bars (Max Height = 200) -->
                <!-- Jan -->
                <rect x="80" y="175" width="35" height="25" class="chart-bar-cyan" />
                <rect x="120" y="191" width="35" height="9" class="chart-bar-dark" />
                <text x="117" y="225" class="chart-axis-text" text-anchor="middle">Jan</text>

                <!-- Fev -->
                <rect x="200" y="30" width="35" height="170" class="chart-bar-cyan" />
                <rect x="240" y="75" width="35" height="125" class="chart-bar-dark" />
                <text x="237" y="225" class="chart-axis-text" text-anchor="middle">Fev</text>

                <!-- Mar -->
                <rect x="320" y="115" width="35" height="85" class="chart-bar-cyan" />
                <rect x="360" y="115" width="35" height="85" class="chart-bar-dark" />
                <text x="357" y="225" class="chart-axis-text" text-anchor="middle">Mar</text>

                <!-- Abr -->
                <rect x="440" y="155" width="35" height="45" class="chart-bar-cyan" />
                <rect x="480" y="175" width="35" height="25" class="chart-bar-dark" />
                <text x="477" y="225" class="chart-axis-text" text-anchor="middle">Abr</text>

                <!-- Mai -->
                <rect x="560" y="10" width="35" height="190" class="chart-bar-cyan" />
                <rect x="600" y="30" width="35" height="170" class="chart-bar-dark" />
                <text x="597" y="225" class="chart-axis-text" text-anchor="middle">Mai</text>

                <!-- Jun -->
                <rect x="680" y="50" width="35" height="150" class="chart-bar-cyan" />
                <rect x="720" y="50" width="35" height="150" class="chart-bar-dark" />
                <text x="717" y="225" class="chart-axis-text" text-anchor="middle">Jun</text>
                </svg>

                <div class="chart-legend">
                <div class="legend-item">
                    <div class="legend-color bg-cyan"></div> Resolvidas
                </div>
                <div class="legend-item">
                    <div class="legend-color bg-dark"></div> Concluídas
                </div>
                </div>
            </div>
            </div>

            <!-- TENDÊNCIAS DE CONFORMIDADES (LINE CHART) -->
            <div class="card">
            <h2 class="card-title">Tendências de Conformidades</h2>
            <div class="chart-container">
                <!-- Utilizando SVG para o gráfico de linhas -->
                <svg class="chart-svg" viewBox="0 -10 800 230" preserveAspectRatio="none">
                <!-- Grid Lines & Y Axis Labels -->
                <line x1="40" y1="0" x2="800" y2="0" class="chart-grid-line" />
                <text x="25" y="4" class="chart-axis-text" text-anchor="end">24</text>
                
                <line x1="40" y1="50" x2="800" y2="50" class="chart-grid-line" />
                <text x="25" y="54" class="chart-axis-text" text-anchor="end">18</text>
                
                <line x1="40" y1="100" x2="800" y2="100" class="chart-grid-line" />
                <text x="25" y="104" class="chart-axis-text" text-anchor="end">12</text>
                
                <line x1="40" y1="150" x2="800" y2="150" class="chart-grid-line" />
                <text x="25" y="154" class="chart-axis-text" text-anchor="end">6</text>
                
                <line x1="40" y1="200" x2="800" y2="200" class="chart-grid-line" />
                <text x="25" y="204" class="chart-axis-text" text-anchor="end">0</text>

                <!-- X Axis Markers & Labels -->
                <!-- Pts X: 40, 192, 344, 496, 648, 800 -->
                <line x1="40" y1="200" x2="40" y2="205" stroke="#e2e8f0" />
                <text x="40" y="225" class="chart-axis-text" text-anchor="middle">0</text>
                <line x1="192" y1="200" x2="192" y2="205" stroke="#e2e8f0" />
                <text x="192" y="225" class="chart-axis-text" text-anchor="middle">1</text>
                <line x1="344" y1="200" x2="344" y2="205" stroke="#e2e8f0" />
                <text x="344" y="225" class="chart-axis-text" text-anchor="middle">2</text>
                <line x1="496" y1="200" x2="496" y2="205" stroke="#e2e8f0" />
                <text x="496" y="225" class="chart-axis-text" text-anchor="middle">3</text>
                <line x1="648" y1="200" x2="648" y2="205" stroke="#e2e8f0" />
                <text x="648" y="225" class="chart-axis-text" text-anchor="middle">4</text>
                <line x1="800" y1="200" x2="800" y2="205" stroke="#e2e8f0" />
                <text x="800" y="225" class="chart-axis-text" text-anchor="middle">5</text>

                <!-- LINES -->
                <!-- Line Cyan -->
                <polyline class="chart-line-cyan" points="40,5 192,15 344,55 496,25 648,40 800,50" />
                <!-- Points Cyan -->
                <circle cx="40" cy="5" r="4" class="chart-point chart-point-cyan" />
                <circle cx="192" cy="15" r="4" class="chart-point chart-point-cyan" />
                <circle cx="344" cy="55" r="4" class="chart-point chart-point-cyan" />
                <circle cx="496" cy="25" r="4" class="chart-point chart-point-cyan" />
                <circle cx="648" cy="40" r="4" class="chart-point chart-point-cyan" />
                <circle cx="800" cy="50" r="4" class="chart-point chart-point-cyan" />

                <!-- Line Dark -->
                <polyline class="chart-line-dark" points="40,85 192,70 344,80 496,55 648,90 800,75" />
                <!-- Points Dark -->
                <circle cx="40" cy="85" r="4" class="chart-point chart-point-dark" />
                <circle cx="192" cy="70" r="4" class="chart-point chart-point-dark" />
                <circle cx="344" cy="80" r="4" class="chart-point chart-point-dark" />
                <circle cx="496" cy="55" r="4" class="chart-point chart-point-dark" />
                <circle cx="648" cy="90" r="4" class="chart-point chart-point-dark" />
                <circle cx="800" cy="75" r="4" class="chart-point chart-point-dark" />
                </svg>

                <div class="chart-legend">
                <div class="legend-item">
                    <div class="legend-color bg-cyan"></div> Resolvidas
                </div>
                <div class="legend-item">
                    <div class="legend-color bg-dark"></div> Concluídas
                </div>
                </div>
            </div>
            </div>

            <!-- INFRAÇÕES RECENTES TABLE -->
            <div class="card" style="padding: 0; overflow: hidden;">
            <h2 class="card-title" style="padding: 24px 24px 0 24px; margin-bottom: 16px;">Infrações recentes</h2>
            <div class="table-container">
                <table>
                <thead>
                    <tr>
                    <th>Funcionário</th>
                    <th>Tipo</th>
                    <th>Área</th>
                    <th>Hora</th>
                    <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td class="fw-600">Jorge</td>
                    <td>Procedimento inadequado</td>
                    <td>Setor A</td>
                    <td>14:03</td>
                    <td><span class="badge badge-baixo">Baixo</span></td>
                    </tr>
                    <tr>
                    <td class="fw-600">Pedro</td>
                    <td>Acesso não autorizado</td>
                    <td>Setor B</td>
                    <td>16:57</td>
                    <td><span class="badge badge-medio">Médio</span></td>
                    </tr>
                    <tr>
                    <td class="fw-600">Ana</td>
                    <td>Procedimento inadequado</td>
                    <td>Setor A</td>
                    <td>10:20</td>
                    <td><span class="badge badge-baixo">Baixo</span></td>
                    </tr>
                    <tr>
                    <td class="fw-600">Maria</td>
                    <td>EPI não utilizado</td>
                    <td>Setor C</td>
                    <td>11:09</td>
                    <td><span class="badge badge-critico">Crítico</span></td>
                    </tr>
                </tbody>
                </table>
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

/* --- TOP METRICS CARDS --- */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.metric-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
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
    width: 5px;
}

.metric-card.purple::before { background-color: var(--primary); }
.metric-card.cyan::before { background-color: var(--cyan); }
.metric-card.green::before { background-color: var(--green); }

.metric-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.metric-card.purple .metric-icon { color: var(--primary); }
.metric-card.cyan .metric-icon { color: var(--cyan); }
.metric-card.green .metric-icon { color: var(--green); }

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
    margin-top: 4px;
}

/* --- CARDS --- */
.card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    margin-bottom: 24px;
}

.card-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 24px;
}

/* --- CHARTS (SVG Styles) --- */
.chart-container {
    width: 100%;
    position: relative;
}

.chart-svg {
    width: 100%;
    height: auto;
    max-height: 250px;
    display: block;
    overflow: visible;
}

.chart-grid-line {
    stroke: #e2e8f0;
    stroke-width: 1;
}

.chart-axis-text {
    fill: #64748b;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
}

.chart-bar-cyan { fill: var(--chart-cyan); }
.chart-bar-dark { fill: var(--chart-dark); }

.chart-line-cyan {
    fill: none;
    stroke: var(--chart-cyan);
    stroke-width: 2;
}

.chart-line-dark {
    fill: none;
    stroke: var(--chart-dark);
    stroke-width: 2;
}

.chart-point {
    fill: #ffffff;
    stroke-width: 2;
}

.chart-point-cyan { stroke: var(--chart-cyan); }
.chart-point-dark { stroke: var(--chart-dark); }

.chart-legend {
    display: flex;
    gap: 20px;
    margin-top: 24px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-main);
    font-weight: 500;
}

.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 2px;
}

.bg-cyan { background-color: var(--chart-cyan); }
.bg-dark { background-color: var(--chart-dark); }

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
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
}

td {
    padding: 16px 20px;
    font-size: 14px;
    color: var(--text-main);
    border-bottom: 1px solid #f1f5f9;
}

tr:last-child td {
    border-bottom: none;
}

.fw-600 {
    font-weight: 600;
}

/* BADGES */
.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
}

.badge-baixo {
    background-color: var(--status-baixo-bg);
    color: var(--status-baixo-text);
}

.badge-medio {
    background-color: var(--status-medio-bg);
    color: var(--status-medio-text);
}

.badge-critico {
    background-color: var(--status-critico-bg);
    color: var(--status-critico-text);
}

/* Responsividade */
@media (max-width: 1024px) {
    .metrics-grid {
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

@import '../assets/css/painelSupervisor.css';
</style>
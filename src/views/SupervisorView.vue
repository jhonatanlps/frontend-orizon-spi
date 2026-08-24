<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, Activity, Accessibility, TrendingUp, LogOut, FileText } from 'lucide-vue-next';
import GraficoZona from '../components/GraficoZona.vue';
import GraficoPizza from '../components/GraficoPizza.vue';

onMounted(() => {
    
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

            <div class="card-flex">

                <div style="width: 100%; max-width: 1000px;" class="card">
                    <h2 class="card-title">Conformidade por Zonas</h2>
                    <div class="chart-container">
                        <GraficoZona />
                    </div>
                </div>

                <div style="width: 100%; max-width: 560px;" class="card">
                    <h2 class="card-title">Ocorrências</h2>
                    <div class="chart-container">   
                        <GraficoPizza />
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
.card-flex {
    display: flex;
    gap: 24px;
}

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
    .card-grid {
        flex-direction: column;
    }
}

@media (max-width: 768px) {
    .layout-container {
        flex-direction: column;
    }
    .card-grid {
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
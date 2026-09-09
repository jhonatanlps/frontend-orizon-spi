<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, Cctv, ChevronDown, Calendar, BarChart2, ClipboardCheck, Siren, Users, BookOpen, Download, LogOut, FileText } from 'lucide-vue-next';

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
                    <li class="nav-item">
                        <a href="/supervisor"><Settings /> Painel</a>
                    </li>
                    <li class="nav-item active">
                        <a href="/relatorios"><FileText /> Relatórios</a>
                    </li>
                    <li class="nav-item">
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

        <!-- MAIN CONTENT -->
        <main class="main-content">
            <header class="page-header">
            <h1 class="page-title">Relatórios</h1>
            <p class="page-subtitle">Gere relatórios personalizados de segurança e conformidade</p>
            </header>

            <!-- FILTROS -->
            <section class="section-card">
            <h2 class="section-title">Filtros</h2>
            <div class="filters-row">
                <!-- Setor -->
                <div class="filter-group">
                <label class="filter-label">Setor</label>
                <div class="filter-input-wrapper">
                    <select>
                    <option>Todos os setores</option>
                    <option>Setor A</option>
                    <option>Setor B</option>
                    <option>Setor C</option>
                    </select>
                    <ChevronDown :class="select-arrow" :size="18" />
                </div>
                </div>

                <!-- Data Início -->
                <div class="filter-group">
                <label class="filter-label">Data início</label>
                <div class="filter-input-wrapper">
                    <Calendar :size="18" />
                    <input type="text" value=" 01/01/2026" readonly>
                </div>
                </div>

                <!-- Data Final -->
                <div class="filter-group">
                <label class="filter-label">Data final</label>
                <div class="filter-input-wrapper">
                    <Calendar :size="18" />
                    <input type="text" value=" 31/01/2026" readonly>
                </div>
                </div>
            </div>
            
            <div class="active-filters-banner">
                <strong>Filtros ativos:</strong> Todos os setores - 01/01/2026 até 31/01/2026
            </div>
            </section>

            <!-- CARDS DE RELATÓRIOS -->
            <section class="reports-grid">
            <!-- Ocorrências -->
            <div class="report-card">
                <div class="report-header">
                <div class="report-icon-container icon-orange">
                    <BarChart2 :size="28" :stroke-width="2.5" />
                </div>
                <h3 class="report-title">Relatório de<br>Ocorrências</h3>
                </div>
                <p class="report-desc">Detalhamento completo de todas as ocorrências registradas</p>
                <button class="btn-gerar">Gerar relatório</button>
            </div>

            <!-- Conformidade -->
            <div class="report-card">
                <div class="report-header">
                <div class="report-icon-container icon-green">
                    <ClipboardCheck :size="28" stroke-width="2.5" />
                </div>
                <h3 class="report-title">Relatório de<br>Conformidade</h3>
                </div>
                <p class="report-desc">Análise de conformidade e uso correto de EPIs</p>
                <button class="btn-gerar">Gerar relatório</button>
            </div>

            <!-- Infrações -->
            <div class="report-card">
                <div class="report-header">
                <div class="report-icon-container icon-red">
                    <Siren :size="28" :stroke-width="2.5" />
                </div>
                <h3 class="report-title">Relatório de<br>Infrações</h3>
                </div>
                <p class="report-desc">Lista de infrações e medidas tomadas</p>
                <button class="btn-gerar">Gerar relatório</button>
            </div>

            <!-- Por Funcionários -->
            <div class="report-card">
                <div class="report-header">
                <div class="report-icon-container icon-blue">
                    <Users :size="28" :stroke-width="2.5" />
                </div>
                <h3 class="report-title">Relatório por<br>Funcionários</h3>
                </div>
                <p class="report-desc">Histórico individual de cada funcionário</p>
                <button class="btn-gerar">Gerar relatório</button>
            </div>

            <!-- Máquinas -->
            <div class="report-card">
                <div class="report-header">
                <div class="report-icon-container icon-gray">
                    <Settings :size="28" :stroke-width="2.5" />
                </div>
                <h3 class="report-title">Relatório de<br>Máquinas</h3>
                </div>
                <p class="report-desc">Status e histórico de manutenção de equipamentos</p>
                <button class="btn-gerar">Gerar relatório</button>
            </div>

            <!-- Treinamentos -->
            <div class="report-card">
                <div class="report-header">
                <div class="report-icon-container icon-teal">
                    <BookOpen :size="28" :stroke-width="2.5" />
                </div>
                <h3 class="report-title">Relatório de<br>Treinamentos</h3>
                </div>
                <p class="report-desc">Registro de treinamentos realizados e pendentes</p>
                <button class="btn-gerar">Gerar relatório</button>
            </div>
            </section>

            <!-- RELATÓRIOS RECENTES -->
            <section class="section-card">
            <h2 class="section-title">Relatórios gerados recentemente</h2>
            <div class="recent-list">
                
                <!-- Item 1 -->
                <div class="recent-item">
                <div class="recent-info-wrapper">
                    <div class="recent-icon">
                    <FileText :size="20" />
                    </div>
                    <div class="recent-details">
                    <span class="recent-title">Relatorio_Ocorrencias_2026-06</span>
                    <span class="recent-meta">10/06/2026 14:30 - 2,4MB</span>
                    </div>
                </div>
                <button class="btn-download" title="Baixar relatório">
                    <Download :size="20" />
                </button>
                </div>

                <!-- Item 2 -->
                <div class="recent-item">
                <div class="recent-info-wrapper">
                    <div class="recent-icon">
                    <FileText :size="20" />
                    </div>
                    <div class="recent-details">
                    <span class="recent-title">Relatorio_Conformidade_2026-06</span>
                    <span class="recent-meta">08/06/2026 16:03 - 3,2MB</span>
                    </div>
                </div>
                <button class="btn-download" title="Baixar relatório">
                    <Download :size="20" />
                </button>
                </div>

                <!-- Item 3 -->
                <div class="recent-item">
                <div class="recent-info-wrapper">
                    <div class="recent-icon">
                    <FileText :size="20" />
                    </div>
                    <div class="recent-details">
                    <span class="recent-title">Relatorio_Maquinas_2026-06</span>
                    <span class="recent-meta">02/06/2026 11:57 - 3,5MB</span>
                    </div>
                </div>
                <button class="btn-download" title="Baixar relatório">
                    <Download :size="20" />
                </button>
                </div>

            </div>
            </section>
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
    margin-bottom: 32px;
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

/* --- SECTION CONTAINERS --- */
.section-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    /* box-shadow: 0 1px 3px rgba(0,0,0,0.04); */ /* Removido box-shadow para manter o flat do print */
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 20px;
}

/* --- FILTERS --- */
.filters-row {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 200px;
}

.filter-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-main);
}

.filter-input-wrapper {
    display: flex;
    align-items: center;
    background-color: var(--input-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0 16px;
    height: 48px;
    position: relative;
}

.filter-input-wrapper select,
.filter-input-wrapper input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: var(--text-main);
    font-family: 'Inter', sans-serif;
    cursor: pointer;
}

.filter-input-wrapper select {
    appearance: none;
    padding-right: 24px;
}

.filter-input-wrapper i {
    color: #94a3b8;
    margin-right: 8px;
}

.select-arrow {
    position: absolute;
    right: 16px;
    pointer-events: none;
    color: #94a3b8;
}

.active-filters-banner {
    background-color: var(--primary-light);
    color: var(--primary-text);
    padding: 16px 20px;
    border-radius: 8px;
    margin-top: 24px;
    font-size: 14px;
}

.active-filters-banner strong {
    font-weight: 700;
    margin-right: 4px;
}

/* --- REPORTS GRID --- */
.reports-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.report-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.report-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}

.report-icon-container {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* Custom Icon Colors to approximate the images */
.icon-orange { background-color: #fff7ed; color: #f97316; }
.icon-green { background-color: #f0fdf4; color: #22c55e; }
.icon-red { background-color: #fef2f2; color: #ef4444; }
.icon-blue { background-color: #eff6ff; color: #3b82f6; }
.icon-gray { background-color: #f8fafc; color: #64748b; }
.icon-teal { background-color: #f0fdfa; color: #14b8a6; }

.report-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-main);
    line-height: 1.3;
}

.report-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 24px;
    line-height: 1.5;
    flex: 1;
}

.btn-gerar {
    width: 100%;
    background-color: var(--primary);
    color: #ffffff;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
    box-shadow: 0 4px 6px -1px rgba(82, 67, 227, 0.2);
}

.btn-gerar:hover {
    background-color: var(--primary-hover);
}

.btn-gerar:active {
    transform: translateY(1px);
}

/* --- RECENT REPORTS --- */
.recent-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recent-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--bg-card);
    transition: border-color 0.2s;
}

.recent-item:hover {
    border-color: #cbd5e1;
}

.recent-info-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
}

.recent-icon {
    color: #0ea5e9;
    background-color: #e0f2fe;
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.recent-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.recent-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-main);
}

.recent-meta {
    font-size: 12px;
    color: var(--text-muted);
}

.btn-download {
    background: transparent;
    border: none;
    color: var(--primary);
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.btn-download:hover {
    background-color: var(--primary-light);
}

/* --- RESPONSIVE --- */
@media (max-width: 1024px) {
    .reports-grid {
    grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    body {
    flex-direction: column;
    }
    .sidebar {
    width: 100%;
    padding: 16px 0;
    }
    .main-content {
    padding: 20px;
    }
    .reports-grid {
    grid-template-columns: 1fr;
    }
    .filters-row {
    flex-direction: column;
    gap: 16px;
    }
}

@import '../assets/css/relatorios.css';
</style>
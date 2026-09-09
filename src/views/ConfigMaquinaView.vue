<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Settings, HardHat, Box, AlertTriangle, LogOut,  Clock, Cctv, SquareDashed } from 'lucide-vue-next';
import axios from 'axios';

const maquina = ref({
    nome: '',
    descricao: '',
    setor: ''
})

async function salvarMaquina() {
    try {
        const response = await axios.post(
            '/api/maquina',
            maquina.value
        )

        console.log(response.data)

        // limpa o formulário
        maquina.value = {
            nome: '',
            descricao: '',
            setor: ''
        }

    } catch (err) {
        console.error(err)
    }
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
                    <li class="nav-item active">
                        <a href="/config-maquina"><Box /> Config. Máquina</a>
                    </li>
                    <li class="nav-item">
                        <a href="/cadastro-camera"><Cctv /> Cadastro de Câmera</a>
                    </li>
                    <li class="nav-item">
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
        <main class="main-content">
            <header class="page-header">
            <h1 class="page-title">Configuração de Máquina</h1>
            <p class="page-subtitle">Configure equipamentos e EPIs obrigatórios</p>
            </header>

            <!-- FORM CARD -->
            <div class="card">
            <div class="card-header">
                <h2 class="card-title">Informações da Máquina</h2>
                <p class="card-subtitle">Configure os dados e requisitos de segurança</p>
            </div>

            <form>
                <div class="form-group">
                <label class="form-label">Nome da Máquina *</label>
                <input v-model="maquina.nome" type="text" class="form-control" placeholder="Ex: Prensa Hidráulica 01">
                </div>

                <div class="form-group">
                <label class="form-label">Descrição *</label>
                <textarea v-model="maquina.descricao" class="form-control" placeholder="Informações adicionais sobre a máquina e procedimentos de segurança"></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Área Monitorada *</label>
                    <select v-model="maquina.setor" class="form-control">
                        <option value="" >Selecione a área</option>
                        <option value="1">Setor A - Linha de Produção 1</option>
                        <option value="2">Setor B - Montagem</option>
                        <option value="3">Setor C - Sala de Controle</option>
                    </select>
                </div>

                <div class="form-actions">
                <button @click.prevent="salvarMaquina" type="button" class="btn btn-primary">Salvar Configuração</button>
                <button type="button" class="btn btn-secondary"><i data-lucide="x" size="16"></i> Cancelar</button>
                </div>
            </form>
            </div>

            <!-- RECENTLY CONFIGURED LIST CARD -->
            <div class="card">
            <div class="card-header" style="border-bottom: none; padding-bottom: 0;">
                <h2 class="card-title" style="font-size: 18px;">Máquinas Configuradas Recentemente</h2>
            </div>

            <div class="recent-list">
                <div class="recent-item">
                <div class="recent-title">Prensa Hidráulica 01</div>
                <div class="recent-sub">Setor A - Linha de Produção 1 • 5 EPIs obrigatórios</div>
                </div>

                <div class="recent-item">
                <div class="recent-title">Torno CNC 03</div>
                <div class="recent-sub">Setor B - Montagem • 4 EPIs obrigatórios</div>
                </div>

                <div class="recent-item">
                <div class="recent-title">Compressor Industrial 05</div>
                <div class="recent-sub">Setor C - Sala de Controle • 3 EPIs obrigatórios</div>
                </div>
            </div>
            </div>
        </main>
    </div>
</template>

<style scoped>

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

/* --- CARDS & FORM --- */
.card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 24px;
}

.card-header {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-main);
}

.card-subtitle {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 2px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 8px;
}

.form-control {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 14px;
    color: var(--text-main);
    outline: none;
    transition: border-color 0.2s;
}

.form-control::placeholder {
    color: #a0aec0;
}

.form-control:focus {
    border-color: var(--border-focus);
}

textarea.form-control {
    resize: vertical;
    min-height: 100px;
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

select.form-control {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%3a64748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 40px;
}

/* --- CHECKBOX GRID (EPIs) --- */
.section-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
    margin: 24px 0 12px 0;
}

.epi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 28px;
}

.epi-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
}

.epi-card:hover {
    background-color: #f8fafc;
}

.epi-card input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
    cursor: pointer;
}

.epi-info strong {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
}

.epi-info span {
    font-size: 12px;
    color: var(--text-muted);
}

/* --- BUTTONS --- */
.form-actions {
    display: flex;
    gap: 16px;
}

.btn {
    flex: 1;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
}

.btn-primary {
    background-color: var(--primary);
    color: #ffffff;
    border: none;
}

.btn-primary:hover {
    background-color: var(--primary-hover);
}

.btn-secondary {
    background-color: #ffffff;
    color: var(--text-main);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: #f8fafc;
}

/* --- LISTA RECENTE --- */
.recent-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recent-item {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 14px 16px;
}

.recent-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
}

.recent-sub {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
}

/* Responsividade simples */
@media (max-width: 768px) {
    body {
    flex-direction: column;
    }
    .sidebar {
    width: 100%;
    }
    .grid-2, .epi-grid {
    grid-template-columns: 1fr;
    }
}

@import '../assets/css/configMaquina.css';
</style>
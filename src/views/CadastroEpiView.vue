<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, HardHat, Box, AlertTriangle, LogOut } from 'lucide-vue-next';
import axios from 'axios';

const epi = ref({
    nome: '',
    descricao: '',
})

async function salvarEpi() {
    try {
        const response = await axios.post(
            '/api/epi',
            epi.value
        )

        console.log(response.data)

        // limpa o formulário
        epi.value = {
            nome: '',
            descricao: '',
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
                    <li class="nav-item active">
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
            <h1 class="page-title">Cadastro de EPI</h1>
            <p class="page-subtitle">Registre novos equipamentos de proteção individual</p>
            </header>

            <!-- FORM CARD -->
            <div class="card">
            <div class="card-header">
                <h2 class="card-title">Informações do EPI</h2>
                <p class="card-subtitle">Preencha os dados do equipamento de proteção</p>
            </div>

            <form>
                <div class="form-group">
                <label class="form-label">Nome do EPI *</label>
                <input v-model="epi.nome" type="text" class="form-control" placeholder="Ex: Capacete de Segurança">
                </div>

                <div class="form-group">
                <label class="form-label">Descrição *</label>
                <textarea v-model="epi.descricao" class="form-control" placeholder="Descreva as características e aplicações do EPI"></textarea>
                </div>

                <div class="form-actions">
                <button @click.prevent="salvarEpi" type="button" class="btn btn-cyan">Salvar EPI</button>
                <button type="button" class="btn btn-secondary"><i data-lucide="x" size="16"></i> Cancelar</button>
                </div>
            </form>
            </div>

            <!-- RECENTLY REGISTERED LIST CARD -->
            <div class="card">
            <div class="card-header" style="border-bottom: none; padding-bottom: 0;">
                <h2 class="card-title" style="font-size: 18px;">EPIs Cadastrados Recentemente</h2>
            </div>

            <div class="recent-list">
                <div class="recent-item">
                <div>
                    <div class="recent-title">Capacete de Segurança</div>
                    <div class="recent-sub">Proteção Craniana</div>
                </div>
                <div class="recent-date">10/06/2026</div>
                </div>

                <div class="recent-item">
                <div>
                    <div class="recent-title">Luvas de Proteção Química</div>
                    <div class="recent-sub">Proteção das Mãos</div>
                </div>
                <div class="recent-date">09/06/2026</div>
                </div>

                <div class="recent-item">
                <div>
                    <div class="recent-title">Óculos de Proteção</div>
                    <div class="recent-sub">Proteção Visual</div>
                </div>
                <div class="recent-date">08/06/2026</div>
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

/* --- CARDS & FORM --- */
.card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
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

select.form-control {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%3a64748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 40px;
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

/* --- BUTTONS --- */
.form-actions {
    display: flex;
    gap: 16px;
    margin-top: 28px;
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

.btn-cyan {
    background-color: var(--cyan-btn);
    color: #ffffff;
    border: none;
}

.btn-cyan:hover {
    background-color: var(--cyan-btn-hover);
}

.btn-secondary {
    background-color: #ffffff;
    color: var(--text-main);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: #f8fafc;
}

/* --- RECENTLY ADDED LIST --- */
.recent-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recent-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px 20px;
    background-color: #ffffff;
}

.recent-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
}

.recent-sub {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
}

.recent-date {
    font-size: 13px;
    color: var(--text-muted);
}

/* Responsividade */
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
    .grid-2 {
    grid-template-columns: 1fr;
    }
}

@import '../assets/css/alertas.css';
</style>
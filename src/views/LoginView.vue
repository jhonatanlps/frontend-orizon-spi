<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
const router = useRouter()

function handleLogin() {
  // Lógica que estava no seu script.js
  if (email.value === "supervisor@gmail.com") {
    router.push('/supervisor') // Redireciona para o painel
  } else {
    router.push('/tecnico')
  }
}
</script>

<template>
    <div class="layout-login-container">
        <main class="login-container">

            <section class="login-card">
                <img 
                    src="../assets/logo_orizon_preta.png" 
                    alt="Logo ORIZON"
                    class="logo"
                />

                <form id="loginForm" @submit.prevent="handleLogin">

                    <div class="input-group">
                        <label for="email">E-mail</label>
                        <div class="input-container">
                            <span class="input-icon">✉</span>
                            <input
                                v-model="email"
                                type="email"
                                id="email"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="senha">Senha</label>
                        <div class="input-container">
                            <span class="input-icon">🔒</span>
                            <input
                                v-model="senha"
                                type="password"
                                id="senha"
                                placeholder="********"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" class="login-button">
                        Entrar
                    </button>
                </form>
            </section>
        </main>
    </div>
</template>

<style scoped>

.layout-login-container {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #11192e;
}


.login-container {
    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;
}


/* =========================
   CARD DE LOGIN
========================= */

.login-card {
    width: 600px;
    min-height: 580px;

    background-color: #f5f6f8;

    border-radius: 9px;

    padding: 70px 110px;

    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
}


/* =========================
   LOGO
========================= */

.logo {
    display: block;

    width: 400px;
    height: auto;

    margin: 20px auto 55px;
}


/* =========================
   GRUPO DOS INPUTS
========================= */

.input-group {
    margin-bottom: 32px;
}

.input-group label {
    display: block;

    margin-bottom: 7px;

    font-size: 14px;

    color: #222;
}


/* =========================
   INPUT
========================= */

.input-container {
    position: relative;

    width: 100%;
}

.input-container input {
    width: 100%;
    height: 44px;

    padding: 0 15px 0 38px;

    border: 1px solid #d4d4d4;

    border-radius: 7px;

    background-color: #f1f1f1;

    font-size: 14px;

    outline: none;
}


/* Efeito ao clicar no campo */

.input-container input:focus {
    border-color: #5644f2;

    box-shadow: 0 0 0 2px rgba(86, 68, 242, 0.15);
}


/* =========================
   ÍCONES
========================= */

.input-icon {
    position: absolute;

    left: 14px;
    top: 50%;

    transform: translateY(-50%);

    color: #999;

    font-size: 15px;

    z-index: 1;
}


/* =========================
   BOTÃO
========================= */

.login-button {
    width: 100%;
    height: 47px;

    border: none;

    border-radius: 7px;

    background-color: #5544e8;

    color: white;

    font-size: 16px;
    font-weight: bold;

    cursor: pointer;

    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.3);

    transition: 0.2s;
}


/* Quando passar o mouse */

.login-button:hover {
    background-color: #4837d8;
}


/* Quando clicar */

.login-button:active {
    transform: translateY(1px);
}


/* =========================
   RESPONSIVIDADE
========================= */

@media (max-width: 700px) {

    .login-card {
        width: 100%;

        padding: 50px 40px;
    }

    .logo {
        width: 190px;
    }
}

@import '../assets/css/login.css';
</style>
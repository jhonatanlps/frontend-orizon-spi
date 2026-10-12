# 💻 Frontend Orizon SPI

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-blue?style=for-the-badge" alt="Status do Projeto">
  <img src="https://img.shields.io/badge/vue-%3E%3D3.x-brightgreen?style=for-the-badge" alt="Vue.js">
  <img src="https://img.shields.io/badge/typescript-blue?style=for-the-badge" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
</p>

## 📖 Sobre o Projeto

O **Frontend Orizon SPI** é a interface de usuário do sistema de supervisão de câmeras Orizon. Desenvolvido para proporcionar uma experiência fluida e em tempo real, o painel permite o monitoramento de streams de vídeo (processados via RTSP para HLS), gerenciamento de dispositivos e visualização de métricas do sistema.

Esta aplicação foi construída com foco em performance, modularidade e usabilidade para operadores de centrais de monitoramento.

---

## 🛠️ Tecnologias e Stack

As principais tecnologias utilizadas no desenvolvimento deste front-end:

- **Framework:** [Vue.js 3](https://vuejs.org/) (Composition API)
- **Linguagem:** TypeScript
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Player de Vídeo:** [Video.js](https://videojs.com/) (Suporte a streams HLS)
- **Estilização:** Tailwind CSS / CSS Modules
- **Gerenciamento de Estado / Rotas:** Vue Router / Pinia *(ajuste se necessário)*
- **Comunicação HTTP:** Axios

---

## 📂 Arquitetura do Projeto

A estrutura de diretórios foi organizada seguindo boas práticas de componentização e separação de responsabilidades:

```text
src/
├── assets/          # Arquivos estáticos (imagens, ícones, estilos globais)
├── components/      # Componentes reutilizáveis (botões, cards, modais)
├── composables/     # Hooks reutilizáveis de lógica de negócios
├── router/          # Configuração de rotas da aplicação
├── services/        # Configuração de requisições HTTP (Axios/API client)
├── views/           # Telas principais (Dashboard, Câmeras, Configurações)
├── App.vue          # Componente raiz
└── main.ts          # Ponto de entrada da aplicação

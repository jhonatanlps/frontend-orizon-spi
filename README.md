# Orizon SPI — Frontend

Aplicação web do **Orizon SPI**, um sistema de monitoramento e gestão de segurança industrial que auxilia no acompanhamento de máquinas, equipamentos de proteção individual (EPIs), zonas de risco, ocorrências e alertas.

O frontend é responsável pela interface de interação com o usuário, pela visualização de informações operacionais e pela atualização de dados recebidos do backend.

## Tecnologias utilizadas

- **Vue.js 3** — construção da interface.
- **Vite** — servidor de desenvolvimento e ferramenta de build.
- **Axios** — comunicação HTTP com a API REST.
- **Lucide Vue Next** — biblioteca de ícones.
- **WebSocket com STOMP** — comunicação em tempo real com o backend.
- **JavaScript** — implementação da lógica da aplicação.

## Funcionalidades

- **Dashboard:** visualização de indicadores e informações sobre a operação.
- **Máquinas:** consulta e acompanhamento das máquinas cadastradas.
- **EPIs:** visualização e gerenciamento de equipamentos de proteção individual.
- **Zonas de risco:** acompanhamento das áreas monitoradas e de suas configurações.
- **Ocorrências:** acompanhamento de eventos relacionados à segurança industrial.
- **Alertas:** visualização de notificações, incluindo alertas críticos.
- **Atualizações em tempo real:** recebimento de informações do backend por WebSocket, permitindo atualizar indicadores e informações sem depender exclusivamente de novas requisições HTTP.

A disponibilidade de cada funcionalidade depende de sua implementação e da integração com o backend.

## Pré-requisitos

Antes de executar o projeto, instale:

- [Node.js](https://nodejs.org/)
- npm, instalado junto com o Node.js.
- Git.
- Backend do Orizon SPI configurado e em execução para testar a integração completa.

## Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/jhonatanlps/frontend-orizon-spi.git

cd frontend-orizon-spi
```

Instale as dependências:

```bash
npm install
```

## Executando o projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente:

```text
http://localhost:5173
```

Acesse o endereço indicado no terminal pelo navegador.

## Build para produção

Para gerar a versão otimizada da aplicação:

```bash
npm run build
```

Os arquivos gerados ficam, por padrão, na pasta `dist/`.

Para visualizar localmente a versão de produção:

```bash
npm run preview
```

## Integração com o backend

O frontend se comunica com o backend do Orizon SPI, desenvolvido com **Java e Spring Boot**, utilizando dois mecanismos principais.

### API REST com Axios

As requisições HTTP são utilizadas para consultar e enviar informações à API.

O projeto utiliza o endereço `/api` como caminho de acesso à API por meio do proxy de desenvolvimento do Vite, configurado para encaminhar as requisições ao backend local.

Exemplo de chamada:

```javascript
import axios from 'axios';

const response = await axios.get('/api/alerta');
console.log(response.data);
```

A rota acima é um exemplo de consulta. Os endpoints disponíveis devem ser conferidos nos controllers do backend.

### WebSocket com STOMP

A comunicação em tempo real utiliza a biblioteca `@stomp/stompjs` e uma conexão WebSocket com o backend.

Configuração de desenvolvimento utilizada:

```text
ws://localhost:8080/ws
```

Entre os destinos de mensagens utilizados pela aplicação estão:

| Destino STOMP | Finalidade |
|---|---|
| `/topic/alerta` | Recebimento de alertas |
| `/topic/maquina` | Atualizações relacionadas às máquinas |
| `/topic/epi` | Atualizações relacionadas aos EPIs |
| `/topic/zona` | Atualizações relacionadas às zonas |
| `/topic/alerta` — dados agregados, conforme o contrato do backend | Indicadores e informações de alertas |

Os destinos efetivamente publicados e os formatos das mensagens devem corresponder às configurações do backend. Para indicadores agregados, verifique o tópico específico implementado no servidor.

## Configuração do ambiente

Em ambiente local, confira se o backend está em execução e se a configuração do proxy no arquivo `vite.config.js` ou `vite.config.ts` aponta para o endereço correto.

Configuração de referência:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false
    }
  }
}
```

Esse trecho é apenas uma referência: mantenha a configuração existente no projeto e ajuste-a somente se necessário.

Se o backend estiver em outra máquina, substitua o endereço de destino pelo endereço acessível a partir do ambiente em que o frontend está sendo executado. Para acesso a partir de outro dispositivo, o endereço `localhost` não aponta automaticamente para o computador que hospeda o backend.

## Como testar a integração

1. Inicie o backend Spring Boot.
2. Execute `npm install` e `npm run dev` no frontend.
3. Abra a aplicação no navegador.
4. Verifique se as consultas à API retornam dados corretamente.
5. Confira no console do navegador se a conexão WebSocket foi estabelecida.
6. Gere ou registre uma ocorrência de teste no backend.
7. Verifique se os alertas, indicadores e componentes inscritos nos tópicos correspondentes recebem as atualizações.

### Quando o backend estiver indisponível

Se o backend estiver desligado ou inacessível, as requisições HTTP poderão apresentar erros de conexão e as atualizações em tempo real não serão recebidas.

O frontend poderá continuar exibindo a interface, mas os dados que dependem do servidor podem não carregar ou permanecer desatualizados. O comportamento exato depende do tratamento de erros implementado em cada tela e serviço.

## Estrutura do projeto

A organização abaixo representa os principais elementos esperados da aplicação Vue. Consulte as pastas existentes no repositório para verificar os nomes e caminhos exatos.

```text
frontend-orizon-spi/
├── public/             # Arquivos públicos
├── src/
│   ├── assets/         # Imagens e recursos visuais
│   ├── components/     # Componentes reutilizáveis
│   ├── services/       # Comunicação com API e WebSocket
│   ├── views/          # Telas da aplicação
│   ├── App.vue         # Componente principal
│   └── main.js         # Inicialização da aplicação
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

A extensão dos arquivos de configuração pode variar conforme a configuração do projeto.

## Solução de problemas

**A API não retorna dados**
- Verifique se o backend está em execução na porta configurada.
- Confira a URL e o caminho da requisição.
- Consulte o console do navegador e o terminal do backend.

**O WebSocket não conecta**
- Confirme se o endpoint `/ws` está configurado no backend.
- Verifique se o servidor está acessível e se os destinos STOMP correspondem aos tópicos publicados.
- Consulte os erros no console do navegador.

**Os dados não atualizam em tempo real**
- Confira se o frontend está inscrito no tópico correto.
- Verifique se o backend publica mensagens após as alterações.
- Confirme se os callbacks de recebimento atualizam o estado utilizado pelos componentes Vue.

**Erro ao instalar dependências**
- Confira a versão do Node.js com `node -v`.
- Confira a versão do npm com `npm -v`.
- Tente executar `npm install` novamente e examine a mensagem de erro.

## Repositórios relacionados

- **Frontend:** https://github.com/jhonatanlps/frontend-orizon-spi
- **Backend:** https://github.com/jhonatanlps/backend-orizon-spi

## Objetivo do projeto

O Orizon SPI busca apoiar o monitoramento da segurança industrial por meio de uma interface centralizada para acompanhar máquinas, EPIs, zonas de risco, ocorrências e alertas, integrando dados do backend e recursos de comunicação em tempo real.

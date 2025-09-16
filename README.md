### Sorteio Websocket JS

Uma aplicação simples de sorteio em tempo real utilizando WebSockets, inspirada na aplicação de mesmo objetivo, feita pelo canal Código Fonte TV. Esse repositório foi feito para servir de consulta em projetos futuros, que irão utilizar Web Socket.
([Repositório Código Fonte TV](https://github.com/gabrielfroes/sorteio-websocket/))

---

### Tecnologias

Este projeto utiliza as seguintes tecnologias:

* **Backend:** Node.js, Express, WebSockets (`ws`), e dotenv para gerenciamento de variáveis de ambiente.
* **Frontend:** HTML, CSS e JavaScript.

### Como Usar

Siga os passos abaixo para configurar e executar a aplicação:

1.  **Clonar o repositório e instalar as dependências:**
    ```bash
    git clone [https://github.com/ricardo-cs/sorteio-websocket-js.git](https://github.com/ricardo-cs/sorteio-websocket-js.git)
    cd sorteio-websocket-js
    npm install
    ```
2.  **Configurar o ambiente:**
    Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`. Defina as seguintes variáveis:
    ```
    APP_PORT=3000
    ADMIN_TOKEN=seu_token_de_admin_aqui
    ```
3.  **Executar o servidor:**
    Utilize o seguinte comando para iniciar o servidor:
    ```bash
    npm run dev
    ```
    O servidor será iniciado na porta `3000` (ou na porta definida em `APP_PORT`).

### Acessando a Aplicação

* **Interface do Usuário:** Acesse `http://localhost:3000` no seu navegador. Cada usuário conectado receberá um número aleatório.
* **Interface do Administrador:** Acesse `http://localhost:3000/admin`. Você precisará inserir o `ADMIN_TOKEN` definido no arquivo `.env` para acessar o painel de controle e iniciar o sorteio.

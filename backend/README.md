# Backend do Sistema de Gerenciamento Financeiro (Matrix Theme)

Este é o componente de backend da aplicação de gerenciamento financeiro, desenvolvida com Node.js e Express, utilizando SQLite para persistência de dados. Ele gerencia as transações financeiras e a lógica de gamificação.

---

## 💻 Tecnologias Utilizadas

* **Node.js**: Ambiente de execução JavaScript.
* **Express**: Framework web para Node.js, utilizado para construir a API RESTful.
* **SQLite3**: Banco de dados relacional leve, integrado diretamente no projeto para persistência de dados em um arquivo (`database.sqlite`).
* **CORS**: Pacote para habilitar o Cross-Origin Resource Sharing, permitindo que o frontend (em uma porta diferente) se comunique com o backend.
* **Nodemon** (Opcional, para desenvolvimento): Ferramenta que monitora alterações nos arquivos e reinicia automaticamente o servidor.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e iniciar o servidor backend:

1.  **Navegue até a pasta do backend:**
    ```bash
    cd matrix-finance/backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    (Este comando instalará `express`, `cors` e `sqlite3` conforme configurado no `package.json`.)

3.  **Inicie o servidor:**
    * **Para desenvolvimento (recomendado):** Se você instalou o `nodemon` (`npm install nodemon`):
        ```bash
        nodemon server.js
        ```
    * **Para produção ou execução simples:**
        ```bash
        node server.js
        ```

O servidor será iniciado na porta `3001` (ou na porta configurada nas variáveis de ambiente). Você verá uma mensagem no console indicando que o servidor está rodando e onde o arquivo do banco de dados SQLite foi criado.

---

## 📂 Estrutura do Projeto

backend/
├── node_modules/
├── database.sqlite  # Arquivo do banco de dados SQLite (será criado após a primeira execução)
├── package.json
├── package-lock.json
└── server.js        # Arquivo principal do servidor

---

## ⚙️ Endpoints da API

O backend oferece os seguintes endpoints:

* **`GET /transactions`**: Retorna todas as transações financeiras armazenadas.
* **`POST /transactions`**: Adiciona uma nova transação.
    * **Corpo da Requisição (JSON):**
        ```json
        {
            "description": "Descrição da transação",
            "amount": 100.50,
            "type": "income" | "expense",
            "category": "Categoria da transação"
        }
        ```
    * **Resposta:** Retorna a transação criada e as estatísticas atualizadas do usuário.
* **`GET /user-stats`**: Retorna as estatísticas de gamificação do usuário (nível, experiência, saldo).

---

## 🔑 Lógica de Gamificação

O sistema de gamificação atualiza o nível e a experiência do usuário com base nas transações. Atualmente:

* O **saldo total** do usuário é atualizado a cada transação.
* Ao adicionar uma **receita** que resulta em um saldo total positivo, o usuário ganha **XP**.
* O nível do usuário aumenta quando o XP acumulado atinge um determinado limite.

---
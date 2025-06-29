# Frontend do Sistema de Gerenciamento Financeiro (Matrix Theme)

Este é o componente de frontend da aplicação de gerenciamento financeiro, desenvolvida com React e Vite, com estilização inspirada no tema Matrix utilizando Styled Components. Ele interage com o backend para exibir e gerenciar dados financeiros e informações de gamificação.

---

## 💻 Tecnologias Utilizadas

* **React**: Biblioteca JavaScript para construir interfaces de usuário.
* **Vite**: Ferramenta de build rápida para desenvolvimento frontend.
* **Styled Components**: Biblioteca para estilização de componentes React utilizando CSS-in-JS, com tema de cores Matrix.
* **Axios**: Cliente HTTP baseado em Promises para fazer requisições ao backend.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e iniciar a aplicação frontend:

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd matrix-finance/frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    (Este comando instalará `react`, `styled-components`, `axios` e outras dependências do projeto.)

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação será iniciada e geralmente estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite). Certifique-se de que o **backend** esteja rodando (`nodemon server.js` na pasta `backend`) para que a aplicação funcione corretamente.

---

## 📂 Estrutura do Projeto

frontend/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── styles/
│   │   └── GlobalStyles.js  # Estilos globais e cores do tema Matrix
│   ├── App.jsx              # Componente principal da aplicação
│   ├── main.jsx             # Ponto de entrada do React
│   └── index.css (pode estar vazio ou excluído, pois usamos styled-components)
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

---

## ✨ Funcionalidades

* **Dashboard Temático**: Interface inspirada no tema Matrix (cores verdes e pretas).
* **Adicionar Transações**: Formulário para registrar despesas e receitas com descrição, valor, tipo e categoria.
* **Extrato de Transações**: Lista de todas as transações, com destaque para receitas (verde) e despesas (vermelho).
* **Filtro de Transações**: Opções para filtrar transações por tipo (todas, receitas, despesas).
* **Ordenação de Transações**: Opções para ordenar transações por valor ou descrição (crescente/decrescente).
* **Resumo Financeiro**: Exibição do total de despesas e do saldo financeiro atual.
* **Gamificação (Nível & XP)**: Visualização do nível e experiência (XP) do usuário, que se atualizam com base no progresso financeiro (ex: ao adicionar receitas que contribuem para um saldo positivo).

---
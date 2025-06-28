// backend/server.js

// 1. Importar módulos necessários
const express = require('express');
const cors = require('cors');

// 2. Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3001; // Porta onde o servidor vai rodar

// 3. Configurar Middlewares
// Middleware para parsear JSON no corpo das requisições (req.body)
app.use(express.json());
// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
// Isso permite que nosso frontend, rodando em outra porta, se comunique com o backend
app.use(cors());

// 4. Banco de Dados Fictício em Memória
// Uma array para armazenar nossas transações.
// Cada transação terá um ID único, descrição, valor, tipo (receita/despesa) e categoria.
let transactions = [
    { id: '1', description: 'Salário', amount: 3000, type: 'income', category: 'Trabalho' },
    { id: '2', description: 'Aluguel', amount: -1200, type: 'expense', category: 'Moradia' },
    { id: '3', description: 'Supermercado', amount: -350, type: 'expense', category: 'Alimentação' },
];

// NOVO: Estado de gamificação do usuário
let userStats = {
    level: 1,
    experience: 0,
    balance: transactions.reduce((acc, t) => acc + t.amount, 0), // Saldo inicial
};

// NOVO: Definição de XP por nível
const XP_PER_LEVEL = 1000; // XP necessário para cada novo nível
const XP_GAIN_PER_POSITIVE_TRANSACTION = 500; // XP ganho ao adicionar transação com saldo positivo

// 5. Variável para gerar IDs únicos (simples para este exemplo)
let nextId = 4;

// 6. Rotas da API

// Rota 1: Listar todas as transações
app.get('/transactions', (req, res) => {
    console.log('GET /transactions - Retornando todas as transações');
    return res.status(200).json(transactions);
});

// Rota 3: Obter estatísticas do usuário (nível, XP, saldo)
app.get('/user-stats', (req, res) => {
    console.log('GET /user-stats - Retornando estatísticas do usuário');
    return res.status(200).json(userStats);
});

app.post('/transactions', (req, res) => {
    const { description, amount, type, category } = req.body;

    if (!description || !amount || !type || !category) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
        return res.status(400).json({ message: 'O valor deve ser um número válido.' });
    }

    const finalAmount = type === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);

    const newTransaction = {
        id: (nextId++).toString(),
        description,
        amount: finalAmount,
        type,
        category
    };

    transactions.push(newTransaction);

    // NOVO: Lógica de atualização do saldo e gamificação
    userStats.balance += finalAmount; // Atualiza o saldo geral

    // Verifica se o saldo está positivo (simulando "sobra" após uma transação)
    // Você pode ajustar essa lógica para ser mais sofisticada (e.g., saldo do mês)
    if (userStats.balance > 0 && newTransaction.type === 'income') { // OU se a transação *final* resultar em saldo positivo
         // Ganhamos XP se a transação for uma receita e o saldo final for positivo
         // Ou poderíamos ter uma lógica de "saldo mensal positivo"
        userStats.experience += XP_GAIN_PER_POSITIVE_TRANSACTION;
        console.log(`XP ganho! XP atual: ${userStats.experience}`);

        // Verifica se subiu de nível
        while (userStats.experience >= XP_PER_LEVEL * userStats.level) { // XP necessário para o próximo nível
            userStats.level++;
            console.log(`Parabéns! Você subiu para o Nível ${userStats.level}!`);
            // Poderíamos resetar XP para o próximo nível ou mantê-lo acumulado
            // Por simplicidade, vamos acumulá-lo aqui e apenas verificar se atingiu o limiar
        }
    } else if (userStats.balance < 0 && newTransaction.type === 'expense') {
        // Opcional: Perder XP ou ter uma penalidade por saldo negativo persistente
        console.log('Cuidado! Seu saldo está negativo.');
    }


    console.log('POST /transactions - Nova transação adicionada:', newTransaction);
    console.log('Status do Usuário Atualizado:', userStats);
    // Retorna a transação recém-criada junto com as estatísticas atualizadas do usuário
    return res.status(201).json({
        transaction: newTransaction,
        userStats: userStats, // Retorna as stats atualizadas
    });
});

// 7. Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
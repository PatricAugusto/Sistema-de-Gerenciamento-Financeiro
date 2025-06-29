// backend/server.js

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // Importa o sqlite3

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// --- CONFIGURAÇÃO DO BANCO DE DADOS SQLITE ---
const DB_FILE = './database.sqlite'; // Nome do arquivo do banco de dados
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Cria a tabela de transações se ela não existir
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            description TEXT,
            amount REAL,
            type TEXT,
            category TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        // Cria a tabela de user_stats se ela não existir
        db.run(`CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY DEFAULT 1,
            level INTEGER,
            experience INTEGER,
            balance REAL
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela user_stats:', err.message);
            } else {
                // Insere as estatísticas iniciais se a tabela estiver vazia
                db.get('SELECT id FROM user_stats WHERE id = 1', (err, row) => {
                    if (err) {
                        console.error('Erro ao verificar user_stats:', err.message);
                        return;
                    }
                    if (!row) { // Se não houver registro, insere o inicial
                        db.run(`INSERT INTO user_stats (level, experience, balance) VALUES (?, ?, ?)`,
                            [1, 0, 0], // Nível 1, 0 XP, 0 Saldo inicial
                            function(err) {
                                if (err) {
                                    console.error('Erro ao inserir user_stats iniciais:', err.message);
                                } else {
                                    console.log('Estatísticas do usuário iniciais criadas.');
                                }
                            }
                        );
                    } else {
                        console.log('Estatísticas do usuário já existem.');
                    }
                });
            }
        });
    }
});

// --- Lógica de Gamificação (constantes permanecem) ---
const XP_PER_LEVEL = 1000;
const XP_GAIN_PER_POSITIVE_TRANSACTION = 500;

// --- ROTAS DA API ---

// Rota para obter todas as transações
app.get('/transactions', (req, res) => {
    db.all("SELECT * FROM transactions ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar transações:', err.message);
            return res.status(500).json({ message: 'Erro ao buscar transações.' });
        }
        console.log('GET /transactions - Retornando transações');
        return res.status(200).json(rows);
    });
});

// Rota para obter estatísticas do usuário
app.get('/user-stats', (req, res) => {
    db.get("SELECT * FROM user_stats WHERE id = 1", [], (err, row) => {
        if (err) {
            console.error('Erro ao buscar user stats:', err.message);
            return res.status(500).json({ message: 'Erro ao buscar estatísticas do usuário.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Estatísticas do usuário não encontradas.' });
        }
        console.log('GET /user-stats - Retornando estatísticas do usuário');
        return res.status(200).json(row);
    });
});

// Rota para adicionar uma nova transação
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
    const id = Date.now().toString(); // ID único baseado no timestamp

    // Inicia uma transação no banco de dados para garantir atomicidade
    db.serialize(() => {
        db.run("BEGIN TRANSACTION;");

        // Insere a nova transação
        db.run(`INSERT INTO transactions (id, description, amount, type, category) VALUES (?, ?, ?, ?, ?)`,
            [id, description, finalAmount, type, category],
            function(err) {
                if (err) {
                    db.run("ROLLBACK;");
                    console.error('Erro ao inserir transação:', err.message);
                    return res.status(500).json({ message: 'Erro ao adicionar transação.' });
                }

                // Recupera as estatísticas do usuário para atualização
                db.get("SELECT * FROM user_stats WHERE id = 1", (err, userStats) => {
                    if (err) {
                        db.run("ROLLBACK;");
                        console.error('Erro ao buscar user_stats para atualização:', err.message);
                        return res.status(500).json({ message: 'Erro ao buscar estatísticas do usuário.' });
                    }

                    if (!userStats) { // Se não existir, cria um default (caso inicial falhe)
                         userStats = { id: 1, level: 1, experience: 0, balance: 0 };
                         db.run(`INSERT INTO user_stats (level, experience, balance) VALUES (?, ?, ?)`,
                            [userStats.level, userStats.experience, userStats.balance],
                            function(err) { if (err) console.error('Failed to insert default user_stats on the fly', err.message); }
                         );
                    }

                    // Lógica de atualização do saldo e gamificação
                    userStats.balance += finalAmount;

                    if (userStats.balance > 0 && type === 'income') {
                        userStats.experience += XP_GAIN_PER_POSITIVE_TRANSACTION;
                        while (userStats.experience >= XP_PER_LEVEL * userStats.level) {
                            userStats.level++;
                            console.log(`Parabéns! Você subiu para o Nível ${userStats.level}!`);
                        }
                    }

                    // Atualiza as estatísticas do usuário no banco de dados
                    db.run(`UPDATE user_stats SET level = ?, experience = ?, balance = ? WHERE id = 1`,
                        [userStats.level, userStats.experience, userStats.balance],
                        function(err) {
                            if (err) {
                                db.run("ROLLBACK;");
                                console.error('Erro ao atualizar user_stats:', err.message);
                                return res.status(500).json({ message: 'Erro ao atualizar estatísticas do usuário.' });
                            }

                            db.run("COMMIT;", (err) => {
                                if (err) {
                                    console.error('Erro ao commitar transação:', err.message);
                                    return res.status(500).json({ message: 'Erro ao finalizar transação.' });
                                }
                                console.log('POST /transactions - Nova transação adicionada e user stats atualizados.');
                                return res.status(201).json({
                                    transaction: { id, description, amount: finalAmount, type, category, timestamp: new Date().toISOString() },
                                    userStats: userStats,
                                });
                            });
                        }
                    );
                });
            }
        );
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Dados persistidos em: ${DB_FILE}`);
});
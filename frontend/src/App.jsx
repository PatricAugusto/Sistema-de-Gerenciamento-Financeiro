// src/App.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { colors } from './styles/GlobalStyles'; // Importa as cores do tema

// Componente estilizado para o Container principal
const AppContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: ${colors.darkGrey};
  border: 1px solid ${colors.matrixGreen};
  border-radius: 8px;
  box-shadow: 0 0 15px ${colors.darkGreen}; /* Um brilho sutil */
`;

// Componente estilizado para o Título
const Title = styled.h1`
  color: ${colors.matrixGreen};
  text-align: center;
  margin-bottom: 25px;
  text-shadow: 0 0 8px ${colors.darkGreen}; /* Efeito neon */
`;

const UserStatsContainer = styled.div`
  background-color: ${colors.black};
  border: 1px solid ${colors.darkGreen};
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: ${colors.matrixGreen};
  font-size: 1.1em;
  text-shadow: 0 0 5px ${colors.darkGreen};
`;

const StatItem = styled.div`
  text-align: center;
  span {
    display: block;
    font-weight: bold;
    font-size: 1.2em;
    color: ${colors.white};
  }
  small {
    color: ${colors.lightGrey};
    font-size: 0.8em;
  }`;

  const SummaryContainer = styled.div`
  background-color: ${colors.black};
  border: 1px solid ${colors.darkGreen};
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${colors.matrixGreen};
  font-size: 1.1em;
  text-shadow: 0 0 5px ${colors.darkGreen};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  border-bottom: 1px dotted ${colors.darkGreen};

  &:last-child {
    border-bottom: none;
    font-weight: bold;
    padding-top: 10px;
    color: ${colors.white};
  }
`;

const SummaryLabel = styled.span`
  color: ${colors.lightGrey};
  font-size: 0.9em;
`;

const SummaryValue = styled.span`
  font-weight: bold;
  color: ${props => props.type === 'expense' ? '#FF6347' : colors.matrixGreen};
`;

// Componente estilizado para Formulários e Listas
const Section = styled.section`
  margin-bottom: 30px;
  padding: 20px;
  background-color: ${colors.black};
  border: 1px solid ${colors.darkGreen};
  border-radius: 6px;
`;

const SectionTitle = styled.h2`
  color: ${colors.matrixGreen};
  margin-bottom: 15px;
  border-bottom: 1px dashed ${colors.darkGreen};
  padding-bottom: 5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  color: ${colors.lightGrey};
  margin-bottom: 5px;
  display: block;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dotted ${colors.darkGreen};

  &:last-child {
    border-bottom: none;
  }

  color: ${props => (props.type === 'expense' ? '#FF6347' : colors.matrixGreen)}; /* Vermelho para despesa, verde para receita */
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TransactionDescription = styled.span`
  font-weight: bold;
`;

const TransactionCategory = styled.span`
  font-size: 0.8em;
  color: ${colors.lightGrey};
`;

const TransactionAmount = styled.span`
  font-weight: bold;
  font-size: 1.1em;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${colors.black};
  border: 1px solid ${colors.darkGreen};
  border-radius: 6px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// Componente principal da aplicação
function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NOVO: Estado para as estatísticas do usuário (gamificação)
  const [userStats, setUserStats] = useState({ level: 1, experience: 0, balance: 0 });

  // NOVO: Estados para filtro e ordenação
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [sortBy, setSortBy] = useState('none'); // 'none', 'amount_asc', 'amount_desc', 'description_asc', 'description_desc'

  // URL base do nosso backend
  const API_URL = 'http://localhost:3001';

// Função para buscar as transações E estatísticas do usuário do backend
const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
        const transactionsResponse = await axios.get(`${API_URL}/transactions`);
        setTransactions(transactionsResponse.data);

        // NOVO: Buscar estatísticas do usuário
        const userStatsResponse = await axios.get(`${API_URL}/user-stats`);
        setUserStats(userStatsResponse.data);

    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Não foi possível carregar os dados. O backend está rodando?');
    } finally {
        setLoading(false);
    }
};

  // Chama a função de buscar transações quando o componente é montado
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Função para adicionar uma nova transação
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description || !amount || !category) {
        setError('Por favor, preencha todos os campos.');
        return;
    }

    if (isNaN(parseFloat(amount))) {
        setError('O valor deve ser um número.');
        return;
    }

    try {
        const newTransactionData = {
            description,
            amount: parseFloat(amount),
            type,
            category,
        };
        // NOVO: A resposta agora contém 'transaction' e 'userStats'
        const response = await axios.post(`${API_URL}/transactions`, newTransactionData);

        // Adiciona a nova transação à lista local
        setTransactions([...transactions, response.data.transaction]);
        // NOVO: Atualiza as estatísticas do usuário com os dados retornados pelo backend
        setUserStats(response.data.userStats);

        setDescription('');
        setAmount('');
        setCategory('');
        setType('expense');
    } catch (err) {
        console.error('Erro ao adicionar transação:', err.response ? err.response.data : err.message);
        setError(`Erro ao adicionar transação: ${err.response ? err.response.data.message : 'Verifique o console.'}`);
    }
};

const filteredAndSortedTransactions = [...transactions] // Cria uma cópia para não modificar o estado original
  .filter(transaction => {
    if (filterType === 'all') {
      return true; // Retorna todas as transações
    }
    return transaction.type === filterType; // Filtra por tipo (income ou expense)
  })
  .sort((a, b) => {
    switch (sortBy) {
      case 'amount_asc':
        return a.amount - b.amount; // Ordena por valor crescente
      case 'amount_desc':
        return b.amount - a.amount; // Ordena por valor decrescente
      case 'description_asc':
        return a.description.localeCompare(b.description); // Ordena por descrição crescente
      case 'description_desc':
        return b.description.localeCompare(a.description); // Ordena por descrição decrescente
      default:
        return 0; // Nenhuma ordenação ou mantém a ordem original
    }
  });

  const totalExpenses = transactions
  .filter(t => t.type === 'expense')
  .reduce((acc, t) => acc + Math.abs(t.amount), 0); // Soma o valor absoluto das despesas

  return (
    <AppContainer>
      <Title>Gerenciamento Financeiro Matrix</Title>

      <UserStatsContainer>
          <StatItem>
              <small>Nível</small>
              <span>{userStats.level}</span>
          </StatItem>
          <StatItem>
              <small>XP</small>
              <span>{userStats.experience}</span>
          </StatItem>
          <StatItem>
              <small>Saldo Total</small>
              <span style={{ color: userStats.balance >= 0 ? colors.matrixGreen : '#FF6347' }}>
                  R$ {userStats.balance.toFixed(2)}
              </span>
          </StatItem>
      </UserStatsContainer>

       {/* NOVO: Seção de Resumo Financeiro */}
      <SummaryContainer>
        <SectionTitle>Resumo Financeiro</SectionTitle> {/* Reutilizando SectionTitle */}
        <SummaryItem>
          <SummaryLabel>Total de Despesas:</SummaryLabel>
          <SummaryValue type="expense">R$ {totalExpenses.toFixed(2)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Saldo Total:</SummaryLabel>
          <SummaryValue type={userStats.balance >= 0 ? 'income' : 'expense'}>
            R$ {userStats.balance.toFixed(2)}
          </SummaryValue>
        </SummaryItem>
      </SummaryContainer>

      {/* INÍCIO DA SEÇÃO DE NOVA TRANSAÇÃO */}
      <Section>
        <SectionTitle>Nova Transação</SectionTitle>
        <Form onSubmit={handleAddTransaction}>
          <InputGroup>
            <Label htmlFor="description">Descrição:</Label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Pagamento da conta de luz"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="amount">Valor:</Label>
            <input
              id="amount"
              type="number"
              step="0.01" // Permite valores decimais
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 50.00"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="type">Tipo:</Label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="category">Categoria:</Label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Moradia, Alimentação, Salário"
              required
            />
          </InputGroup>

          {error && <p style={{ color: '#FF6347', textAlign: 'center' }}>{error}</p>}
          <Button type="submit">Adicionar Transação</Button>
        </Form>
      </Section>
      {/* FIM DA SEÇÃO DE NOVA TRANSAÇÃO */}

      {/* Seção de Extrato de Transações (que já temos) */}
      <Section>
        <SectionTitle>Extrato</SectionTitle>
        {/* ... (conteúdo do extrato: controles de filtro/ordenação, lista de transações) ... */}
        <ControlsContainer>
          <ControlGroup>
            <Label htmlFor="filterType">Filtrar por Tipo:</Label>
            <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </ControlGroup>

          <ControlGroup>
            <Label htmlFor="sortBy">Ordenar por:</Label>
            <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="none">Nenhum</option>
              <option value="amount_asc">Valor (Crescente)</option>
              <option value="amount_desc">Valor (Decrescente)</option>
              <option value="description_asc">Descrição (A-Z)</option>
              <option value="description_desc">Descrição (Z-A)</option>
            </select>
          </ControlGroup>
        </ControlsContainer>

        {loading ? (
          <p style={{ textAlign: 'center', color: colors.matrixGreen }}>Carregando transações...</p>
        ) : filteredAndSortedTransactions.length === 0 ? (
          <p style={{ textAlign: 'center', color: colors.lightGrey }}>Nenhuma transação encontrada. Adicione uma ou ajuste os filtros!</p>
        ) : (
          <TransactionList>
            {filteredAndSortedTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} type={transaction.type}>
                <TransactionDetails>
                  <TransactionDescription>{transaction.description}</TransactionDescription>
                  <TransactionCategory>({transaction.category})</TransactionCategory>
                </TransactionDetails>
                <TransactionAmount>
                  {transaction.type === 'expense' ? '-' : '+'}R$ {Math.abs(transaction.amount).toFixed(2)}
                </TransactionAmount>
              </TransactionItem>
            ))}
          </TransactionList>
        )}
      </Section>
    </AppContainer>
  );
}

export default App;
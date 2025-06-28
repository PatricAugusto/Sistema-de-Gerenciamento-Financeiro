// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyle from './styles/GlobalStyles.js'; // Importa os estilos globais

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyle /> {/* Aplica os estilos globais aqui */}
    <App />
  </React.StrictMode>,
)
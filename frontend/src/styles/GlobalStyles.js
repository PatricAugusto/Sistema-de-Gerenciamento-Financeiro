// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

// Definindo as cores do tema Matrix
const colors = {
  matrixGreen: '#00FF41', // O verde clássico do Matrix
  darkGreen: '#008F11',
  black: '#000000',
  darkGrey: '#1a1a1a',
  lightGrey: '#cccccc',
  white: '#ffffff',
};

// Estilos globais usando createGlobalStyle
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Consolas', 'Monaco', monospace; /* Fonte com cara de terminal */
    background-color: ${colors.black};
    color: ${colors.matrixGreen};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  button {
    cursor: pointer;
    background-color: ${colors.darkGreen};
    color: ${colors.matrixGreen};
    border: 1px solid ${colors.matrixGreen};
    padding: 8px 15px;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${colors.matrixGreen};
      color: ${colors.black};
    }
  }

  input, select {
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid ${colors.matrixGreen};
    background-color: ${colors.darkGrey};
    color: ${colors.matrixGreen};
    border-radius: 4px;
  }

  input::placeholder {
    color: ${colors.darkGreen};
  }
`;

export default GlobalStyle;
export { colors }; // Exportando as cores para usar em outros componentes
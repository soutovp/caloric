//IMPORTS
import '../css/header.css';
import '../css/style.css';
import '../css/sobre.css';


//Modelos e Serviços
import { performLogin, verifyToken, removeToken} from './services/authService.js';

//Módulos de UI
import { setupAuthUI, updateUIForLoggedInUser, updateUIForLoggedOutUser } from './ui/authUI.js';

// -- FUNÇÕES DE LÓGICA DE NEGÓCIO E ORQUESTRAÇÃO --
/**
 * Lógica principal para o processo de login
 */
const handleLogin = async (email, password) => {
    try {
        const userData = await performLogin(email, password);
        alert('Login bem-sucedido!');
        await refreshAppState(userData);
    } catch (error) {
        console.error('Erro no login:', error);
        alert(error.message || 'Erro ao fazer login.');
    }
};

/**
 * Lógica principal para o processo de logout
 */
const handleLogout = () => {
    removeToken();
    alert('Sessão terminada.');
    updateUIForLoggedOutUser();
};

/**
 * Verifica o estado de login e atualiza toda a aplicação
 */
const refreshAppState = async () => {
    try {
        const userData = await verifyToken(); // Verifica se o token é válido e busca dados do user
        updateUIForLoggedInUser(userData);
    } catch (error) {
        console.warn('Utilizador não logado ou token inválido:', error.message);
        updateUIForLoggedOutUser();
    }
};

// --- PONTO DE PARTIDA DA APLICAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    setupAuthUI(handleLogin, handleLogout); // Passa os handlers para o módulo de UI

    // Inicia a aplicação verificando o estado de login
    refreshAppState();
});
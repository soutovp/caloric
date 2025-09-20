// src/js/app.js
import '../css/header.css';
import '../css/style.css';
import '../css/index.css';

// Importar templates para o Webpack watch (se ainda necessário após as últimas correções)
// import '../index.ejs';
// import '../sobre.ejs';
// import '../privacidade.ejs';

// Modelos e Serviços
import { User } from './modules/User.js';
import { performLogin, performRegister, verifyToken, removeToken } from './services/authService.js';
import { saveCalculation, getCalculationsHistory } from './services/apiService.js';

// Módulos de UI
import { setupAuthUI, updateUIForLoggedInUser, updateUIForLoggedOutUser } from './ui/authUI.js';
import { setupCalculatorUI, displayResults } from './ui/calculatorUI.js';
import { updateHistoryUI, showHistorySection, hideHistorySection } from './ui/historyUI.js';

// --- FUNÇÕES DE LÓGICA DE NEGÓCIO E ORQUESTRAÇÃO ---

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

const handleRegister = async(name, email, password)=>{
	try{
		const userData = await performRegister(name, email, password);
		console.log(userData);
		alert('Registro bem-sucedido');
	}catch(error){
		console.error('Error no registro:', error);
		alert(error.message || 'Erro ao cadastrar.');
	}
};

/**
 * Lógica principal para o processo de logout
 */
const handleLogout = () => {
	removeToken();
	alert('Sessão terminada.');
	updateUIForLoggedOutUser();
	hideHistorySection();
};

/**
 * Lógica principal para o cálculo e salvamento
 */
const handleCalculate = async (formData) => {
	const usuario = new User(formData.weight, formData.height, formData.age, formData.gender, formData.objective, formData.activityLevel);
	const results = usuario.mifflinStJeorCalculation;
	displayResults(results);

	const token = performLogin.getToken(); // Obtém o token do serviço de autenticação
	if (token) {
		try {
			await saveCalculation(results.calculationData);
			console.log('Cálculo salvo com sucesso!');
			await refreshHistory(); // Atualiza o histórico após salvar
		} catch (error) {
			console.error('Erro ao salvar cálculo:', error);
			alert(error.message || 'Não foi possível salvar o seu cálculo no histórico.');
		}
	}
};

/**
 * Busca e exibe o histórico, mantendo a responsabilidade na UI.
 */
const refreshHistory = async () => {
	try {
		const calculations = await getCalculationsHistory();
		updateHistoryUI(calculations);
		showHistorySection();
	} catch (error) {
		console.error('Erro ao buscar histórico:', error);
		updateHistoryUI([]); // Limpa ou mostra mensagem de erro na UI
		hideHistorySection();
	}
};

/**
 * Verifica o estado de login e atualiza toda a aplicação
 */
const refreshAppState = async () => {
	try {
		const userData = await verifyToken(); // Verifica se o token é válido e busca dados do user
		updateUIForLoggedInUser(userData);
		await refreshHistory(); // Carrega histórico se logado
	} catch (error) {
		console.warn('Utilizador não logado ou token inválido:', error.message);
		updateUIForLoggedOutUser();
		hideHistorySection();
	}
};

// --- PONTO DE PARTIDA DA APLICAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
	setupAuthUI(handleLogin, handleLogout, handleRegister); // Passa os handlers para o módulo de UI
	setupCalculatorUI(handleCalculate); // Passa o handler para o módulo da calculadora

	// Inicia a aplicação verificando o estado de login
	refreshAppState();
});

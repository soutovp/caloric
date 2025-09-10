import '../css/header.css';
import '../css/style.css';
import '../css/index.css';
import { logout } from './modules/auth.js';
import { checkLogin, getHistory, loginUser, registerUser, saveCalcOnServer } from './modules/api.js';
import { User } from './modules/User.js';
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('calculator-form');
	const calculatorContainer = document.getElementById('calculator-container');
	const resultsContainer = document.getElementById('results-container');
	const returnButton = document.getElementById('return-button');

	// Obter os elementos do modal de registo
	const registerModal = document.getElementById('register-modal');
	const openRegisterBtn = document.getElementById('open-register-modal-btn');
	const closeRegisterBtn = document.getElementById('close-register-modal-btn');
	const registerForm = document.getElementById('register-form');
	// Obter os elementos do modal de login
	const loginModal = document.getElementById('login-modal');
	const openLoginBtn = document.getElementById('open-login-modal-btn');
	const closeLoginBtn = document.getElementById('close-login-modal-btn');
	const loginForm = document.getElementById('login-form');
	// --- Seletores de Elementos ---
	const navAnonymous = document.getElementById('nav-anonymous');
	const navLoggedIn = document.getElementById('nav-logged-in');
	const userGreeting = document.getElementById('user-greeting');
	const historySection = document.getElementById('history-section');
	const historyList = document.getElementById('history-list');
	const logoutBtn = document.getElementById('logout-btn');

	// Lógica para abrir e fechar o modal
	openRegisterBtn.addEventListener('click', () => registerModal.showModal());
	closeRegisterBtn.addEventListener('click', () => registerModal.close());
	openLoginBtn.addEventListener('click', () => loginModal.showModal());
	closeLoginBtn.addEventListener('click', () => loginModal.close());

	form.addEventListener('submit', function (event) {
		event.preventDefault();
		const weight = parseFloat(document.getElementById('weight').value);
		const height = parseFloat(document.getElementById('height').value);
		const age = parseInt(document.getElementById('age').value);
		const gender = document.getElementById('gender').value;
		const objective = document.getElementById('objective').value;
		const activityLevel = document.getElementById('activity-level').value;
		const usuario = new User(weight, height, age, gender, objective, activityLevel);
		const mifflinStJeorCalculation = usuario.mifflinStJeorCalculation;

		document.getElementById('result-calories').textContent = mifflinStJeorCalculation.finalCalories;
		document.getElementById('result-protein').textContent = mifflinStJeorCalculation.proteinGrams + 'g';
		document.getElementById('result-carbs').textContent = mifflinStJeorCalculation.carbsGrams + 'g';
		document.getElementById('result-fat').textContent = mifflinStJeorCalculation.fatGrams + 'g';
		document.getElementById('result-bmi').textContent = mifflinStJeorCalculation.bmi;

		const bmiClassificationEl = document.getElementById('bmi-classification');

		bmiClassificationEl.innerHTML = `<p>${mifflinStJeorCalculation.classification.title}</p>`;
		bmiClassificationEl.className = `result-item ${mifflinStJeorCalculation.classification.class}`;

		calculatorContainer.classList.add('hidden');
		resultsContainer.classList.remove('hidden');

		const token = localStorage.getItem('authToken');
		if (token) {
			const calculationData = mifflinStJeorCalculation.calculationData;
			saveCalculationToServer(calculationData, token);
		}
	});

	// Lógica para submeter o formulário de registo
	registerForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		const name = document.getElementById('register-name').value;
		const email = document.getElementById('register-email').value;
		const password = document.getElementById('register-password').value;

		try {
			const newUser = await registerUser(name, email, password);
			console.log('Utilizador registrado:', newUser);

			alert('Conta criada com sucesso!');
			registerModal.close();
		} catch (error) {
			// Se houver um erro de rede ou o erro que atirámos acima
			alert(error.message);
		}
	});

	// Lógica para submeter o formulário de login
	loginForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		const email = document.getElementById('login-email').value;
		const password = document.getElementById('login-password').value;

		try {
			const data = await loginUser(email, password);
			
			localStorage.setItem('authToken', data.token);
			alert('Login bem-sucedido!');

			loginModal.close();

			checkLoginStatus();
		} catch (error) {
			alert(error.message);
		}
	});

	// --- FUNÇÕES PRINCIPAIS ---

	/**
	 * Atualiza a UI para o estado "Logado"
	 */
	const updateUIForLoggedInUser = (userData) => {
		navAnonymous.classList.add('hidden');
		navLoggedIn.classList.remove('hidden');
		historySection.classList.remove('hidden');
		userGreeting.classList.remove('hidden');
		userGreeting.textContent = `Olá, ${userData.name || 'Utilizador'}!`;
		fetchHistory();
	};

	/**
	 * Atualiza a UI para o estado "Deslogado"
	 */
	const updateUIForLoggedOutUser = () => {
		navAnonymous.classList.remove('hidden');
		navLoggedIn.classList.add('hidden');
		historySection.classList.add('hidden');
		userGreeting.classList.add('hidden');
	};

	/**
	 * Busca e exibe o histórico de cálculos do utilizador
	 */
	const fetchHistory = async () => {
		const token = localStorage.getItem('authToken');
		if (!token) return;

		try {
			const calculations = await getHistory(token);
			
			// Renderiza o histórico na página
			historyList.innerHTML = ''; // Limpa a lista antes de a preencher
			if (calculations.length === 0) {
				historyList.innerHTML = '<p>Você ainda não tem cálculos guardados.</p>';
			} else {
				calculations.forEach((calc) => {
					const calcElement = document.createElement('div');
					calcElement.className = 'history-item';
					calcElement.innerHTML = `
                        <strong>Data:</strong> ${new Date(calc.createdAt).toLocaleDateString()}<br>
                        <strong>Meta:</strong> ${calc.finalCalories.toFixed(0)} kcal | 
                        <strong>P:</strong> ${calc.proteinGrams.toFixed(0)}g, 
                        <strong>C:</strong> ${calc.carbsGrams.toFixed(0)}g, 
                        <strong>G:</strong> ${calc.fatGrams.toFixed(0)}g
                    `;
					historyList.appendChild(calcElement);
				});
			}
		} catch (error) {
			console.error('Erro ao buscar histórico:', error);
			historyList.innerHTML = '<p>Não foi possível carregar o seu histórico.</p>';
		}
	};

	/**
	 * Verifica o estado de login quando a página carrega
	 */
	const checkLoginStatus = async () => {
		try {
			const response = await checkLogin();
			updateUIForLoggedInUser(await response);
		} catch (error) {
			console.error('Erro ao verificar o token:', error);
			updateUIForLoggedOutUser();
		}
	};

	/**
	 * Envia os dados de um cálculo para a API para serem salvos
	 * @param {object} calculationData - O objeto com todos os dados do cálculo
	 * @param {string} token - O token de autenticação do utilizador
	 */
	const saveCalculationToServer = async (calculationData, token) => {
		try {
			const response = saveCalcOnServer(calculationData, token);

			if(response === 'ok'){
				console.log('Cálculo salvo com sucesso!');
				fetchHistory(); // <-- A MÁGICA: Atualiza a lista de histórico em tempo real!
			}
		} catch (error) {
			console.error('Erro ao salvar cálculo:', error);
			alert('Não foi possível salvar o seu cálculo no histórico.');
		}
	};

	// --- EVENTOS GLOBAIS ---
	logoutBtn.addEventListener('click', () => {
		logout();
		updateUIForLoggedOutUser();
		alert('Sessão terminada.');
	});

	// --- PONTO DE PARTIDA ---
	checkLoginStatus(); // Verifica o estado de login assim que a página está pronta

	returnButton.addEventListener('click', function () {
		resultsContainer.classList.add('hidden');
		calculatorContainer.classList.remove('hidden');
		form.reset();
	});
});

document.addEventListener('DOMContentLoaded', function () {
	const API_URL = 'https://caloric.onrender.com'; // <-- SUBSTITUA PELO SEU URL REAL
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

		// --- Captura de todos os dados, incluindo os novos ---
		const weight = parseFloat(document.getElementById('weight').value);
		const height = parseFloat(document.getElementById('height').value);
		const age = parseInt(document.getElementById('age').value); // Novo!
		const gender = document.getElementById('gender').value; // Novo!
		const objective = document.getElementById('objective').value;
		const activityLevel = document.getElementById('activity-level').value;

		// --- Validação atualizada ---
		if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
			alert('Por favor, insira valores válidos para peso, altura e idade.');
			return;
		}

		const heightInMeters = height / 100;
		const bmi = weight / (heightInMeters * heightInMeters);

		// --- NOVA FÓRMULA DE TMB (Mifflin-St Jeor) ---
		let bmr;
		if (gender === 'male') {
			// Fórmula para homens: (10 * peso em kg) + (6.25 * altura em cm) - (5 * idade) + 5
			bmr = 10 * weight + 6.25 * height - 5 * age + 5;
		} else {
			// 'female'
			// Fórmula para mulheres: (10 * peso em kg) + (6.25 * altura em cm) - (5 * idade) - 161
			bmr = 10 * weight + 6.25 * height - 5 * age - 161;
		}

		// O resto da lógica (TDEE, ajuste de objetivo, macros) continua igual,
		// mas agora usará a nossa TMB (bmr) muito mais precisa!
		let tdee;
		switch (activityLevel) {
			case 'sedentary':
				tdee = bmr * 1.2;
				break;
			case 'light':
				tdee = bmr * 1.375;
				break;
			case 'moderate':
				tdee = bmr * 1.55;
				break;
			case 'very':
				tdee = bmr * 1.725;
				break;
			default:
				tdee = bmr * 1.2;
		}
		const calorieAdjustment = 500;
		let finalCalories;
		if (objective === 'lose') {
			finalCalories = tdee - calorieAdjustment;
		} else if (objective === 'gain') {
			finalCalories = tdee + calorieAdjustment;
		} else {
			finalCalories = tdee;
		}
		const carbsGrams = (finalCalories * 0.4) / 4;
		const proteinGrams = (finalCalories * 0.3) / 4;
		const fatGrams = (finalCalories * 0.3) / 9;

		document.getElementById('result-calories').textContent = finalCalories.toFixed(0);
		document.getElementById('result-protein').textContent = proteinGrams.toFixed(0) + 'g';
		document.getElementById('result-carbs').textContent = carbsGrams.toFixed(0) + 'g';
		document.getElementById('result-fat').textContent = fatGrams.toFixed(0) + 'g';
		document.getElementById('result-bmi').textContent = bmi.toFixed(2);

		const bmiClassificationEl = document.getElementById('bmi-classification');
		let classification = '';
		let classificationClass = '';
		if (bmi < 18.5) {
			classification = 'Abaixo do peso ideal';
			classificationClass = 'status-underweight';
		} else if (bmi >= 18.5 && bmi < 25) {
			classification = 'Peso ideal';
			classificationClass = 'status-ideal';
		} else if (bmi >= 25 && bmi < 30) {
			classification = 'Acima do peso (Sobrepeso)';
			classificationClass = 'status-overweight';
		} else {
			classification = 'Obesidade';
			classificationClass = 'status-obesity';
		}
		bmiClassificationEl.innerHTML = `<p>${classification}</p>`;
		bmiClassificationEl.className = `result-item ${classificationClass}`;

		calculatorContainer.classList.add('hidden');
		resultsContainer.classList.remove('hidden');

		const token = localStorage.getItem('authToken');

		if (token) {
			//Se estiver logado, reunimos os dados e chamamos a função para salvar
			const calculationData = {
				weight,
				height,
				age,
				gender,
				activityLevel,
				objective,
				bmi,
				finalCalories,
				proteinGrams,
				carbsGrams,
				fatGrams,
			};
			saveCalculationToServer(calculationData, token);
		}
		//Se não houver token, não fazemos nada. O utilizador anônimo apenas vê o resultado.
	});

	// Lógica para submeter o formulário de registo
	registerForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		const name = document.getElementById('register-name').value;
		const email = document.getElementById('register-email').value;
		const password = document.getElementById('register-password').value;

		try {
			const response = await fetch(`${API_URL}/api/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				// Se a resposta do servidor for um erro (ex: e-mail já existe)
				throw new Error(data.error || 'Erro ao registar.');
			}

			// Se o registo for bem-sucedido
			alert('Conta criada com sucesso!');
			registerModal.close();
			// No futuro, podemos fazer o login automático aqui
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
			const response = await fetch(`${API_URL}/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erro ao fazer login.');
			}

			// O PASSO MAIS IMPORTANTE: Guardar o token!
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
	 * Função para fazer logout do utilizador
	 */
	const logout = () => {
		localStorage.removeItem('authToken');
		updateUIForLoggedOutUser();
		alert('Sessão terminada.');
	};

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
			const response = await fetch(`${API_URL}/api/calculations`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 401 || response.status === 403) {
				// Token inválido ou expirado! Fazemos o logout.
				logout();
				throw new Error('Sessão inválida ou expirada.');
			}

			const calculations = await response.json();

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
		const token = localStorage.getItem('authToken');
		if (!token) {
			updateUIForLoggedOutUser();
			return;
		}

		// Se existe um token, vamos validá-lo pedindo os dados do utilizador
		try {
			const response = await fetch(`${API_URL}/api/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) {
				// Se o token for inválido (expirado, etc.), fazemos o logout
				logout();
				return;
			}

			const userData = await response.json();
			updateUIForLoggedInUser(userData);
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
			const response = await fetch(`${API_URL}/api/calculations`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(calculationData),
			});

			if (!response.ok) {
				throw new Error('Falha ao salvar o cálculo.');
			}

			console.log('Cálculo salvo com sucesso!');
			fetchHistory(); // <-- A MÁGICA: Atualiza a lista de histórico em tempo real!
		} catch (error) {
			console.error('Erro ao salvar cálculo:', error);
			alert('Não foi possível salvar o seu cálculo no histórico.');
		}
	};

	// --- EVENTOS GLOBAIS ---
	logoutBtn.addEventListener('click', logout);

	// --- PONTO DE PARTIDA ---
	checkLoginStatus(); // Verifica o estado de login assim que a página está pronta

	returnButton.addEventListener('click', function () {
		resultsContainer.classList.add('hidden');
		calculatorContainer.classList.remove('hidden');
		form.reset();
	});
});

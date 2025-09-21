// frontend/src/js/index.js - Lógica ESPECÍFICA DA PÁGINA INICIAL (index.ejs)

// Importa as instâncias globais do app.js
import { authManager, apiClient, handleLogout } from './app.js';
// Importa os módulos UI específicos da página inicial
import { setupCalculatorUI, displayResults, fillCalculatorForm } from './ui/calculatorUI';
// import { setupHistoryUI, displayHistory } from './ui/historyUI'; // Será implementado no futuro

// --- Funções de Callback para a UI da Calculadora (calculatorUI.js) ---

const handleCalculateAndSave = async (calculationResults) => {
	// Sempre exibe os resultados na UI, independente de estar logado ou não
	displayResults(calculationResults);

	// Se o utilizador estiver logado, tentamos salvar o cálculo
	if (authManager.isLoggedIn()) {
		try {
			const currentUser = authManager.getUser();
			const calculationDataToSave = {
				...calculationResults,
				userId: currentUser.id,
			};
			await apiClient.saveCalculation(calculationDataToSave);
			alert('Cálculo salvo no seu histórico!');
			// Opcional: recarregar o histórico aqui se ele estivesse visível
		} catch (error) {
			console.error('Erro ao salvar cálculo:', error);
			// Alertar apenas se for um erro diferente de "não logado"
			if (error.status === 401) {
				// Token expirado/inválido
				handleLogout(); // Chama a função global de logout
				alert('Sessão expirada. Cálculo não salvo. Faça login novamente.');
			} else {
				alert(error.data?.message || 'Erro ao salvar cálculo. Por favor, tente novamente.');
			}
		}
	} else {
		alert('Cálculo realizado! Faça login para guardar o seu histórico e ver as suas metas.');
	}
};

// --- Funções de Carregamento e Exibição de Dados (específicas da página inicial) ---

const loadAndDisplayCalculatorData = async () => {
	if (authManager.isLoggedIn()) {
		try {
			const latestCalculation = await apiClient.getLatestCalculations();
			if (latestCalculation) {
				// Preenche o formulário da calculadora e exibe os resultados (abaixo)
				fillCalculatorForm(latestCalculation);
				displayResults(latestCalculation);
			}
		} catch (error) {
			console.error('Erro ao carregar último cálculo:', error);
			// Se não houver cálculo, ou erro (exceto 404), informa o utilizador
			if (error.status !== 404) {
				// 404 é esperado se não houver cálculos
				alert('Não foi possível carregar o seu último cálculo.');
			}
		}
		// Opcional: Carregar histórico de cálculos
		// await loadAndDisplayHistory();
	}
};

// --- Inicialização ESPECÍFICA DA PÁGINA INICIAL ---
document.addEventListener('DOMContentLoaded', async () => {
	// Configura os event listeners para a UI da calculadora
	setupCalculatorUI({
		onCalculate: handleCalculateAndSave,
	});

	// Carrega e exibe os dados da calculadora (último cálculo) se o utilizador estiver logado
	await loadAndDisplayCalculatorData();

	console.log('Lógica da página inicial (index.js) inicializada.');
});

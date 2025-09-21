// Importa as funções de cálculo
import { performAllCalculations } from '../utils/calculatorUtils';

const form = document.getElementById('calculator-form');
const calculatorContainer = document.getElementById('calculator-container');
const resultsContainer = document.getElementById('results-container');
const returnButton = document.getElementById('return-button');

// Elementos para exibir os resultados (já existem no EJS)
const resultCaloriesEl = document.getElementById('result-calories');
const resultProteinEl = document.getElementById('result-protein');
const resultCarbsEl = document.getElementById('result-carbs');
const resultFatEl = document.getElementById('result-fat');
const resultBmiEl = document.getElementById('result-bmi');
const bmiClassificationEl = document.getElementById('bmi-classification');

/**
 * Exibe os resultados dos cálculos na UI.
 * @param {object} results - Objeto com os resultados dos cálculos, incluindo displayBmiClassification.
 */
export const displayResults = (results)=>{
	if(!results){
		console.error('Resultados inválidos para exibição.');
		return;
	}

	resultCaloriesEl.textContent = results.finalCalories;
	resultProteinEl.textContent = results.proteinGrams + 'g';
	resultCarbsEl.textContent = results.carbsGrams + 'g';
	resultFatEl.textContent = results.fatGrams + 'g';
	resultBmiEl.textContent = results.bmi;

	if(bmiClassificationEl && results.displayBmiClassification){
		bmiClassificationEl.innerHTML = `<p>${results.displayBmiClassification.title}</p>`;
		//Aplica a classe CSS para estilização específica da classificação
		bmiClassificationEl.className = `result-item ${results.displayBmiClassification.class}`;
	}

	calculatorContainer.classList.add('hidden');
	resultsContainer.classList.remove('hidden');
};

/**
 * Preenche o formulário da calculadora com dados específicos.
 * Usado para carregar o último cálculo do utilizador.
 * @param {object} data - Dados para preencher o formulário { weight, height, age, gender, objective, activityLevel }.
 */
export const fillCalculatorForm = (data) =>{
	if(!form || !data) return;

	// Mapeamento inverso se necessário, se os valores do formulário forem diferentes dos armazenados
	// No nosso caso, o formulário usa 'male' e o backend 'MALE', então precisamos reverter para preencher
	const reverseMapGender = (gender) => (gender === 'MALE' ? 'male' : 'female');
	const reverseMapObjective = (obj) => {
		if (obj === 'LOSE_WEIGHT') return 'lose';
		if (obj === 'MAINTAIN_WEIGHT') return 'maintain';
		if (obj === 'GAIN_MUSCLE') return 'gain';
		return obj;
	};
	const reverseMapActivityLevel = (level) => {
		if (level === 'SEDENTARY') return 'sedentary';
		if (level === 'LIGHTLY_ACTIVE') return 'light';
		if (level === 'MODERATELY_ACTIVE') return 'moderate';
		if (level === 'VERY_ACTIVE') return 'very';
		if (level === 'EXTRA_ACTIVE') return 'extra';
		return level;
	};

	document.getElementById('weight').value = data.weight || '';
	document.getElementById('height').value = data.height || '';
	document.getElementById('age').value = data.age || '';
	document.getElementById('gender').value = reverseMapGender(data.gender) || '';
	document.getElementById('objective').value = reverseMapObjective(data.objective) || '';
	document.getElementById('activity-level').value = reverseMapActivityLevel(data.activityLevel) || '';
}

/**
 * Configura os event listeners para o formulário da calculadora.
 * @param {object} callbacks - Objeto com a função de callback `onCalculate`
 * Ex: { onCalculate: (calculationData) => {} }
 */
export const setupCalculatorUI = (callbacks) => {
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Coleta os dados do formulário
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const age = parseInt(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            const objective = document.getElementById('objective').value;
            const activityLevel = document.getElementById('activity-level').value;

            // Realiza todos os cálculos usando a nova função do utils
            const results = performAllCalculations({ weight, height, age, gender, objective, activityLevel });

            // Chama o callback onCalculate com os resultados completos
            // Este callback será responsável por exibir e potencialmente salvar os resultados.
            await callbacks.onCalculate(results);
        });
    }

    if (returnButton) {
        returnButton.addEventListener('click', () => {
            resultsContainer.classList.add('hidden');
            calculatorContainer.classList.remove('hidden');
            form.reset();
        });
    }
};
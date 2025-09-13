// src/js/ui/calculatorUI.js
const form = document.getElementById('calculator-form');
const calculatorContainer = document.getElementById('calculator-container');
const resultsContainer = document.getElementById('results-container');
const returnButton = document.getElementById('return-button');

export const setupCalculatorUI = (onCalculate) => {
	if (form) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const weight = parseFloat(document.getElementById('weight').value);
			const height = parseFloat(document.getElementById('height').value);
			const age = parseInt(document.getElementById('age').value);
			const gender = document.getElementById('gender').value;
			const objective = document.getElementById('objective').value;
			const activityLevel = document.getElementById('activity-level').value;
			onCalculate({ weight, height, age, gender, objective, activityLevel });
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

export const displayResults = (results) => {
	document.getElementById('result-calories').textContent = results.finalCalories;
	document.getElementById('result-protein').textContent = results.proteinGrams + 'g';
	document.getElementById('result-carbs').textContent = results.carbsGrams + 'g';
	document.getElementById('result-fat').textContent = results.fatGrams + 'g';
	document.getElementById('result-bmi').textContent = results.bmi;

	const bmiClassificationEl = document.getElementById('bmi-classification');
	if (bmiClassificationEl) {
		bmiClassificationEl.innerHTML = `<p>${results.classification.title}</p>`;
		bmiClassificationEl.className = `result-item ${results.classification.class}`;
	}

	calculatorContainer.classList.add('hidden');
	resultsContainer.classList.remove('hidden');
};

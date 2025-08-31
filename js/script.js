document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('calculator-form');
	const calculatorContainer = document.getElementById('calculator-container');
	const resultsContainer = document.getElementById('results-container');
	const returnButton = document.getElementById('return-button');

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
	});

	returnButton.addEventListener('click', function () {
		resultsContainer.classList.add('hidden');
		calculatorContainer.classList.remove('hidden');
		form.reset();
	});
});

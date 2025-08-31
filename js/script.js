document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('calculator-form');
	// --- ALTERAÇÃO 1: Obter os contentores ---
	const calculatorContainer = document.getElementById('calculator-container');
	const resultsContainer = document.getElementById('results-container');
	const returnButton = document.getElementById('return-button');

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const weight = parseFloat(document.getElementById('weight').value);
		const height = parseFloat(document.getElementById('height').value);
		const objective = document.getElementById('objective').value;
		const activityLevel = document.getElementById('activity-level').value;

		if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
			alert('Por favor, insira valores válidos para peso e altura.');
			return;
		}

		// --- Todos os cálculos continuam iguais ---
		const heightInMeters = height / 100;
		const bmi = weight / (heightInMeters * heightInMeters);
		const bmr = weight * 22;
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

		// --- ALTERAÇÃO 2: Em vez do console.log, vamos popular o HTML ---
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
		bmiClassificationEl.className = `result-item ${classificationClass}`; // Reseta e adiciona as classes corretas

		// --- ALTERAÇÃO 3: Trocar a visibilidade dos contentores ---
		calculatorContainer.classList.add('hidden');
		resultsContainer.classList.remove('hidden');
	});
	returnButton.addEventListener('click', function () {
		resultsContainer.classList.add('hidden');
		calculatorContainer.classList.remove('hidden');
		form.reset(); // Limpa os campos do formulário para um novo cálculo
	});
});

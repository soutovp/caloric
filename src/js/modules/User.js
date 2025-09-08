export class User {
	constructor(weight, height, age, gender, objective, activityLevel) {
		if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
			alert('Por favor, insira valores válidos para peso, altura e idade.');
			return;
		}
		this.weight = weight;
		this.height = height;
		this.heightInMeters = height / 100;
		this.age = age;
		this.bmi = weight / (this.heightInMeters * this.heightInMeters);
		this.gender = gender;
		this.objective = objective;
		this.activityLevel = activityLevel;
	}

	get mifflinStJeorCalculation() {
		let bmr;
		if (this.gender === 'male') {
			bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
		} else {
			bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age + 161;
		}
		let tdee;
		switch (this.activityLevel) {
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
		let classification = '';
		let classificationClass = '';
		if (this.bmi.toFixed(2) < 18.5) {
			classification = 'Abaixo do peso ideal';
			classificationClass = 'status-underweight';
		} else if (this.bmi.toFixed(2) >= 18.5 && this.bmi.toFixed(2) < 25) {
			classification = 'Peso ideal';
			classificationClass = 'status-ideal';
		} else if (this.bmi.toFixed(2) >= 25 && this.bmi.toFixed(2) < 30) {
			classification = 'Acima do peso (Sobrepeso)';
			classificationClass = 'status-overweight';
		} else {
			classification = 'Obesidade';
			classificationClass = 'status-obesity';
		}
		return {
			carbsGrams: carbsGrams.toFixed(0),
			proteinGrams: proteinGrams.toFixed(0),
			fatGrams: fatGrams.toFixed(0),
			finalCalories: finalCalories.toFixed(0),
			bmi: this.bmi.toFixed(2),
			classification: {
				title: classification,
				class: classificationClass,
			},
			calculationData: {
				weight: this.weight,
				height: this.height,
				age: this.age,
				gender: this.gender,
				activityLevel: this.activityLevel,
				objective: this.objective,
				bmi: this.bmi.toFixed(2),
				finalCalories: finalCalories.toFixed(0),
				proteinGrams: proteinGrams.toFixed(0),
				carbsGrams: carbsGrams.toFixed(0),
				fatGrams: fatGrams.toFixed(0),
			},
		};
	}
}

/**
 * Mapeia os valores do frontend para os valores esperados pela lógica de cálculo
 * e pelo backend (enums do Prisma).
 * @param {string} value - Valor do frontend (ex: 'male', 'lose', 'light').
 * @param {string} type - Tipo de mapeamento ('gender', 'objective', 'activityLevel').
 * @returns {string} O valor mapeado para o backend/cálculo, ou o original se não houver mapeamento.
 */
const mapFrontendValueToBackend = (value, type) => {
    switch(type){
        case 'gender':
            if(value === 'male') return 'MALE';
            if(value === 'female') return 'FEMALE';
            return value;
        case 'objective':
            if(value === 'lose') return 'LOSE_WEIGHT';
            if(value === 'maintain') return 'MAINTAIN_WEIGHT';
            if(value === 'gain') return 'GAIN_MUSCLE';
            return value;
        case 'activityLevel':
            if(value === 'sedentary') return 'SEDENTARY';
            if(value === 'light') return 'LIGHTLY_ACTIVE';
            if(value === 'moderate') return 'MODERATELY_ACTIVE';
            if(value === 'very') return 'VERY_ACTIVE';
            if(value === 'extra') return 'EXTRA_ACTIVE';
            return value;
        default: return value;
    }
};

/**
 * Calcula o Metabolismo Basal (TMB) usando a fórmula de Mifflin-St Jeor.
 * @param {object} params - { weight, height, age, gender }
 * @returns {number} O TMB em calorias.
 */
const calculateBMR = ({ weight, height, age, gender }) => {
    // Mifflin-St Jeor Equation
    if (gender === 'MALE') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else { // FEMALE
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
};

/**
 * Calcula o Metabolismo Basal (TMB) usando a fórmula de Mifflin-St Jeor.
 * @param {object} params - { weight, height, age, gender }
 * @returns {number} O TMB em calorias.
 */
const calculateTDEE = (bmr, activityLevel)=>{
    let activityFactor;
    switch (activityLevel){
        case 'SEDENTARY':           activityFactor = 1.2; break;
        case 'LIGHTLY_ACTIVE':      activityFactor = 1.375; break;
        case 'MODERATELY_ACTIVE':   activityFactor = 1.55; break;
        case 'VERY_ACTIVE':         activityFactor = 1.725; break;
        case 'EXTRA_ACTIVE':        activityFactor = 1.9; break;
        default:                    activityFactor = 1.2;
    }
    return bmr * activityFactor;
};

/**
 * Ajusta as calorias para o objetivo (perder, manter, ganhar peso).
 * @param {number} tdee - O TDEE.
 * @param {string} objective - Objetivo ('LOSE_WEIGHT', 'MAINTAIN_WEIGHT', 'GAIN_MUSCLE').
 * @returns {number} As calorias diárias ajustadas.
 */
const adjustCaloriesForObjective = (tdee, objective) =>{
    switch(objective){
        case 'LOSE_WEIGHT': return tdee - 500;
        case 'GAIN_MUSCLE': return tdee + 300;
        case 'MAINTAIN_WEIGTH': 
        default: return tdee;
    }
};

/**
 * Calcula a distribuição de macronutrientes.
 * @param {number} finalCalories - Calorias diárias totais.
 * @param {string} objective - Objetivo para ajustar a proporção de macros.
 * @returns {object} { proteinGrams, carbsGrams, fatGrams }
 */
const calculateMacros = (finalCalories, objective)=>{
    let proteinPercentage, carbsPercentage, fatPercentage;

    //Proporções comuns ( ajustáveius )
    //Adaptei as porcentagens para que a soma seja sempre 1 ( 100% )
    if(objective === 'LOSE_WEIGHT'){
        proteinPercentage = 0.4;
        carbsPercentage = 0.3;
        fatPercentage = 0.3;
    } else if(objective === 'GAIN_MUSCLE'){
        proteinPercentage = 0.3;
		carbsPercentage = 0.5;
		fatPercentage = 0.2;
    } else {
        proteinPercentage = 0.25;
		carbsPercentage = 0.5;
		fatPercentage = 0.25;
    }

    const proteinCalories = finalCalories * proteinPercentage;
    const carbsCalories = finalCalories * carbsPercentage;
    const fatCalories = finalCalories * fatPercentage;

    //Calorias por grama: Proteína (4), Carboidratos (4), Gordura (9)
    const proteinGrams = proteinCalories / 4;
    const carbsGrams = carbsCalories / 4;
    const fatGrams = fatCalories / 9;

    return {proteinGrams, carbsGrams, fatGrams};
};

/**
 * Calcula o Índice de Massa Corporal (IMC) e sua classificação.
 * @param {number} weight - Peso em kg.
 * @param {number} height - Altura em cm.
 * @returns {object} { bmi, classification: { title, class } }
 */
const calculateBMI = (weight, height)=>{
    //Altura deve ser em metros para o cálculo de IMC (peso / altura^2)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let classificationTitle = '';
    let classificationClass = ''; // Para aplicar classes CSS se necessário

     if (bmi < 18.5) {
        classificationTitle = 'Abaixo do peso';
        classificationClass = 'bmi-underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        classificationTitle = 'Peso normal';
        classificationClass = 'bmi-normal';
    } else if (bmi >= 25 && bmi < 29.9) {
        classificationTitle = 'Sobrepeso';
        classificationClass = 'bmi-overweight';
    } else if (bmi >= 30 && bmi < 34.9) {
        classificationTitle = 'Obesidade Grau I';
        classificationClass = 'bmi-obese-1';
    } else if (bmi >= 35 && bmi < 39.9) {
        classificationTitle = 'Obesidade Grau II';
        classificationClass = 'bmi-obese-2';
    } else {
        classificationTitle = 'Obesidade Grau III';
        classificationClass = 'bmi-obese-3';
    }

    return{
        bmi: parseFloat(bmi.toFixed(2)),
        classification:{
            title: classificationTitle,
            class: classificationClass
        }
    };
};

/**
 * Orquestra todos os cálculos e retorna o resultado final formatado.
 * @param {object} data - { weight, height, age, gender, activityLevel, objective }
 * @returns {object} Todos os resultados dos cálculos.
 */
const performAllCalculations = (data)=>{
    const mappedGender = mapFrontendValueToBackend(data.gender, 'gender');
    const mappedObjective = mapFrontendValueToBackend(data.objective, 'objective');
    const mappedActivityLevel = mapFrontendValueToBackend(data.activityLevel, 'activityLevel');

    //1. Calcular BMI
    const {bmi, classification: bmiClassification} = calculateBMI(data.weight, data.height);

    //2. Calcular TMB
    const bmr = calculateBMR({
        weight: data.weight,
        height: data.height,
        age: data.age,
        gender: mappedGender
    });

    //3. Calcular TDEE
    const tdee = calculateTDEE(bmr, mappedActivityLevel);

    //4. Ajustar calorias para o objetivo
    const finalCalories = adjustCaloriesForObjective(tdee, mappedObjective);

    //5. Calcular Macros
    const {proteinGrams, carbsGrams, fatGrams} = calculateMacros(finalCalories, mappedObjective);

    return{
        weight: data.weight,
        height: data.height,
        age: data.age,
        gender: mappedGender,
        activityLevel: mappedActivityLevel,
        objective: mappedObjective,
        bmi,
        bmiClassification: bmiClassification.title,
        finalCalories: parseFloat(finalCalories.toFixed(0)),
        proteinGrams: parseFloat(proteinGrams.toFixed(0)),
        carbsGrams: parseFloat(carbsGrams.toFixed(0)),
        fatGrams: parseFloat(fatGrams.toFixed(0)),
        displayBmiClassification: bmiClassification,
    };
};

export {
    mapFrontendValueToBackend,
    calculateBMR,
    calculateTDEE,
    adjustCaloriesForObjective,
    calculateMacros,
    calculateBMI,
    performAllCalculations
};
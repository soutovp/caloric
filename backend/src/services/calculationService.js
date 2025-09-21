const { prisma } = require('../config/prisma.js');

/**
 * Guarda um novo cálculo nutricional no histórico do utilizador.
 * Assume que todos os cálculos (BMI, calorias, macros) foram feitos no frontend.
 * @param {string} userId - O ID do utilizador que está a guardar o cálculo.
 * @param {object} calculationData - Objeto contendo todos os dados do cálculo para serem guardados.
 * Deve incluir: { weight, height, age, gender, activityLevel, objective,
 * bmi, bmiClassification, finalCalories, proteinGrams, carbsGrams, fatGrams }.
 * @returns {object} O objeto do cálculo recém-criado.
 * @throws {Error} Se os dados de entrada forem inválidos ou incompletos.
 */
const saveCalculation = async (userId, calculationData) => {
	// Validação básica para garantir que dados essenciais estão presentes
	const requiredFields = ['weight', 'height', 'age', 'gender', 'activityLevel', 'objective', 'bmi', 'bmiClassification', 'finalCalories', 'proteinGrams', 'carbsGrams', 'fatGrams'];

	for (const field of requiredFields) {
		if (calculationData[field] === undefined || calculationData[field] === null) {
            console.log(`Faltou o campo ${field}`);
			throw new Error(`O campo obrigatório '${field}' está ausente ou é nulo nos dados do cálculo.`);
		}
	}

	try {
		const newCalculation = await prisma.calculation.create({
			data: {
				userId,
				// Espalha todos os dados do cálculo diretamente
				...calculationData,
			},
		});
		return newCalculation;
	} catch (error) {
		// Captura erros do Prisma ou outros erros de banco de dados
		console.error('Erro ao guardar cálculo:', error);
		throw new Error('Não foi possível guardar o cálculo. Verifique os dados fornecidos.');
	}
};

/**
 * Obtém o histórico de cálculos de um utilizador.
 * @param {string} userId - O ID do utilizador.
 * @returns {Array<object>} Um array de objetos de cálculo, ordenados do mais recente para o mais antigo.
 */
const getCalculationsHistory = async (userId) => {
    try {
        const calculations = await prisma.calculation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return calculations;
    } catch (error) {
        console.error('Erro ao obter histórico de cálculos:', error);
        throw new Error('Não foi possível obter o histórico de cálculos.');
    }
};

/**
 * Obtém o último cálculo de um utilizador.
 * @param {string} userId - O ID do utilizador.
 * @returns {object | null} O objeto do último cálculo, ou null se nenhum for encontrado.
 */
const getLastCalculation = async (userId) => {
    try {
        const lastCalculation = await prisma.calculation.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return lastCalculation;
    } catch (error) {
        console.error('Erro ao obter o último cálculo:', error);
        throw new Error('Não foi possível obter o último cálculo.');
    }
};

module.exports = {
    saveCalculation,
    getCalculationsHistory,
    getLastCalculation,
};
const { prisma } = require('../config/prisma.js');

/**
 * Obtém os dados de um utilizador pelo seu ID, ecluindo a senha.
 * @param {string} userId - O ID do utilizador.
 * @returns {object} O objeto do utilizador, ou null se não encontrado.
 * @throws {Error} Se o utilizador não for encontrado.
 */
const getUserById = async (userId)=>{
    const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			name: true,
			gender: true,
			objective: true,
			activity: true,
			googleId: true,
			createdAt: true,
			updatedAt: true,
		},
	});
    if(!user){
        throw new Error('Utilizador não encontrado.');
    }
    return user;
};

/**
 * Atualiza o perfil de um utilizador.
 * @param {string} userId - O ID do utilizador a ser atualizador.
 * @param {object} updateData - Objeto contendo os campos a serem atualizados ( name, gender, objective, activity).
 * @returns {object} O objeto do utilizador atualizado ( sem a senha ).
 * @throws {Error} Se o utilizador não for encontrado ou se houver um erro na atualização.
 */
const updateUserProfile = async (userId, updateData)=>{
    //Primeiro, verifica se o utilizador existe
    const existingUser = await prisma.user.findUnique({
        where: {id:userId},
    });
    if(!existingUser){
        throw new Error('Utilizador não encontrado.');
    }
    //Filtra updateData para apenas os campos permitidos e não nulos
    const allowedFields = ['name', 'gender', 'objective', 'activityLevel'];
    const dataToUpdate = {};
    for (const key of allowedFields){
        if(updateData[key] !== undefined){
            dataToUpdate[key] = updateData[key];
        }
    }
    if(Object.keys(dataToUpdate).length === 0){
        throw new Error('Nenhum dado válido fornecido para atualização.');
    }
    const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: dataToUpdate,
		select: {
			id: true,
			email: true,
			name: true,
			gender: true,
			objective: true,
			activityLevel: true,
			googleId: true,
			createdAt: true,
			updatedAt: true,
		},
	});
    return updatedUser;
};

module.exports = {
    getUserById,
    updateUserProfile,
};
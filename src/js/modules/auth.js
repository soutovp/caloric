/**
 * Função para fazer logout do utilizador
 */
export const logout = () => {
	console.log('Removing token');
	localStorage.removeItem('authToken');
};

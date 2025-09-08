/**
 * Função para fazer logout do utilizador
 */
export const logout = () => {
	localStorage.removeItem('authToken');
};

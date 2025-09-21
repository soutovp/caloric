import { API_BASE_URL } from '../config';

/**
 * ApiClient - Uma classe para gerenciar todas as requisições HTTP para o backend.
 * Utiliza o AuthManager para obter o token de autenticação.
 */
class ApiClient {
	constructor(authManager) {
		if (!authManager) {
			throw new Error('AuthManager é necessário para inicializar o ApiClient.');
		}
		this.baseURL = API_BASE_URL;
		this.authManager = authManager;
	}

	/**
	 * Helper para fazer requisições HTTP genéricas.
	 * @param {string} endpoint - O endpoint da API (ex: '/auth/login').
	 * @param {string} method - O método HTTP (ex: 'GET', 'POST', 'PUT', 'DELETE').
	 * @param {object} [data=null] - Dados a serem enviados no corpo da requisição.
	 * @param {boolean} [requiresAuth=true] - Se a requisição exige um token de autenticação.
	 * @returns {Promise<object>} A resposta da API.
	 * @throws {Error} Em caso de erro na requisição ou resposta da API.
	 */
    async request(endpoint, method, data = null, requiresAuth = true){
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type':'application/json',
        };

        if(requiresAuth){
            const token = this.authManager.getToken();
            if(!token){
                throw new Error('Não autenticado. Por favor, faça login novamente.');
            }
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if(data){
            config.body = JSON.stringify(data);
        }

        try{
            const response = await fetch(url, config);
            const responseData = await response.json();

            if(!response.ok){
                //Captura erros da API ( status 4xx, 5xx)
                const error = new Error(responseData.message || 'Erro na requisição da API.');
                error.status = response.status;
                error.data = responseData; // Incluir dados da resposta para depuração
                throw error;
            }
            return responseData;
        }catch(error){
            console.error(`Erro na requisição ${method} ${url}:`, error);
            //Re-lança o erro para ser tratado pelo chamador
            throw error;
        }
    }

    // --- Métodos de Autenticação ---
    async register(name, email, password){
        return this.request('/auth/register', 'POST', {name, email, password}, false);
    }

    async login(email, password){
        return this.request('/auth/login', 'POST', {email, password}, false);
    }

    async getProfile(){
        return this.request('/auth/me', 'GET');
    }

    async updateProfile(profileData){
        return this.request('/auth/me', 'PUT', profileData);
    }

    // --- Métodos de Cálculo ---
    async saveCalculation(calculationData){
        delete calculationData.displayBmiClassification;
        return this.request('/calculations', 'POST', calculationData);
    }

    async getCalculationsHistory(){
        return this.request('/calculations', 'GET');
    }

    async getLatestCalculations(){
        return this.request('/calculations/latest', 'GET');
    }
}

export default ApiClient;
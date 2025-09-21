const AUTH_STORAGE_KEY = 'caloric_auth_data';

/**
 * AuthManager - Uma classe para gerenciar o estado de autenticação do utilizador,
 * incluindo o token JWT e dados básicos do perfil, usando localStorage.
 */
class AuthManager {
	constructor() {
		this.authData = this._loadAuthData();
	}

	/**
	 * Carrega os dados de autenticação do localStorage.
	 * @returns {object | null} O objeto de autenticação ou null se não houver.
	 * @private
	 */
	_loadAuthData() {
		try {
			const data = localStorage.getItem(AUTH_STORAGE_KEY);
			if (data) {
				const auth = JSON.parse(data);
				if (auth && auth.token) {
					return auth;
				}
			}
		} catch (error) {
			console.error('Erro ao carregar dados de autenticação do localStorage:', error);
			this.clearAuthData();
		}
		return null;
	}

	/**
	 * Guarda os dados de autenticação no localStorage.
	 * @param {object} auth - Objeto contendo { token, user: { id, name, email, ... } }
	 * @private
	 */
	_saveAuthData(auth) {
		try {
			localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
			this.authData = auth; //Atualiza o estado interno
		} catch (error) {
			console.error('Erro ao guardar dados de autenticação no localStorage:', error);
		}
	}

	/**
	 * Limpa todos os dados de autenticação do localStorage e do estado interno.
	 */
	clearAuthData() {
		try {
			localStorage.removeItem(AUTH_STORAGE_KEY);
			this.authData = null;
		} catch (error) {
			console.error('Erro ao limpar dados de autenticação do localStorage:', error);
		}
	}

	/**
	 * Define os dados de autenticação após um login bem-sucedido ou registo.
	 * @param {string} token - O token JWT recebido do backend.
	 * @param {object} user - Objeto com os dados do utilizador (id, name, email, gender, objective, activityLevel).
	 */
    setAuth(token, user){
        const auth = {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                objective: user.objective,
                activityLevel: user.activityLevel,
            },
            // expiresAt: Date.now() + (tokenLifeTimeInSeconds * 1000),
        };
        this._saveAuthData(auth);
    }

    /**
     * Obtém o token JWT.
     * @returns {string | null} O token JWT ou null se não estiver autenticado.
     */
    getToken(){
        return this.authData ? this.authData.token : null;
    }

    /**
     * Obtém os dados do utilizador autenticado.
     * @returns {object | null} Os dados do utilizador ou null se não estiver autenticado.
     */
    getUser() {
        return this.authData ? this.authData.user : null;
    }

    /**
     * Verifica se o utilizador está autenticado (tem um token válido).
     * @returns {boolean} True se estiver autenticado, false caso contrário.
     */
    isLoggedIn() {
        // Uma verificação mais robusta poderia incluir a validação da expiração do token
        // mas por enquanto, basta verificar a existência do token.
        return !!this.getToken();
    }

    /**
     * Atualiza os dados do utilizador no estado interno e no localStorage.
     * Útil após uma edição de perfil.
     * @param {object} updatedUserData - Novos dados do utilizador a serem mesclados.
     */
    updateUser(updatedUserData) {
        if (this.authData && this.authData.user) {
            const updatedUser = { ...this.authData.user, ...updatedUserData };
            this.authData.user = updatedUser;
            this._saveAuthData(this.authData); // Re-salva para persistir a atualização
        }
    }
}

export default AuthManager;
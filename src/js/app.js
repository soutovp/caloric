// src/js/app.js
import '../css/header.css';
import '../css/style.css';
import '../css/index.css';

// Importa os módulos essenciais
import ApiClient from './api/apiClient';
import AuthManager from './auth/authManager';
import { setupAuthUI, updateAuthUI } from './ui/authUI';
import { setupProfileUI, displayUserProfile } from './ui/profileUI';
// import { setupHistoryUI, displayHistory } from './ui/historyUI'; // Será implementado no futuro

// --- Instâncias Globais (serão exportadas) ---
export const authManager = new AuthManager();
export const apiClient = new ApiClient(authManager);

// --- Funções de Callback para a UI de Autenticação (authUI.js) ---

const handleLogin = async (email, password) => {
	try {
		const { token, user } = await apiClient.login(email, password);
		authManager.setAuth(token, user); // Guarda o token e user
		updateAuthUI(true, user); // Atualiza a UI para logado
		document.getElementById('login-modal').close(); // Fecha o modal

		// Carregar dados de perfil atualizados do backend ao fazer login
		try {
			const { user: latestProfileData } = await apiClient.getProfile();
			authManager.updateUser(latestProfileData); // Garante que o localStorage está atualizado
			// Nao chamamos displayUserProfile aqui, pois ela é chamada via handleOpenProfile
		} catch (error) {
			console.error('Erro ao carregar perfil do backend após login:', error);
			alert('Não foi possível carregar as informações mais recentes do seu perfil.');
		}
		alert('Login bem-sucedido!');
		// Opcional: Notificar outros módulos (como index.js) que o login ocorreu
		// window.dispatchEvent(new CustomEvent('userLoggedIn'));
	} catch (error) {
		console.error('Erro no login:', error);
		alert(error.data?.message || 'Erro ao fazer login. Verifique as credenciais.');
	}
};

const handleRegister = async (name, email, password) => {
	try {
		const { token, user } = await apiClient.register(name, email, password);
		authManager.setAuth(token, user); // Guarda o token e user
		updateAuthUI(true, user); // Atualiza a UI para logado
		document.getElementById('register-modal').close(); // Fecha o modal

		// Carregar dados de perfil atualizados do backend ao fazer registo
		try {
			const { user: latestProfileData } = await apiClient.getProfile();
			authManager.updateUser(latestProfileData); // Garante que o localStorage está atualizado
		} catch (error) {
			console.error('Erro ao carregar perfil do backend após registo:', error);
			alert('Não foi possível carregar as informações mais recentes do seu perfil.');
		}

		alert('Registo bem-sucedido! Bem-vindo(a)!');
		// Opcional: Notificar outros módulos (como index.js) que o registo ocorreu
		// window.dispatchEvent(new CustomEvent('userLoggedIn'));
	} catch (error) {
		console.error('Erro no registo:', error);
		alert(error.data?.message || 'Erro ao registar. Tente novamente.');
	}
};

export const handleLogout = async () => {
	authManager.clearAuthData(); // Limpa os dados de autenticação
	updateAuthUI(false); // Atualiza a UI para deslogado
	// Opcional: recarregar a página ou redefinir o estado da calculadora
	// window.location.reload(); // Ou apenas limpar a UI
	alert('Sessão terminada com sucesso.');
};

const handleOpenProfile = async () => {
	if (!authManager.isLoggedIn()) {
		alert('Por favor, faça login para ver o seu perfil.');
		return;
	}
	const user = authManager.getUser();
	displayUserProfile(user); // Exibe os dados do perfil (já carregados ou do localStorage)
	// Se precisássemos de dados mais recentes do backend, faríamos aqui:
	// try {
	//     const latestProfileData = await apiClient.getProfile();
	//     authManager.updateUser(latestProfileData.user); // Atualiza o localStorage
	//     displayUserProfile(latestProfileData.user);
	// } catch (error) {
	//     console.error('Erro ao carregar perfil:', error);
	//     alert('Não foi possível carregar os dados do seu perfil.');
	// }
};

// --- Funções de Callback para a UI de Perfil (profileUI.js) ---

const handleUpdateProfile = async (profileData) => {
	if (!authManager.isLoggedIn()) {
		alert('Por favor, faça login para atualizar o seu perfil.');
		return;
	}
	try {
		const { user: updatedUser } = await apiClient.updateProfile(profileData);
		authManager.updateUser(updatedUser); // Atualiza o user no authManager e localStorage
		updateAuthUI(true, updatedUser); // Atualiza a saudação no header
		displayUserProfile(updatedUser); // Re-exibe os dados atualizados no modal de perfil
		alert('Perfil atualizado com sucesso!');
	} catch (error) {
		console.error('Erro ao atualizar perfil:', error);
		alert(error.data?.message || 'Erro ao atualizar perfil. Tente novamente.');
	}
};

// --- Carregamento inicial de dados de autenticação ---
const loadInitialAuthData = async () => {
    if (authManager.isLoggedIn()) {
        const user = authManager.getUser();
        updateAuthUI(true, user);

        // Tenta carregar dados de perfil mais recentes do backend
        try {
            const { user: latestProfileData } = await apiClient.getProfile();
            authManager.updateUser(latestProfileData); // Garante que o localStorage está atualizado
        } catch (error) {
            console.error('Erro ao carregar perfil do backend ao iniciar:', error);
            if (error.status === 401) { // Token inválido/expirado
                handleLogout(); // Desloga o utilizador automaticamente
                alert('Sessão expirada. Faça login novamente.');
            } else {
                alert('Não foi possível carregar as informações mais recentes do seu perfil.');
            }
        }
    } else {
        updateAuthUI(false);
    }
};


// --- Inicialização GLOBAL (acontece em todas as páginas) ---
document.addEventListener('DOMContentLoaded', async () => {
    // Configura os event listeners para a UI de autenticação
    setupAuthUI({
        onLogin: handleLogin,
        onRegister: handleRegister,
        onLogout: handleLogout,
        onOpenProfile: handleOpenProfile,
    });

    // Configura os event listeners para a UI do perfil
    setupProfileUI({
        onUpdateProfile: handleUpdateProfile,
    });

    // Carrega e exibe os dados do utilizador (se já logado) ao carregar a página
    await loadInitialAuthData();

    console.log('Core da aplicação frontend (app.js) inicializado.');
});
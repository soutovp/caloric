// Referências aos elementos do DOM
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const profileModal = document.getElementById('profile-modal'); // Referência ao novo modal de perfil

const openLoginModalBtn = document.getElementById('open-login-modal-btn');
const closeLoginModalBtn = document.getElementById('close-login-modal-btn');
const loginForm = document.getElementById('login-form');

const openRegisterModalBtn = document.getElementById('open-register-modal-btn');
const closeRegisterModalBtn = document.getElementById('close-register-modal-btn');
const registerForm = document.getElementById('register-form');

const logoutBtn = document.getElementById('logout-btn');
const openProfileModalBtn = document.getElementById('open-profile-modal-btn'); // Novo botão para perfil

const navAnonymous = document.getElementById('nav-anonymous');
const navLoggedIn = document.getElementById('nav-logged-in');
const userGreeting = document.getElementById('user-greeting');


/**
 * Exibe ou oculta os elementos da UI baseados no estado de autenticação.
 * @param {boolean} isLoggedIn - True se o utilizador está logado, false caso contrário.
 * @param {object | null} user - Objeto do utilizador logado, ou null.
 */
export const updateAuthUI = (isLoggedIn, user = null)=>{
	if(isLoggedIn){
		navAnonymous.classList.add('hidden');
		navLoggedIn.classList.remove('hidden');
		userGreeting.classList.remove('hidden');
		userGreeting.textContent = `Olá, ${user ? user.name : 'Utilizador'}!`;
	}else{
		navAnonymous.classList.remove('hidden');
		navLoggedIn.classList.add('hidden');
		userGreeting.classList.add('hidden');
		userGreeting.textContent = '';
		//Garante que os modais de autenticação estejam fechado ao deslogar
		closeModals();
	}
};

/**
 * Fecha todos os modais de autenticação.
 */
const closeModals = () => {
	if (loginModal) loginModal.close();
	if (registerModal) registerModal.close();
	if (profileModal) profileModal.close(); // Fecha também o modal de perfil
};


/**
 * Configura os event listeners para os elementos da UI de autenticação.
 * @param {object} callbacks - Objeto com as funções de callback para login, registo e logout.
 * Ex: { onLogin: (email, password) => {}, onRegister: (name, email, password) => {}, onLogout: () => {} }
 */
export const setupAuthUI = (callbacks)=>{
	// Abrir/Fechar Modal de Login
	if(openLoginModalBtn) openLoginModalBtn.addEventListener('click', ()=> loginModal.showModal());
	if(closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', ()=> loginModal.close());

	//Submeter Fomulário de Login
	if(loginForm){
		loginForm.addEventListener('submit', async(event)=>{
			event.preventDefault();
			const email = document.getElementById('login-email').value;
			const password = document.getElementById('login-password').value;
			await callbacks.onLogin(email, password);
			loginForm.reset(); // Limpa o formulário após a tentativa
		});
	}

	//Abrir/Fechar Modal de Registro
	if(openRegisterModalBtn) openRegisterModalBtn.addEventListener('click', ()=> registerModal.showModal());
	if(closeRegisterModalBtn) closeRegisterModalBtn.addEventListener('click', ()=> registerModal.close());

	//Submeter Formulário de Registro
	if(registerForm){
		registerForm.addEventListener('submit', async(event)=>{
			event.preventDefault();
			const name = document.getElementById('register-name').value;
			const email = document.getElementById('register-email').value;
			const password = document.getElementById('register-password').value;
			await callbacks.onRegister(name, email, password);
			registerForm.reset();
		});
	}

	//Botão de Logout
	if(logoutBtn){
		logoutBtn.addEventListener('click', async ()=>{
			await callbacks.onLogout();
		});
	}

	//Abrir Modal de Perfil (novo)
	if(openProfileModalBtn){
		openProfileModalBtn.addEventListener('click', ()=>{
			//Este callback será responsável por popular os dados no modal antes de mostra-lo
			if(callbacks.onOpenProfile){
				callbacks.onOpenProfile();
			}
			profileModal.showModal();
		});
	}

	//Fechar modal de Perfil
	const closeProfileModalBtn = document.getElementById('close-profile-modal-btn');
	if(closeProfileModalBtn){
		closeProfileModalBtn.addEventListener('click', ()=> profileModal.close());
	}
};
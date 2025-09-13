// src/js/ui/authUI.js
const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-modal-btn');
const closeLoginBtn = document.getElementById('close-login-modal-btn');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const navAnonymous = document.getElementById('nav-anonymous');
const navLoggedIn = document.getElementById('nav-logged-in');
const userGreeting = document.getElementById('user-greeting');

// Inicializa os event listeners do modal
export const setupAuthUI = (onLoginSubmit, onLogoutClick) => {
	if (openLoginBtn) openLoginBtn.addEventListener('click', () => loginModal.showModal());
	if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => loginModal.close());
	if (logoutBtn) logoutBtn.addEventListener('click', onLogoutClick);
	if (loginForm) {
		loginForm.addEventListener('submit', (event) => {
			event.preventDefault();
			const email = document.getElementById('login-email').value;
			const password = document.getElementById('login-password').value;
			onLoginSubmit(email, password);
		});
	}
};

export const updateUIForLoggedInUser = (userData) => {
	if (navAnonymous) navAnonymous.classList.add('hidden');
	if (navLoggedIn) navLoggedIn.classList.remove('hidden');
	if (userGreeting) {
		userGreeting.classList.remove('hidden');
		userGreeting.textContent = `Olá, ${userData.name || 'Utilizador'}!`;
	}
	if (loginModal) loginModal.close();
};

export const updateUIForLoggedOutUser = () => {
	if (navAnonymous) navAnonymous.classList.remove('hidden');
	if (navLoggedIn) navLoggedIn.classList.add('hidden');
	if (userGreeting) userGreeting.classList.add('hidden');
	if (loginForm) loginForm.reset();
};

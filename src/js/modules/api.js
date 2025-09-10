import { logout } from "./auth";
const API_URL = 'https://caloric.onrender.com';

export async function registerUser(name, email, password) {
	const response = await fetch(`${API_URL}/api/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, email, password }),
	});

	const data = await response.json();

	if (!response.ok) {
		// Se a resposta do servidor for um erro (ex: e-mail já existe)
		throw new Error(data.error || 'Erro ao registar.');
	}

	// Se o registo for bem-sucedido
	return data;
}

export async function loginUser(email, password){
	const response = await fetch(`${API_URL}/api/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({email, password}),
	});

	const data = await response.json();

	if(!response.ok){
		throw new Error(data.error || 'Erro ao registrar.');
	}

	return data;
}

export async function checkLogin(){
	const token = localStorage.getItem('authToken');
	if (!token) {
		updateUIForLoggedOutUser();
		return;
	}
	const response = await fetch(`${API_URL}/api/me`, {
		headers: {Authorization: `Bearer ${token}`}
	});

	const data = await response.json();

	if (!response.ok) {
		// Se o token for inválido (expirado, etc.), fazemos o logout
		logout();
		return;
	}

	return data;
}

export async function saveCalcOnServer(calculationData, token){
	const response = await fetch(`${API_URL}/api/calculations`,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(calculationData),
	});

	if(!response.ok){
		throw new Error('Falha ao salvar o cálculo.');
	}
	return 'ok';
}

export async function getHistory(token){
	const response = await fetch(`${API_URL}/api/calculations`,{
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if(response.status === 401 ||  response.status === 403){
		logout();
		throw new Error('Sessão inválida ou expirada.');
	}

	return response.json();
}
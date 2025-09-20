// src/js/services/apiService.js
import { API_URL } from '../config';
import { getToken, removeToken } from './authService';

// Função auxiliar para requests autenticadas
const authenticatedFetch = async (endpoint, options = {}) => {
	const token = getToken();
	if (!token && endpoint !== '/api/auth/register' && endpoint !== '/api/auth/login') {
		// Não exige token para registrar/login
		throw new Error('Authentication required.', { cause: 403 });
	}

	const headers = {
		'Content-Type': 'application/json',
		...options.headers,
		...(token && { Authorization: `Bearer ${token}` }), // Adiciona Authorization se houver token
	};

	const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

	if (response.status === 401 || response.status === 403) {
		removeToken(); // Token inválido/expirado, remove-o
		throw new Error('Session invalid or expired.', { cause: response.status });
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({})); // Tenta ler o erro do corpo
		throw new Error(errorData.error || `API error: ${response.statusText}`, { cause: response.status });
	}

	return response.json();
};

export async function registerUser(name, email, password) {
	return authenticatedFetch('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({ name, email, password }),
	});
}

export async function saveCalculation(calculationData) {
	return authenticatedFetch('/api/calculations', {
		method: 'POST',
		body: JSON.stringify(calculationData),
	});
}

export async function getCalculationsHistory() {
	return authenticatedFetch('/api/calculations', {
		method: 'GET',
	});
}

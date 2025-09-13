// src/js/services/authService.js
import { API_URL } from '../config';

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');

export async function performLogin(email, password) {
	const response = await fetch(`${API_URL}/api/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || 'Erro ao fazer login.');
	}
	setToken(data.token);
	return data; // Pode conter dados do utilizador além do token
}

export async function verifyToken() {
	const token = getToken();
	if (!token) {
		throw new Error('No authentication token found.');
	}

	const response = await fetch(`${API_URL}/api/me`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (response.status === 401 || response.status === 403) {
		removeToken(); // Token inválido, remove e força logout
		throw new Error('Invalid or expired token.', { cause: response.status }); // Propaga o erro com o status
	}

	if (!response.ok) {
		throw new Error('Failed to verify token.', { cause: response.status });
	}

	return response.json(); // Retorna os dados do utilizador
}

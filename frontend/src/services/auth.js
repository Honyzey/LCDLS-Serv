// src/services/auth.js
import axios from 'axios';

export function isAuthenticated() {
    const token = getAuthToken();
    return !!token; // Vérifiez si un token d'authentification est présent
}

export function login(token) {
    // Le token est maintenant géré par les cookies, donc pas besoin de le stocker dans le localStorage
}

export function logout() {
    // Supprimez le cookie authToken
    document.cookie = 'authToken=; Max-Age=0; path=/';
}

export function getAuthToken() {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('authToken='));
    if (tokenCookie) {
        const token = tokenCookie.split('=')[1]?.trim();
        if (token) {
            return token;
        }
    }
    return null;
}

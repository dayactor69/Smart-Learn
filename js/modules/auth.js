// Configurazione API
const API_URL = window.location.hostname === 'dayactor69.github.io' 
    ? 'http://178.18.246.191:3001'  // URL produzione
    : 'http://localhost:3001';       // URL sviluppo locale

// Classe per la gestione dell'autenticazione
export class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    async register(email, password, name) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Errore durante la registrazione');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Errore durante la registrazione:', error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Credenziali non valide');
            }

            const data = await response.json();
            if (data.token) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('Errore durante il login:', error);
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getUser() {
        return this.user;
    }
} 
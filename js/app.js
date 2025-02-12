import { Auth } from './modules/auth.js';
import { UI } from './modules/ui.js';
import { EventHandler } from './modules/events.js';

class App {
    constructor() {
        this.auth = new Auth();
        this.ui = new UI();
        this.eventHandler = new EventHandler(this.auth, this.ui);
    }

    init() {
        // Controlla lo stato dell'autenticazione
        const isAuthenticated = this.auth.isAuthenticated();
        if (isAuthenticated) {
            this.ui.updateAuthUI(true, this.auth.getUser());
        }

        // Gestione hash URL iniziale
        const initialHash = window.location.hash.substring(1) || 'home';
        this.ui.showPage(initialHash);
    }
}

// Avvia l'app quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
// Classe per la gestione degli eventi
export class EventHandler {
    constructor(auth, ui) {
        this.auth = auth;
        this.ui = ui;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event Listeners per il modale
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.ui.hideModal());
        }

        window.addEventListener('click', (e) => {
            if (e.target === this.ui.modal) {
                this.ui.hideModal();
            }
        });

        // Gestione tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (btn.dataset.tab === 'login') {
                    this.ui.showLoginForm();
                } else {
                    this.ui.showRegisterForm();
                }
            });
        });

        // Gestione form login
        this.ui.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await this.auth.login(email, password);
                if (response.token) {
                    this.ui.hideModal();
                    this.ui.updateAuthUI(true, response.user);
                    this.ui.showNotification(
                        '<i class="fas fa-check-circle"></i> Login effettuato con successo!', 
                        'success'
                    );
                    this.ui.loginForm.reset();
                }
            } catch (error) {
                this.ui.showNotification(
                    `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Errore durante il login'}`,
                    'error'
                );
            }
        });

        // Gestione form registrazione
        this.ui.registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            try {
                await this.auth.register(email, password, name);
                tabBtns[0].click();
                this.ui.showNotification(
                    '<i class="fas fa-check-circle"></i> Registrazione completata! Ora puoi accedere.',
                    'success'
                );
                this.ui.registerForm.reset();
            } catch (error) {
                this.ui.showNotification(
                    `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Errore durante la registrazione'}`,
                    'error'
                );
            }
        });

        // Gestione login button e menu utente
        this.ui.loginBtn.addEventListener('click', () => {
            if (!this.auth.isAuthenticated()) {
                this.ui.showModal();
            } else {
                const userMenu = document.querySelector('.user-menu');
                if (userMenu) {
                    userMenu.classList.toggle('show');
                    this.setupUserMenu(); // Assicuriamoci che gli eventi del menu siano configurati
                }
            }
        });

        // Gestione navigazione
        this.ui.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href').substring(1);
                
                if (['lezioni', 'profilo'].includes(href) && !this.auth.isAuthenticated()) {
                    this.ui.showNotification(
                        '<i class="fas fa-lock"></i> Effettua l\'accesso per visualizzare questa sezione',
                        'error'
                    );
                    return;
                }
                
                this.ui.showPage(href);
            });
        });

        // Gestione click documento per menu utente
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            if (userMenu && !e.target.closest('.user-menu') && !e.target.closest('.login-btn')) {
                userMenu.classList.remove('show');
            }
        });

        // Gestione pulsanti lezione
        const setupLessonButtons = () => {
            document.querySelectorAll('.start-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lezioneCard = btn.closest('.lezione-card');
                    if (lezioneCard.classList.contains('locked')) {
                        this.ui.showNotification(
                            '<i class="fas fa-lock"></i> Completa le lezioni precedenti per sbloccare questa',
                            'error'
                        );
                        return;
                    }
                    this.ui.showNotification(
                        '<i class="fas fa-play"></i> Lezione avviata',
                        'success'
                    );
                });
            });

            // Gestione filtri e ordinamento
            document.querySelectorAll('.filter-btn, .sort-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const type = btn.classList.contains('filter-btn') ? 'filtro' : 'ordinamento';
                    this.ui.showNotification(
                        `<i class="fas fa-filter"></i> ${type} applicato`,
                        'success'
                    );
                });
            });
        };

        // Configura i bottoni quando si cambia pagina
        this.ui.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(setupLessonButtons, 100); // Piccolo delay per assicurarsi che il DOM sia aggiornato
            });
        });

        // Configura i bottoni all'avvio
        setupLessonButtons();

        // Gestione CTA button
        const ctaBtn = document.querySelector('.cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                this.ui.showModal();
                document.querySelector('.tab-btn[data-tab="register"]').click();
            });
        }

        // Gestione pulsante suggerimento
        const suggestionBtn = document.querySelector('.suggestion-btn');
        if (suggestionBtn) {
            suggestionBtn.addEventListener('click', () => {
                this.ui.showPage('lezioni');
            });
        }
    }

    setupUserMenu() {
        document.getElementById('editProfileBtn')?.addEventListener('click', () => {
            document.querySelector('.user-menu').classList.remove('show');
            this.ui.showPage('profilo');
        });

        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            document.querySelector('.user-menu').classList.remove('show');
            this.auth.logout();
            this.ui.updateAuthUI(false);
            this.ui.showNotification(
                '<i class="fas fa-sign-out-alt"></i> Logout effettuato con successo',
                'success'
            );
        });
    }
} 
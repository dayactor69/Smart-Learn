// Classe per la gestione dell'interfaccia utente
export class UI {
    constructor() {
        this.modal = document.getElementById('authModal');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.loginBtn = document.querySelector('.login-btn');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.currentPage = 'home';
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    showPage(pageId) {
        // Nascondi tutte le sezioni
        document.querySelectorAll('section').forEach(section => 
            section.classList.add('hidden')
        );
        
        // Mostra la sezione richiesta
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentPage = pageId;
        }

        // Aggiorna la navigazione attiva
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
    }

    updateAuthUI(isAuthenticated, user = null) {
        if (isAuthenticated && user) {
            // Aggiorna il pulsante di login
            this.loginBtn.innerHTML = `
                <i class="fas fa-user"></i> ${user.name} 
                <i class="fas fa-chevron-down"></i>
            `;
            
            // Crea menu utente
            this.createUserMenu(user);
            
            // Abilita i link protetti
            this.toggleProtectedLinks(true);
            
            // Aggiorna contenuti profilo
            this.updateProfileContent(user);
            
            // Mostra la dashboard se siamo nella home
            if (this.currentPage === 'home') {
                document.querySelector('.hero').classList.add('hidden');
                document.querySelector('.dashboard').classList.remove('hidden');
            }
        } else {
            this.resetAuthUI();
        }
    }

    createUserMenu(user) {
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-menu-item" id="editProfileBtn">
                <i class="fas fa-user-edit"></i> Modifica Profilo
            </div>
            <div class="user-menu-item" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </div>
        `;
        
        // Aggiungi il nuovo menu
        this.loginBtn.parentNode.insertBefore(userMenu, this.loginBtn.nextSibling);
        
        return userMenu;
    }

    toggleProtectedLinks(enable) {
        const protectedLinks = document.querySelectorAll(
            '.nav-links a[href="#lezioni"], .nav-links a[href="#profilo"]'
        );
        protectedLinks.forEach(link => {
            link.style.pointerEvents = enable ? 'auto' : 'none';
            link.style.opacity = enable ? '1' : '0.5';
        });
    }

    updateProfileContent(user) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => el.textContent = user.name);
        
        const emailElement = document.querySelector('.profile-email');
        if (emailElement) emailElement.textContent = user.email;
    }

    resetAuthUI() {
        // Ripristina il pulsante di login
        this.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Accedi';
        
        // Rimuovi il menu utente
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) userMenu.remove();
        
        // Disabilita i link protetti
        this.toggleProtectedLinks(false);
        
        // Mostra la hero section e nascondi la dashboard
        document.querySelector('.hero')?.classList.remove('hidden');
        document.querySelector('.dashboard')?.classList.add('hidden');
        
        // Se siamo in una pagina protetta, torna alla home
        if (['lezioni', 'profilo'].includes(this.currentPage)) {
            this.showPage('home');
        }
    }

    showModal() {
        this.modal.style.display = 'block';
    }

    hideModal() {
        this.modal.style.display = 'none';
    }

    showLoginForm() {
        this.loginForm.classList.remove('hidden');
        this.registerForm.classList.add('hidden');
    }

    showRegisterForm() {
        this.registerForm.classList.remove('hidden');
        this.loginForm.classList.add('hidden');
    }
} 
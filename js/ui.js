// js/ui.js

const UI = {

    // =====================================================
    // 1. LAYOUT INIT
    // =====================================================
    initLayout: function() {
        this.refreshHeader();
        this.renderFooter();
    },

    // =====================================================
    // 2. HEADER (Dynamic)
    // =====================================================
    refreshHeader: function() {
        const header = document.getElementById('app-header');
        if (!header) return;

        const session = localStorage.getItem('dm_session');
        const isLoggedIn = !!session;
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const themeIconClass = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

        if (!isLoggedIn) {
            header.innerHTML = `
                <div class="header-left">
                    <i class="fas fa-school" style="color: var(--primary); font-size: 1.4rem;"></i>
                </div>
                <div class="header-title" style="color: var(--primary);">MP MPS Dagguluru</div>
                <div class="header-right">
                    <button class="header-btn" onclick="UI.toggleTheme()" aria-label="Theme">
                        <i class="${themeIconClass}" id="header-theme-icon"></i>
                    </button>
                </div>
            `;
        } else {
            const data = JSON.parse(session);
            const displayName = data.displayRole || data.role || 'User';
            header.innerHTML = `
                <div class="header-left">
                    <button class="header-btn" onclick="history.back()" aria-label="Back">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                </div>
                <div class="header-title">${displayName}</div>
                <div class="header-right">
                    <button class="header-btn" onclick="if(typeof Auth!=='undefined') Auth.logout(); else window.location.href='index.html'" aria-label="Logout">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            `;
        }
    },

    // =====================================================
    // 3. FOOTER
    // =====================================================
    renderFooter: function() {
        const footer = document.getElementById('app-footer');
        if (!footer) return;
        footer.innerHTML = `An initiative of <span class="valiass-link" onclick="UI.showContact()">@valiass</span> team`;
    },

    // =====================================================
    // 4. CONTACT MODAL
    // =====================================================
    showContact: function() {
        let modal = document.getElementById('contact-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'contact-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content" style="text-align: center; padding-bottom: var(--space-xl);">
                    <h3 style="color: var(--primary); margin-bottom: 4px;">Contact Valiass Team</h3>
                    <p style="color: var(--text-muted); font-weight: 600; font-size: 1.1rem; margin-bottom: var(--space-lg);">+91 8985361991</p>
                    <div style="display: flex; gap: var(--space-md); justify-content: center; margin-bottom: var(--space-lg);">
                        <a href="tel:8985361991" style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--surface);border:2px solid var(--primary);color:var(--primary);padding:16px;border-radius:var(--radius-lg);text-decoration:none;width:120px;">
                            <i class="fas fa-phone-alt" style="font-size:2rem;margin-bottom:8px;"></i>
                            <span style="font-weight:600;">Call</span>
                        </a>
                        <a href="https://wa.me/918985361991" target="_blank" style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:#25D366;border:2px solid #25D366;color:white;padding:16px;border-radius:var(--radius-lg);text-decoration:none;width:120px;">
                            <i class="fab fa-whatsapp" style="font-size:2.2rem;margin-bottom:6px;"></i>
                            <span style="font-weight:600;">WhatsApp</span>
                        </a>
                    </div>
                    <button class="btn btn-outline" style="border:none;color:var(--text-muted);" onclick="document.getElementById('contact-modal').classList.remove('active')">Cancel</button>
                </div>
            `;
            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
        setTimeout(() => modal.classList.add('active'), 10);
    },

    // =====================================================
    // 5. THEME TOGGLE
    // =====================================================
    toggleTheme: function() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('dm_theme', newTheme);

        const newIconClass = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        const headerIcon = document.getElementById('header-theme-icon');
        const bottomIcon = document.getElementById('theme-icon');
        if (headerIcon) headerIcon.className = newIconClass;
        if (bottomIcon) bottomIcon.className = newIconClass;
    },

    // =====================================================
    // 6. FONT SIZE CONTROL
    // =====================================================
    changeFontSize: function(action) {
        let currentSize = parseInt(localStorage.getItem('dm_font_size') || '16');
        if (action === 'increase' && currentSize < 22) currentSize += 2;
        if (action === 'decrease' && currentSize > 12) currentSize -= 2;
        document.documentElement.style.setProperty('--base-font-size', currentSize + 'px');
        localStorage.setItem('dm_font_size', currentSize);
        this.toast(`ఫాంట్ సైజ్: ${currentSize}px`, 'info', 1500);
    },

    // =====================================================
    // 7. TOAST NOTIFICATION
    // =====================================================
    toast: function(message, type = 'info', duration = 3000) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-text"></span>`;
        toast.querySelector('.toast-text').textContent = message;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // =====================================================
    // 8. PWA INSTALL
    // =====================================================
    initPWA: function() {
        let deferredPrompt;
        const installBtn = document.getElementById('install-app-btn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) installBtn.style.display = 'inline-flex';
        });

        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') installBtn.style.display = 'none';
                    deferredPrompt = null;
                }
            });
        }

        window.addEventListener('appinstalled', () => {
            if (installBtn) installBtn.style.display = 'none';
        });
    }
};

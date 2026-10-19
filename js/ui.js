// js/ui.js
const UI = {
    initLayout: function() {
        const header = document.getElementById('app-header');
        const footer = document.getElementById('app-footer');
        const isNotLoggedIn = document.body.classList.contains('not-logged-in');

        // 1. Header Logic
        if(header) {
            if (isNotLoggedIn) {
                // Home Page Header (Logo + Title + Theme)
                header.innerHTML = `
                    <div class="header-left">
                        <i class="fas fa-school" style="color: var(--primary); font-size: 1.4rem;"></i>
                    </div>
                    <div class="header-title" style="color: var(--primary);">MP MPS Dagguluru</div>
                    <div class="header-right">
                        <button class="header-btn" onclick="UI.toggleTheme()"><i class="fas fa-moon" id="header-theme-icon"></i></button>
                    </div>
                `;
            } else {
                // Logged In Header
                header.innerHTML = `
                    <div class="header-left">
                        <button class="header-btn" onclick="history.back()"><i class="fas fa-arrow-left"></i></button>
                    </div>
                    <div class="header-title">Dashboard</div>
                    <div class="header-right">
                        <button class="header-btn" onclick="Auth.logout()"><i class="fas fa-sign-out-alt"></i></button>
                    </div>
                `;
            }
        }

        // 2. Footer Logic (Always Visible)
        if(footer) {
            footer.innerHTML = `
                An initiative of <span class="valiass-link" onclick="UI.showContact()">@valiass</span> team
            `;
        }
    },

    // Contact Popup (Call & WhatsApp Logos)
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
                        <!-- Call Button -->
                        <a href="tel:8985361991" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--surface); border: 2px solid var(--primary); color: var(--primary); padding: 16px; border-radius: var(--radius-lg); text-decoration: none; width: 120px;">
                            <i class="fas fa-phone-alt" style="font-size: 2rem; margin-bottom: 8px;"></i>
                            <span style="font-weight: 600;">Call</span>
                        </a>
                        
                        <!-- WhatsApp Button -->
                        <a href="https://wa.me/918985361991" target="_blank" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: #25D366; border: 2px solid #25D366; color: white; padding: 16px; border-radius: var(--radius-lg); text-decoration: none; width: 120px;">
                            <i class="fab fa-whatsapp" style="font-size: 2.2rem; margin-bottom: 6px;"></i>
                            <span style="font-weight: 600;">WhatsApp</span>
                        </a>
                    </div>
                    
                    <button class="btn btn-outline" style="border: none; color: var(--text-muted);" onclick="document.getElementById('contact-modal').classList.remove('active')">Cancel</button>
                </div>
            `;
            document.body.appendChild(modal);

            // Close when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }

        // Open with animation
        setTimeout(() => modal.classList.add('active'), 10);
    },

    // Theme Toggle
    toggleTheme: function() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('dm_theme', newTheme);
        
        const headerIcon = document.getElementById('header-theme-icon');
        const bottomIcon = document.getElementById('theme-icon');
        if(headerIcon) headerIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        if(bottomIcon) bottomIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    },

    // Font Size Toggle
    changeFontSize: function(action) {
        let currentSize = parseInt(localStorage.getItem('dm_font_size') || '16');
        if (action === 'increase' && currentSize < 22) currentSize += 2;
        if (action === 'decrease' && currentSize > 12) currentSize -= 2;
        
        document.documentElement.style.setProperty('--base-font-size', currentSize + 'px');
        localStorage.setItem('dm_font_size', currentSize);
    },

    // PWA Install Logic
    initPWA: function() {
        let deferredPrompt;
        const installBtn = document.getElementById('install-app-btn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if(installBtn) installBtn.style.display = 'inline-flex';
        });

        if(installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        installBtn.style.display = 'none';
                    }
                    deferredPrompt = null;
                }
            });
        }

        window.addEventListener('appinstalled', () => {
            if(installBtn) installBtn.style.display = 'none';
        });
    }
};

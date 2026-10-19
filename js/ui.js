// js/ui.js
const UI = {
    initLayout: function() {
        const header = document.getElementById('app-header');
        const footer = document.getElementById('app-footer');
        const isNotLoggedIn = document.body.classList.contains('not-logged-in');

        // 1. Header Logic
        if(header) {
            if (isNotLoggedIn) {
                // Home Page Header (No Back/Logout, Just Logo, Title, Theme)
                header.innerHTML = `
                    <div class="header-left">
                        <i class="fas fa-school" style="color: var(--primary); font-size: 1.4rem;"></i>
                    </div>
                    <div class="header-title" style="color: var(--primary); font-weight: 700;">MP MPS Dagguluru</div>
                    <div class="header-right">
                        <button class="header-btn" onclick="UI.toggleTheme()"><i class="fas fa-moon" id="header-theme-icon"></i></button>
                    </div>
                `;
            } else {
                // Logged In Header (Back + Title + Logout)
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

    // Contact Popup
    showContact: function() {
        const action = confirm("Contact Valiass Team:\n\nClick OK for WhatsApp\nClick Cancel to Call");
        if(action) {
            window.open('https://wa.me/918985361991', '_blank');
        } else {
            window.location.href = 'tel:8985361991';
        }
    },

    // Theme Toggle
    toggleTheme: function() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('dm_theme', newTheme);
        
        // Update Icons (Header + Bottom)
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

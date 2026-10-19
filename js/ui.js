// js/ui.js
const UI = {
    // 1. Header & Footer Injection
    initLayout: function() {
        const header = document.getElementById('app-header');
        const footer = document.getElementById('app-footer');

        if(header && !document.body.classList.contains('not-logged-in')) {
            header.innerHTML = `
                <div class="header-left">
                    <button class="header-btn" onclick="history.back()"><i class="fas fa-arrow-left"></i></button>
                </div>
                <div class="header-title">MP MPS Dagguluru</div>
                <div class="header-right">
                    <button class="header-btn" onclick="Auth.logout()"><i class="fas fa-sign-out-alt"></i></button>
                </div>
            `;
        }

        if(footer) {
            footer.innerHTML = `
                An initiative of <span class="valiass-link" onclick="UI.showContact()">@valiass</span> team
            `;
        }
    },

    // 2. Contact Popup (Call/WhatsApp)
    showContact: function() {
        // Simple prompt for now, will make it a bottom sheet later
        const action = confirm("Contact Valiass Team:\n\nClick OK for WhatsApp\nClick Cancel to Call");
        if(action) {
            window.open('https://wa.me/918985361991', '_blank');
        } else {
            window.location.href = 'tel:8985361991';
        }
    },

    // 3. Theme Toggle (Dark / Light)
    toggleTheme: function() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('dm_theme', newTheme);
        
        // Update Icon
        const icon = document.getElementById('theme-icon');
        if(icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    },

    // 4. Font Size Toggle
    changeFontSize: function(action) {
        let currentSize = parseInt(localStorage.getItem('dm_font_size') || '16');
        if (action === 'increase' && currentSize < 22) currentSize += 2;
        if (action === 'decrease' && currentSize > 12) currentSize -= 2;
        
        document.documentElement.style.setProperty('--base-font-size', currentSize + 'px');
        localStorage.setItem('dm_font_size', currentSize);
    },

    // 5. PWA Install Logic
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

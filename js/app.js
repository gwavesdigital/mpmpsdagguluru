// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Hide Splash Screen after 1.5 seconds
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const appContainer = document.getElementById('app-container');
        
        if(splash && appContainer) {
            splash.classList.add('hidden');
            appContainer.style.display = 'flex';
            
            // Remove splash from DOM after fade out
            setTimeout(() => splash.remove(), 500);
        }
    }, 1500);

    // 2. Apply Saved Theme
    const savedTheme = localStorage.getItem('dm_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    if(icon) icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    // 3. Apply Saved Font Size
    const savedSize = localStorage.getItem('dm_font_size');
    if (savedSize) {
        document.documentElement.style.setProperty('--base-font-size', savedSize + 'px');
    }

    // 4. Init UI Components
    if(typeof UI !== 'undefined') {
        UI.initLayout();
        UI.initPWA();
    }
});

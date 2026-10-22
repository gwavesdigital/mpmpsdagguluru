// js/app.js

// =====================================================
// SPLASH HIDE — Fallback (DOMContentLoaded తో సంబంధం లేకుండా)
// =====================================================
(function hideSplashAfterDelay() {
    function doHide() {
        const splash = document.getElementById('splash-screen');
        const appContainer = document.getElementById('app-container');
        
        if (splash) {
            splash.classList.add('hidden');
            splash.style.opacity = '0';
            splash.style.pointerEvents = 'none';
            setTimeout(() => {
                if (splash.parentNode) splash.parentNode.removeChild(splash);
            }, 500);
        }
        if (appContainer) {
            appContainer.style.display = 'flex';
        }
    }

    // DOM ready అయ్యాక లేదా 1.5s తర్వాత — ఏది ముందు వస్తే అది
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(doHide, 1500));
    } else {
        setTimeout(doHide, 1500);
    }

    // Safety net: 3 సెకన్ల తర్వాత ఖచ్చితంగా hide చేయి
    setTimeout(doHide, 3000);
})();

// =====================================================
// MAIN INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Apply Saved Theme
    const savedTheme = localStorage.getItem('dm_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    // Apply Saved Font Size
    const savedSize = localStorage.getItem('dm_font_size');
    if (savedSize) {
        document.documentElement.style.setProperty('--base-font-size', savedSize + 'px');
    }

    // Init UI Components
    if (typeof UI !== 'undefined') {
        UI.initLayout();
        UI.initPWA();
    }
});

// =====================================================
// Access Control
// =====================================================
async function checkAccess(role) {
    if (role === 'headmaster') {
        window.location.href = 'headmaster.html';
        return;
    }

    let data = null;

    try {
        if (typeof authReady !== 'undefined') {
            await Promise.race([
                authReady,
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
        }

        const schoolDoc = await db.collection('schoolInfo').doc('main').get();
        data = schoolDoc.exists ? schoolDoc.data() : null;

    } catch (error) {
        console.error("Firestore Error:", error);
        showAccessError(
            '⚠️ డేటాబేస్ కనెక్షన్ లోపం.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.'
        );
        return;
    }

    if (!data || !data.isSetupComplete) {
        showAccessError(
            '⚠️ పాఠశాల సెటప్ ఇంకా పూర్తి కాలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.'
        );
        return;
    }

    const sections = data.sections || {};
    
    if (sections[role] === true) {
        window.location.href = role + '.html';
    } else {
        showAccessError(
            `⚠️ ${getRoleLabel(role)} సెక్షన్ ఇంకా ఎనేబుల్ చేయలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.`
        );
    }
}

function showAccessError(message) {
    if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
        UI.toast(message, 'warning', 5000);
    } else {
        alert(message);
    }
}

function getRoleLabel(role) {
    const labels = {
        teacher: 'టీచర్',
        cook: 'వంటవాడు',
        parent: 'తల్లిదండ్రుల'
    };
    return labels[role] || role.toUpperCase();
}

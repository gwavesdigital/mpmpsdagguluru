// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hide Splash Screen after 1.5 seconds
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const appContainer = document.getElementById('app-container');
        
        if (splash && appContainer) {
            splash.classList.add('hidden');
            appContainer.style.display = 'flex';
            setTimeout(() => splash.remove(), 500);
        }
    }, 1500);

    // 2. Apply Saved Theme
    const savedTheme = localStorage.getItem('dm_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    // 3. Apply Saved Font Size
    const savedSize = localStorage.getItem('dm_font_size');
    if (savedSize) {
        document.documentElement.style.setProperty('--base-font-size', savedSize + 'px');
    }

    // 4. Init UI Components (Header, Footer, PWA)
    if (typeof UI !== 'undefined') {
        UI.initLayout();
        UI.initPWA();
    }
});

// ==========================================
// 5. Access Control Logic (కార్డ్స్ పైన క్లిక్ చేసినప్పుడు)
// ==========================================
async function checkAccess(role) {
    try {
        // ✅ Auth పూర్తి అయ్యే వరకు వేచి ఉండు
        if (typeof authReady !== 'undefined') {
            await authReady;
        }

        // డేటాబేస్ నుంచి స్కూల్ సమాచారం తీసుకోవడం
        const schoolDoc = await db.collection('schoolInfo').doc('main').get();
        const data = schoolDoc.exists ? schoolDoc.data() : null;

        // =====================================================
        // 1. హెడ్‌మాస్టర్ (HM) — ఎప్పుడూ headmaster.html కి పంపాలి
        //    (ఆ పేజీ లోపల సెటప్/లాగిన్ ఏది చూపాలో నిర్ణయిస్తుంది)
        // =====================================================
        if (role === 'headmaster') {
            window.location.href = 'headmaster.html';
            return;
        }

        // =====================================================
        // 2. మిగతా సెక్షన్స్ (Teacher, Cook, Parent)
        //    ముందు స్కూల్ సెటప్ పూర్తి అయిందా చెక్ చేయాలి
        // =====================================================
        if (!data || !data.isSetupComplete) {
            showAccessError(
                '⚠️ స్కూల్ సెటప్ పూర్తి కాలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.'
            );
            return;
        }

        // =====================================================
        // 3. సెక్షన్ ఎనేబుల్ చేశారా అని చెక్ చేయడం
        // =====================================================
        const sections = data.sections || {};
        
        if (sections[role] === true) {
            // సెక్షన్ ఆన్ ఉంటే ఆ పేజీకి పంపడం
            window.location.href = role + '.html';
        } else {
            showAccessError(
                `⚠️ ${getRoleLabel(role)} సెక్షన్ ఇంకా ఎనేబుల్ చేయలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.`
            );
        }

    } catch (error) {
        console.error("Access Check Error:", error);
        showAccessError('❌ నెట్‌వర్క్ లోపం. మళ్లీ ప్రయత్నించండి.');
    }
}

// ==========================================
// Helper: Error Message (Toast లేకుంటే alert)
// ==========================================
function showAccessError(message) {
    if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
        UI.toast(message, 'error', 4000);
    } else {
        alert(message);
    }
}

// ==========================================
// Helper: Role Telugu Label
// ==========================================
function getRoleLabel(role) {
    const labels = {
        teacher: 'టీచర్',
        cook: 'వంటవాడు',
        parent: 'తల్లిదండ్రుల'
    };
    return labels[role] || role.toUpperCase();
}

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

    // 4. Init UI Components
    if (typeof UI !== 'undefined') {
        UI.initLayout();
        UI.initPWA();
    }
});

// ==========================================
// 5. Access Control Logic
// ==========================================
async function checkAccess(role) {
    // HM కి ఎప్పుడూ వెళ్లు — డేటాబేస్ చెక్ అవసరం లేదు
    if (role === 'headmaster') {
        window.location.href = 'headmaster.html';
        return;
    }

    // మిగతా roles కి ముందు డేటా చెక్
    let data = null;

    try {
        // Auth పూర్తి అయ్యే వరకు వేచి ఉండు (కానీ fail అయినా కొనసాగు)
        if (typeof authReady !== 'undefined') {
            await Promise.race([
                authReady,
                new Promise(resolve => setTimeout(resolve, 3000)) // 3s timeout
            ]);
        }

        // Firestore నుంచి డేటా తీసుకో
        const schoolDoc = await db.collection('schoolInfo').doc('main').get();
        data = schoolDoc.exists ? schoolDoc.data() : null;

    } catch (error) {
        console.error("Firestore Error:", error);
        // Firestore ఎర్రర్ (permission/network) → స్పష్టమైన మెసేజ్
        showAccessError(
            '⚠️ డేటాబేస్ కనెక్షన్ లోపం.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.\nలేదా ఇంటర్నెట్ కనెక్షన్ చెక్ చేయండి.'
        );
        return;
    }

    // =====================================================
    // డేటా లేదు → సెటప్ పూర్తి కాలేదు
    // =====================================================
    if (!data || !data.isSetupComplete) {
        showAccessError(
            '⚠️ పాఠశాల సెటప్ ఇంకా పూర్తి కాలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.'
        );
        return;
    }

    // =====================================================
    // సెక్షన్ ఎనేబుల్ చేశారా?
    // =====================================================
    const sections = data.sections || {};
    
    if (sections[role] === true) {
        window.location.href = role + '.html';
    } else {
        showAccessError(
            `⚠️ ${getRoleLabel(role)} సెక్షన్ ఇంకా ఎనేబుల్ చేయలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.`
        );
    }
}

// ==========================================
// Helper: Error Message
// ==========================================
function showAccessError(message) {
    if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
        UI.toast(message, 'warning', 5000);
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

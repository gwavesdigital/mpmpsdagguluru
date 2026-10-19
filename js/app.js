// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hide Splash Screen after 1.5 seconds
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const appContainer = document.getElementById('app-container');
        
        if(splash && appContainer) {
            splash.classList.add('hidden');
            appContainer.style.display = 'flex';
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

// 👇 కొత్తగా యాడ్ చేసిన ఫంక్షన్ (సెక్షన్ ఆన్ ఉందా లేదా అని చెక్ చేయడానికి)
async function checkAccess(role) {
    try {
        const schoolDoc = await db.collection('schoolInfo').doc('main').get();
        
        // 1. Setup పూర్తి కాలేదా?
        if (!schoolDoc.exists || !schoolDoc.data().isSetupComplete) {
            alert("⚠️ స్కూల్ సెటప్ పూర్తి కాలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.\n(Valiass setup is not complete. Please contact Headmaster.)");
            return;
        }

        const data = schoolDoc.data();

        // 2. HM అయితే నేరుగా వెళ్లవచ్చు
        if (role === 'headmaster') {
            window.location.href = 'principal.html';
            return;
        }

        // 3. మిగతా సెక్షన్స్ ఎనేబుల్ చేశారా?
        const sections = data.sections || { teacher: false, cook: false, parent: false };
        
        if (sections[role] === true) {
            window.location.href = role + '.html'; // teacher.html, parent.html కి వెళ్తుంది
        } else {
            alert(`⚠️ ${role.toUpperCase()} సెక్షన్ ఇంకా ఎనేబుల్ చేయలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.\n(Section not enabled. Please contact Headmaster.)`);
        }

    } catch (error) {
        console.error("Access Check Error:", error);
        alert("నెట్‌వర్క్ లోపం. మళ్ళీ ప్రయత్నించండి.");
    }
}


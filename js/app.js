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

    // 4. Init UI Components (Header, Footer, PWA)
    if(typeof UI !== 'undefined') {
        UI.initLayout();
        UI.initPWA();
    }
});

// ==========================================
// 5. Access Control Logic (కార్డ్స్ పైన క్లిక్ చేసినప్పుడు)
// ==========================================
async function checkAccess(role) {
    try {
        // డేటాబేస్ నుంచి స్కూల్ సమాచారం తీసుకోవడం
        const schoolDoc = await db.collection('schoolInfo').doc('main').get();
        
        // 1. స్కూల్ సెటప్ పూర్తి అయిందా అని చెక్ చేయడం
        if (!schoolDoc.exists || !schoolDoc.data().isSetupComplete) {
            alert("⚠️ స్కూల్ సెటప్ పూర్తి కాలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.\n(Valiass setup is not complete. Please contact Headmaster.)");
            return;
        }

        const data = schoolDoc.data();

        // 2. హెడ్‌మాస్టర్ అయితే నేరుగా లాగిన్ పేజీకి పంపడం
        if (role === 'headmaster') {
            window.location.href = 'principal.html';
            return;
        }

        // 3. మిగతా సెక్షన్స్ (Teacher, Cook, Parent) ఎనేబుల్ చేశారా అని చెక్ చేయడం
        const sections = data.sections || { teacher: false, cook: false, parent: false };
        
        if (sections[role] === true) {
            // సెక్షన్ ఆన్ ఉంటే ఆ పేజీకి పంపడం
            window.location.href = role + '.html'; 
        } else {
            // ఆఫ్ ఉంటే మెసేజ్ చూపించడం
            alert(`⚠️ ${role.toUpperCase()} సెక్షన్ ఇంకా ఎనేబుల్ చేయలేదు.\nదయచేసి హెడ్‌మాస్టర్‌ని సంప్రదించండి.\n(Section not enabled. Please contact Headmaster.)`);
        }

    } catch (error) {
        console.error("Access Check Error:", error);
        // ఎర్రర్ ఏంటో తెలియడానికి ఎగ్జాక్ట్ మెసేజ్ చూపిస్తున్నాం
        alert("❌ Error: " + error.message); 
    }
}

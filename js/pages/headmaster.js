// js/pages/headmaster.js

let currentScreen = 'loading';
let loginFailCount = 0;

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', async () => {
    const savedTheme = localStorage.getItem('dm_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    const savedSize = localStorage.getItem('dm_font_size');
    if (savedSize) {
        document.documentElement.style.setProperty('--base-font-size', savedSize + 'px');
    }

    // Splash hide
    setTimeout(async () => {
        const splash = document.getElementById('splash');
        const app = document.getElementById('hmApp');
        if (splash) splash.classList.add('hidden');
        if (app) app.classList.remove('hidden');
        setTimeout(() => splash && splash.remove(), 500);
        await decideScreen();
    }, 1500);

    bindEvents();
});

// =====================================================
// SCREEN DECISION
// =====================================================
async function decideScreen() {
    try {
        if (typeof authReady !== 'undefined') {
            await Promise.race([
                authReady,
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
        }

        const session = localStorage.getItem('dm_session');
        if (session) {
            const s = JSON.parse(session);
            if (s.role === 'headmaster') {
                window.location.href = 'hm-dashboard.html';
                return;
            }
        }

        const doc = await db.collection('schoolInfo').doc('main').get();

        if (!doc.exists || !doc.data().isSetupComplete) {
            showScreen('setup');
        } else {
            const data = doc.data();
            const schoolNameEl = document.getElementById('loginSchoolName');
            if (schoolNameEl) schoolNameEl.textContent = data.schoolName || '';
            showScreen('login');
        }
    } catch (error) {
        console.error('Screen decision error:', error);
        if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
            UI.toast('నెట్‌వర్క్ లోపం. మళ్లీ ప్రయత్నించండి.', 'error');
        }
        showScreen('login');
    }
}

// =====================================================
// SCREEN SWITCHER
// =====================================================
function showScreen(name) {
    currentScreen = name;
    ['setup', 'login', 'reset'].forEach(s => {
        const el = document.getElementById('screen' + capitalize(s));
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById('screen' + capitalize(name));
    if (target) target.classList.remove('hidden');

    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        if (name === 'reset') backBtn.classList.remove('hidden');
        else backBtn.classList.add('hidden');
    }

    const title = document.getElementById('pageTitle');
    if (title) {
        title.textContent = {
            setup: 'Headmaster Setup',
            login: 'Headmaster Login',
            reset: 'PIN Reset'
        }[name] || 'Headmaster';
    }
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// =====================================================
// EVENT BINDINGS
// =====================================================
function bindEvents() {
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (typeof UI !== 'undefined') UI.toggleTheme();
            const t = document.body.getAttribute('data-theme');
            themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
        });
    }

    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => showScreen('login'));
    }

    document.querySelectorAll('.pin-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            const isPwd = input.type === 'password';
            input.type = isPwd ? 'text' : 'password';
            btn.textContent = isPwd ? '🙈' : '👁';
        });
    });

    // ✅ Setup PIN — 6 అంకెలు మాత్రమే
    const setupPin = document.getElementById('setupHmPin');
    if (setupPin) {
        setupPin.addEventListener('input', () => {
            setupPin.value = setupPin.value.replace(/\D/g, '').slice(0, 6);
            updatePinDots('setupPinDots', setupPin.value.length);
        });
    }

    // ✅ Setup PIN Confirm — 6 అంకెలు మాత్రమే
    const setupPinConfirm = document.getElementById('setupHmPinConfirm');
    if (setupPinConfirm) {
        setupPinConfirm.addEventListener('input', () => {
            setupPinConfirm.value = setupPinConfirm.value.replace(/\D/g, '').slice(0, 6);
        });
    }

    // ✅ LOGIN PIN — 6 అంకెలు మాత్రమే auto-submit
    const loginPin = document.getElementById('loginPin');
    if (loginPin) {
        loginPin.addEventListener('input', () => {
            loginPin.value = loginPin.value.replace(/\D/g, '').slice(0, 6);
            if (loginPin.value.length === 6) {
                setTimeout(() => handleLogin(), 300);
            }
        });
    }

    // ✅ Reset New PIN — 6 అంకెలు మాత్రమే
    const resetNewPin = document.getElementById('resetNewPin');
    if (resetNewPin) {
        resetNewPin.addEventListener('input', () => {
            resetNewPin.value = resetNewPin.value.replace(/\D/g, '').slice(0, 6);
        });
    }

    // ✅ Reset New PIN Confirm — 6 అంకెలు మాత్రమే
    const resetNewPinConfirm = document.getElementById('resetNewPinConfirm');
    if (resetNewPinConfirm) {
        resetNewPinConfirm.addEventListener('input', () => {
            resetNewPinConfirm.value = resetNewPinConfirm.value.replace(/\D/g, '').slice(0, 6);
        });
    }

    const setupForm = document.getElementById('setupForm');
    if (setupForm) {
        setupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSetup();
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    const forgotBtn = document.getElementById('forgotPinBtn');
    if (forgotBtn) {
        forgotBtn.addEventListener('click', () => showScreen('reset'));
    }

    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleReset();
        });
    }

    const resetBack = document.getElementById('resetBackBtn');
    if (resetBack) {
        resetBack.addEventListener('click', () => showScreen('login'));
    }
}

// =====================================================
// PIN DOTS
// =====================================================
function updatePinDots(containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (container.children.length === 0) {
        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            container.appendChild(dot);
        }
    }
    const dots = container.querySelectorAll('.dot, .pin-dot');
    dots.forEach((d, i) => {
        if (i < count) d.classList.add('success');
        else d.classList.remove('success');
    });
}

function resetLoginDots() {
    const container = document.getElementById('loginDots');
    if (!container) return;
    container.querySelectorAll('.dot, .pin-dot').forEach(d => d.classList.remove('error', 'success'));
    loginFailCount = 0;
}

function markLoginDotError() {
    const container = document.getElementById('loginDots');
    if (!container) return;
    const dots = container.querySelectorAll('.dot, .pin-dot');
    const dot = dots[loginFailCount - 1];
    if (dot) dot.classList.add('error');
}

// =====================================================
// HANDLE SETUP — 6 అంకెలు మాత్రమే
// =====================================================
async function handleSetup() {
    const district = document.getElementById('setupDistrict').value.trim();
    const mandal = document.getElementById('setupMandal').value.trim();
    const village = document.getElementById('setupVillage').value.trim();
    const school = document.getElementById('setupSchool').value.trim();
    const hmName = document.getElementById('setupHmName').value.trim();
    const valiassCode = document.getElementById('setupValiassCode').value.trim();
    const pin = document.getElementById('setupHmPin').value;
    const pinConfirm = document.getElementById('setupHmPinConfirm').value;
    const errorEl = document.getElementById('setupError');
    const btn = document.getElementById('setupSubmitBtn');

    if (!district || !mandal || !village || !school || !hmName) {
        return showFormError(errorEl, 'అన్ని ఫీల్డ్స్ నింపండి.');
    }
    // ✅ 6 అంకెలు మాత్రమే
    if (!/^\d{6}$/.test(pin)) {
        return showFormError(errorEl, 'PIN 6 అంకెలు ఉండాలి.');
    }
    if (pin !== pinConfirm) {
        return showFormError(errorEl, 'PIN మరియు నిర్ధారణ PIN మ్యాచ్ అవ్వలేదు.');
    }

    btn.disabled = true;
    btn.textContent = 'సెటప్ అవుతోంది...';
    hideFormError(errorEl);

    try {
        const result = await Auth.setupHM({
            district, mandal, village, school, hmName, valiassCode, hmPin: pin
        });

        if (result.success) {
            if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
                UI.toast('✅ ' + result.message, 'success');
            }
            setTimeout(() => window.location.href = 'hm-dashboard.html', 800);
        } else {
            showFormError(errorEl, result.message);
            btn.disabled = false;
            btn.textContent = 'సెటప్ పూర్తి చేయండి';
        }
    } catch (err) {
        console.error(err);
        showFormError(errorEl, 'సెటప్ విఫలమైంది. మళ్లీ ప్రయత్నించండి.');
        btn.disabled = false;
        btn.textContent = 'సెటప్ పూర్తి చేయండి';
    }
}

// =====================================================
// HANDLE LOGIN — 6 అంకెలు మాత్రమే
// =====================================================
async function handleLogin() {
    const pinInput = document.getElementById('loginPin');
    const pin = pinInput.value;
    const lockMsg = document.getElementById('loginLockMsg');
    const btn = document.getElementById('loginSubmitBtn');

    // ✅ 6 అంకెలు మాత్రమే
    if (!/^\d{6}$/.test(pin)) {
        if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
            UI.toast('PIN 6 అంకెలు ఉండాలి.', 'warning');
        }
        return;
    }

    btn.disabled = true;
    btn.textContent = 'లాగిన్ అవుతోంది...';
    if (lockMsg) lockMsg.classList.add('hidden');

    try {
        const result = await Auth.loginHM(pin);

        if (result.success) {
            const container = document.getElementById('loginDots');
            if (container) {
                container.querySelectorAll('.dot, .pin-dot').forEach(d => d.classList.add('success'));
            }
            if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
                UI.toast('✅ ' + result.message, 'success');
            }
            setTimeout(() => window.location.href = 'hm-dashboard.html', 600);
        } else {
            loginFailCount++;
            markLoginDotError();
            pinInput.value = '';

            if (loginFailCount >= 5) {
                if (lockMsg) {
                    lockMsg.textContent = '60 సెకన్ల పాటు లాక్ అయ్యింది.';
                    lockMsg.classList.remove('hidden');
                }
                startLockoutTimer(60);
            } else {
                if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
                    UI.toast('❌ ' + result.message, 'error');
                }
            }
            btn.disabled = false;
            btn.textContent = 'లాగిన్';
        }
    } catch (err) {
        console.error(err);
        if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
            UI.toast('నెట్‌వర్క్ లోపం.', 'error');
        }
        btn.disabled = false;
        btn.textContent = 'లాగిన్';
    }
}

function startLockoutTimer(seconds) {
    const btn = document.getElementById('loginSubmitBtn');
    const lockMsg = document.getElementById('loginLockMsg');
    let remaining = seconds;
    if (btn) btn.disabled = true;

    const interval = setInterval(() => {
        remaining--;
        if (lockMsg) lockMsg.textContent = `${remaining} సెకన్ల తర్వాత ప్రయత్నించండి.`;
        if (remaining <= 0) {
            clearInterval(interval);
            if (lockMsg) lockMsg.classList.add('hidden');
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'లాగిన్';
            }
            resetLoginDots();
        }
    }, 1000);
}

// =====================================================
// HANDLE RESET — 6 అంకెలు మాత్రమే
// =====================================================
async function handleReset() {
    const resetCode = document.getElementById('resetCode').value.trim();
    const newPin = document.getElementById('resetNewPin').value;
    const newPinConfirm = document.getElementById('resetNewPinConfirm').value;
    const errorEl = document.getElementById('resetError');
    const btn = document.getElementById('resetSubmitBtn');

    if (!resetCode) return showFormError(errorEl, 'Reset Code నింపండి.');
    // ✅ 6 అంకెలు మాత్రమే
    if (!/^\d{6}$/.test(newPin)) return showFormError(errorEl, 'కొత్త PIN 6 అంకెలు ఉండాలి.');
    if (newPin !== newPinConfirm) return showFormError(errorEl, 'PIN మరియు నిర్ధారణ PIN మ్యాచ్ అవ్వలేదు.');

    btn.disabled = true;
    btn.textContent = 'రీసెట్ అవుతోంది...';
    hideFormError(errorEl);

    try {
        const result = await Auth.resetHMPin(resetCode, newPin);
        if (result.success) {
            if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
                UI.toast('✅ ' + result.message, 'success');
            }
            setTimeout(() => showScreen('login'), 800);
        } else {
            showFormError(errorEl, result.message);
        }
    } catch (err) {
        console.error(err);
        showFormError(errorEl, 'రీసెట్ విఫలమైంది.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'PIN రీసెట్ చేయండి';
    }
}

// =====================================================
// FORM ERROR HELPERS — డూప్లికేట్ తీసేయబడింది
// =====================================================
function showFormError(el, message) {
    if (el) {
        el.textContent = message;
        el.classList.remove('hidden');
        // Inline error కనిపిస్తుంది కాబట్టి toast అవసరం లేదు
    } else {
        // el లేకపోతే మాత్రమే toast
        if (typeof UI !== 'undefined' && typeof UI.toast === 'function') {
            UI.toast(message, 'error');
        } else {
            alert(message);
        }
    }
}

function hideFormError(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
}

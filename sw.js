@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap');

/* =========================================
   1. CSS VARIABLES (Light & Dark Mode)
   ========================================= */
:root {
  /* Brand Colors */
  --primary: #1B5E20;
  --primary-light: #4CAF50;
  --secondary: #FFC107;
  --danger: #D32F2F;
  --success: #388E3C;

  /* Header Colors */
  --header-bg: #E8F5E9;

  /* Light Mode Surfaces */
  --bg-color: #F4F8FC;
  --surface: #FFFFFF;
  --surface-hover: #F1F5F9;
  --text-main: #212121;
  --text-muted: #757575;
  --border-color: #E2E8F0;

  /* Typography */
  --font-family: 'Inter', 'Noto Sans Telugu', sans-serif;
  --base-font-size: 16px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* UI Elements */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.05);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Layout */
  --header-height: 60px;
  --bottom-nav-height: 65px;
}

[data-theme="dark"] {
  --bg-color: #0F172A;
  --surface: #1E293B;
  --surface-hover: #334155;
  --text-main: #F8FAFC;
  --text-muted: #94A3B8;
  --border-color: #334155;
  --primary: #4CAF50;
  --header-bg: #1E293B;
}

/* =========================================
   2. RESET & BASE STYLES
   ========================================= */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

html {
  font-size: var(--base-font-size);
  transition: font-size 0.2s ease;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-color);
  color: var(--text-main);
  line-height: 1.5;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

body.not-logged-in .bottom-nav {
  display: none !important;
}

/* =========================================
   3. UTILITY: HIDDEN (తప్పనిసరి!)
   ========================================= */
.hidden {
  display: none !important;
}

/* =========================================
   4. APP CONTAINER
   ========================================= */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  position: relative;
  background-color: var(--bg-color);
  box-shadow: var(--shadow-lg);
}

/* =========================================
   5. SPLASH SCREEN (FIXED)
   ========================================= */
.splash-screen {
  position: fixed;
  inset: 0;
  background: var(--primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

/* ✅ FIX: పూర్తిగా తీసేయడానికి visibility కూడా */
.splash-screen.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.splash-logo {
  width: clamp(80px, 20vw, 120px);
  margin-bottom: var(--space-md);
  animation: zoomInBounce 1.5s ease-out forwards;
}

.splash-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: var(--space-xs);
  text-align: center;
}

.splash-sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.splash-loader {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-top: var(--space-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes zoomInBounce {
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}

/* ✅ JS fail-safe: 2.5s తర్వాత splash ఆటోమేటిక్ fade */
#splash-screen:not(.keep) {
  animation: splashAutoFade 0.5s ease 2.5s forwards;
}

@keyframes splashAutoFade {
  to { opacity: 0; visibility: hidden; }
}

/* =========================================
   6. HEADER
   ========================================= */
.app-header {
  position: sticky;
  top: 0;
  height: var(--header-height);
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-md);
  z-index: 100;
  box-shadow: var(--shadow-sm);
  transition: background-color 0.3s ease;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  min-width: 50px;
}
.header-right { justify-content: flex-end; }

.header-title {
  font-size: 1.15rem;
  font-weight: 700;
  text-align: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-btn {
  background: none;
  border: none;
  color: var(--text-main);
  font-size: 1.3rem;
  cursor: pointer;
  padding: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}
.header-btn:active { background: rgba(0,0,0,0.05); }

/* =========================================
   7. MAIN CONTENT & BOTTOM NAV
   ========================================= */
.main-content {
  flex: 1;
  padding: var(--space-md);
  padding-bottom: calc(var(--bottom-nav-height) + var(--space-xl));
  width: 100%;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1024px;
  height: var(--bottom-nav-height);
  background-color: var(--surface);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.75rem;
  gap: 4px;
  flex: 1;
  height: 100%;
  transition: color 0.2s;
}
.nav-item.active { color: var(--primary); font-weight: 600; }
.nav-item svg, .nav-item i { font-size: 1.4rem; }

/* =========================================
   8. FOOTER
   ========================================= */
.app-footer {
  text-align: center;
  padding: var(--space-md);
  font-size: 0.85rem;
  color: var(--text-muted);
  background: var(--surface);
  border-top: 1px solid var(--border-color);
}

.valiass-link {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.2s;
}
.valiass-link:hover, .valiass-link:active {
  background: rgba(27, 94, 32, 0.1);
}

/* =========================================
   9. CARDS
   ========================================= */
.card {
  background: var(--surface);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-md);
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.card:active { transform: scale(0.98); }
.card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border-color: rgba(76, 175, 80, 0.3);
  transform: translateY(-2px);
}

.card-center { text-align: center; }

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.card-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: var(--space-lg);
  line-height: 1.5;
}

/* =========================================
   10. BUTTONS
   ========================================= */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  font-family: inherit;
}
.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-primary { background: var(--primary); color: #fff; }
.btn-secondary { background: var(--secondary); color: #212121; }
.btn-outline { background: transparent; border: 1px solid var(--primary); color: var(--primary); }
.btn-block { width: 100%; display: flex; }

.btn-glow {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  border: none;
  box-shadow: 0 4px 15px rgba(27, 94, 32, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.btn-glow:hover {
  box-shadow: 0 6px 20px rgba(27, 94, 32, 0.4);
  transform: translateY(-2px);
}
.btn-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-25deg);
  transition: all 0.7s ease;
}
.btn-glow:hover::before { left: 120%; }

/* Link Button */
.link-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: var(--space-sm) var(--space-md);
  margin-top: var(--space-md);
  border-radius: var(--radius-sm);
  transition: background 0.2s;
  font-family: inherit;
  width: 100%;
  text-align: center;
}
.link-btn:hover,
.link-btn:active {
  background: rgba(27, 94, 32, 0.08);
}

/* Icon Button */
.icon-btn {
  background: none;
  border: none;
  color: var(--text-main);
  font-size: 1.4rem;
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.icon-btn:active { background: rgba(0, 0, 0, 0.05); }
.icon-btn.hidden { visibility: hidden; }

/* =========================================
   11. FORMS
   ========================================= */
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.field input {
  width: 100%;
  height: 50px;
  padding: 10px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background: var(--bg-color);
  color: var(--text-main);
  transition: all 0.2s ease;
  font-family: inherit;
}

.field input:focus {
  background: var(--surface);
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(27, 94, 32, 0.1);
  outline: none;
}

.field-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
}

/* PIN wrap + toggle */
.pin-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.pin-wrap input {
  padding-right: 48px;
  text-align: center;
  letter-spacing: 8px;
  font-size: 1.4rem;
  font-weight: 700;
}

.pin-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}
.pin-toggle:active { background: rgba(0, 0, 0, 0.05); }

/* Form error */
.form-error {
  color: var(--danger);
  background: rgba(211, 47, 47, 0.08);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  border-left: 3px solid var(--danger);
  line-height: 1.4;
  white-space: pre-line;
}
.form-error:empty,
.form-error.hidden {
  display: none;
}

/* Legacy form styles (index.html premium inputs) */
.form-group { margin-bottom: var(--space-md); }

.form-label {
  display: block;
  margin-bottom: var(--space-xs);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--text-muted);
  font-size: 1.1rem;
  z-index: 10;
}

.form-control {
  width: 100%;
  box-sizing: border-box;
  height: 52px;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-color);
  color: var(--text-main);
  transition: all 0.3s ease;
  font-family: inherit;
}

.input-group .form-control { padding-left: 45px; }

.form-control:focus {
  background: var(--surface);
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(27, 94, 32, 0.1);
  outline: none;
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231B5E20%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 16px top 50%;
  background-size: 12px auto;
}

/* =========================================
   12. PREMIUM CARD
   ========================================= */
.premium-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 40px 24px 30px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.premium-card-icon {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary-light), var(--primary));
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 8px 16px rgba(27, 94, 32, 0.25);
  border: 4px solid var(--surface);
  z-index: 10;
}

@keyframes slideUpFade {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* =========================================
   13. HM APP / SCREENS
   ========================================= */
.hm-app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.hm-app .app-header {
  position: sticky;
  top: 0;
}

.screen {
  display: block;
  animation: fadeIn 0.3s ease;
  padding: var(--space-md);
}
.screen.hidden { display: none; }

.app-title {
  font-size: 1.15rem;
  font-weight: 700;
  text-align: center;
  flex: 1;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.login-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: var(--space-md);
}

/* =========================================
   14. PIN DOTS (5-Dot Security)
   ========================================= */
.pin-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 4px 0;
}

.pin-dots .dot,
.pin-dots .pin-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--border-color);
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: inline-block;
}

.pin-dots .dot.error,
.pin-dots .pin-dot.error {
  background-color: var(--danger);
  transform: scale(1.15);
}

.pin-dots .dot.success,
.pin-dots .pin-dot.success {
  background-color: var(--success);
}

.pin-dots-lg {
  gap: 12px;
  margin-top: var(--space-md);
}
.pin-dots-lg .dot,
.pin-dots-lg .pin-dot {
  width: 14px;
  height: 14px;
}

/* Legacy (for compatibility) */
.pin-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--border-color);
  transition: background-color 0.3s;
}
.pin-dot.error { background-color: var(--danger); }

.attempt-text {
  text-align: center;
  font-size: 0.8rem;
  color: var(--danger);
  font-weight: 600;
  min-height: 20px;
}

/* =========================================
   15. TOAST NOTIFICATIONS
   ========================================= */
.toast-container {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10000;
  pointer-events: none;
  width: calc(100% - 32px);
  max-width: 420px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-main);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: auto;
  border-left: 4px solid var(--primary);
  line-height: 1.4;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-success { border-left-color: var(--success); }
.toast-error   { border-left-color: var(--danger); }
.toast-warning { border-left-color: #F9A825; }
.toast-info    { border-left-color: #1565C0; }

.toast-icon { font-size: 1.1rem; flex-shrink: 0; }
.toast-text { flex: 1; word-break: break-word; white-space: pre-line; }

/* =========================================
   16. MODAL
   ========================================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.modal-overlay.active {
  opacity: 1;
  pointer-events: all;
}
.modal-content {
  background: var(--surface);
  width: 100%;
  max-width: 500px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: var(--space-lg);
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
}
.modal-overlay.active .modal-content {
  transform: translateY(0);
}

/* =========================================
   17. TOGGLE SWITCH
   ========================================= */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}
input:checked + .slider { background-color: var(--primary); }
input:focus + .slider { box-shadow: 0 0 1px var(--primary); }
input:checked + .slider:before { transform: translateX(24px); }
.slider.round { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }
.switch input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =========================================
   18. PREMIUM EXTRAS
   ========================================= */
body.not-logged-in {
  background: radial-gradient(circle at 50% 0%, rgba(76, 175, 80, 0.15) 0%, var(--bg-color) 60%) !important;
}

.input-group:focus-within .input-icon {
  color: var(--primary);
  transform: scale(1.1);
  transition: all 0.3s ease;
}

.input-group:focus-within .form-control {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15);
}

.pin-input {
  text-align: center !important;
  font-size: 1.5rem !important;
  letter-spacing: 8px !important;
  font-weight: 700 !important;
  padding: 10px 45px 10px 45px !important;
  background: #ffffff !important;
  border: 2px solid #E2E8F0 !important;
}
[data-theme="dark"] .pin-input {
  background: #0F172A !important;
  border-color: #334155 !important;
}

/* =========================================
   19. RESPONSIVE
   ========================================= */
@media (min-width: 768px) {
  .app-container {
    margin: var(--space-lg) auto;
    min-height: calc(100dvh - 48px);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .main-content {
    padding: var(--space-xl);
  }
  .bottom-nav {
    position: sticky;
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }
}

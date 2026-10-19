// js/auth.js
const Auth = {
    // HM Login Logic
    loginHM: async function(enteredPin) {
        try {
            // 1. Get School Setup Data
            const schoolDoc = await db.collection('schoolInfo').doc('main').get();
            
            if (!schoolDoc.exists) {
                return { success: false, message: "స్కూల్ సెటప్ పూర్తి కాలేదు. వాలియాస్ టీమ్ ని సంప్రదించండి." };
            }

            const schoolData = schoolDoc.data();

            // 2. Check if HM PIN is already set
            if (!schoolData.hmPin) {
                // First Time Setup: HM is setting the PIN
                await db.collection('schoolInfo').doc('main').update({
                    hmPin: enteredPin // In real world, hash this!
                });
                this.setSession('headmaster', schoolData.hmName, 'HM');
                return { success: true, message: "PIN సెట్ చేయబడింది!", firstLogin: true };
            } else {
                // Normal Login: Verify PIN
                if (schoolData.hmPin === enteredPin) {
                    this.setSession('headmaster', schoolData.hmName, 'HM');
                    return { success: true, message: "లాగిన్ విజయవంతమైంది!" };
                } else {
                    return { success: false, message: "తప్పు PIN. దయచేసి మళ్ళీ ప్రయత్నించండి." };
                }
            }
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: "నెట్‌వర్క్ లోపం. మళ్ళీ ప్రయత్నించండి." };
        }
    },

    // Session Management
    setSession: function(role, name, displayRole) {
        const sessionData = {
            role: role,
            name: name,
            displayRole: displayRole,
            loginTime: new Date().getTime()
        };
        localStorage.setItem('dm_session', JSON.stringify(sessionData));
    },

    // Logout Logic
    logout: function() {
        localStorage.removeItem('dm_session');
        window.location.href = 'index.html';
    },

    // Check if logged in
    checkAuth: function(requiredRole) {
        const session = localStorage.getItem('dm_session');
        if (!session) {
            window.location.href = 'index.html';
            return false;
        }
        const data = JSON.parse(session);
        if (requiredRole && data.role !== requiredRole) {
            window.location.href = 'index.html';
            return false;
        }
        return data;
    }
};

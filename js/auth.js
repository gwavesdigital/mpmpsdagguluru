// js/auth.js
const Auth = {
    loginHM: async function(enteredPin) {
        try {
            const schoolDoc = await db.collection('schoolInfo').doc('main').get();
            
            if (!schoolDoc.exists) {
                return { success: false, message: "స్కూల్ సెటప్ పూర్తి కాలేదు. వాలియాస్ టీమ్ ని సంప్రదించండి." };
            }

            const schoolData = schoolDoc.data();

            if (!schoolData.hmPin) {
                // First Time Setup
                await db.collection('schoolInfo').doc('main').update({ hmPin: enteredPin });
                this.setSession('headmaster', schoolData.hmName, 'HM');
                return { success: true, message: "PIN సెట్ చేయబడింది!", firstLogin: true };
            } else {
                // Normal Login
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

    setSession: function(role, name, displayRole) {
        const sessionData = { role, name, displayRole, loginTime: new Date().getTime() };
        localStorage.setItem('dm_session', JSON.stringify(sessionData));
    },

    logout: function() {
        localStorage.removeItem('dm_session');
        window.location.href = 'index.html';
    },

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

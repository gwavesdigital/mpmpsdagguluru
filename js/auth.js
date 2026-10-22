// js/auth.js
const Auth = {
    // =====================================================
    // HM LOGIN (PIN చెక్ + Lockout + Device Lock)
    // =====================================================
    loginHM: async function(enteredPin) {
        try {
            // 1. Lockout చెక్
            const lockUntil = parseInt(localStorage.getItem('dm_lock_until') || '0');
            if (Date.now() < lockUntil) {
                const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
                return { success: false, message: `లాక్ అయ్యింది. ${remaining} సెకన్ల తర్వాత ప్రయత్నించండి.` };
            }

            const schoolDoc = await db.collection('schoolInfo').doc('main').get();

            if (!schoolDoc.exists) {
                return { success: false, message: "స్కూల్ సెటప్ పూర్తి కాలేదు. వాలియాస్ టీమ్ ని సంప్రదించండి." };
            }

            const schoolData = schoolDoc.data();

            // 2. PIN చెక్
            if (schoolData.hmPin !== enteredPin) {
                // తప్పు PIN — fail count పెంచు
                const failCount = parseInt(localStorage.getItem('dm_fail_count') || '0') + 1;
                localStorage.setItem('dm_fail_count', failCount);

                if (failCount >= 5) {
                    localStorage.setItem('dm_lock_until', Date.now() + 60000);
                    localStorage.setItem('dm_fail_count', '0');
                    return { success: false, message: "5 సార్లు తప్పు PIN. 60 సెకన్ల లాక్.", failCount: 5 };
                }

                return { success: false, message: `తప్పు PIN. (${failCount}/5)`, failCount };
            }

            // 3. విజయవంతం — fail count రీసెట్
            localStorage.removeItem('dm_fail_count');
            localStorage.removeItem('dm_lock_until');

            // 4. Device Lock చెక్ (ఒకవేళ allowedDeviceId సెట్ అయ్యి ఉంటే)
            if (schoolData.allowedDeviceId) {
                const thisDevice = this.getDeviceId();
                if (schoolData.allowedDeviceId !== thisDevice) {
                    return { success: false, message: "ఈ పరికరం అనుమతించబడలేదు. వాలియాస్ టీమ్ ని సంప్రదించండి." };
                }
            }

            // 5. Session సేవ్
            this.setSession('headmaster', schoolData.hmName, 'HM');
            return { success: true, message: "లాగిన్ విజయవంతమైంది!" };

        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: "నెట్‌వర్క్ లోపం. మళ్ళీ ప్రయత్నించండి." };
        }
    },

    // =====================================================
    // HM SETUP (మొదటిసారి — 5 ఫీల్డ్స్ + Valiass Code + PIN)
    // =====================================================
    setupHM: async function(setupData) {
        try {
            // Valiass Code validation: 5 ఫీల్డ్స్ చివరి అక్షరం + @533340
            const lastChars =
                (setupData.district || '').slice(-1) +
                (setupData.mandal || '').slice(-1) +
                (setupData.village || '').slice(-1) +
                (setupData.school || '').slice(-1) +
                (setupData.hmName || '').slice(-1);

            const expectedCode = lastChars + '@533340';

            if (setupData.valiassCode !== expectedCode) {
                return { success: false, message: "Valiass Setup Code తప్పు. మళ్లీ చెక్ చేయండి." };
            }

            // Firestore లో సేవ్
            await db.collection('schoolInfo').doc('main').set({
                schoolName: setupData.school,
                district: setupData.district,
                mandal: setupData.mandal,
                village: setupData.village,
                hmName: setupData.hmName,
                hmPin: setupData.hmPin,
                valiassCode: setupData.valiassCode,
                isSetupComplete: true,
                allowedDeviceId: this.getDeviceId(),
                sections: { teacher: false, cook: false, parent: false, office: false },
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Session సేవ్
            this.setSession('headmaster', setupData.hmName, 'HM');
            return { success: true, message: "సెటప్ విజయవంతమైంది!" };

        } catch (error) {
            console.error("Setup Error:", error);
            return { success: false, message: "సెటప్ విఫలమైంది. మళ్లీ ప్రయత్నించండి." };
        }
    },

    // =====================================================
    // HM PIN RESET (919720 - ddmmyy ఫార్ములా)
    // =====================================================
    resetHMPin: async function(resetCode, newPin) {
        try {
            const schoolDoc = await db.collection('schoolInfo').doc('main').get();
            if (!schoolDoc.exists) {
                return { success: false, message: "స్కూల్ సెటప్ పూర్తి కాలేదు." };
            }

            const schoolData = schoolDoc.data();
            const dob = schoolData.hmDob; // HM DOB (ddmmyy ఫార్మాట్ లో సేవ్ చేసి ఉండాలి)

            if (!dob) {
                return { success: false, message: "HM DOB రికార్డ్ లేదు. వాలియాస్ టీమ్ ని సంప్రదించండి." };
            }

            const expectedReset = '919720-' + dob;
            if (resetCode !== expectedReset) {
                return { success: false, message: "రీసెట్ కోడ్ తప్పు." };
            }

            await db.collection('schoolInfo').doc('main').update({ hmPin: newPin });
            localStorage.removeItem('dm_fail_count');
            localStorage.removeItem('dm_lock_until');
            return { success: true, message: "PIN విజయవంతంగా రీసెట్ అయ్యింది!" };

        } catch (error) {
            console.error("Reset Error:", error);
            return { success: false, message: "రీసెట్ విఫలమైంది." };
        }
    },

    // =====================================================
    // SESSION MANAGEMENT
    // =====================================================
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
    },

    // =====================================================
    // DEVICE ID (Device Lock కోసం)
    // =====================================================
    getDeviceId: function() {
        let id = localStorage.getItem('dm_device_id');
        if (!id) {
            id = 'DEV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('dm_device_id', id);
        }
        return id;
    }
};

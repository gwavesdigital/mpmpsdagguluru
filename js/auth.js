// js/auth.js
const Auth = {

    // =====================================================
    // HM LOGIN
    // =====================================================
    loginHM: async function(enteredPin) {
        try {
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

            if (schoolData.hmPin !== enteredPin) {
                const failCount = parseInt(localStorage.getItem('dm_fail_count') || '0') + 1;
                localStorage.setItem('dm_fail_count', failCount);

                if (failCount >= 5) {
                    localStorage.setItem('dm_lock_until', Date.now() + 60000);
                    localStorage.setItem('dm_fail_count', '0');
                    return { success: false, message: "5 సార్లు తప్పు PIN. 60 సెకన్ల లాక్.", failCount: 5 };
                }
                return { success: false, message: `తప్పు PIN. (${failCount}/5)`, failCount };
            }

            localStorage.removeItem('dm_fail_count');
            localStorage.removeItem('dm_lock_until');

            // Device Lock — ✅ ఇప్పుడు మొదటిసారి login లో deviceId సేవ్ అవుతుంది
            const thisDevice = this.getDeviceId();
            if (!schoolData.allowedDeviceId) {
                // మొదటిసారి login — deviceId సేవ్ చేయి
                await db.collection('schoolInfo').doc('main').update({ allowedDeviceId: thisDevice });
            } else if (schoolData.allowedDeviceId !== thisDevice) {
                return { success: false, message: "ఈ పరికరం అనుమతించబడలేదు. వాలియాస్ టీమ్ ని సంప్రదించండి." };
            }

            this.setSession('headmaster', schoolData.hmName, 'HM');
            return { success: true, message: "లాగిన్ విజయవంతమైంది!" };

        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: "నెట్‌వర్క్ లోపం. మళ్ళీ ప్రయత్నించండి." };
        }
    },

    // =====================================================
    // HM SETUP
    // =====================================================
    setupHM: async function(setupData) {
        try {
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

            // ✅ deviceId ముందే generate చేయి
            const deviceId = this.getDeviceId();

            await db.collection('schoolInfo').doc('main').set({
                schoolName: setupData.school,
                district: setupData.district,
                mandal: setupData.mandal,
                village: setupData.village,
                hmName: setupData.hmName,
                hmPin: setupData.hmPin,
                valiassCode: setupData.valiassCode,
                isSetupComplete: true,
                allowedDeviceId: deviceId,
                // ✅ hmDob — reset కోసం (Valiass టీమ్ Firestore Console లో సెట్ చేస్తుంది)
                hmDob: null,
                sections: { teacher: false, cook: false, parent: false, office: false },
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.setSession('headmaster', setupData.hmName, 'HM');
            return { success: true, message: "సెటప్ విజయవంతమైంది!" };

        } catch (error) {
            console.error("Setup Error:", error);
            return { success: false, message: "సెటప్ విఫలమైంది. మళ్లీ ప్రయత్నించండి." };
        }
    },

    // =====================================================
    // HM PIN RESET
    // =====================================================
    resetHMPin: async function(resetCode, newPin) {
        try {
            const schoolDoc = await db.collection('schoolInfo').doc('main').get();
            if (!schoolDoc.exists) {
                return { success: false, message: "స్కూల్ సెటప్ పూర్తి కాలేదు." };
            }

            const schoolData = schoolDoc.data();
            const dob = schoolData.hmDob;

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
    // SESSION
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
    // DEVICE ID
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

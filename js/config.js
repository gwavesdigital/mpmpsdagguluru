// js/config.js

// ⚠️ కొత్త ప్రాజెక్ట్ mpmpsdagguluru-2026 విలువలు
const firebaseConfig = {
  apiKey: "AIzaSyDkmfsfUuP_5NWfqsn_FHhDVhLPVvSivY8",
  authDomain: "mpmpsdagguluru-2026.firebaseapp.com",
  projectId: "mpmpsdagguluru-2026",
  storageBucket: "mpmpsdagguluru-2026.firebasestorage.app",
  messagingSenderId: "347951688448",
  appId: "1:347951688448:web:6f45e622dff615806ea1e5"
};

// Firebase Initialize (duplicate prevent)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// =====================================================
// Anonymous Auth — Crash-Proof
// firebase-auth-compat.js లోడ్ కాకపోయినా యాప్ ఆగకూడదు
// =====================================================
let auth = null;
let authReady = Promise.resolve(false);

if (typeof firebase.auth === 'function') {
    try {
        auth = firebase.auth();
        authReady = auth.signInAnonymously()
            .then(() => {
                console.log("✅ Firebase Auth: Anonymous login successful!");
                return true;
            })
            .catch((error) => {
                console.warn("⚠️ Anonymous Auth failed:", error.code || error.message);
                return false;
            });
    } catch (err) {
        console.warn("⚠️ Firebase Auth init error:", err.message);
        authReady = Promise.resolve(false);
    }
} else {
    console.warn("⚠️ firebase-auth-compat.js NOT loaded. Auth disabled.");
}

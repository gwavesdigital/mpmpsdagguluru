// js/config.js

const firebaseConfig = {
  apiKey: "AIzaSyBUI0QbBUmiwZxkGgEFHTisK9ZCFmxN3Ok",
  authDomain: "mpmpsdagguluru.firebaseapp.com",
  projectId: "mpmpsdagguluru",
  storageBucket: "mpmpsdagguluru.firebasestorage.app",
  messagingSenderId: "442302836489",
  appId: "1:442302836489:web:90e30c176c302c723fadd8",
  measurementId: "G-4PM6CS40SZ"
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

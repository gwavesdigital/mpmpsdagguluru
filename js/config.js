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
const auth = firebase.auth();

// =====================================================
// Anonymous Auth Promise
// Firestore rules లో request.auth != null ఉంటే,
// డేటా రాసే ముందు auth పూర్తి కావాలి.
// వాడే చోట: await authReady;
// =====================================================
const authReady = auth.signInAnonymously()
    .then(() => {
        console.log("✅ Firebase Auth: Anonymous login successful!");
        return true;
    })
    .catch((error) => {
        console.error("❌ Firebase Auth Error:", error);
        return false;
    });

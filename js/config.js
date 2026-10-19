// js/config.js

// మీరు Firebase నుండి పంపిన కాన్ఫిగరేషన్
const firebaseConfig = {
  apiKey: "AIzaSyBUI0QbBUmiwZxkGgEFHTisK9ZCFmxN3Ok",
  authDomain: "mpmpsdagguluru.firebaseapp.com",
  projectId: "mpmpsdagguluru",
  storageBucket: "mpmpsdagguluru.firebasestorage.app",
  messagingSenderId: "442302836489",
  appId: "1:442302836489:web:90e30c176c302c723fadd8",
  measurementId: "G-4PM6CS40SZ"
};

// Initialize Firebase (Compat Version)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global variables (వీటిని మనం అన్ని చోట్లా వాడతాం)
const db = firebase.firestore();
const auth = firebase.auth();

console.log("Firebase Initialized Successfully for MP MPS Dagguluru!");

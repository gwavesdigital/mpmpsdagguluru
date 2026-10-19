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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// 👇 ఇది తప్పనిసరిగా ఉండాలి (Anonymous Login)
auth.signInAnonymously().then(() => {
    console.log("Firebase Auth: Anonymous login successful!");
}).catch((error) => {
    console.error("Firebase Auth Error:", error);
});

    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    import { getFirestore } from "firebase/firestore";
    import { getAuth,GoogleAuthProvider }from "firebase/auth";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyC8Rxa036Pgf_jacR3z2TkbBmHnZ7NWuRY",
    authDomain: "invitewave-75431.firebaseapp.com",
    projectId: "invitewave-75431",
    storageBucket: "invitewave-75431.firebasestorage.app",
    messagingSenderId: "599782109764",
    appId: "1:599782109764:web:ae9ba7e30f3672d9748211",
    measurementId: "G-2L1FYJTVHE"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    export const db = getFirestore(app);
    export const auth = getAuth(app);
    export const googleProvider = new GoogleAuthProvider();
    getAnalytics(app);
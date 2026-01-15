    import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    } from "firebase/auth";
    import { auth, googleProvider } from "../firebase/firebase";

    // SIGN UP
    export const signupEmail = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
    };

    // LOGIN
    export const loginEmail = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
    };

    // GOOGLE LOGIN
    export const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
    };

    // LOGOUT
    export const logout = async () => {
    await signOut(auth);
    };

    // LISTENER
    export const authListener = (callback) => {
    return onAuthStateChanged(auth, callback);
    };

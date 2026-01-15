    import {
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    getDocs,
    collection,
    serverTimestamp,
    } from "firebase/firestore";
    import { db } from "../firebase/firebase";

    // SAVE / UPDATE RSVP
    export const saveRSVP = async (eventId, userId, response) => {
    const rsvpRef = doc(db, "events", eventId, "rsvps", userId);

    await setDoc(rsvpRef, {
        response,         // "yes" | "maybe" | "no"
        userId,           // uid
        updatedAt: serverTimestamp(),
    });
    };

    // REMOVE RSVP
    export const removeRSVP = async (eventId, userId) => {
    const rsvpRef = doc(db, "events", eventId, "rsvps", userId);
    await deleteDoc(rsvpRef);
    };

    // GET RSVP COUNTS
    export const fetchRSVPCounts = async (eventId) => {
    const snapshot = await getDocs(collection(db, "events", eventId, "rsvps"));

    const counts = { yes: 0, maybe: 0, no: 0 };

    snapshot.forEach((snap) => {
        const { response } = snap.data();
        if (counts[response] !== undefined) counts[response]++;
    });

    return counts;
    };

    // GET USER RSVP (FAST ✅)
    export const fetchUserRSVP = async (eventId, userId) => {
    const rsvpRef = doc(db, "events", eventId, "rsvps", userId);
    const snap = await getDoc(rsvpRef);

    if (!snap.exists()) return null;

    return snap.data().response || null;
    };

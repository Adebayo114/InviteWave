    import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    } from "firebase/firestore";
    import { db } from "../firebase/firebase";

    const eventsRef = collection(db, "events");

    // CREATE
    export const createEvent = async (eventData) => {
    const docRef = await addDoc(eventsRef, {
        ...eventData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
    };

    // READ ALL (Explore)
    export const fetchEvents = async () => {
    const q = query(eventsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));
    };

    // READ ONE
    export const fetchEventById = async (id) => {
    const snap = await getDoc(doc(db, "events", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
    };

    // UPDATE
    export const updateEvent = async (id, updates) => {
    await updateDoc(doc(db, "events", id), updates);
    };

    // DELETE
    export const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
    };

    // ✅ MY EVENTS (Firestore)
    export const fetchMyEvents = async (userId) => {
    // easiest safe query (no index headache)
    const q = query(eventsRef, where("userId", "==", userId));
    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));

    // sort locally (optional)
    data.sort((a, b) => {
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds : 0;
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds : 0;
        return bTime - aTime;
    });

    return data;
    };

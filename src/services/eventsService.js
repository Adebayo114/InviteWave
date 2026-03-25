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
    Timestamp,
    getCountFromServer,
    } from "firebase/firestore";

    import { db } from "../firebase/firebase";

    // Use ONE collection name everywhere
    const eventsRef = collection(db, "Events");

    // CREATE
    export const createEvent = async (eventData) => {
    const docRef = await addDoc(eventsRef, {
        ...eventData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
    };

    // FEATURE TOGGLE
    export const setFeatured = async (eventId, value) => {
    await updateDoc(doc(db, "Events", eventId), { featured: value });
    };

    // helper: convert Firestore Timestamp to JS Date
    const toDate = (ts) => {
    if (!ts) return null;
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts?.seconds) return new Date(ts.seconds * 1000);
    return null;
    };

    const isExpired = (event) => {
    const exp = toDate(event.expiresAt);
    if (!exp) return false;
    return exp.getTime() <= Date.now();
    };

    // READ ALL (Explore)
    export const fetchEvents = async () => {
    const q = query(eventsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));

    return data.filter((e) => !isExpired(e));
    };

    // READ ONE
    export const fetchEventById = async (id) => {
    const snap = await getDoc(doc(db, "Events", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
    };

    // READ FEATURED ONLY
    export const fetchFeaturedEvents = async (limitCount = 6) => {
    const qy = query(eventsRef, where("featured", "==", true));
    const snap = await getDocs(qy);

    let data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));

    data = data.filter((e) => !isExpired(e));

    data.sort((a, b) => {
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds : 0;
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds : 0;
        return bTime - aTime;
    });

    return data.slice(0, limitCount);
    };

    // RECOMMENDED EVENTS
    export const fetchRecommendedEvents = async (
    category,
    currentEventId,
    limitCount = 6
    ) => {
    const qy = query(eventsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(qy);

    let data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));

    data = data.filter((e) => !isExpired(e));

    const cat = (category || "").toLowerCase();

    data = data
        .filter((e) => e.id !== currentEventId)
        .filter((e) => (e.category || "").toLowerCase() === cat);

    return data.slice(0, limitCount);
    };

    // UPDATE
    export const updateEvent = async (id, updates) => {
    await updateDoc(doc(db, "Events", id), updates);
    };

    // DELETE
    export const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "Events", id));
    };

    // MY EVENTS
    export const fetchMyEvents = async (userId) => {
    const qy = query(eventsRef, where("userId", "==", userId));
    const snap = await getDocs(qy);

    const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));

    const active = data.filter((e) => !isExpired(e));

    active.sort((a, b) => {
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds : 0;
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds : 0;
        return bTime - aTime;
    });

    return active;
    };

    // COUNT FEATURED EVENTS FOR A USER
    export const countMyFeaturedEvents = async (userId) => {
    const q = query(
        eventsRef,
        where("userId", "==", userId),
        where("featured", "==", true)
    );

    const snap = await getCountFromServer(q);
    return snap.data().count || 0;
    };
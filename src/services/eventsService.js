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
        limit,
        serverTimestamp,
        getCountFromServer,
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

        export const setFeatured = async (eventId, value) => {
    await updateDoc(doc(db, "events", eventId), { featured: value });
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

    // READ FEATURED ONLY
    export const fetchFeaturedEvents = async () => {
    const q = query(
        eventsRef,
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(6)
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));
    };


    // ✅ Recommended (by category, newest first)
    export const fetchRecommendedEvents = async (category, excludeId, max = 6) => {
    // if category exists: filter by category
    const q = category
        ? query(
            eventsRef,
            where("category", "==", category),
            orderBy("createdAt", "desc"),
            limit(max + 3) // grab extra so we can remove current event safely
        )
        : query(eventsRef, orderBy("createdAt", "desc"), limit(max + 3));

    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));

    // remove current event + trim to max
    return data.filter((e) => e.id !== excludeId).slice(0, max);
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

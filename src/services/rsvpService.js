    import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    serverTimestamp,
    } from "firebase/firestore";
    import { db } from "../firebase/firebase";

    // rsvps subcollection: Events/{eventId}/rsvps/{rsvpId}
    const rsvpRef = (eventId) => collection(db, "Events", eventId, "rsvps");

    // Get a stable anonymous id per device
    const getDeviceId = () => {
    let id = localStorage.getItem("invitewave_device_id");

    if (!id) {
        id = `dev_${Math.random().toString(36).slice(2)}_${Date.now()}`;
        localStorage.setItem("invitewave_device_id", id);
    }

    return id;
    };

    // RSVP doc id: use uid if logged in, else device id
    export const getMyRsvpId = (eventId, user) => {
    if (user?.uid) return `u_${user.uid}`;
    return `a_${getDeviceId()}_${eventId}`;
    };

    // Save RSVP (create/update)
    export const saveRSVP = async (eventId, rsvpId, data) => {
    const ref = doc(db, "Events", eventId, "rsvps", rsvpId);

    await setDoc(
        ref,
        {
        choice: data.choice, // "yes" | "maybe" | "no"
        name: data.name?.trim() || "",
        userId: data.userId || null,
        createdAt: serverTimestamp(),
        },
        { merge: true }
    );
    };

    // Remove RSVP
    export const removeRSVP = async (eventId, rsvpId) => {
    const ref = doc(db, "Events", eventId, "rsvps", rsvpId);
    await deleteDoc(ref);
    };

    // Get my RSVP choice
    export const fetchMyRSVPChoice = async (eventId, rsvpId) => {
    const ref = doc(db, "Events", eventId, "rsvps", rsvpId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data()?.choice || null;
    };

    // Get RSVP counts
    export const fetchRSVPCounts = async (eventId) => {
    const snap = await getDocs(rsvpRef(eventId));
    const counts = { yes: 0, maybe: 0, no: 0 };

    snap.forEach((d) => {
        const choice = d.data()?.choice;

        if (choice === "yes") counts.yes += 1;
        if (choice === "maybe") counts.maybe += 1;
        if (choice === "no") counts.no += 1;
    });

    return counts;
    };

    // Host-only guest list
    export const fetchRSVPListForHost = async (eventId) => {
    const snap = await getDocs(rsvpRef(eventId));

    const list = {
        yes: [],
        maybe: [],
        no: [],
    };

    snap.forEach((d) => {
        const data = d.data();

        const item = {
        id: d.id,
        name: data?.name?.trim() || "Guest",
        choice: data?.choice || "",
        };

        if (item.choice === "yes") list.yes.push(item);
        if (item.choice === "maybe") list.maybe.push(item);
        if (item.choice === "no") list.no.push(item);
    });

    list.yes.sort((a, b) => a.name.localeCompare(b.name));
    list.maybe.sort((a, b) => a.name.localeCompare(b.name));
    list.no.sort((a, b) => a.name.localeCompare(b.name));

    return list;
    };
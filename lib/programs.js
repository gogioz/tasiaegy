import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const PROGRAMS_COLLECTION = "programs";

/** @returns {Promise<import("@/types").Program[]>} */
export async function getPrograms() {
  const q = query(collection(db, PROGRAMS_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** @returns {Promise<import("@/types").Program | null>} */
export async function getProgram(id) {
  const ref = doc(db, PROGRAMS_COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** @returns {Promise<string>} */
export async function createProgram(data) {
  const ref = await addDoc(collection(db, PROGRAMS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProgram(id, data) {
  const ref = doc(db, PROGRAMS_COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProgram(id) {
  await deleteDoc(doc(db, PROGRAMS_COLLECTION, id));
}

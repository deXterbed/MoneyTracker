import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Expense } from "./types/expense";

const STORAGE_KEY = "expenses";

export const syncExpensesWithCloud = async (): Promise<Expense[]> => {
  let local: Expense[] = [];
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) local = JSON.parse(stored);
  } catch {}

  let remote: Expense[] = [];
  try {
    const snapshot = await getDocs(collection(db, "expenses"));
    remote = snapshot.docs
      .map((docSnap) => {
        const data = docSnap.data() as Partial<Expense>;
        if (data.amount && data.date && data.time && data.category) {
          return {
            id: docSnap.id,
            amount: data.amount,
            description: data.description || "",
            date: data.date,
            time: data.time,
            category: data.category,
          } as Expense;
        }
        return null;
      })
      .filter((exp): exp is Expense => exp !== null);
  } catch {}

  const mergedMap = new Map<string, Expense>();
  remote.forEach((exp) => mergedMap.set(exp.id, exp));
  local.forEach((exp) => mergedMap.set(exp.id, exp)); // local overwrites remote
  const merged = Array.from(mergedMap.values());

  if (
    merged.length !== local.length ||
    merged.some((exp, i) => JSON.stringify(exp) !== JSON.stringify(local[i]))
  ) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  const remoteIds = new Set(remote.map((e) => e.id));
  const mergedIds = new Set(merged.map((e) => e.id));
  for (const exp of merged) {
    if (
      !remoteIds.has(exp.id) ||
      JSON.stringify(remote.find((e) => e.id === exp.id)) !==
        JSON.stringify(exp)
    ) {
      await setDoc(doc(db, "expenses", exp.id), exp, { merge: true });
    }
  }
  for (const exp of remote) {
    if (!mergedIds.has(exp.id)) {
      await deleteDoc(doc(db, "expenses", exp.id));
    }
  }
  return merged;
};

export const addExpenseCloudSynced = async (expense: Expense) => {
  let local: Expense[] = [];
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) local = JSON.parse(stored);
  } catch {}
  const updated = [...local, expense];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  await setDoc(doc(db, "expenses", expense.id), expense, { merge: true });
  return updated;
};

export const updateExpenseCloudSynced = async (expense: Expense) => {
  let local: Expense[] = [];
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) local = JSON.parse(stored);
  } catch {}
  const updated = local.map((exp) => (exp.id === expense.id ? expense : exp));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  await setDoc(doc(db, "expenses", expense.id), expense, { merge: true });
  return updated;
};

export const deleteExpenseCloudSynced = async (id: string) => {
  let local: Expense[] = [];
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) local = JSON.parse(stored);
  } catch {}
  const updated = local.filter((exp) => exp.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  await deleteDoc(doc(db, "expenses", id));
  return updated;
};

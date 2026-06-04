import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const getProducts = async () => {
 try {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("isActive", "==", true));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
   const data = doc.data();

   return {
    _id: doc.id,
    id: doc.id,
    ...data,
    // The Fix: Convert complex Firestore Timestamps to plain numbers
    createdAt: data.createdAt ? data.createdAt.toMillis() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toMillis() : null,
   };
  });
 } catch (error) {
  console.error("Error fetching products from Firestore:", error);
  return [];
 }
};

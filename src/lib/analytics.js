import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function updateAnalytics(orderData) {
 const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
 const dailyRef = db
  .collection("analytics")
  .doc("daily")
  .collection(dateStr)
  .doc("stats");

 await dailyRef.set(
  {
   totalRevenue: FieldValue.increment(orderData.total),
   totalOrders: FieldValue.increment(1),
  },
  { merge: true },
 );
}

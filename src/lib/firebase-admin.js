import * as admin from "firebase-admin";

if (!admin.apps.length) {
 const projectId = process.env.FIREBASE_PROJECT_ID;
 const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
 const privateKey = process.env.FIREBASE_PRIVATE_KEY;

 if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
   "Missing Firebase Env Variables! Check your .env.local file.",
  );
 }

 admin.initializeApp({
  credential: admin.credential.cert({
   projectId: projectId,
   clientEmail: clientEmail,
   privateKey: privateKey.replace(/\\n/g, "\n"),
  }),
 });
}

export const db = admin.firestore();

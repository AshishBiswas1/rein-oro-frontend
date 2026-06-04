import { auth, db } from "./firebase";
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const signUp = async (email, password, name) => {
 const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password,
 );
 const user = userCredential.user;

 // This ensures the profile is created the moment they sign up!
 await setDoc(doc(db, "customers", user.uid), {
  uid: user.uid,
  name: name,
  email: email,
  role: "customer",
  createdAt: new Date(),
 });

 return user;
};

export const login = async (email, password) => {
 return await signInWithEmailAndPassword(auth, email, password);
};

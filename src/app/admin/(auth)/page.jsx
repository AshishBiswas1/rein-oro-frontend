"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const router = useRouter();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(false);

  try {
   // 1. Authenticate with Firebase
   const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
   );

   // 2. Fetch privilege flag from Firestore
   const docRef = doc(db, "customers", userCredential.user.uid);
   const docSnap = await getDoc(docRef);

   if (docSnap.exists() && docSnap.data().role === "admin") {
    // Clearances passed -> route deep into protected group
    router.push("/admin/dashboard");
   } else {
    setError("Access Denied: Revoked administrative privileges.");
    await auth.signOut();
   }
  } catch (err) {
   setError("Invalid administrative credentials.");
   console.error(err);
  } finally {
   setLoading(false);
  }
 };

 return (
  <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
   <div className="w-full max-w-md bg-[#111111] border border-[#1C1A16] p-10 rounded-sm">
    <div className="text-center mb-8">
     <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] block mb-2 font-medium">
      Administrative Vault
     </span>
     <h1 className="font-display text-3xl text-[#F5EDD6] italic">
      Gatekeeper Secure Sign-In
     </h1>
    </div>

    <form onSubmit={handleLogin} className="space-y-6">
     <div>
      <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
       Admin Email
      </label>
      <input
       type="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
       required
      />
     </div>

     <div>
      <label className="block text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] mb-2">
       Security Password
      </label>
      <input
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       className="w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui py-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
       required
      />
     </div>

     {error && (
      <p className="text-red-500 text-xs font-ui tracking-wide">{error}</p>
     )}

     <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] font-ui font-semibold text-[11px] tracking-[0.2em] uppercase py-4 rounded-sm hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] transition-all disabled:opacity-50"
     >
      {loading ? "Decrypting Credentials..." : "Request Access Token"}
     </button>
    </form>
   </div>
  </main>
 );
}

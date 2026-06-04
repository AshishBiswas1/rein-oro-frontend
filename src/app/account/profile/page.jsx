"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
 doc,
 getDoc,
 collection,
 query,
 where,
 orderBy,
 limit,
 getDocs,
} from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ProfilePage() {
 const [userProfile, setUserProfile] = useState(null);
 const [orders, setOrders] = useState([]);
 const [reviews, setReviews] = useState([]);
 const [loading, setLoading] = useState(true);
 const router = useRouter();

 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
   if (!user) {
    router.push("/account");
   } else {
    try {
     // 1. Fetch User Profile
     const docRef = doc(db, "customers", user.uid);
     const docSnap = await getDoc(docRef);
     if (docSnap.exists()) setUserProfile(docSnap.data());

     // 2. Fetch Recent Orders
     const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(3),
     );
     const ordersSnap = await getDocs(ordersQuery);
     setOrders(ordersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

     // 3. Fetch User Reviews
     const reviewsQuery = query(
      collection(db, "reviews"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
     );
     const reviewsSnap = await getDocs(reviewsQuery);
     setReviews(reviewsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
     console.error("Firestore error:", err);
    } finally {
     setLoading(false);
    }
   }
  });
  return () => unsubscribe();
 }, [router]);

 const handleSignOut = async () => {
  await auth.signOut();
  router.push("/");
 };

 if (loading) {
  return (
   <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse">
     Accessing Client Details...
    </div>
   </main>
  );
 }

 if (!userProfile) return null;

 return (
  <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] pb-24">
   <Navbar />

   <div className="max-w-7xl mx-auto px-6 pt-32">
    <header className="mb-16 border-b border-[#1C1A16] pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
     <div>
      <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[11px] mb-4 block font-medium">
       Client Profile
      </span>
      <h1 className="font-display text-[clamp(40px,5vw,56px)] leading-none">
       Welcome, <br className="md:hidden" />
       <span className="italic text-[#E8C97A]">{userProfile.name}</span>
      </h1>
     </div>
     <div className="text-right">
      <p className="text-[#9A9485] font-ui text-sm mb-2">Registry Email</p>
      <p className="text-[#F5EDD6]">{userProfile.email}</p>
     </div>
    </header>

    <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
     {/* Left Column: Actions */}
     <div className="space-y-4">
      <div className="bg-[#111111] border border-[#1C1A16] p-8">
       <h3 className="text-[#C9A84C] font-bold uppercase tracking-[0.2em] text-[11px] mb-6">
        Account Settings
       </h3>
       <ul className="space-y-4 font-ui text-[#9A9485]">
        <li>
         <Link
          href="/account/profile"
          className="text-[#F5EDD6] hover:text-[#C9A84C] transition-colors"
         >
          Profile Overview
         </Link>
        </li>
        <li>
         <Link
          href="/account/addresses"
          className="hover:text-[#C9A84C] transition-colors block"
         >
          Manage Addresses
         </Link>
        </li>
       </ul>
       <div className="mt-8 pt-8 border-t border-[#1C1A16]">
        <button
         onClick={handleSignOut}
         className="text-red-500/80 hover:text-red-500 text-[11px] uppercase tracking-widest transition-colors"
        >
         Sign Out
        </button>
       </div>
      </div>
     </div>

     {/* Right Column: Dashboard Data */}
     <div className="space-y-12">
      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 gap-4">
       <div className="border border-[#1C1A16] p-6 bg-[#0A0A0A]">
        <div className="text-[#9A9485] text-[10px] uppercase tracking-widest mb-2">
         Total Orders
        </div>
        <div className="font-display text-3xl text-[#F5EDD6]">
         {orders.length}
        </div>
       </div>
       <div className="border border-[#1C1A16] p-6 bg-[#0A0A0A]">
        <div className="text-[#9A9485] text-[10px] uppercase tracking-widest mb-2">
         Member Since
        </div>
        <div className="font-ui text-lg text-[#F5EDD6]">
         {userProfile.createdAt
          ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString()
          : "Today"}
        </div>
       </div>
      </div>

      {/* My Reviews Section */}
      <div className="border border-[#1C1A16] p-8">
       <h2 className="font-display text-2xl text-[#F5EDD6] mb-8">My Reviews</h2>
       {reviews.length === 0 ? (
        <p className="text-[#9A9485] text-sm">No reviews submitted yet.</p>
       ) : (
        <div className="space-y-4">
         {reviews.map((review) => (
          <div
           key={review.id}
           className="p-5 border border-[#1C1A16] bg-[#0E0E0E]"
          >
           <div className="flex justify-between items-start mb-2">
            <p className="text-[#C9A84C] font-bold text-sm">
             Rating: {review.rating}/5
            </p>
            <span className="text-[#4A4640] text-[10px] uppercase">
             {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}
            </span>
           </div>
           <p className="text-[#F5EDD6] text-sm italic">"{review.comment}"</p>
          </div>
         ))}
        </div>
       )}
      </div>

      {/* Recent Acquisitions */}
      <div className="border border-[#1C1A16] p-8">
       <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-2xl text-[#F5EDD6]">
         Recent Acquisitions
        </h2>
       </div>
       {orders.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#1C1A16]">
         <p className="text-[#9A9485] font-ui">No recent orders found.</p>
         <Link
          href="/shop"
          className="inline-block mt-4 text-[#C9A84C] text-[11px] uppercase tracking-[0.2em] hover:text-[#F5EDD6] transition-colors"
         >
          Explore the Collection →
         </Link>
        </div>
       ) : (
        <div className="space-y-4">
         {orders.map((order) => (
          <div
           key={order.id}
           className="flex flex-col sm:flex-row justify-between sm:items-center p-5 border border-[#1C1A16] bg-[#0E0E0E]"
          >
           <div>
            <p className="text-[#C9A84C] font-accent text-sm mb-1 tracking-wider">
             Order #{order.id.slice(-6).toUpperCase()}
            </p>
            <p className="text-[#9A9485] text-[10px] uppercase tracking-widest">
             {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
           </div>
           <div className="mt-4 sm:mt-0 text-right">
            <p className="text-[#F5EDD6] text-[15px]">
             ₹{order.total?.toFixed(2) || "0.00"}
            </p>
           </div>
          </div>
         ))}
        </div>
       )}
      </div>
     </div>
    </div>
   </div>
  </main>
 );
}

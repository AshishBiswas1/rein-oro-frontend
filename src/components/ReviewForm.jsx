"use client";
import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Star } from "phosphor-react";

export default function ReviewForm({ productId }) {
 const [rating, setRating] = useState(0);
 const [comment, setComment] = useState("");
 const [status, setStatus] = useState("Idle");

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!auth.currentUser) return alert("Please sign in to review.");

  try {
   setStatus("Submitting...");
   await addDoc(collection(db, "reviews"), {
    productId,
    userId: auth.currentUser.uid,
    userName: auth.currentUser.displayName || "Anonymous",
    rating,
    comment,
    createdAt: serverTimestamp(),
   });
   setComment("");
   setRating(0);
   setStatus("Submitted!");
  } catch (error) {
   console.error(error);
   setStatus("Error");
  }
 };

 return (
  <form
   onSubmit={handleSubmit}
   className="p-4 sm:p-6 bg-[#111111] border border-[#1C1A16] mt-8"
  >
   <h3 className="text-[#F5EDD6] font-display text-base sm:text-lg mb-4">
    Write a Review
   </h3>

   {/* Star Rating Selection */}
   <div className="flex gap-2 mb-4 flex-wrap">
    {[1, 2, 3, 4, 5].map((star) => (
     <button
      key={star}
      type="button"
      onClick={() => setRating(star)}
      className={star <= rating ? "text-[#C9A84C]" : "text-[#4A4640]"}
     >
      <Star size={22} weight="fill" />
     </button>
    ))}
   </div>

   <textarea
    className="w-full bg-[#0A0A0A] border border-[#1C1A16] p-3 text-[#F5EDD6] mb-4 min-h-[120px]"
    placeholder="Share your experience..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    required
   />

   <button
    type="submit"
    className="bg-[#C9A84C] text-[#0A0A0A] px-6 py-3 uppercase text-[11px] font-bold tracking-widest w-full sm:w-auto"
   >
    {status === "Idle" ? "Post Review" : status}
   </button>
  </form>
 );
}

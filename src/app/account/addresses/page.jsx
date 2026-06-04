"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeft } from "phosphor-react";

export default function ManageAddresses() {
 const [addresses, setAddresses] = useState([]);
 const [loading, setLoading] = useState(true);
 const [form, setForm] = useState({
  line1: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
 });
 const [editingIndex, setEditingIndex] = useState(null);

 useEffect(() => {
  const fetchAddresses = async () => {
   if (!auth.currentUser) return;
   const docRef = doc(db, "customers", auth.currentUser.uid);
   const snap = await getDoc(docRef);
   if (snap.exists()) {
    setAddresses(snap.data().addresses || []);
   }
   setLoading(false);
  };
  fetchAddresses();
 }, []);

 const saveAddress = async (e) => {
  e.preventDefault();
  let updated = [...addresses];

  // If editing, replace; if new, push
  if (editingIndex !== null) {
   updated[editingIndex] = form;
  } else {
   updated.push(form);
  }

  // Logic for "Primary": If this is the first address, automatically make it primary
  if (updated.length === 1) updated[0].isDefault = true;

  await updateDoc(doc(db, "customers", auth.currentUser.uid), {
   addresses: updated,
  });

  setAddresses(updated);
  resetForm();
 };

 const resetForm = () => {
  setForm({ line1: "", city: "", state: "", pincode: "", isDefault: false });
  setEditingIndex(null);
 };

 const deleteAddress = async (index) => {
  const updated = addresses.filter((_, i) => i !== index);
  // If the deleted address was primary, reset primary status to the new first item
  if (addresses[index].isDefault && updated.length > 0) {
   updated[0].isDefault = true;
  }
  await updateDoc(doc(db, "customers", auth.currentUser.uid), {
   addresses: updated,
  });
  setAddresses(updated);
 };

 const setPrimary = async (index) => {
  const updated = addresses.map((addr, i) => ({
   ...addr,
   isDefault: i === index,
  }));
  await updateDoc(doc(db, "customers", auth.currentUser.uid), {
   addresses: updated,
  });
  setAddresses(updated);
 };

 if (loading) return <div className="text-[#9A9485] p-8">Loading...</div>;

 return (
  <div className="pt-24 sm:pt-32 min-h-screen max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24 relative z-10">
   <div className="space-y-8 animate-in fade-in duration-300">
    <Link
     href="/account/profile"
     className="relative z-50 flex items-center gap-2 text-[#9A9485] hover:text-[#C9A84C] transition-colors text-xs uppercase tracking-widest cursor-pointer"
    >
     <ArrowLeft size={16} /> Back to Profile
    </Link>

    <h2 className="text-xl sm:text-2xl font-display text-[#F5EDD6] italic">
     Manage Addresses
    </h2>

    {/* Form */}
    <form
     onSubmit={saveAddress}
     className="relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 bg-[#111111] border border-[#1C1A16]"
    >
     <input
      placeholder="Address Line 1"
      value={form.line1}
      className="sm:col-span-2 bg-[#0A0A0A] border border-[#1C1A16] p-3 text-[#F5EDD6] focus:border-[#C9A84C] outline-none"
      required
      onChange={(e) => setForm({ ...form, line1: e.target.value })}
     />
     <input
      placeholder="City"
      value={form.city}
      className="bg-[#0A0A0A] border border-[#1C1A16] p-3 text-[#F5EDD6] focus:border-[#C9A84C] outline-none"
      required
      onChange={(e) => setForm({ ...form, city: e.target.value })}
     />
     <input
      placeholder="State"
      value={form.state}
      className="bg-[#0A0A0A] border border-[#1C1A16] p-3 text-[#F5EDD6] focus:border-[#C9A84C] outline-none"
      required
      onChange={(e) => setForm({ ...form, state: e.target.value })}
     />
     <input
      placeholder="Pincode"
      value={form.pincode}
      className="sm:col-span-2 bg-[#0A0A0A] border border-[#1C1A16] p-3 text-[#F5EDD6] focus:border-[#C9A84C] outline-none"
      required
      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
     />
     <button
      type="submit"
      className="sm:col-span-2 bg-[#C9A84C] py-3 uppercase text-xs font-bold hover:bg-[#E8C97A] transition-colors"
     >
      {editingIndex !== null ? "Update Address" : "Save New Address"}
     </button>
     {editingIndex !== null && (
      <button
       type="button"
       onClick={resetForm}
       className="col-span-2 bg-[#1C1A16] py-3 uppercase text-xs text-[#9A9485] hover:text-[#F5EDD6] transition-colors"
      >
       Cancel Edit
      </button>
     )}
    </form>

    {/* List */}
    <div className="grid gap-4">
     {addresses.map((addr, i) => (
      <div
       key={i}
       className={`p-4 sm:p-6 border ${addr.isDefault ? "border-[#C9A84C]" : "border-[#1C1A16]"} bg-[#111111] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}
      >
       <div>
        <p className="text-[#F5EDD6] text-sm">{addr.line1}</p>
        <p className="text-[#9A9485] text-xs mt-1">
         {addr.city}, {addr.state} - {addr.pincode}
        </p>
        {addr.isDefault && (
         <span className="text-[#C9A84C] text-[9px] uppercase tracking-widest mt-2 block">
          Primary Address
         </span>
        )}
       </div>
       <div className="flex flex-wrap gap-4">
        {!addr.isDefault && (
         <button
          onClick={() => setPrimary(i)}
          className="text-[#9A9485] hover:text-[#C9A84C] text-xs uppercase"
         >
          Set Primary
         </button>
        )}
        <button
         onClick={() => {
          setForm(addr);
          setEditingIndex(i);
         }}
         className="text-[#9A9485] hover:text-[#F5EDD6] text-xs uppercase"
        >
         Edit
        </button>
        <button
         onClick={() => deleteAddress(i)}
         className="text-[#C9A84C] hover:underline text-xs uppercase"
        >
         Delete
        </button>
       </div>
      </div>
     ))}
    </div>
   </div>
  </div>
 );
}

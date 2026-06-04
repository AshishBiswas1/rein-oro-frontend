"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Users, EnvelopeSimple, MapPin, User } from "phosphor-react";

export default function CustomersPage() {
 const [customers, setCustomers] = useState([]);
 const [loading, setLoading] = useState(true);

 // Fetch Customers from Firestore (Filtered by role: "customer")
 const fetchCustomers = async () => {
  try {
   const q = query(
    collection(db, "customers"),
    where("role", "==", "customer"),
   );
   const querySnapshot = await getDocs(q);

   const customerList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
   }));

   // Sort manually by creation date (newest first)
   customerList.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
    return dateB - dateA;
   });

   setCustomers(customerList);
  } catch (error) {
   console.error("Failed to fetch client ledger:", error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchCustomers();
 }, []);

 // Helper to safely format dates
 const formatDate = (timestamp) => {
  if (!timestamp) return "Legacy Patron";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("en-IN", {
   month: "short",
   year: "numeric",
  }).format(date);
 };

 // Helper to get the default location
 const getDefaultLocation = (addresses) => {
  if (!addresses || addresses.length === 0) return "No address on file";
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  return `${defaultAddress.city || "Unknown City"}, ${defaultAddress.state || ""}`;
 };

 if (loading) {
  return (
   <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse font-ui">
     Accessing Patron Registry...
    </div>
   </div>
  );
 }

 return (
  <div className="space-y-8 animate-in fade-in duration-300">
   {/* Header Section */}
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-[#1C1A16]">
    <div>
     <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] mb-2 block font-medium">
      Clientele
     </span>
     <h1 className="text-3xl text-[#F5EDD6] font-display italic">
      Patron Registry
     </h1>
    </div>
    <div className="text-[#9A9485] font-ui text-[11px] uppercase tracking-[0.2em] bg-[#111111] px-4 py-2 border border-[#1C1A16] rounded-sm">
     Total Patrons: {customers.length}
    </div>
   </div>

   {/* Customers Data Table (Read-Only) */}
   <div className="bg-[#111111] border border-[#1C1A16] rounded-sm overflow-hidden shadow-2xl">
    <div className="overflow-x-auto">
     <table className="w-full text-left border-collapse">
      <thead>
       <tr className="bg-[#0A0A0A] border-b border-[#1C1A16]">
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Patron Identity
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Contact Dossier
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Primary Territory
        </th>
       </tr>
      </thead>
      <tbody className="divide-y divide-[#1C1A16]">
       {customers.length === 0 ? (
        <tr>
         <td colSpan="3" className="p-16 text-center">
          <Users size={32} className="text-[#4A4640] mx-auto mb-4" />
          <p className="text-[#9A9485] font-ui text-sm uppercase tracking-widest">
           No patrons found in the registry.
          </p>
         </td>
        </tr>
       ) : (
        customers.map((customer) => (
         <tr key={customer.id} className="hover:bg-[#141414] transition-colors">
          {/* Patron Identity Column */}
          <td className="p-6">
           <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0A0A0A] border border-[#1C1A16] rounded-sm flex items-center justify-center shrink-0 text-[#4A4640]">
             <User size={18} />
            </div>
            <div>
             <p className="text-[#F5EDD6] font-display text-lg tracking-wide capitalize">
              {customer.name || "Unnamed Patron"}
             </p>
             <p className="text-[#9A9485] font-ui text-[9px] uppercase tracking-widest mt-1">
              Joined: {formatDate(customer.createdAt)}
             </p>
            </div>
           </div>
          </td>

          {/* Contact Column */}
          <td className="p-6">
           <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#F5EDD6] font-ui text-sm">
             <EnvelopeSimple size={14} className="text-[#C9A84C]" />
             <span>{customer.email || "No Email"}</span>
            </div>
            {customer.phone && (
             <div className="flex items-center gap-2 text-[#9A9485] font-ui text-xs">
              <span className="text-[#4A4640] text-[9px] uppercase tracking-widest">
               TEL:
              </span>
              <span>{customer.phone}</span>
             </div>
            )}
           </div>
          </td>

          {/* Territory/Location Column */}
          <td className="p-6">
           <div className="flex items-center gap-2 text-[#9A9485] font-ui text-sm">
            <MapPin size={14} className="text-[#4A4640]" />
            <span className="truncate max-w-[250px]">
             {getDefaultLocation(customer.addresses)}
            </span>
           </div>
          </td>
         </tr>
        ))
       )}
      </tbody>
     </table>
    </div>
   </div>
  </div>
 );
}

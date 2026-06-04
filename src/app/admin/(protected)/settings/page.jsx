"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
 GearSix,
 CheckCircle,
 CircleNotch,
 Storefront,
 EnvelopeSimple,
 Phone,
} from "phosphor-react";

export default function SettingsPage() {
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [settings, setSettings] = useState({
  shopName: "",
  contactEmail: "",
  contactPhone: "",
  razorpayKey: "",
  maintenanceMode: false,
 });

 useEffect(() => {
  const fetchSettings = async () => {
   try {
    const docRef = doc(db, "admin", "global-settings");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
     setSettings(docSnap.data());
    }
   } catch (error) {
    console.error("Failed to load settings:", error);
   } finally {
    setLoading(false);
   }
  };
  fetchSettings();
 }, []);

 const handleSave = async () => {
  setSaving(true);
  try {
   const docRef = doc(db, "admin", "global-settings");
   await updateDoc(docRef, settings);
   alert("Configuration updated successfully.");
  } catch (error) {
   console.error("Save error:", error);
   alert("Failed to update configurations.");
  } finally {
   setSaving(false);
  }
 };

 if (loading) {
  return (
   <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse font-ui">
     Loading Vault Configuration...
    </div>
   </div>
  );
 }

 return (
  <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
   {/* Header */}
   <div className="pb-6 border-b border-[#1C1A16]">
    <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] mb-2 block font-medium">
     Administration
    </span>
    <h1 className="text-3xl text-[#F5EDD6] font-display italic">
     Vault Settings
    </h1>
   </div>

   {/* Settings Form */}
   <div className="bg-[#111111] border border-[#1C1A16] rounded-sm p-8 space-y-8">
    {/* Shop Identity */}
    <div className="space-y-6">
     <h3 className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
      <Storefront size={16} /> Shop Identity
     </h3>
     <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
       <label className="text-[#4A4640] text-[9px] uppercase tracking-widest font-ui">
        Shop Name
       </label>
       <input
        value={settings.shopName}
        onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
        className="w-full bg-[#0A0A0A] border border-[#1C1A16] px-4 py-3 text-[#F5EDD6] focus:border-[#C9A84C] outline-none transition-all"
       />
      </div>
      <div className="space-y-2">
       <label className="text-[#4A4640] text-[9px] uppercase tracking-widest font-ui">
        Support Email
       </label>
       <input
        value={settings.contactEmail}
        onChange={(e) =>
         setSettings({ ...settings, contactEmail: e.target.value })
        }
        className="w-full bg-[#0A0A0A] border border-[#1C1A16] px-4 py-3 text-[#F5EDD6] focus:border-[#C9A84C] outline-none transition-all"
       />
      </div>
     </div>
    </div>

    {/* Financial Configuration */}
    <div className="space-y-6">
     <h3 className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
      <GearSix size={16} /> Gateway Configuration
     </h3>
     <div className="space-y-2">
      <label className="text-[#4A4640] text-[9px] uppercase tracking-widest font-ui">
       Razorpay Public Key ID
      </label>
      <input
       value={settings.razorpayKey}
       onChange={(e) =>
        setSettings({ ...settings, razorpayKey: e.target.value })
       }
       className="w-full bg-[#0A0A0A] border border-[#1C1A16] px-4 py-3 text-[#F5EDD6] focus:border-[#C9A84C] outline-none transition-all font-mono"
      />
     </div>
    </div>

    {/* System Toggles */}
    <div className="pt-6 border-t border-[#1C1A16] flex items-center justify-between">
     <div className="space-y-1">
      <h3 className="text-[#F5EDD6] text-sm">Maintenance Mode</h3>
      <p className="text-[#4A4640] text-[10px] uppercase tracking-widest">
       Disable store checkout temporarily.
      </p>
     </div>
     <button
      onClick={() =>
       setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })
      }
      className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? "bg-[#C9A84C]" : "bg-[#1C1A16]"}`}
     >
      <div
       className={`w-4 h-4 rounded-full bg-[#F5EDD6] absolute top-1 transition-all ${settings.maintenanceMode ? "left-7" : "left-1"}`}
      />
     </button>
    </div>

    {/* Save Action */}
    <button
     onClick={handleSave}
     disabled={saving}
     className="w-full bg-[#C9A84C] text-[#0A0A0A] font-semibold text-[11px] uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-[#E8C97A] transition-all flex items-center justify-center gap-2"
    >
     {saving ? (
      <>
       <CircleNotch size={14} className="animate-spin" /> Saving
       Configuration...
      </>
     ) : (
      <>
       <CheckCircle size={14} /> Commit Changes
      </>
     )}
    </button>
   </div>
  </div>
 );
}

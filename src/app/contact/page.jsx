"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function ContactPage() {
 const [formData, setFormData] = useState({
  name: "",
  email: "",
  subject: "",
  message: "",
 });

 const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 return (
  <main className="bg-[#0A0A0A] min-h-screen text-[#F5EDD6]">
   <Navbar />

   {/* Decorative Background Glow */}
   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A84C]/10 via-transparent to-transparent pointer-events-none" />

   <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-20 items-start">
     {/* Left Column: The Concierge / Info */}
     <div className="lg:sticky lg:top-32 pr-8">
      <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[11px] mb-6 block font-medium">
       Private Concierge
      </span>
      <h1 className="font-display text-[clamp(40px,5vw,64px)] leading-[1.05] mb-8">
       At Your <br /> <span className="italic text-[#E8C97A]">Service.</span>
      </h1>
      <p className="text-[#9A9485] text-[16px] leading-[1.9] font-ui font-light mb-12 max-w-md">
       Whether you are inquiring about corporate gifting, wholesale
       partnerships, or require assistance with an existing order, our dedicated
       concierge is here to assist you with uncompromising care.
      </p>

      <div className="space-y-8 border-t border-[#1C1A16] pt-10">
       <ContactDetail label="Direct Inquiries" value="concierge@reinoro.com" />
       <ContactDetail label="Telephone" value="+91 99999 00000" />
       <ContactDetail
        label="Headquarters"
        value="Haridwar, Uttarakhand, India"
       />
      </div>
     </div>

     {/* Right Column: Minimalist Form */}
     <div className="bg-[#111111] border border-[#1C1A16] p-10 md:p-16">
      <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
       <div className="grid md:grid-cols-2 gap-12">
        <FloatingInput
         label="Full Name"
         name="name"
         value={formData.name}
         onChange={handleChange}
        />
        <FloatingInput
         label="Email Address"
         name="email"
         type="email"
         value={formData.email}
         onChange={handleChange}
        />
       </div>

       <FloatingInput
        label="Subject of Inquiry"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
       />

       {/* Floating Textarea */}
       <div className="relative group">
        <textarea
         id="message"
         name="message"
         rows="5"
         value={formData.message}
         onChange={handleChange}
         placeholder=" "
         className="peer w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui pt-5 pb-2 text-[15px] focus:outline-none focus:border-[#C9A84C] transition-colors resize-none placeholder-transparent"
        />
        <label
         htmlFor="message"
         className="absolute left-0 text-[#9A9485] font-ui text-[11px] uppercase tracking-[0.2em] transition-all duration-300 pointer-events-none
                             top-0 peer-placeholder-shown:top-5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:tracking-wider
                             peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.2em] peer-focus:text-[#C9A84C]"
        >
         Your Message
        </label>
       </div>

       <button className="w-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] py-5 font-bold tracking-[0.2em] uppercase text-[12px] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all mt-4">
        Send Inquiry
       </button>
      </form>
     </div>
    </div>
   </div>
  </main>
 );
}

// Reusable Minimalist Floating Input
function FloatingInput({ label, name, type = "text", value, onChange }) {
 return (
  <div className="relative group">
   <input
    id={name}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder=" "
    className="peer w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui pt-5 pb-2 text-[15px] focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-transparent"
   />
   <label
    htmlFor={name}
    className="absolute left-0 text-[#9A9485] font-ui text-[11px] uppercase tracking-[0.2em] transition-all duration-300 pointer-events-none
                   top-0 peer-placeholder-shown:top-5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:tracking-wider
                   peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.2em] peer-focus:text-[#C9A84C]"
   >
    {label}
   </label>
  </div>
 );
}

// Refined Contact Detail Block
function ContactDetail({ label, value }) {
 return (
  <div className="group">
   <div className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2 font-medium">
    {label}
   </div>
   <div className="text-[16px] text-[#F5EDD6] font-ui hover:text-[#C9A84C] transition-colors cursor-default">
    {value}
   </div>
  </div>
 );
}
